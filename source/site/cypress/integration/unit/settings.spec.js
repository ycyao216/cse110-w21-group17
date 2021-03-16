/// <reference types="cypress" />


let mock_data = {
  "task_list_data": [
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
    "working_sec": 2400,
    "short_break_sec": 600,
    "short_break_cycles": 3,
    "long_break_sec": 1800,
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
      close_modal().then(() => {
        cy.get('#settings-btn').click();
      });
    })
  })

  it('settings.js - test delete_data anonymous', ()=>{
    cy.window().then((win)=>{
      cy.get('#c-settings').shadow().find('.about-tab').eq(0).click({ force: true });
      cy.get('#c-settings').shadow().find('.tab-content').scrollTo(0,500);
      cy.get('#c-settings').shadow().find('#delete-data').click();
      cy.get('#c-modal').shadow().find('#confirm-button').click();
    })
    cy.wait(1000);
    cy.window().then(($win) => {
      expect($win.user_data.task_list_data).to.have.length(0);
    })
  })

  it('settings.js - test delete_data with user id', ()=>{
    cy.window().then((win) => {
      win.localStorage.setItem('user_data', JSON.stringify(mock_data))
      cy.visit('http://localhost:3000/user/test_user');
      cy.wait(500);
      cy.get('#settings-btn').click();
    });
    cy.window().then((win)=>{
      cy.get('#c-settings').shadow().find('.about-tab').eq(0).click({ force: true });
      cy.get('#c-settings').shadow().find('.tab-content').scrollTo(0,500);
      cy.get('#c-settings').shadow().find('#delete-data').click();
      cy.get('#c-modal').shadow().find('#confirm-button').click();
    })
    cy.wait(1000);
    cy.window().then(($win) => {
      expect($win.user_data.task_list_data).to.have.length(0);
    })
  })

  it('settings.js - test help page', () => {
    cy.window().then((win) => {
      win.user_data = mock_data;
      cy.get('#c-settings').shadow().find('.settings-close').eq(0).click({ force: true }).then(() => {
        cy.get('#help-button').click();
      });
      cy.get('#c-settings').shadow().find('.tab-header>.active').eq(0).find('i').eq(0).should('have.class', 'help-tab')
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

  it('settings.js - test help tab and about page', () => {
    cy.window().then((win) => {
      win.user_data = mock_data;
    }).then(() => {
      cy.get('#c-settings').shadow().find('.help-tab').eq(0).click({ force: true });

      cy.get('#c-settings').shadow().find('.about-tab').eq(0).click({ force: true });
    })
  })


})
