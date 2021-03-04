export class Task_data {
  /**
   * Creates a task
   * @param {*} description The task description
   * @param {*} pomo_estimation The testimated pomodoro cycle number
   * @param {*} list_index The position of the task in the penidng list
   */
  constructor(description, pomo_estimation, list_index) {
    // UID of the task. Used to distinguish task with same other properties
    this.uid = create_uid(10);
    this.description = description;
    this.pomo_estimation = Number(pomo_estimation);
    // The actual number of pomodoro cycles spent on this task
    this.actual_pomo = 0;
    // Whether the task is finished
    this.finished = false;
    // Whether more time is needed
    this.overtime = false;
    // Whether the task is running
    this.running = false;
    // The current number of cycles spent on this task
    this.current_cycle = 0;
    // The number of extra cycles
    this.extra_cycles = 0;
    this.list_index = list_index;

    /**
     * Helper function to randomly create UID
     * @param {*} length Length of the UID.
     * @returns {number} The UID of length.
     */
    function create_uid(length) {
      return Math.trunc(Math.random() * Math.pow(10, length));
    }
  }

  /**
   * Set the overtime property to true
   */
  make_overtime(){
    this.overtime = true;
  }

  /**
   * Set the overtime property to false
   */
  remove_overtime(){
    this.overtime = false;
  }
  /**
   * @type {boolean} Whether or not the task is overtime
   */
  get overtime_status(){
    return this.overtime;
  }
  /**
   *@type {number} The UID
   */
  get UID() {
    return this.uid;
  }

  /**
   * @type {string} The description of the task
   */
  get desc() {
    return this.description;
  }

  /**
   * @type {number} The index of the task in the pending task list.
   */
  get index() {
    return this.list_index;
  }

  /**
   * @type {number} The estimated timer cycles needed for this task
   */
  get est() {
    return this.pomo_estimation;
  }

  /**
   * @type {boolean} Whether the task is finished
   */
  get finish_status() {
    return this.finished;
  }

  /**
   * @type {boolean} Whether the task is running
   */
  get running_status() {
    return this.running;
  }

  /**
   * @type {number} The number of pomodoro cycles currently spent on this task
   */
  get cycles() {
    return this.current_cycle;
  }

  /**
   * @type {mixed} The current pomodoro cycle number if the task finished,
   * null otherwise.
   */
  get actual_cycles() {
    if (this.finished) {
      return this.actual_pomo;
    } else {
      return null;
    }
  }

  /**
   * Set the task to finish, and update the actual pomodoro cycles spent with
   * the timer cycles spent so far.
   * @returns {number} The actual pomodoro cycle number of the task;
   */
  finish() {
    this.finished = true;
    this.actual_pomo = this.current_cycle;
    return this.actual_pomo;
  }

  unfinish(){
    this.finished = false;
  }

  /**
   * Set task to running
   */
  run() {
    this.running = true;
  }

  /**
   * Set the task to not running
   */
  pause() {
    this.running = false;
  }

  add_more_cycle(){
    if (this.pomo_estimation < 5){
      this.pomo_estimation += 1;
    }
  }

  /**
   * Add one cycle to the task's current spent cycles
   */
  increament_cycle() {
    this.current_cycle += 1;
    window.dispatchEvent(window.UPDATE_CURRENT_TASK);
  }

  stringify(){
    return "Task Name: " + this.desc + "\nProgress: " + this.current_cycle + " of " + this.est + " cycles done";
  }
}

export class Task_list_data {
  /**
   * Create a task list to store data of tasks
   */
  constructor() {
    this.current_task = null;
    this.pending_tasks = [];
    this.finished_tasks = [];
  }

  /**
   * @type {mixed} Get the current task if exist. If null, current task is not
   * set.
   */
  get current() {
    return this.current_task;
  }

  /**
   * Get the length of the pending task list
   * @return {number} The length of the pending task list
   */
  get length() {
    return this.pending_tasks.length;
  }

