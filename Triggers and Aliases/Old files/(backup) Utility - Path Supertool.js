/*
AUTHOR: feskslo, updated by Exosphere
Contains: 1 alias

Ultimate path manager. Can walk and reverse-walk, record new paths, quickly add/remove/list paths.
Path adding accepts common simplification, e.g.: "2e, 3w" -> "e, e, w, w, w"

USAGE:
    path                         - Show this info
    path <name>                  - Walk selected path
    path show/list               - Show stored paths
    path add <name> <directions> - Save or update a path
    path clear/remove <name>     - Remove a saved path
    path delay <num>             - Set delay (ms) between path steps

    path walk <name>             - Walk the named path
    path rwalk/back <name>       - Walk the path in reverse
                                   (uses <name>_rev if defined, else auto-reverses)

    path record / record start   - Begin recording a path
    path save / record save <name> - Save the recorded path
    path stop / record stop      - Stop and discard the current recording

Execute the following javascript:
*/

// The name of your alias. Change it here if you change the alias.
const aliasName = "path"

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
const messageColor = "#a1ebff"
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

    // Capture input on Enter key
    $("#input").off("keydown.pathRecorder").on("keydown.pathRecorder", event => {
        if (event.key === "Enter") {
            let step = $("#input").val().trim();
            if (step && !step.startsWith("pathrecord") && !step.startsWith("paths")) {
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
        append("Usage: paths record save <name>");
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
    append(`Path '${pathName}' saved: ${window.walklist.join(", ")}`, recorderColor);
    append(`If this path has a different reverse, walk it and use: path save ${pathName}_rev`, recorderColor);
    // Stop recording
    stopPathRecording();
    // Save backup to web storage
    save("stPathList",gwc.userdata.stPathList)
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
if(!gwc.userdata.stPathList && action != "initialize" && action != "restore") {
    let output = 
`
ERROR: Path storage not found. 
- If this is your first time using the alias, type '${aliasName} initialize'. Else, refresh the page.
- If refreshing doesn't help, type '${aliasName} restore' to load an automatic backup.
`
append(output);
}
else {

// Main logic - block switching based on action argument
if (!action) {
    // Pattern: paths
    // No arguments:
    // Print usage info, delay setting, and stored paths
    let output = 
`
Usage:
  ${aliasName}                         - Show this info
  ${aliasName} list                    - Show stored paths
  ${aliasName} add <name> <steps>     - Save or update a path
  ${aliasName} remove <name>          - Remove a saved path
  ${aliasName} delay <ms>             - Set delay (ms) between path steps

  ${aliasName} <name>                 - Walk the named path
  ${aliasName} back <name>            - Walk path in reverse (uses <name>_rev if defined)

  ${aliasName} record / record start  - Start recording a path
  ${aliasName} save <name>            - Save the recorded path
  ${aliasName} stop                   - Discard the current recording

Current path delay: ${gwc.userdata.path_delay || 50} ms
`
;
    append(output);
} 

// INITIALIZE PATH LIST

else if (action === "initialize") {
    gwc.userdata.stPathList = {};
    append("Path list initialized!")
}

else if (action === "show" || action === "list") {
    // Pattern: paths show
    // Print saved paths, sorted alphabetically by key
    let output = ("Defined Paths:\n - ");

    let pathEntries = Object.entries(gwc.userdata.stPathList)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Sort by key
        .map(([name, path]) => `${name}: ${compactPath(path)}`)
        .join("\n - ");

    output += pathEntries || "(None)";
    append(output);
    
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
    append(`Path '${pathName}' saved.`);
    // Save backup to web storage
    save("stPathList",gwc.userdata.stPathList)

} else if (action === "remove" && pathName) {
    // Pattern: paths clear <pathName>
    // Remove a path
    if (gwc.userdata.stPathList[pathName]) {
        delete gwc.userdata.stPathList[pathName];
        append(`Path '${pathName}' removed.`);
    } else {
        append(`Path '${pathName}' not found.`);
    }
    // Save backup to web storage
    save("stPathList",gwc.userdata.stPathList)

} else if (action === "delay") {
    // Pattern: paths delay <num>
    // Set a new delay between steps for all path walking functions
    // uses arg "pathName" for <num>
    if (!pathName) {
        // If no pathName is provided, prompt for the delay value
        append(`Please provide a delay number in milliseconds. Current delay: ${gwc.userdata.path_delay || 50} ms.`);
    } else if (isNaN(pathName)) {
        // If pathName is not a valid number, return an error
        append("Invalid delay value. Please enter a valid number.");
    } else {
        // Set delay between steps for pathwalking
        let delay = parseInt(pathName);
        if (delay > 0) {
            gwc.userdata.path_delay = delay;
            append(`Pathwalking delay set to ${delay} ms.`);
        } else {
            append("Please enter a positive delay value.");
        }
    }
    
} else if (action === "walk") {
    // Pattern: paths walk <pathName>
    // Walk the given path. Uses path_delay
    if (!pathName || !gwc.userdata.stPathList || !gwc.userdata.stPathList[pathName]) {
        let available = Object.keys(gwc.userdata.stPathList || {}).sort();
        append("Path not found. Available paths: " + available.join(", "), recorderColor);
        return;
    }
      
    let path = gwc.userdata.stPathList[pathName];
    append("Walking path '" + pathName + "': " + path.join(", "), messageColor);
      
    // Execute commands with delay
    path.forEach((command, index) => {
        setTimeout(() => {
            gwc.connection.send(command);
            gwc.output.color('#991999');
        }, index * delay);
    });
    
} else if (action === "rwalk" || action === "back") {
    // Pattern: path rwalk <pathName>
    // Try custom reverse path first: <pathName>_rev
    if (!pathName || !gwc.userdata.stPathList) {
        append("Path name missing or path storage not found.", recorderColor);
        return;
    }

    let customReverseName = pathName + "_rev";
    if (gwc.userdata.stPathList[customReverseName]) {
        let reversedPath = gwc.userdata.stPathList[customReverseName];
        append("Custom reverse path '" + customReverseName + "': " + reversedPath.join(", "), messageColor);
        reversedPath.forEach((command, index) => {
            setTimeout(() => {
                gwc.connection.send(command);
                gwc.output.color(messageColor);
            }, index * delay);
        });
    } else if (gwc.userdata.stPathList[pathName]) {
        let originalPath = gwc.userdata.stPathList[pathName];
        let getReverseCommand = function(cmd) {
            let lower = cmd.trim().toLowerCase();
            return reverseMapping[lower] || cmd;
        };
        let reversedPath = originalPath.slice().reverse().map(getReverseCommand);
        append("Auto-reversed path '" + pathName + "': " + reversedPath.join(", "), messageColor);
        reversedPath.forEach((command, index) => {
            setTimeout(() => {
                gwc.connection.send(command);
                gwc.output.color(messageColor);
            }, index * delay);
        });
    } else {
        let available = Object.keys(gwc.userdata.stPathList || {}).sort();
        append("Path not found. Available paths: " + available.join(", "), recorderColor);
    }
  
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
        append("Recording stopped without saving.", recorderColor);
        stopPathRecording();
    } else {
        append("Invalid command. Use 'path recordstart', 'pathrecord save <name>', or 'pathrecord stop'.");
    }
} 
else if (action === "save"){
    gwc.connection.send(aliasName + " record save "+args[2],true)
}
else if (action === "stop"){
    gwc.connection.send(aliasName + " record stop",true)
}
else if (action === "restore") {
    let restored = load("stPathList");
    if (restored) {
        gwc.userdata.stPathList = restored;
        append("Path list restored from web storage.");
    } else {
        append("No backup found to restore.");
    }
}
else if (action in gwc.userdata.stPathList) {
    gwc.connection.send(aliasName + " walk "+action,true)
} 
else {
    // Syntax error
    append("Invalid command. Use 'paths' for usage info.");
}
}