var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("message-area");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
       var cell = document.getElementById(location);
       cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] } ],
    fire: function(guess) { 
       for (var i = 0; i < this.numShips; i++) {
           var ship = this.ships[i];
           var index = ship.locations.indexOf(guess);
           if (index >= 0) {
               view.displayHit(guess);
               view.displayMessage('Hit! Just Lucky!');
               ship.hits[index] = 'hit';
               if (this.isSunk(ship)) {
                   this.shipsSunk++;
                   view.displayMessage('You sank my battleship!');
               }
               return true;
           }
           view.displayMiss(guess);
           view.displayMessage('Miss! Stupid!');
      }
       return false;
    },
    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit')
                return false;
        }
        return true;
    },
    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
        this.ships[i].locations = locations;
        }
    },
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, column;
        if (direction === 1) {
            // Generate a starting location for a  horizontal ship line
            row = Math.floor(Math.random() * this.boardSize);
            column = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            //Generate a starting location for a vertical ship line
            column = Math.floor(Math.random() * this.boardSize);
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }
        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (column + i));
            } else {
                newShipLocations.push(column + '' + (row + i));
            }
        }
        return newShipLocations;
    },
    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true; 
                }
            }
        }
        return false;
    }
};

var controller = {
    guesses: 0,
    processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
        this.guesses++;
        var hit = model.fire(location);
        if (hit && model.shipsSunk === model.numShips) {
            view.displayMessage('You sank all my battleships, in ' + this.guesses + ' guesses');
        }

    }
        
}
};

//Get and process the player's guess
function parseGuess(guess) {
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    //Check the input to make sure it is valid (not null or too long or too short)
    if (guess === null || guess.length != 2) {
        alert('Oops, please enter a letter and a number on the board.');
    } else {
         firstChar = guess.charAt(0);
         var row = alphabet.indexOf(firstChar);
         var column = guess.charAt(1);
    }

    //Take a letter and convert it to a number
    if (isNaN(row) || isNaN(column)) {
         alert("Oops, that isn't on the borad!");
    } else if ((row < 0 || row >= model.boardSize) || (column < 0 || column >= model.boardSize)) {
        alert("Oops, that's off the board!");
    } else {
        return row + column;
    }
        
    return null;
}

function handleFireButton() {
    var guessInput = document.getElementById('guess-input');
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = '';

}

function handleKeyPress(e) {
    var fireButton = document.getElementById('fire-button');
    if (e.keyCode === 13) {
        fireButton.click();
        return false
    }
}


window.onload = init;

function init() {
    var fireButton = document.getElementById('fire-button');
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById('guess-input');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}