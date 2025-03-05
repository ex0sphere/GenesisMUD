/*
AUTHOR: Faery
Contains: 1 alias

Lets you easily install packages with multiple triggers and aliases, as well as create your own packages.

Pattern: package
Execute the following javascript: */

//USAGE: <package create/download>
window.sessionToken = mud.gmcp['core.token'][0] + mud.gmcp['core.token'][1] + mud.gmcp['core.token'][2] + mud.gmcp['core.token'][3] + mud.gmcp['core.token'][4] + mud.gmcp['core.token'][5] + mud.gmcp['core.token'][6] + mud.gmcp['core.token'][7];
let msgColor = "#B3EBF2"; //Edit default message color if you want to
window.foundTriggers = [];
window.foundAliases = [];
if (args[1] !== "create" && args[1] !== "download") gwc.output.append("Syntax is <package create/download>", msgColor);
if (args[1] === "create") createPopup();
if (args[1] === "download") {
    let inputElement = document.createElement("input");
    inputElement.setAttribute("type", "file");
    inputElement.setAttribute("accept", "application/json");
    inputElement.addEventListener("change", handlePackageUpload);
    inputElement.click();
}
 
function createPopup() {
    if (document.getElementById("popup")) document.getElementById("popup").remove();
    const popup = Object.assign(document.createElement("div"), {
        id: "popup",
        style: `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 350px; height: 400px; min-width: 327px; min-height: 150px;
            background: rgba(0,0,0,.85); color: #d0d0d0; border: 1px solid #999; outline: none;
            border-radius: 8px; padding: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 1000; resize: both; overflow: hidden; display: flex; flex-direction: column;`
    });
    popup.innerHTML = `
        <div id="drag-area" style="height: 30px; width: 100%; position: absolute; top: 0; cursor: move;"></div>
        <button id="close-popup" style="position: absolute; top: 15px; right: 15px; background: rgba(255,0,0,0.5); color: #d0d0d0; border: none; cursor: pointer; width: 16px; height: 16px; font-size: 12px; display: flex; align-items: center; justify-content: center;">X</button>
        
        <div id="popup-content" style="flex-grow: 1; display: flex; flex-direction: column; padding-top: 30px;">
            <div style="text-align: center; margin-bottom: 10px;">
                <button id="tab-triggers" class="tab-button" style="background: rgba(255,255,255,0.3);">Triggers</button>
                <button id="tab-aliases" class="tab-button" style="background: rgba(255,255,255,0.1);">Aliases</button>
            </div>
 
            <input type="text" id="search-bar" placeholder="Search..." style="margin-bottom: 10px; padding: 5px; width: calc(100% - 12px); background: rgba(255,255,255,0.1); border: 1px solid #999; outline: none; color: #d0d0d0;">
 
            <div id="tab-content" style="overflow-y: auto; padding-bottom: 50px; max-height: calc(100% - 130px); flex-grow: 1;"></div>
 
            <button id="create-package" style="position: absolute; bottom: 15px; right: 15px; padding: 5px 10px; background: rgba(255,255,255,0.1); border: 1px solid #999; outline: none; color: #d0d0d0;">Create Package</button>
            <button id="popup-selectAll" style="position: absolute; bottom: 15px; left: 15px; padding: 5px 10px; background: rgba(255,255,255,0.1); border: 1px solid #999; outline: none; color: #d0d0d0;">Select All</button>
            <button id="popup-reset" style="position: absolute; bottom: 15px; left: 130px; padding: 5px 10px; background: rgba(255,255,255,0.1); border: 1px solid #999; outline: none; color: #d0d0d0;">Reset</button>
        </div>`;
    document.body.appendChild(popup);
    $("#search-bar").on("input", popupSearch);
 
    function popupSearch() {
        const searchValue = $("#search-bar").val().toLowerCase();
        $("#tab-content label").each(function() {
            $(this).toggle($(this).text().toLowerCase().includes(searchValue));
        });
    }
 
    function activateTab(tabId) {
        $(".tab-button").css("background", "rgba(255,255,255,0.1)");
        $(`#${tabId}`).css("background", "rgba(255,255,255,0.3)");
    }
    let offsetX, offsetY, isDragging = false;
    $("#drag-area").off("mousedown").on("mousedown", function(e) {
        isDragging = true;
        const rect = popup.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });
    $(document)
        .off("mousemove").on("mousemove", function(e) {
            if (isDragging) {
                popup.style.left = `${e.clientX - offsetX}px`;
                popup.style.top = `${e.clientY - offsetY}px`;
                popup.style.transform = "none";
            }
        })
        .off("mouseup").on("mouseup", function() {
            isDragging = false;
        });
    new ResizeObserver(() => {
        $("#tab-content").css("max-height", `${popup.getBoundingClientRect().height - 230}px`);
    }).observe(popup);
 
    function saveCheckedState(listType) {
        window.checkedStates[listType] = $("#tab-content input:checked").map(function() {
            return this.value;
        }).get();
    }
 
    function restoreCheckedState(listType) {
        $("#tab-content input").each(function() {
            this.checked = window.checkedStates[listType].includes(this.value);
        });
    }
 
    function loadPopupChecklist(selector, listType) {
        saveCheckedState(window.activeTab);
        $("#tab-content").html(
            $(selector).find(".list > *").map(function() {
                return `<label style="display: block; color: #d0d0d0;">
                            <input type="checkbox" value="${$(this).text()}" style="margin-right: 8px;">${$(this).text()}
                        </label>`;
            }).get().join("")
        );
        restoreCheckedState(listType);
        window.activeTab = listType;
    }
    $("#tab-triggers").on("click", function() {
        loadPopupChecklist("#triggers", "triggers");
        activateTab("tab-triggers");
        popupSearch();
    });
    $("#tab-aliases").on("click", function() {
        loadPopupChecklist("#aliases", "aliases");
        activateTab("tab-aliases");
        popupSearch();
    });
    $("button")
        .css("cursor", "pointer")
        .hover(
            function() {
                $(this).css("opacity", "0.8");
            },
            function() {
                $(this).css("opacity", "1");
            }
        );
    $(document).off("click", "#popup-selectAll").on("click", "#popup-selectAll", function() {
        $("#tab-content input[type='checkbox']").prop("checked", true);
    });
    $(document).off("click", "#create-package").on("click", "#create-package", function() {
        $("#tab-triggers").click();
        if (window.checkedStates.aliases.length) fetchData("aliases");
        if (window.checkedStates.triggers.length) fetchData("triggers");
        $("#close-popup").click();
    });
    $(document).off("click", "#popup-reset").on("click", "#popup-reset", function() {
        $("#tab-content input[type='checkbox']").prop("checked", false);
    });
    $("#close-popup").on("click", function() {
        popup.remove();
    });
    window.checkedStates = {
        triggers: [],
        aliases: []
    };
    window.activeTab = "triggers";
    loadPopupChecklist("#triggers");
}
 
