/*
Source: https://scorm.com/scorm-explained/technical-scorm/golf-examples/
Changed getting, setting values, saving results and added helper functions.

Source code created by Rustici Software, LLC is licensed under a 
Creative Commons Attribution 3.0 United States License
(http://creativecommons.org/licenses/by/3.0/us/)
Want to make SCORM easy? See our solutions at http://www.scorm.com.
This example demonstrates the use of more advanced runtime calls in a multi-page SCO. It
includes a demonstration of reporting interactions (question results), and progress
towards specific learning objective. It also demonstrates using the manifest to specify
a passing score rather than hard coding the passing score within the content.
*/


//Include the standard ADL-supplied API discovery algorithm


///////////////////////////////////////////
//Begin ADL-provided API discovery algorithm
///////////////////////////////////////////

var nFindAPITries = 0;
var API = null;
var maxTries = 500; 

// The ScanForAPI() function searches for an object named API
// in the window that is passed into the function.  If the object is
// found a reference to the object is returned to the calling function.
// If the instance is found the SCO now has a handle to the LMS
// provided API Instance.  The function searches a maximum number
// of parents of the current window.  If no object is found the
// function returns a null reference.  This function also reassigns a
// value to the win parameter passed in, based on the number of
// parents.  At the end of the function call, the win variable will be
// set to the upper most parent in the chain of parents.
function ScanForAPI(win)
{
   while ((win.API == null) && (win.parent != null)
           && (win.parent != win))
   {
      nFindAPITries++;
      if (nFindAPITries > maxTries)
      {
         return null;
      }
      win = win.parent;
   }
   return win.API;
} 

// The GetAPI() function begins the process of searching for the LMS
// provided API Instance.  The function takes in a parameter that
// represents the current window.  The function is built to search in a
// specific order and stop when the LMS provided API Instance is found.
// The function begins by searching the current window’s parent, if the
// current window has a parent.  If the API Instance is not found, the
// function then checks to see if there are any opener windows.  If
// the window has an opener, the function begins to look for the
// API Instance in the opener window.
function GetAPI(win)
{
   if ((win.parent != null) && (win.parent != win))
   {
      API = ScanForAPI(win.parent);
   }
   if ((API == null) && (win.opener != null))
   {
      API = ScanForAPI(win.opener);
   }
}

///////////////////////////////////////////
//End ADL-provided API discovery algorithm
///////////////////////////////////////////
  
  
//Create function handlers for the loading and unloading of the page

//Constants
var SCORM_TRUE = "true";
var SCORM_FALSE = "false";
var SCORM_NO_ERROR = "0";

//Since the Unload handler will be called twice, from both the onunload
//and onbeforeunload events, ensure that we only call Terminate once.
var terminateCalled = false;

//Track whether or not we successfully initialized.
var initialized = false;

