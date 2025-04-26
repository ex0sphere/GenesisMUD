/* 
!!! DISCLAIMER: Botting is forbidden in Genesis MUD. You may face deletion if you are found scripting while inattentive.

AUTHOR: Exosphere
Contains: 1 alias, 1 trigger

Herbing script with easy pathing.

Alias: herb
Usage: 
herb <path> - start script
herb off - stop and turn off the script
*/

// The name of your trigger - change this if you renamed the trigger below this alias.
const triggerName = "Script - Herbing"

// Add paths here, they must end with <herb off> or whatever alias you changed this to. Spaces are optional.
// To do several commands in a row, separate them with a dash like in the example.
const path = {
"example":"n, e, ne, n-n-w-nw, herb off",
}
// Define the herb for each path
const herb = {
"example":"athly",
}

// This makes some global variables for the trigger to use
gwc.userdata.currentPath = path[args[1]]
if(args[1] == "off"){
  gwc.output.append("Script stopped.")
  gwc.trigger.disable(triggerName)
}
else {
  gwc.userdata.currentScript = args[1]
  gwc.userdata.scriptHerb = herb[args[1]]
  gwc.userdata.roomCounter = 0
  gwc.connection.send("search here for "+gwc.userdata.scriptHerb,true)
  gwc.trigger.enable(triggerName)
}

// ----------------------------

/*
Trigger: Script - Herbing
Pattern: (^You find (a|an) (?!brown field mouse)(.*)[!.]|^You peer searchingly around\.$|^You search everywhere\, but find no herbs\.$|Your search reveals nothing special)
*/
// Paths are managed through the alias.

// How many herbs to look for in every room
let timesToHerb = 3

// No more user input needed, the script is done, enjoy!

// Sets your path to the one from the alias
let path = gwc.userdata.currentPath
let herb = gwc.userdata.scriptHerb

function stringToArray(str) {
    return str.split(',')
}
function arrayToObject(arr) {
  return Object.fromEntries(
    arr.map((value, index) => [index + 1, value])
  );
}

function nextRoom(move){
    if(!move.includes("off")){
    	gwc.output.append("Room: "+gwc.userdata.roomCounter)
        for (let i = 0; i < move.length; i++)
        gwc.connection.send(move[i],true)
        gwc.connection.send("search here for "+herb,true)
     }
    else {
      gwc.output.append("Area cleared!")
    }
}

if(gwc.userdata.currentScript!="off") {
    
// Herb each room until empty
if(args[1].includes("You find")) {
    
     gwc.userdata.herbedtimes=gwc.userdata.herbedtimes+1;
     if (gwc.userdata.herbedtimes<timesToHerb) {
        gwc.connection.send("!search here for "+gwc.userdata.scriptHerb,true);
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
// Turns your path into an array
let pathArray = stringToArray(path)
// Assigns room numbers to each path
let pathObject = arrayToObject(pathArray)
// Executes the command for the right step of the path
let direction = pathObject[gwc.userdata.roomCounter]
direction = direction.split("-")
nextRoom(direction)
}
}