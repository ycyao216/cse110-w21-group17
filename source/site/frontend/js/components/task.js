export function define_task(html) {
    class CTask extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = html;

            let document = this.shadowRoot;

            function _class(name) {
                return document.querySelectorAll("." + name);
            }

            // Put you initialization code here
            this.task_view = this.shadowRoot.getElementById("task-view");
            this.pomo_counter_view = this.shadowRoot.getElementById("pomo-counter-view");
            this.pomo_delete_btn = this.shadowRoot.getElementById("pomo-delete-btn");
            this.pomo_edit_btn = this.shadowRoot.getElementById("pomo-edit-btn");
            this.order_btn_up = this.shadowRoot.getElementById("order-btn-up");
            this.order_btn_down = this.shadowRoot.getElementById("order-btn-down");

            this.task_edit = this.shadowRoot.getElementById("task-edit");
            this.pomo_counter_edit = this.shadowRoot.getElementById("pomo-counter-edit");
            this.pomo_confirm_btn = this.shadowRoot.getElementById("pomo-confirm-btn");
            this.pomo_cancel_btn = this.shadowRoot.getElementById("pomo-cancel-btn");

            this.view_div = this.shadowRoot.getElementById("view");
            this.edit_div = this.shadowRoot.getElementById("edit");

            // event listeners
            this.pomo_delete_btn.addEventListener("click", (_) => remove_task(this));
            this.pomo_edit_btn.addEventListener("click", (_) => mode_edit(this));
            this.order_btn_up.addEventListener("click", () => move(this, 0));
            this.order_btn_down.addEventListener("click", () => move(this, 1));
            this.pomo_confirm_btn.addEventListener("click", () => move(this, 0));
            this.pomo_cancel_btn.addEventListener("click", () => move(this, 1));

            // bind this
            this.populate.bind(this);
            this.mode_view.bind(this);
            this.mode_edit.bind(this);
        }


        // Display modes
        mode_view(){
            this.view_div.style.display = "initial";
            this.edit_div.style.display = "none";
        }

        mode_edit(){
            this.view_div.style.display = "none";
            this.edit_div.style.display = "initial";
        }

        populate(task) {
            this.task_view.innerText = this.task_edit.innerText = task.description;
            this.pomo_counter_view.innerText = this.pomo_counter_edit.innerText = task.pomo_counter_ele;
        }
    }
    customElements.define('c-task', CTask);
    return CTask;
}


// /* the Task component that displays a task */
// class Task extends HTMLElement {
//     /**
//      * @param {*} task_name Name of a task to be displayed
//      * @param {*} estimated_pomo Estimated pomodoro session number to be displayed
//      */
//     constructor(data) {
//       super();
//       //TODO: Seperate data store with data display
//       this.task_data = data;
//       this.task_name = data.desc;
//       this.estimated_pomo = data.est;
//       this.actual_pomo = 0;
//       this.uid = data.UID;
//       // styling component
//       let styling = document.createElement("link");
//       //styling element
//       styling.setAttribute("rel", "stylesheet");
//       styling.setAttribute("href", "/css/task-item.css");
//       // shadow dom root
//       let root = this.attachShadow({
//         mode: "open",
//       });

//       // outer most container to store description and pomo estimate
//       let task_container = document.createElement("div");
//       task_container.setAttribute("class", "task-container");
//       // task description component
//       let task_desc = document.createElement("p");
//       task_desc.setAttribute("class", "task");
//       // time estimation component
//       let task_estimate = document.createElement("p");
//       task_estimate.setAttribute("class", "pomo-counter");
//       // Cancel button that removes a task
//       let task_cancel_btn = document.createElement("button");
//       task_cancel_btn.innerHTML = "x";
//       task_cancel_btn.setAttribute("class", "pomo-cancel-btn");
//       // edit button that allows edition of a task
//       let task_edit_btn = document.createElement("button");
//       task_edit_btn.innerHTML = "e";
//       task_edit_btn.setAttribute("class", "pomo-edit-btn");
//       // Button to move a task up
//       let up_button = document.createElement("button");
//       up_button.innerHTML = "^";
//       up_button.setAttribute("class", "order-btn");
//       //Button to move a task down
//       let down_button = document.createElement("button");
//       down_button.innerHTML = "v";
//       down_button.setAttribute("class", "order-btn");
//       // Display of actual pomodoro sessions. Not displayed by default
//       let actual_pomo = document.createElement("p");
//       this.actual_pomo_ref = actual_pomo;
//       actual_pomo.setAttribute("class", "pomo-counter");
//       actual_pomo.style.display = "none";

//       let order_button_container = document.createElement("div");
//       this.obc_ref = order_button_container;
//       order_button_container.setAttribute("class", "order-btn-container");
//       // Setup display
//       task_desc.innerHTML = this.task_name;
//       task_estimate.innerHTML = this.estimated_pomo;

//       root.appendChild(styling);
//       task_container.appendChild(task_desc);
//       task_container.appendChild(task_estimate);
//       order_button_container.appendChild(task_cancel_btn);
//       order_button_container.appendChild(task_edit_btn);
//       order_button_container.appendChild(up_button);
//       order_button_container.appendChild(down_button);
//       order_button_container.appendChild(actual_pomo);
//       task_container.append(order_button_container);
//       root.appendChild(task_container);

//       /**
//        * This funciton removes a component. Should be only used for removing
//        * tasks from task list.
//        *
//        * @param {*} self the  reference to a Task object to be removed
//        */
//       function remove_task(self) {
//         let parent = self.parentNode;
//         parent.removeChild(self);
//         window.task_list.remove(data.UID);
//       }

//       /**
//        * Edit a task by creating a task_input component and create a new
//        * task component with it while removing this origiinal task
//        *
//        * @param {*} self - reference to the object to be editted
//        */
//       function edit_task(self) {
//         // record the information of edited task, those information will be
//         // used to update two arrays
//         let parent = self.parentNode;
//         parent.insertBefore(new Task_input(data.index, data, true), self);
//         remove_task(self);
//       }

//       /**
//        * Move the current task up or down the task list
//        * @param {*} self Reference to the current task
//        * @param {*} direction Direction of movement: 0 for up, 1 for down
//        */
//       function move(self, direction) {
//         window.task_list.move(data.list_index, direction);
//         let parent = self.parentNode;
//         if (direction === 0) {
//           if (self.previousSibling !== null) {
//             parent.insertBefore(self, self.previousSibling);
//           }
//         } else if (direction === 1) {
//           if (self.nextElementSibling.id !== "add-task-button") {
//             parent.insertBefore(self.nextElementSibling, self);
//           }
//         }
//       }

//       task_cancel_btn.addEventListener("click", (_) => remove_task(this));
//       task_edit_btn.addEventListener("click", (_) => edit_task(this));
//       up_button.addEventListener("click", () => move(this, 0));
//       down_button.addEventListener("click", () => move(this, 1));
//     }

//     /**
//      * Toggle the display of the task to be (naem,est,actual). Also
//      * assign the display value of actual pomodoro sessions.
//      * @param {*} finish_pomo The number of actual pomodoro sessions
//      * taken by this task.
//      */
//     finish_task_render(finish_pomo) {
//       // set all the other buttons to not display
//       console.log(this.obc_ref.childNodes);
//       for (let children of this.obc_ref.childNodes) {
//         children.style.display = "none";
//       }
//       // set the actual pomodoro display.
//       this.actual_pomo_ref.style.display = "initial";
//       this.actual_pomo_ref.innerHTML = finish_pomo;
//     }
//   }

//   customElements.define("c-task", CTask);
//   return CTask;
// }
