/*
!!! DISCLAIMER: Botting is forbidden in Genesis MUD. You may face deletion if you are found scripting while inattentive.

AUTHOR: Exosphere
Contains: 1 trigger, 1 alias

Note - New template available on my Github page. Pathing is a lot easier with the new version.

USAGE: 
1. Make your alias and trigger as below.
2. Go to your starting room.
3. For the alias "krougs", to start it, type "krougs". To turn it off, type "krougs off".

STEP 1. Follow the below example to make your alias.

Pattern: krougs
Execute the following javascript:
*/

  gwc.userdata.roomCounter = 0 // Starts the room counter
  gwc.connection.send('kill kroug') // Change to your enemy of choice
  gwc.userdata.enemy = 'kroug' // For use with Attack All.
  switch(args[1]){
    case 'on':gwc.trigger.enable('Your Trigger Name Here');break;
    case 'off':gwc.trigger.disable('Your Trigger Name Here');break;
    default:gwc.trigger.enable('Your Trigger Name Here');break;
  }

/*
STEP 2. Follow the below example to make your trigger.

Name: Script - Template
Type: regexp
Pattern: (^You find no such living creature|(?<!He|She|It) is fighting (?!you)|(?<!You) are fighting (?!you)|exclamation mark at the end of the command|^You cannot attack (.*) as|^You can&#39;t see anything here\.|^You don&#39;t find any)
*/

let send = gwc.connection.send;
let append = gwc.output.append;
let occupied = args[1].includes("fighting")

// Kill command will only be sent if no one is already fighting in the room.
function kill(){
    setTimeout(function(){
      append("Room: "+gwc.userdata.roomCounter);
      if (occupied === false){
      send("!kill kroug") // Change to your enemy of choice if NOT using Attack All
	  //send("ka", true) -- use this command instead if using Attack All.
      }
 //   	}
    },100)
}
// Adds +1 to the room counter after a room is cleared
    gwc.userdata.roomCounter+=1;
    
// Follow the below example to make your path. Add rooms as needed. The example path will clear the first row of krougs.
    switch(gwc.userdata.roomCounter){
    case 1:send("e");kill();break;
    case 2:send("e");kill();break;
    case 3:send("e");kill();break;
    case 4:send("e");kill();break;
    case 5:send("e");kill();break;
    case 6:send("e");kill();break;
    case 7:send("e");kill();break;
    case 8:send("e");kill();break;
    case 9:send("se");kill();break;
	case 10:send("krougs off",true);send("nod");break; // Change "krougs" to your own alias.
	}
