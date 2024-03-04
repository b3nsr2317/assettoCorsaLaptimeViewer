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
    // get all necessary information to display
    const player = json.players[0];
    const session = json.sessions[0];
    const laps = session.laps;
    const bestLap = session.bestLaps[0].lap;
    const car = player.car.replace(/\_/g, " ");
    const name = player.name;
    const eventType = session.name;
    const sessionDetails =
        "<h5>Player: " +
        name +
        " - Car: " +
        car +
        " - Event: " +
        eventType +
        "</h5>";
    document.querySelector("#session-details").innerHTML = sessionDetails;
};
