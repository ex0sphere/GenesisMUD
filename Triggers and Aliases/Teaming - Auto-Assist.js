/*
AUTHOR: Exosphere
Contains: 1 trigger

Simple auto-assist on a small delay. Spammy but should work in most cases.

Name: Teaming - Auto-Assist
Type: regexp
Pattern: (^The (.*) died\.$|You aren\&\#39\;t fighting anyone\!|Nobody here to cast the spell on\!|are fighting each other|is fighting|decides to come out of hiding|attacks(.*)\.|(.*) springs forward in a sudden attack against (.*)\!|roars an ancient dwarven warcry and charges into battle against|turns to attack)

Execute the following javascript:
*/

if(mud.gmcp["char.team"].leader != "You" && mud.gmcp["char.team"].leader != 0){
  setTimeout(function(){
    gwc.connection.send('!assist')
  },200)
}