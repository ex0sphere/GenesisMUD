/*
AUTHOR: Shanoga & Kelrhys, updated by Exosphere
Contains: 1 trigger, 1 alias

Counts your progress levels, progress times, kills, keeps track of all-time progs and fantas.
IMPORTANT: If it's your first time using the alias, use <prog resetall> one time after you install it.

USAGE:
    prog            - show progress table
    prog help       - show this helpfile
    prog last       - show time and kills since last progress
    prog alltime    - show your all-time fanta and progress count
    prog showkills  - <say> who has how many kills on your team
    prog reset      - resets the progress counter
    prog resetall   - resets progress counter AND daily kill count AND fanta count.
    prog resetAllTimeProgress - resets your ALL-TIME fanta and progress count.
    prog editprogs  - edit your all-time progress count
    prog editfantas - edit your all-time fanta count
    prog save       - save a backup of your progress count in web storage
    prog restore    - restore your progress count from web storage

---

1. TRIGGER
Name: Utility - Progress Counter
Type: regexp
Pattern: ^(\w+) (killed|defeated) (.*)\.$

Execute the following javascript:
*/

// Initialize and define the gmcp variables in case we are fighting solo
if (mud.gmcp['char.team'] === undefined) mud.gmcp['char.team'] = {};
if (mud.gmcp['char.team'].members === undefined) mud.gmcp['char.team'].members = [];
if (mud.gmcp['char.team'].leader === undefined) mud.gmcp['char.team'].leader = '';
var members = mud.gmcp['char.team'].members;
var leader = mud.gmcp['char.team'].leader;

// Make sure progressTime is set to date rather than string value. After
// return from linkdeath it is string type rather than integer
if (typeof gwc.userdata.progressTime == "string") {
  gwc.userdata.progressTime = Date.parse(gwc.userdata.progressTime);
}
var killer = args[1];

// Check to see if the enemy died to me or a teammate
if (killer != 'You') {
  // I didn't get the kill...
  if (leader == '') {
    // ...and I'm not in a team. Don't count it.
	gwc.output.append('Not my kill and not in team - not counting in progress!');
    return;
  } else if (killer != leader) {
    // ...my leader didn't get the kill...
    if (Object.values(members).indexOf(killer) == -1) {
      // ...none of my teammates to the kill.  Don't count it.
	  gwc.output.append('Killer not on my team - not counting in progress!');
      return;
    }
  }
}

// Teammate or I got the kill - Update kill counters
if (gwc.userdata.killsTable === undefined) gwc.userdata.killsTable = {};
var found = false;
for (var who in gwc.userdata.killsTable) {
  if (who == killer) {
    gwc.userdata.killsTable[who] += 1;
	found = true;
	break;
  }
}
if (!found) {
  // Add new killer to table 
  gwc.userdata.killsTable[killer] = 1;
}

// Record our progress level after the kill
var newProgress = gwc.gmcp.data.character.vitals.progress;

// Initialize the userdata after the first kill of the session
if (gwc.userdata.dailyKills === undefined) gwc.userdata.dailyKills = 0;
if (gwc.userdata.progressKills === undefined) gwc.userdata.progressKills = 0;
if (gwc.userdata.fantasticProgress === undefined) gwc.userdata.fantasticProgress = 0;
if (gwc.userdata.currentProgress === undefined) gwc.userdata.currentProgress = "no measurable";
if (gwc.userdata.progressTable === undefined) gwc.userdata.progressTable = {};
if (gwc.userdata.progressTimeTable === undefined) gwc.userdata.progressTimeTable = {};
if (gwc.userdata.progressTime === undefined) {
  gwc.userdata.progressTime = new Date();
}

// Increment the counters of kills for the session (dailyKills)
//  and the kills since the last progress level (progressKills)
gwc.userdata.dailyKills += 1;
gwc.userdata.progressKills += 1;

