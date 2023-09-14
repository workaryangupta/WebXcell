let downloadBtn = document.querySelector(".download");
let uploadBtn = document.querySelector(".upload");

let addSheetBtn = document.querySelector(".icon-add");

let addanyBtn = document.querySelector(".upload-any");

// download task
downloadBtn.addEventListener("click", (e) => {
  let jsonData = JSON.stringify(cellData);
  let file = new Blob([jsonData], { type: "application/json" });

  let a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = "Sheets_DB.json";
  a.click();
});

// upload task
uploadBtn.addEventListener("click", function () {
  // opens file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    let reader = new FileReader();
    let files = input.files;
    let fileObj = files[0];

    reader.readAsText(fileObj);
    reader.addEventListener("load", function () {
      let cellDataStr = reader.result;
      let readCellData = JSON.parse(cellDataStr);

      // load sheet function

      let allSheets = Object.keys(readCellData);
      let sheetTBD_later = allSheets[allSheets.length];
      for (let curr_sheet of allSheets) {
        addSheetBtn.click();
        cellData = readCellData;

        let sheetInfo = cellData[curr_sheet];
        for (let i of Object.keys(sheetInfo)) {
          for (let j of Object.keys(sheetInfo[i])) {
            let cellInfo = cellData[curr_sheet][i][j];

            $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
            $(`#row-${i}-col-${j}`).css(
              "background-color",
              cellInfo["background-color"]
            );
            $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
            $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
            $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);
            $(`#row-${i}-col-${j}`).css(
              "text-decoration",
              cellInfo["text-decoration"]
            );
            $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
            $(`#row-${i}-col-${j}`).css("font-family", cellInfo["font-family"]);
            $(`#row-${i}-col-${j}`).css(
              "font-size",
              parseInt(cellInfo["font-size"])
            );
          }
        }
      }
      // cellData = readCellData;
      console.log(cellData);

      // sab sheets pe ek ek baar click krke data sahi aa jaata hai
      let presentSheets = document.querySelectorAll(".sheet-tab");

      for (let i of presentSheets) {
        if (i.classList.contains("selected") == false) {
          i.click();
        }
      }
      presentSheets[0].click();

      // // remove last sheet from ui
      // presentSheets[presentSheets.length - 1].remove();

      // // remove last sheet from celldata
      // delete  cellData[sheetTBD_later]
    });
  });
});

addanyBtn.addEventListener("click", function () {
  fetch("./static/files/Book.json")
    .then((res) => {
      return res.json();
    })
    .then((fileObj) => {
      let readCellData = fileObj;

      // load sheet function

      let allSheets = Object.keys(readCellData);
      let sheetTBD_later = allSheets[allSheets.length];
      for (let curr_sheet of allSheets) {
        addSheetBtn.click();
        cellData = readCellData;

        let sheetInfo = cellData[curr_sheet];
        for (let i of Object.keys(sheetInfo)) {
          for (let j of Object.keys(sheetInfo[i])) {
            let cellInfo = cellData[curr_sheet][i][j];

            $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
            $(`#row-${i}-col-${j}`).css(
              "background-color",
              cellInfo["background-color"]
            );
            $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
            $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
            $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);
            $(`#row-${i}-col-${j}`).css(
              "text-decoration",
              cellInfo["text-decoration"]
            );
            $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
            $(`#row-${i}-col-${j}`).css("font-family", cellInfo["font-family"]);
            $(`#row-${i}-col-${j}`).css(
              "font-size",
              parseInt(cellInfo["font-size"])
            );
          }
        }
      }
      // cellData = readCellData;
      console.log(cellData);

      // sab sheets pe ek ek baar click krke data sahi aa jaata hai
      let presentSheets = document.querySelectorAll(".sheet-tab");

      for (let i of presentSheets) {
        if (i.classList.contains("selected") == false) {
          i.click();
        }
        presentSheets[0].click();
      }
    });
});
