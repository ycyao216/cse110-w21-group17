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
    "working_sec": 6,
    "short_break_sec": 3,
    "short_break_cycles": 3,
    "long_break_sec": 5,
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

  it('test settings button', () => {
    cy.window().then((win) => {
      cy.get('#tasklist-btn').click().then(() => {
        expect(win.statelet().current).to.equal('timer_toggle_task_list');
        cy.get('#tasklist-btn').click().then(() => {
          expect(win.statelet().current).to.equal('timer_init');
        });
      });
    })
  })
})
