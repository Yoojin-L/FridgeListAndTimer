
window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	todos1 = JSON.parse(localStorage.getItem('todos1')) || [];
	todos2 = JSON.parse(localStorage.getItem('todos2')) || [];
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');

	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);

	})

	newTodoForm.addEventListener('submit', e => {

		e.preventDefault();

		if (((e.target.elements.content.value) == '')) {
			window.alert("Oops, Item Name was left empty");
		} else if ((isNaN(e.target.elements.expiry.value)) || ((e.target.elements.expiry.value) == '')) {
			window.alert("Oops, Days Left did not have valid input");
		} else {

			// No errors, then new item is added to its respective list, and form is reset to empty

			if((isNaN(e.target.elements.daysSince.value)) || ((e.target.elements.daysSince.value) == '')) {
				e.target.elements.daysSince.value = 0;
			}

			const todo = {
				content: e.target.elements.content.value,
				category: e.target.elements.category.value,
				done: false,
				createdAt: new Date().getTime() - ((e.target.elements.daysSince.value) * 86400000 ),
				expiryDays: (e.target.elements.expiry.value * 1) + (e.target.elements.daysSince.value * 1),
				expiry: (((e.target.elements.expiry.value) * 86400000 ) + new Date().getTime()),
				quotient: 1,
			}
	
	
			
			if (e.target.elements.category.value == 'list0'){
				todos.push(todo);
				localStorage.setItem('todos', JSON.stringify(todos));
				
			}
			else if (e.target.elements.category.value == 'list1'){
				todos1.push(todo);
				localStorage.setItem('todos1', JSON.stringify(todos1));
			}
			else {
				todos2.push(todo);
				localStorage.setItem('todos2', JSON.stringify(todos2));
			}


			// Reset the form
			e.target.reset();

		}



		DisplayTodos(todos, '#todo-list', 'todos');
		DisplayTodos(todos1, '#todo-list1', 'todos1');
		DisplayTodos(todos2, '#todo-list2', 'todos2')

	})

	DisplayTodos(todos, '#todo-list', 'todos');
	DisplayTodos(todos1, '#todo-list1', 'todos1');
	DisplayTodos(todos2, '#todo-list2', 'todos2')
})




function DisplayTodos (listName, htmlVal, storageName) {

	const todoList = document.querySelector(htmlVal);
	todoList.innerHTML = "";


	listName.forEach(todo => {

		todo.quotient = ((todo.expiry - new Date().getTime()) / (todo.expiry - todo.createdAt));

	})

	listName.sort(function (a, b) {
		return a.quotient - b.quotient;
	  }).forEach(todo => {

		todo.quotient = ((todo.expiry - new Date().getTime()) / (todo.expiry - todo.createdAt));

		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		const label = document.createElement('label');
		
		const progress = document.createElement('label');

		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const expiry = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');


		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble');
		if (todo.category == 'list0') {
			span.classList.add('list0');
		} else if (todo.category == 'list1') {
			span.classList.add('list1');
		}
		else {
			span.classList.add('list2');
		}
		content.classList.add('todo-content');
		expiry.classList.add('expiry');
		actions.classList.add('actions');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');

		progress.classList.add('progress');

		if (todo.quotient < 0) {
			var progressVal = 100;
			progress.style.backgroundColor = `var(--danger)`;
		}
		else {
			var progressVal = ((1 - todo.quotient) * 100) / 1;
		}

		progress.style.width = `${progressVal}%`;
		

		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;



		var diffCurrentTime = Math.abs( new Date().getTime() - todo.createdAt );

		var tempDispTime = msToTime(diffCurrentTime) + " / " + todo.expiryDays + " d";

		expiry.innerHTML = `<input type="text" value="${tempDispTime}" readonly>`;
		edit.innerHTML = 'Edit Name';
		deleteButton.innerHTML = 'Delete';

		label.appendChild(input);
		label.appendChild(span);

		actions.appendChild(expiry);

		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);

		todoItem.appendChild(content);
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);
		
		todoList.appendChild(progress);

		if (todo.done) {
			todoItem.classList.add('done');
		}
		
		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem(storageName, JSON.stringify(listName));

			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}

			DisplayTodos(listName, htmlVal, storageName)

		})

		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
				todo.content = e.target.value;
				localStorage.setItem(storageName, JSON.stringify(listName));
				DisplayTodos(listName, htmlVal, storageName)

			})
		})

		deleteButton.addEventListener('click', (e) => {
			if (storageName == 'todos' ){
				todos = todos.filter(t => t != todo);
				listName = todos;
			} else if (storageName == 'todos1') {
				todos1 = todos1.filter(t => t != todo);
				listName = todos1;
			}
			else {
				todos2 = todos2.filter(t => t != todo);
				listName = todos2;
			}
			
			localStorage.setItem(storageName, JSON.stringify(listName));
			DisplayTodos(listName, htmlVal, storageName)
		})

	})


	
}



function msToTime(duration) {
	var milliseconds = parseInt((duration % 1000) / 100),
	  seconds = Math.floor((duration / 1000) % 60),
	  minutes = Math.floor((duration / (1000 * 60)) % 60),
	  hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
	  days = Math.floor((duration / (1000 * 60 * 60 * 24)));

  
	return days + " d, " + hours + " hr";
  }