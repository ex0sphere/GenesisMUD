/*
AUTHOR: feskslo
Contains: 1 alias

Quickly do a sequence of actions, kind of like the path alias except you don't need to pre-write the path or save it.

USAGE EXAMPLE: qdo 21w, sw, 6w, s, 3climb up, give thing to hobbit

Pattern: qdo
Execute the following javascript:
*/
const delay = 50; // Adjust this to control the delay in milliseconds. No more input needed.
  
let directionsString = args['*'].trim(); // Get the entire directions string
if (!directionsString) {
    gwc.output.append("Usage: qdo <directions separated by \",\" or \", \">", "magenta");
    return;
}
  
gwc.output.append("Doing <" + directionsString + ">", "magenta");
  
// Split by ", " to get tokens
let tokens = directionsString.split(/,\s*/);
let finalPath = [];
  
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
  
// Send commands with delay
finalPath.forEach((command, index) => {
    setTimeout(() => {
        gwc.connection.send(command);
        gwc.output.color('#991999');
    }, index * delay);
});