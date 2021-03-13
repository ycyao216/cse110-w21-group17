# Functionality for Adding Task for Pomodoro Timer

* Status: accepted
* Deciders: Evan and Yuying
* Date: 2021-02-21

## Context and Problem Statement

We need to decide how the tasklist behaves when a user adds a task. Where should it put the task? How should it prompt the user. **Note: Most of these decisions were made at the beginning/middle of the project on our Miro board(See link below).**

## Considered Options

* [User Prompt] - When a user clicks the add task button they will be prompted to enter task name and how many pomodoro cycles they expect it to take
* [Task Location] - When a new task is added, put it in the pending tasks tab in the tasklist

## Decision Outcome

Chosen option(s): "[User Prompt], [Task Location]", we felt that these are both necessary for the user so they can properly organize the tasks they want to work on.

## Pros and Cons of the Options <!-- optional -->

### User Prompt

* Good, because it allows user to choose how many cycles they want to spend on a task
* Good, because if they don't finish task in that time they can either move on or add another cycle

### Task Location

* Good, because when a task is added it is put into the pending tasks tab where the user can view all tasks they've entered
* Good, because if there is only one pending task, then it gets moved to the running task section on the main timer

## Links

* [Miro] [https://miro.com/app/board/o9J_lXA0iE0=/] <!-- example: Refined by [ADR-0005](0005-example.md) -->
