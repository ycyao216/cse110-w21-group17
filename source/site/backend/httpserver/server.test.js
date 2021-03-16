
const axios = require('axios')

let mock_data = {
    "id": 'testuser',
    "task_list_data": [],
    "user_log": {
        "last_active": Date.now(),
        "timer_state": {
            "current": "timer_init",
            "previous": null
        },
        "current_task": null,
        "break_status": {
            "break": "short_break",
            "cycles": 0
        },
    },
    "settings": {
        "working_sec": 1500,
        "short_break_sec": 300,
        "short_break_cycles": 3,
        "long_break_sec": 480,
        "long_break_cycles": 1,
        "allow_emergency_stop": true
    }
}

describe('Testing user REST api', () => {
    test('delete user if exists', () => {
        axios.put(`http://localhost:3000/delete_user`, {
            "token": 'testuser',
        })
    });
    test('create user', () => {
        axios.put(`http://localhost:3000/fetchuserdata`, {
            "token": 'testuser',
        }).then(res => expect(res.data).toBe(testuser));
    });
    test('upload user data', () => {
        axios.put(`http://localhost:3000/uploaduserdata`, {
            "token": 'testuser',
            "data": mock_data
        }).then(axios.put(`http://localhost:3000/fetchuserdata`, {
            "token": 'testuser',
        }).then(res => expect(res.data).toBe(mock_data)));
    });
    test('get online users', () => {
        axios.put(`http://localhost:3000/online`, {
            "token": 'testuser',
        }).then(res => expect(res.data).toBe(res.data));
    });

})

