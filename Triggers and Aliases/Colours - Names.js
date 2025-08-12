/* AUTHOR: Exosphere
Contains: 1 trigger

An easily configurable system for colouring names.

Name: Colours - Names
Type: regexp
Pattern: \b(Put|Names|Here)\b.*

(Hint for making the pattern: copy your remember list into notepad and Replace ", " with "|")

Execute the following javascript:
*/

// Write names into groups here.

  const names = {
      Self:gwc.gmcp.data.character.status.name, // detects and colours your own name
      Guildmates:"Put,Names,Here,Separated,By,Commas".split(","),
      Allies:"Put,Names,Here,Separated,By,Commas".split(","),
      Neutral:"Put,Names,Here,Separated,By,Commas".split(","),
      Enemies:"Put,Names,Here,Separated,By,Commas".split(","),
      // Add more categories as needed.
  
  }

  // Define colours for each group here.
  
  const colours = {
      Self:"#ffd073",
      Guildmates:"#73fff1",
      Allies:"#4fdb51",
      Neutral:"#E8E8E8",
      Enemies:"#cf3c3c",
  }
  
  let text = args[0]

  // If you've added more groups, add "if" statements for them below.
  
  text = text.replace(/\b\w+\b/g, (name) => {
      if (name === names.Self) {
          return `<span style="color:${colours.Self}">${name}</span>`;
      }
      if (names.Guildmates.includes(name)) {
          return `<span style="color:${colours.Guildmates}">${name}</span>`;
      }
      if (names.Allies.includes(name)) {
          return `<span style="color:${colours.Allies}">${name}</span>`;
      }
      if (names.Neutral.includes(name)) {
          return `<span style="color:${colours.Neutral}">${name}</span>`;
      }
      if (names.Enemies.includes(name)) {
          return `<span style="color:${colours.Enemies}">${name}</span>`;
      }
      return name;
  });
  
  gwc.output.replace(args[0],text)