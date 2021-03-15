/// <reference types="cypress" />


let mock_data = {
  "task_list_data": [
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
  "user_log": [
    {
      "login_timestamp": "",
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
    }
  ],
  "settings": {
    "working_sec": 6,
    "short_break_sec": 3,
    "short_break_cycles": 3,
    "long_break_sec": 5,
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



context('Window', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('user_data', JSON.stringify(mock_data))
      cy.visit('http://localhost:3000');
      cy.wait(100);
      cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
        .click();
      cy.get('#tasklist-btn').click();
    })
  })

  it('task.js - test click edit then cancel', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cancel_btn(0).click();
    });
  });

  it('task.js - test split tasks', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).type(10);
      description_input(0).type('task1');
      confirm_btn(0).click();
      modal_confirm().click();
    });
  });


  it('task.js - test negative cycle count', () => {
    cy.window().then((win) => {
      edit_btn(0).click()
      cycle_input(0).type(-1);
      confirm_btn(0).click();
      modal_close().click();
    });
  });

  it('task.js - test invalid cycle count 0', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).type(0);
      description_input(0).type('task1');
      confirm_btn(0).click();
      modal_close().click();
    });
  });

  it('task.js - test invalid cycle count -1', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).type(-1);
      description_input(0).type('task1');
      confirm_btn(0).click();
      modal_close().click();
    });
  });

  it('task.js - test invalid cycle count 1.5', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).type(1.5);
      description_input(0).type('task1');
      confirm_btn(0).click();
      modal_close().click();
    });
  });

  it('task.js - test invalid task description nothing', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).type(10);
      confirm_btn(0).click();
      modal_close().click();
    });
  });



  it('task.js - test many cycles but not split input', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).type(11);
      description_input(0).type('dd2');
      confirm_btn(0).click();
      modal_cancel().click();
    });
  });


  it('task.js - test valid input', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).type(3);
      description_input(0).type('dd3');
      confirm_btn(0).click();
    });
  });


  it('task.js - test moving task up and down', () => {
    cy.window().then((win) => {
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#order-btn-up').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#order-btn-down').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-delete-btn').click();
      cy.get('#c-task-list').shadow().find('.side-bar-division').find('c-task').invoke('attr', 'mode_view');
    });
  });

  it('task.js - test delete task', () => {
    cy.window().then((win) => {
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-delete-btn').click();
    });
  });

  it('task.js - test cancel task right after add', () => {
    cy.window().then((win) => {
      cy.get('#c-task-list').shadow().find('#add-task-button').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(1).shadow()
        .find('#pomo-cancel-btn').click();
    });
  });
})
