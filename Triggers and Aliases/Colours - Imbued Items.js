/*
AUTHOR: Barek & feskslo
Contains: 1 trigger

This trigger will highlight the words "unusual", "peculiar" and "exotic" in your desired style. 
You can add more words to the trigger to highlight them too.

NOTE: Multiple colour triggers can conflict and cause each other not to work. 
If you experience this, put all of your recolours in a single trigger.

Name: Colours - imbued items
Pattern: (unusual|peculiar|exotic)
Type: regexp

Execute the following javascript:
*/

function recolorImbuedWords() {
    // Define words and their respective CSS styles. Color can be words, RGB values or hex codes.
    const wordStyles = {
      "unusual": 'color: #4A90E2', // Magic Blue
      "peculiar": 'color: #FFD700; text-shadow: 1px 1px 3px rgba(255,215,0,0.2);', // Rare Yellow
      "exotic": 'color: #FF00FF; font-weight: bold; text-shadow: 1px 1px 3px rgba(176,48,176,0.3);'  // Legendary Pink
    };
  
    // Select the latest line from the MUD output
    $("#mudoutput .line").last().html(function (_, html) {
      if (!html) return html; // Safety check
  
      // Replace all occurrences of each word with its corresponding style
      Object.keys(wordStyles).forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi"); // Case-insensitive, word-boundary match
        html = html.replace(regex, `<span style="${wordStyles[word]}">${word}</span>`);
      });
  
      return html;
    });
  }
recolorImbuedWords();