  /**
   * Find a task object with a UID from the pending task list.
   * @param {number} UID The uid of the task to be found
   * @return {mixed} The Task object if foudn, null if unfound.
   */
  find(UID) {
    for (let tasks of this.pending_tasks) {
      if (tasks.UID === UID) {
        return tasks;
      }
    }
    return null;
  }

/**
 * Move a task from pending list one index eariler or later.
 * @param {number} task_index The index of task in pending list to be moved
 * @param {number} direction 0 for moving task so that it will be dequeued from the
 * pending list eariler than before; 1 if later tha before
 */
  move(task_index, direction){
    let temp = this.pending_tasks[task_index];
    if (direction === 0 && task_index > 0){
      this.pending_tasks[task_index].list_index -=1;
      this.pending_tasks[task_index-1].list_index +=1;
      this.pending_tasks.splice(task_index,1);
      console.log(temp);
      this.pending_tasks.splice(task_index - 1, 0, temp);
      console.log(this.pending_tasks);

    }
    else if (direction === 1 && task_index < this.pending_tasks.length -1){
      this.pending_tasks[task_index].list_index +=1;
      this.pending_tasks[task_index+1].list_index -=1;
      this.pending_tasks.splice(task_index,1);
      this.pending_tasks.splice(task_index + 1, 0, temp);
    }
    localStorage.setItem('pending_tasks_storage', JSON.stringify(this.pending_tasks));
  }

  /**
   * Remove a task object with a UID from the pending task list. Does nothing
   * the task UID is not found.
   * @param {number} UID THe uid of the task to be removed
   */
  remove(UID) {
    let task = this.find(UID).list_index;
    if (task !== null) {
      let index = task.list_index;
      // Decrement index of later tasks
      for (let i = index; i < this.pending_tasks.length; i++) {
        this.pending_tasks[i].list_index -= 1;
      }
      this.pending_tasks.splice(index, 1);
    }
    localStorage.setItem('pending_tasks_storage', JSON.stringify(this.pending_tasks));
  }

  /**
   * Insert a task at a position of pending list
   * @param {number} index The index of pending list where the task is going
   * to be inserted
   * @param {Task_data} task The task data to be added
   */
  insert_pending(index, task) {
    // Increament the index of later tasks
    for (let i = index; i < this.pending_tasks.length; i++) {
      this.pending_tasks[i].list_index += 1;
    }
    this.pending_tasks.splice(index, 0, task);
    localStorage.setItem('pending_tasks_storage', JSON.stringify(this.pending_tasks));
  }

  /**
   * Operations done to the task list when the current task is finished.
   * Move the current task, if there is one, to finish. Set its finish
   * status to true, and set its actual pomodoro session number data
   * @returns {mixed}The actual cycle number of the current task. If there is
   * no current task, return null.
   */
  upon_task_finish() {
    // Order of operation does matter!!
    if (this.current_task != null) {
      /**
       * @fixme This is actually a duplicated call of current_task.finish().
       */
      let actual = this.current_task.finish();
      this.finished_tasks.push(this.current_task);
      this.current_task = null;
      localStorage.setItem('finished_tasks_storage', JSON.stringify(this.finished_tasks));
      localStorage.setItem('current_task_storage', JSON.stringify(this.current_task));
      return actual;
    }
    return null;
  }

  /**
   * Callback for add on cycle button. Set the overtime variable to true
   */
  upon_overtime(){
    if (this.current != null && this.current_task.finish) {
      this.current.unfinish();
      this.current.make_overtime();
      this.current.add_more_cycle();
      window.dispatchEvent(window.UPDATE_CURRENT_TASK);
      localStorage.setItem('current_task_storage', JSON.stringify(this.current_task));
    }
  }

  /**
   * Operations done to the task list when a cycle is finished
   * Increment the pomo counter of the current task. If the task is finished,
   * go to the task finish procedure. If the task is overtime, increase the extra
   * cycle count.
   * @return {number} The actual cycle number of the current task if the current
   * task normally finishes. -2 if the task is overtime. -1 if the current task
   * is null, -3 if the task is not finished (has more cycle to go to reach est)
   */
  upon_cycle_finish() {
      if (this.current_task.finish_status !== true){
        this.current_task.increament_cycle();
        if (
          this.current_task.current_cycle >= this.current_task.pomo_estimation
        ) {
          var temp = this.current_task.finish();
          localStorage.setItem('current_task_storage', JSON.stringify(this.current_task));
          return temp;

        }
        localStorage.setItem('current_task_storage', JSON.stringify(this.current_task));
        return -3;
      }
  }