function fetchData(type) {
    gwc.output.append('Fetching ' + type + '...', msgColor);
    $.ajax({
        type: "GET",
        beforeSend: (request) => {
            request.setRequestHeader("GMCP-Token", window.sessionToken);
        },
        url: `https://www.genesismud.org/player_file/${encodeURIComponent(mud.gmcp['char.login'].name)}/${type}.json`,
        success: (list) => {
            let myList = JSON.parse(list);
            let matchedItems = [];
            let notFoundItems = [];
            if (type === "triggers") {
                matchedItems = window.checkedStates.triggers.filter(trigger => myList.some(item => item.name === trigger));
                notFoundItems = window.checkedStates.triggers.filter(trigger => !myList.some(item => item.name === trigger));
                window.foundTriggers = myList.filter(item => window.checkedStates.triggers.includes(item.name));
                gwc.output.append('Added all specified triggers to the package.', msgColor);
            }
            if (type === "aliases") {
                matchedItems = window.checkedStates.aliases.filter(alias => myList.some(item => item.value === alias));
                notFoundItems = window.checkedStates.aliases.filter(alias => !myList.some(item => item.value === alias));
                window.foundAliases = myList.filter(item => window.checkedStates.aliases.includes(item.value));
                gwc.output.append('Added all specified aliases to the package.', msgColor);
            }
            if (notFoundItems.length) {
                gwc.output.append(`Not found ${type}: ` + notFoundItems.join(", "), "red");
                gwc.output.append('Please try again.', "red");
            }
            checkAndDownloadPackage();
        },
        error: (jqXHR, textStatus, errorThrown) => {
            gwc.output.append(`Error fetching ${type}: ${textStatus} - ${errorThrown}`, "red");
        }
    });
}
 
