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
      "working_sec": 3,
      "short_break_sec": 1,
      "short_break_cycles": 1,
      "long_break_sec": 2,
      "long_break_cycles": 1,
      "allow_emergency_stop": true
    }
  }
  
  
  context('Window', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
      cy.wait(100);
    })
  
  
    it('cy.window() - test modifying the global window object', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('user_data', JSON.stringify(mock_data))
        cy.visit('http://localhost:3000');
        cy.wait(100);
        cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
          .click();
      }).then(() => {
        cy.get('#settings-btn').click();
        cy.get('#c-settings').shadow().find('.settings-close').eq(0).click();

        cy.get('#tasklist-btn').click();
        cy.get('#tasklist-btn').click();

        cy.get('#start-button').click();
        cy.get('#tasklist-btn').click({ timeout: 15000 });
        cy.get('#tasklist-btn').click();

        cy.get('#emergency-stop-button').click();
        cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('#confirm-button')
          .click();

        cy.get('#settings-btn').click();
        cy.get('#c-settings').shadow().find('.timer-tab').eq(0).click({force: true});
        cy.get('#c-settings').shadow().find('#allow-emergency-stop').uncheck({force: true});
        cy.get('#c-settings').shadow().find('.settings-close').eq(0).click();

        cy.get('#start-button').click();
        cy.get('#overstudy-button').click();
        cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
          .click();
        cy.wait(30000);

      })
    })
  })
  