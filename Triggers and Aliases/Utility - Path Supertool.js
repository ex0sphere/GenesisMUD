/*
AUTHOR: feskslo (with tweaks by Exosphere)
Contains: 1 alias

Ultimate path manager. Can walk and reverse-walk, record new paths, quickly add/remove/list paths.
Path adding accepts common simplification, e.g.: "2e, 3w" -> "e, e, w, w, w"

USAGE:
  paths <name>                  - Walk selected path
  paths                         - Show this info
  paths show/list               - Show stored paths
  paths add <name> <directions> - Save/update a path
  paths clear/remove <name>     - Remove a saved path
  paths delay <num>             - Set the delay between steps when pathwalking

  paths walk <name>             - Walk selected path
  paths rwalk/back <name>       - Walk selected path in reverse
  
  paths record/record start     - Start the path recorder
  paths save/record save <name> - Save the recorded actions
  paths stop/record stop        - Stop the path recorder and discard path

Execute the following javascript:
*/

// The name of your alias. Change it here if you change the alias.
const aliasName = "paths"

// Configurable delay (default: 50ms)
let delay = gwc.userdata.path_delay || 50; 
// List reversed commands below. Add more as needed.
const reverseMapping = {
	  "n":"s", "s":"n","e":"w", "w":"e",
	  "ne":"sw", "nw":"se", "se":"nw", "sw":"ne",
	  "u":"d", "d":"u", "out":"in", "in":"out", "enter":"out",
      "climb up":"climb down","climb down":"climb up",
	}
// System message color
const messageColor = "magenta"
const recorderColor = "#fcba03"

/* No more user input needed. Enjoy! */

// Ensures path storage exists
gwc.userdata.stPathList = gwc.userdata.stPathList || {};

// Parse arguments
let action = args[1];
let pathName = args[2];
let directions = args['*'] ? args['*'].replace(action, "").replace(pathName, "").trim() : "";


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
		gwc.output.append("Already recording.");
		return;
	}

	window.isRecording = true;
	window.walklist = [];
	gwc.output.append("Recording started. Enter your steps...");

	// Capture input on Enter key
	$("#input").off("keydown.pathRecorder").on("keydown.pathRecorder", event => {
		if (event.key === "Enter") {
			let step = $("#input").val().trim();
			if (step && !step.startsWith("pathrecord") && !step.startsWith("paths")) {
				window.walklist.push(step);
				gwc.output.append("Recorded: " + step, recorderColor);
			}
		}
	});
}

// Pathrecorder: Function to save recording
function savePathRecording(pathName) {
	if (!window.isRecording) {
		gwc.output.append("Recorder not running. Nothing saved.");
		return;
	}
	if (!window.walklist || window.walklist.length === 0) {
		gwc.output.append("No recorded steps to save. Recorder still running.");
		return;
	}
	if (!pathName) {
		gwc.output.append("Usage: paths record save <name>");
		return;
	}
	// Ensure walklist is an array before joining
	if (!Array.isArray(window.walklist)) {
		console.error("walklist corrupted, resetting!");
		window.walklist = [];
	}
	// Save the path as an array
	gwc.userdata.stPathList = gwc.userdata.stPathList || {};
	gwc.userdata.stPathList[pathName] = [...window.walklist]; // Save as array
	gwc.output.append(`Path '${pathName}' saved: ${window.walklist.join(", ")}`, recorderColor);
	// Stop recording
	stopPathRecording();
}
// Pathrecorder: Function to stop recording without saving
function stopPathRecording() {
	if (!window.isRecording) {
		gwc.output.append("Not recording.");
		return;
	}

	window.isRecording = false;
	$("#input").off("keydown.pathRecorder");  // Remove event listener
}


