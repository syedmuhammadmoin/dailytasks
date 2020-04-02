class Task{
    constructor(title, agent, dept){
        this.title = title;
        this.agent = agent;
        this.dept = dept;
    }
}

class UI{
    addTaskToList(task){
        const list = document.getElementById('task-list');

        // Create tr element
        const row = document.createElement('tr');
    
        // Inserting cols
        row.innerHTML = `
        <td>${task.title}</td>
        <td>${task.agent}</td>
        <td>${task.dept}</td>
        <td><a href="#" class="delete"> x </a></td>
        `
        list.appendChild(row);
    }

    showAlert(message, className){
         // Create div
        const div = document.createElement('div');
        // Add classes
        div.className = `alert ${className}`;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.container');
        // Get form
        const form = document.getElementById('task-form');
        // Insert alert
        container.insertBefore(div, form);

        // Timeout after 3 seconds
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteTask(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('agent').value = '';
        document.getElementById('dept').value = '';
    }
}

// Local Storage Class
class Store {
    static getTasks(){
        let tasks;
        if(localStorage.getItem('tasks') === null){
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        return tasks;

        console.log(tasks);
    }

    static displayTasks(){

        const tasks = Store.getTasks();

        tasks.forEach(function(itcanbeanything){
            const ui = new UI;

            // Add task to UI
            ui.addTaskToList(itcanbeanything);
        });

    }

    static addTask(task){
        const tasks = Store.getTasks();
        
        tasks.push(task);

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static removeTask(sibling1, sibling2){
        const tasks = Store.getTasks();
        
        tasks.forEach(function(task, index){
            if(task.title === sibling1 || task.dept === sibling2) {
                tasks.splice(index, 1);
            }
            
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayTasks);

// Event Listeners to add Task
document.getElementById('task-form').addEventListener('submit',function(e){
    // Get form values
    const title = document.getElementById('title').value,
          agent = document.getElementById('agent').value,
          dept = document.getElementById('dept').value
    
    // Instantiate task
    const task = new Task(title, agent, dept);

    // Instantiate UI
    const ui = new UI();


    // Validate
    if(title === '' || agent === '' || dept === '') {
        // Error alert
        ui.showAlert('Please fill in all fields', 'error');
        
    } else {    
        // Add task to list
        ui.addTaskToList(task);

        // Add to LS
        Store.addTask(task);

        // Show success
        ui.showAlert('Task Added!', 'success')

        // Clear fields
        ui.clearFields();
    }

    e.preventDefault();
});

// Event listener to Delete task
document.getElementById('task-list').addEventListener('click', function(e){
  
    // Instantiate UI
    const ui = new UI();

    // Delete Task
    ui.deleteTask(e.target);

    // Remove from LS

    const prevSibling1 = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

    const prevSibling2 = e.target.parentElement.previousElementSibling.textContent;

    Store.removeTask(prevSibling1, prevSibling2);

    // Show message
    ui.showAlert('Task Removed', 'success');

    e.preventDefault();
});
