/*
AUTHOR: feskslo
Contains: 1 alias, 1 trigger

Automatically re-mounts your horse after it's left behind. Written for Bree horses.
  
USAGE: 
remount - Toggle automounting flag
remount <adj1> <adj2> - Enable automounting and set horse adjectives

1. ALIAS: remount
Execute the following javascript:
*/
  
// Handle case where no arguments are provided (toggle mode)
if (!args[1]) {
    gwc.userdata.autoMount = !gwc.userdata.autoMount;
    let status = gwc.userdata.autoMount ? "ON" : "OFF";
    
    gwc.output.append(`Automount is now: ${status}`, '#ffffff');
    gwc.output.append("Change your horse adjectives with: automount <adj1> <adj2>", '#ffffff');
    gwc.output.append("Your horse is: " + (gwc.userdata.myHorse || "not set."), '#ffffff');
    return;
}
  
// Handle case where too many arguments are provided
if (args[3]) {
    gwc.output.append("Error: Too many arguments. Usage: automount <adj1> <adj2>", '#ffffff');
    return;
}
  
// 2 arguments provided, store the two provided adjectives and set flag
gwc.userdata.myHorse = args['*'] + " horse";
gwc.userdata.autoMount = true;
gwc.output.append("Your horse is now: " + gwc.userdata.myHorse + ". Automount enabled.", '#ffffff');
  
// ------- //
/*
2. TRIGGER
Name: Utility - Auto Mount
Type: regexp
Pattern: ^(?!You are riding )(?!You start leading )(A|An|a |and a ) .+?(?!.* with you riding on )(?!.* comes galloping in) horse\b

Execute the following javascript:
*/
let match = args[0];
  
// Trim the matched text to only include "adj1 adj2 horse"
let words = match.split(/\s+/); 
let lastThreeWords = words.slice(-3).join(" "); 
  
if (lastThreeWords === gwc.userdata.myHorse) {
  if (gwc.userdata.autoMount) {
    gwc.connection.send("!mount horse");
  }
} 