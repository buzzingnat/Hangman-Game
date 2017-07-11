/*
---- Program Outline ----
** dom elements to access/change: **
- #wordDisplay: begin with underscores for each letter, fill in correct letters as they are guessed;
- #embedLink: use birbs.[...].embedLink as src value;
- #gifLink: use birbs.[...].gifLink as href value;
- #winNumber: track number of wins;
- #guessRemainNumber: give max number of guesses (12) and subtract one each failed guess. When hit -1, instead od subtracting display utility.dead to video embed
- #alreadyGuessedLetter: track clicked letter keys, MAKE THEM ALL LOWERCASE, display wrong guesses here - append them in a span with some padding and font styling maybe, when key press is same as wrong guess array or correct guess array, nothing happens;
*/

/** Arrays and Objects **/

// initialize empty sets - using a little ES6
var correctGuesses = new Set();
var wrongGuesses = new Set();

// counter for number of failed guesses allowed
var guessCounter = 10;

// counter for total wins
var wins = 0;

// mark whether gameplay is paused
var gamePause = false;

// list of start and fail images/videos
var utility = {
    typing: {
        name: "Typing",
        embedLink: "https://giphy.com/embed/D4ozghKanwmD6",
        gifLink: "https://giphy.com/gifs/keyboard-parrot-chewing-D4ozghKanwmD6"
    },
    dead: {
        name: "Dead",
        embedLink: "https://giphy.com/embed/JUf7XlLbUr2ms",
        gifLink: "https://giphy.com/gifs/parrot-senegal-play-dead-JUf7XlLbUr2ms"
    }
}

// list of success images/videos
var birbs = [
    hyacinthMacaw = {
        name: "Hyacinth Macaw",
        embedLink: "https://giphy.com/embed/aSM6MEcl8BXuo",
        gifLink: "https://giphy.com/gifs/bath-macaw-aSM6MEcl8BXuo"
    },
    scarletMacaw = {
        name: "Scarlet Macaw",
        embedLink: "https://giphy.com/embed/Y5oWh5sA09hBe",
        gifLink: "https://giphy.com/gifs/headlikeanorange-parrot-macaw-scarlet-Y5oWh5sA09hBe"
    },

    cockatoo = {
        name: "Cockatoo",
        embedLink: "https://giphy.com/embed/94aIgq3Iq4SCQ",
        gifLink: "https://giphy.com/gifs/cat-meow-cockatoo-94aIgq3Iq4SCQ"
    },
    cockatiel = {
        name: "Cockatiel",
        embedLink: "https://giphy.com/embed/sCJ0e9xhWTwkw",
        gifLink: "https://giphy.com/gifs/camera-shy-cockatiel-sCJ0e9xhWTwkw"
    },
    conure = {
        name: "Conure",
        embedLink: "https://giphy.com/embed/KpNyL9LpxTTnq",
        gifLink: "https://giphy.com/gifs/bird-pearly-conure-KpNyL9LpxTTnq"
    },
    lovebird = {
        name: "Love Bird",
        embedLink: "https://giphy.com/embed/vDMLHYadpxsOc",
        gifLink: "https://giphy.com/gifs/macaw-cockatoo-sun-conure-vDMLHYadpxsOc"
    },
    budgie = {
        name: "Budgie",
        embedLink: "https://giphy.com/embed/4NcZfhlSvi5aw",
        gifLink: "https://giphy.com/gifs/animated-gif-4NcZfhlSvi5aw"
    },
    amazon = {
        name: "Amazon",
        embedLink: "https://giphy.com/embed/Gg1zg8WeMWTxS",
        gifLink: "https://giphy.com/gifs/parrots-spartan-Gg1zg8WeMWTxS"
    },
    africanGray = {
        name: "African Gray",
        embedLink: "https://giphy.com/embed/NDAf4PVui8mUU",
        gifLink: "https://giphy.com/gifs/cat-parrot-not-amused-NDAf4PVui8mUU"
    }
];

/** Functions **/

// choose a birb from list, outputs the object
function chooseBirb() {
    var birbIndex = Math.floor(Math.random() * birbs.length);
    var selectedBirb = birbs[birbIndex];
    return selectedBirb;
}

function createBirbText(birb) {
    var output = "";
    var text = birb.name;
    var textArray = text.split(" ");
    for (var i = 0; i < textArray.length; i++) {
        var word = textArray[i].split("");
        for (var j = 0; j < word.length; j++) {
            var letter = word[j].toLowerCase();
            if (correctGuesses.has(letter)) {
                output = output + letter.toUpperCase() + " ";
            } else {
                output = output + "_ ";
            }
        }
        if (i === 0 && textArray.length > 1) {
            output = output + "&nbsp; &nbsp;";
        }
    }
    return output;
}

function displayBirbText(text) {
    $("#wordDisplay").html(text);
}

function newBirb() {
    correctGuesses.clear();
    wrongGuesses.clear();
    guessCounter = 10;
    var birb = chooseBirb();
    var birbText = createBirbText(birb);
    displayBirbText(birbText);
    $("#alreadyGuessedLetter").html(wrongGuesses);
    $("#guessRemainNumber").html(guessCounter);
    gamePause = false;
    return birb;
}

function processKey(pressedKey) {
    var key = pressedKey.toLowerCase();
    if (
        /* --- REGEX EXPLANATION ---

        / (opens a regular expression in JavaScript)
        ^ (start of line)
        [a-z] (a single letter from a to z, lowercase only)
        $ (end of line)
        / (close the regular expression)

        */
        key.search(/^[a-z]$/) === 0 &&
        !correctGuesses.has(key) &&
        !wrongGuesses.has(key)
        ) {
        return key;
    } else {
        return false;
    }
}

