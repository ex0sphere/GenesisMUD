/*
AUTHOR: Celse
Contains: 1 trigger

Colours and translates health and mana into numbers.

Pattern: ^((?:\(|\[)?(?:You|[A-Z][a-z]+|The .*)(?:\)|\])?) (are|is) (?:(?:physically )?\b(at death&#39;s door|barely alive|terribly hurt|in a very bad shape|in agony|in a bad shape|very hurt|suffering|hurt|aching|somewhat hurt|slightly hurt|sore|feeling well|feeling very well)\b)(?: and (?:mentally \b(in a vegetable state|exhausted|worn down|indisposed|in a bad shape|very degraded|rather degraded|degraded|somewhat degraded|slightly degraded|in full vigour)\b))?\.$

Execute the following javascript:
*/

//DECLARE CONSTANTS FOR LESS TYPING
const a0 = args[0], a1 = args[1], a2 = args[2], a3 = args[3], a4 = args[4];

     //SPECIAL CASE FOR YOUR HEALTH AND MANA WHEN ARE BOTH 'IN A BAD SHAPE'
     if (a3 === a4) { gwc.output.replace (a0, `You are physically <span style="color:orange">in a bad shape [6/15]</span> and mentally <span style="color:skyblue">in a bad shape [4/10]</span>.`, true) }
  
//YOUR
else if (a1.includes ('You') && a2.includes ('are')) {
  
  //HEALTH
  switch (a3) {
    case 'at death&#39;s door'  : gwc.output.replace ("at death's door", `<span style="color:crimson"  >${a3} [1/15]</span>` , true) ; break
    case 'barely alive'         : gwc.output.replace (a3               , `<span style="color:crimson"  >${a3} [2/15]</span>` , true) ; break
    case 'terribly hurt'        : gwc.output.replace (a3               , `<span style="color:crimson"  >${a3} [3/15]</span>` , true) ; break
    case 'in a very bad shape'  : gwc.output.replace (a3               , `<span style="color:crimson"  >${a3} [4/15]</span>` , true) ; break
    case 'in agony'             : gwc.output.replace (a3               , `<span style="color:orange"   >${a3} [5/15]</span>` , true) ; break
    case 'in a bad shape'       : gwc.output.replace (a3               , `<span style="color:orange"   >${a3} [6/15]</span>` , true) ; break
    case 'very hurt'            : gwc.output.replace (a3               , `<span style="color:orange"   >${a3} [7/15]</span>` , true) ; break
    case 'suffering'            : gwc.output.replace (a3               , `<span style="color:orange"   >${a3} [8/15]</span>` , true) ; break
    case 'hurt'                 : gwc.output.replace (a3               , `<span style="color:yellow"   >${a3} [9/15]</span>` , true) ; break
    case 'aching'               : gwc.output.replace (a3               , `<span style="color:yellow"   >${a3} [10/15]</span>`, true) ; break
    case 'somewhat hurt'        : gwc.output.replace (a3               , `<span style="color:yellow"   >${a3} [11/15]</span>`, true) ; break
    case 'slightly hurt'        : gwc.output.replace (a3               , `<span style="color:yellow"   >${a3} [12/15]</span>`, true) ; break
    case 'sore'                 : gwc.output.replace (a3               , `<span style="color:limegreen">${a3} [13/15]</span>`, true) ; break
    case 'feeling well'         : gwc.output.replace (a3               , `<span style="color:limegreen">${a3} [14/15]</span>`, true) ; break
    case 'feeling very well'    : gwc.output.replace (a3               , `<span style="color:limegreen">${a3} [15/15]</span>`, true) ; break
  }

  //MANA
  switch (a4) {
    case 'in a vegetable state' : gwc.output.replace (a4               , `<span style="color:skyblue"  >${a4} [0/10]</span>` , true) ; break
    case 'exhausted'            : gwc.output.replace (a4               , `<span style="color:skyblue"  >${a4} [1/10]</span>` , true) ; break
    case 'worn down'            : gwc.output.replace (a4               , `<span style="color:skyblue"  >${a4} [2/10]</span>` , true) ; break
    case 'indisposed'           : gwc.output.replace (a4               , `<span style="color:skyblue"  >${a4} [3/10]</span>` , true) ; break
    case 'in a bad shape'       : gwc.output.replace (a4               , `<span style="color:skyblue"  >${a4} [4/10]</span>` , true) ; break
    case 'very degraded'        : gwc.output.replace (a4               , `<span style="color:skyblue"  >${a4} [5/10]</span>` , true) ; break
    case 'rather degraded'      : gwc.output.replace (a4               , `<span style="color:skyblue"  >${a4} [6/10]</span>` , true) ; break
    case 'degraded'             : gwc.output.replace (a4               , `<span style="color:skyblue"  >${a4} [7/10]</span>` , true) ; break
    case 'somewhat degraded'    : gwc.output.replace (a4               , `<span style="color:skyblue"  >${a4} [8/10]</span>` , true) ; break
    case 'slightly degraded'    : gwc.output.replace (a4               , `<span style="color:skyblue"  >${a4} [9/10]</span>` , true) ; break
    case 'in full vigour'       : gwc.output.replace (a4               , `<span style="color:skyblue"  >${a4} [10/10]</span>`, true) ; break
  }

}

