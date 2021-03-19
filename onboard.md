Onboarding

Purpose: This file demonstrates how to access the site in local and remote (Internet) environments, as well as how to use it.

Accessing the Site Remotely (through Internet)

1. Visit [http://cse110.bobobobobobo.net/](http://cse110.bobobobobobo.net/).
2. You&#39;re done.

Accessing the Site Locally

1. (This assumes you have a copy of the code found at [https://github.com/ycyao216/cse110-w21-group17](https://github.com/ycyao216/cse110-w21-group17)). Click on the &quot;Code&quot; dropdown, then &quot;Download ZIP.&quot; ![](RackMultipart20210319-4-189pl9k_html_6af6fc056fcfe540.png)
2. Extract the files using some unzipping software. ![](RackMultipart20210319-4-189pl9k_html_181d8ba6daa144f1.png)
3. Alternatively to steps 1 and 2, clone the repo from the command line.

![](RackMultipart20210319-4-189pl9k_html_ab3ea8ded1c18555.png)

1. Install npm, nodejs, and any other necessary packages. Install all npm related dependencies under the cse110-w21-group17/source/site directory.

![](RackMultipart20210319-4-189pl9k_html_1f13ee393eeafd9d.png)

\*note that I didn&#39;t install nodejs here as my computer already had it installed.

1. Run node ./backend/httpserver/server.js under the cse110-w21-group17/source/site directory.

![](RackMultipart20210319-4-189pl9k_html_e735b10df2f73b51.png)

1. If you do not get the command output above, please make sure you have npm, nodejs, and any other dependencies correctly installed.
2. Visit localhost:3000.

Usage of the Website

![](RackMultipart20210319-4-189pl9k_html_84e2926c34b962ab.png)

1. Help button - click this to open up the help page

![](RackMultipart20210319-4-189pl9k_html_4a032fa7ede37a25.png)

This can alternatively be accessed through clicking &quot;Settings,&quot; then &quot;Help.&quot;

1. Settings button - click this to open up the settings page

1. Appearance (Light/Dark mode)

![](RackMultipart20210319-4-189pl9k_html_ea13a4e9de9c02d8.png)

Click on the white clock for light mode, and the dark clock for dark mode.

1. Timer

![](RackMultipart20210319-4-189pl9k_html_3465f4d52ba8f34f.png)

-The emergency stop setting allows or prevents the use of emergency stop while using the timer.

-The durations of working sessions, short breaks, and long breaks can be changed here with their respective settings.

1. Help

See 1.

1. About

![](RackMultipart20210319-4-189pl9k_html_d7d644805b65e0f3.png)

A page containing some information about the creators of this project as well as some analytics for the user&#39;s pomodoro sessions. You can also click the &quot;Delete All My Data&quot; button to delete all your information.

1. Tasklist button - click this to open up the tasklist page

![](RackMultipart20210319-4-189pl9k_html_b57ca456004bafe0.png)

-Click on the clipboard to add a task to the task list.

-Enter a task name in the &quot;task name&quot; box and a cycle count in the &quot;cycle count&quot; box. Then click &quot;confirm&quot; to add the task or &quot;cancel&quot; to remove the task.

![](RackMultipart20210319-4-189pl9k_html_502579cab83d75a5.png)

\*Note: if your task has more than four cycles, the website will prompt you if you wish to split it into more tasks. If you click &quot;Confirm,&quot; the website will split the task into task part 1, task part 2, etc. with all but the last part each taking 4 cycles and the last task part taking the remainder amount of cycles, based on the total amount of cycles in the original cycle.

![](RackMultipart20210319-4-189pl9k_html_5bc65d0cf78da84a.png)

As you can see, the above &quot;test, 19&quot; task was broken down into four test parts with 4 cycles and one test part with 3 cycles.

-On the far right of each task, there are four buttons. The trash icon deletes the task, the pencil icon allows you to edit the task name and cycles, the up button moves the task up one slot in the tasklist if possible, and the down button moves the task down one slot in the tasklist if possible.

1. Start button - click this to start the time for the current task ![](RackMultipart20210319-4-189pl9k_html_e0389818400f5ddd.png)

-Note that you must have at least one task in the pending tasklist to be able to click this button.

-You can click the &quot;Emergency Stop&quot; button if you wish to cancel your current pomo session, or click &quot;Finished Early&quot; if you finished the task before the timer expired. Note that clicking &quot;Finished Early&quot; will cause the total amount of cycles for the task to decrease to the number of completed cycles plus one.

![](RackMultipart20210319-4-189pl9k_html_3f73ff342071ecb6.png)

-Any changes to the tasklist caused by using the timer (starting a task, finishing a task, etc.) will be reflected in the tasklist.

![](RackMultipart20210319-4-189pl9k_html_3b7f493bf801e866.png)

-The analytics page will also be updated accordingly.
