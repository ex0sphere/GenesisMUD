/*
AUTHOR: Exosphere (functions by Sonta & @feskslo)
Contains: 1 trigger

Colours and translates health into numbers.

Pattern: \b(at death&#39;s door|barely alive|terribly hurt|in a very bad shape|in agony|in a bad shape|very hurt|suffering|hurt|aching|somewhat hurt|slightly hurt|sore|feeling well|feeling very well)\b

Execute the following javascript:
*/

// Function to replace text outside of HTML tags using a regex and a replacer
function replaceOutsideTags(str, regex, replacer) {
   // Split the string into parts, separating out HTML tags as their own elements
   return str
     .split(/(<[^>]+>)/g) // Split on HTML tags, keeping the tags in the array
     // For each part, if it's an HTML tag, leave it unchanged; otherwise, apply the replacement
     .map(part => part.startsWith('<') ? part : part.replace(regex, replacer))
     // Join all the parts back together into a single string
     .join('')
     // Replace the HTML entity &#39; with a single quote character
     .replace("&#39;","'");
 }

// The health level string to match (from args)
let regexMatch = args[1]

// All possible health levels, as a comma-separated string
const healthLevels = "at death's door, barely alive, terribly hurt, in a very bad shape, in agony, in a bad shape, very hurt, suffering, hurt, aching, somewhat hurt, slightly hurt, sore, feeling well, feeling very well"

// Convert the health levels string into an array
const healthLevelsArray = healthLevels.split(", ")

// Group health levels into categories for colouring
const healthLevelGroups = {
   critical:["at death's door","barely alive","terribly hurt","in a very bad shape"],
   severe:["in agony","in a bad shape","very hurt","suffering"],
   hurt:["hurt","aching","somewhat hurt","slightly hurt"],
   okay:["sore","feeling well","feeling very well"]
 }

// Colour codes for each health group
const colourGroups = {
    critical: "#DE3535",
    severe: "#FF8F1F",
    hurt: "#FFF63D",
    okay: "#55C248"
 }

// Find the current health level's position (1-based index)
currentHealth = healthLevelsArray.indexOf(regexMatch)+1

// Find the group name (key) in healthLevelGroups that contains regexMatch
let currentHealthGroup
for (const [group, levels] of Object.entries(healthLevelGroups)) {
  if (levels.includes(regexMatch)) {
    currentHealthGroup = group;
    break;
  }
}

// Get the colour for the current health group
const colour = colourGroups[currentHealthGroup]

// Replace the matched health level in the last output line with a coloured span and health index
$("#mudoutput .line").last().html(function (_, html) {
    return replaceOutsideTags(
        html,
        regexMatch,
        "<span style='color: "+colour+";'>"+regexMatch+"</span> ["+currentHealth+"/15]"
    )
})