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


context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.wait(100);
    // cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
    //   .click();
  })


  it('cy.window() - test modifying the global window object', () => {
    cy.window().then((win) => {
      win.user_data = mock_data;
    }).then(() => {
      cy.get('#tasklist-btn').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-edit-btn').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-cancel-btn').click();

      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-edit-btn').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-counter-edit').type(10);
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#task-edit').type('task1');
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-confirm-btn').click();
      cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('#confirm-button')
        .click();


      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-edit-btn').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-counter-edit').type(0);
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#task-edit').type('task1');
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-confirm-btn').click();
      cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
        .click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-counter-edit').type(-1); //TODO not working
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-confirm-btn').click();
      cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
        .click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-counter-edit').type(10);
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-confirm-btn').click();
      cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('#confirm-button')
        .click();

      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-edit-btn').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-counter-edit').type(2);
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-confirm-btn').click();
      cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
        .click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#task-edit').type('dd');
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-confirm-btn').click();

      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-edit-btn').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-counter-edit').type(11);
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#task-edit').type('dd2');
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-confirm-btn').click();
      cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('#cancel-button')
        .click();

      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-edit-btn').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-counter-edit').type(3);
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#task-edit').type('dd3');
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-confirm-btn').click();

      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#order-btn-up').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#order-btn-down').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-delete-btn').click();
      cy.get('#c-task-list').shadow().find('.side-bar-division').find('c-task').invoke('attr', 'mode_view');

      cy.get('#c-task-list').shadow().find('#add-task-button').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(4).shadow()
        .find('#pomo-cancel-btn').click();
    })
  })
})
