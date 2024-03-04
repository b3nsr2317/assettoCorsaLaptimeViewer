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

const fileToJson = () => {
    const reader = new FileReader();
    reader.onload = function (event) {
        const contents = event.target.result;
        const json = JSON.parse(contents);
        updateTable(json);
    };
    reader.readAsText(file.files[0]);
};

const updateTable = (json) => {
    // get and clear table
    const table = document.querySelector("#laptime-table");
    table.innerHTML = "";
    // get all necessary information to display
    const player = json.players[0];
    const session = json.sessions[0];
    const laps = session.laps;
    const bestLap = session.bestLaps[0].lap;
    const sectors = laps[0].sectors.length - 1;
    const car = player.car.replace(/\_/g, " ");
    const name = player.name;
    const eventType = session.name;
    // get session details as h5 html
    const sessionDetails =
        "<h5>Player: " +
        name +
        " - Car: " +
        car +
        " - Event: " +
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
};
