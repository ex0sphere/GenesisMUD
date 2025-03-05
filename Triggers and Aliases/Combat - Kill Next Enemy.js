/*
AUTHOR: Exosphere
Contains: 1 trigger

Easy all-in-one trigger for attacking the next enemy of the same type if you're the team leader.

Pattern: 
(aghar|albus|builder|bunny|crusader|dark elf|darkling|dewar|draconian|aurak|bozak|sivak|drow|drow matron|drow warrior|drow priestess|drow servant|drow high mage|drow weaponmaster|drider|dunlending|dwarf|dweller|faerie|cadaver|carcass|specter|shadow|bodak|draugr|mummy|revenant|sentry|ghost|sentinel|apparition|undead|guardian|skeleton|zombie|ghoul|banshee|devourer|ghost cat|wraith|elf|gnome|goblin|guard|guardsman of Kabal|halfling|dark-skinned male human|hell hound|hobgoblin|hoodlum|(?<!frightened )human|knight|Kretan (.*)|kroug|avenger|lizardman|marauder|bugbear|goblin archer|ogre magi|mercenary|minotaur|moorsman(.*)|horse archer|necromancer|ogre|ogre magi|orc|priest|priestess|rabbit|rat-man|sahuagin|soldier|stallion|thanoi|troll|troloby|warrior|barrow wight|wight|philosopher|leader|archer|trader|wolf|worker) died\.$
*/

// 1. Add enemies to the pattern as needed.
// 2. Add exceptions below if the enemy does not match what you want to kill. For example if you want to kill "draconian" when "bozak died".
// Syntax: "what died":"what to kill"

const exceptions = {
"aurak":"draconian",
"bozak":"draconian",
"sivak":"draconian",
"drow":"first drow",
"drow matron":"first drow",
"drow warrior":"first drow",
"drow priestess":"first drow",
"drow servant":"first drow",
"drow high mage":"first drow",
"drow weaponmaster":"first drow",
"drider":"first drow",
"cadaver":"undead",
"carcass":"undead",
"specter":"undead",
"shadow":"undead",
"bodak":"undead",
"draugr":"undead",
"mummy":"undead",
"revenant":"undead",
"undead":"undead",
"sentry":"undead",
"ghost":"undead",
"sentinel":"undead",
"apparition":"undead",
"guardian":"undead",
"skeleton":"undead",
"zombie":"undead",
"ghoul":"undead",
"banshee":"undead",
"devourer":"undead",
"ghost cat":"undead",
"wraith":"undead",
"guardsman of Kabal":"guard",
"dark-skinned male human":"haradrim",
"Kretan deuterian commander":"kretan",
"Kretan ensign":"kretan",
"Kretan sentry":"kretan",
"Kretan soldier":"kretan",
"avenger":"kroug",
"bugbear":"marauder",
"goblin archer":"marauder",
"ogre magi":"marauder",
"moorsman dragoon":"moorsman",
"moorsman lancer":"moorsman",
"moorsman outrider":"moorsman",
"horse archer":"moorsman",
"priest":"human",
"priestess":"human",
"barrow wight":"wight",
"wight":"undead",
"philosopher":"human",
"leader":"human",
"archer":"human",
"trader":"human",
"worker":"human"
}
let who = exceptions[args[1]] || args[1]

//Only if you're the team leader or if you're not in a team, send the command
if(mud.gmcp["char.team"].leader == "You" || mud.gmcp["char.team"].leader == 0){
  setTimeout(function(){gwc.connection.send("!kill "+who)},200)
  }

else {
  gwc.connection.send("!assist")
}