  /**
   * Operations to take when the next task is starting
   * Pop the first pending task and add to the current task. Does nothing when
   * taking a break.
   * @param {boolean} is_woring Whether the timer is in working mode. (not using
   * for now)
   * @return {boolean} Relays the timer cycle type. (not using for now)
   */
  upon_next_task_start(is_working) {
    if (is_working) {
      if (this.pending_tasks.length > 0 && this.current_task === null) {
        this.pending_tasks[0].running = true;
        // Overwrite the existing current task.
        this.current_task = this.pending_tasks[0];
        this.pending_tasks.shift();
        // Updates current task display
        window.dispatchEvent(window.UPDATE_CURRENT_TASK);
        localStorage.setItem('pending_tasks_storage', JSON.stringify(this.pending_tasks));
        localStorage.setItem('current_task_storage', JSON.stringify(this.current_task));
      }
      // Attempt to add event for making empty task display when no pending tasks
      else if (this.pending_tasks.length === 0){
        window.dispatchEvent(window.NO_RUNNING);
      }
    }
    return is_working;
  }

  /**
   * Operations to take when break ends:
   * Finish the current task if it is finished and not overtime
   * Push the next task from pending to running if there is more task to do
   * @returns {number} 0 if current task finished and next task poped. -3 if
   * current task finished but no next task. 02 if current task overtime, -1 if
   * no current task.
   */
  upon_break_ends(){
    if (this.current_task !== null){
      window.current_task_code = this.upon_cycle_finish();
        if (this.current.finish_status) {
          // if (this.current.overtime_status){
          //   return -2;
          // }
          this.upon_task_finish();
          if (this.pending_tasks.length > 0){
            this.upon_next_task_start();
            return -3;
          }
          return 0;
        }
    }
    return -1;
  }

  /**
   * using local storage to recover curret_task, pending_tasks, and
   * finished_tasks
   */
  read_local_storage(){
    // recorver the infromation of current_task
    var temp_current_task = JSON.parse(localStorage.getItem('current_task_storage'));
    if(temp_current_task == null){
      this.current_task = null;
    }

    else{
      var temp_C = new Task_data(temp_current_task.description,
        Number(temp_current_task.pomo_estimation),
        temp_current_task.list_index
      );
      temp_C.uid = temp_current_task.uid;
      temp_C.actual_pomo = Number(temp_current_task.actual_pomo);
      temp_C.finished = temp_current_task.finished;
      temp_C.overtime = temp_current_task.overtime;
      temp_C.running = temp_current_task.running;
      temp_C.current_cycle = Number(temp_current_task.current_cycle);
      temp_C.extra_cycles = Number(temp_current_task.extra_cycles);
      this.current_task = temp_C;
    }

    // record the information of pending_tasks
    var temp_pending_tasks = JSON.parse(localStorage.getItem('pending_tasks_storage'));
    var temp_array_p = [];
    for(var i = 0; i < temp_pending_tasks.length; i += 1){
      var temp_Ptask = new Task_data(temp_pending_tasks[i].description,
        Number(temp_pending_tasks[i].pomo_estimation),
        temp_pending_tasks[i].list_index
      );

      temp_Ptask.uid = temp_pending_tasks[i].uid;
      temp_Ptask.actual_pomo = Number(temp_pending_tasks[i].actual_pomo);
      temp_Ptask.finished = temp_pending_tasks[i].finished;
      temp_Ptask.overtime = temp_pending_tasks[i].overtime;
      temp_Ptask.running = temp_pending_tasks[i].running;
      temp_Ptask.current_cycle = Number(temp_pending_tasks[i].current_cycle);
      temp_Ptask.extra_cycles = Number(temp_pending_tasks[i].extra_cycles);
      temp_array_p.push(temp_Ptask);
    }
    this.pending_tasks = temp_array_p;

    // recover the infromation of finished_tasks
    var temp_finished_tasks = JSON.parse(localStorage.getItem('finished_tasks_storage'));
    var temp_array_f = [];
    for(var j = 0; j < temp_finished_tasks.length; j += 1){
      var temp_Ftask = new Task_data(temp_finished_tasks[j].description,
        Number(temp_finished_tasks[j].pomo_estimation),
        temp_finished_tasks[j].list_index
      );

      temp_Ftask.uid = temp_finished_tasks[j].uid;
      temp_Ftask.actual_pomo = Number(temp_finished_tasks[j].actual_pomo);
      temp_Ftask.finished = temp_finished_tasks[j].finished;
      temp_Ftask.overtime = temp_finished_tasks[j].overtime;
      temp_Ftask.running = temp_finished_tasks[j].running;
      temp_Ftask.current_cycle = Number(temp_finished_tasks[j].current_cycle);
      temp_Ftask.extra_cycles = Number(temp_finished_tasks[j].extra_cycles);
      temp_array_f.push(temp_Ftask);
    }
    this.finished_tasks = temp_array_f;
  }
}
