function define_task_list(html) {
    class CTaskList extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = html;

            let document = this.shadowRoot;

            function _class(name) {
                return document.querySelectorAll("." + name);
            }



            //Hide the task container template
            var fold_button = document.getElementById("fold-button");
            var add_button = document.getElementById("add-task-button");
            var task_bar = document.getElementById("task-list");
            var task_container = document.getElementById("task-container");
            // task_bar.style.left = "100%";
            // folded = false;
            // fold_button.innerHTML = "Extend";
            // task_container.style.display = "block";
            var new_task_reference_node = fold_button;



        }
    }
    customElements.define('c-task-list', CTaskList);
}

// The list of html element that represents a task
const task_element_list = [];
// Whether the task-list is folded.
var folded = true;

// /** DOM variables */
// var fold_button = document.getElementById("fold-button");
// var add_button = document.getElementById("add-task-button");
// var task_bar = document.getElementById("task-list");
// var task_container = document.getElementById("task-container");

/**
 * This function 
 */
function fold_task_bar(ele) {
    let document = ele.getRootNode();
    var fold_button = document.getElementById("fold-button");
    var add_button = document.getElementById("add-task-button");
    var task_bar = document.getElementById("task-list");
    var task_container = document.getElementById("task-container");

    if (folded === true) {
        // The left css property of task bar when expended
        task_bar.style.left = "60%";
        folded = false;
        fold_button.innerHTML = "Retract";
    }
    else {
        // THe left css property of task bar when retracted
        task_bar.style.left = "100%";
        folded = true;
        fold_button.innerHTML = "Extend";
    }
}

/**
 * This function adds an dummy container for a task. The task is displayed on 
 * the task list and its content can be changed. 
 * However, this funciton does not affect the user data at all, and the task it 
 * created will only be visual and will not be functional or analyzed.
 */
function add_task_element(ele) {
    let document = ele.getRootNode();
    var fold_button = document.getElementById("fold-button");
    var add_button = document.getElementById("add-task-button");
    var task_bar = document.getElementById("task-list");
    var task_container = document.getElementById("task-container");

    let index = task_element_list.length;
    var new_task_reference_node = fold_button;
    var new_task = task_container.cloneNode(true);
    // Every new task with all its nodes will have a unique id based on its index
    for (let nodes in new_task.childNodes) {
        nodes.id += index;
        for (let child in nodes.childNodes) {
            child.id += index;
        }
    }
    // The task description is the second grandchild. Content is also unique.
    new_task.childNodes[1].childNodes[1].innerHTML += index;
    // The template is hidden. This line reveal the clone.
    new_task.style.display = "";
    task_element_list.push(new_task);
    task_bar.insertBefore(new_task, new_task_reference_node);
}

/**
 * A function that remove the html element of the top, or current, task from the
 * task list. 
 * This function does not affect the functional task data. It only remove the
 * visual
 */
function pop_task_element(ele) {
    let document = ele.getRootNode();
    var fold_button = document.getElementById("fold-button");
    var add_button = document.getElementById("add-task-button");
    var task_bar = document.getElementById("task-list");
    var task_container = document.getElementById("task-container");

    if (task_element_list.length > 0) {
        task_bar.removeChild(task_element_list[0]);
        task_element_list.shift();
    }
}

// fold_button.addEventListener("click", fold_task_bar);
// add_button.addEventListener("click", add_task_element);
