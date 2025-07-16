/*
AUTHOR: feskslo, updated by Exosphere & Sonta
Contains: 1 alias

Ultimate path manager. Can walk and reverse-walk, record new paths, quickly add/remove/list paths.
Path adding accepts common simplification, e.g.: "2e, 3w" -> "e, e, w, w, w"

USAGE:
    path                            - Show usage and paths
    path list                       - Show stored paths
    path add <name> <steps>         - Add or update a path
    path remove <name>              - Delete a saved path
    path delay <ms>                 - Set walk step delay in ms
      
    path walk <name>                - Walk path by name
    path r <name>                   - Walk path in reverse
                                            (uses <name>_rev if it exists, otherwise auto-reverses with overrides)
      
    path record                     - Start recording
    path save <name>                - Save current recording
    path stop                       - Stop and discard recording
      
    path reverse <name> override <index> <action>
                                    - For reversing, overwrite step number <index> with <action>.
                                        	(for example, to change "enter hole" into "exit hole")
    
    path index <name>               - Lists the index of each step in path for easier reverse editing.
    
    path initialize                 - Set up empty path lists (Only use once or to reset)
    path restore                    - Restore paths from web storage

Execute the following javascript:
*/

// === CONFIG ===
const aliasName = "path";
let delay = gwc.userdata.path_delay || 50;
const reverseMapping = {
    n: "s",
    s: "n",
    e: "w",
    w: "e",
    ne: "sw",
    nw: "se",
    se: "nw",
    sw: "ne",
    u: "d",
    d: "u",
    in: "out",
    out: "in",
    enter: "out",
    "climb up": "climb down",
    "climb down": "climb up",
};
const messageColor = "#a1ebff";
const recorderColor = "#fcba03";

// === UTILITIES ===
function append(text, color = messageColor) {
    gwc.output.append(text, color);
}

function save(key, value) {
    if (typeof value !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
        append(`[SAVE] '${key}' saved to web storage.`);
    }
}

function load(key) {
    const data = localStorage.getItem(key);
    if (data) {
        append(`[LOAD] '${key}' restored from web storage.`);
        return JSON.parse(data);
    }
}

function compactPath(path) {
    let compact = [],
        last = null,
        count = 0;
    for (let step of path) {
        if (step === last) count++;
        else {
            if (last) compact.push(count > 1 ? count + last : last);
            last = step;
            count = 1;
        }
    }
    if (last) compact.push(count > 1 ? count + last : last);
    return compact.join(", ");
}

function startRecording() {
    if (window.isRecording) return append("Already recording.");
    window.isRecording = true;
    window.walklist = [];
    $("#input")
        .off("keydown.pathRecorder")
        .on("keydown.pathRecorder", (e) => {
            if (e.key === "Enter") {
                let val = $("#input").val().trim();
                if (val && !val.startsWith("path")) {
                    window.walklist.push(val);
                    append(`[REC] ${val}`, recorderColor);
                }
            }
        });
    append("Recording started...");
}

function stopRecording() {
    if (!window.isRecording) return append("Not recording.");
    window.isRecording = false;
    $("#input").off("keydown.pathRecorder");
}

function saveRecording(name) {
    if (!window.isRecording || !window.walklist || window.walklist.length === 0)
        return append("Nothing to save.");
    if (!name) return append("Usage: path save <name>");
    gwc.userdata.stPathList = gwc.userdata.stPathList || {};
    gwc.userdata.stPathList[name] = [...window.walklist];
    append(`Path '${name}' saved: ${window.walklist.join(", ")}`, recorderColor);
    append(`Reverse it or customize via: path reverse override ${name} ...`);
    stopRecording();
    save("stPathList", gwc.userdata.stPathList);
}

function resolveReversePath(path, overrides = {}) {
    return path
        .map(
            (step, idx) =>
                overrides[idx + 1] || reverseMapping[step.trim().toLowerCase()] || step
        )
        .reverse();
}

// === SETUP ===
gwc.userdata.stPathList = gwc.userdata.stPathList || {};
gwc.userdata.reverseOverrides = gwc.userdata.reverseOverrides || {};

// === COMMAND PARSE ===
const action = args[1];
const pathName = args[2];
const subAction = args[3];
const directions = args["*"].replace(action, "").replace(pathName, "").trim();

// === MAIN LOGIC ===
if (!action) {
    return append(`
USAGE:
    path                            - Show usage and paths
    path list                       - Show stored paths
    path add <name> <steps>         - Add or update a path
    path remove <name>              - Delete a saved path
    path delay <ms>                 - Set walk step delay in ms
      
    path walk <name>                - Walk path by name
    path r <name>                   - Walk path in reverse
                                            (uses <name>_rev if it exists, otherwise auto-reverses with overrides)
      
    path record                     - Start recording
    path save <name>                - Save current recording
    path stop                       - Stop and discard recording
      
    path reverse <name> override <index> <action>
                                    - For reversing, overwrite step number <index> with <action>.
                                        	(for example, to change "enter hole" into "exit hole")
    
    path index <name>               - Lists the index of each step in path for easier reverse editing.
    
    path initialize                 - Set up empty path lists (Only use once or to reset)
    path restore                    - Restore paths from web storage
    
    Current delay: ${gwc.userdata.path_delay || 50}ms
`);
}

