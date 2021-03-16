/// <reference types="cypress" />
import { force_state } from "../../../frontend/js/state_machines/state_machine.js";

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
function close_modal() {
  return cy.get("#c-modal").shadow().find("#close").click();
}




context('Window', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('user_data', JSON.stringify(mock_data))
      cy.visit('http://localhost:3000');
      cy.wait(500);
      close_modal();
    })
  })

  it('timer_state_machine - test timer_init <-> timer_open_settings', () => {
    cy.window().then((win) => {
      cy.get('#settings-btn').click().then(() => {
        expect(win.statelet().current).to.equal('timer_open_settings');
        cy.get('#c-settings').shadow().find('.settings-close').eq(0).click().then(() => {
          expect(win.statelet().current).to.equal('timer_init');
        });
      });
    });
  })

  it('timer_state_machine - test timer_init <-> timer_toggle_task_list', () => {
    cy.window().then((win) => {
      cy.get('#tasklist-btn').click().then(() => {
        expect(win.statelet().current).to.equal('timer_toggle_task_list');
        cy.get('#tasklist-btn').click().then(() => {
          expect(win.statelet().current).to.equal('timer_init');
        });
      });
    })
  })


  it('timer_state_machine - test timer_init <-> timer_toggle_task_list no emergency stop', () => {
    cy.window().then((win) => {
      cy.get('#settings-btn').click();
      cy.get('#c-settings').shadow().find('.timer-tab').eq(0).click({ force: true });
      cy.get('#c-settings').shadow().find('#allow-emergency-stop').uncheck({ force: true });
      cy.get('#c-settings').shadow().find('.settings-close').eq(0).click().then(() => {
        cy.get('#start-button').click().then(() => {
          cy.get('#tasklist-btn',{ timeout: 15000 }).click({ timeout: 15000 }).then(() => {
            expect(win.statelet().current).to.equal('timer_toggle_task_list');
          });
        });
      });
    })
  })

  it('timer_state_machine - test timer_init <-> timer_during_countdown', () => {
    cy.window().then((win) => {
      cy.get('#start-button').click().then(() => {
        expect(win.statelet().current).to.equal('timer_during_countdown')
      }).then(() => {
        cy.get('#tasklist-btn').click({ timeout: 15000 }).then(() => {
          expect(win.statelet().current).to.equal('timer_toggle_task_list');
          cy.get('#emergency-stop-button').click().then(() => {
            cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('#confirm-button')
              .click().then(() => {
                expect(win.statelet().current).to.equal('timer_init');
              });
          });
        });
      });
    })
  });

  it('timer_state_machine - test timer_init -> timer_during_countdown -> timer_break_countdown', () => {
    cy.window().then((win) => {
      cy.get('#start-button').click().then(() => {
        expect(win.statelet().current).to.equal('timer_during_countdown');
      }).then(() => {
        cy.get('#overstudy-button').click().then(() => {
          cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
            .click().then(() => {
              cy.wait(30000).then(() => {
                expect(win.statelet().current).to.equal('timer_init');
              });
            });
        });
      });
    });
  })


  it('timer_state_machine - test timer_init <-> timer_during_countdown no emergency stop', () => {
    cy.window().then((win) => {
      cy.get('#settings-btn').click();
      cy.get('#c-settings').shadow().find('.timer-tab').eq(0).click({ force: true });
      cy.get('#c-settings').shadow().find('#allow-emergency-stop').uncheck({ force: true });
      cy.get('#c-settings').shadow().find('.settings-close').eq(0).click();
      cy.get('#start-button').click().then(() => {
        expect(win.statelet().current).to.equal('timer_during_countdown');
      }).then(() => {
        cy.get('#overstudy-button').click().then(() => {
          cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
            .click().then(() => {
              cy.wait(30000).then(() => {
                expect(win.statelet().current).to.equal('timer_init');
              });
            });
        });
      });
    });
  })
})
