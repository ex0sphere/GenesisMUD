/*
AUTHOR: Faery
Contains: 1 alias

Adds a search bar for triggers and aliases. Check "internal search" to search their contents too.

Execute the following javascript:
*/
 

let checkBgColor = '#AA336A'; //Edit as you like 
let labelFont = 'Source Code Pro, sans-serif';
$("a[href='#general'], #searchbar-input, .searchbar, .check-container, .search-check-container, #dynamic-styles").remove();
$("a[href='#triggers']").css({"border-left": "1px solid #999"});
window.sessionToken = mud.gmcp['core.token'][0] + mud.gmcp['core.token'][1] + mud.gmcp['core.token'][2] + mud.gmcp['core.token'][3] + mud.gmcp['core.token'][4] + mud.gmcp['core.token'][5] + mud.gmcp['core.token'][6] + mud.gmcp['core.token'][7];
window.triggerList = [];
window.aliasList = [];
$(".tabs .content").css("position", "absolute");
$("#aliases").after(`
 <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
 <div class="search-check-container">
     <form class="searchbar">
         <input id="searchbar-input" class="searchinput" type="search" placeholder="Search triggers and aliases" required>
         <span class="material-symbols-outlined searchbar-icon">search</span>
     </form>
     <div class="check-container">
         <label for="check-input" class="check-label">Internal Search</label>
         <div class="check-wrapper">
             <input id="check-input" type="checkbox" class="check-option-input checkbox">
             <span id="check-icon" class="material-symbols-outlined check">done</span>
         </div>
     </div>
 </div>
 `);
const styles = `
 .search-check-container {
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     position: absolute;
     left: 50%;
     transform: translateX(-50%);
     top: -13%;
 }
 
 .searchbar {
     width: 50px;
     height: 40px;
     background: black;
     border-radius: 25px;
     border: 4px solid black;
     padding: 5px;
     transition: all 1s;
     position: relative;
 }
 
 .searchinput {
     width: 100%;
     height: 42.5px;
     line-height: 30px;
     outline: 0;
     border: 0;
     display: none;
     font-size: 1em;
     border-radius: 20px;
     padding: 0 20px;
 }
 
 .material-symbols-outlined.searchbar-icon {
     padding: 10px;
     position: absolute;
     top: 50%;
     right: 10px;
     transform: translateY(-50%);
     border-radius: 50%;
     color: white;
     font-size: 1.2em;
     transition: all 1s;
 }
 
 .searchbar:hover,
 .searchbar:focus-within {
     width: 325px;
     cursor: pointer;
 }
 
 .searchbar:hover input,
 .searchbar:focus-within input {
     display: block;
 }
 
 .searchbar:hover .searchbar-icon,
 .searchbar:focus-within .searchbar-icon {
     display: none;
 }
 
 .searchbar.loading .searchbar-icon {
     animation: searchLoading 1s infinite alternate;
     display: block;
 }
 
 @keyframes searchLoading {
     0% {
         transform: translate(0, -50%) rotate(0deg);
     }
 
     100% {
         transform: translate(0, -50%) rotate(360deg);
     }
 }
 
 .searchbar.loading {
     pointer-events: none;
 }
 
 .check-container {
     display: grid;
     grid-template-columns: auto auto;
     align-items: center;
     gap: 10px;
 }
 
 .check-wrapper {
     position: relative;
     display: flex;
     align-items: center;
     justify-content: center;
 }
 
 .check-option-input {
     appearance: none;
     height: 30px;
     width: 30px;
     transition: all 0.15s ease-out;
     background: #cbd1d8;
     cursor: pointer;
     position: relative;
 }
 
 .check-option-input:hover {
     background: #9faab7;
 }
 
 .check-option-input:checked {
     background: ${checkBgColor};
 }
 
 .material-symbols-outlined.check {
     font-weight: bold;
     color: white;
     position: absolute;
     pointer-events: none;
     display: none;
 }
 
 .check-label {
     font-family: ${labelFont};
     pointer-events: none;
 }`;
const styleSheet = document.createElement("style");
styleSheet.id = "dynamic-styles";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
function pullAjax() {
    $("#searchbar-input").prop("disabled", true);
    $(".searchbar").addClass("loading");
    $(".searchbar-icon").text("hourglass_empty");
    let completedRequests = 0;
    $.ajax({
        type: "GET",
        beforeSend: (request) => {
            request.setRequestHeader("GMCP-Token", window.sessionToken);
        },
        url: `https://www.genesismud.org/player_file/${encodeURIComponent(mud.gmcp['char.login'].name)}/triggers.json`,
        success: (list) => {
            window.triggerList = JSON.parse(list);
            completedRequests++;
            checkRequestsCompleted();
        }
    });
    $.ajax({
        type: "GET",
        beforeSend: (request) => {
            request.setRequestHeader("GMCP-Token", window.sessionToken);
        },
        url: `https://www.genesismud.org/player_file/${encodeURIComponent(mud.gmcp['char.login'].name)}/aliases.json`,
        success: (list) => {
            window.aliasList = JSON.parse(list);
            completedRequests++;
            checkRequestsCompleted();
        }
    })
 
    function checkRequestsCompleted() {
        if (completedRequests === 2) {
            $("#searchbar-input").prop("disabled", false);
            $(".searchbar").removeClass("loading");
            $(".searchbar-icon").text("search");
            searchItems();
        }
    }
}
function searchItems() {
    const input = document.getElementById("searchbar-input").value;
    if (document.getElementById("check-input").checked) {
        $("#triggers .enabled, #triggers .disabled, #aliases .enabled, #aliases .disabled").show();
        getNonMatches(window.triggerList, input).then(nonMatches => {
            nonMatches.forEach((item) => {
                $("#triggers .enabled, #triggers .disabled").filter(function() {
                    return $(this).text() === item;
                }).hide();
            });
        });
        getNonMatches(window.aliasList, input).then(nonMatches => {
            nonMatches.forEach((item) => {
                $("#aliases .enabled, #aliases .disabled").filter(function() {
                    return $(this).text() === item;
                }).hide();
            });
        });
    } else {
        $(".enabled, .disabled").each(function() {
            $(this).toggle($(this).text().toLowerCase().includes(input));
        });
    }
}
async function getNonMatches(array, searchString) {
    let nonMatches = [];
    array.forEach(item => {
        let valueMatch = item.value && item.value.includes(searchString);
        let dataMatch = item.script && item.script.data && item.script.data.includes(searchString);
        let nameMatch;
        if (item.name) {
            nameMatch = item.name.includes(searchString);
        } else {
            let nameMatch = false;
        }
        if (!valueMatch && !dataMatch && !nameMatch) {
            if (item.name) {
                nonMatches.push(item.name);
            } else {
                nonMatches.push(item.value);
            }
        }
    });
    return nonMatches;
}
document.getElementById("check-input").addEventListener("change", function() {
    const checkIcon = document.getElementById("check-icon");
    checkIcon.style.display = this.checked ? "block" : "none";
    if (this.checked) pullAjax();
    searchItems();
});
$("#searchbar-input").on("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
    }
});
$("#opensettings").click(() => {searchItems();});
document.getElementById("searchbar-input").addEventListener("input", searchItems);