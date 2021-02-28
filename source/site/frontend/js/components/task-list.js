// These two arrays are used to recored the information of running and pending
const task_description_arr = [];
const task_estimation_arr = [];

const task_finished_des = [];
const task_finished_est = [];

let current_task_description = "";
let current_task_estimation = "";

let edited_task_description = "";
let edited_index = 0;

import {Task_data, Task_list_data} from './task-list-data.js';

export function define_task_list(html) {
    class CTaskList extends HTMLElement {
        constructor() {
            super();
            const pending_id = "pending";
            const running_id = "running";
            const finished_id = "finished";

            let current_task_display = null;

            var shadow = this.attachShadow({
                mode: "open"
            });
            shadow.innerHTML = html;

            let document = this.shadowRoot;

            function _class(name) {
                return document.querySelectorAll("." + name);
            }

            /**
             * Add a task to pending when initially created by the task list
             */
            function add_task_to_pending() {
                let task_list = document.getElementById(pending_id);
                task_list.insertBefore(new Task_input(window.task_list.length),document.getElementById('add-task-button'));
            }

            /**
             * Update the information of the task list when the timer finishes
             * return the information of the next current task.
             * @return {array} the first string is task_name,the second is task_estimate
             */
            function update_current_task_display() {
                let first_pending = document.getElementById(pending_id).childNodes[0];
                // while loop to ignore the empty textNodes 
                while (first_pending.nodeType === 3){
                    first_pending = first_pending.nextSibling;
                }

                if (current_task_display !== null){
                    document.getElementById(running_id).removeChild(current_task_display);
                    //NOTE: Currently not functional
                    current_task_display.finish_task(3);
                    document.getElementById(finished_id).appendChild(current_task_display);
                }
                // Set current_task to null to prevent empty pending list
                current_task_display = null;
                if (first_pending.nodeName !== 'BUTTON'){
                    current_task_display = first_pending;
                    document.getElementById(running_id).appendChild(current_task_display);
                }
            }


            function update_current_task(){   
                if (task_description_arr.length == 0) {
                    return null;
                }
                current_task_description = task_description_arr[0];
                current_task_estimation = task_estimation_arr[0];
                var temp = [];
                temp.push(current_task_description);
                temp.push(current_task_estimation);
                return temp;
            }
            /**
             * Change the information at <p> about current tast
             * @param {int} category - the senarios for moving tasks, 0 for from pending
             * to running, 1 for from running to finished
             */
            function change_information(category) {
                var infor = document.getElementById("curr_task_information");
                if (category === 0) {
                    update_current_task();
                    var temp = "current task is: " + current_task_description + ", cycles needed: " + current_task_estimation;
                    infor.innerHTML = temp;
                }
                else {
                    // recorded information of finished task
                    task_finished_des.push(current_task_description);
                    task_finished_est.push(current_task_estimation);
                    // recover the information of current task
                    current_task_estimation = "";
                    current_task_description = "";
                    // delete information from two arrays
                    task_finished_des.splice(0, 1);
                    task_finished_est.splice(0, 1);

                    //TODO
                    // get the the actual number of cycles and record them.

                    infor.innerHTML = "There is no task in running.";
                }

            }

            document
                .getElementById("add-task-button")
                .addEventListener("click", add_task_to_pending);

            document.getElementById("testMoving0").addEventListener("click", function () { update_current_task_display() });
            document.getElementById("testMoving1").addEventListener("click", function () { change_information(1) });
        }

        enter_animate() {
            let document = this.shadowRoot;
            document.getElementById("side-bar").style.left = "60%";
        }

        leave_animate() {
            let document = this.shadowRoot;
            document.getElementById("side-bar").style.left = "100%";
        }
    }


    /* the Task component that displays a task */
    class Task extends HTMLElement {
        /**
         * @param {*} task_name Name of a task to be displayed
         * @param {*} estimated_pomo Estimated pomodoro session number to be displayed
         */
        constructor(data) {
            super();
            //TODO: Seperate data store with data display
            this.task_data = data;
            this.task_name = data.desc;
            this.estimated_pomo = data.est;
            this.actual_pomo = 0;
            // styling component
            let styling = document.createElement("link");
            this.uid = data.UID;
            //styling element
            styling.setAttribute("rel", "stylesheet");
            styling.setAttribute("href", "/css/task-item.css");
            // shadow dom root
            let root = this.attachShadow({
                mode: "open"
            });
            // outer most container to store description and pomo estimate
            let task_container = document.createElement("div");
            task_container.setAttribute("class", "task-container");
            // task description component
            let task_desc = document.createElement("p");
            task_desc.setAttribute("class", "task");
            // time estimation component
            let task_estimate = document.createElement("p");
            task_estimate.setAttribute("class", "pomo-counter");
            // Cancel button that removes a task
            let task_cancel_btn = document.createElement("button");
            task_cancel_btn.innerHTML = "x";
            task_cancel_btn.setAttribute("class", "pomo-cancel-btn");
            // edit button that allows edition of a task
            let task_edit_btn = document.createElement("button");
            task_edit_btn.innerHTML = "e";
            task_edit_btn.setAttribute("class", "pomo-edit-btn");
            // Button to move a task up
            let up_button = document.createElement("button");
            up_button.innerHTML = "^";
            up_button.setAttribute("class", "order-btn");
            //Button to move a task down
            let down_button = document.createElement("button");
            down_button.innerHTML = "v";
            down_button.setAttribute("class", "order-btn");
            // Display of actual pomodoro sessions. Not displayed by default
            let actual_pomo = document.createElement('p');
            this.actual_pomo_ref = actual_pomo;
            actual_pomo.setAttribute('class','pomo-counter');
            actual_pomo.style.display = 'none';

            let order_button_container = document.createElement('div');
            this.obc_ref = order_button_container;
            order_button_container.setAttribute('class','order-btn-container');
            // Setup display
            task_desc.innerHTML = this.task_name;
            task_estimate.innerHTML = this.estimated_pomo;

            root.appendChild(styling);
            task_container.appendChild(task_desc);
            task_container.appendChild(task_estimate);
            order_button_container.appendChild(task_cancel_btn);
            order_button_container.appendChild(task_edit_btn);
            order_button_container.appendChild(up_button);
            order_button_container.appendChild(down_button);
            order_button_container.appendChild(actual_pomo);
            task_container.append(order_button_container);
            root.appendChild(task_container);

            /**
             * This funciton removes a component. Should be only used for removing
             * tasks from task list.
             *
             * @param {*} self the  reference to a Task object to be removed
             */
            function cancel_task(self) {
                let parent = self.parentNode;
                parent.removeChild(self);
                // find the index of the canceled task in two arrays
                let index = task_description_arr.indexOf(task_name);
                // remove the information of canceled task from two arrays
                task_description_arr.splice(index, 1);
                task_estimation_arr.splice(index, 1);
            }

            /**
             * Edit a task by creating a task_input component and create a new
             * task component with it while removing this origiinal task
             *
             * @param {*} self - reference to the object to be editted
             */
            function edit_task(self) {
                // record the information of edited task, those information will be
                // used to update two arrays
                edited_task_description = self.task_name;
                edited_index = task_description_arr.indexOf(edited_task_description);
                let parent = self.parentNode;
                parent.insertBefore(new Task_input(), self);
                cancel_task(self);
            }

            /**
             * Move the current task up or down the task list 
             * @param {*} self Reference to the current task
             * @param {*} direction Direction of movement: 0 for up, 1 for down
             */
            function move(self,direction){
                let parent = self.parentNode;
                if (direction === 0){
                    if (self.previousSibling !== 'H3'){
                        parent.insertBefore(self,self.previousSibling);
                    }
                }
                else if (direction === 1){
                    if (self.nextElementSibling !== null){
                        parent.insertBefore(self.nextElementSibling,self);
                    }
                }
            }
            
            task_cancel_btn.addEventListener("click", (_) => cancel_task(this));
            task_edit_btn.addEventListener("click", (_) => edit_task(this));
            up_button.addEventListener('click',() => move(this,0));
            down_button.addEventListener('click',() => move(this,1));
        };

        /**
         * Toggle the display of the task to be (naem,est,actual). Also
         * assign the display value of actual pomodoro sessions.
         * @param {*} finish_pomo The number of actual pomodoro sessions
         * taken by this task.
         */
        finish_task(finish_pomo){
            // set all the other buttons to not display
            console.log(this.obc_ref.childNodes);
            for (let children of this.obc_ref.childNodes){
                children.style.display = 'none';
            }
            // set the actual pomodoro display.
            this.actual_pomo_ref.style.display = 'initial';
            this.actual_pomo_ref.innerHTML = finish_pomo;
        }
    }

    /**
     * The task input prompt that allows the user to input for the task
     */
    class Task_input extends HTMLElement {
        constructor(index) {
            super();
            let task_description = "";
            let task_pomo_estimation = "";
            let insert_index = index;
            // styling component
            let styling = document.createElement("link");
            styling.setAttribute("rel", "stylesheet");
            styling.setAttribute("href", "/css/task-item.css");
            // shadow dom root
            let root = this.attachShadow({
                mode: "open"
            });
            // outter container for input boxes and buttons
            let task_input_container = document.createElement("div");
            task_input_container.setAttribute("class", "task-container");
            // input for task description
            let task_desc_in = document.createElement("input");
            task_desc_in.setAttribute("class", "task");
            task_desc_in.setAttribute("type", "text");
            // input for task pomo estimation, treat input as string
            let task_estimate_in = document.createElement("input");
            task_estimate_in.setAttribute("type", "number");
            task_estimate_in.setAttribute("class", "pomo-counter");
            // confirm button that addes a task when clicked
            let confirm_btn = document.createElement("button");
            confirm_btn.setAttribute("class", "pomo-edit-btn");
            // Hard coded for now
            confirm_btn.innerHTML = "Confirm";
            // cancel button that stops task creation
            let cancel_btn = document.createElement("button");
            cancel_btn.setAttribute("class", "pomo-cancel-btn");
            // Hard coded for now
            cancel_btn.innerHTML = "Cancel";
            // container for the two buttons
            let confirm_btn_container = document.createElement("div");
            confirm_btn_container.setAttribute("class", "task-input-btn-container");

            task_input_container.appendChild(task_desc_in);
            task_input_container.appendChild(task_estimate_in);
            task_input_container.appendChild(confirm_btn);
            task_input_container.appendChild(cancel_btn);

            root.appendChild(task_input_container);
            root.appendChild(styling);

            /**
             * Helper function that adds a task at the position of the task input box
             * when the confirm button is clicked.
             *
             * @param {*} self The reference to the task input box which the task
             * display is going to replace.
             */
            function confirm_task(self) {
                let task_desc = task_desc_in.value;
                let task_pomo_est = task_estimate_in.value;
                let task_pomo_num = Number(task_pomo_est);
                let parent = self.parentNode;
                // if the user did not enter the task name
                if (task_desc == "") {
                    alert("Please input a task name");
                    return;
                }

                // if the user did not enter the estimate timeout
                if (task_pomo_num == 0) {
                    alert("Please input the numbers of cycles you need");
                    return;
                }

                // if the function was called by edit_task(self)

                if (task_pomo_num > 4) {
                    var r = confirm(
                        "The task takes too many cycles. Do you want to split it into more tasks?"
                    );
                    // recommaend splitting up into more task
                    if (r == true) {
                        // calculate how many new sub tasks should be needed.
                        var breakNum = Math.floor(task_pomo_num / 4);
                        var rem = task_pomo_num % 4;
                        for (var i = 1; i <= breakNum; i += 1) {
                            var tempName = task_desc + " Part " + i;
                            // add the i th sub task to the list
                            let new_task_data = new Task_data(tempName,4);
                            let new_task = new Task(new_task_data);
                            // record information of sub tasks to the global array
                            window.task_list.insert_pending(insert_index+i-1,new_task_data); 
                            parent.insertBefore(new_task, self);
                        }

                        // handels the last task and assign remaining cycles to it
                        if (rem != 0) {
                            tempName = task_desc + " Part " + i;
                            let new_task_data = new Task_data(tempName,rem);
                            let new_task = new Task(new_task_data);
                            // record information of sub tasks to the global array
                            window.task_list.insert_pending(insert_index+i-1,new_task_data); 
                            parent.insertBefore(new_task,self);
                        }
                    }
                }

                else if(task_pomo_num <= 4) {
                    // pushed the information to arrays at the correct index
                    let new_task_data = new Task_data(task_desc,task_pomo_est);
                    let new_task = new Task(new_task_data);
                    // record information of sub tasks to the global array
                    window.task_list.insert_pending(insert_index,new_task_data); 
                    parent.insertBefore(new_task,self);
                }
                // Remove this task-input component
                parent.removeChild(self);
                edited_task_description = "";
                return;
                

                // // if the task takes too many cycles, advice the user to break up the task
                // if (task_pomo_num <= 4) {
                //     // use insertbefore to allow creation of tasks at the original
                //     // position of the task input boxes.
                //     parent.insertBefore(new Task(task_desc, task_pomo_est), self);
                //     task_description_arr.push(task_desc);
                //     task_estimation_arr.push(task_pomo_est);
                // }

                // // if the task takes too many cycles, advice the user to break up the task
                // else if (task_pomo_num > 4) {
                //     // recommaend splitting up into more task
                //     if (r == true) {
                //         // calculate how many new sub tasks should be needed.
                //         var breakNum = task_pomo_num / 4;
                //         var rem = task_pomo_num % 4;
                //         var i = 1;

                //         for (i; i <= breakNum; i += 1) {
                //             var tempName = task_desc + " Part " + i;
                //             // record information of sub tasks to the global array
                //             task_description_arr.push(tempName);
                //             task_estimation_arr.push(4);
                //             // add the i th sub task to the list
                //             parent.insertBefore(new Task(tempName, 4), self);
                //         }

                //         // handels the last task and assign remaining cycles to it
                //         if (rem != 0) {
                //             tempName = task_desc + " Part " + i;
                //             task_description_arr.push(tempName);
                //             task_estimation_arr.push(rem);
                //             parent.insertBefore(new Task(tempName, rem), self);
                //         }
                //     }
                // }
                // // Remove this task-input component
                // parent.removeChild(self);
                // edited_task_description = "";
            }

            /**
             * Remove the task input box without adding a new task
             * @param {*} self The refernece to the task input box.
             */
            function cancel_task(self) {
                let parent = self.parentNode;
                parent.removeChild(self);
            }



            confirm_btn.addEventListener("click", () => confirm_task(this));
            cancel_btn.addEventListener("click", () => cancel_task(this));
        }
    }


    customElements.define("c-task-list", CTaskList);
    customElements.define("c-task", Task);
    customElements.define("c-task-input", Task_input);
    return CTaskList;
}
