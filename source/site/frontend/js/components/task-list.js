import { Task_data, Task_list_data } from "./task-list-data.js";

export function define_task_list(html) {
  class CTaskList extends HTMLElement {
    constructor() {
      /**
       * Create a user interface for task list
       */
      super();
      const pending_id = "pending";
      const running_id = "running";
      const finished_id = "finished";

      /**
       * @todo decide whether to keep this runnin tab or not
       */
      let current_task_display = null;

      var shadow = this.attachShadow({
        mode: "open",
      });
      shadow.innerHTML = html;

      let document = this.shadowRoot;

      /**
       * Remove the empty text element in pending list html, so that the move
       * functionalities will not be affected
       * @param {*} _ dummy veriable
       */
      let remove_empty_text = (_) => {
        for (let i of document.getElementById(pending_id).childNodes) {
          if (i.nodeType === "TEXT") {
            document.getElementById(pending_id).remove(i);
          }
        }
      };

      function _class(name) {
        return document.querySelectorAll("." + name);
      }

      /**
       * Add a task to pending when initially created by the task list
       * Also changes the task list data accordingly.
       */
      function add_task_to_pending() {
        let task_list = document.getElementById(pending_id);
        task_list.insertBefore(
          new Task_input(window.task_list.length, null),
          document.getElementById("add-task-button")
        );
      }

      /**
       * Render only. Move the curret task from running to finished after
       * and display actual pomodoro sessions taken by the current task.
       * Does noting to empty pending.
       * @param {mixed} num_cycles If there is a current task, is the actual
       * pomodoro cycle taken by the current task. Null if there is no curent
       * task.
       */
      function upon_cycle_finish_render(num_cycles) {
        // Rendering procedures are the same for both natural and manual finish
        if (num_cycles !== null) {
          if (current_task_display !== null) {
            current_task_display.finish_task_render(num_cycles);
            document
              .getElementById(running_id)
              .removeChild(current_task_display);
            document
              .getElementById(finished_id)
              .appendChild(current_task_display);
          }
          current_task_display = null;
        }
        test_current_task_display();
      }

      /**
       * Update the task list (data and render) when a cycle naturally ends.
       */
      function upon_cycle_natural_finish() {
        let num_cycles = window.task_list.upon_cycle_finish();
        upon_cycle_finish_render(num_cycles);
      }

      /**
       * Force the finish of the current task. Record the immediate cycles taken
       * by the current task so far as the actual number of cycles taken.
       */
      function force_finish_task() {
        let num_cycles = window.task_list.upon_task_finish();
        upon_cycle_finish_render(num_cycles);
      }

      /**
       * Renders the task list when a cycle starts. Does nothing when
       * on break
       * Push the first task from pending to runninig. Does nothing when
       * pending is empty.
       */
      function upon_cycle_start_render() {
        /**
         * @todo Link this to actaul timer cycle type.
         */
        let is_working = window.task_list.upon_cycle_start(true);
        if (is_working) {
          let first_pending = document.getElementById(pending_id).childNodes[0];
          // while loop to ignore the empty textNodes
          while (first_pending.nodeType === 3) {
            first_pending = first_pending.nextSibling;
          }
          // Set current_task to null to prevent error on empty
          // pending list
          current_task_display = null;
          if (window.task_list.current_task !== null) {
            current_task_display = first_pending;
            document
              .getElementById(running_id)
              .appendChild(current_task_display);
          }
        }
        test_current_task_display();
      }

      /**
       * @note FOR TESTING PURPOSE ONLY
       * Update the current task infomration displayed on task list for
       * testing
       */
      function test_current_task_display() {
        let task_display = document.getElementById("curr_task_information");
        if (window.task_list.current_task !== null) {
          let stringified =
            "Task: " +
            window.task_list.current_task.desc +
            " || Status: " +
            window.task_list.current_task.cycles +
            " / " +
            window.task_list.current_task.est;
          task_display.innerHTML = stringified;
        } else {
          task_display.innerHTML = "No task running";
        }
      }

      document.addEventListener(window.TIME_FINISH_EVENT, (_) =>
        upon_cycle_natural_finish()
      );
      document.addEventListener(window.TIME_START_EVENT, (_) =>
        upon_cycle_start_render()
      );
      document.addEventListener(window.FINISH_EARLY_EVENT, (_) =>
        force_finish_task()
      );
      // Link all the button to corresponding callbacks
      document
        .getElementById("add-task-button")
        .addEventListener("click", add_task_to_pending);

      document
        .getElementById("test-btn-0")
        .addEventListener("click", function () {
          document.dispatchEvent(window.TIME_START);
        });
      document
        .getElementById("test-btn-1")
        .addEventListener("click", function () {
          document.dispatchEvent(window.TIME_FINISH);
        });
      document
        .getElementById("test-btn-2")
        .addEventListener("click", function () {
          document.dispatchEvent(window.FINISH_EARLY);
        });
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
      this.uid = data.UID;
      // styling component
      let styling = document.createElement("link");
      //styling element
      styling.setAttribute("rel", "stylesheet");
      styling.setAttribute("href", "/css/task-item.css");
      // shadow dom root
      let root = this.attachShadow({
        mode: "open",
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
      let actual_pomo = document.createElement("p");
      this.actual_pomo_ref = actual_pomo;
      actual_pomo.setAttribute("class", "pomo-counter");
      actual_pomo.style.display = "none";

      let order_button_container = document.createElement("div");
      this.obc_ref = order_button_container;
      order_button_container.setAttribute("class", "order-btn-container");
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
      function remove_task(self) {
        let parent = self.parentNode;
        parent.removeChild(self);
        window.task_list.remove(data.UID);
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
        let parent = self.parentNode;
        parent.insertBefore(new Task_input(data.index, data, true), self);
        remove_task(self);
      }

      /**
       * Move the current task up or down the task list
       * @param {*} self Reference to the current task
       * @param {*} direction Direction of movement: 0 for up, 1 for down
       */
      function move(self, direction) {
        window.task_list.move(data.list_index, direction);
        let parent = self.parentNode;
        if (direction === 0) {
          if (self.previousSibling !== null) {
            parent.insertBefore(self, self.previousSibling);
          }
        } else if (direction === 1) {
          if (self.nextElementSibling.id !== "add-task-button") {
            parent.insertBefore(self.nextElementSibling, self);
          }
        }
      }

      task_cancel_btn.addEventListener("click", (_) => remove_task(this));
      task_edit_btn.addEventListener("click", (_) => edit_task(this));
      up_button.addEventListener("click", () => move(this, 0));
      down_button.addEventListener("click", () => move(this, 1));
    }

    /**
     * Toggle the display of the task to be (naem,est,actual). Also
     * assign the display value of actual pomodoro sessions.
     * @param {*} finish_pomo The number of actual pomodoro sessions
     * taken by this task.
     */
    finish_task_render(finish_pomo) {
      // set all the other buttons to not display
      console.log(this.obc_ref.childNodes);
      for (let children of this.obc_ref.childNodes) {
        children.style.display = "none";
      }
      // set the actual pomodoro display.
      this.actual_pomo_ref.style.display = "initial";
      this.actual_pomo_ref.innerHTML = finish_pomo;
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
  customElements.define("c-task", Task);
  customElements.define("c-task-input", Task_input);
  return CTaskList;
}