// Check if the progress level after the kill is the same as before the kill
// If the progress level is new, then record the level and its number of kills in a table
if (gwc.userdata.currentProgress != newProgress && newProgress != 'insignificant' && newProgress != 'no measurable') {
  gwc.output.append('Adding new progress entry: ' + newProgress + ' from ' + gwc.userdata.currentProgress);
  gwc.userdata.progressTable[newProgress] = gwc.userdata.progressKills;
  var tempDate = new Date();
  gwc.userdata.progressTimeTable[newProgress] = Math.floor((tempDate.getTime() - gwc.userdata.progressTime) / 1000);
  gwc.userdata.progressKills = 0;
  gwc.userdata.progressTime = tempDate;
  gwc.userdata.alltimeProgs += 1;
  gwc.connection.send('prog', true);
}

// Reset the counters when at fantastic
if (newProgress == "fantastic") {
  gwc.userdata.fantasticProgress += 1;
  gwc.userdata.alltimeFantas += 1
  gwc.output.append("FANTASTIC PROGRESS - STATS RESET");
  gwc.connection.send("stats reset");
  gwc.userdata.currentProgress = "no measurable";
  gwc.userdata.progressTable = {};
  gwc.userdata.progressTime = tempDate;
}

// Store the new progress level as our current progress level
gwc.userdata.currentProgress = newProgress;


/* --------------------------------------
2. ALIAS: prog

USAGE:
    prog            - show progress table
    prog help       - show this helpfile
    prog last       - show time and kills since last progress
    prog alltime    - show your all-time fanta and progress count
    prog showkills  - <say> who has how many kills on your team
    prog reset      - resets the progress counter
    prog resetall   - resets progress counter AND daily kill count AND fanta count.
    prog resetAllTimeProgress - resets your ALL-TIME fanta and progress count.
    prog editprogs  - edit your all-time progress count
    prog editfantas - edit your all-time fanta count
    prog save       - save a backup of your progress count in web storage
    prog restore    - restore your progress count from web storage

Pattern: prog
Execute the following javascript:
*/

// Initialize a few variables for formatting and timekeeping
var space = " ";
var secondsBetween = 0;
var minutesBetween = 0;
var hoursBetween = 0;
var hoursBetween = 0;

// Function to back up progress counter into browser storage
function save(key, value){
    if (typeof value !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
        gwc.output.append(`Saved to web storage successfully.`);
        }
    else {
        gwc.output.append(`Error with saving backup, value is undefined.`)
    }
}

// Function to load progress counter from backup
function load(key){
    if (typeof localStorage !== 'undefined') {
        gwc.output.append(`Loaded from web storage successfully.`);
        return JSON.parse(localStorage.getItem(key));
    }
    else {
        gwc.output.append(`No backup found in web storage.`)
    }
}

