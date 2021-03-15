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

  it('settings.js - test modifying theme', () => {
    cy.get('#c-settings').shadow().find('.appearence-tab').eq(0).click({ force: true });
    cy.get('#c-settings').shadow().find('#light-mode-button').eq(0).click({ force: true });
    cy.get('#timer-label').should('have.css', 'color', 'rgb(15, 55, 61)')
    cy.get('#c-settings').shadow().find('#dark-mode-button').eq(0).click({ force: true });
    cy.get('#timer-label').should('have.css', 'color', 'rgb(137, 217, 230)')
  })


  it('settings.js - test allow-emergency-stop', () => {
    cy.get('#c-settings').shadow().find('.timer-tab').eq(0).click({ force: true });
    cy.get('#c-settings').shadow().find('#allow-emergency-stop').uncheck({ force: true });
    cy.window().then(($win) => {
      expect($win.user_data.settings.allow_emergency_stop).to.be.false;
    })
    cy.get('#c-settings').shadow().find('#allow-emergency-stop').check({ force: true });
    cy.window().then(($win) => {
      expect($win.user_data.settings.allow_emergency_stop).to.be.true;
    })
  })

  it('settings.js - test modifying working-min', () => {
    cy.get('#c-settings').shadow().find('.timer-tab').eq(0).click({ force: true });
    cy.get('#c-settings').shadow().find('#working-min').type('{selectall}').type(50, { force: true }).type('{enter}');
    cy.window().then(($win) => {
      expect($win.user_data.settings.working_sec).to.equal(3000);
    })
  })

  it('settings.js - test modifying long-break-min', () => {
    cy.get('#c-settings').shadow().find('.timer-tab').eq(0).click({ force: true });
    cy.get('#c-settings').shadow().find('#long-break-min').type('{selectall}').type(20, { force: true }).type('{enter}');
    cy.window().then(($win) => {
      expect($win.user_data.settings.long_break_sec).to.equal(1200);
    })
  })

  it('settings.js - test modifying short-break-min', () => {
    cy.get('#c-settings').shadow().find('.timer-tab').eq(0).click({ force: true });
    cy.get('#c-settings').shadow().find('#short-break-min').type('{selectall}').type(1, { force: true }).type('{enter}');
    cy.window().then(($win) => {
      expect($win.user_data.settings.short_break_sec).to.equal(60);
    })
  })


  it('settings.js - test modifying invalid working-min', () => {
    cy.get('#c-settings').shadow().find('.timer-tab').eq(0).click({ force: true });
    cy.get('#c-settings').shadow().find('#working-min').type('{selectall}').type(3, { force: true }).type('{enter}');
    cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
      .click();
    cy.window().then(($win) => {
      expect($win.user_data.settings.working_sec).to.equal(2400);
    })
  })

  it('settings.js - test modifying invalid long-break-min', () => {
    cy.get('#c-settings').shadow().find('.timer-tab').eq(0).click({ force: true });
    cy.get('#c-settings').shadow().find('#long-break-min').type('{selectall}').type(5, { force: true }).type('{enter}');
    cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
      .click();
    cy.window().then(($win) => {
      expect($win.user_data.settings.long_break_sec).to.equal(1800);
    })
  })

  it('settings.js - test modifying invalid short-break-min', () => {
    cy.get('#c-settings').shadow().find('.timer-tab').eq(0).click({ force: true });
    cy.get('#c-settings').shadow().find('#short-break-min').type('{selectall}').type(60, { force: true }).type('{enter}');
    cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
      .click();
    cy.window().then(($win) => {
      expect($win.user_data.settings.short_break_sec).to.equal(600);
    })
  })

  it('cy.window() - test modifying the global window object', () => {
    cy.window().then((win) => {
      win.user_data = mock_data;
    }).then(() => {
      cy.get('#c-settings').shadow().find('.help-tab').eq(0).click({ force: true });

      cy.get('#c-settings').shadow().find('.about-tab').eq(0).click({ force: true });
    })
  })
})
