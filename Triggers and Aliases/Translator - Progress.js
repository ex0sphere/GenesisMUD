/* Name: Translator - Progress
Type: regexp
Pattern: (no measurable progress|insignificant progress|a tiny amount of progress|minimal progress|slight progress|low progress|a little progress|some progress|modest progress|decent progress|nice progress|good progress|very good progress|major progress|great progress|extremely good progress|awesome progress|immense progress|tremendous progress|fantastic progress)

Execute the following javascript: */

  const progress = {
    'no measurable progress':'[0/18]',
    'insignificant progress':'[0/18]',
    'a tiny amount of progress':'[1/18]',
    'minimal progress':'[2/18]',
    'slight progress':'[3/18]',
    'low progress':'[4/18]',
    'a little progress':'[5/18]',
    'some progress':'[6/18]',
    'modest progress':'[7/18]',
    'decent progress':'[8/18]',
    'nice progress':'[9/18]',
    'good progress':'[10/18]',
    'very good progress':'[11/18]',
    'major progress':'[12/18]',
    'great progress':'[13/18]',
    'extremely good progress':'[14/18]',
    'awesome progress':'[15/18]',
    'immense progress':'[16/18]',
    'tremendous progress':'[17/18]',
    'fantastic progress':'[18/18]',
  }
  gwc.output.replace(args[1],'<span style="color:skyblue">'+args[1] + " " + progress[args[1]]+'</span>',true);

