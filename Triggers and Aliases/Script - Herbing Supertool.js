/*
!!! DISCLAIMER: Botting is forbidden in Genesis MUD. You may face deletion if you are found scripting while inattentive.

AUTHOR: Exosphere & feskslo
Contains: 1 trigger, 1 alias

Multi-functional herbing suite:
- Easily make and run scripts for herbing areas. 
- Comes with a path recorder. 
- Change the herb on the fly.

See usage below or type 'herb' in-game for a help menu.
*/

// 1. TRIGGER //

/*
Trigger: Script - Herbing
Pattern: (^You find (a|an) (?!brown field mouse)(.*)[!.]|^You peer searchingly around\.$|^You search everywhere\, but find no herbs\.$|Your search reveals nothing special)
*/

// No user input needed here, paths are managed through the alias.

let path = gwc.userdata.currentPath
let timesToHerb = gwc.userdata.herbTimes
let send = gwc.connection.send

function arrayToObject(arr) {
  return Object.fromEntries(
    arr.map((value, index) => [index + 1, value])
  );
}

function nextRoom(move){
	gwc.output.append("Room: "+gwc.userdata.roomCounter)
	for (let i = 0; i < move.length; i++) {
	gwc.connection.send(move[i],true)
	}
    setTimeout(()=>{gwc.connection.send("search here for "+gwc.userdata.herbCommand)},100)
}

if(gwc.userdata.currentScript!="off") {

// Herb each room until empty
if(args[1].includes("You find")) {
    
     gwc.userdata.herbedtimes=gwc.userdata.herbedtimes+1;
     if (gwc.userdata.herbedtimes<timesToHerb) {
        gwc.connection.send("!search here for "+gwc.userdata.herbCommand,true);
        }
        else {
            gwc.output.append("Found max herbs!");
            gwc.output.color("#cfff7d");
            gwc.connection.send("!peer searchingly");
            gwc.userdata.herbedtimes=0;
        }
	}
// If room fully herbed, move on
else {
gwc.userdata.herbedtimes=0;
gwc.userdata.roomCounter +=1
if(gwc.userdata.roomCounter > path.length){
  gwc.connection.send(gwc.userdata.herbAliasName+" off",true);
  gwc.output.append("Area herbed!")
}
  else {
// Assigns room numbers to each path
let pathObject = arrayToObject(path)
  
// Executes the command for the right step of the path
let direction = pathObject[gwc.userdata.roomCounter]
direction = direction.split("-")


nextRoom(direction)
  }
}
}

// ------------------------------------- //
// ------------------------------------- //
// ------------------------------------- //

// 2. ALIAS  //

/*
Pattern: herb
USAGE: 
    herb         - show this menu
    herb help    - help on how to add scripts
    herb <name>  - start chosen script
    herb off     - turn off the script
    herb times   - set how many times to herb in a room
    herb command - (also cmd) set the current herb to search for
    herb list - list scripts
    herb add <name> herb command <herb>, <directions> - add a script
        Example: herb add forest herb command suranie, e, w, w, sw 
        See 'herb help' for more details.
    herb remove <name> - remove a script
    herb record - start recording commands, start with 'hunt command <command> <enemy>'
    herb save <name> - save recorded script
    herb stop - stop recording and DISCARD recorded actions
*/

// The name of your trigger - change this if you renamed the trigger below this alias.
const triggerName = "Script - Herbing"

// The name of your alias - change this and the pattern if you wish to change the command itself.
const aliasName = "herb"
gwc.userdata.herbAliasName = aliasName

// System message color
const messageColor = "#93d962"
const recorderColor = "#fcba03"

gwc.userdata.herbTimes = gwc.userdata.herbTimes || 3 // How many times to herb per room

/* No more user input needed. Enjoy! */

// Parse arguments
let action = args[1];
let pathName = args[2];
let directions = args['*'] ? args['*'].replace(action, "").replace(pathName, "").trim() : "";

// Color system messages
function append(text, color){
    if(color){
        gwc.output.append(text,color)
    }
    else {
    gwc.output.append(text,messageColor)
    }
}

// Helper functions:

