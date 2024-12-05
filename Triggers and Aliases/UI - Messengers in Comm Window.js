/*Name: Notifications - Messengers in Comm Window
Type: regexp
Pattern: (ferret runs towards you and climbs up to your shoulder|A brisk waif runs up to you|flits up to you|scuttles up to you with a message|monkey runs towards you|skitters to you and gives you a message|runs up to you with a message|flies up to you with a message from|Postmaster tells you|A red-winged harrekki descends from above|lands on your shoulder|scampers up to you|scurries up to you with a message|runs up and sits in your hand|A young page arrives jogging and hands you|A tiny monkey runs towards you and jumps back on your shoulder|grabs onto your leg|A small black snake slithers out of the shadows and coils itself around your arm\.)

Execute the following javascript:
*/

  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hour}:${minute}`;
  document.getElementById('communication').append("["+currentTime+"] You've received a message!\n");