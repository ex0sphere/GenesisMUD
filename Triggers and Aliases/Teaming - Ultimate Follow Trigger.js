/*
Name: Teaming - Ultimate Follow Trigger
Type: regexp
Pattern: ^(.*)( mounts the sedan chair pulled by a bondservant|steps into the crystal pool|grabs a rope from the rigging above and swings across to the (.*)\, landing with catlike grace on its deck.|leaves climbing into the (.*)\.|leaves limping climbing into the (.*)\.|leaves gallantly climbing into the (.*)\.|leaves (.*) mire.|leaves down the ladder and into the waters of Horned Bay.|carefully climbs out of the tree.|leaves climbing over the gate|You fail to get a sure footing.|falls into a dark hole and disappears|climbs the ladder|slides down in the opening between the sharp stones, and disappears into the darkness|climbs out of the narrow hole|leaves enters a dark opening in the side of the tower|pushes on the doors,|opens the tower door|swims up and rubs the left eye of the|allowing (him|her|it) to swim through to the other side|leaves into the ruined watchtower|climbs out of the narrow hole in the ceiling|leaves by climbing up the cliff|walks through the gap in the wall, entering Kendermore|walks through the gap in the wall, exiting Kendermore|vanishes into a hidden exit somewhere|exits the shaft!|gets down on all fours and climbs into the bushes.|leaves entering the tent.|disappears into the hedge.|rests its weight on the small ladder. It seems to hold.|slips silently behind the tapestry.|turns the latch and opens the sturdy hatch.|climbs up on top of the bridge.|climbs down the side of the bridge.|climbs up the chain.|enters the broken tower.|leaves swimming across the river.|leaves across the river towards Tharbad.|leaves across the river towards Eriador.|leaves down into the tunnel.|leaves up the great oak tree and disappears into its folliage.|enters the rickety tavern.|leaves sneaking down into the tunnel.|makes (his|her|its) way through the undergrowth to the north.|climbs over the low stone wall.|steps up to the cliffside and begins pulling (himself|herself|itself) up.|lowers (herself|himself|itself) down over the side of the cliff and almost seems to slip over the edge a few times.|climbs laboriously up the side of the bridge.|leaves climbing up the tree.|lifts the flap and enters the tent.|leaves swims to the beach.|leaves up the drainpipe.|jumps off the ledge.|scrambles up the cliff.|leaves into the dwarven tomb.|disappears beneath the waterfall.|dives into the waterfall.|pushes against the wall and it suddenly swings open.|leaves through the trapdoor.|disappears from view.|leaves climbing up the face of the cliff.|leaves climbing down the face of the cliff.|climbs down into something!|disappears over the wall to the north.|climbs the wall to the south.|steps into the purple booth.|leaves entering the tent.|leaves sneaking into the mire|gets down on all fours and climbs into the bushes.|leaves into the dark cave.|leaves into the farmhouse.|disappears into the bushes.|leaves passes through the steam into the cave.|scrapes through the briars.|swims out in the sea and enters the lowered gangway of the three masted frigate.|leaves gallantly down the ladder and into the waters of Horned Bay.|leaves gallantly passes through the steam into the cave.|leaves gallantly into the dark cave.|leaves through the bush|leaves into the fireplace.|leaves into the farmhouse.|makes (his|her|its) way through the sharp spires of the stalagmites, and very carefully enters the cave.|With an effort,|crawls through a dark hole in the embankment.|leaves dives into the surf and swims out into the Bloodsea of Istar.|leaves into the troll\'s lair.|climbs down the side of the bridge to the eastern bank of the river.|squeezes between the iron bars and disappears.)

Execute the following javascript:
*/
    gwc.output.append('trigger hit: ' + args[1]);
            if(args[1].includes(mud.gmcp['char.team'].leader)){
              gwc.output.append('Here is the Captain!');
              switch (args[2])
                {
                  case 'mounts the sedan chair pulled by a bondservant':
                    gwc.connection.send('mount chair');break;
                  case 'steps into the crystal pool':
                    gwc.connection.send('enter pool');break;
                  case 'grabs a rope from the rigging above and swings across to the ' + args[3] + ', landing with catlike grace on its deck.':
                    gwc.connection.send('board ' + args[3]);
                    break; 
                  case 'leaves climbing into the ' + args[4] + '.':
                    gwc.connection.send('board ' + args[4]);
                    break;
                   case 'leaves limping climbing into the ' + args[5] + '.':
                    gwc.connection.send('board ' + args[5]);
                    break;
                  case 'leaves gallantly climbing into the ' + args[6] + '.':
                    gwc.connection.send('board ' + args[6]);
                    break;
                  case 'leaves ' + args[7] + ' mire.':
                    gwc.connection.send('enter mire');
                    break;
                  case 'leaves sneaking ' + args[7] + ' mire.':
                    gwc.connection.send('enter mire');
                    break;
                  case 'You fail to get a sure footing.':
                    gwc.connection.send('climb cliff');
                    break;
                  case 'leaves down the ladder and into the waters of Horned Bay.':
                    gwc.connection.send('climb ladder');
                    break;
                  case 'carefully climbs out of the tree.':
                    gwc.connection.send('climb down');
                    break;
                  case 'falls into a dark hole and disappears':
                    gwc.connection.send('dig');
                    break;        
                  case 'climbs the ladder':
                    gwc.connection.send('climb ladder');
                    break; 
                  case 'climbs out of the narrow hole':
                    gwc.connection.send('enter opening');
                    break; 
                  case 'leaves enters a dark opening in the side of the tower':
                    gwc.connection.send('enter tower');
                    break; 
                  case 'pushes on the doors,':
                    gwc.connection.send('push door');
                    break; 
                  case 'opens the tower door':
                    gwc.connection.send('open tower door');
                    break; 
                  case 'swims up and rubs the left eye of the':
                    gwc.connection.send('rub left eye');
                    break; 
                  case 'allowing (him|her|it) to swim through to the other side':
                    gwc.connection.send('enter gates');
                    break; 
                  case 'leaves into the ruined watchtower':
                    gwc.connection.send('enter watchtower');
                    break;
                  case 'slides down in the opening between the sharp stones, and disappears into the darkness':
                    gwc.connection.send('slide opening');
                    break;
                  case 'climbs out of the narrow hole in the ceiling':
                    gwc.connection.send('climb hole');
                    break;
                  case 'leaves climbing over the gate':
                    gwc.connection.send('climb gate');
                    break;
                  case 'gets down on all fours and climbs into the bushes':
                    gwc.connection.send('enter bushes');
                    gwc.connection.send('search brush');
                    break;
                  case 'leaves by climbing up the cliff':
                    gwc.connection.send('climb cliff');
                    gwc.connection.send('climb cliff');
                    gwc.connection.send('climb cliff');
                    break;
          
                  case 'walks through the gap in the wall, entering Kendermore':
                  case 'walks through the gap in the wall, exiting Kendermore':
                    gwc.connection.send('enter gap');
                    break;
          
                  case 'vanishes into a hidden exit somewhere':
                    gwc.connection.send('exa bushes');
                    gwc.connection.send('exa rubble');
                    gwc.connection.send('dismount');
                    gwc.connection.send('enter opening');
                    gwc.connection.send('enter tunnel');
                    break;
                  case 'exits the shaft!':
                    gwc.connection.send('exit shaft');
                    break;
                  case 'gets down on all fours and climbs into the bushes.':
                    gwc.connection.send('enter bushes');
                    break;
                  case 'leaves entering the tent.':
                    gwc.connection.send('enter tent');
                    break;
                  case 'disappears into the hedge.':
                    gwc.connection.send('exa bushes');
                    gwc.connection.send('enter opening');
                    break;
                  case 'rests its weight on the small ladder. It seems to hold.':
                    gwc.connection.send('ascend ladder');
                    break;
                  case 'slips silently behind the tapestry.':
                    gwc.connection.send('lift tapestry');
                    gwc.connection.send('hh', true);
                    break;
                  case 'turns the latch and opens the sturdy hatch.':
                    gwc.connection.send('squint through gap');
                    gwc.connection.send('turn latch');
                    break;
                  case 'climbs up on top of the bridge.':
                    gwc.connection.send('climb bridge');
                    break;
                  case 'climbs down the side of the bridge.':
                    gwc.connection.send('climb bridge');
                    break;
                  case 'climbs up the chain.':
                    gwc.connection.send('climb up');
                    break;       
                  case 'enters the broken tower.':
                    gwc.connection.send('enter tower');
                    break;
                  case 'leaves swimming across the river.':
                    gwc.connection.send('swim river');
                    break;
                  case 'leaves across the river towards Tharbad.':
                    gwc.connection.send('swim to tharbad');
                    break;
                  case 'leaves across the river towards Eriador.':
                    gwc.connection.send('swim to eriador');
                    break;
                  case 'leaves down into the tunnel.':
                    gwc.connection.send('enter tunnel');
                    break;
                  case 'leaves up the great oak tree and disappears into its folliage.':
                    gwc.connection.send('climb tree');
                    break;
                  case 'enters the rickety tavern.':
                    gwc.connection.send('enter tavern');
                    break;
                  case 'leaves sneaking down into the tunnel.':
                    gwc.connection.send('enter tunnel');
                    break;
                  case 'makes (his|her|its) way through the undergrowth to the north.':
                    gwc.connection.send('enter undergrowth north');
                    break;
                  case 'climbs over the low stone wall.':
                    gwc.connection.send('climb wall');
                    break;
                  case 'steps up to the cliffside and begins pulling (himself|herself|itself) up.':
                    gwc.connection.send('climb up');
                    break;
                  case 'lowers (herself|himself|itself) down over the side of the cliff and almost seems to slip over the edge a few times.':
                    gwc.connection.send('climb down to ledge');
                    break;
                  case 'climbs laboriously up the side of the bridge.':
                    gwc.connection.send('climb bridge');
                    break;
                  case 'leaves climbing up the tree.':
                    gwc.connection.send('climb tree');
                    gwc.connection.send('climb tree');
                    gwc.connection.send('climb tree');
                    gwc.connection.send('climb tree');
        
                    break;
                  case 'lifts the flap and enters the tent.':
                    gwc.connection.send('enter tent');
                    break;
                  case 'leaves swims to the beach.':
                      gwc.connection.send('swim to beach');
                      break; 
                   case 'leaves up the drainpipe.':
                      gwc.connection.send('climb pipe');
                      gwc.connection.send('jump to window');
                      gwc.connection.send('window');
                      break; 
                   case 'jumps off the ledge.':
                      gwc.connection.send('jump down');
                      break;
                  case 'scrambles up the cliff.':
                      gwc.connection.send('climb cliff');
                      gwc.connection.send('climb cliff');
                      gwc.connection.send('climb cliff');
                      gwc.connection.send('climb cliff');
                      break;
                  case 'leaves into the dwarven tomb.':
                      gwc.connection.send('enter tomb');
                      break;
                  case 'disappears beneath the waterfall.':
                      gwc.connection.send('enter waterfall');
                      break;
                  case 'pushes against the wall and it suddenly swings open.':
                      gwc.connection.send('push wall');
                      break;
                  case 'leaves through the trapdoor.':
                      gwc.connection.send('push tile');
                      break;
                  case 'disappears from view.':
                      gwc.connection.send('lift rock');
                      break;
                  case 'dives into the waterfall.':
                      gwc.connection.send('enter waterfall');
                      break; 
                  case 'leaves climbing up the face of the cliff..':
                      gwc.connection.send('climb cliff');
                      break;
                  case 'leaves climbing down the face of the cliff..':
                      gwc.connection.send('climb down');
                      break;
                  case 'climbs down into something!':
                      gwc.connection.send('enter hole');
                      break;
                  case 'disappears over the wall to the north.':
                      gwc.connection.send('climb wall');
                      break;
                  case 'climbs the wall to the south.':
                      gwc.connection.send('climb wall');
                      break;
                  case 'steps into the purple booth.':
                      gwc.connection.send('enter purple booth');
                      break;
                  case 'leaves entering the tent.':
                      gwc.connection.send('enter tent');
                      break;
                  case 'gets down on all fours and climbs into the bushes.':
                      gwc.connection.send('enter bushes');
                      break;
                  case 'leaves into the dark cave.':
                      gwc.connection.send('enter cave');
                      gwc.connection.send('push through snow');
                      gwc.connection.send('pass carefully through stalagmites');
                       break;
                  case 'leaves into the farmhouse.':
                      gwc.connection.send('enter farmhouse');
                      gwc.connection.send('e');
                      gwc.connection.send('enter fireplace');
                      gwc.connection.send('d');
                      break;
                  case 'disappears into the bushes.':
                      gwc.connection.send('enter opening');
                      break;
                  case 'leaves passes through the steam into the cave.':
                      gwc.connection.send('enter cave');
                      break;
                  case 'scrapes through the briars.':
                      gwc.connection.send('enter briars','s','sw');
                      break;
                  case 'swims out in the sea and enters the lowered gangway of the three masted frigate.':
                      gwc.connection.send('enter frigate');
                      break;
                  case 'leaves gallantly down the ladder and into the waters of Horned Bay.':
                      gwc.connection.send('climb down');
                      break;
                  case 'leaves gallantly passes through the steam into the cave.':
                      gwc.connection.send('enter cave');
                      break;
                  case 'leaves gallantly into the dark cave.':
                      gwc.connection.send('enter cave');
                      break;
                  case 'leaves through the bush.':
                      gwc.connection.send('enter bush');
                      break;
                   case 'leaves into the farmhouse.':
                       gwc.connection.send('enter house');
                       break;
                    case 'leaves into the fireplace.':
                       gwc.connection.send('enter fireplace');
                       break;
                   case 'makes (his|her|its) way through the sharp spires of the stalagmites, and very carefully enters the cave.':
                      gwc.connection.send('pass carefully through stalagmites');
                      gwc.connection.send('push through snow');
                      break;
                  case 'With an effort,':
                      gwc.connection.send('push through snow');
                      gwc.connection.send('pass carefully through stalagmites');
                     break;
                  case 'crawls through a dark hole in the embankment.':
                     gwc.connection.send('crawl through opening');
                    break;
                  case 'leaves dives into the surf and swims out into the Bloodsea of Istar.':
                    gwc.connection.send('swim south');
                    break;
                  case 'leaves into the troll\'s lair.':
                    gwc.connection.send('enter lair');
                    break;
                  case 'climbs down the side of the bridge to the eastern bank of the river.':
                    gwc.connection.send('climb down');
                    break;
                  case 'squeezes between the iron bars and disappears.':
                    gwc.connection.send('wriggle between bars');
                    break;
                    
              }
            } 
  
