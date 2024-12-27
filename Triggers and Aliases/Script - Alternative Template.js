/* 
AUTHOR: Exosphere
Contains: 1 alias, 1 trigger

This is an alternative way to do scripts. Should make pathing a lot easier. Work in progress!

Alias: hunt
Usage: 
hunt <path> - start script
hunt off - stop and turn off the script
*/

// Add paths here, they must end with <hunt off> or whatever alias you changed this to.
// To do several commands in a row, separate them with a dash like in the example. Keep in mind this can make it skip rooms if you run into someone along the way.
const path = {
    "example":"e, e, n-ne-nw, e, s, sw, hunt off",
    "gk": "e,w,w,w,e,sw,s,se,ne,n,s,sw,e,ne,e,ne,sw,w,sw,se,w,hunt off",
    }
// Define the kill command for each path
const killCommand = {
    "example":"kill kroug",
    "gk":"ka", // You can use the "ka" alias from Attack All.js
}
// Define the enemy for each path that you use "ka" for.
const enemy = {
    "example":"kroug",
    "gk":"undead",
}

// This makes some global variables for the trigger to use
gwc.userdata.currentScript = args[1]
gwc.userdata.currentPath = path[args[1]]
gwc.userdata.enemy = enemy[args[1]]
gwc.userdata.killCommand = killCommand[args[1]]
gwc.userdata.roomCounter = 0

if(args[1] == "off"){
  gwc.output.append("Script stopped.")
}
else {
gwc.connection.send(gwc.userdata.killCommand,true)
}

// ----------------------------

/*
Trigger: Script - All In One
Pattern: (^You find no such living creature\.|(?<!He|She|It) is fighting (?!you)|(?<!You) are fighting (?!you)|exclamation mark at the end of the command|^You cannot attack (.*) as|^You can&#39;t see anything here\.|^You don&#39;t find any)
*/
// No user input needed here, paths are managed through the alias.

// Sets your path to the one from the alias
let path = gwc.userdata.currentPath
// Sets the corresponding kill command
let kill = gwc.userdata.killCommand

let send = gwc.connection.send
let occupied = args[1].includes("fighting")

// Increases current room number by 1
gwc.userdata.roomCounter +=1
let roomCounter = gwc.userdata.roomCounter

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
    	gwc.output.append("Room: "+roomCounter)
    	if(!occupied){
    		setTimeout(()=>send(kill,true),100)
    	}
        for (let i = 0; i < move.length; i++)
        send(move[i],true)
     }
    else {
      gwc.output.append("Area cleared!")
    }
}

if(gwc.userdata.currentScript!="off") {

// Turns your path into an array
let pathArray = stringToArray(path)
// Assigns room numbers to each path
let pathObject = arrayToObject(pathArray)
// Executes the command for the right step of the path
let direction = pathObject[roomCounter]
direction = direction.split("-")

nextRoom(direction)
}
