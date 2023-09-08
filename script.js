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

  // align waale icons ke liye select wala logic                purana logic
  $(".align-icon").click(function () {
    let aicons = this.parentNode.querySelectorAll("[selected='true']");
    for (let i = 0; i < aicons.length; i++) {
      aicons[i].setAttribute("selected", false);
    }

    this.setAttribute("selected", true);
  });

  // text style ke icons ke liye select wala logic              implemented w new logic
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

      $(this).addClass("selected");

    } else {                  // single cell select
      $(".input-cell.selected").removeClass("selected");
      $(".input-cell.top-cell-selected").removeClass("top-cell-selected");
      $(".input-cell.left-cell-selected").removeClass("left-cell-selected");
      $(".input-cell.right-cell-selected").removeClass("right-cell-selected");
      $(".input-cell.bottom-cell-selected").removeClass("bottom-cell-selected");


      $(this).addClass("selected");
    }
  });

  // logic for writing in cells , double click
  $(".input-cell").dblclick(function () {
    $(".input-cell.selected").removeClass("selected");
    $(this).addClass("selected");
    $(this).attr("contentEditable", "true");
    $(this).focus();
  });

  $(".input-cell").blur(function(){
    $(".input-cell.selected").attr("contentEditable", "false");
  })
  
  // scroll rows and cols 
  $(".input-cell-container").scroll(function(){
    $(".column-name-container").scrollLeft(this.scrollLeft);  // scrollLeft for x axis scroll
    $(".row-name-container").scrollTop(this.scrollTop);     // scrollLeft for x axis scroll
  })


  function getRowCol(ele) {
    let idArr = $(ele).attr("id").split("-");
    let rowId = parseInt(idArr[1]);
    let colId = parseInt(idArr[3]);

    return [rowId, colId];
  }
// code for bold, italic and underline
  function updateCell(property, value) {
    $(".input-cell.selected").each(function(){
      $(this).css(property, value);
    })
  }
  // BOLD
  $(".icon-bold").click(function(){
    if ($(this).hasClass("selected")){
      updateCell("font-weight", "bold");
    } else {
      updateCell("font-weight", "");
    }
  })
  // ITALIC
  $(".icon-italic").click(function(){
    if ($(this).hasClass("selected")){
      updateCell("font-style", "italic");
    } else {
      updateCell("font-style", "normal");
    }
  })
  // UNDERLINE
  $(".icon-underline").click(function(){
    if ($(this).hasClass("selected")){
      updateCell("text-decoration", "underline");
    } else {
      updateCell("text-decoration", "");
    }
  })

});
