let mock_data = {
    "task_list_data": [
        {
            "id": "12345678-2143-49e4-8768-b0d54eba43f8",
            "description": "task 0",
            "pomo_estimation": 4,
            "cycles_completed": 4,
        },
        {
            "id": "1579afed-2143-49e4-8768-b0d54eba43f8",
            "description": "task 1",
            "pomo_estimation": 4,
            "cycles_completed": 0,
        },
        {
            "id": "97bf356c-3910-45f5-950e-34acc6319b83",
            "description": "task 2",
            "pomo_estimation": 2,
            "cycles_completed": 0,
        }
    ],
    "user_log": {
        "last_active": "",
        "timer_state": {
            "current": "timer_init",
            "previous": "timer_during_countdown"
        },
        "current_task": "1579afed-2143-49e4-8768-b0d54eba43f8",
        "break_status": {
            "break": "short_break",
            "cycles": 0
        },
        "log": [
            "1579afed-2143-49e4-8768-b0d54eba43f8",
            "short_break",
        ],
        "online": true
    },
    "settings": {
        "working_sec": 3,
        "short_break_sec": 1,
        "short_break_cycles": 1,
        "long_break_sec": 2,
        "long_break_cycles": 1,
        "allow_emergency_stop": true
    }
}


function edit_btn(idx) { return cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(idx).shadow().find('#pomo-edit-btn'); }
function cycle_input(idx) { return cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(idx).shadow().find('#pomo-counter-edit'); }
function description_input(idx) { return cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(idx).shadow().find('#task-edit'); }
function confirm_btn(idx) { return cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(idx).shadow().find('#pomo-confirm-btn'); }
function cancel_btn(idx) { return cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(idx).shadow().find('#pomo-cancel-btn'); }
function modal_close() { return cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close'); }
function modal_confirm() { return cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('#confirm-button'); }
function modal_cancel() { return cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('#cancel-button'); }

function get_tasklist() { return cy.get("#c-task-list").shadow(); }
/**
 * Toggles the task list
 */
export function toggle_tasklist() {
    cy.get("#tasklist-btn").shadow().find("#button").click();
    cy.wait(300);
}

function close_modal() {
    return cy.get("#c-modal").shadow().find("#close").click();
}




/**
 * Create and add a new task.
 * @param {String} task_des The description of task to be added
 * @param {Number} pomo_est The number of cycles estimated
 * @param {Array[Numbers]} task_index IMPORTANT This is an array of number. The
 * array should only contain one element. The array well keep track of the index
 * of the task to be added. This is a way of mimicing pass by reference.
 */
export function add_new_task(task_des, pomo_est, task_index) {
    get_tasklist().find("#add-task-button").click();
    get_task(task_index[0]).find("#task-edit").click();
    get_task(task_index[0]).find("#task-edit").should('not.be.disabled').type(task_des, { force: true });
    get_task(task_index[0]).find("#pomo-counter-edit").click();
    get_task(task_index[0]).find("#pomo-counter-edit").should('not.be.disabled').type(pomo_est, { force: true });
    get_task(task_index[0]).find("#pomo-confirm-btn").click();
    task_index[0] += 1;
}

describe("Task-list related tests", () => {
    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.setItem('user_data', JSON.stringify(mock_data))
            cy.visit('http://localhost:3000');
            cy.wait(500);
            close_modal();
        })
    });

    it('Refresh tasks', () => {
        cy.get("#tasklist-btn").shadow().find("#button").click().then(() => {
            cy.get('#c-task-list').shadow().find('#pending-add').should('have.length', 1);
            cy.get('#c-task-list').shadow().find('#running').should('have.length', 1);
            cy.get('#c-task-list').shadow().find('#finished').should('have.length', 1);
        });
    });

    it('Task list expand/retract', () => {
        cy.get("#tasklist-btn").shadow().find("#button").click();
        // wait for animation
        cy.wait(400);
        get_tasklist().find("#side-bar").should("have.css", 'left', "600px");
        cy.wait(400);
        cy.get("#tasklist-btn").shadow().find("#button").click();
        get_tasklist().find("#side-bar").should("have.css", 'left', "1000px");
    });

    it('Add new task and refresh', () => {
        cy.window().then((win) => {
            cy.get("#tasklist-btn").shadow().find("#button").click();
            cy.get('#c-task-list').shadow().find('#add-task-button').click();

            cycle_input(1).type(2);
            description_input(1).type('test 2');
            confirm_btn(1).click();
        }).then(() => {
            cy.window().then((win) => {
                expect(win.user_data.task_list_data[3].description).to.equal('test 2');
                expect(win.user_data.task_list_data[3].pomo_estimation).to.equal(2);
            })
        });
    });


});