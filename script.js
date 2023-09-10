// Note for jquery:
//   .style(in js) => .css(in jquery)
//   .innerHTMl(in js) => .text()


// for i of something (for objects)
// for i in something (for iterables-arrayas, etc)

let defaultProperties = {
  text: "",
  "font-weight": "",
  "font-style": "",
  "text-decoration": "",
  "text-align": "left",
  "background-color": '#ffffff',
  "color": "#000000",
  "font-family": "arial",
  "font-size": "16"
}

let cellData = {    // this obj will store data of changed cells
  "Sheet1": {}
}

let selectedSheet = "Sheet1"
let totalSheets = 1;
let lastly_added_sheet = 1;

$(document).ready(function () {

  // logic for naming rows and cols
  for (let i = 1; i <= 100; i++) {
    let n = i;
    let ans = "";

    while (n > 0) {
      let rem = n % 26;

      if (rem == 0) {
        // Z wala case
        ans = "Z" + ans;
        n = Math.floor(n / 26) - 1;
      } else {
        ans = String.fromCharCode(rem - 1 + 65) + ans;
        n = Math.floor(n / 26);
      }
    }

    let column = $(
      `<div class="column-name colId-${i}" id="colCod-${ans}">${ans}</div>`
    );
    $(".column-name-container").append(column);

    let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
    $(".row-name-container").append(row);
  }

  // logic for appending cells
  for (let i = 1; i <= 100; i++) {
    let row = $(`<div class="cell-row"></div>`);

    for (let j = 1; j <= 100; j++) {
      let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
      let column = $(
        `<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="code-${colCode}" > </div>`
      );
      row.append(column);
    }
    $(".input-cell-container").append(row);
  }

  // align waale icons ke liye select wala logic                
  $(".align-icon").click(function () {
    $(".align-icon.selected").removeClass("selected")
    $(this).addClass("selected")
  });

  // text style ke icons ke liye select wala logic              
  $(".style-icon").click(function () {
    $(this).toggleClass("selected");
  });

  // logic for selecting cells , single click
  $(".input-cell").click(function (e) {
    // console.log(e);
    if (e.metaKey || e.ctrlKey || e.keyCode == 91 || e.keyCode == 224) {          // multiple cell select
      let [rowId, colId] = getRowCol(this);
      // top
      if (rowId > 1) {
        let isTopCellSelected = $(`#row-${rowId-1}-col-${colId}`).hasClass("selected");
        if (isTopCellSelected) {
          $(this).addClass("top-cell-selected");
          $(`#row-${rowId-1}-col-${colId}`).addClass("bottom-cell-selected")
        }
      }

      // bottom
      if (rowId < 100) {
        let isBottomCellSelected = $(`#row-${rowId+1}-col-${colId}`).hasClass("selected");
        if (isBottomCellSelected) {
          $(this).addClass("bottom-cell-selected");
          $(`#row-${rowId+1}-col-${colId}`).addClass("top-cell-selected")
        }
      }

      // left
      if (colId > 1) {
        let isLeftCellSelected = $(`#row-${rowId}-col-${colId-1}`).hasClass("selected");
        if (isLeftCellSelected) {
          $(this).addClass("left-cell-selected");
          $(`#row-${rowId}-col-${colId-1}`).addClass("right-cell-selected")
        }
      }

      // right
      if (colId < 100) {
        let isRightCellSelected = $(`#row-${rowId}-col-${colId+1}`).hasClass("selected");
        if (isRightCellSelected) {
          $(this).addClass("right-cell-selected");
          $(`#row-${rowId}-col-${colId+1}`).addClass("left-cell-selected")
        }
      }
      
    } else {                  // single cell select
      $(".input-cell.selected").removeClass("selected");
      $(".input-cell.top-cell-selected").removeClass("top-cell-selected");
      $(".input-cell.left-cell-selected").removeClass("left-cell-selected");
      $(".input-cell.right-cell-selected").removeClass("right-cell-selected");
      $(".input-cell.bottom-cell-selected").removeClass("bottom-cell-selected");

      let [rowId, colId] = getRowCol(this);
      let colCode = getColCode(this);
      $(".formula-editor.selected-cell").text(colCode + " " + rowId);

    }
    $(this).addClass("selected");
    changeHeader(this);
  });

  // function for two way binding
  function changeHeader(ele) {
    let [rowId, colId] = getRowCol(ele);

    let cellInfo = defaultProperties      // if doesnt exist, obv equal to def prop
    if (cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]){  // both r,c exist
      cellInfo = cellData[selectedSheet][rowId][colId]
    }
    
    // font styles
    cellInfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected")
    cellInfo["font-style"] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected")
    cellInfo["text-decoration"] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected")
    // text align
    let alignment = cellInfo["text-align"]
    $(".align-icon.selected").removeClass("selected")
    $(".icon-align-" + alignment).addClass("selected")
    // color picker
    $(".background-color-picker").val(cellInfo["background-color"])
    $(".text-color-picker").val(cellInfo["color"])
    // font family and font size
    $(".font-family-selector").val(cellInfo["font-family"])
    $(".font-family-selector").css("font-family", cellInfo["font-family"])
    $(".font-size-selector").val(cellInfo["font-size"])

  }

  // logic for writing in cells , double click
  $(".input-cell").dblclick(function () {
    $(".input-cell.selected").removeClass("selected");
    $(this).addClass("selected");
    $(this).attr("contentEditable", "true");
    $(this).focus();
  });
  // makes non selected cells not content-editable and also adds tex to ram storage
  $(".input-cell").blur(function(){
    $(".input-cell.selected").attr("contentEditable", "false");
    updateCell("text", $(this).text())
  })
  
  // scroll rows and cols 
  $(".input-cell-container").scroll(function(){
    $(".column-name-container").scrollLeft(this.scrollLeft);  // scrollLeft for x axis scroll
    $(".row-name-container").scrollTop(this.scrollTop);     // scrollLeft for x axis scroll
    // $(".sheet-bar").scrollLeft(this.scrollLeft);
  })

  // a function to get row and col of an input cell
  function getRowCol(ele) {
    let idArr = $(ele).attr("id").split("-");
    let rowId = parseInt(idArr[1]);
    let colId = parseInt(idArr[3]);

    return [rowId, colId];
  }
  // function to get column code
  function getColCode(ele) {
    let colCode = $(ele).attr("data").split("-")[1];
    return colCode;
  }

// code for updating the cell
  function updateCell(property, value, defaultPossible) { 
    $(".input-cell.selected").each(function(){
    // update in UI
      $(this).css(property, value);
      
    // update in cell Data  (storing the data in ram) (storing system)
      let [rowId, colId] = getRowCol(this);
      if (cellData[selectedSheet][rowId]) {       // checks if row exist

        if (cellData[selectedSheet][rowId][colId]) {  // checks if col exist
          // if exists, we will update it
          cellData[selectedSheet][rowId][colId][property] = value;
        } else {      // if doesnot exist, we will create cell object then update prop.
          cellData[selectedSheet][rowId][colId] = {...defaultProperties}
          cellData[selectedSheet][rowId][colId][property] = value;
        }
      
      } else {  // agar row hi exist nahi krti, def col doesnot exist
        cellData[selectedSheet][rowId] = {}               // create row
        cellData[selectedSheet][rowId][colId] = {...defaultProperties}   // create col
        cellData[selectedSheet][rowId][colId][property] = value;    // update prop 
      }

      // now if updated cell data == defeault properties, we will delete this cell
      if (defaultPossible && JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultProperties)) {
        // delete col
        delete cellData[selectedSheet][rowId][colId]
        // now if row khaali ho jaye, delete row also
        if (Object.keys(cellData[selectedSheet][rowId]).length == 0) {   // row is obj so we cant use length property directly like an array, we have to use object.keys method
          delete cellData[selectedSheet][rowId]
        }
      }
      
    })  
    console.log(cellData); 
  }
  // BOLD
  $(".icon-bold").click(function(){
    if ($(this).hasClass("selected")){
      updateCell("font-weight", "bold", false);    // make it bold
    } else {
      updateCell("font-weight", "", true);        // make it unbold 
    }
  })
  // ITALIC
  $(".icon-italic").click(function(){
    if ($(this).hasClass("selected")){
      updateCell("font-style", "italic", false);
    } else {
      updateCell("font-style", "normal", true);
    }
  })
  // UNDERLINE
  $(".icon-underline").click(function(){
    if ($(this).hasClass("selected")){
      updateCell("text-decoration", "underline", false);
    } else {
      updateCell("text-decoration", "", true);
    }
  })

  // text-align left
  $(".icon-align-left").click(function(){
    if ($(this).hasClass("selected")){
      updateCell("text-align", "left", true);
    }
  })

  // text-align center
  $(".icon-align-center").click(function(){
    if ($(this).hasClass("selected")){
      updateCell("text-align", "center", false);
    }
  })

  // text-align right
  $(".icon-align-right").click(function(){
    if ($(this).hasClass("selected")){
      updateCell("text-align", "right", false);
    }
  })

  // font family
  $(".font-family-selector").change(function(){
    updateCell("font-family", this.value, true);
    $(".font-family-selector").css("font-family", this.value)

  })

  // font size
  $(".font-size-selector").change(function(){
    updateCell("font-size", parseInt(this.value), true);
  })

