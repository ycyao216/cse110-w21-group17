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
      "working_sec": 2400,
      "short_break_sec": 600,
      "short_break_cycles": 3,
      "long_break_sec": 1800,
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
        cy.get('#settings-btn').click();
      })
    })
  
  })
  