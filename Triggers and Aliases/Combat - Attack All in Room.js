// This code lets you enter a room, counts the amount of enemies, and attacks first/second/third enemy etc. depending on how many it finds.

// 1. ALIAS: enemy - Use this for setting the enemy you want to target
// Example: enemy kroug - sets your enemy to kroug

gwc.userdata.enemy=(args['*'])

// 2. DIRECTION ALIASES:

//Pattern: ek
gwc.trigger.enable("Enemy Counter")
gwc.connection.send("e",true);
gwc.connection.send("count "+gwc.userdata.enemy+"s")

//Pattern: nek
gwc.trigger.enable("Enemy Counter")
gwc.connection.send("ne",true);
gwc.connection.send("count "+gwc.userdata.enemy+"s")

//Pattern: nk
gwc.trigger.enable("Enemy Counter")
gwc.connection.send("n",true);
gwc.connection.send("count "+gwc.userdata.enemy+"s")

//Pattern: nwk
gwc.trigger.enable("Enemy Counter")
gwc.connection.send("nw",true);
gwc.connection.send("count "+gwc.userdata.enemy+"s")

//Pattern: sek
gwc.trigger.enable("Enemy Counter")
gwc.connection.send("se",true);
gwc.connection.send("count "+gwc.userdata.enemy+"s")

//Pattern: sk
gwc.trigger.enable("Enemy Counter")
gwc.connection.send("s",true);
gwc.connection.send("count "+gwc.userdata.enemy+"s")

//Pattern: swk
gwc.trigger.enable("Enemy Counter")
gwc.connection.send("sw",true);
gwc.connection.send("count "+gwc.userdata.enemy+"s")

//Pattern: wk
gwc.trigger.enable("Enemy Counter")
gwc.connection.send("w",true);
gwc.connection.send("count "+gwc.userdata.enemy+"s")

/* ------------------- */

// 3. TRIGGER: Enemy Counter
// Type: regexp
// Pattern: ^(You count (one|two|three|four|five|six|seven|eight|nine|ten)|You don&#39;t find any)

if(args[2]!=undefined){

const numbers = { 
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  }
let howMany = numbers[args[2]]
const adjectives = {
	1:'first', 2:'second', 3:'third', 4:'fourth', 5:'fifth', 6:'sixth', 7:'seventh', 8:'eighth',9:'ninth',10:'tenth'
}

  for (let i = 1; i <= howMany; i++) {
    gwc.connection.send("kill "+adjectives[i]+" "+gwc.userdata.enemy)
  }
}

gwc.trigger.disable("Enemy Counter")