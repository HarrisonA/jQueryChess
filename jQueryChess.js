console.log("reading");

$(document).ready(function(){

  // $('.row4 .col5').text("found");
  // if($('.row6 .col5 span').hasClass("pawn")){
  //  // console.log("pawn found moving it...");
  //  var pawn = $('.row6 .col5 span')
  //  // console.log(pawn);
  //  $('.row6 .col5').empty();
  //  $('.row4 .col5').append(pawn)
  // }

  // Used to prevent the first click handler from firing off when the
  // nested one fires
  var pieceSelected = false;

  // the space on the board that contains the piece that the user wants to move
  var $selectedSpace = "";

  var $destinationSpace = "";
  var pieceToMove = "";

  var firstMoveCheck = function(){
    if(pieceToMove.data("fm") === true){
      return true;
    }
    return false;
  }

  var legalMoveFoundNowMovePiece = function (){
    console.log("legal move");
    $destinationSpace.empty();
    $destinationSpace.append(pieceToMove);
    $selectedSpace.empty();
  };

  var knightLogic = function (){
    console.log("Executing the Knight logic")
  };

  var pawnLogic = function(pFromRow, pFromCol, pToRow, pToCol, pieceToTake){

    var firstMove = firstMoveCheck();

    // check for (illegal) backward movement
    if ( pFromRow - pToRow <= 0) {
      console.log("illegal move. Must move forward");
      return;
    }

    // diagnoal capture attempt
    // check for illegal diag capture
    if ( (Math.abs(pFromCol - pToCol) > 1) ) {
      console.log("illegal diagonal move");
      return;
    }

    if ( (Math.abs(pFromCol - pToCol) === 1) &&
       (pFromRow - pToRow === 1) && (pieceToTake !== "empty") ) {

      console.log("the piece in the destination space is: ", pieceToTake);
      legalMoveFoundNowMovePiece();
      return;

    }

    // // for info purposes, delete later
    // if ( (Math.abs(pFromCol - pToCol) === 1) && (pFromRow - pToRow === 1) && (pieceToTake === "empty")  ) {
    //   console.log("illegal move! The piece in the destination space is: ", pieceToTake);

    // } else


    // Moving forward case

    /* NOTE:  Needs update for case where its the first move, moving forward two
      spaces, but there is a piece in front of you.  ILLEGAL! The code currently
      will allow this because it only checks for a piece at the destination.

      This situation will need to be accounted for the other types of pieces.
      Meaning you can't jump over a piece.
    */

    //console.log("The selectedspace is ", $selectedSpace);
    if (pieceToTake === "empty" &&
      ((firstMove && (pFromRow - pToRow <=2)) || (pFromRow - pToRow === 1)) ){
      legalMoveFoundNowMovePiece();

      if (firstMove){  //legal firstmove made, update firstmove attribute
        pieceToMove.data("fm", "false");
      }
    } else console.log("illegal forward move");

  };

  var checkForLegalMove = function(piece, fromRow, fromCol, toRow, toCol, pieceToCapture){
    console.log(piece, fromRow, fromCol, toRow, toCol);
    // if (piece === "pawn") {
    //   pawnLogic(fromRow, fromCol, toRow, toCol, pieceToCapture);
    // }

    var pieceOptions = {
      pawn: pawnLogic,
      knight: knightLogic,
    };

    pieceOptions[piece].call(null, fromRow, fromCol, toRow, toCol, pieceToCapture);

  }

  var selectPiece = function(clickedObj){
    pieceSelected = true;
    $selectedSpace = clickedObj.td;
    $selectedSpace.css("background-color", "green");  // set bg color

    //pieceToMove = clickedObj.td.find( "span" ); // the actual piece
    pieceToMove = clickedObj.span;
    console.log("\n\n The piece to move is: ", pieceToMove);

    // myClass = clickedObj.td.find( "span" ).attr("class"); // get the class of the piece
    myClass = pieceToMove.attr("class");

    // row = clickedObj.td.parent().data( "row" );  // get the row
    row = $selectedSpace.parent().data( "row" );

    // col = clickedObj.td.data( "col" );  // get the column
    col = $selectedSpace.data( "col" );
    console.log("piece selected is a:", myClass, "at row", row, "col", col);

  }

  // function that runs when the user clicks the space they want to move the piece to
  var movePiece = function(destinationObj) {

    // NOTE: There's a cleaner way to code this!!!
    if (destinationObj.td.find("span").data("color") === $selectedSpace.find("span").data("color")){
      console.log("Illegal move!  One of your pieces is already there!");
      $selectedSpace.css("background-color", "white");
      pieceSelected = false;
      return;
    }
    // ******

    $destinationSpace = destinationObj.td;
    $destinationSpace.css("background-color", "blue");  // set bg color

    // var pieceAtDestination = destinationObj.td.find( "span" ).attr("class") || "empty"; // get the class of the piece
    var pieceAtDestination = destinationObj.span.attr("class") || "empty";

    var destRow = destinationObj.td.parent().data( "row" );  // get the row
    var destCol = destinationObj.td.data( "col" );  // get the column
    console.log("destination is row", destRow, "col", destCol, "current piece at this location:", pieceAtDestination);

    // TODO: Add some logic to determine if the move is legal
      // TODO:if true, add logic to move the piece
      checkForLegalMove(myClass, row, col, destRow, destCol, pieceAtDestination);

    // Once the move is made turn off the colors for both pieces
    setTimeout(function(){
      $selectedSpace.css("background-color", "white");
      $destinationSpace.css("background-color", "white");
    }, 300);

    // unselect the piece (since the move was made)
    pieceSelected = false;

  }; // end of destination logic


  var createObj = function(obj) {
    return {
      td: obj,
      span: obj.find("span")
    };
  };

  var myClass = "";
  var row = "";
  var col = "";

  // Click handler to for selecting/moving a piece
  $('td' ).click(function(e) {
    // console.log(this);
    // this is the actual html
    // var myClass = $(this).attr("class");
    var selectedObj = createObj($(this));

    if (!pieceSelected){
      selectPiece(selectedObj);
    } else {
      movePiece( selectedObj );
    }


  });

});  // end of document.ready function