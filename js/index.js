"use strict";

$(document).ready(function () {
  var gameOn = false;
  var strictOn = false;
  var instructions = [];
  var input = [];
  var level = 1;
  var resetDelay = undefined;

  function gameStart() {
    /* instructions = [];
    input = [];
    level = 1; */
    gameReset();

    // start instructions
    // generate instructions
    instructions.push(Math.ceil(Math.random() * 4));
    console.log(instructions);

    // show instructions by buttons and sounds
    var count = 0;
    resetDelay = setInterval(function () {
      count++;
      if (count === 1) {
        showLevel();
      } else if (count === 2) {
        clearInterval(resetDelay);
        playInstructions();
      }
    }, 500);
  }

  function playSound(ind) {
    var selector = "#sound" + ind;
    $(selector).prop("currentTime", 0);
    $(selector).trigger("play");
    $("#" + ind).addClass("btn-" + ind + "-on");
    setTimeout(function () {
      $("#" + ind).removeClass("btn-" + ind + "-on");
    }, 199);
  }

  function playInstructions() {
    inputOff();
    showLevel();

    // set pace depending on level
    var pace = undefined;
    if (level < 5) {
      pace = 500;
    } else if (level < 9) {
      pace = 400;
    } else if (level < 13) {
      pace = 300;
    } else {
      pace = 250;
    }

    // cycle through steps
    var i = 0;
    playSound(instructions[i]);
    if (instructions.length > 1) {
      (function () {
        var sequence = setInterval(function () {
          i++;
          playSound(instructions[i]);
          if (i === instructions.length - 1) {
            // receive user input from buttons only after instructions
            receiveInput();
            clearInterval(sequence);
          }
        }, pace);
      })();
    } else {
      resetDelay = setTimeout(function () {
        receiveInput();
      }, 200);
    }
  }

  function levelUp() {
    inputOff();
    level++;
    if (level === 21) {
      win();
      return;
    }

    instructions.push(Math.ceil(Math.random() * 4));
    console.log(instructions);
    setTimeout(function () {
      showLevel();
    }, 500);
    var wait = setTimeout(function () {
      playInstructions();
    }, 1000);
  }

  function showLevel() {
    var levelText = level;
    if (level < 10) {
      levelText = "0" + levelText;
    }
    $("#count-window").text(levelText);
  }

  function receiveInput() {
    $("#1, #2, #3, #4").addClass("clickable");
    $("#1, #2, #3, #4").on("click", function () {
      var newInput = Number($(this).attr("id"));

      // play user input if correct
      if (newInput === instructions[input.length]) {
        input.push(newInput);
        console.log(input);
        playSound(input[input.length - 1]);
        if (input.length === instructions.length) {
          input = [];
          levelUp();
          return;
        }
      } else {
        wrongAnswer(newInput);
      }
    });
  }
  function inputOff() {
    $("#1, #2, #3, #4").off("click");
    $("#1, #2, #3, #4").removeClass("clickable");
  }

  function wrongAnswer(newInput) {
    inputOff();
    // wrong answer instructions
    // show wrong answer
    $("#" + newInput).addClass("btn-" + newInput + "-on");
    setTimeout(function () {
      $("#" + newInput).removeClass("btn-" + newInput + "-on");
    }, 500);

    // show corrected answer
    var count = 0;
    var correction = setInterval(function () {
      count++;
      if (count % 2 === 1) {
        playSound(instructions[input.length]);
        $("#count-window").text("!!");
      } else {
        $("#count-window").text("");
      }
      if (count === 5) {
        if (strictOn) {
          strictReset();
          clearInterval(correction);
          return;
        }

        input = [];
        setTimeout(function () {
          showLevel();
        }, 500);
        setTimeout(function () {
          playInstructions();
        }, 1000);
        clearInterval(correction);
      }
    }, 110);
  }

  function win() {
    var count = 0;
    var victory = setInterval(function () {
      playSound(4 - count % 4);
      count++;
      if (count === 8) {
        clearInterval(victory);
        gameReset();
        gameStart();
      }
    }, 200);
  }

  function gameReset() {
    clearTimeout(resetDelay);
    clearInterval(resetDelay);
    instructions = [];
    input = [];
    level = 1;
    $("#count-window").text("--");
    inputOff();
  }

  function strictReset() {
    gameReset();
    gameStart();
  }

  $("#switch").click(function () {
    gameOn = !gameOn;

    // game shutdown instructions
    if (!gameOn) {
      gameReset();
      $("#count-window").removeClass("window-on");
      if ($("#strict-light").hasClass("light-on")) {
        $("#strict-light").removeClass("light-on");
      }
      strictOn = false;
    } else {
      $(".count-window").addClass("window-on");
    }

    $(this).children().toggleClass("on");
  });

  $("#start-btn").click(function () {
    if (gameOn) {
      gameStart();
    }
  });
  $("#strict-btn").click(function () {
    if (gameOn) {
      strictOn = !strictOn;
      $("#strict-light").toggleClass("light-on");
    }
  });
});