// Function to compact paths into numeric-prefix notation
function compactPath(pathArray) {
    let compacted = [];
    let last = null;
    let count = 0;

    pathArray.forEach(step => {
        if (step === last) {
            count++;
        } else {
            if (last !== null) {
                compacted.push(count > 1 ? count + last : last);
            }
            last = step;
            count = 1;
        }
    });

    if (last !== null) {
        compacted.push(count > 1 ? count + last : last);
    }

    return compacted.join(", ");
}

// Pathrecorder: Function to start recording
function startPathRecording() {
	if (window.isRecording) {
		append("Already recording.");
		return;
	}

	window.isRecording = true;
	window.walklist = [];
	append("Recording started. Enter your steps...");
    append("Start with 'herb command' or 'herb cmd'! (example: herb cmd suranie)");

	// Capture input on Enter key
	$("#input").off("keydown.pathRecorder").on("keydown.pathRecorder", event => {
		if (event.key === "Enter") {
			let step = $("#input").val().trim();
			if (step && !step.startsWith(aliasName+" save" || aliasName+" stop")) {
				window.walklist.push(step);
				append("Recorded: " + step, recorderColor);
			}
		}
	});
}

// Pathrecorder: Function to save recording
function savePathRecording(pathName) {
	if (!window.isRecording) {
		append("Recorder not running. Nothing saved.");
		return;
	}
	if (!window.walklist || window.walklist.length === 0) {
		append("No recorded steps to save. Recorder still running.");
		return;
	}
	if (!pathName) {
		append(`Usage: ${aliasName} save <name>`);
		return;
	}
	// Ensure walklist is an array before joining
	if (!Array.isArray(window.walklist)) {
		console.error("walklist corrupted, resetting!");
		window.walklist = [];
	}
	// Save the path as an array
	gwc.userdata.herbPathList = gwc.userdata.herbPathList || {};
	gwc.userdata.herbPathList[pathName] = [...window.walklist]; // Save as array
	append(`Path '${pathName}' saved: ${window.walklist.join(", ")}`, recorderColor);
	// Stop recording
	stopPathRecording();
}
// Pathrecorder: Function to stop recording without saving
function stopPathRecording() {
	if (!window.isRecording) {
		append("Not recording.");
		return;
	}

	window.isRecording = false;
	$("#input").off("keydown.pathRecorder");  // Remove event listener
}

// Ensure path storage exists