switch(args[1]){

default:
 
    // Make sure that we have at least one kill
    if (gwc.userdata.dailyKills === undefined ||
          gwc.userdata.dailyKills == 0) {
      gwc.output.append("You haven't killed anything yet...");
      return;
    }
     
    // Skip a line and set the header and form for the table
    gwc.output.append("@----------------------------------------------@");
    gwc.output.append("|     PROGRESS THIS SESSION     |   DURATION   |");
    gwc.output.append("|----------------------------------------------|");
     
    // Loop through each progress level and the number of kills
    // Format to left-align the name of the progress level
    // Reserve spaces for up to 9999 (over 1000) kills per progress level
    // Right-align the labeled kill count
    for (var progress in gwc.userdata.progressTable) {
      if (gwc.userdata.currentProgress == "insignificant") {
        gwc.output.append("|        NO PROGRESS YET        |              |");
        continue;
      } else if (progress == "insignificant") {
        //gwc.output.append("|                               |              |");
        continue;
      }
      secondsBetween = gwc.userdata.progressTimeTable[progress];
      if (secondsBetween > 60 && secondsBetween < 3601) {
        minutesBetween = Math.floor(secondsBetween / 60);
        secondsBetween = secondsBetween % 60;
        gwc.output.append("| " + progress + ":" + space.repeat(16 - progress.length) + "  " +
                          space.repeat(4 - gwc.userdata.progressTable[progress].toString().length) +
                          gwc.userdata.progressTable[progress] + " kills |      " +
                          space.repeat(2 - minutesBetween.toString().length) + minutesBetween + "m " +
                          space.repeat(2 - secondsBetween.toString().length) + secondsBetween + "s |");
      } else if (secondsBetween < 60) {
        gwc.output.append("| " + progress + ":" + space.repeat(16 - progress.length) + "  " +
                          space.repeat(4 - gwc.userdata.progressTable[progress].toString().length) +
                          gwc.userdata.progressTable[progress] + " kills |          " +
                          space.repeat(2 - secondsBetween.toString().length) + secondsBetween + "s |");
      } else {
        hoursBetween = Math.floor(secondsBetween / 3600);
        minutesBetween = Math.floor((secondsBetween - (hoursBetween * 3600)) / 60);
        secondsBetween = secondsBetween % 60;
        gwc.output.append("| " + progress + ":" + space.repeat(16 - progress.length) + "  " +
                          space.repeat(4 - gwc.userdata.progressTable[progress].toString().length) +
                          gwc.userdata.progressTable[progress] + " kills |  " +
                          space.repeat(2 - hoursBetween.toString().length) + hoursBetween + "h " +
                          space.repeat(2 - minutesBetween.toString().length) + minutesBetween + "m " +
                          space.repeat(2 - secondsBetween.toString().length) + secondsBetween + "s |");
      }
    }
    if (progress != "insignificant") gwc.output.append("|----------------------------------------------|");
    gwc.output.append("| Total Kills: " + gwc.userdata.dailyKills  + " -- Fantastics: " +
                      gwc.userdata.fantasticProgress +
                      space.repeat(16 - (gwc.userdata.dailyKills.toString().length +
                                         gwc.userdata.fantasticProgress.toString().length)) + "|");

    // Show team kills
    var killStringList = [];
    for (var who in gwc.userdata.killsTable) {
        killStringList.push("[" + gwc.userdata.killsTable[who] + "] " + who);
    }
    // Print 2 names per line, if possible
    for (var i=0; i<killStringList.length; i++) {
      // Print even-numbered element plus next in list, if it exists
      if ((i%2 == 0) && (i+1 < killStringList.length)) {
        gwc.output.append("| " + killStringList[i].padEnd(22, " ") + 
        killStringList[i+1].padEnd(22, " ") + " |");
        i++;
      } else {
        // Print last/only element
        gwc.output.append("| " + killStringList[i].padEnd(44) + " |");
      }
    }    
    gwc.output.append("@----------------------------------------------@");
    // Make sure progressTime is set to date rather than string value. After
    // return from linkdeath it is string type rather than integer
    if (typeof gwc.userdata.progressTime == "string") {
      gwc.userdata.progressTime = Date.parse(gwc.userdata.progressTime);
    }
    // Initialize some variables and get the current time
    var tempDate = new Date();
    var tempTime = Math.floor((tempDate.getTime() - gwc.userdata.progressTime) / 1000 );
    var timeString = '';

    // Set the string value for the amount of time since last progress
    if (tempTime > 3599) {
      timeString = Math.floor(tempTime/3600) + 'h';
      tempTime -= 3600 * (Math.floor(tempTime/3600));
    }
    timeString += ' ' + Math.floor(tempTime/60) + 'm';
    timeString += ' ' + tempTime % 60 + 's';

    // Print the messages
    gwc.output.append('| Kills since last progress: ' + gwc.userdata.progressKills.toString().padEnd(18, " ") + "|");
    gwc.output.append('| Time since last progress: ' + timeString.padEnd(19, ' ') + '|');
    gwc.output.append("@----------------------------------------------@");
    break;

/* --------- */

case "help":

    let output = `
USAGE:
    prog            - show progress table
    prog help       - show this helpfile
    prog last       - show time and kills since last progress
    prog alltime    - show your all-time fanta and progress count
    prog showkills  - <say> who has how many kills on your team
    prog reset      - resets the progress counter
    prog resetall   - resets progress counter AND daily kill count AND fanta count.
    prog resetAllTimeProgress - resets your ALL-TIME fanta and progress count.
    prog editprogs  - edit your all-time progress count
    prog editfantas - edit your all-time fanta count
    prog save       - save a backup of your progress count in web storage
    prog restore    - restore your progress count from web storage
    `;
    gwc.output.append(output,"#ffdc40");
    break;

case "last":

    // Make sure progressTime is set to date rather than string value. After
    // return from linkdeath it is string type rather than integer
    if (typeof gwc.userdata.progressTime == "string") {
      gwc.userdata.progressTime = Date.parse(gwc.userdata.progressTime);
    }
    // Initialize some variables and get the current time
    var tempDate = new Date();
    var tempTime = Math.floor((tempDate.getTime() - gwc.userdata.progressTime) / 1000 );
    var timeString = '';

    // Set the string value for the amount of time since last progress
    if (tempTime > 3599) {
      timeString = Math.floor(tempTime/3600) + ' hour';
      if (Math.floor(tempTime/3600) != 1) timeString += 's';
      tempTime -= 3600 * (Math.floor(tempTime/3600));
    }
    timeString += ' ' + Math.floor(tempTime/60) + ' minute';
    if (Math.floor(tempTime/60) != 1) timeString += 's';
    timeString += ' ' + tempTime % 60 + ' second';
    if (tempTime % 60 != 1) timeString += 's';

    // Print the messages
    gwc.output.append('@----------------------------------------------------------@');
    gwc.output.append('| Kills since last progress: ' + gwc.userdata.progressKills.toString().padEnd(30, " ") + "|");
    gwc.output.append('| Time since last progress: ' + timeString.padEnd(31, ' ') + '|');
    gwc.output.append('@----------------------------------------------------------@');
    break;

case "alltime":

    if(gwc.userdata.alltimeProgs == undefined || gwc.userdata.alltimeFantas == undefined){
        gwc.userdata.alltimeProgs = 0
        gwc.userdata.alltimeFantas = 0
        gwc.output.append("Started counting your all-time progress and fantas!")
    }
    else {
    let fantas = Math.floor(100 * gwc.userdata.alltimeProgs / 18)/100
    gwc.output.append("Progress levels: "+gwc.userdata.alltimeProgs+" ("+fantas+" fantas)");
    gwc.output.append("     Fantastics: "+gwc.userdata.alltimeFantas);
    }
    break;

case "showkills":

    let send = gwc.connection.send;
    let print = gwc.output.append;

    function getSortedKills(killsTable) {
      var keys = Object.keys(killsTable);
      return keys.sort(function(a,b){return killsTable[b]-killsTable[a];});
    }
    var sortedKills = getSortedKills(gwc.userdata.killsTable);
    for (var i=0; i<sortedKills.length; i++) {
      var who = sortedKills[i];
      if (who == 'You') {
        send('whisper to team ' + gwc.gmcp.data.character.status.name + ' has ' + gwc.userdata.killsTable[who] + ' kills! ');
      } else {
        send('whisper to team ' + who + ' has ' + gwc.userdata.killsTable[who] + ' kills! ');
      }
    }
    break;

case "reset":

    // Resets the progress counter variables
    gwc.userdata.progressKills = 0;
    gwc.userdata.progressTime = new Date();
    gwc.userdata.progressTable = {};
    gwc.userdata.progressTimeTable = {};
    gwc.userdata.killsTable = {};
    gwc.output.append('Reset progress counter...');
    break;

case "resetall":

    // Resets the progress counter variables
    gwc.userdata.dailyKills = 0;
    gwc.userdata.fantasticProgress = 0;
    gwc.userdata.progressKills = 0;
    gwc.userdata.progressTime = new Date();
    gwc.userdata.progressTable = {};
    gwc.userdata.progressTimeTable = {};
    gwc.userdata.killsTable = {};
    gwc.output.append('Reset ALL progress counter...');
    if(gwc.userdata.alltimeProgs == undefined || gwc.userdata.alltimeFantas == undefined){
        gwc.userdata.alltimeProgs = 0
        gwc.userdata.alltimeFantas = 0
    }
    break;

case "resetAllTimeProgress":

    gwc.userdata.alltimeProgs = 0
    gwc.userdata.alltimeFantas = 0
    break;

case "editprogs":

    gwc.userdata.alltimeProgs = Number(args[2]);
    gwc.connection.send("prog alltime",true);
    break;

case "editfantas":

    gwc.userdata.alltimeFantas = Number(args[2]);
    gwc.connection.send("prog alltime",true);
    break;
    
case "save":
    
    save("alltimeProgs",gwc.userdata.alltimeProgs);
    save("alltimeFantas",gwc.userdata.alltimeFantas);
    break;

case "restore":

    load("alltimeProgs");
    load("alltimeFantas");
    break;

}