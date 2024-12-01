/*
AUTHOR: Barek
This trigger will highlight unusual, peculiar and exotic. You can add more words to the trigger to colour other things.

NOTE: Multiple colour triggers can conflict and cause each other not to work. To avoid this, have all of your colours in a single trigger.

Name: Colours - imbued items
Type: regexp
Pattern: (unusual|peculiar|exotic)

Execute the following javascript: 
*/

const matchLine = args['$*'];
  var newLine = matchLine.replaceAll('unusual', '<span style="color: #A020F0">unusual</span>');
      newLine = newLine.replaceAll('peculiar',  '<span style="color: #bb00ff">peculiar</span>');
      newLine = newLine.replaceAll('exotic',    '<span style="color: #ff00ff">exotic</span>');
  gwc.output.replace(matchLine, newLine);