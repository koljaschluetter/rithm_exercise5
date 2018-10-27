window.onload = function () {

    var start = document.getElementsByClassName('startgame');
    start[0].addEventListener('click', buildGameStructure);

    var score = document.getElementsByClassName('score');
    score[0].innerHTML = "BEST SCORE: " + getScore();
}


//var cardOpenCounter = 0;
var numberoftries = 0;
var pairsToWin = 12;
var openCards = [];


function getScore() {
    
    return (localStorage.getItem("score")) ? localStorage.getItem("score") : '-';
}

//Function to shuffle the card pairs in a given array
function shuffle(arr) {
    var j, x, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
}

function disableStart() {
    var start = document.getElementsByClassName('startgame');
    start[0].removeEventListener('click', buildGameStructure);
}

function buildGameStructure() {

    disableStart();
    var start = document.getElementsByClassName('startgame');
    start[0].classList.toggle('duringgame');

    var body = document.getElementsByTagName('body')[0];

    //Starting ID for the first card
    var cardID = 1;
    //Shuffle all pairs randomly over the grid
    var gifCards = shuffle([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12]);


    for (var j = 1; j <= 5; j++) {

        var newDiv = document.createElement("div");
        newDiv.classList.add('container');


        for (var i = 1; i <= 5; i++) {

            var col = document.createElement("div");

            col.classList.add('col')
            col.appendChild(document.createElement('div'));

            //No GIF card in the middle
            if (cardID != 13) {

                var gifID = gifCards.pop();
                col.lastElementChild.classList.add('scene');
                col.lastElementChild.classList.add('scene--card');

                col.lastElementChild.appendChild(document.createElement('div'));
                col.lastElementChild.lastElementChild.classList.add('card');
                col.lastElementChild.lastElementChild.id = cardID + "-" + gifID;

                col.lastElementChild.lastElementChild.appendChild(document.createElement('div'));
                col.lastElementChild.lastElementChild.lastElementChild.classList.add('card__face');
                col.lastElementChild.lastElementChild.lastElementChild.classList.add('card__face--front');
                col.lastElementChild.lastElementChild.lastElementChild.innerHTML = "🙈";

                col.lastElementChild.lastElementChild.appendChild(document.createElement('div'));
                col.lastElementChild.lastElementChild.lastElementChild.classList.add('card__face');
                col.lastElementChild.lastElementChild.lastElementChild.classList.add('card__face--back');

                col.lastElementChild.lastElementChild.lastElementChild.appendChild(document.createElement('img'));
                col.lastElementChild.lastElementChild.lastElementChild.lastElementChild.classList.add('gif');
                col.lastElementChild.lastElementChild.lastElementChild.lastElementChild.src = "res/" + gifID + ".gif";
            } else {

                col.lastElementChild.classList.add('count');
                col.lastElementChild.appendChild(document.createElement('span'))
                col.lastElementChild.lastElementChild.classList.add('countertext');
                col.lastElementChild.lastElementChild.innerText = "0";
            }

            cardID++;

            newDiv.appendChild(col);
        }

        body.appendChild(newDiv);
    }

    //Add the onClick listeners for all cards
    addListeners();
}

function addListeners() {

    var card = document.querySelectorAll('.card');

    for (var i = 0; i < card.length; i++) {

        card[i].addEventListener('click', flip);
    }
}


function flip() {

    //Counts the number of cards flipped and displays the number in the center of the cards
    numberoftries++;
    document.getElementsByClassName('countertext')[0].innerHTML = numberoftries;
    var clickedCard = this;
    clickedCard.classList.toggle('is-flipped');

    openCards.push(clickedCard.id);

    if (openCards.length === 2) {

        removeAllEventListenersForClass('card');

        if (getIdentifiers('gif', openCards[openCards.length - 2]) === getIdentifiers('gif', openCards[openCards.length - 1])) {
            setTimeout(function () {
                pairsToWin--;
                addListeners();
                setPair();
                won();
                openCards = [];
            }, 1000)
        } else {

            setTimeout(function () {

                addListeners();
                flipBackOpenCards();
                openCards = [];

            }, 1000);
        }
    }
}

function removeAllEventListenersForClass(str) {
    var card = document.querySelectorAll('.' + str);

    for (var i = 0; i < card.length; i++) {

        card[i].removeEventListener('click', flip);
    }

}

function setPair() {

    for (var i = 0; i < openCards.length; i++) {

        var card = document.getElementById(openCards[i]);
        card.lastChild.classList.add('pair');
    }
}

function getIdentifiers(str, id) {

    if (str === 'gif') {

        return id.slice(id.indexOf('-') + 1);
    } else if (str === 'id') {

        return id.slice(0, id.indexOf('-'));
    }
}


function flipBackOpenCards() {
    for (var i = 0; i < openCards.length; i++) {

        var card = document.getElementById(openCards[i]);
        card.classList.toggle('is-flipped');
    }
}


function won() {

    if (pairsToWin === 0) {
        var middle = document.getElementsByClassName('countertext');

        middle[0].innerText = "WON";

        setTimeout(function () {

            var container = document.getElementsByClassName('container');

            var j = container.length - 1;
            while (container.length > 0) {
                container[j].parentNode.removeChild(container[j]);
                j--;
            }


            setScore();

            var start = document.getElementsByClassName('startgame');
            start[0].classList.toggle('duringgame');
            start[0].addEventListener('click', buildGameStructure);
        }, 5000);
    }
}


function setScore() {

    var currentScore = localStorage.getItem("score");

    if (currentScore === null || currentScore > numberoftries) {
        localStorage.setItem("score", numberoftries);

        var score = document.getElementsByClassName('score');
        score[0].innerHTML = "BEST SCORE: " + localStorage.getItem("score");
    }
}