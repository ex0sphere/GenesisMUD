/*
Pattern: (aghar|albus|crusader|dark elf|darkling|dewar|draconian|aurak|bozak|sivak|drow|drow matron|drow warrior|drow priestess|drow servant|drow high mage|drow weaponmaster|drider|dunlending|dwarf|faerie|sentry|ghost|sentinel|apparition|undead|guardian|skeleton|zombie|ghoul|banshee|devourer|ghost cat|wraith|gnome|goblin|guard|guardsman of Kabal|halfling|dark-skinned male human|hell hound|knight|kroug|avenger|lizardman|minotaur|moorsman(.*)|horse archer|necromancer|ogre|rat-man|sahuagin|stallion|thanoi|troll|troloby|warrior|wight) died\.$

*/

//Syntax: "what died":"what to kill" (also add the former to the pattern)
const enemy = {
"aghar":"aghar",
"albus":"albus",
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
"gnome":"gnome",
"goblin":"goblin",
"guard":"guard",
"guardsman of Kabal":"guard",
"halfling":"halfling",
"dark-skinned male human":"haradrim",
"hell hound":"hell hound",
"knight":"knight",
"kroug":"kroug",
"avenger":"kroug",
"lizardman":"lizardman",
"minotaur":"minotaur",
/moorsman(.*)/g:"moormsan",
"horse archer":"moorsman",
"necromancer":"necromancer",
"ogre":"ogre",
"orc":"orc",
"rat-man":"rat-man",
"sahuagin":"sahuagin",
"saurian":"saurian",
"stallion":"stallion",
"thanoi":"thanoi",
"troll":"troll",
"troloby":"troloby",
"warrior":"warrior",
"wight":"wight"
}

//Only if you're the team leader or if you're not in a team, send the command
if(mud.gmcp["char.team"].leader == "You" || mud.gmcp["char.team"].leader == 0){
  setTimeout(function(){gwc.connection.send("!kill "+enemy[args[1]])},300)
  }