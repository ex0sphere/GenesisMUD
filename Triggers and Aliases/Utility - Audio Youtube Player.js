/*
AUTHOR: Faery
Contains: 1 alias

Plays audio from youtube links. Works on unlisted videos too.

USAGE:
youtube play <link> - play audio from link
youtube stop - stop playing the audio

Pattern: youtube
Execute the following javascript:
*/

switch (args[1]) {
    case 'play':
        // Check for URL
        if (!args[2]) {
            gwc.output.append('Please provide a YouTube video URL');
            return;
        }

        // Extract video ID
        const videoId = extractYouTubeId(args[2]);
        if (!videoId) {
            gwc.output.append('Invalid YouTube URL');
            return;
        }

        // Check if YouTube API is loaded, if not then shove it into the webclient
        if (typeof YT === 'undefined') {
            window.currentYouTubePlayer = null;
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.onload = () => {
                window.onYouTubeIframeAPIReady = () => {
                    initYouTubePlayer(videoId);
                };
            };
            document.head.appendChild(script);
        } else {
            // If API is already loaded, play immediately
            initYouTubePlayer(videoId);
        }
        break;
    
    case 'stop':
        if (window.currentYouTubePlayer) {
            cleanupPlayer();
        }
        break;
    
    default:
        gwc.output.append('USAGE: <youtube play (YT video link)> or <youtube stop>');
}

function initYouTubePlayer(videoId) {
    // Prevent playing if audio is already playing
    if (window.currentYouTubePlayer) {
        return;
    }

    // Make sure YouTube API is loaded
    if (typeof YT === 'undefined' || !YT.Player) {
        gwc.output.append('YouTube API not loaded, try playing again in a moment.');
        return;
    }

    // Remove existing player if there already is one
    const existingContainer = document.getElementById('youtube-audio-player');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Create new player container
    const container = document.createElement('div');
    container.id = 'youtube-audio-player';
    container.style.display = 'none';
    document.body.appendChild(container);

    // Create player
    try {
        window.currentYouTubePlayer = new YT.Player(container, {
            width: '0',
            height: '0',
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                disablekb: 1,
            },
            events: {
                'onReady': (event) => {
                    event.target.playVideo();
                },
                'onStateChange': (event) => {
                    // When the audio ends, clear the current player
                    if (event.data === YT.PlayerState.ENDED) {
                        cleanupPlayer();
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating YouTube player:', error);
        cleanupPlayer();
    }
}

// Cleanup function to remove player
function cleanupPlayer() {
    if (window.currentYouTubePlayer) {
        try {
            window.currentYouTubePlayer.stopVideo();
            window.currentYouTubePlayer.destroy();
        } catch (error) {
            console.error('Error destroying player: ', error);
        }
        window.currentYouTubePlayer = null;
    }
    
    const container = document.getElementById('youtube-audio-player');
    if (container) {
        container.remove();
    }
}

// Utility function to extract YouTube video ID
function extractYouTubeId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}