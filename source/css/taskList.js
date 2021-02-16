//taskList.js

// record task name
var taskName = null;
var taskNameArr = [];
var finishedTask = [];
// record cycles
var cycles = 0;
var cyclesArr = [];
var finishedCycles = [];


function openList(){
  //alert("Maiomaiomaio");
  document.getElementById("taskList").style.width = "250px";

}

function closeList(){
  document.getElementById("taskList").style.width = "0";
}

function addTask(){

  taskName = document.getElementById("taskNameInput").value;
  cycles = document.getElementById("cyclesNumInput").value;

  //console.log(taskName);
  //console.log(cycles);

 if(taskName == null){
   alert("Please input a task name");
   return;
 }

 if(cycles == 0){
   alert("Please input the numbers of cycles you need");
   return;
 }

var n = 0;
 for(n; n < taskNameArr.length; n += 1){
   if(taskName == taskNameArr[n]){
     alert("This task has already been added to the task list");
     return;
   }
 }

 //condition that the task is too long
 if(cycles > 4){
   // recommaend splitting up into more task
   var r = confirm("The task takes too many cycles.Do you want to split it into more tasks?");
	 if (r == true){
     var breakNum = cycles / 4;
     var rem = cycles % 4;
     var i = 1;

     for(i; i <= breakNum; i += 1){
       var tempName = taskName+" Part "+i;
       taskNameArr.push(tempName);
       cyclesArr.push(4);

       if(taskNameArr.length == 1){
         addLi(tempName, 4, "running");
       }
       else{
         addLi(tempName, 4, "pending");
       }
     }

     //cycles = 4;

     if(rem != 0){
       tempName = taskName+" Part "+ i;
       taskNameArr.push(tempName);
       cyclesArr.push(rem);
       addLi(tempName, rem, "pending");
     }

     return;
	 }
 }

// condition that just takes 1 cycles, and it can be combined with other task.
 var j = 0;
 for(j; j < cyclesArr.length; j += 1){
   if( cycles == 1 && cyclesArr[j] < 4){
     // recommaend splitting up into more task
     var v = confirm("The task only takes 1 cycle.Do you want to combine it with other tasks?");
  	  if (v == true){
       var combinedName = taskNameArr[j];
       var combinedCycles = Number(cyclesArr[j]) + 1;
       var newName = combinedName + " + " + taskName;

       taskNameArr.splice(j, 1);
       cyclesArr.splice(j, 1);

       // insert the new task
       // if it is the renning task
       if(j == 0){
         // delete the old task, add new combined task
         var oldTask = document.getElementById(combinedName);
         li=document.getElementById("running");
         oLi=oldTask.parentNode.parentNode;
         li.removeChild(oLi);

         addLi(newName, combinedCycles, "running");
         taskNameArr.splice(0, 0, newName);
         cyclesArr.splice(0, 0, combinedCycles);
       }

       else{
         // delete the old task, add new combined task
         var oldTask = document.getElementById(combinedName);
         li=document.getElementById("pending");
         oLi=oldTask.parentNode.parentNode;
         li.removeChild(oLi);

         addLi(newName, combinedCycles, "pending");
         taskNameArr.push(newName);
         cyclesArr.push(combinedCycles);
       }
       return;
  	 }
   }
 }

 //record them
 taskNameArr.push(taskName);
 cyclesArr.push(cycles);

// if there is only one task, add the new taskName to Running
 if(taskNameArr.length == 1){
   addLi(taskName, cycles, "running");

   //// TODO:
   /*----------------------------

   relating to timer

   -----------------------------*/
 }

//if there are more than one task, add the new task to Pending
 else{
   addLi(taskName, cycles, "pending");

   //// TODO:
   /*----------------------------

   relating to timer

   -----------------------------*/

 }
}

function addLi(name, num, category){
  var newLi=document.createElement("li");
  newLi.setAttribute("class","newLi");
  addSpan(newLi, "Task name: ");
  addSpan(newLi,name);
  addSpan(newLi, ", cycles needed: ");
  addSpan(newLi,num);
  addDelBtn(newLi, category, name);
  document.getElementById(category).appendChild(newLi);
}

function addSpan(li,text){
  var newSpan=document.createElement("span");
  newSpan.innerHTML=text;
  li.appendChild(newSpan);
}

function addDelBtn(li, categoryA, nameA){
  var newSpan=document.createElement("span");
  var btn=document.createElement("button");
   btn.setAttribute("type","button");
   btn.setAttribute("class","delBtn");
   btn.setAttribute("id", nameA);
   btn.setAttribute("onclick","delBtnData(this, "+categoryA+")");
   btn.innerHTML="delete";
   newSpan.appendChild(btn);
   li.appendChild(newSpan);
 }

function delBtnData(obj, categoryB){
  console.log(obj.id);
  var li=document.getElementById(categoryB.id);
  var oLi=obj.parentNode.parentNode;
  li.removeChild(oLi);
  changeArr(obj.id);

  if(categoryB.id == "running"){
    if(taskNameArr.length > 0){
      // delete the frist task in pending lise
      var firstPendding = document.getElementById(taskNameArr[0]);
      li=document.getElementById("pending");
      oLi=firstPendding.parentNode.parentNode;
      li.removeChild(oLi);
      //changeArr(obj.id);

      //reinsert to running
      addLi(taskNameArr[0], cyclesArr[0], "running");
    }
  }
}

function changeArr(name){
  console.log(name);
  var i = taskNameArr.indexOf(name);
  taskNameArr.splice(i, 1);
  cyclesArr.splice(i, 1);
}

// when current running task finished, please call this function
function taskFinished(){
  // record information of finished task
  var finishedTaskName = taskNameArr[0];
  var finishedTaskCycles = cyclesArr[0];

  // delete the li of finished task
  var finished = document.getElementById(taskNameArr[0]);
  li=document.getElementById("running");
  oLi=finished.parentNode.parentNode;
  li.removeChild(oLi);

  // delete information of finished task
  taskNameArr.splice(0, 1);
  cyclesArr.splice(0, 1);

  // record the information in finished arrays
  finishedTask.push(finishedTaskName);
  finishedCycles.push(finishedTaskCycles);

  //push a task from pending to running
  addLi(taskNameArr[0], cycles[0], "running");

  //push the finished task into finished
  addLi(finishedTaskName, finishedTaskCycles, "finished");

}
