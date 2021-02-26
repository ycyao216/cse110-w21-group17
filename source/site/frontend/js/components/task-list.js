export function define_task_list(html) {
    class CTaskList extends HTMLElement {
        constructor() {
            super();
            const pending_id = "pending";
            const running_id = "running";
            const finished_id = "finished";

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
                let task_list = document.getElementById("pending");
                task_list.appendChild(new Task_input());
            }

            /**
             * Move this task to differnt categories based on different conditions
             *
             * @param {int} category - the senarios for moving tasks, 0 for from pending
             * to running, 1 for from running to finished
             */
            //NOTE: temporary. will change with seperation of data and display
            function move_task(category) {
                let pending_tasks = document.getElementById(pending_id);
                let running_task = document.getElementById(running_id);
                change_information(category);
                if (category === 0) {
                    // add second node of pending list, since white spaces count as nodes
                    console.log(pending_tasks.childNodes[1].value);
                    document
                        .getElementById(running_id)
                        .appendChild(pending_tasks.childNodes[1]);

                    //pending_tasks.removeChild(pending_tasks.childNodes[1]);
                }
                else if (category === 1) {
                    if (running_task.childNodes.length > 0) {
                        document
                            .getElementById(finished_id)
                            .appendChild(running_task.childNodes[1]);
                        //running_task.removeChild(running_task.childNodes[1]);
                    }
                }
            }

            /**
             * Rupdate the information of the current running task
             * return them to the timer
             * @return {array} the first string is task_name,the second is task_estimate
             */
            function update_current_task() {
                if (task_description_arr.length == 0) {
                    return null;
                }
                current_task_description = task_description_arr[0];
                current_task_estimation = task_estimation_arr[0];
                var temp = [];
                temp.push(current_task_description);
                temp.push(current_task_estimation);
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

            document.getElementById("testMoving0").addEventListener("click", function () { move_task(0) });
            document.getElementById("testMoving1").addEventListener("click", function () { move_task(1) });
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
        constructor(task_name, estimated_pomo) {
            super();
            //TODO: Seperate data store with data display
            this.task_name = task_name;
            this.estimated_pomo = estimated_pomo;
            // styling component
            let styling = document.createElement("link");
            styling.setAttribute("rel", "stylesheet");
            styling.setAttribute("href", "/css/task-list.css");
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
            // Setup display
            task_desc.innerHTML = this.task_name;
            task_estimate.innerHTML = this.estimated_pomo;

            task_container.appendChild(task_desc);
            task_container.appendChild(task_estimate);
            task_container.appendChild(task_cancel_btn);
            task_container.appendChild(task_edit_btn);
            root.appendChild(task_container);
            root.appendChild(styling);

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

            task_cancel_btn.addEventListener("click", (_) => cancel_task(this));
            task_edit_btn.addEventListener("click", (_) => edit_task(this));
        }
    }

    /**
     * The task input prompt that allows the user to input for the task
     */
    class Task_input extends HTMLElement {
        constructor() {
            super();
            let task_description = "";
            let task_pomo_estimation = "";
            // styling component
            let styling = document.createElement("link");
            styling.setAttribute("rel", "stylesheet");
            styling.setAttribute("href", "/css/task-list.css");
            // shadow dom root
            let root = this.attachShadow({
                mode: "open"
            });
            // outter container for input boxes and buttons
            let task_input_container = document.createElement("div");
            task_input_container.setAttribute("class", "task-input-container");
            // input for task description
            let task_desc_in = document.createElement("input");
            task_desc_in.setAttribute("class", "task-input");
            task_desc_in.setAttribute("type", "text");
            // input for task pomo estimation, treat input as string
            let task_estimate_in = document.createElement("input");
            task_estimate_in.setAttribute("type", "number");
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

                // if the user add the repeated task
                if (task_description_arr.indexOf(task_desc) != -1) {
                    alert("This task has aleady been added to the task list");
                    return;
                }

                // if the function was called by edit_task(self)
                if (edited_task_description != "") {
                    if (task_pomo_num > 4) {
                        // recommaend splitting up into more task
                        var r = confirm(
                            "The task takes too many cycles. Do you want to split it into more tasks?"
                        );
                        if (r == true) {
                            // calculate how many new sub tasks should be needed.
                            var breakNum = task_pomo_num / 4;
                            var rem = task_pomo_num % 4;
                            var i = 1;

                            for (i; i <= breakNum; i += 1) {
                                var tempName = task_desc + " Part " + i;
                                // record information of sub tasks to the global array
                                task_description_arr.splice(edited_index + i - 1, 0, tempName);
                                task_estimation_arr.splice(edited_index + i - 1, 0, 4);
                                // add the i th sub task to the list
                                parent.insertBefore(new Task(tempName, 4), self);
                            }

                            // handels the last task and assign remaining cycles to it
                            if (rem != 0) {
                                tempName = task_desc + " Part " + i;
                                task_description_arr.splice(edited_index + i - 1, 0, tempName);
                                task_estimation_arr.splice(edited_index + i - 1, 0, rem);
                                parent.insertBefore(new Task(tempName, rem), self);
                            }
                        }
                    }

                    else {
                        // pushed the information to arrays at the correct index
                        task_description_arr.splice(edited_index, 0, task_desc);
                        task_estimation_arr.splice(edited_index, 0, task_pomo_num);
                        parent.insertBefore(new Task(task_desc, task_pomo_est), self);
                    }
                    // Remove this task-input component
                    parent.removeChild(self);
                    edited_task_description = "";
                    return;
                }

                // if the task takes too many cycles, advice the user to break up the task
                if (task_pomo_num <= 4) {
                    // use insertbefore to allow creation of tasks at the original
                    // position of the task input boxes.
                    parent.insertBefore(new Task(task_desc, task_pomo_est), self);
                    task_description_arr.push(task_desc);
                    task_estimation_arr.push(task_pomo_est);
                }

                // if the task takes too many cycles, advice the user to break up the task
                else if (task_pomo_num > 4) {
                    // recommaend splitting up into more task
                    var r = confirm(
                        "The task takes too many cycles. Do you want to split it into more tasks?"
                    );
                    if (r == true) {
                        // calculate how many new sub tasks should be needed.
                        var breakNum = task_pomo_num / 4;
                        var rem = task_pomo_num % 4;
                        var i = 1;

                        for (i; i <= breakNum; i += 1) {
                            var tempName = task_desc + " Part " + i;
                            // record information of sub tasks to the global array
                            task_description_arr.push(tempName);
                            task_estimation_arr.push(4);
                            // add the i th sub task to the list
                            parent.insertBefore(new Task(tempName, 4), self);
                        }

                        // handels the last task and assign remaining cycles to it
                        if (rem != 0) {
                            tempName = task_desc + " Part " + i;
                            task_description_arr.push(tempName);
                            task_estimation_arr.push(rem);
                            parent.insertBefore(new Task(tempName, rem), self);
                        }
                    }
                }
                // Remove this task-input component
                parent.removeChild(self);
                edited_task_description = "";
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
