/*
AUTHOR: Sonta
Contains: 1 alias

This all-in-one alias opens and closes your purses while managing inventory, looting, buying, bidding, etc. to prevent theft.

USAGE:
  ath                               - Show this help menu
  ath help                          - Show this help menu
  ath status                        - Display current anti-theft settings
  ath get <item> from <bag>         - Retrieve item from container (if valid)
  ath put <item> in <bag>           - Store item into container (if valid)
  ath look in <bag>                 - Open container, look inside, close
  ath sellpack                      - Sell and deposit pack contents
  ath fillpack                      - Fill pack from inventory
  ath emptypack                     - Empty all contents of pack
  ath ep                            - Empty purse depending on type
  ath fp                            - Fill purse depending on type
  ath lp                            - Look in purse depending on type
  ath loot <pgsc>                   - Loot coins from corpse of selected types
  ath buy <item>                    - Buy using purse type handling
  ath tboard                        - Buy tickets, board ship, manage pouch/mount
  ath bid <amt> platinum on <item>  - Bid using platinum coins from pouch
  ath setmoney <normal|rmc|sybarun> - Set which purse style to use
  ath setmount                      - Toggle mount status
*/

if (!gwc.userdata.theftSettings) {
  gwc.userdata.theftSettings = {
    delay: 500,
    containers: [
      "backpack", "pack", "purse", "qarraba", "jar", "blue jar", "saddlebag",
      "pouch", "money-sack", "scrip", "cpouch", "sack", "stash_qarraba",
      "overflow_qarraba", "satchel"
    ],
    isContainer(name) {
      return this.containers.includes(name.toLowerCase());
    },
    moneyStorage: "normal",
    mountType: "horse",
    hasMount: false
  };
}

const cmd = args[1];
const target = args[2];
let container = args[4] || args[3];
const antiTheft = gwc.userdata.theftSettings;

function resolvePurseType() {
  switch (antiTheft.moneyStorage) {
    case "rmc": return "purse";
    case "rmc+": return "money-sack";
    case "sybarun": return "purse";
    default: return "pouch";
  }
}

