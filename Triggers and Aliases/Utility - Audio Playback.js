/* AUTHOR: Exosphere  
(Original author unknown; thank you Felurian and Emperor for sharing the code)

This code plays the audio file from a URL. Usable in both aliases and triggers.

Execute the following javascript:
*/

function playAndGetDuration(src) {
    return new Promise(function(resolve) {
        var audio = new Audio();
        $(audio).on("loadedmetadata", function(){
            resolve(audio.duration);
        });
        audio.src = src;
        audio.volume = 0.5 // Adjust volume here, 1 is max
		audio.play()
    });
}
// Put your own audio link below, it has to link directly to an audio file.
const audioLink = 'https://www.myinstants.com/media/sounds/vine-boom.mp3'

// Makes sure the audio isn't already playing
if(gwc.userdata.isAudioPlaying != true){
  
playAndGetDuration(audioLink)
.then(function(length) {
    gwc.userdata.isAudioPlaying = true;
    setTimeout(() => {
      gwc.userdata.isAudioPlaying = false
    },length * 1000
               )
});
}