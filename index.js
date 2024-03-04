const file = document.querySelector("#file-upload");
file.addEventListener("change", () => {
    const pattern = /.*\.json/;
    if (pattern.test(file.value)) {
        console.log("file ok");
    } else {
        file.value = "";
    }
});
