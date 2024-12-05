/*
AUTHOR: Exosphere
Contains: 1 trigger

Name: Translator - Krynn Months
Type: regexp
Pattern: (Aelmont|Rannmont|Mishamont|Chislmont|Bran|Corij|Argon|Sirrimont|Reorxmont|Hiddumont|rarmont|Phoenix) in the year

Execute the following javascript: 
*/

const months = {
  "Aelmont":"(January)",
  "Rannmont":"(February)",
  "Mishamont":"(March)",
  "Chislmont":"(April)",
  "Bran":"(May)",
  "Corij":"(June)",
  "Argon":"(July)",
  "Sirrimont":"(August)",
  "Reorxmont":"(September)",
  "Hiddumont":"(October)",
  "rarmont":"(November)", // It's H'rarmont but webclient hates apostrophes
  "Phoenix":"(December)"
  }
  
gwc.output.replace(args[1],args[1] + ' ' + '<span style="color:#919191">' + months[args[1]]+'</span>',true);

