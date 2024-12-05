/*
ORIGINAL AUTHOR: Celse & Qwer
UPDATED BY: Exosphere
Contains: 1 trigger, 1 alias

This tool lets you see the average sminspect output of an item for an accurate reading. Also functions as a numerical translator for the values.
Safe to replace your "Translator - Blacksmith" trigger with this one.

*** 1. TRIGGER ***

Name: Utility - Sminspect Average + Translator
Type: regexp
Pattern: ^(?:It is almost impossible to get a good strike with this weapon|It is difficult to use this weapon properly|It feels good when you wield this weapon--you would most likely have no trouble getting a good hit with this weapon|You should have no trouble handling this weapon--or making a cruel hit with it for that matter|Even an apprentice warrior could kill easily with this weapon|With this weapon almost every strike could be a killing blow|This weapon doesn&#39;t seem very effective|This weapon might do some damage with a lucky hit|This weapon seems quite effective|This weapon could most likely kill with a single swipe|This weapon is extremely powerful and more lethal than many of the famous weapons|With this weapon even a single warrior will be able to match a large force|This armour wouldn&#39;t even protect you from a very weak blow|This armour could perhaps reduce damage a little|This seems to be an armour of average quality|This armour would protect you very well|This is an extremely well-made armour which would protect you very well|Virtually nothing could harm you if you wore this armour).$

Execute the following javascript:
*/

// Declare const for less typing
const a0 = args[0]

// Convert sminspect text to numbers
const weaponAccuracy = {
  'It is almost impossible to get a good strike with this weapon.':1,
  'It is difficult to use this weapon properly.':2,
  'It feels good when you wield this weapon--you would most likely have no trouble getting a good hit with this weapon.':3,
  'You should have no trouble handling this weapon--or making a cruel hit with it for that matter.':4,
  'Even an apprentice warrior could kill easily with this weapon.':5,
  'With this weapon almost every strike could be a killing blow.':6
}
const weaponDamage = {
  'This weapon doesn&#39;t seem very effective.':1,
  'This weapon might do some damage with a lucky hit.':2,
  'This weapon seems quite effective.':3,
  'This weapon could most likely kill with a single swipe.':4,
  'This weapon is extremely powerful and more lethal than many of the famous weapons.':5,
  'With this weapon even a single warrior will be able to match a large force.':6
}
const armourProtection = {
  'This armour wouldn&#39;t even protect you from a very weak blow.':1,
  'This armour could perhaps reduce damage a little.':2,
  'This seems to be an armour of average quality.':3,
  'This armour would protect you very well.':4,
  'This is an extremely well-made armour which would protect you very well.':5,
  'Virtually nothing could harm you if you wore this armour.':6
}

// Main function
switch (true) {
  
// Special cases
case a0 === 'This weapon doesn&#39;t seem very effective.':
  gwc.output.replace ("This weapon doesn't seem very effective.", "<span style='color:slateblue'>This weapon doesn't seem very effective. [1/6]</span>");
  gwc.userdata.weaponDamage.push(1)
  break
case a0 === 'This armour wouldn&#39;t even protect you from a very weak blow.':
  gwc.userdata.armourProtection.push(1)
  gwc.output.replace ("This armour wouldn't even protect you from a very weak blow.", "<span style='color:steelblue'>This armour wouldn't even protect you from a very weak blow. [1/6]</span>");
  break
  
// Adds the number to the text and to average calculator
default:
case a0 in weaponAccuracy: 
  gwc.output.replace (a0, `<span style='color:pink'     >${a0} ${weaponAccuracy[a0]}</span>`);
  gwc.userdata.weaponAccuracy.push(weaponAccuracy[a0])
  break
case a0 in weaponDamage: 
  gwc.output.replace (a0, `<span style='color:slateblue'>${a0} ${weaponDamage[a0]}</span>"`);
  gwc.userdata.weaponDamage.push(weaponDamage[a0])
  break
case a0 in armourProtection: 
  gwc.output.replace (a0, `<span style='color:steelblue'>${a0} ${armourProtection[a0]}</span>`);
  gwc.userdata.armourProtection.push(armourProtection[a0])
  break
}

/* *** 2. ALIAS ***
Usage: sma <item> - calculate the average sminspect of an item. Spammy and takes a few seconds.
If the game gets laggy after usage, clear your log.

Pattern: sma
Execute the following javascript:
*/

timesToInspect = 100 // How many times to sminspect the item to get the average
gwc.userdata.weaponDamage = []
gwc.userdata.weaponAccuracy = []
gwc.userdata.armourProtection = []

function inspect(){
  gwc.connection.send("sminspect "+args['*'])
}
let total
let count

function calculateAverage(array) {
  total = 0;
  count = 0;
        array.forEach(function(item, index) {
            total += item;
            count++;
        });
        return total / count;
    }

for (let i = 0; i < timesToInspect; i++) {
    setTimeout(inspect, 50) // Inspects every 50 milliseconds. Increase the value if your browser freezes upon use.
  }
setTimeout(function(){
let dmg  =  Math.round(calculateAverage(gwc.userdata.weaponDamage) * 100) / 100;
let acc  =  Math.round(calculateAverage(gwc.userdata.weaponAccuracy) * 100) / 100;
let prot =  Math.round(calculateAverage(gwc.userdata.armourProtection) * 100) / 100;
gwc.output.append("INSPECTION RESULTS");
gwc.output.append("---");
gwc.output.append("Item: "+args['*']);
gwc.output.append("Weapon damage:     "+dmg);
gwc.output.append("Weapon accuracy:   "+acc);
gwc.output.append("Armour protection: "+prot);
},timesToInspect*50+100)