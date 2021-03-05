
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

        move(offset){
            window.move_task(this.task.id, offset);
        }


        confirm() {
            this.parentNode.removeChild(this); // remove this node, as it will be created when data updated
            let new_data = this.task === null ? {
                "id": create_uid(10),
                "description": null,
                "pomo_estimation": null,
                "cycles_completed": 0,
                "last_timer_start": null,
            } : this.task;
            new_data.description = this.task_edit.value;
            new_data.pomo_estimation = this.pomo_counter_edit.value;
            if (this.task == null) {
                // perform create in data
                window.create_task(new_data);
            } else {
                // perform edit in data
                window.update_task(new_data);

            }
        }
    }
    customElements.define('c-task', CTask);
    return CTask;
}