// work for bg color and text color
  $(".color-fill-icon").click(function(){
    $(".background-color-picker").click()
  })

  $(".color-fill-text").click(function(){
    $(".text-color-picker").click()
  })

  // bg color change
  $(".background-color-picker").change(function(){
    updateCell("background-color", $(this).val())
  })

  // text color change
  $(".text-color-picker").change(function(){
    updateCell("color", $(this).val())
  })


  // empties sheet from ui and not from our data
  function emptySheet() {     
    let sheetInfo = cellData[selectedSheet];
    for (let i of Object.keys(sheetInfo)) {
      for (let j of Object.keys(sheetInfo[i])) {
        $(`#row-${i}-col-${j}`).text("");
        $(`#row-${i}-col-${j}`).css("background-color", "#ffffff");
        $(`#row-${i}-col-${j}`).css("color", "#000000");
        $(`#row-${i}-col-${j}`).css("font-weight", "");
        $(`#row-${i}-col-${j}`).css("font-style", "");
        $(`#row-${i}-col-${j}`).css("text-decoration", "");
        $(`#row-${i}-col-${j}`).css("text-align", "left");
        $(`#row-${i}-col-${j}`).css("font-family", "Arial");
        $(`#row-${i}-col-${j}`).css("font-size", 16);
      }
    }
  }
  // loads sheet data from ram to ui (data is still there in ram as we didnt del it in the above emplt funciton)
  function loadSheet() {     
    let sheetInfo = cellData[selectedSheet];
    for (let i of Object.keys(sheetInfo)) {
      for (let j of Object.keys(sheetInfo[i])) {
        let cellInfo = cellData[selectedSheet][i][j];

        $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
        $(`#row-${i}-col-${j}`).css("background-color", cellInfo["background-color"]);
        $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
        $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
        $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);
        $(`#row-${i}-col-${j}`).css("text-decoration", cellInfo["text-decoration"]);
        $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
        $(`#row-${i}-col-${j}`).css("font-family",cellInfo["font-family"]);
        $(`#row-${i}-col-${j}`).css("font-size", parseInt(cellInfo["font-size"]));

      }
    }
  }

