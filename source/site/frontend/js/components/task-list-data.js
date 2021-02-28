export class Task_data {
    constructor(description, pomo_estimation) {
        this.description = description;
        this.pomo_estimation = Number(pomo_estimation);
        this.actual_pomo = 0;
        this.finished = false;
        this.running = false;
        this.current_cycle = 0;
        this.list_index = null;
        this.uid = create_uid(10);

        function create_uid(length){
            return Math.trunc(Math.random()*Math.pow(10,length));
        }
    }

    get UID(){
        return this.uid;
    }

    get desc(){
        return this.description;
    }

    get index(){
        return this.list_index;
    }

    get est(){
        return this.pomo_estimation;
    }

    get UID(){
        return this.uid;
    }

    get finish_status(){
        return this.finished;
    }

    get running_status(){
        return this.running;
    }

    get cycles(){
        return this.current_cycle;
    }

    get actual_cycles(){
        if (this.finished){
            return this.actual_pomo;
        }
        else{
            return null;
        }
    }

    finish(){
        this.finish = true;
        this.actual_pomo = this.current_cycle;
    }

    run(){
        this.running = true;
    }

    pause(){
        this.running = false;
    }

    increament_cycle(){
        this.current_cycle += 1;
    }

    set_task_info(new_desc,new_estimate){
        if (this.finished === false){
            this.description = new_desc;
            this.pomo_estimation = new_estimate;
        }
    }

}


export class Task_list_data {
    constructor() {
        this.current_task = null;
        this.pending_tasks = [];
        this.finished_tasks = [];
    }

    //@override 
    get length(){
        return this.pending_tasks.length;
    }

    pop_pending_to_current(){
        if (this.pending_tasks.length > 0){
            this.current_task = this.pending_tasks[0];
            this.pending_tasks.shift();
        }
    }

    insert_pending(index,task){
        this.pending_tasks.splice(index,0,task);
        console.log(this.pending_tasks);
    }

    finish_current(){
        this.pop_pending_to_current();
        this.finished_tasks.push(this.current_task);
    }

    get_current(){
        return this.current_task();
    }

    set_pending(index,task){
        this.pending_tasks.splice(index,0,task);
    }

    append_task(task){
        this.pending_tasks.push(task);
    }

}