function checkAndDownloadPackage() {
    if (window.checkedStates.triggers.length && window.foundTriggers.length !== window.checkedStates.triggers.length) return;
    if (window.checkedStates.aliases.length && window.foundAliases.length !== window.checkedStates.aliases.length) return;
    gwc.output.append('Downloading package...', "green");
    let packageData = {
        triggers: window.foundTriggers,
        aliases: window.foundAliases
    };
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(packageData, null, 2));
    let downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "package.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
}
 
function handlePackageUpload(event) {
    let file = event.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        try {
            let packageData = JSON.parse(e.target.result);
            processDownloadedPackage(packageData);
        } catch (error) {
            gwc.output.append("Error reading package file: " + error.message, "red");
        }
    };
    reader.readAsText(file);
    gwc.output.append('Please wait patiently and refrain from interacting with your device until all data has been successfully uploaded.', msgColor);
}
 
function processDownloadedPackage(packageData) {
    gwc.output.append("Triggers unpacked: " + (packageData.triggers.length ? packageData.triggers.map(t => t.name).join(", ") : "None"), msgColor);
    gwc.output.append("Aliases unpacked: " + (packageData.aliases.length ? packageData.aliases.map(a => a.value).join(", ") : "None"), msgColor);
    uploadData(packageData.triggers, "triggers").then(() => {
        uploadData(packageData.aliases, "aliases");
    });
}
async function uploadData(data, type) {
    $("#opensettings").click();
    $(`#${type}`).click();
    data.forEach(async (item) => {
        let foundExisting = false;
        let name = type === "aliases" ? item.value : item.name;
        $(`#${type} .enabled, #${type} .disabled`).each(function() { 
            if ($(this).text() === name) { 
                $(this).click();
                $("button:contains('Edit')").click();
                foundExisting = true;
                return;
            }
        });
        if (!foundExisting) {
            $(`#${type} .addentry`).click();
            if (type === "aliases") $(".data input[type='text']").val(item.value);
            if (type === "triggers") {
                $('.data input.trigger-name').val(item.name);
                if (!$("button .case-sensitive").hasClass('inactive')) $("button .case-sensitive").click();
            }
        }
        await handleData(item, type);
    });
    if (data.length) gwc.output.append(`Package ${type} have all been applied.`, "green");
    $("#closesettings").click();
}
 
async function handleData(data, type) {
    if (type === "triggers") {
        $(".data input.trigger-pattern").val(data.value);
        $(`button[data-type="${data.type}"]`).click();
    }
    $(`button:contains('${data.script.language === 'javascript' ? 'Javascript' : 'Commands'}')`).click();
    let cm = $('.CodeMirror')[0].CodeMirror;
    cm.setValue("")
    cm.getDoc().replaceRange(data.script.data, {
        line: 1,
        ch: 1
    });
    $("button:contains('Save')").click();
    if (!data.enabled) $("button:contains('Disable')").click();
}
