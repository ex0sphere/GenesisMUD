/*
AUTHOR: Exosphere (big credit to raevynne!!!)
Contains: 1 alias

Easily change webclient font size and color via CSS attributes.

USAGE EXAMPLES: 
font color pink    - sets font color to pink
font color #00ffff - sets font color to #00ffff
font size 16px     - sets font size to 16px
font [color/size] default - resets the color/size to the default #d0d0d0 / 14px
*/

let color
let size
if(args[2] == "default"){
	color = "#d0d0d0";
    size  = "14px";
}
else {
	color = args["*"].replace("color","");
    size  = args["*"].replace("size","");
}
switch(args[1]){
  case "color":
    $("#mudoutput").css("color", color); break;
  case "size":
    $("#mudoutput").css("font-size", size); break;
}