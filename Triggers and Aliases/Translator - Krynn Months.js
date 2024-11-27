/*Name: Translator - Krynn Months
Type: regexp
Pattern: (Aelmont|Rannmont|Mishamont|Chislmont|Bran|Corij|Argon|Sirrimont|Reorxmont|Hiddumont|H&#39;rarmont|Phoenix) in the year

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
  "H'rarmont":"(November)",
  "Phoenix":"(December)"
  }
  
  gwc.output.replace(args[1],args[1] + ' ' + '<span style="color:#919191">' + months[args[1]]+'</span>',true);

