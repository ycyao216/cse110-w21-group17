
var fold_button = document.getElementById("fold-button");
var add_button = document.getElementById("add-task-button");
var task_bar = document.getElementById("task-list");
var task_container = document.getElementById("task-container");
task_container.style.display = "none";
var new_task_reference_node = fold_button;

var task_element_list = [];
var folded = true;

function fold_task_bar() {
    console.log("clicked");
    if (folded === true) {
        task_bar.style.left = "60%";
        folded = false;
        fold_button.innerHTML = "Retract";
    }
    else {
        task_bar.style.left = "100%";
        folded = true;
        fold_button.innerHTML = "Extend";
    }
}

function add_task_element() {
    let index = task_element_list.length;
    var new_task = task_container.cloneNode(true);
    for (let nodes in new_task.childNodes) {
        nodes.id += index;
        for (let child in nodes.childNodes) {
            child.id += index;
        }
    }
    new_task.childNodes[1].childNodes[1].innerHTML += index;
    new_task.style.display = "";
    task_element_list.push(new_task);
    task_bar.insertBefore(new_task, new_task_reference_node);
}

function pop_task_element() {
    if (task_element_list.length > 0) {
        task_bar.removeChild(task_element_list[0]);
        task_element_list.shift();
    }
}

fold_button.addEventListener("click", fold_task_bar);
add_button.addEventListener("click", add_task_element);
