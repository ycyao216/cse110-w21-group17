/// <reference types="cypress" />


let mock_data = {
  "task_list_data": [
    {
      "id": "1579afed-2143-49e4-8768-b0d54eba43f8",
      "description": "task 1",
      "pomo_estimation": 4,
      "cycles_completed": 0
    },
    {
      "id": "97bf356c-3910-45f5-950e-34acc6319b83",
      "description": "task 2",
      "pomo_estimation": 2,
      "cycles_completed": 0
    }
  ],
  "user_log": [
    {
      "login_timestamp": "",
      "timer_state": "timer_init",
      "current_task": "1579afed-2143-49e4-8768-b0d54eba43f8",
      "break_status": {
        "break": "short_break",
        "cycles": 0
      },
      "log": ["1579afed-2143-49e4-8768-b0d54eba43f8", "short_break"],
      "online": true
    }
  ],
  "settings": {
    "working_sec": 7,
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
    cy.wait(3000);
  })


  it('cy.window() - test modifying the global window object', () => {
    cy.window().then((win) => {
      win.user_data = mock_data;
    }).then(() => {
      cy.window().should('have.property', 'user_data');
      cy.title().should('include', 'Tortellini Timer!');
      cy.window().its('user_data.settings.working_sec')
        .should('equal', 7);
    })
  })


  it('test settings', () => {
    cy.window().then((win) => {
      win.user_data = mock_data;
    }).then(() => {
      cy.get('#c-settings').click();
    })
  })

})