switch (cmd) {
  case undefined:
  case "help":
    gwc.output.append(`Usage:
  ath                               - Show this help menu
  ath help                          - Show this help menu
  ath status                        - Display current anti-theft settings
  ath get <item> from <bag>         - Retrieve item from container (if valid)
  ath put <item> in <bag>           - Store item into container (if valid)
  ath look in <bag>                 - Open container, look inside, close
  ath sellpack                      - Sell and deposit pack contents
  ath fillpack                      - Fill pack from inventory
  ath emptypack                     - Empty all contents of pack
  ath ep                            - Empty purse depending on type
  ath fp                            - Fill purse depending on type
  ath lp                            - Look in purse depending on type
  ath loot <pgsc>                   - Loot coins from corpse of selected types
  ath buy <item>                    - Buy using purse type handling
  ath tboard                        - Buy tickets, board ship, manage pouch/mount
  ath bid <amt> platinum on <item>  - Bid using platinum coins from pouch
  ath setmoney <normal|rmc|sybarun> - Set which purse style to use
  ath setmount                      - Toggle mount status`);
    break;

  case "status":
    gwc.output.append("Anti-theft is " + (antiTheft.enabled ? "ENABLED" : "DISABLED"));
    gwc.output.append("Delay: " + antiTheft.delay + "ms");
    gwc.output.append("Money Storage Type: " + antiTheft.moneyStorage);
    gwc.output.append("Mount: " + antiTheft.mountType);
    gwc.output.append("hasMount: " + antiTheft.hasMount);
    gwc.output.append("Containers: " + antiTheft.containers.join(", "));
    break;

  case "setmoney":
    if (["normal", "rmc", "sybarun"].includes(args[2])) {
      antiTheft.moneyStorage = args[2];
      gwc.output.append("Money storage type set to: " + args[2]);
    } else {
      gwc.output.append("Invalid money storage type. Use: normal, rmc, or sybarun.");
    }
    break;

  case "sellpack":
    gwc.output.append("Selling contents of pack...");
    gwc.connection.send("open pack");
    gwc.connection.send("empty pack");
    gwc.connection.send("keep imbued items");
    gwc.connection.send("sell all");
    setTimeout(() => gwc.connection.send("close pack"), antiTheft.delay);
    break;

  case "fillpack":
    gwc.output.append("Filling pack...");
    gwc.connection.send("open pack");
    gwc.connection.send("fill pack");
    setTimeout(() => gwc.connection.send("close pack"), antiTheft.delay);
    break;

  case "emptypack":
    gwc.output.append("Emptying pack...");
    gwc.connection.send("open pack");
    gwc.connection.send("empty pack");
    setTimeout(() => gwc.connection.send("close pack"), antiTheft.delay);
    break;

  case "ep": {
   	const epurse = resolvePurseType();
    gwc.output.append("Emptying purse...");
    
    if (antiTheft.moneyStorage !== "sybarun") {
    	gwc.connection.send("open " + epurse);
  	}
    
    switch (antiTheft.moneyStorage) {
      case "normal":
        gwc.connection.send("get all coins from " + epurse);
        break;
      case "sybarun":
        gwc.connection.send("pempty");
        break;
      case "rmc":
      case "rmc+":
        gwc.connection.send("rc get");
        break;
    }
    if (antiTheft.moneyStorage !== "sybarun") {
    	setTimeout(() => gwc.connection.send("close " + epurse), antiTheft.delay);
  	}
    break;
  }

  case "fp": {
    const fpurse = resolvePurseType();
    gwc.output.append("Filling purse...");
    
    if (antiTheft.moneyStorage !== "sybarun") {
    	gwc.connection.send("open " + fpurse);
  	}
    
    switch (antiTheft.moneyStorage) {
      case "normal":
        gwc.connection.send("put all coins in " + fpurse);
        break;
      case "sybarun":
        gwc.connection.send("pfill");
        break;
      case "rmc":
      case "rmc+":
        gwc.connection.send("rc put");
        break;
    }
    if (antiTheft.moneyStorage !== "sybarun") {
    	setTimeout(() => gwc.connection.send("close " + fpurse), antiTheft.delay);
  	}
    break;
  }

  case "lp": {
    const lpurse = resolvePurseType();
    gwc.output.append("Looking into purse...");
    
    if (antiTheft.moneyStorage !== "sybarun") {
    	gwc.connection.send("open " + lpurse);
  	}
    
    switch (antiTheft.moneyStorage) {
      case "normal":
        gwc.connection.send("look in " + lpurse);
        break;
      case "sybarun":
        gwc.connection.send("plook");
        break;
      case "rmc":
      case "rmc+":
        gwc.connection.send("rc look");
        break;
    }
    if (antiTheft.moneyStorage !== "sybarun") {
    	setTimeout(() => gwc.connection.send("close " + lpurse), antiTheft.delay);
  	}
    break;
  }
	
  case "loot":
  	const shortCode = (args[2] || "").toLowerCase();
  	const coinMap = { p: "platinum", g: "gold", s: "silver", c: "copper" };
  	const selected = [...shortCode].filter(c => coinMap[c]).map(c => coinMap[c]);

  	if (selected.length === 0) {
    	gwc.output.append("Usage: ath loot <p|g|s|c> (e.g., 'ath loot pgsc')");
    break;
  }

  if (["rmc", "rmc+"].includes(antiTheft.moneyStorage)) {
    gwc.output.append("Looting with Rich Men's Club emote...");
    gwc.connection.send("rc loot " + shortCode);
  } else {
    gwc.output.append("Looting corpse for: " + selected.join(", ") + "...");
    selected.forEach(coin => {
      gwc.connection.send(`get ${coin} coins from corpse`);
    });
  }
  break;
    
  case "buy": {
    const item = args.slice(2).join(" ");
    const bpurse = resolvePurseType();
    gwc.output.append("Buying: " + item);
    
    if (antiTheft.moneyStorage !== "sybarun") {
    	gwc.connection.send("open " + bpurse);
  	}
    
    switch (antiTheft.moneyStorage) {
      case "normal":
        gwc.connection.send("get all coins from " + bpurse);
        gwc.connection.send("buy " + item);
        gwc.connection.send("put all coins in " + bpurse);
        break;
      case "sybarun":
        gwc.connection.send("pempty");
        gwc.connection.send("buy " + item);
        gwc.connection.send("pfill");
        break;
      case "rmc":
      case "rmc+":
        gwc.connection.send("rc get");
        gwc.connection.send("rc buy " + item);
        gwc.connection.send("rc put");
        break;
    }
    
    if (antiTheft.moneyStorage !== "sybarun") {
    	setTimeout(() => gwc.connection.send("close " + bpurse), antiTheft.delay);
  	}
    break;
  }  
    
  case "tboard":
  const tbPurse = resolvePurseType();
  gwc.output.append("Boarding ship with mount and pouch...");
  
  if (antiTheft.hasMount) {
    gwc.connection.send("mount " + antiTheft.mountType);
  }

  if (antiTheft.moneyStorage !== "sybarun") {
    gwc.connection.send("open " + tbPurse);
  }

  switch (antiTheft.moneyStorage) {
    case "normal":
      gwc.connection.send("get all coins from " + tbPurse);
      gwc.connection.send("buy tickets for team");
      gwc.connection.send("put all coins in " + tbPurse);
      break;
    case "sybarun":
      gwc.connection.send("pempty");
      gwc.connection.send("buy tickets for team");
      gwc.connection.send("pfill");
      break;
    case "rmc":
    case "rmc+":
      gwc.connection.send("rc get");
      gwc.connection.send("rc buy tickets for team");
      gwc.connection.send("rc put");
      break;
  }

  gwc.connection.send("board ship");

  if (antiTheft.hasMount) {
    gwc.connection.send("dismount");
    gwc.connection.send("lead " + antiTheft.mountType);
  }

  if (antiTheft.moneyStorage !== "sybarun") {
    setTimeout(() => gwc.connection.send("close " + tbPurse), antiTheft.delay);
  }
  break;
	
  case "bid":
    if (args[3] === "platinum" && args[4] === "on") {
      const amt = args[2];
      const itm = args.slice(5).join(" ");
      const bag = resolvePurseType();
      gwc.output.append("Bidding " + amt + " platinum on " + itm + "...");
      gwc.connection.send("open " + bag);
      gwc.connection.send(`get ${amt} platinum coins from ${bag}`);
      gwc.connection.send(`aubid ${amt} platinum on ${itm}`);
      setTimeout(() => gwc.connection.send("close " + bag), antiTheft.delay);
    }
    break;

  case "get":
    if (antiTheft.isContainer(container)) {
      gwc.output.append(`Getting ${target} from ${container}...`);
      gwc.connection.send(`open ${container}`);
      gwc.connection.send(`get ${target} from ${container}`);
      setTimeout(() => gwc.connection.send(`close ${container}`), antiTheft.delay);
    }
    break;

  case "put":
    if (antiTheft.isContainer(container)) {
      gwc.output.append(`Putting ${target} in ${container}...`);
      gwc.connection.send(`open ${container}`);
      gwc.connection.send(`put ${target} in ${container}`);
      setTimeout(() => gwc.connection.send(`close ${container}`), antiTheft.delay);
    }
    break;

  case "look":
    if (args[2] === "in" && antiTheft.isContainer(args[3])) {
      container = args[3];
      gwc.output.append("Looking in " + container + "...");
      gwc.connection.send(`open ${container}`);
      gwc.connection.send(`look in ${container}`);
      setTimeout(() => gwc.connection.send(`close ${container}`), antiTheft.delay);
    }
    break;

  default:
    gwc.output.append("Forwarding command: " + args.slice(1).join(" "));
    gwc.connection.send(args.slice(1).join(" "));
    break;
}
