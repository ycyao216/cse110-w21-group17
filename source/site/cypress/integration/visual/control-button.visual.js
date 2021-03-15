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
      cy.window().then((win) => {
        win.localStorage.setItem('user_data', JSON.stringify(mock_data))
        cy.visit('http://localhost:3000');
        cy.wait(500).then(() => {
          cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
            .click();
        })
      })
    })
  
    it('test finish-early-button', () => {
      cy.get('#start-button').click();
      cy.get('#overstudy-button').click();
  
      cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
        .click();
      cy.get('#c-modal').should('be.hidden');
    })
  
    it('test add-cycle', () => {
      cy.get('#start-button').click();
      cy.get('#add-cycle-button').click({ timeout: 15000 });
      cy.get('#current-task').should('have.text', 'Task Name: task 1Done: 1 of 5');
    })
  
    it('test emergency-stop-button with confirm', () => {
  
      cy.get('#start-button').click();
  
      cy.get('#emergency-stop-button').click();
  
      cy.on('window:confirm', msg => {
        expect(msg).to.eq("Are you sure? If you stop now, you will lose these sessions!");
      });
      cy.get("#c-modal").shadow().find("#confirm-button").click();
      cy.get('#current-task').should('have.text', 'Task Name: task 1Done: 0 of 4');
      cy.get('#start-button').should('be.visible');
      cy.get('#settings-btn').should('be.visible');
      cy.get('#tasklist-btn').should('be.visible');
      cy.get('#emergency-stop-button').should('not.be.visible');
      cy.get('#overstudy-button').should('not.be.visible');
  
    })
  
    it('test emergency-stop-button with cancel', () => {
      cy.get('#start-button').click();
      cy.get('#emergency-stop-button').click();
      cy.get("#c-modal").shadow().find("#cancel-button").click();
      cy.get('#start-button').should('not.be.visible');
      cy.get('#settings-btn').should('not.be.visible');
      cy.get('#tasklist-btn').should('not.be.visible');
      cy.get('#emergency-stop-button').should('be.visible');
      cy.get('#overstudy-button').should('be.visible');
    })
  
  
    it('test start-button', () => {
      cy.get('#start-button').click();
      cy.get('#timer-label').then(($el) => {
        expect($el).to.have.prop('innerHTML', "Work");
      })
      cy.get('#start-button').should('not.be.visible');
      cy.get('#settings-btn').should('not.be.visible');
      cy.get('#tasklist-btn').should('not.be.visible');
      cy.get('#emergency-stop-button').should('be.visible');
      cy.get('#overstudy-button').should('be.visible');
  
      cy.wait(4000);
      cy.get('#timer-label').then(($el) => {
        expect($el).to.have.prop('innerHTML', "Ringing");
      })
      cy.get('#start-button').should('not.be.visible');
      cy.get('#settings-btn').should('not.be.visible');
      cy.get('#tasklist-btn').should('not.be.visible');
      cy.get('#emergency-stop-button').should('be.visible');
      cy.get('#overstudy-button').should('not.be.visible');
  
      cy.get('#timer-label', { timeout: 3000 }).should(($el) => {
        expect($el).to.have.prop('innerHTML', "Short Break");
      })
      cy.get('#current-task').should('have.text', 'Task Name: task 1Done: 1 of 4');
      cy.get('#start-button').should('not.be.visible');
      cy.get('#settings-btn').should('not.be.visible');
      cy.get('#tasklist-btn').should('be.visible');
      cy.get('#emergency-stop-button').should('be.visible');
      cy.get('#overstudy-button').should('not.be.visible');
  
      // cy.wait(10000);
      // cy.get('#timer-label').then(($el) => {
      //   expect($el).to.have.prop('innerHTML', "Long Break");
      // })
      // cy.get('#start-button').should('not.be.visible');
      // cy.get('#settings-btn').should('not.be.visible');
      // cy.get('#tasklist-btn').should('be.visible');
      // cy.get('#emergency-stop-button').should('be.visible');
      // cy.get('#overstudy-button').should('not.be.visible');
  
      // cy.wait(3000);
      // cy.get('#start-button').should('not.be.visible');
      // cy.get('#settings-btn').should('not.be.visible');
      // cy.get('#tasklist-btn').should('not.be.visible');
      // cy.get('#emergency-stop-button').should('be.visible');
      // cy.get('#overstudy-button').should('be.visible');
  
      // cy.wait(20000);
      // cy.get('#timer-label').then(($el) => {
      //   expect($el).to.have.prop('innerHTML', "Waiting");
      // })
      // cy.get('#current-task').should('have.text', 'Please add a task');
      // cy.get('#settings-btn').should('be.visible');
      // cy.get('#tasklist-btn').should('be.visible');
      // cy.get('#start-button').should('be.visible');
      // cy.get('#emergency-stop-button').should('not.be.visible');
      // cy.get('#overstudy-button').should('not.be.visible');
    })
  })
  