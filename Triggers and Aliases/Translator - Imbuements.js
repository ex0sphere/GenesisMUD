/*
ORIGINAL AUTHOR: Kelrhys
UPDATED BY: Exosphere
Contains: 1 trigger

This is an updated version of the trigger from GenesisMudDiscord. Fixed typos and added missing imbuements.

Name: Translator - Imbues
Type: regexp
Pattern: (smell of musk|smell of vanilla|smell of alcohol|smell of lavender|smell of sage|smell of cinnamon|opalesque tint|grey tint|brown tint|blue tint|azure tint|rose tint|aura of a stallion|aura of a lion|aura of a spider|aura of a boar|aura of a badger|aura of a monkey|Beryl formations|Bone formations|Diamond formations|Granite formations|Ivory formations|Mithril formations|Onyx formations|Peridot formations|Quartz formations|Sapphire formations|Topaz formations|aura of light surrounds|aura of darkness surrounds|aura of crimson energy|aura of well-being|aura of viciousness|aura of malevolence|feeling of unease|goosebumps being around|urge to sneeze|dull feeling comes over you|tickle in your throat|feeling of calm|ringing in your ears|itching sensation|hair-raising sensation grips you|feeling of nausea|feeling of drowsiness|clusters of frost cling|disturbance in the air surrounding|hissing sound|colour seems to be occuring|acid sheen|green moisture|odor of decay|white flames|ripples of blue electricity|feeling of security emanates|sparkle bewitches your senses|orange glow surrounds|gleam of mithril|whine is coming|drone issues from this|clicking sound|purring sound|silvery aura|purple gleam|swirling bands of yellow energy|twisting pattern|aura of arcana|aura of a falcon)
Execute the following javascript: 
*/

const translator = {
  'smell of musk':'[+str/ogrestone]',
  'smell of vanilla':'[+dis/steelstone]',
  'smell of alcohol':'[+con/dwarfstone]',
  'smell of lavender':'[+int/gnomestone]',
  'smell of sage':'[+wis/elfstone]',
  'smell of cinnamon':'[+dex/hobbitstone]',
  'opalesque tint':'[water spells/surfstone]',
  'grey tint':'[death spells/corpsestone]',
  'brown tint':'[earth spells/soilstone]',
  'blue tint':'[life spells/ankhstone]',
  'azure tint':'[air spells/guststone]',
  'rose tint':'[fire spells/emberstone]',
  'aura of a stallion':'[polearm/skewerstone]',
  'aura of a lion':'[sword/edgestone]',
  'aura of a spider':'[knife/needlestone]',
  'aura of a boar':'[club/crushstone]',
  'aura of a badger':'[axe/cleavestone]',
  'aura of a monkey':'[unarmed combat/palmstone]',
  'Beryl formations':'[fire-slay elf/charstone]',
  'Bone formations':'[fire-slay undead/lifestone]',
  'Diamond formations':'[fire-slay dragon/heavenstone]',
  'Granite formations':'[fire-slay ogre/doomstone]',
  'Ivory formations':'[fire-slay minotaur/hoofstone]',
  'Mithril formations':'[fire-slay dwarf/gallstone]',
  'Onyx formations':'[fire-slay goblin/darkstone]',
  'Peridot formations':'[fire-slay gnome/gearstone]',
  'Quartz formations':'[fire-slay halfling/piestone]',
  'Sapphire formations':'[fire-slay human/fellstone]',
  'Topaz formations':'[fire-slay troll/firestone]',
  'aura of light surrounds':'[+light/morningstone]',
  'aura of darkness surrounds':'[darkness/nightstone]',
  'aura of crimson energy':'[spellcraft/lodestone]',
  'aura of well-being':'[extra AC/wardstone]',
  'aura of viciousness':'[increased weapon-acc/guidestone]',
  'aura of malevolence':'[increased damage/stingstone]',
  'feeling of unease':'[resist life/mummystone]',
  'goosebumps being around':'[resist cold/woolstone]',
  'urge to sneeze':'[resist poison/sweatstone]',
  'dull feeling comes over you':'[resist magic/quietstone]',
  'tickle in your throat':'[resist water/duckstone]',
  'feeling of calm':'[resist fire/powderstone]',
  'ringing in your ears':'[resist air/tarpstone]',
  'itching sensation':'[resist acid/salvestone]',
  'hair-raising sensation grips you':'[resist electricity/rubberstone]',
  'feeling of nausea':'[resist death/larsstone]',
  'feeling of drowsiness':'[resist earth/riverstone]',
  'clusters of frost cling':'[cold damage/snapstone]',
  'disturbance in the air surrounding':'[air-bolts damage/blowstone]',
  'hissing sound':'[heat damage/bluestone]',
  'colour seems to be occuring':'[earth damage/sinkstone]',
  'acid sheen':'[acid damage/ruststone]',
  'green moisture':'[poison damage/aspstone]',
  'odor of decay':'[death damage/blackstone]',
  'white flames':'[elemental damage/orangestone]',
  'ripples of blue electricity':'[electricity damage/ampstone]',
  'feeling of security emanates':'[heals the user/balmstone]',
  'sparkle bewitches your senses':'[darkvision/torchstone]',
  'orange glow surrounds':'[awareness/eyestone]',
  'gleam of mithril':'[increased durability/ironstone]',
  'whine is coming':'[speed/mercurystone]',
  'drone issues from this':'[slow opponent/grogstone]',
  'clicking sound':'[blindfighting/molestone]',
  'purring sound':'[hide+sneak/rodentstone]',
  'silvery aura':'[two handed combat/twinstone]',
  'purple gleam':'[parry/deftstone]',
  'swirling bands of yellow energy':'[defence/shieldstone]',
  'twisting pattern':'[acrobat/leapstone]',
  'aura of arcana':'[enhancer/enigmastone]',
  'aura of a falcon':'[missile/arrowstone]',
};

gwc.output.replace(args[1],'<span style="color:skyblue">'+args[1] + " " + translator[args[1]]+'</span>',true);