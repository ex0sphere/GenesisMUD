/*
AUTHOR: Faery
Contains: 1 alias

An alias that functions as a gag trigger. Removes empty lines and >s too.

USAGE: <gag true/false/off>. Use the alias when you log in to enable it for the duration of the session.
*/

// Replace with your regex for lines to be gagged
window.regexPattern = /(^Get what\?|^What?\|^Take what\?|^You aren\'t fighting anyone|^Assist whom\?)/;

// Replace with regex for lines that tend to not be results of sent commands that could lead to gagged responses 
// This is only really important if you prefer <gag false> since it allows for better accuracy when cleaning
// commands that result in gagged lines. I recommend adding matches to in-combat messages or end-of-combat combat 
// messages like when ghosts disperse into nothing or draconians turn into puddles. 
window.regexPatternExceptions = /(at death's door|barely alive|terribly hurt|in a very bad shape|in agony|in a bad shape|very hurt|suffering|hurt|aching|somewhat hurt|slightly hurt|sore|feeling well|feeling very well|dead body|You turn to attack|You are ready to perform|You are already preparing|You feel calm again|You aren't fighting anyone!|You have no more targets in this room)/;
window.isProcessingBatch = false;
window.cleanNextPrompt = false;
window.detectedOutgoingGroups = [];
window.detectedLineIndentElements = [];
if (args[1] === undefined) {
    gwc.output.append('Gag has been implemented. Commands preceding gagged text are kept by default.');
    window.keepFloatingCommands = true;
} else if (args[1] === "true" || args[1] === "false") {
    window.keepFloatingCommands = args[1] === "true" ? true : false;
    gwc.output.append(`Gag has been implemented. Keeping Floating Commands is ${window.keepFloatingCommands ? 'enabled' : 'disabled'}.`);
} else if (args[1] === "off") {
    window.outgoingObserver.disconnect();
    window.lineIndentObserver.disconnect();
    gwc.output.append('Gag has been disabled.');
} else {
    gwc.output.append('The syntax is <' + args[0] + ' true/false/off>. True if you want to keep commands of gagged outputs and false if you want to do away with them.');
}
if (window.outgoingObserver) window.outgoingObserver.disconnect();
if (window.lineIndentObserver) window.lineIndentObserver.disconnect();
const targetNode = $("#mudoutput")[0];
window.outgoingObserver = new MutationObserver((mutationsList) => {
    let addedOutgoing = [];
    mutationsList.forEach(mutation => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            $(mutation.addedNodes).each(function() {
                if ($(this).hasClass("outgoing")) {
                    addedOutgoing.push(this);
                    $(this).hide();
                }
            });
        }
    });
    if (addedOutgoing.length > 1 || window.isProcessingBatch) {
        window.isProcessingBatch = true;
        window.detectedOutgoingGroups.push(addedOutgoing);
    } else {
        $(addedOutgoing).show();
    }
});
window.lineIndentObserver = new MutationObserver((mutationsList) => {
    mutationsList.forEach(mutation => {
        if (mutation.type === "childList") {
            $(mutation.addedNodes).each(function() {
                let textContent = $(this).text();
                if (window.regexPatternExceptions.test(textContent)) {
                    return;
                }
                if ($(this).is(".line.hanging-indent") && this.classList.length === 2 && textContent !== "> ") {
                    if (!window.keepFloatingCommands && window.isProcessingBatch) {
                        if ($(window.detectedOutgoingGroups[0][0]).index() < $(this).index()) {
                            window.detectedLineIndentElements.push(this);
                            $(this).hide();
                            window.cleanNextPrompt = true;
                            processBatches();
                        }
                    } else {
                        handleStandaloneDeletion($(this), textContent);
                    }
                    return;
                }
                if (textContent === "> " && window.cleanNextPrompt) {
                    $(this).remove();
                    window.cleanNextPrompt = false;
                }
            });
        }
    });
});
 
function handleStandaloneDeletion(lineElement, textContent) {
    if (!window.regexPattern.test(textContent)) return;
    let previousOutgoingLine = lineElement.prevAll(".line.hanging-indent.outgoing").first();
    if (!window.keepFloatingCommands && previousOutgoingLine.length && lineElement.prevAll(".line.hanging-indent").first().hasClass('outgoing')) {
        previousOutgoingLine.remove();
    }
    window.cleanNextPrompt = true;
    lineElement.remove();
}
 
function processBatches() {
    if (window.detectedOutgoingGroups.length === 0 || window.detectedLineIndentElements.length < window.detectedOutgoingGroups[0].length) {
        return;
    }
    while (window.isProcessingBatch) {
        let currentOutgoingBatch = window.detectedOutgoingGroups.shift();
        for (let i = 0; i < currentOutgoingBatch.length; i++) {
            let lineElement = window.detectedLineIndentElements.shift();
            let textContent = $(lineElement).text();
            let outgoingElement = $(currentOutgoingBatch[i]);
            if (window.regexPattern.test(textContent)) {
                outgoingElement.remove();
                $(lineElement).remove();
            } else {
                $(outgoingElement).show();
                $(lineElement).show();
            }
        }
        if (window.detectedOutgoingGroups.length === 0) {
            window.isProcessingBatch = false;
        }
    }
}
if (args[1] !== "off") {
    if (!window.keepFloatingCommands) {
        window.outgoingObserver.observe(targetNode, {
            childList: true,
            subtree: false
        });
    }
    window.lineIndentObserver.observe(targetNode, {
        childList: true,
        subtree: false
    });
}