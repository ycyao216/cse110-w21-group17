// /**
//  * Quickly get the shadow dom root of task list
//  * @returns tasklist cypress chainer
//  */
// export function get_tasklist(){
//     return cy.get("#c-task-list").shadow();
// }

// /**
//  * Get the shadow root of the 'index'-th task in the task list
//  * @param {Number} index The index of the task to get 
//  * @returns The 'index'-th task's shadow root
//  */
// export function get_task(index){
//     return get_tasklist().find("c-task").eq(index).shadow();
// }

// /**
//  * Toggles the task list
//  */
// export function toggle_tasklist(){
//     cy.get("#tasklist-btn").shadow().find("#button").click();
//     cy.wait(300);
// }

// /**
//  * Create and add a new task.
//  * @param {String} task_des The description of task to be added
//  * @param {Number} pomo_est The number of cycles estimated
//  * @param {Array[Numbers]} task_index IMPORTANT This is an array of number. The
//  * array should only contain one element. The array well keep track of the index
//  * of the task to be added. This is a way of mimicing pass by reference.
//  */
// export function add_new_task(task_des,pomo_est,task_index){
//     get_tasklist().find("#add-task-button").click();
//     get_task(task_index[0]).find("#task-edit").click();
//     get_task(task_index[0]).find("#task-edit").should('not.be.disabled').type(task_des, {force: true});
//     get_task(task_index[0]).find("#pomo-counter-edit").click();
//     get_task(task_index[0]).find("#pomo-counter-edit").should('not.be.disabled').type(pomo_est, {force: true});
//     get_task(task_index[0]).find("#pomo-confirm-btn").click();
//     task_index[0] += 1;
// }

// describe("Task-list related tests",()=>{
//     beforeEach(()=>{
//         cy.visit('http://127.0.0.1:3000/');
//         // wait for loading
//         cy.wait(1000);
//         if (document.querySelector("#c-modal")!== null){
//             cy.get("#c-modal").shadow().find("#close").click();
//         }
//     });

//     it('Task list expand/retract',()=>{
//         cy.get("#tasklist-btn").shadow().find("#button").click();
//         // wait for animation
//         cy.wait(400);
//         get_tasklist().find("#side-bar").should("have.css",'left',"600px");
//         cy.wait(400);
//         cy.get("#tasklist-btn").shadow().find("#button").click();
//         get_tasklist().find("#side-bar").should("have.css",'left',"1000px");
//     });

//     it('Add new task and refresh',()=>{
//         // This is holds the index of the next task.
//         const task_count = [];
//         task_count.push(0);
//         toggle_tasklist();
//         add_new_task("test 1", 3,task_count);
//         add_new_task("test 2", 2, task_count);
//         get_task(0).find("#pomo-delete-btn").click();
//         /**
//          * @fixme This doesn't work for now. You can uncomment and see the error
//          * message
//          */
//         // expect(get_task(0).find('#task-view')).to.contain('test 1');
//         // expect(get_task(0).find('#pomo-counter-view')).to.contain("3");
//         // expect(get_task(1).find('#task-view')).to.contain('test 2');
//         // expect(get_task(1).find('#pomo-counter-view')).to.contain("2");
//     });
// });