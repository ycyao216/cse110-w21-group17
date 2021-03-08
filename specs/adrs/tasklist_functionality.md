# Tasklist Functionality

### Note: Most of these decisions were made at the beginning/middle of the project on our Miro board.

- Tasklist will start **empty** when user enters page

- User can add a task by clicking the '+' button and typing in task name and estimation

- If a user types in a task estimation *greater than 4* they will be asked to split into multiple tasks

- **Top** pending task will be pushed to running task when user clicks start

- Tasks will be consider finished when **cycles done = estimation** and moved to Tasks Finished

- Timer will stop when *no pending tasks are left* to move to Running task

- If user clicks emergency stop mid-work cycle, cycle *will not* count

- Finished early button will move task to Finished *after* the cycle is done
