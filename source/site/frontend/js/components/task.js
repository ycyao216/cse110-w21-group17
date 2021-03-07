
import { create_uid } from "../utils.js";

export function define_task(html) {
    class CTask extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = html;

            let document = this.shadowRoot;



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
            this.pomo_delete_btn.addEventListener("click", (_) => this.remove_task());
            this.pomo_edit_btn.addEventListener("click", (_) => this.mode_edit());
            this.order_btn_up.addEventListener("click", () => this.move(-1));
            this.order_btn_down.addEventListener("click", () => this.move(1));
            this.pomo_confirm_btn.addEventListener("click", () => this.confirm());
            this.pomo_cancel_btn.addEventListener("click", () => this.mode_view());

            // task data
            this.task = null;

            // bind this
            this.populate.bind(this);
            this.mode_view.bind(this);
            this.mode_edit.bind(this);
            this.remove_task.bind(this);
            this.confirm.bind(this);
            this.move.bind(this);
        }


        // Display modes and animations
        mode_view() {
            this.view_div.style.display = "initial";
            this.edit_div.style.display = "none";
        }

        mode_edit() {
            this.view_div.style.display = "none";
            this.edit_div.style.display = "initial";
        }

        // Values
        populate(task) {
            this.task = task;
            this.task_view.innerText = this.task_edit.innerText = task.description;
            this.pomo_counter_view.innerText = this.pomo_counter_edit.innerText = task.pomo_estimation;
        }

        // Buttons
        remove_task() {
            if (this.task !== null) {
                // perform delete in data
                window.delete_task(this.task.id);
            }
            this.parentNode.removeChild(this)
        }

        move(offset) {
            window.move_task(this.task.id, offset);
        }


        confirm() {
            self.task = this.task; // bind self task to this task
            this.parentNode.removeChild(this); // remove this node, as it will be created when data updated
            let new_data = this.task === null ? {
                "id": create_uid(10),
                "description": null,
                "pomo_estimation": null,
                "cycles_completed": 0,
            } : this.task;
            new_data.description = this.task_edit.value;
            new_data.pomo_estimation = this.pomo_counter_edit.value;

            function split_task(task_data, max_cycle) {
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
                if (list_of_tasks.length == 0) {
                    list_of_tasks.push(task_data); //rarely happens when user expects 0 cycles for a task
                } else {
                    list_of_tasks[0].id = task_data.id // preserve the original data id as the first array element
                }
                return list_of_tasks;
            }

            function create_or_update(list_of_tasks) {
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

            if (new_data.pomo_estimation > 4) {
                document.getElementById('c-modal').display_confirm("The task takes too many cycles. Do you want to split it into more tasks?",
                    () => {
                        create_or_update(split_task(new_data, 4));
                    },
                    () => {
                        create_or_update([new_data])
                    });
            } else {
                create_or_update([new_data]);
            }
        }
    }
    customElements.define('c-task', CTask);
    return CTask;
}