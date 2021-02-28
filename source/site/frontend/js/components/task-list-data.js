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
     */
    finish() {
        this.finish = true;
        this.actual_pomo = this.current_cycle;
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
            for (let i = index; i < this.pending_tasks.length; i++) {
                this.pending_tasks[i].list_index -= 1;
            }
            this.pending_tasks.splice(index, 1,);
            console.log(UID);
            console.log(index);
            console.log(this.pending_tasks);
        }
    }

    pop_pending_to_current() {
        if (this.pending_tasks.length > 0) {
            this.current_task = this.pending_tasks[0];
            this.pending_tasks.shift();
        }
    }

    insert_pending(index, task) {
        for (let i = index; i < this.pending_tasks.length; i++) {
            this.pending_tasks[i].list_index += 1;
        }
        this.pending_tasks.splice(index, 0, task);
        console.log(this.pending_tasks);
    }

    finish_current() {
        this.pop_pending_to_current();
        this.finished_tasks.push(this.current_task);
    }

    get_current() {
        return this.current_task();
    }

    set_pending(index, task) {
        this.pending_tasks.splice(index, 0, task);
    }

    append_task(task) {
        this.pending_tasks.push(task);
    }

}