// Main logic - block switching based on action argument
if (!action) {
    // Pattern: paths
	// No arguments:
	// Print usage info, delay setting, and stored paths
    let output = 
`Usage:
  paths                         - Show this info
  paths show/list               - Show stored paths
  paths add <name> <directions> - Save/update a path
  paths clear/remove <name>     - Remove a saved path
  paths delay <num>             - Set the delay between steps when pathwalking

  paths <name>                  - Walk selected path
  paths walk <name>             - Walk selected path
  paths rwalk/back <name>       - Walk selected path in reverse
  
  paths record start            - Start the path recorder
  paths record save <name>      - Save the recorded actions
  paths record stop             - Stop the path recorder and discard path

Current path delay: ${gwc.userdata.path_delay || 50} ms
`;
	gwc.output.append(output);
} else if (action === "show" || action === "list") {
	// Pattern: paths show
	// Print saved paths, sorted alphabetically by key
    let output = ("Defined Paths:\n");

    let pathEntries = Object.entries(gwc.userdata.stPathList)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Sort by key
        .map(([name, path]) => `${name}: ${compactPath(path)}`)
        .join("\n");

    output += pathEntries || "(None)";
    gwc.output.append(output);
	
} else if (action === "add" && pathName && directions) {
	// Pattern: paths add <pathName> <directions>
    // Add or update a path
	
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
		
	gwc.userdata.stPathList[pathName] = finalPath;	
    gwc.output.append(`Path '${pathName}' saved.`);

} else if ((action === "clear"||action === "remove") && pathName) {
    // Pattern: paths clear <pathName>
	// Remove a path
    if (gwc.userdata.stPathList[pathName]) {
        delete gwc.userdata.stPathList[pathName];
        gwc.output.append(`Path '${pathName}' removed.`);
    } else {
        gwc.output.append(`Path '${pathName}' not found.`);
    }

} else if (action === "delay") {
	// Pattern: paths delay <num>
	// Set a new delay between steps for all path walking functions
	// uses arg "pathName" for <num>
    if (!pathName) {
        // If no pathName is provided, prompt for the delay value
        gwc.output.append(`Please provide a delay number in milliseconds. Current delay: ${gwc.userdata.path_delay || 50} ms.`);
    } else if (isNaN(pathName)) {
        // If pathName is not a valid number, return an error
        gwc.output.append("Invalid delay value. Please enter a valid number.");
    } else {
        // Set delay between steps for pathwalking
        let delay = parseInt(pathName);
        if (delay > 0) {
            gwc.userdata.path_delay = delay;
            gwc.output.append(`Pathwalking delay set to ${delay} ms.`);
        } else {
            gwc.output.append("Please enter a positive delay value.");
        }
    }
	
} else if (action === "walk") {
	// Pattern: paths walk <pathName>
	// Walk the given path. Uses path_delay
	if (!pathName || !gwc.userdata.stPathList || !gwc.userdata.stPathList[pathName]) {
		let available = Object.keys(gwc.userdata.stPathList || {}).sort();
		gwc.output.append("Path not found. Available paths: " + available.join(", "), recorderColor);
		return;
	}
	  
	let path = gwc.userdata.stPathList[pathName];
	gwc.output.append("Walking path '" + pathName + "': " + path.join(", "), messageColor);
	  
	// Execute commands with delay
	path.forEach((command, index) => {
		setTimeout(() => {
			gwc.connection.send(command);
			gwc.output.color('#991999');
		}, index * delay);
	});
	
} else if (action === "rwalk" || action === "back") {
	// Pattern: paths rwalk <pathName>
	// Walk the given path in reverse. Uses path_delay

	if (!pathName || !gwc.userdata.stPathList || !gwc.userdata.stPathList[pathName]) {
	  let available = Object.keys(gwc.userdata.stPathList || {}).sort();
	  gwc.output.append("Path not found. Available paths: " + available.join(", "), recorderColor);
	  return;
	}

	// Retrieve and reverse the path
	let originalPath = gwc.userdata.stPathList[pathName];
	let getReverseCommand = function(cmd) {
		let lower = cmd.trim().toLowerCase(); // not strictly necessary, but included for robustness
		return reverseMapping[lower] || cmd; // if reverse command is not mapped, return unaltered cmd
	};
	let reversedPath = originalPath.slice().reverse().map(getReverseCommand);

	gwc.output.append("Reversed walking path '" + pathName + "': " + reversedPath.join(", "), messageColor);

	// Execute commands with delay
	reversedPath.forEach((command, index) => {
	  setTimeout(() => {
		  gwc.connection.send(command);
		  gwc.output.color(messageColor);
	  }, index * delay);
	});

} else if (action === "record") {
	// 3 different subactions for this one
	// paths record / paths record start                     - starts recording user actions
	// paths stop   / paths record stop                      - discards recorded actions
	// paths save <pathName> / paths record save <pathName>  - saves the recorded actions in userdata
	
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
		gwc.output.append("Recording stopped without saving.", recorderColor);
		stopPathRecording();
	} else {
		gwc.output.append("Invalid command. Use 'pathrecord start', 'pathrecord save <name>', or 'pathrecord stop'.");
	}
} 
else if (action === "save"){
    gwc.connection.send(aliasName + " record save "+args[2],true)
}
else if (action === "stop"){
    gwc.connection.send(aliasName + " record stop",true)
}
else if (action in gwc.userdata.stPathList) {
  	gwc.connection.send(aliasName + " walk "+action,true)
} 
else {
	// Syntax error
    gwc.output.append("Invalid command. Use 'paths' for usage info.");
}