if(!gwc.userdata.herbPathList && action != "initialize") {
    let output = 
`
ERROR: Path storage not found. If this is your first time using the alias, type '${aliasName} initialize'. Else, refresh the page.
`
append(output);
}
else {

// Main logic - block switching based on action argument

// SHOW SYNTAX

if (!action) {
    let output = 
`
Usage:
    ${aliasName}         - show this menu
    ${aliasName} help    - help on how to add scripts
    ${aliasName} <name>  - start chosen script
    ${aliasName} off     - turn off the script
    ${aliasName} times   - set how many times to herb in a room
    ${aliasName} command - (also cmd) set the current herb to search for
    ${aliasName} list     - list scripts
    ${aliasName} add <name> ${aliasName} command <herb>, <directions> - add a script
        Example: ${aliasName} add forest ${aliasName} command suranie, e, w, w, sw
        See '${aliasName} help' for more details.
    ${aliasName} remove <name> - remove a script
    ${aliasName} record      - start recording commands, start with '${aliasName} command <herb>'
    ${aliasName} save <name> - save recorded script
    ${aliasName} stop        - stop recording and DISCARD recorded actions
    
`;
append(output);
}

// SHOW TUTORIAL

else if (action === "help"){
    let output = 
`
HOW TO ADD SCRIPTS:

- Every script should start with '${aliasName} command <herb>'. 
    Otherwise you will have to manually use '${aliasName} command' before starting the script.
    'cmd' also works as a shorthand for 'command'.
    Example: herb command suranie
    
- By default, the script executes your herb command after every comma.
    So a script of "${aliasName} command suranie, e, d, e, e" will effectively do:
    "e, search here for suranie, d, search here for suranie, e, search here for suranie, e, search here for suranie"
    
- You can use dashes to move several rooms at once without searching inbetween. 
    Example: se-s-sw
    
- Spaces between commas are optional.

- Example of how to add a script:
    ${aliasName} add forest ${aliasName} command suranie, w, nw, nw-nw-n, w, nw
    After adding this script, you can do '${aliasName} forest' to start it.
`;
append(output);
}

// INITIALIZE PATH LIST

else if (action === "initialize") {
    gwc.userdata.herbPathList = {};
    append("Path list initialized!")
}

// LIST SAVED SCRIPTS

else if (action === "list") {
    let output = ("Defined Paths:\n - ");
    let pathEntries = Object.entries(gwc.userdata.herbPathList)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Sort by key
        .map(([name, path]) => `${name}: ${compactPath(path)}`)
        .join("\n - ");
    output += pathEntries || "(None)";
    append(output);
}

// ADD SCRIPT

else if (action === "add" && pathName && directions) {
	
	// Split using ", " as the delimiter
	let tokens = directions.split(/,\s*/);
	let finalPath = [];
	
	// Process each token: if it starts with a number, repeat the command that many times.
	tokens.forEach(token => {
		token = token.trim();
		let m = token.match(/^(\d+)(.*)$/);
		if (m) {
		  let count = parseInt(m[1]);
		  let cmd = m[2].trim();
		  for (let i = 0; i < count; i++) {
			  finalPath.push(cmd);
		  }
		} else if (token !== "") {
		  finalPath.push(token);
		}
	});
		
	gwc.userdata.herbPathList[pathName] = finalPath;	
    append(`Path '${pathName}' saved.`);
}

// REMOVE SCRIPT

else if (action === "remove" && pathName) {
    if (gwc.userdata.herbPathList[pathName]) {
        delete gwc.userdata.herbPathList[pathName];
        append(`Path '${pathName}' removed.`);
    } else {
        append(`Path '${pathName}' not found.`);
    }
}

// SCRIPT RECORDER

else if (action === "record") {
	// 3 different subactions for this one
	// hunt record start       - starts recording user actions
	// hunt record stop        - discards recorded actions
	// hunt record save <name> - saves the recorded actions in userdata
	
	// Set global states if undefined
	if (window.walklist === undefined) window.walklist = [];
	if (window.isRecording === undefined) window.isRecording = false;
	if (window.pathName === undefined) window.pathName = "temp";

	// Sub-command handler for path record
	let recorderAction = args[2];  // "start", "save", or "stop"
	let recorderPathName = args[3]; // Path name for "save"

	if (recorderAction === "start" || !recorderAction) {
		startPathRecording();
	} else if (recorderAction === "save") {
		savePathRecording(recorderPathName);
	} else if (recorderAction === "stop") {
		append("Recording stopped without saving.", recorderColor);
		stopPathRecording();
	} else {
		append(`Invalid command. Use '${aliasName} record' to start,'${aliasName} save <name>' to save recording, or '${aliasName} stop' to abort recording.`);
	}
} 
// SAVE RECORDING

else if (action === "save"){
    gwc.connection.send(aliasName + " record save "+args[2],true)
}

// STOP AND DISCARD RECORDING

else if (action === "stop"){
    gwc.connection.send(aliasName + " record stop",true)
}

// TURN OFF SCRIPT

else if(args[1] == "off"){
    append("Script stopped.")
    gwc.trigger.disable(triggerName)
}

// SET TIMES TO HERB

else if (args[1] == "times"){
    gwc.userdata.herbTimes = args[2];
    append("Times to herb per room: "+gwc.userdata.herbTimes)
}

// SET HERB COMMAND

else if (args[1] == "command" || args[1] == "cmd"){
    gwc.userdata.herbCommand = args[2];
    append("Command: search here for "+gwc.userdata.herbCommand)
}

// START SCRIPT

else if(args[1] in gwc.userdata.herbPathList) {
    gwc.userdata.herbedtimes = 0;
    gwc.userdata.currentPath = gwc.userdata.herbPathList[args[1]]
    gwc.userdata.currentScript = args[1]
    gwc.userdata.roomCounter = 0
    append("Herbing started: "+args[1])
    gwc.connection.send("!peer searchingly")
    gwc.trigger.enable(triggerName)
}

// SHOW ERROR

else {
    append(`No such script found. Type ${aliasName} for help.`)
}
}