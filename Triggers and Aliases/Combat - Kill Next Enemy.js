/*
AUTHOR: Exosphere
Contains: 1 trigger

Easy all-in-one trigger for attacking the next enemy of the same type if you're the team leader.

Pattern: (aghar|albus|builder|crusader|dark elf|darkling|dewar|draconian|aurak|bozak|sivak|drow|drow matron|drow warrior|drow priestess|drow servant|drow high mage|drow weaponmaster|drider|dunlending|dwarf|faerie|cadaver|carcass|specter|shadow|bodak|draugr|mummy|revenant|sentry|ghost|sentinel|apparition|undead|guardian|skeleton|zombie|ghoul|banshee|devourer|ghost cat|wraith|elf|gnome|goblin|guard|guardsman of Kabal|halfling|dark-skinned male human|hell hound|hobgoblin|(?<!frightened )human|knight|Kretan (.*)|kroug|avenger|lizardman|marauder|bugbear|goblin archer|ogre magi|mercenary|minotaur|moorsman(.*)|horse archer|necromancer|ogre|ogre magi|priest|priestess|rat-man|sahuagin|soldier|stallion|thanoi|troll|troloby|warrior|barrow wight|wight|philosopher|leader|archer|trader|worker) died\.$
*/

//Syntax: "what died":"what to kill" (also add the former to the pattern)
const enemy = {
"aghar":"aghar",
"albus":"albus",
"builder":"builder",
"crusader":"crusader",
"dark elf":"dark elf",
"darkling":"darkling",
"dewar":"dewar",
"draconian":"draconian",
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
"dunlending":"dunlending",
"dwarf":"dwarf",
"faerie":"faerie",
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
"elf":"elf",
"gnome":"gnome",
"goblin":"goblin",
"guard":"guard",
"guardsman of Kabal":"guard",
"halfling":"halfling",
"dark-skinned male human":"haradrim",
"hell hound":"hell hound",
"hobgoblin":"hobgoblin",
"human":"human",
"knight":"knight",
"Kretan deuterian commander":"kretan",
"Kretan ensign":"kretan",
"Kretan sentry":"kretan",
"Kretan soldier":"kretan",
"kroug":"kroug",
"avenger":"kroug",
"lizardman":"lizardman",
"marauder":"marauder",
"bugbear":"marauder",
"goblin archer":"marauder",
"ogre magi":"marauder",
"minotaur":"minotaur",
"mercenary":"mercenary",
"moorsman dragoon":"moorsman",
"moorsman lancer":"moorsman",
"moorsman outrider":"moorsman",
"horse archer":"moorsman",
"necromancer":"necromancer",
"ogre":"ogre",
"orc":"orc",
"priest":"human",
"priestess":"human",
"rat-man":"rat-man",
"sahuagin":"sahuagin",
"saurian":"saurian",
"soldier":"soldier",
"stallion":"stallion",
"thanoi":"thanoi",
"troll":"troll",
"troloby":"troloby",
"warrior":"warrior",
"barrow wight":"wight",
"wight":"undead",
"philosopher":"human",
"leader":"human",
"archer":"human",
"trader":"human",
"worker":"human"
}

//Only if you're the team leader or if you're not in a team, send the command
if(mud.gmcp["char.team"].leader == "You" || mud.gmcp["char.team"].leader == 0){
  setTimeout(function(){gwc.connection.send("!kill "+enemy[args[1]])},300)
  }
