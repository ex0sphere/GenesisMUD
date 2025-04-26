/*
AUTHOR: Exosphere
Contains: 1 alias

Easily make, follow and backtrack paths. Small delay between steps prevents freezing.

USAGE: 
path <name> - follow the command path called <name>
path <name> back - try to follow the path backwards. Not guaranteed to work with all commands.

Execute the following javascript:
*/


// Put your paths below following the examples. Commands separated by commas. Spaces are optional.
const paths = {
  "example":"w, w, w, n, w, w, w, enter hole",
  "example2":"ne, knock gate, e, open door, u, u, u, deposit coins, d, d, d, open door",
}

// List of reversable commands, add more as needed
const reverse = {
  "n":"s", "s":"n", "e":"w", "w":"e",
  "nw":"se", "ne":"sw", "sw":"ne", "se":"nw",
  "u":"d", "d":"u", "in":"out", "out":"in", 
  "climb up":"climb down","climb down":"climb up",
}

// No more user input needed.

let currentPath = paths[args[1]]
currentPath = currentPath.replaceAll(", ", ",")
currentPath = currentPath.split(",")

// Follows path. Delay of 50ms between steps prevents freezing.
 function go(path) {
    path.forEach(function(step) {
    setTimeout(() =>gwc.connection.send(step,true),50)
    });
}

// Path reverser. Use the const in the beginning to define commands. If it can't reverse, just sends the command (e.g. "open door")
function reversePath(path) {
    let reversedPath = path
    .map(step => reverse[step] || step)
    .reverse()
    return reversedPath
}

// If not "back", follows the path forward
if(args[2] == undefined){
    gwc.output.append("Following path: "+args[1])
    go(currentPath)
}
// If you type "back" after the path name, follows the path backward
else if (args[2] == "back"){
    gwc.output.append("Backtracking path: "+args[1])
    currentPath = reversePath(currentPath)
    go(currentPath)
}
// If you type something other than "back" after the path name, gives an error
else {
    gwc.output.append("Unknown argument: "+args[2])
}