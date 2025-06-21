/* 
AUTHOR: Exosphere
Contains: 1 trigger, 2 aliases, (optional) 10 movement aliases

This code lets you enter a room, count the amount of enemies and attack first/second/third enemy etc. depending on how many you find.
*/

// 1. ALIAS: enemy - Use this for setting the enemy you want to target
// Example: enemy kroug - sets your enemy to kroug

gwc.userdata.enemy=(args['*'])

// 2. ALIAS: ka - Count enemies in a room and attack them all

//Pattern: ka
let enemy = args["*"] || gwc.userdata.enemy

if(enemy.endsWith("f")){
	enemy = enemy.replace(/f$/g,"ve") // fix -f enemies (elf, dwarf)
}
if(enemy.endsWith("y")){
  enemy = enemy.replace(/y$/g,"ie") // fix for -y enemies (troloby)
}

if(enemy.endsWith("s")){
  enemy = enemy.replace(/s$/g,"se") // fix for -s enemies (phrynos)
}

gwc.trigger.enable("Enemy Counter")

if(enemy == "drow"){
  gwc.connection.send("count all drow") // Drow have the same plural and singular form
}
else {
	gwc.connection.send("count "+enemy+"s")
}

// 2.1. Directional aliases for manual use:

//Pattern: dk
gwc.connection.send("d",true);
gwc.connection.send("ka",true)

//Pattern: ek
gwc.connection.send("e",true);
gwc.connection.send("ka",true)

//Pattern: nek
gwc.connection.send("ne",true);
gwc.connection.send("ka",true)

//Pattern: nk
gwc.connection.send("n",true);
gwc.connection.send("ka",true)

//Pattern: nwk
gwc.connection.send("nw",true);
gwc.connection.send("ka",true)

//Pattern: sek
gwc.connection.send("se",true);
gwc.connection.send("ka",true)

//Pattern: sk
gwc.connection.send("s",true);
gwc.connection.send("ka",true)

//Pattern: swk
gwc.connection.send("sw",true);
gwc.connection.send("ka",true)

//Pattern: uk
gwc.connection.send("u",true);
gwc.connection.send("ka",true)

//Pattern: wk
gwc.connection.send("w",true);
gwc.connection.send("ka",true)

/* ------------------- */

// 3. TRIGGER: Enemy Counter
// Name: Enemy Counter
// Type: regexp
// Pattern: ^(You (count|find) (a single|two|three|four|five|six|seven|eight|nine|ten)|You don&#39;t find any)

if(args[3]!=undefined){

const numbers = { 
  'a single': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven':11, 'twelve':12, 'thirteen':13, 'fourteen':14, 'fifteen':15
  }
let howMany = numbers[args[3]]
const adjectives = {
	1:'first', 2:'second', 3:'third', 4:'fourth', 5:'fifth', 6:'sixth', 7:'seventh', 8:'eighth',9:'ninth',10:'tenth',11:'eleventh',12:'twelfth',13:'thirteenth',14:'fourteenth',15:'fifteenth'
}

  for (let i = 1; i <= howMany; i++) {
    gwc.connection.send("kill "+adjectives[i]+" "+gwc.userdata.enemy)
  }
}

gwc.trigger.disable("Enemy Counter")
