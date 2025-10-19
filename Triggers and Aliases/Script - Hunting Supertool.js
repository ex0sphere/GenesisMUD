/*
!!! DISCLAIMER: Botting is forbidden in Genesis MUD. You may face deletion if you are found scripting while inattentive.

AUTHOR: Exosphere & feskslo
REQUIRES: Combat - Kill Next Enemy.js (or a different "kill enemy on death" trigger)
OPTIONAL: Utility - Heal Self to Full (integration to aid with solo hunting)
Contains: 1 trigger, 1 alias

Multi-functional hunting suite:
- Easily make and run scripts for grinding areas.
- Comes with a path recorder.
- Tries to avoid killstealing. 

See usage below or type 'hunt' in-game for a help menu.
*/

// 1. TRIGGER //

/*
Trigger: Script - Hunting
Pattern: (^You find no such living creature\.|(?<!He|She|It) is fighting (?!you)|(?<!You) are fighting (?!you)|exclamation mark at the end of the command|^You cannot attack (.*) as|^You can&#39;t see anything here\.|^You don&#39;t find any)
*/

// No user input needed here, paths are managed through the alias.

// Sets your path to the one from the alias
let path = gwc.userdata.currentPath

let send = gwc.connection.send

gwc.userdata.huntOccupied = args[1].includes("fighting")

// Increases current room number by 1
gwc.userdata.roomCounter +=1
let roomCounter = gwc.userdata.roomCounter

function arrayToObject(arr) {
  return Object.fromEntries(
    arr.map((value, index) => [index + 1, value])
  );
}

function nextRoom(move){
	gwc.output.append("Room: "+roomCounter + "/" + path.length)
	for (let i = 0; i < move.length; i++) {
	gwc.connection.send(move[i],true)
	}
    setTimeout(()=> {
    	if(gwc.userdata.huntOccupied){
          gwc.userdata.huntOccupied = false
        }
      else {
		gwc.connection.send(gwc.userdata.killCommand + " " + gwc.userdata.enemy,true)}
        },gwc.userdata.huntDelay)
}

