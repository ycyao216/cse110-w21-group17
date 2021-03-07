# Timer Functionality

### Note: Most of these decisions were made at the beginning/middle of the project on our Miro board.

- Timer will start with display of default Work Time of **25 minutes.**

- Default Short Break: **5 minutes**

- Default Long Break: **8 minutes**

- Timer will start counting the number of pomodoro cycles done **every time** user clicks start. This resets when timer stops naturally and Emergency stop button.

- Our definition of cycle includes *Work + Break*.

- Because of the way we count cycles done, Long breaks will occur every **4** cycles *independent* of the tasklist.

- Add Cycle button will allow the user to add 1 cycle to the *estimation* of the running task during the break/before timer starts if they feel they won't finish.

- Emergency stop button is for the user to *completely* break the pomodoro cycles. It will reset number of cycles done so user can not keep having Long breaks. The cycle for that task will not be marked as completed.

- Finished early button will mark running task as finished and move onto the next task or stop timer after break.

- Timer automatically stops when there are no more tasks to run. User can run the timer w/o tasks but will automatically stop after 1 cycle.
