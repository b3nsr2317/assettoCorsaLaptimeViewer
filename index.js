// get file input as constant, set file to none and add event listener
const file = document.querySelector("#file-upload");
file.value = "";
file.addEventListener("change", (event) => {
    const pattern = /.*\.json/;
    if (pattern.test(file.value)) {
        fileToJson(event);
    } else {
        file.value = "";
    }
});

// get the file and convert it to a json object then update table
const fileToJson = () => {
    const reader = new FileReader();
    reader.onload = function (event) {
        const contents = event.target.result;
        const json = JSON.parse(contents);
        updateTable(json);
    };
    reader.readAsText(file.files[0]);
};

// convert time to minutes and seconds (to 3dp)
const msToMins = (timeInMs) => {
    const timeInS = timeInMs / 1000;
    const minutes = Math.floor(timeInS / 60);
    let seconds = (timeInS % 60).toFixed(3);
    // pad seconds so that a single digit integer part e.g. 9.110 becomes 2 digit integer part e.g. 09.110
    seconds = seconds.toString().padStart(6, "0");
    return minutes + ":" + seconds;
};

const updateTable = (json) => {
    // get and clear table
    const table = document.querySelector("#laptime-table");
    table.innerHTML = "";
    // get all necessary information to display
    const player = json.players[0];
    const session = json.sessions[0];
    const laps = session.laps;
    let bestLap = -1;
    if (laps.length > 0) {
        bestLap = session.bestLaps[0].lap;
    }
    const sectors = laps[0].sectors.length - 1;
    let bestSectors;
    let firstLegalLap = true;
    for (let i = 1; i < laps.length; i++) {
        if (laps[i].cuts > 0) {
            continue;
        }
        if (firstLegalLap) {
            bestSectors = new Array(sectors + 1).fill(i);
            firstLegalLap = false;
        }
        for (let j = 0; j <= sectors; j++) {
            if (laps[i].sectors[j] < laps[bestSectors[j]].sectors[j]) {
                bestSectors[j] = i;
            }
        }
    }
    console.log(bestSectors);
    const car = player.car.replace(/\_/g, " ");
    const track = json.track.replace(/\_/g, " ");
    const name = player.name;
    const eventType = session.name;
    // get session details as h5 html
    const sessionDetails =
        "<h5>Player: " +
        name +
        "</br>Car: " +
        car +
        "</br>Track: " +
        track +
        "</br>Event Type: " +
        eventType +
        "</h5>";
    // display session details
    document.querySelector("#session-details").innerHTML = sessionDetails;
    // get and display title row
    let titleRow =
        "<tr><th style='width: 150px;'>Lap Number</th><th>Lap Time</th>";
    for (let i = 0; i <= sectors; i++) {
        titleRow += "<th>Sector " + (i + 1) + "</th>";
    }
    titleRow += "<th>Cuts</th></tr>";
    table.innerHTML += titleRow;
    for (let i = 0; i < laps.length; i++) {
        if (laps[i].car == 0) {
            const lap = laps[i];
            let row = "<tr class='";
            // check for invalid lap and best lap
            if (lap.time < 0) {
                row += "invalid ";
            }
            row += "'>";
            let totalTime = 0;
            for (let j = 0; j <= sectors; j++) {
                totalTime += lap.sectors[j];
            }
            if (i == bestLap) {
                row += "<td class='best'>" + (i + 1) + "</td>";
                row += "<td class='best'>" + msToMins(totalTime) + "</td>";
            } else {
                row += "<td>" + (i + 1) + "</td>";
                row += "<td>" + msToMins(totalTime) + "</td>";
            }
            for (let j = 0; j <= sectors; j++) {
                if (bestSectors[j] == i) {
                    row +=
                        "<td class='best'>" +
                        msToMins(lap.sectors[j]) +
                        "</td>";
                } else {
                    row += "<td>" + msToMins(lap.sectors[j]) + "</td>";
                }
            }
            row += "<td>" + lap.cuts + "</td>";
            table.innerHTML += row;
        } else {
            break;
        }
    }
};
