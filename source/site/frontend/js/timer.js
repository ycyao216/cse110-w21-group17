//// This Section Imports Requires Components

// Settings Component
fetch("/html/components/settings.html")
    .then(stream => stream.text())
    .then(text => define_settings(text));

// Timer Display Component
fetch("/html/components/timer-display.html")
    .then(stream => stream.text())
    .then(text => define_timer_display(text));

// Control Button Component
fetch("/html/components/control-button.html")
    .then(stream => stream.text())
    .then(text => define_control_button(text));

// Time Picker Component
fetch("/html/components/time-picker.html")
    .then(stream => stream.text())
    .then(text => define_time_picker(text));

// Task List Component
fetch("/html/components/task-list.html")
    .then(stream => stream.text())
    .then(text => define_task_list(text));

// Analysis Component
fetch("/html/components/analysis.html")
    .then(stream => stream.text())
    .then(text => define_analysis(text));

///// This Section Initializes timer.html's state machine
force_state(timer_init);