// add new sheet by clicking (+) icon and make it new selected sheet
  $(".icon-add").click(function(){
    emptySheet();
  // add to ram
    let sheetName = "Sheet" + (lastly_added_sheet+1);
    cellData[sheetName] = {};
    totalSheets += 1;
    lastly_added_sheet += 1;
    selectedSheet = sheetName;

  // add to ui
    $(".sheet-tab.selected").removeClass("selected")
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">${sheetName}</div>`);

  //  nayi sheet add hone pe uspe event listener lagaya
    addSheetEvents();
  })

// logic for sheet event -> 1. Click to select sheet. 2. Rightclick contextmenu
  function addSheetEvents() {
    // click
    $(".sheet-tab").click(function() {
      if (!$(this).hasClass("selected")) {
        selectSheet(this);
      }
    })

    // contextmenu
    $(".sheet-tab.selected").contextmenu(function(e) {
      e.preventDefault();
      // ============================================================================
      selectSheet(this)

      // $(".sheet-tab.selected").removeClass("selected")
      // $(this).addClass("selected")
      // selectedSheet = $(this).text();

      // ===========================================================================
      
      // display our self created sheets modal when right click
      $(".sheet-options-modal").css("display", "inline");
      $(".sheet-options-modal").css("left", e.pageX + "px");

      // sheet contextmenu pe rename dabaane pe -> rename wala modal show
      $(".sheet-rename").click(function(){
        $(".sheet-rename-modal").css("display", "inline");


        // Cancel dabaane pe remove modal
        $(".cancel-button").click(function() {
          $(".sheet-rename-modal").css("display", "none");
        })

        // Rename dabaane pe rename sheet in 1.UI and 2.cellData
        $(".submit-button").click(function(){
          // change in ui
          let newSheetName = $(".new-sheet-name").val();
          $(".sheet-tab.selected").text(newSheetName);

          // change in ram
          let newCellData = {}
          for (let key in cellData) {
            if (key != selectedSheet) {
              newCellData[key] = cellData[key]
            } else {
              newCellData[newSheetName] = cellData[key]
            }
          }
          cellData = newCellData
          selectedSheet = newSheetName
          $(".sheet-rename-modal").css("display", "none"); 
          console.log(cellData);
        })
      })
      
      // sheet contextmenu pe DELETE dabaane pe -> DELETE SHEET DIRECTLY
      $(".sheet-delete").click(function(){
        // CONDITIONS : 1. no of sheets > 1; 2. After deletion, make prev sheet = selectedSheet, and if prev sheet doesnot exist, make next sheet = selectedSheet
        if (Object.keys(cellData).length > 1) {
          let currSheetName = selectedSheet
          let currSheet = $(".sheet-tab.selected")
          let curr_sheet_idx = Object.keys(cellData).indexOf(selectedSheet);
 
          // slect next/prev sheet
          if (curr_sheet_idx == 0) {
            selectSheet(currSheet.next())
          } else {
            selectSheet(currSheet.prev())
          }
          // remove from cell data
          delete cellData[currSheetName]

          // remove from ui
          currSheet.remove()

          console.log(cellData)
          console.log(selectedSheet)


        } else {
          alert("Sorry! Can not delete the only sheet left!!");
        }
      })
    })
  }
  // to remove modals when clicking somewhere else
  $(".container").click(function() {
    $(".sheet-options-modal").css("display", "none");
    // $(".sheet-rename-modal").css("display", "none");

  })

  // for first sheet
  addSheetEvents();

  function selectSheet(ele) {
    $(".sheet-tab.selected").removeClass("selected");
    $(ele).addClass("selected")
    emptySheet();

    selectedSheet = $(ele).text();
    loadSheet();
  }

  // COPY, PASTE, CUT
  let selectedCells = []
  let cut = false

  $(".icon-copy").click(function() {
    $(".input-cell.selected").each(function(){
      selectedCells.push(getRowCol(this));
    })
    console.log(selectedCells)
  })

  $(".icon-cut").click(function(){
    $(".input-cell.selected").each(function(){
      selectedCells.push(getRowCol(this));
    })
    cut = true;

  })

  $(".icon-paste").click(function(){
    emptySheet();

    let [rowId, colId] = getRowCol($(".input-cell.selected")[0]);
    let rowDistance = rowId - selectedCells[0][0];
    let colDistance = colId - selectedCells[0][1];
    
    for (let cell of selectedCells) {
      let newRowId = cell[0] + rowDistance;
      let newColId = cell[1] + colDistance;
      if (!cellData[selectedSheet][newRowId]){
        cellData[selectedSheet][newRowId] = {};
      } 
      cellData[selectedSheet][newRowId][newColId] = {...cellData[selectedSheet][cell[0]][cell[1]]};
      if (cut) {
        delete cellData[selectedSheet][cell[0]][cell[1]];
        if (Object.keys(cellData[selectedSheet][cell[0]]).length == 0){
          delete cellData[selectedSheet][cell[0]] 
        }

      }
    }

    if (cut) {
      cut = false;
      selectedCells = []
    }
    loadSheet();
  })

});
