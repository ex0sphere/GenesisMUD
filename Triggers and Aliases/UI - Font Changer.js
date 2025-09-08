/*
AUTHOR: Exosphere (big credit to raevynne!!!)
Contains: 1 alias

Easily change webclient font size and color via CSS attributes.

USAGE EXAMPLES: 
font color pink    - sets font color to pink
font color #00ffff - sets font color to #00ffff
font size 16px     - sets font size to 16px
font family Comic Sans MS - sets the font to Comic Sans MS
font echo white    - sets the color of your echoed commands to white
font shadow #720000 1px 0px 10px - gives the font a fancy red glow

font [color/size/family/echo/shadow] default - resets the attribute to default: #d0d0d0 / 14px / Source Code Pro
*/

// For reference, background color is #1c1c1c.

let color
let size
let family
let echo
let shadow

if(args[2] == "default"){
  color = "#d0d0d0";
    size  = "14px";
    family = "Source Code Pro,monospace";
    shadow = "";
    echo = "#d68936";
}
else {
  color = args["*"].replace("color","");
    size  = args["*"].replace("size","");
    family  = args["*"].replace("family","");
    shadow = args["*"].replace("shadow","");
    echo = args["*"].replace("echo","");
}
switch(args[1]){
  case "color":
    $("#mudoutput").css("color", color);
    $("#magicmap").css("color", color); break;
  case "size":
    $("#mudoutput").css("font-size", size); break;
  case "family":
    $("#mudoutput").css("font-family", family); break;
  case "shadow":
    $("#mudoutput").css("text-shadow", shadow); break;
  case "echo":
    $(`<style>.outgoing { color: ${echo}; }</style>`).appendTo('head');
}