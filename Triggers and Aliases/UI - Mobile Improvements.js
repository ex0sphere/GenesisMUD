/*
AUTHOR: Faery
Contains: 1 alias

Includes the following features:
- Swipe movement;
- Toggleable magic map;
- Toggleable comms window with alerts for new messages;
- Customization options!

Use this alias once when you log in to activate the UI features.

Pattern: mobile
Execute the following javascript:
*/


const userSettings = {
    defaultZoom: '1.5',
    mapWidth: '345',
    mapHeight: '192',
    positionColor: '#ff00ff',
    chatTextSize: '14',
    chatLength: '150',
    mobileNavLeft: '5',
    mobileNavTop: '40',
};

// Save the alias used to initialize mobile popups
window.mobilePopupAlias = args[0].split(" ")[0];

// Assign all settings to window variables
Object.keys(userSettings).forEach(key => {
    window[key] = userSettings[key];
});

function loadScript(url, callback) {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
}

const mobilePops = "https://cdn.jsdelivr.net/gh/FaeFaery/Genesis-MUD-Mobile-UI@latest/applyPopupSidebar.js?min=0";
const mobileSwipes = "https://cdn.jsdelivr.net/gh/FaeFaery/Genesis-MUD-Mobile-UI@latest/applymobileswipe.js?min=0";
const improvedUI = "https://cdn.jsdelivr.net/gh/FaeFaery/Genesis-MUD-Mobile-UI@latest/improvedUI.js?min=0";

if ($('#mobileNav-wrapper').length == 0) {
    loadScript(mobilePops, () => {
        gwc.output.append("Mobile Popups are being loaded...");
    });

    loadScript(mobileSwipes, () => {
        gwc.output.append("Mobile Swipe Gestures are being loaded...");
    });

    loadScript(improvedUI, () => {
        gwc.output.append("Improved UI has been applied!", "lime");
    });
} else {
    gwc.output.append("Mobile UI support has already been loaded. If you want to reload, refresh the page.");
}