if (action === "initialize") {
    gwc.userdata.stPathList = {};
    gwc.userdata.reverseOverrides = {};
    save("stPathList", {});
    save("reverseOverrides", {});
    return append("Initialized empty path and override storage.");
}
else if (action === "restore") {
    const paths = load("stPathList");
    const overrides = load("reverseOverrides");
    if (paths) gwc.userdata.stPathList = paths;
    if (overrides) gwc.userdata.reverseOverrides = overrides;
    save("stPathList", paths);
    save("reverseOverrides", overrides);
    append("Restored paths and overrides from web storage and updated userdata.", recorderColor);
}
else if (action === "list") {
    let entries = Object.entries(gwc.userdata.stPathList);
    if (!entries.length) return append("No paths saved.");
    append("Saved paths:", messageColor);
    entries.forEach(([k, v]) => {
        const hasOverride =
            gwc.userdata.reverseOverrides[k] &&
            Object.keys(gwc.userdata.reverseOverrides[k]).length > 0;
        const nameLine = hasOverride ? `${k}*` : k;
        append(`- ${nameLine}`, recorderColor);
        append(`${compactPath(v)}`, messageColor);
    });
}
else if (action === "add" && pathName && directions) {
    const tokens = directions.split(/,\s*/);
    const final = [];
    tokens.forEach((t) => {
        const match = t.match(/^(\d+)(.+)$/);
        if (match) final.push(...Array(parseInt(match[1])).fill(match[2].trim()));
        else if (t) final.push(t.trim());
    });
    gwc.userdata.stPathList[pathName] = final;
    save("stPathList", gwc.userdata.stPathList);
    return append(`Path '${pathName}' saved.`);
}
else if (action === "remove" && pathName) {
    delete gwc.userdata.stPathList[pathName];
    delete gwc.userdata.reverseOverrides[pathName];
    save("stPathList", gwc.userdata.stPathList);
    save("reverseOverrides", gwc.userdata.reverseOverrides);
    return append(`Removed path '${pathName}'.`);
}
else if (action === "delay") {
    const ms = parseInt(pathName);
    if (!isNaN(ms) && ms > 0) {
        gwc.userdata.path_delay = ms;
        return append(`Delay set to ${ms}ms.`);
    } else return append("Enter a valid positive number.");
}
else if (action === "walk" && pathName) {
    const path = gwc.userdata.stPathList[pathName];
    if (!path) return append("Path not found.");
    path.forEach((cmd, i) =>
        setTimeout(() => gwc.connection.send(cmd), i * delay)
    );
    return append(`Walking path '${pathName}'...`);
}
else if ((action === "r") && pathName) {
    const path = gwc.userdata.stPathList[pathName];
    if (!path) return append("Path not found.");
    const overrides = gwc.userdata.reverseOverrides[pathName] || {};
    const rev = resolveReversePath(path, overrides);
    rev.forEach((cmd, i) =>
        setTimeout(() => gwc.connection.send(cmd), i * delay)
    );
    return append(`Walking reversed path '${pathName}'...`);
}
else if (action === "reverse" && pathName && subAction === "override" && args[4] && args[5]) {
    const idx = parseInt(args[4]);
    const newDir = [args[5], args[6], args[7]].filter((x) => x).join(" ");
    gwc.userdata.reverseOverrides = gwc.userdata.reverseOverrides || {};
    if (!gwc.userdata.reverseOverrides[pathName])
        gwc.userdata.reverseOverrides[pathName] = {};
    gwc.userdata.reverseOverrides[pathName][idx] = newDir;
    save("reverseOverrides", gwc.userdata.reverseOverrides);
    return append(
        `Set reverse override for '${pathName}' at index ${idx} → '${newDir}'`
    );
}
else if (action === "index" && pathName) {
    if (!gwc.userdata.stPathList || !gwc.userdata.stPathList[pathName]) {
        gwc.output.append(`[INDEX] Path '${pathName}' not found.`);
    } else {
        const steps = gwc.userdata.stPathList[pathName];
        let output = `---[INDEX: ${pathName}]---\n`;
        steps.forEach((step, index) => {
            output += `${index + 1}: ${step}\n`;
        });
        gwc.output.append(output.trim());
    }
}
else if (action === "saveall") {
    gwc.userdata.stPathList = gwc.userdata.stPathList || {};
    gwc.userdata.reverseOverrides = gwc.userdata.reverseOverrides || {};
    save("stPathList", gwc.userdata.stPathList);
    save("reverseOverrides", gwc.userdata.reverseOverrides);
    append("Saved all paths and overrides to web storage and updated userdata.", recorderColor);
}
else if (action === "export") {
    const data = JSON.stringify({
        stPathList: gwc.userdata.stPathList,
        reverseOverrides: gwc.userdata.reverseOverrides
    });
    const encoded = btoa(data);
    append(`EXPORT DATA (Base64): ${encoded}`, recorderColor);
}
else if (action === "import" && args[2]) {
    try {
        const decoded = atob(args[2]);
        const imported = JSON.parse(decoded);
        if (imported.stPathList) gwc.userdata.stPathList = imported.stPathList;
        if (imported.reverseOverrides) gwc.userdata.reverseOverrides = imported.reverseOverrides;
        save("stPathList", gwc.userdata.stPathList);
        save("reverseOverrides", gwc.userdata.reverseOverrides);
        append("Imported data successfully.", recorderColor);
    } catch (e) {
        append("Failed to import data. Ensure the Base64 string is correct.");
    }
}


else if (action === "record") return startRecording();
else if (action === "save") return saveRecording(pathName);
else if (action === "stop") return stopRecording();
// Default fallback
else {
    append("Invalid command. Use 'path' to view help.");
}
