/* 
AUTHOR: Exosphere
Contains: 1 trigger

Name: Translator - Alignment
Type: regexp
Pattern: ^You are (neutral|agreeable|trustworthy|sympathetic|nice|sweet|good|devout|blessed|saintly|holy|disagreeable|untrustworthy|unsympathetic|sinister|wicked|nasty|foul|evil|malevolent|beastly|demonic|damned)\.$

Execute the following javascript: 
*/

const good = ['agreeable','trustworthy','sympathetic','nice','sweet','good','devout','blessed','saintly','holy']
  
const evil = ['disagreeable','untrustworthy','unsympathetic','sinister','wicked','nasty','foul','evil','malevolent','beastly','demonic','damned']
  
const alignment = {
      'neutral':'[-12/0/10]',
      'agreeable':'[1/10]',
      'trustworthy':'[2/10]',
      'sympathetic':'[3/10]',
      'nice':'[4/10]',
      'sweet':'[5/10]',
      'good':'[6/10]',
      'devout':'[7/10]',
      'blessed':'[8/10]',
      'saintly':'[9/10]',
      'holy':'[10/10]',
      'disagreeable':'[1/12]',
      'untrustworthy':'[2/12]',
      'unsympathetic':'[3/12]',
      'sinister':'[4/12]',
      'wicked':'[5/12]',
      'nasty':'[6/12]',
      'foul':'[7/12]',
      'evil':'[8/12]',
      'malevolent':'[9/12]',
      'beastly':'[10/12]',
      'demonic':'[11/12]',
      'damned':'[12/12]'
  }
let color
  
if (args[1]==='neutral'){color='<span style="color:#878787">'}
    else if (good.includes(args[1])){color='<span style="color:#78b9ff">'}
        else if (evil.includes(args[1])){color='<span style="color:#ff6363">'}
  
gwc.output.replace(args[1],color+args[1] + " " + alignment[args[1]]+'</span>',true);
