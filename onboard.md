# Onboarding

Purpose: This file demonstrates how to access the site in local and remote (Internet) environments, as well as how to use it.

# Accessing the Site Remotely (through Internet)

1. Visit [https://cse110.bobobobobobo.net/](https://cse110.bobobobobobo.net/).
2. You&#39;re done.

(Please note this enables https)

# Accessing the Site Locally

1. (This assumes you have a copy of the code found at [https://github.com/ycyao216/cse110-w21-group17](https://github.com/ycyao216/cse110-w21-group17)). Click on the &quot;Code&quot; dropdown, then &quot;Download ZIP.&quot;

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/accesssitelocally1.PNG)

2. Extract the files using some unzipping software.

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/accesssitelocally2.PNG)

3. Alternatively to steps 1 and 2, clone the repo from the command line.

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/accesssitelocally3.PNG)

4. Install npm, nodejs, and any other necessary packages. Install all npm related dependencies under the cse110-w21-group17/source/site directory.

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/accesssitelocally4.PNG)

\*note that I didn&#39;t install nodejs here as my computer already had it installed.

5. Under the cse110-w21-group17/source/site directory, run npx yarn start-server

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/accesssitelocally5.PNG)

6. If the command does not run successfully, please make sure you have npm, nodejs, and any other dependencies correctly installed.
7. Visit localhost:3000. (ie: 127.0.0.1:3000)

# Usage of the Website

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/usageofthewebsite0.PNG)

1. Help button - click this to open up the help page

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/usageofthewebsite1.PNG)

This can alternatively be accessed through clicking &quot;Settings,&quot; then &quot;Help.&quot;

2. Settings button - click this to open up the settings page

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a. Appearance (Light/Dark mode)

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/usageofthewebsite2a.PNG)

Click on the white clock for light mode, and the dark clock for dark mode.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b. Timer

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/usageofthewebsite2b.PNG)

-The emergency stop setting allows or prevents the use of emergency stop while using the timer.

-The durations of working sessions, short breaks, and long breaks can be changed here with their respective settings.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c. Help

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- See &quot;Usage of the Website,&quot; 1 (Help button section).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d. About

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/usageofthewebsite2d.PNG)

A page containing some information about the creators of this project as well as some analytics for the user&#39;s pomodoro sessions. Regardless of whether you logged in anonymously or with your username, you can click the &quot;Delete All My Data&quot; button to delete all your information.

3. Tasklist button - click this to open up the tasklist page

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/usageofthewebsite3.PNG)

-Click on the clipboard to add a task to the task list.

-Enter a task name in the &quot;task name&quot; box and a cycle count in the &quot;cycle count&quot; box. Then click &quot;confirm&quot; to add the task or &quot;cancel&quot; to remove the task.

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/usageofthewebsite3-2.PNG)

\*Note: if your task has more than four cycles, the website will prompt you if you wish to split it into more tasks. If you click &quot;Confirm,&quot; the website will split the task into task part 1, task part 2, etc. with all but the last part each taking 4 cycles and the last task part taking the remainder amount of cycles, based on the total amount of cycles in the original cycle.

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/usageofthewebsite3-3.PNG)

As you can see, the above &quot;test, 19&quot; task was broken down into four test parts with 4 cycles and one test part with 3 cycles.

-On the far right of each task, there are four buttons. The trash icon deletes the task, the pencil icon allows you to edit the task name and cycles, the up button moves the task up one slot in the tasklist if possible, and the down button moves the task down one slot in the tasklist if possible.

4. Start button - click this to start the time for the current task

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/usageofthewebsite4.PNG)

-Note that you must have at least one task in the pending or current tasklist to be able to click this button.

-You can click the &quot;Emergency Stop&quot; button if you wish to cancel your current pomo session, or click &quot;Finished Early&quot; if you finished the task before the timer expired. Note that clicking &quot;Finished Early&quot; will cause the total amount of cycles for the task to decrease to the number of completed cycles plus one.

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/usageofthewebsite4-2.PNG)

-Any changes to the tasklist caused by using the timer (starting a task, finishing a task, etc.) will be reflected in the tasklist.

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/usageofthewebsite4-3.PNG)

-The analytics page will also be updated accordingly.

# User Login

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/userlogin0.PNG)

If the user would like to save their tasks to a cloud sync, they would:

1. Go to the address bar

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/userlogin1.PNG)

2. Type /user/\*the username they desire\* as shown below

![alt text](https://github.com/ycyao216/cse110-w21-group17/blob/main/images/userlogin2.PNG)

3. And then press enter. Now the user&#39;s tasklist will be saved and can be accessed at any time using the link they typed in step 2 unless their data is deleted.
4. If they would like to delete their user data, please refer to part 2.d under &quot;Usage of the Website&quot;. This also applies for anonymous users who did not input a username but would also like their data deleted (again, please refer back to 2.d under &quot;Usage of the Website&quot;). Anonymous users&#39; data would be stored in the local storage.
