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
        // Whether the task is running
        this.running = false;
        // The current number of cycles spent on this task
        this.current_cycle = 0;
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
        }
        else {
            return null;
        }
    }

    /**
     * Set the task to finish, and update the actual pomodoro cycles spent with
     * the timer cycles spent so far.
     * @returns {number} The actual pomodoro cycle number of the task;
     */
    finish() {
        this.finish = true;
        this.actual_pomo = this.current_cycle;
        return this.actual_pomo;
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

    /**
     * Add one cycle to the task's current spent cycles
     */
    increament_cycle() {
        this.current_cycle += 1;
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
    get current(){
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
            this.pending_tasks.splice(index, 1,);
        }
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
        if (this.current_task != null){
            let actual=this.current_task.finish();
            this.finished_tasks.push(this.current_task);
            this.current_task = null;
            return actual;
        }
        return null;
    }

    /**
     * Operations done to the task list when a cycle is finished
     * Increment the pomo counter of the current task. If the task is finished,
     * go to the task finish procedure. 
     * @return {mixed} The actual cycle number of the current task. If there is
     * no current task, return null.
     */
    upon_cycle_finish() {
        if (this.current_task !== null){
            this.current_task.increament_cycle();
            if (this.current_task.current_cycle >= this.current_task.pomo_estimation){
                return this.upon_task_finish();
            }
        }
        return null;
    }

    /**
     * Operations done to the task list when the timer starts
     * Pop the first pending task and add to the current task. Does nothing when
     * taking a break.
     * @param {boolean} is_woring Whether the timer is in working mode.
     * @return {boolean} Relays the timer cycle type.
     */
    upon_cycle_start(is_working){
        if (is_working){
            if (this.pending_tasks.length > 0) {
                this.pending_tasks[0].running = true;
                // Overwrite the existing current task.
                this.current_task = this.pending_tasks[0];
                this.pending_tasks.shift();
            }
        }
        return is_working;
    }
}