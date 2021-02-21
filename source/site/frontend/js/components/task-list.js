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
        }

        enter_animate(){
            let document = this.shadowRoot;
            document.getElementById("side-bar").style.left = "60%";
        }

        leave_animate(){
            let document = this.shadowRoot;
            document.getElementById("side-bar").style.left = "100%";
        }
    }

    customElements.define("c-task-item", Task);
    customElements.define("c-task-item-input", Task_input);
    customElements.define('c-task-list', CTaskList);
}

/* the Task component that displays a task */
class Task extends HTMLElement {
    constructor(task_name, estimated_pomo) {
        super();
        this.task_name = task_name;
        this.estimated_pomo = estimated_pomo;
        // styling component
        let styling = document.createElement("link");
        styling.setAttribute("rel", "stylesheet");
        styling.setAttribute("href", "/css/task-list.css");
        // shadow dom root
        let root = this.attachShadow({ mode: "open" });
        // outer most container to store description and pomo estimate
        let task_container = document.createElement("div");
        task_container.setAttribute("class", "task-container");
        // task description component
        let task_desc = document.createElement("p");
        task_desc.setAttribute("class", "task");
        // time estimation component
        let task_estimate = document.createElement("p");
        task_estimate.setAttribute("class", "pomo-counter");
        task_desc.innerHTML = this.task_name;
        task_estimate.innerHTML = this.estimated_pomo;

        task_container.appendChild(task_desc);
        task_container.appendChild(task_estimate);
        root.appendChild(task_container);
        root.appendChild(styling);
    }
}

/**
 * The task input prompt that allows the user to input for the task
 */
class Task_input extends HTMLElement {
    constructor() {
        super();
        var task_description = "";
        var task_pomo_estimation = "";
        // styling component
        let styling = document.createElement("link");
        styling.setAttribute("rel", "stylesheet");
        styling.setAttribute("href", "/css/task-list.css");
        // shadow dom root
        let root = this.attachShadow({ mode: "open" });
        // outter container for input boxes and buttons
        let task_input_container = document.createElement("div");
        task_input_container.setAttribute("class", "task-input-container");
        // input for task description
        let task_desc_in = document.createElement("input");
        task_desc_in.setAttribute("class", "task-input");
        task_desc_in.setAttribute("type", "text");
        // input for task pomo estimation, treat input as string
        let task_estimate_in = document.createElement("input");
        task_estimate_in.setAttribute("type", "text");
        task_estimate_in.setAttribute("class", "pomo-counter-input");
        // confirm button that addes a task when clicked
        let confirm_btn = document.createElement("button");
        confirm_btn.setAttribute("class", "task-confirm-btn");
        // Hard coded for now
        confirm_btn.innerHTML = "Confirm";
        // cancel button that stops task creation
        let cancel_btn = document.createElement("button");
        cancel_btn.setAttribute("class", "task-cancel-btn");
        // Hard coded for now
        cancel_btn.innerHTML = "Cancel";
        // container for the two buttons
        let confirm_btn_container = document.createElement("div");
        confirm_btn_container.setAttribute("class", "task-input-btn-container");

        confirm_btn_container.appendChild(confirm_btn);
        confirm_btn_container.appendChild(cancel_btn);

        task_input_container.appendChild(task_desc_in);
        task_input_container.appendChild(task_estimate_in);
        task_input_container.appendChild(confirm_btn_container);

        root.appendChild(task_input_container);
        root.appendChild(styling);

        /**
         * Helper function that adds a task when the confirm button is clicked.
         */
        function confirm_task(self) {
            task_description = task_desc_in.value;
            task_pomo_estimation = task_pomo_estimation.value;
            let parent = self.parentNode;
            // Remove this task-input component
            parent.removeChild(self);
            //NOTE: This is a global function from out of the class
            parent.appendChild(new Task(task_description, task_pomo_estimation));
        }

        function cancel_task(self) {
            let parent = self.parentNode;
            parent.removeChild(self);
        }

        confirm_btn.addEventListener("click", () => confirm_task(this));
        cancel_btn.addEventListener("click", () => cancel_task(this));
    }
}

function add_task_to_pending(ele) {
    let document = ele.getRootNode();
    pending = document.getElementById("pending");
    pending.appendChild(new Task_input);
}