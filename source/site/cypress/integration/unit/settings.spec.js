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
        cy.get('#settings-btn').click();

        cy.get('#c-settings').shadow().find('.appearence-tab').eq(0).click({force: true});
        cy.get('#c-settings').shadow().find('#light-mode-button').eq(0).click({force: true});
        cy.get('#c-settings').shadow().find('#dark-mode-button').eq(0).click({force: true});

        cy.get('#c-settings').shadow().find('.timer-tab').eq(0).click({force: true});
        cy.get('#c-settings').shadow().find('#allow-emergency-stop').uncheck({force: true});
        cy.get('#c-settings').shadow().find('#allow-emergency-stop').check({force: true});
        cy.get('#c-settings').shadow().find('#working-min').type('{selectall}').type(40,{force: true}).type('{enter}');
        cy.get('#c-settings').shadow().find('#long-break-min').type('{selectall}').type(30,{force: true}).type('{enter}');
        cy.get('#c-settings').shadow().find('#short-break-min').type('{selectall}').type(10,{force: true}).type('{enter}');

        cy.get('#c-settings').shadow().find('#working-min').type('{selectall}').type(3,{force: true}).type('{enter}');
        cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
          .click();
        cy.get('#c-settings').shadow().find('#short-break-min').type('{selectall}').type(60,{force: true}).type('{enter}');
        cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
          .click();
        cy.get('#c-settings').shadow().find('#long-break-min').type('{selectall}').type(5,{force: true}).type('{enter}');
        cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
          .click();

        cy.get('#c-settings').shadow().find('.help-tab').eq(0).click({force: true});

        cy.get('#c-settings').shadow().find('.about-tab').eq(0).click({force: true});

        

      })
    })
  })
  