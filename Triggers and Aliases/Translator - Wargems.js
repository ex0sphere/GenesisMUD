/* 
AUTHOR: Exosphere
Contains: 1 trigger

Name: Translator - Wargems
Type: regexp
Pattern: (ellipse-shaped azure diamond|ellipse-shaped black tourmaline|ellipse-shaped blue diamond|ellipse-shaped blue tourmaline|ellipse-shaped brown tourmaline|ellipse-shaped red tourmaline|ellipse-shaped violet tourmaline|ellipse-shaped white diamond|ellipse-shaped yellow tourmaline|glowing teardrop-shaped beryl|oval-shaped azure sapphire|oval-shaped black sapphire|oval-shaped blue sapphire|oval-shaped brown agate|oval-shaped green sapphire|oval-shaped magenta sapphire|oval-shaped mauve sapphire|oval-shaped amber aragonite|oval-shaped milky quartz|oval-shaped moonstone|oval-shaped purple amethyst|oval-shaped rose quartz|oval-shaped smoky quartz|oval-shaped striped chalcedony|oval-shaped violet sapphire|teardrop-shaped pyrite|teardrop-shaped bloodstone|teardrop-shaped blue spinel|teardrop-shaped blue topaz|teardrop-shaped carnelian|teardrop-shaped colourless beryl|teardrop-shaped diamond|teardrop-shaped golden pyrite|teardrop-shaped green jade|teardrop-shaped opal|triangular-shaped blue agate|triangular-shaped green peridot|triangular-shaped orange garnet|triangular-shaped yellow amber|triangular-shaped yellow topaz)

Execute the following javascript: 
*/

  const wargems = {
  'ellipse-shaped azure diamond':'[+hit, +damage (W)]',
  'ellipse-shaped black tourmaline':'[death magic (W)]',
  'ellipse-shaped blue diamond':'[+damage (W)]',
  'ellipse-shaped blue tourmaline':'[water magic (W)]',
  'ellipse-shaped brown tourmaline':'[earth magic (W)]',
  'ellipse-shaped red tourmaline':'[fire magic (W)]',
  'ellipse-shaped violet tourmaline':'[life magic (W)]',
  'ellipse-shaped white diamond':'[increased hit (W)]',
  'ellipse-shaped yellow tourmaline':'[air magic (W)]',
  'glowing teardrop-shaped beryl':'[cold magic protection (A)]',
  'oval-shaped azure sapphire':'[2h combat (A)]',
  'oval-shaped black sapphire':'[hide (A)]',
  'oval-shaped blue sapphire':'[defence (A)]',
  'oval-shaped brown agate':'[abjuration (A)]',
  'oval-shaped green sapphire':'[parry (A)]',
  'oval-shaped magenta sapphire':'[remove traps skill (A)]',
  'oval-shaped mauve sapphire':'[open lock (A)]',
  'oval-shaped milky quartz':'[illusion (A)]',
  'oval-shaped moonstone':'[armours weight reduction (A)]',
  'oval-shaped purple amethyst':'[conjuration (A)]',
  'oval-shaped rose quartz':'[transmutation (A)]',
  'oval-shaped smoky quartz':'[divination (A)]',
  'oval-shaped striped chalcedony':'[enchantment (A)]',
  'oval-shaped violet sapphire':'[sneak (A)]',
  'oval-shaped amber aragonite':'[hunting (A)]',
  'teardrop-shaped bloodstone':'[death magic protection (A)]',
  'teardrop-shaped blue spinel':'[air magic protection (A)]',
  'teardrop-shaped blue topaz':'[water magic protection (A)]',
  'teardrop-shaped carnelian':'[fire magic protection (A)]',
  'teardrop-shaped pyrite':'[earth magic protection (A)]',
  'teardrop-shaped colourless beryl':'[cold magic protection (A)]',
  'teardrop-shaped diamond':'[Extra AC (A)]',
  'teardrop-shaped golden pyrite':'[earth magic protection  (A)]',
  'teardrop-shaped green jade':'[poison magic protection (A)]',
  'teardrop-shaped opal':'[life magic protection (A)]',
  'triangular-shaped blue agate':'[waterbreath on press (A)]',
  'triangular-shaped green peridot':'[see invisible on press (A)]',
  'triangular-shaped orange garnet':'[enhanced reflexes  (A)]',
  'triangular-shaped yellow amber':'[Darkvision (A)]',
  'triangular-shaped yellow topaz':'[Protection from scry on press (A)]'
  };
  
  gwc.output.replace(args[1],'<span style="color:skyblue">'+args[1] + " " + wargems[args[1]]+'</span>',true);

