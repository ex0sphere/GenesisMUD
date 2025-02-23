/*
AUTHOR: Exosphere (big credit to raevynne!!!)
Contains: 1 alias

Easily change webclient font size and color via CSS attributes.

USAGE EXAMPLES: 
font color pink    - sets font color to pink
font color #00ffff - sets font color to #00ffff
font size 16px     - sets font size to 16px
font family Comic Sans MS - sets the font to Comic Sans MS

font [color/size/family] default - resets the attribute to default: #d0d0d0 / 14px / Source Code Pro
*/

let color
let size
let family
if(args[2] == "default"){
	color = "#d0d0d0";
    size  = "14px";
    family = "Source Code Pro,monospace"
}
else {
	color = args["*"].replace("color","");
    size  = args["*"].replace("size","");
    family  = args["*"].replace("family","");
}
switch(args[1]){
  case "color":
    $("#mudoutput").css("color", color); break;
  case "size":
    $("#mudoutput").css("font-size", size); break;
  case "family":
    $("#mudoutput").css("font-family", family); break;
}