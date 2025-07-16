/*
!!! DISCLAIMER: Botting is forbidden in Genesis MUD. You may face deletion if you are found scripting while inattentive.

AUTHOR: Exosphere, feskslo, Sonta
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
Pattern: (^You find (a|an) .*[!.]|^You peer searchingly around\.$|^You search everywhere\, but find no herbs\.$|Your search reveals nothing special)
*/

// No user input needed here, paths are managed through the alias.
let path = gwc.userdata.currentPath;
let timesToHerb = gwc.userdata.herbTimes;
let send = gwc.connection.send;

function arrayToObject(arr) {
    return Object.fromEntries(
        arr.map((value, index) => [index + 1, value])
    );
}

gwc.output.append("echo: " + args[0])

function nextRoom(move) {
    gwc.output.append("Room: " + gwc.userdata.roomCounter);

    let i = 0;
    function sendStep() {
        if (i < move.length) {
            gwc.connection.send(move[i], true);
            i++;
            setTimeout(sendStep, 50); // Delay between each move in milliseconds (adjust if needed)
        } else {
            setTimeout(() => {
                gwc.connection.send("reveal all");
                gwc.connection.send("search here for " + gwc.userdata.herbCommand);
            }, 200);
        }
    }

    sendStep();
}
if (gwc.userdata.currentScript != "off") {

    if (args[1].includes("You find")) {
        if (args[1].includes("brown field mouse")) {
            gwc.output.append("A brown field mouse was found — ignoring and searching again...");
            setTimeout(() => {
                gwc.connection.send("!search here for " + gwc.userdata.herbCommand, true);
            }, 300);
        } else {
            gwc.connection.send("open qarraba");
            gwc.connection.send("put herb in qarraba");
            gwc.connection.send("close qarraba");
            gwc.userdata.herbedtimes = gwc.userdata.herbedtimes + 1;
            if (gwc.userdata.herbedtimes < timesToHerb) {
                gwc.connection.send("!search here for " + gwc.userdata.herbCommand, true);
            } else {
                gwc.output.append("Found max herbs!");
                gwc.output.color("#cfff7d");
                gwc.userdata.herbedtimes = 0;
                setTimeout(() => {
                    gwc.connection.send("!peer searchingly");
                }, 300);
            }
        }
    }
    else {
        gwc.userdata.herbedtimes = 0;
        gwc.userdata.roomCounter += 1;
        gwc.output.append("Moving to next room...");
        if (gwc.userdata.roomCounter > path.length) {
            gwc.connection.send(gwc.userdata.herbAliasName + " off", true);
            gwc.output.append("Area herbed!");
        } else {
            let pathObject = arrayToObject(path);
            let direction = pathObject[gwc.userdata.roomCounter];
            direction = direction.split("-");
            nextRoom(direction);
        }
    }
}

// ------------------------------------- //
// ------------------------------------- //
// ------------------------------------- //

// 2. ALIAS  //
/*
    Pattern: herb
    Usage:
        herb         - show this menu
        herb help    - help on how to add scripts
        herb <name> [herb name]  - start chosen script (optionally set herb)
        herb command <herb name> - set the herb to search for (multi-word supported)
        herb times   - set how many times to herb in a room
        herb off     - turn off the script
        herb list    - list scripts
        herb add <name> <directions> - add a script
            Example: herb add forest, e, w, w, sw
            See 'herb help' for more details.
        herb remove <name> - remove a script
        herb record      - start recording commands, start with 'herb command <herb>'
        herb save <name> - save recorded script
        herb stop        - stop recording and DISCARD recorded actions
        herb export         - export all paths to a base64 string
        herb import <data>  - import path list from a base64 string
*/

// The name of your trigger - change this if you renamed the trigger below this alias.
const triggerName = "Script - Herbing"

// The name of your alias - change this and the pattern if you wish to change the command itself.
const aliasName = "herb"
gwc.userdata.herbAliasName = gwc.userdata.herbAliasName || aliasName

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
function append(text, color) {
    if (color) {
        gwc.output.append(text, color)
    }
    else {
        gwc.output.append(text, messageColor)
    }
}

// Helper functions:

// Back up path list into browser storage
function save(key, value) {
    if (typeof value !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
        append(`Saved to web storage successfully.`);
    }
    else {
        append(`Error with saving backup, value is undefined.`)
    }
}

