/// <reference types="cypress" />
import { create_uid } from "../../../frontend/js/utils.js";

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
    },
    {
      "id": "12345678-3910-45f5-950e-34acc6319b83",
      "description": "task 3",
      "pomo_estimation": 3,
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
    }
  },
  "settings": {
    "working_sec": 2400,
    "short_break_sec": 600,
    "short_break_cycles": 2,
    "long_break_sec": 1800,
    "long_break_cycles": 1,
    "allow_emergency_stop": true
  }
}

context('Login Anonymously', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('user_data', JSON.stringify(mock_data))
      cy.visit('http://localhost:3000');
      cy.wait(100);
    })
  })


  it('data.js - test read', () => {
    cy.window().then((win) => {
      expect(win.read_task('1579afed-2143-49e4-8768-b0d54eba43f8').id).to.equal('1579afed-2143-49e4-8768-b0d54eba43f8');
      expect(win.read_task('1579afed-2143-49e4-8768-b0d54eba43f8').description).to.equal('task 1');
      expect(win.read_task('1579afed-2143-49e4-8768-b0d54eba43f8').pomo_estimation).to.equal(4);
      expect(win.read_task('1579afed-2143-49e4-8768-b0d54eba43f8').cycles_completed).to.equal(0);
    });
  });


  it('data.js - test update', () => {
    cy.window().then((win) => {
      win.update_task({
        "id": "97bf356c-3910-45f5-950e-34acc6319b83",
        "description": "update",
        "pomo_estimation": 3,
        "cycles_completed": 0,
      });
      expect(win.user_data.task_list_data[1].id).to.equal('97bf356c-3910-45f5-950e-34acc6319b83');
      expect(win.user_data.task_list_data[1].description).to.equal('update');
      expect(win.user_data.task_list_data[1].pomo_estimation).to.equal(3);
      expect(win.user_data.task_list_data[1].cycles_completed).to.equal(0);
    });
  });

  it('data.js - test delete task', () => {
    cy.window().then((win) => {
      win.delete_task('97bf356c-3910-45f5-950e-34acc6319b83');
    }).then(() => {
      cy.window().then((win) => {
        expect(win.user_data.task_list_data.length).to.equal(2);
      });
    })
  });


  it('data.js - test create task', () => {
    cy.window().then((win) => {
      let net_task = {
        "id": create_uid(10),
        "description": "create",
        "pomo_estimation": 3,
        "cycles_completed": 0,
      }
      win.create_task(net_task);
      cy.wait(300);
      expect(win.user_data.task_list_data[3].description).to.equal('create');
      expect(win.user_data.task_list_data[3].pomo_estimation).to.equal(3);
      expect(win.user_data.task_list_data[3].cycles_completed).to.equal(0);
    });
    cy.window().then((win) => {
      let net_task = {
        "id": create_uid(10),
        "description": "create",
        "pomo_estimation": 3,
        "cycles_completed": 0,
      }
      win.create_task(net_task, "97bf356c-3910-45f5-950e-34acc6319b83");
      cy.wait(300);
      expect(win.user_data.task_list_data[2].description).to.equal('create');
      expect(win.user_data.task_list_data[2].pomo_estimation).to.equal(3);
      expect(win.user_data.task_list_data[2].cycles_completed).to.equal(0);
    });
  });

  it('data.js - test move task', () => {
    cy.window().then((win) => {
      win.move_task('12345678-3910-45f5-950e-34acc6319b83', -1);
      expect(win.user_data.task_list_data[1].id).to.equal('12345678-3910-45f5-950e-34acc6319b83');
      expect(win.user_data.task_list_data[1].description).to.equal('task 3');
      expect(win.user_data.task_list_data[1].pomo_estimation).to.equal(3);
      expect(win.user_data.task_list_data[1].cycles_completed).to.equal(0);
    });
  });

  it('data.js - test advance_break_cycle', () => {
    cy.window().then((win) => {
      win.advance_break_cycle();
      expect(win.active_userstate().break_status.break).to.equal('short_break');
      expect(win.active_userstate().break_status.cycles).to.equal(1);
      win.advance_break_cycle();
      expect(win.active_userstate().break_status.break).to.equal('long_break');
      expect(win.active_userstate().break_status.cycles).to.equal(0);
      win.advance_break_cycle();
      expect(win.active_userstate().break_status.break).to.equal('short_break');
      expect(win.active_userstate().break_status.cycles).to.equal(0);
      win.advance_break_cycle();
      expect(win.active_userstate().break_status.break).to.equal('short_break');
      expect(win.active_userstate().break_status.cycles).to.equal(1);
    });
  });


  it('data.js - test advance_task', () => {
    cy.window().then((win) => {
      win.advance_task();
      cy.wait(300);
      expect(win.current_task().id).to.equal('97bf356c-3910-45f5-950e-34acc6319b83');
    });
  });

  it('data.js - test update_state', () => {
    cy.window().then((win) => {
      let state = win.statelet();
      win.update_state();
      cy.wait(300);
      let userstate = JSON.parse(win.localStorage.getItem('user_data')).user_log
      expect(userstate.timer_state.previous).to.equal(state.previous);
      expect(userstate.timer_state.current).to.equal(state.current);
    });
  });

  it('data.js - test update_settings', () => {
    cy.window().then((win) => {
      let actual_settings = JSON.stringify(mock_data.settings);
      win.update_settings();
      cy.wait(300);
      let userstate = JSON.parse(win.localStorage.getItem('user_data')).settings;
      expect(JSON.stringify(userstate)).to.equal(actual_settings);
    });
  });

  it('data.js - test is_running', () => {
    cy.window().then((win) => {
      expect(win.is_running(win.read_task('1579afed-2143-49e4-8768-b0d54eba43f8'))).to.be.true;
      expect(win.is_running(win.read_task("12345678-3910-45f5-950e-34acc6319b83"))).to.be.false;
      expect(win.is_running(null)).to.be.false;
    });
  });

  it('data.js - test next_task_id', () => {
    cy.window().then((win) => {
      expect(win.next_task_id()).to.equal("97bf356c-3910-45f5-950e-34acc6319b83");
    });
    cy.window().then((win) => {
      win.delete_task('97bf356c-3910-45f5-950e-34acc6319b83');
      win.delete_task("12345678-3910-45f5-950e-34acc6319b83");
      expect(win.next_task_id()).to.equal(null);
    });
  });

  it('data.js - test active_userstate', () => {
    cy.window().then((win) => {
      win.active_userstate().last_active = mock_data.user_log.last_active;
      expect(JSON.stringify(win.active_userstate())).to.equal(JSON.stringify(mock_data.user_log));
    });
  });

})


