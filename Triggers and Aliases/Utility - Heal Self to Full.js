/* 
AUTHOR: Exosphere
Contains: 1 trigger, 1 alias

An alias to start healing yourself until you're at full health.
*/

// 1. TRIGGER:
// Name: Utility - Heal Self to Full
// Pattern: Set your pattern to your "being healed" message (e.g. "The soothing tune heals your wounds.")
// Execute the following javascript:

if(gwc.gmcp.data.character.vitals.health!=='feeling very well'){
	if(!gwc.userdata.healingSpell){
		gwc.output.append("Error! Healing spell not defined. Change it in the alias.")
	}
	else {
		gwc.connection.send(gwc.userdata.healingSpell,true)
	}
}
else {
  setTimeout(function(){gwc.connection.send('!kill enemy')},100) // Integration with hunting script
  gwc.trigger.disable('Utility - Heal Self to Full');
  gwc.output.append('Health full, stopping auto-heal!',"#e85664")
}

// 2: ALIAS
// Pattern: hs
// Execute the following javascript:

// Set your healing spell here
gwc.userdata.healingSpell = gwc.userdata.healingSpell || "insert spell here"

gwc.trigger.enable('Utility - Heal Self to Full');
gwc.connection.send('!abort (if you are a caster insert your spell here)');
gwc.connection.send(gwc.userdata.healingSpell);
gwc.output.append("Auto-heal started!", "#e85664")