// Load paths from backup
function load(key) {
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
    append("Start with 'herb command' or 'herb cmd'! (example: herb cmd suranie)");

    // Capture input on Enter key
    $("#input").off("keydown.pathRecorder").on("keydown.pathRecorder", event => {
        if (event.key === "Enter") {
            let step = $("#input").val().trim();
            if (step && !step.startsWith(aliasName + " save" || aliasName + " stop")) {
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
    // Save backup to web storage
    save("herbPathList", gwc.userdata.herbPathList)
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
if (!gwc.userdata.herbPathList && action != "initialize" && action != "restore") {
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

    // SHOW SYNTAX

    if (!action) {
        let output =
            `
    Usage:
        ${aliasName}         - show this menu
        ${aliasName} help    - help on how to add scripts
        ${aliasName} <name> [herb name] - start chosen script (optionally set herb)
        ${aliasName} command <herb name> - set the herb name to search (multi-word supported)
        ${aliasName} times   - set how many times to herb in a room
        ${aliasName} off     - turn off the script
        ${aliasName} list     - list scripts
        ${aliasName} add <name> <directions> - add a script
            Example: ${aliasName} add forest, e, w, w, sw
            See '${aliasName} help' for more details.
        ${aliasName} remove <name> - remove a script
        ${aliasName} record      - start recording commands, start with '${aliasName} command <herb>'
        ${aliasName} save <name> - save recorded script
        ${aliasName} stop        - stop recording and DISCARD recorded actions
        ${aliasName} export         - export all paths to a base64 string
        ${aliasName} import <data> - import path list from a base64 string
    `;
        append(output);
    }

    // SHOW TUTORIAL

    else if (action === "help") {
        let output =
            `
    HOW TO ADD SCRIPTS:
    
    - By default, the script executes your herb command after every comma.
        Herb may be set one of three ways:
              Manual    - 'herb command <herb>'
              Dynamic   - 'herb <pathName> <herb>'
              Hardcode  - Add as first command of saved path.
        So a script of "${aliasName} command suranie, e, d, e, e" will effectively do:
        "e, search here for suranie, d, search here for suranie, e, search here for suranie, e, search here for suranie"
        
    - You can use dashes to move several rooms at once without searching inbetween. 
        Example: se-s-sw
        
    - Spaces between commas are optional.
    
    - Example of how to add a script:
        ${aliasName} add forest ${aliasName} command suranie, w, nw, nw-nw-n, w, nw
        After adding this script, you can do '${aliasName} forest' to start it.
  
        ${aliasName} add forest w,nw,nw-nw-n,w,nw
        After adding this script, you can do '${aliasName} forest <herb>' to start dynamically
        or set 'herb command <herb>' and the start with '${aliasName} forest'.
    `;
        append(output);
    }

    // INITIALIZE PATH LIST

    else if (action === "initialize") {
        gwc.userdata.herbPathList = {};
        append("Path list initialized!")
    }

    else if (action === "restore") {
        gwc.userdata.herbPathList = load("herbPathList");
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
        // Save backup to web storage
        save("herbPathList", gwc.userdata.herbPathList)
    }

    // REMOVE SCRIPT

    else if (action === "remove" && pathName) {
        if (gwc.userdata.herbPathList[pathName]) {
            delete gwc.userdata.herbPathList[pathName];
            append(`Path '${pathName}' removed.`);
        } else {
            append(`Path '${pathName}' not found.`);
        }
        // Save backup to web storage
        save("herbPathList", gwc.userdata.herbPathList)
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

    else if (action === "save") {
        gwc.connection.send(aliasName + " record save " + args[2], true)
    }

    // STOP AND DISCARD RECORDING

    else if (action === "stop") {
        gwc.connection.send(aliasName + " record stop", true)
    }

    // TURN OFF SCRIPT

    else if (args[1] == "off") {
        append("Script stopped.")
        gwc.trigger.disable(triggerName)
    }

    // SET TIMES TO HERB

    else if (args[1] == "times") {
        gwc.userdata.herbTimes = args[2];
        append("Times to herb per room: " + gwc.userdata.herbTimes)
    }

    // SET HERB COMMAND (multi-word support)
    else if (args[1] == "command" || args[1] == "cmd") {
        const herbName = args['*'].split(/\s+/).slice(1).join(" ");
        gwc.userdata.herbCommand = herbName;
        append("Command: search here for " + herbName);
    }

    // START SCRIPT (multi-word herb support)
    else if (args[1] in gwc.userdata.herbPathList) {
        const customHerb = args['*'].split(/\s+/).slice(1).join(" ");
        if (customHerb) {
            gwc.userdata.herbCommand = customHerb;
            append("Command set to: search here for " + customHerb);
        }
        gwc.userdata.herbedtimes = 0;
        gwc.userdata.currentPath = gwc.userdata.herbPathList[args[1]];
        gwc.userdata.currentScript = args[1];
        gwc.userdata.roomCounter = 0;
        append("Herbing started: " + args[1]);
        gwc.connection.send("!peer searchingly");
        gwc.trigger.enable(triggerName);
    }

    // EXPORT PATHS AS BASE64
    else if (action === "export") {
        if (!gwc.userdata.herbPathList || Object.keys(gwc.userdata.herbPathList).length === 0) {
            append("Nothing to export.");
        } else {
            const json = JSON.stringify(gwc.userdata.herbPathList);
            const encoded = btoa(unescape(encodeURIComponent(json)));
            append("Exported base64 string (copy & save):");
            append(encoded, "#d0ffba");
        }
    }

    // IMPORT PATHS FROM BASE64
    else if (action === "import") {
        const encoded = args['*'].replace("import", "").trim();
        try {
            const decoded = decodeURIComponent(escape(atob(encoded)));
            const imported = JSON.parse(decoded);
            if (typeof imported === "object") {
                gwc.userdata.herbPathList = imported;
                append("Import successful.");
                save("herbPathList", imported);
            } else {
                append("Decoded data is not a valid object.");
            }
        } catch (e) {
            append("Failed to import: " + e.message);
        }
    }

    // SHOW ERROR

    else {
        append(`No such script found. Type ${aliasName} for help.`)
    }
}
