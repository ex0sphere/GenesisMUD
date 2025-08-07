/*
AUTHOR: Exosphere
Contains: 1 trigger

Highlights scry messages, puts them in comm window, optionally alerts your team via whisper.

Name: Utility - Scry Detector
Type: regexp
Pattern: ^(You feel your wards against divination protect you from a scrying attempt\.|You sense someone trying to invade your mind\, but you successfully ward off the intruding presence\.|The eye on your ring glitters with a cold red light\.|You sense someone trying to divine your whereabouts, but you successfully ward off the intruding presence\.|You briefly feel an intruding presence seeking you out\, but the feeling passes|You sense an intruding presence in your mind|For a very brief moment, an alien presence enters your mind\! Flashes of unspeakable horrors torment you before the alien presence leaves you alone|You feel you are being watched\.|The gemstones of your torque burn with a sudden heat|An encircling clutch of midnight black crows appears overhead and slowly flies about|You sense you are being observed from the skies above you\.|You feel as if someone is looking at you from afar\.|A ghostly image of a small mirror appears\.)

Execute the following javascript:
*/

// Set this to false if you don't want to whisper to team about the scry
const alertTeam = true;

// Add scry texts here and to pattern if you find more.
const translator = {
  'You feel your wards against divination protect you from a scrying attempt.':'RESISTED',
  'You sense someone trying to invade your mind, but you successfully ward off the intruding presence.':'RESISTED',
  'The eye on your ring glitters with a cold red light.':'RESISTED',
  'You sense someone trying to divine your whereabouts, but you successfully ward off the intruding presence.':'RESISTED',
  'You briefly feel an intruding presence seeking you out, but the feeling passes':'POT',
  'You sense an intruding presence in your mind':'SOHM',
  'For a very brief moment, an alien presence enters your mind! Flashes of unspeakable horrors torment you before the alien presence leaves you alone':'WARLOCK',
  'You feel you are being watched.':'CRYSTAL',
  'The gemstones of your torque burn with a sudden heat':'TORQUE',
  'An encircling clutch of midnight black crows appears overhead and slowly flies about':'MM',
  'You sense you are being observed from the skies above you.':'HERALD',
  'You feel as if someone is looking at you from afar.':'PALANTIR',
  'A ghostly image of a small mirror appears.':'MIRROR'
};

// highlights the message
gwc.output.replace(args[1],'<span style="color: #00ffb3">'+args[1] + ' [' + translator[args[1]]+' SCRY]</span>',true);
// alerts team
if(alertTeam == true){
  gwc.connection.send('whisper to team '+translator[args[1]]+' SCRY!');
      }
//appends a scry notification in the comm window
const now = new Date();
const hour = String(now.getHours()).padStart(2, '0');
const minute = String(now.getMinutes()).padStart(2, '0');
const currentTime = `${hour}:${minute}`;
document.getElementById('communication').append('['+currentTime+'] '+translator[args[1]]+'SCRY! \n');