function ScormProcessInitialize(){
    var result;
    
    GetAPI(window);
    
    if (API == null){
		alert('Could not establish a connection with the LMS.\n\nYour results may not be recorded.', 'Error', 'danger');
        return;
    }
    
    result = API.LMSInitialize("");
    
    if (result == SCORM_FALSE){
        var errorNumber = API.LMSGetLastError();
        var errorString = API.LMSGetErrorString(errorNumber);
        var diagnostic = API.LMSGetDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        
		alert("Could not initialize communication with the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription);
        return;
    }
    
    initialized = true;

    var cmi_str = ScormProcessGetValue("cmi.suspend_data");
    if (cmi_str === "") {
        var no_tasks = document.querySelectorAll('[id^="task_"]').length;
        for (n = 0; n < no_tasks; n++) {
            var task_id = "task_" + n.toString();
            ScormProcessSetValue("cmi.interactions."+n+".id", task_id);
            ScormProcessSetValue("cmi.interactions."+n+".type", "fill-in");
            ScormProcessSetValue("cmi.interactions."+n+".student_response", "");
            ScormProcessSetValue("cmi.interactions."+n+".result", "neutral");
            ScormProcessSetValue("cmi.interactions."+n+".correct_responses.0.pattern", SOLUTIONS[task_id]);
        }
        ScormCommitChanges();
    } else {
        var cmi_obj = JSON.parse(cmi_str);

        for (const task_key in cmi_obj) {

            editors[task_key].setValue(cmi_obj[task_key], 1);
            var run_btn = document.getElementById("button_run_"+task_key);

            var task_id = parseInt(task_key.split("_")[1])
            if (task_id <= 10) {
                handle_enter(awk_run(run_btn));
            } else {
                editors[task_key].selection.moveTo(0, 0);
                run_awk_input(run(run_btn));
            }
        }
    }
}

function ScormProcessTerminate(){
    
    var result;
    
    //Don't terminate if we haven't initialized or if we've already terminated
    if (initialized == false || terminateCalled == true){return;}
    
    result = API.LMSFinish("");
    
    terminateCalled = true;
    
    if (result == SCORM_FALSE){
        var errorNumber = API.LMSGetLastError();
        var errorString = API.LMSGetErrorString(errorNumber);
        var diagnostic = API.LMSGetDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        
		alert("Could not terminate communication with the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription);
        return;
    }
}


/*
The onload and onunload event handlers are assigned in launchpage.html because more processing needs to 
occur at these times in this example.
*/
//window.onload = ScormProcessInitialize;
//window.onunload = ScormProcessTerminate;
//window.onbeforeunload = ScormProcessTerminate;

//There are situations where a GetValue call is expected to have an error
//and should not alert the user.
function ScormProcessGetValue(element, checkError = true){
    
    var result;
    
    if (initialized == false || terminateCalled == true){return;}
    
    result = API.LMSGetValue(element);
    
    if (checkError == true && result == ""){
    
        var errorNumber = API.LMSGetLastError();
        
        if (errorNumber != SCORM_NO_ERROR){
            var errorString = API.LMSGetErrorString(errorNumber);
            var diagnostic = API.LMSGetDiagnostic(errorNumber);
            
            var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
            
			alert("Could not retrieve a value from the LMS.\n\n" + errorDescription);
            return "";
        }
    }
    
    return result;
}

function ScormProcessSetValue(element, value){
   
    var result;
    
    if (initialized == false || terminateCalled == true){return;}
    
    result = API.LMSSetValue(element, value);
    
    if (result == SCORM_FALSE){
        var errorNumber = API.LMSGetLastError();
        var errorString = API.LMSGetErrorString(errorNumber);
        var diagnostic = API.LMSGetDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        
		alert("Could not store a value in the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription);
        return;
    }
    
}

function ScormCommitChanges(){
   
    var result;
    
    if (initialized == false || terminateCalled == true){return;}
    
    result = API.LMSCommit("");
    
    if (result == SCORM_FALSE){
        var errorNumber = API.LMSGetLastError();
        var errorString = API.LMSGetErrorString(errorNumber);
        var diagnostic = API.LMSGetDiagnostic(errorNumber);
        
        var errorDescription = "Number: " + errorNumber + "\nDescription: " + errorString + "\nDiagnostic: " + diagnostic;
        
		alert("Could not commit changes to the LMS.\n\nYour results may not be recorded.\n\n" + errorDescription);
        return;
    }
    
}

function ScormLessonCompleted()
{   
    if (ScormProcessGetValue("cmi.core.lesson_status") == "completed")
        return true;
    
    return false;
}

function ScormLessonPassed()
{   
    if (ScormProcessGetValue("cmi.core.lesson_status") == "passed")
        return true;
    
    return false;
}

function ScormLessonNotAttempted()
{   
    if (ScormProcessGetValue("cmi.core.lesson_status") == "not attempted")
        return true;
    
    return false;
}


function ScormMarkAsCompleted()
{   
    ScormProcessSetValue("cmi.core.lesson_status", "completed");
}

function ScormMarkAsIncomplete()
{   
    ScormProcessSetValue("cmi.core.lesson_status", "incomplete");
}

function ScormMarkAsPassed()
{   
    ScormProcessSetValue("cmi.core.lesson_status", "passed");
}

function ScormMarkAsFailed()
{   
    ScormProcessSetValue("cmi.core.lesson_status", "failed");
}

function ScormMarkAsBrowsed()
{   
    ScormProcessSetValue("cmi.core.lesson_status", "browsed");
}

function ScormSaveAnswer(task_id, student_response, result)
{   
    var cmi_str = ScormProcessGetValue("cmi.suspend_data");
    if (cmi_str === "")
        cmi_str = "{}";
    var cmi_obj = JSON.parse(cmi_str);
    cmi_obj[task_id] = student_response;
    cmi_str = JSON.stringify(cmi_obj);
    ScormProcessSetValue("cmi.suspend_data", cmi_str);

    var n = parseInt(task_id.split("_")[1]) - 1;
    ScormProcessSetValue("cmi.interactions."+n+".student_response", student_response);
    ScormProcessSetValue("cmi.interactions."+n+".result", result);

    ScormCommitChanges();
}

function ScormResetAnswer(task_id)
{
    var cmi_str = ScormProcessGetValue("cmi.suspend_data");
    if (cmi_str === "")
        return;
    var cmi_obj = JSON.parse(cmi_str);
    delete cmi_obj[task_id];
    cmi_str = JSON.stringify(cmi_obj);
    ScormProcessSetValue("cmi.suspend_data", cmi_str);

    var n = parseInt(task_id.split("_")[1]) - 1;
    ScormProcessSetValue("cmi.interactions."+n+".student_response", "");
    ScormProcessSetValue("cmi.interactions."+n+".result", "neutral");

    ScormCommitChanges();
}

function ScormSaveScore()
{
    var score = document.querySelectorAll('[id^="output_task_"].correct').length;
    var total = document.querySelectorAll('[id^="task_"]').length;

    ScormProcessSetValue("cmi.core.score.raw", score/total);
    ScormProcessSetValue("cmi.core.score.min", 0);
    ScormProcessSetValue("cmi.core.score.max", 1);
    if (score/total == 1)
        ScormProcessSetValue("cmi.core.lesson_status", "completed");
    else
        ScormProcessSetValue("cmi.core.lesson_status", "incomplete");

    ScormCommitChanges();
}
