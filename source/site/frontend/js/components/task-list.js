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

      // Initialization
      this.running_list = this.shadowRoot.getElementById("running");
      this.pendning_list = this.shadowRoot.getElementById("pending-list");
      this.pendning_add = this.shadowRoot.getElementById("pending-head");
      this.finished_list = this.shadowRoot.getElementById("finished");

      this.add_task_button = this.shadowRoot.getElementById("add-task-button");

      // Event Listeners
      this.add_task_button.addEventListener("click", () => this.new_add_task());

      this.refresh_list.bind(this);
      this.new_add_task.bind(this);
    }

    refresh_list() {
      // clear up
      this.running_list.innerHTML = this.pendning_list.innerHTML = this.finished_list.innerHTML = '';

      let CTask = customElements.get("c-task");

      function create_task_element(task) {
        let ele = new CTask();
        ele.populate(task);
        ele.mode_view();
        if (task !== null && (is_running(task) || is_finished(task))){
          ele.mode_non_pending();
        }
        return ele;
      }


      // Add Pending
      window.user_data.task_list_data.filter(e => !is_running(e) && !is_finished(e)).forEach(e => this.pendning_list.appendChild(create_task_element(e)))

      // Add Running
      window.user_data.task_list_data.filter(e => is_running(e)).forEach(e => this.running_list.appendChild(create_task_element(e)))

      // Add Finished
      window.user_data.task_list_data.filter(e => !is_running(e) && is_finished(e)).forEach(e => this.finished_list.appendChild(create_task_element(e)))
    }

    new_add_task() {
      let CTask = customElements.get("c-task");
      let ele = new CTask();
      ele.mode_edit();
      this.pendning_list.append(ele);
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

  customElements.define("c-task-list", CTaskList);
  return CTaskList;
}