context('Login as user', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/user/bo');
    cy.wait(500);
  })

  it('data.js - test upload', () => {
    cy.window().then((win) => {
      win.create_task({
        "id": "97bf356c-3910-45f5-950e-34acc6319b83",
        "description": "update",
        "pomo_estimation": 3,
        "cycles_completed": 0,
      });
    });
  });

  it('data.js - test download', () => {
    cy.window().then((win) => {
      expect(win.read_task('97bf356c-3910-45f5-950e-34acc6319b83').id).to.equal('97bf356c-3910-45f5-950e-34acc6319b83');
      expect(win.read_task('97bf356c-3910-45f5-950e-34acc6319b83').description).to.equal('update');
      expect(win.read_task('97bf356c-3910-45f5-950e-34acc6319b83').pomo_estimation).to.equal(3);
      expect(win.read_task('97bf356c-3910-45f5-950e-34acc6319b83').cycles_completed).to.equal(0);
    });
  });

  
  it('datajs - test remove userdata exist',()=>{
    cy.window().then((win)=>{
      win.localStorage.setItem('user_data', JSON.stringify(mock_data))
      cy.visit('http://localhost:3000/user/test');
      cy.wait(100);
      win.create_task({
        "id": "97bf356c-3910-45f5-950e-34acc6319b83",
        "description": "update",
        "pomo_estimation": 3,
        "cycles_completed": 0,
      });
      win.delete_user_data();
      cy.wait(1000);
      cy.visit('http://localhost:3000/user/test');
      cy.wait(100);
      cy.window().then((win)=>{
        expect(win.user_data.task_list_data).to.have.length(0);
      })
    })
  })
})