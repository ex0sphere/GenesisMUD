/*
AUTHOR: Exosphere
Contains: 1 alias

Turns NPC chatter appearing in the communication window off or on.

USAGE: comms off/on
*/
if(args[1] == "off" || args[1] == "on"){
    mud.Process.outgoing_gmcp("core.options", {"npc_comms" : args[1]});
    gwc.output.append("NPC comms turned "+args[1]+"!")
}
else {
    gwc.output.append("Usage: <comms off/on>")
}