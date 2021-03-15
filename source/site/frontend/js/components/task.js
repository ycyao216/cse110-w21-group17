
import { create_uid } from "../utils.js";
/**
 * Enacts the constructor for the task element
 * @param {*} html - html component of task
 * @function
 */
export function define_task(html) {
    /**
     * Attaches the html for a task to the shadow dom and initializes it and its functions
     * @class
     */
    class CTask extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = html;

            // Put you initialization code here
            this.task_view = this.shadowRoot.getElementById("task-view");
            this.pomo_counter_view = this.shadowRoot.getElementById("pomo-counter-view");
            this.pomo_delete_btn = this.shadowRoot.getElementById("pomo-delete-btn");
            this.pomo_edit_btn = this.shadowRoot.getElementById("pomo-edit-btn");
            this.order_btn_up = this.shadowRoot.getElementById("order-btn-up");
            this.order_btn_down = this.shadowRoot.getElementById("order-btn-down");
            this.pomo_actual_counter = this.shadowRoot.getElementById("actual-pomo-counter");

            this.task_edit = this.shadowRoot.getElementById("task-edit");
            this.pomo_counter_edit = this.shadowRoot.getElementById("pomo-counter-edit");
            this.pomo_confirm_btn = this.shadowRoot.getElementById("pomo-confirm-btn");
            this.pomo_cancel_btn = this.shadowRoot.getElementById("pomo-cancel-btn");

            this.view_div = this.shadowRoot.getElementById("view");
            this.edit_div = this.shadowRoot.getElementById("edit");

            // event listeners
            this.pomo_delete_btn.addEventListener("click", (_) => this.remove_task());
            this.pomo_edit_btn.addEventListener("click", (_) => this.mode_edit());
            this.order_btn_up.addEventListener("click", () => this.move(-1));
            this.order_btn_down.addEventListener("click", () => this.move(1));
            this.pomo_confirm_btn.addEventListener("click", () => this.confirm());
            this.pomo_cancel_btn.addEventListener("click", () => this.cancel());

            // task data
            this.task = null;

            // bind this
            this.populate.bind(this);
            this.mode_view.bind(this);
            this.mode_edit.bind(this);
            this.remove_task.bind(this);
            this.confirm.bind(this);
            this.cancel.bind(this);
            this.move.bind(this);
            this.input_validation.bind(this);
        }


        // Display modes and animations
        /**
         * Change task to view mode
         * @function
         */
        mode_view() {
            this.view_div.style.display = "flex";
            this.edit_div.style.display = "none";
        }

        /**
         * Change task to edit mode
         * @function
         */
        mode_edit() {
            this.view_div.style.display = "none";
            this.edit_div.style.display = "flex";
            this.task_edit.focus();
            this.task_edit.select();
        }
        
        /**
         * Move task to non_pending mode
         * @function
         */
        mode_non_pending(){
            this.pomo_actual_counter.style.display = "flex";
            this.edit_div.style.display = "none";
            this.pomo_delete_btn.style.display="none";
            this.pomo_edit_btn.style.display="none";
            this.order_btn_up.style.display="none";
            this.order_btn_down.style.display="none";
        }

        // Values
        /**
         * Populate CTask with information
         * @param {*} task - task information to populate
         * @function
         */
        populate(task) {
            this.task = task;
            this.task_view.innerText = this.task_edit.innerText = task.description;
            this.pomo_counter_view.innerText = this.pomo_counter_edit.innerText = task.pomo_estimation;
            this.pomo_actual_counter.innerText = task.pomo_estimation > task.pomo_estimation_start ? 'LATE' : '';
        }

        // Buttons
        /**
         * Remove task from list entirely
         * @function
         */
        remove_task() {
            if (this.task !== null) {
                // perform delete in data
                window.delete_task(this.task.id);
            }
            this.parentNode.removeChild(this)
        }

        /**
         * Move task in the list by the amount passed
         * @param {*} offset - amount to move task in list (usually 1)
         * @function
         */
        move(offset) {
            window.move_task(this.task.id, offset);
        }

        /**
         * Remove task from list when user cancels input
         * @function
         */
        cancel() {
            if (this.task !== null) {
                this.mode_view();
            } else {
                this.remove_task();
            }
        }

        /**
         * After user confirms task splitting, split task into multiple parts and add back to list
         * @param {*} task_data - data of task to split up
         * @param {*} max_cycle - max amount of cycles per part
         * @function
         * @returns the list of tasks
         */
        split_task(task_data, max_cycle) {
            let list_of_tasks = [];
            let remaining_pomo_estimation = task_data.pomo_estimation;
            let remaining_cycles_completed = task_data.cycles_completed;
            while (remaining_pomo_estimation > 0) {
                let this_pomo_estimation = Math.min(remaining_pomo_estimation, max_cycle);
                let this_cycles_completed = Math.min(remaining_cycles_completed, max_cycle);
                list_of_tasks.push({
                    "id": create_uid(10),
                    "description": `${task_data.description} Part ${list_of_tasks.length + 1}`,
                    "pomo_estimation": this_pomo_estimation,
                    "cycles_completed": this_cycles_completed,
                })
                remaining_pomo_estimation -= this_pomo_estimation;
                remaining_cycles_completed -= this_cycles_completed;
            }

            list_of_tasks[0].id = task_data.id // preserve the original data id as the first array element
            return list_of_tasks;
        }

        /**
         * create's a list if doesn't exist or causes an update to list
         * @param {*} list_of_tasks - tasklist to check
         * @function
         */
        create_or_update(list_of_tasks) {
            list_of_tasks.forEach(x => {
                if (read_task(x.id) == null) {
                    // perform create in data
                    window.create_task(x);
                } else {
                    // perform edit in data
                    window.update_task(x);
                }
            });
        }

        /**
         * Bind task to tasklist when user confirms input
         * @function
         */
        confirm() {
            self.task = this.task; // bind self task to this task
            //Check for invalid inputs
            if (!this.input_validation()){
                return
            }
            // remove this node, as it will be created when data updated
            this.parentNode.removeChild(this);
            // populate the modified task
            let new_data = this.task === null ? {
                "id": create_uid(10),
                "description": null,
                "pomo_estimation": null,
                "pomo_estimation_start": null,
                "cycles_completed": 0,
            } : this.task;
            new_data.description = this.task_edit.value;
            new_data.pomo_estimation = parseInt(this.pomo_counter_edit.value);

            if (new_data.pomo_estimation > 4) {
                document.getElementById('c-modal').display_confirm("The task takes too many cycles. Do you want to split it into more tasks?",
                    () => {
                        this.create_or_update(this.split_task(new_data, 4));
                    },
                    () => {
                        this.create_or_update([new_data])
                    });
            } else {
                this.create_or_update([new_data]);
            }
        }


        /**
         * Validates the input user confirmed in the task to check before adding to list
         * @function
         * @returns boolean matching whether or not valid input
         */
        input_validation(){
            if (this.task_edit.value === ""){
                document.getElementById('c-modal').display_alert("Please enter an task description");
                return false;
            }
            else if (Number(this.pomo_counter_edit.value) === 0){
                document.getElementById('c-modal').display_alert("The task cannot take more 0 cycles");
                return false;
            }
            else if (Number(this.pomo_counter_edit.value) < 0){
                document.getElementById('c-modal').display_alert("The task cannot take negative cycles");
                return false;
            }
            else if (!Number.isInteger(Number(this.pomo_counter_edit.value))){
                document.getElementById('c-modal').display_alert("The task cannot take non-integer cycles");
                return false;
            }
            return true;
        }
    }
    customElements.define('c-task', CTask);
    return CTask;
} 