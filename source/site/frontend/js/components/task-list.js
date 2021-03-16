/**
 * Enacts the constructor for the task list element
 * @param {*} html - html element of task list
 * @function
 */
export function define_task_list(html) {
  /**
   * Attaches the task list's html to the shadow dom and initializes it and its functions
   * @class
   */
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
      /**
       * Call new_add_task when clicking the add task button
       * @event - click add task
       */
      this.add_task_button.addEventListener("click", () => this.new_add_task());

      this.refresh_list.bind(this);
      this.new_add_task.bind(this);
    }

    /**
     * Add a task element to the list
     * @param {*} task - information on task to add to list
     * @function
     * @returns task element
     */
    create_task_element(task) {
      let CTask = customElements.get("c-task");
      let ele = new CTask();
      ele.populate(task);
      return ele;
    }

    /**
     * Updates the list. Usually for interactions between timer and tasklist.
     * @function
     */
    refresh_list() {
      // clear up
      this.running_list.innerHTML = this.pendning_list.innerHTML = this.finished_list.innerHTML = '';
      // Add Pending
      window.user_data.task_list_data.filter(e => !is_running(e) && !is_finished(e)).forEach(e => this.pendning_list.appendChild(this.create_task_element(e)))

      // Add Running
      window.user_data.task_list_data.filter(e => is_running(e)).forEach(e => this.running_list.appendChild(this.create_task_element(e)))

      // Add Finished
      window.user_data.task_list_data.filter(e => !is_running(e) && is_finished(e)).forEach(e => this.finished_list.appendChild(this.create_task_element(e)))
    }

    /**
     * Append task to the list
     * @function
     */
    new_add_task() {
      let CTask = customElements.get("c-task");
      let ele = new CTask();
      ele.mode_edit();
      this.pendning_list.append(ele);
    }

    /**
     * Animation for timer sliding in
     * @function
     */
    enter_animate() {
      let document = this.shadowRoot;
      document.getElementById("side-bar").style.left = "60%";
    }

    /**
     * Animation for timer sliding out
     * @function
     */
    leave_animate() {
      let document = this.shadowRoot;
      document.getElementById("side-bar").style.left = "100%";
    }
  }

  customElements.define("c-task-list", CTaskList);
  return CTaskList;
}