function newBirbOnWin() {
    currentBirb = newBirb();
}

function newBirbOnLose() {
    currentBirb = newBirb();
    $("#embedLink").attr("src", utility.typing.embedLink);
    $("#gifLink").attr("href", utility.typing.gifLink);
}

function checkLose() {
    if (guessCounter > 0) {
        return;
    }
    // prevent further guessing
    gamePause = true;

    //display deadBirb video
    $("#embedLink").attr("src", utility.dead.embedLink);
    $("#gifLink").attr("href", utility.dead.gifLink);

    //empty text for guessing the word
    $("#wordDisplay").html("<p>Oh no! You killed the birb!</p>"
        +"<p>The word was " + currentBirb.name.toUpperCase() + "</p>");

    //after a couple of seconds, display new word to try
    setTimeout(newBirbOnLose, 3500);
}

// track pressed keys
function storeKeyPress(processedKey, birb) {
    if (birb.name.toLowerCase().indexOf(processedKey) > -1) {
        correctGuesses.add(processedKey);
        return;
    } 
    //add wrong guesses to wrongGuesses array
    wrongGuesses.add(processedKey);

    //display wrong guesses to screen
    $("#alreadyGuessedLetter").html(
        Array.from(wrongGuesses).sort().join(" ").toUpperCase()
    );

    //decrement chances left counter
    guessCounter--;

    //display new counter number to screen
    $("#guessRemainNumber").html(guessCounter);
}

function fetchSoundCloudWidget(iframeId) {
    var iframeElement = $("#" + iframeId + "")[0];
    var widget = SC.Widget(iframeElement);
    return widget;
}

function playWinSound(iframeId, start, length) {
    var birbMusic = fetchSoundCloudWidget(iframeId);
    birbMusic.seekTo(start);
    birbMusic.play();
    setTimeout(() => birbMusic.pause(), length);
}

function checkWin(displayedText, birb) {
    if (displayedText.indexOf("_") >= 0) {
        return;
    }
    gamePause = true;
    $("#embedLink").attr("src", birb.embedLink);
    $("#gifLink").attr("href", birb.gifLink);
    var timeoutLength = pickAndPlaySound();
    setTimeout(newBirbOnWin, timeoutLength);
    wins++;
}

var soundArray = [
    ["soundcloudEmbed-Chocobo", 1000, 5500],
    ["soundcloudEmbed-Simple", 7500, 3500]
];

function pickAndPlaySound() {
    var index = Math.floor(Math.random() * soundArray.length);
    playWinSound(soundArray[index][0], soundArray[index][1], soundArray[index][2]);
    var timeoutLength = soundArray[index][2];
    return timeoutLength;
}

// check if the user is interacting using a touch device
window.addEventListener('touchstart', function onFirstTouch() {

    // 1: display button for bringing up the keyboard by setting a new class on it
    $("#openKeyboard").css("visibility", "visible");

    // 2: run the keyboard display code
    $("#openKeyboard").on("click", function(){
        console.log("The openKeyboard button was clicked");
        var $inputElement = $("hiddenInput");
        $("#hiddenInput").css("visibility", "visible"); // unhide the input
        $("#hiddenInput")[0].focus(); // focus on it so keyboard pops
        $("#hiddenInput").css("visibility", "hidden"); // hide it again
    });

  // we only need to know once that a human touched the screen, so we can stop listening now
  window.removeEventListener('touchstart', onFirstTouch, false);
}, false);

// initial bird object for page load
// must be declared after newBirb() function is defined
var currentBirb = newBirb();

/** Run on page load **/
$().ready(function() {
    //var currentBirb = chooseBirb();
    //displayBirbText( createBirbText(currentBirb) );
    $("body").on("keyup", function(event) {
        // if the game is paused, don't react to keypresses
        if (gamePause) { 
            return;
        }

        // get the pressed key using JS .which
        var key = String.fromCharCode(event.which);

        // use processKey() to determine if it is a valid keypress to respond to
        key = processKey(key);

        // if it is invalid, end the function here
        if (!key) {
            return;
        }

        // if key is valid, update the appropriate letter set and guess counter, 
        // then display wrong guesses and number of remaining guesses to screen
        storeKeyPress(key, currentBirb);

        // check if player has lost before continuing
        checkLose();

        // if they lose then game is paused, and end the function before updating
        // the display any more 
        if (gamePause) {
            return;
        }

        // update the displayed hangman game text after every valid keypress
        var birbText = createBirbText(currentBirb);
        displayBirbText(birbText);

        // check if the player won
        checkWin(birbText, currentBirb);
    });
});

/* --- EXTRA NOTES --- */

/* EXAMPLE OF USING A FUNCTION TO ENCLOSE A PROGRAM
    - uses an object to declare public variables to be seen outside of the function
    - returns the declared variables at the end of the funtion
    - all other variables used in the function stay scoped within the function
    - prevents a complicated program from calling or changing global variables 
        or functions unexpectedly
    - self calling

var hangmanGame = (function () {
    var public = {};

    return public;
})();
*/

/*
    NOTES ON DIFFERENT WAYS TO TRACK GUESSES
    1) ES6
    var wrongGuesses = new Set();
    wrongGuesses.add(key);
    if (wrongGuesses.has(key)) {
        //code
    }

    2) CLASSIC JS: OBJECT
    var wrongGuesses = {};
    wrongGuesses[key] = true;
    if (wrongGuesses[key]) {
        //code
    }

    3) CLASSIC JS: ARRAY
    var wrongGuesses = [];
    wrongGuesses.push(key);
    if (wrongGuesses.indexOf(key) > -1) {
        //code
    }
*/