if(gwc.userdata.huntingSolo == true && mud.gmcp['char.vitals'].health != "feeling very well")
{
  gwc.userdata.roomCounter -= 1;
  gwc.connection.send("hs",true)
}
else {
    
if(gwc.userdata.currentScript!="off") {
    
if(roomCounter > path.length){
  gwc.connection.send(gwc.userdata.huntAliasName+" off",true);
  gwc.output.append("Area cleared!")
}
  else {

// Assigns room numbers to each path
let pathObject = arrayToObject(path)
  
// Executes the command for the right step of the path
let direction = pathObject[roomCounter]
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
Pattern: hunt
USAGE: 
    hunt         - show this menu
    hunt help    - help on how to add scripts
    hunt <name>  - start chosen script
    hunt <name> solo - start script with self-healing between rooms (requires Utility - Heal Self to Full)
    hunt pause   - pause by turning off the trigger
    hunt resume  - unpause by turning on the trigger
    hunt off     - end the script
    hunt command - (also cmd) set the current kill command (first word: ka or kill, second onwards: your chosen enemy)
    hunt list    - list scripts
    hunt add <name> hunt command <command>, <directions> - add a script
        Example: hunt add gk hunt command ka undead, e, w, w, sw 
        See below for more details.
    hunt remove <name> - remove a script
    hunt record      - start recording commands, start with 'hunt command <command> <enemy>'
    hunt save <name> - save recorded script
    hunt stop        - stop recording and DISCARD recorded actions
*/

// The name of your trigger - change this if you renamed the trigger below this alias.
const triggerName = "Script - Hunting"

// The name of your alias - change this and the pattern if you wish to change the command itself.
const aliasName = "hunt"
gwc.userdata.huntAliasName = aliasName

// Delay between rooms. Increase this if you need time for archers/SU to gather projectiles.
gwc.userdata.huntDelay = gwc.userdata.huntDelay || 50;

// System message color
const messageColor = "#ffc9ba"
const recorderColor = "#fcba03"

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

// Back up path list into browser storage
function save(key, value){
    if (typeof value !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
        append(`Saved to web storage successfully.`);
        }
    else {
        append(`Error with saving backup, value is undefined.`)
    }
}

// Load paths from backup
function load(key){
    if (typeof localStorage !== 'undefined') {
        append(`Loaded from web storage successfully.`);
        return JSON.parse(localStorage.getItem(key));
    }
    else {
        append(`No backup found in web storage.`)
    }
}

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
    append("Start with 'hunt command' or 'hunt cmd'! (example: hunt cmd kill orc)");

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
	gwc.userdata.huntPathList = gwc.userdata.huntPathList || {};
	gwc.userdata.huntPathList[pathName] = [...window.walklist]; // Save as array
	append(`Path '${pathName}' saved: ${window.walklist.join(", ")}`, recorderColor);
	// Stop recording
	stopPathRecording();
    // Save backup to web storage
    save("huntPathList",gwc.userdata.huntPathList);
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


// Main logic - block switching based on action argument

// Ensure path storage exists
if(!gwc.userdata.huntPathList && action != "initialize" && action != "restore") {
    let output = 
`
ERROR: Path storage not found. 
- If this is your first time using the alias, type '${aliasName} initialize'. Else, refresh the page.
- If refreshing doesn't help, type '${aliasName} restore' to load an automatic backup.
`
append(output);
}
else {

// SHOW SYNTAX

if (!action) {
    let output = 
`
Usage:
    ${aliasName}         - show this menu
    ${aliasName} help    - help on how to add scripts
    ${aliasName} <name>  - start chosen script
    ${aliasName} <name> solo - start script with self-healing between rooms (requires Utility - Heal Self to Full)
    ${aliasName} pause   - pause by turning off the trigger
    ${aliasName} resume  - unpause by turning on the trigger
    ${aliasName} off     - end the script
    ${aliasName} command - (also cmd) set the current kill command (first word: ka or kill, second onwards: your chosen enemy)
    ${aliasName} list    - list scripts
    ${aliasName} add <name> ${aliasName} command <command>, <directions> - add a script
        Example: ${aliasName} add gk ${aliasName} command ka undead, e, w, w, sw 
        See '${aliasName} help' for more details.
    ${aliasName} remove <name> - remove a script
    ${aliasName} record      - start recording commands, start with '${aliasName} command <command> <enemy>'
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

- Every script should start with '${aliasName} command <command> <enemy>'. 
    Otherwise you will have to manually use '${aliasName} command' before starting the script.
    'cmd' also works as a shorthand for 'command'.
    Examples: kill undead | ka orc | backstab solamnian human
    To attack multiple enemies at the same time, use ex0sphere's Attack All ("ka") or a similar alias.
    
- By default, the script executes your kill command after every comma.
    So a script of "${aliasName} command kill wight, e, d, e, e" will effectively do:
    "e, kill wight, d, kill wight, e, kill wight, e, kill wight"
    
- You can use dashes to move several rooms at once without attacking inbetween. 
    This may break your script if you run past someone fighting, though.
    Example: se-s-sw
    
- Spaces between commas are optional.

- Example of how to add a script:
    ${aliasName} add trollshaws ${aliasName} command kill troll, exa bushes-enter bushes-w, w, s, sw, e
    After adding this script, you can do '${aliasName} trollshaws' to start it.
`;
append(output);
}

// INITIALIZE PATH LIST

else if (action === "initialize") {
    gwc.userdata.huntPathList = {};
    append("Path list initialized!")
}

else if (action === "restore") {
    gwc.userdata.huntPathList = load("huntPathList");
}

// LIST SAVED SCRIPTS

else if (action === "list") {
    let output = ("Defined Paths:\n - ");
    let pathEntries = Object.entries(gwc.userdata.huntPathList)
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
		
	gwc.userdata.huntPathList[pathName] = finalPath;	
    append(`Path '${pathName}' saved.`);
    // Save backup to web storage
    save("huntPathList",gwc.userdata.huntPathList);
}

// REMOVE SCRIPT

else if (action === "remove" && pathName) {
    if (gwc.userdata.huntPathList[pathName]) {
        delete gwc.userdata.huntPathList[pathName];
        append(`Path '${pathName}' removed.`);
    } else {
        append(`Path '${pathName}' not found.`);
    }
    // Save backup to web storage
    save("huntPathList",gwc.userdata.huntPathList);
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

// SET KILL COMMAND

else if (args[1] == "command" || args[1] == "cmd"){
    gwc.userdata.killCommand = args[2];
    gwc.userdata.enemy = directions
    append("Command: "+gwc.userdata.killCommand)
    append("  Enemy: "+gwc.userdata.enemy)
}

// SET DELAY

else if (args[1] == "delay"){
    gwc.userdata.huntDelay = args[2];
    append("Delay between rooms set to "+args[2]+"ms.")
}

// START SCRIPT

else if(args[1] in gwc.userdata.huntPathList) {
    gwc.userdata.currentPath = gwc.userdata.huntPathList[args[1]]
    gwc.userdata.currentScript = args[1]
    gwc.userdata.roomCounter = 0
    append("Hunt started: "+args[1])
    gwc.trigger.enable(triggerName)
    gwc.connection.send("count enemies")
}

// PAUSE SCRIPT

else if(args[1] == "pause"){
    gwc.trigger.disable(triggerName)
}

// RESUME SCRIPT

else if(args[1] == "resume"){
    gwc.trigger.enable(triggerName)
}

// SHOW ERROR

else {
    append(`No such script found. Type ${aliasName} for help.`)
}
}

if(args[2] == "solo"){
  gwc.userdata.huntingSolo = true
  gwc.output.append("Solo: "+gwc.userdata.huntingSolo)
}
else if(args[1] != "command" && args[1] != "cmd"){
  gwc.userdata.huntingSolo = false
}