//OTHER CHARACTERS HEALTH
else if (/The .*|[A-Z][a-z]+/.test (a1) && a2.includes ('is')) {

  switch (a3) {
    case 'at death&#39;s door'  : gwc.output.replace ("at death's door", `<span style="color:crimson"  >${a3} [1/15]</span>` , true) ; break
    case 'barely alive'         : gwc.output.replace (a3               , `<span style="color:crimson"  >${a3} [2/15]</span>` , true) ; break
    case 'terribly hurt'        : gwc.output.replace (a3               , `<span style="color:crimson"  >${a3} [3/15]</span>` , true) ; break
    case 'in a very bad shape'  : gwc.output.replace (a3               , `<span style="color:crimson"  >${a3} [4/15]</span>` , true) ; break
    case 'in agony'             : gwc.output.replace (a3               , `<span style="color:orange"   >${a3} [5/15]</span>` , true) ; break
    case 'in a bad shape'       : gwc.output.replace (a3               , `<span style="color:orange"   >${a3} [6/15]</span>` , true) ; break
    case 'very hurt'            : gwc.output.replace (a3               , `<span style="color:orange"   >${a3} [7/15]</span>` , true) ; break
    case 'suffering'            : gwc.output.replace (a3               , `<span style="color:orange"   >${a3} [8/15]</span>` , true) ; break
    case 'hurt'                 : gwc.output.replace (a3               , `<span style="color:yellow"   >${a3} [9/15]</span>` , true) ; break
    case 'aching'               : gwc.output.replace (a3               , `<span style="color:yellow"   >${a3} [10/15]</span>`, true) ; break
    case 'somewhat hurt'        : gwc.output.replace (a3               , `<span style="color:yellow"   >${a3} [11/15]</span>`, true) ; break
    case 'slightly hurt'        : gwc.output.replace (a3               , `<span style="color:yellow"   >${a3} [12/15]</span>`, true) ; break
    case 'sore'                 : gwc.output.replace (a3               , `<span style="color:limegreen">${a3} [13/15]</span>`, true) ; break
    case 'feeling well'         : gwc.output.replace (a3               , `<span style="color:limegreen">${a3} [14/15]</span>`, true) ; break
    case 'feeling very well'    : gwc.output.replace (a3               , `<span style="color:limegreen">${a3} [15/15]</span>`, true) ; break
  }

}

// Colours the target's name
gwc.output.replace (a1, `<span style="color:white">${a1}</span>`, true)