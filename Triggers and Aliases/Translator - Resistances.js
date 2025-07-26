/*
AUTHOR: Exosphere
Contains: 1 trigger

Translates elemental resistance effects that are visible by examining people.

Pattern: ^(?:Your|His|Her|Its) (skin is covered with a glossy substance|flesh is radiating a strange heat|countenance exhudes a mystical sense of well-being|skin is coated with a smooth springy substance|flesh is covered with tiny ice crystals|eyes vibrate strangely|body is cast in a dark pall of gloom|skin has taken on an unusual texture|veins pulse with unnatural verve|aura is of calm and stillness|body is unnaturally stiff and rigid)\.$

Execute the following javascript:
*/

const resistances = {
"skin is covered with a glossy substance" : "Acid",
"flesh is radiating a strange heat" : "Cold",
"countenance exhudes a mystical sense of well-being" : "Death",
"skin is coated with a smooth springy substance" : "Electricity",
"flesh is covered with tiny ice crystals" : "Fire",
"eyes vibrate strangely" : "Illusion",
"body is cast in a dark pall of gloom" : "Life",
"skin has taken on an unusual texture" : "Water",
"veins pulse with unnatural verve" : "Poison",
"aura is of calm and stillness" : "Air",
"body is unnaturally stiff and rigid" : "Earth",
}

let output = " <span style='color:#9cfaff'>["+resistances[args[1]]+" resistance]</span>"

gwc.output.replace(args[1],args[1]+output)