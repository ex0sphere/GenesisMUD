/*
AUTHOR: Celse
Contains: 1 trigger

Colours and translates equipment durability into numbers.

Pattern: ^(?:It looks like it is (?:in prime condition|in a fine condition|touched by battle|scarred by battle|very scarred by battle|in big need of a smith|a little worn down|in a very bad shape|in urgent need of repair|going to break any second)).$

Execute the following javascript:
*/

//ASSIGN STRING WITH VALUE
const EquipmentDurability = {

  //WEAPON CONDITION
  'It looks like it is in prime condition.':'[7/7]',
  'It looks like it is in a fine condition.':'[6/7]',
  'It looks like it is touched by battle.':'[5/7]',
  'It looks like it is scarred by battle.':'[4/7]',
  'It looks like it is very scarred by battle.':'[3/7]',
  'It looks like it is in big need of a smith.':'[2/7]',
  'It looks like it is going to break any second.':'[1/7]',
  
  //ARMOUR CONDITION
  'It looks like it is a little worn down.':'[4/5]',
  'It looks like it is in a very bad shape.':'[3/5]',
  'It looks like it is in urgent need of repair.':'[2/5]'
}
gwc.output.replace (args[0], `<span style="color:tan">${args[0]} ${EquipmentDurability[args[0]]}</span>`)