import { Task_data, Task_list_data } from "./task-list-data.js";

export function define_task_list(html) {
  class CTaskList extends HTMLElement {
    constructor() {
      /**
       * Create a user interface for task list
       */
      super();

      var shadow = this.attachShadow({
        mode: "open",
      });
      shadow.innerHTML = html;

      let document = this.shadowRoot;

      function _class(name) {
        return document.querySelectorAll("." + name);
      }

      this.running_list = this.shadowRoot.getElementById("running");
      this.pendning_list = this.shadowRoot.getElementById("pending");
      this.finished_list = this.shadowRoot.getElementById("finished");
      this.refresh_list.bind(this);
    }

    refresh_list() {
      // clear up
      this.running_list.innerHTML = this.pendning_list.innerHTML = this.finished_list.innerHTML = '';

      console.log(this.pendning_list);

      let CTask = customElements.get("c-task");

      function create_task_element(task){
        let ele = new CTask();
        ele.populate(task);
        ele.mode_view();
        return ele;
      }

      // Add Pending
      window.user_data.task_list_data.filter(e => e.cycles_completed < e.pomo_estimation).forEach(e => this.pendning_list.appendChild(create_task_element(e)))

      // Add Running
      window.user_data.task_list_data.filter(e => e.id === window.current_task().id).forEach(e => this.running_list.appendChild(create_task_element(e)))

      // Add Finished
      window.user_data.task_list_data.filter(e => e.cycles_completed >= e.pomo_estimation).forEach(e => this.finished_list.appendChild(create_task_element(e)))
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


  /**
   * The task input prompt that allows the user to input for the task
   */
  class Task_input extends HTMLElement {
    constructor(index, caller, editing) {
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
        mode: "open",
      });
      // outter container for input boxes and buttons
      let task_input_container = document.createElement("div");
      task_input_container.setAttribute("class", "task-container");
      // input for task description
      let task_desc_in = document.createElement("textarea");
      task_desc_in.setAttribute("class", "task");
      // task_desc_in.setAttribute("type", "text");
      // input for task pomo estimation, treat input as string
      let task_estimate_in = document.createElement("input");
      task_estimate_in.setAttribute("class", "pomo-counter");
      task_estimate_in.setAttribute("type", "number");
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

      root.appendChild(styling);
      task_input_container.appendChild(task_desc_in);
      task_input_container.appendChild(task_estimate_in);
      task_input_container.appendChild(confirm_btn);
      task_input_container.appendChild(cancel_btn);

      root.appendChild(task_input_container);

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
              let new_task_data = new Task_data(
                tempName,
                4,
                insert_index + i - 1
              );
              let new_task = new Task(new_task_data);
              // record information of sub tasks to the global array
              window.task_list.insert_pending(
                insert_index + i - 1,
                new_task_data
              );
              parent.insertBefore(new_task, self);
            }

            // handels the last task and assign remaining cycles to it
            if (rem != 0) {
              tempName = task_desc + " Part " + i;
              let new_task_data = new Task_data(
                tempName,
                rem,
                insert_index + i - 1
              );
              let new_task = new Task(new_task_data);
              // record information of sub tasks to the global array
              window.task_list.insert_pending(
                insert_index + i - 1,
                new_task_data
              );
              parent.insertBefore(new_task, self);
            }
          }
        } else if (task_pomo_num <= 4) {
          // pushed the information to arrays at the correct index
          let new_task_data = new Task_data(
            task_desc,
            task_pomo_est,
            insert_index
          );
          let new_task = new Task(new_task_data);
          // record information of sub tasks to the global array
          window.task_list.insert_pending(insert_index, new_task_data);
          parent.insertBefore(new_task, self);
        }
        // Remove this task-input component
        parent.removeChild(self);
        return;
      }

      /**
       * Remove the task input box without adding a new task
       * @param {*} self The refernece to the task input box.
       */
      function cancel_task(self) {
        let parent = self.parentNode;
        if (editing) {
          let new_task = new Task(caller);
          // record information of sub tasks to the global array
          caller.list_index += 1;
          window.task_list.insert_pending(insert_index, caller);
          parent.insertBefore(new_task, self);
        }
        parent.removeChild(self);
      }

      confirm_btn.addEventListener("click", () => confirm_task(this));
      cancel_btn.addEventListener("click", () => cancel_task(this));
    }
  }

  customElements.define("c-task-list", CTaskList);
  customElements.define("c-task-input", Task_input);
  return CTaskList;
}
