# State Machine for Pomodoro Timer

* Status: accepted
* Deciders: Bo & Rest of Team
* Date: 2021-02-28

## Context and Problem Statement

We need to decide find a way to separate frontend and backend so team can work on timer easily. Should we do utilize a state machine. **Note: Most of these decisions were made at the beginning/middle of the project on our Miro board(See link below).**

## Considered Options

* [State Machine] - Separates styling from functionalities of the timer

## Decision Outcome

Chosen option(s): "[State Machine]", we felt that this would help our team significantly since the team working on styling can work independently from those working on the functionalities.

## Pros and Cons of the Options <!-- optional -->

### State Machine

* Good, because teams can work independently while still contributing to the tasks the project requires
* Good, because it also prevents the site from having a chaotic structure, important with how many Javascript components there are
* Bad, because there could be some confusion among team members who have never worked with a state machine before

## Links

* [Miro] [https://miro.com/app/board/o9J_lXA0iE0=/] <!-- example: Refined by [ADR-0005](0005-example.md) -->
