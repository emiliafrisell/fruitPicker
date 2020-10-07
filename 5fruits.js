
let controller = (function() {

	// get player and playArea
    let playArea = document.querySelector('.playArea');
    let player = document.querySelector('.run');

    // create fruits html
    let apple =  '<img class="apple" id="%id%" src="images/apple.jpg" style="--priceY: %Y%; --priceX:%X%;" />';
    let pineapple =  '<img class="pineapple"  id="%id%" src="images/pineapple.jpg" style="--priceY: %Y%; --priceX:%X%;" />';
    let grapes = '<img class="grapes"  id="%id%" src="images/grapes.jpg" style="--priceY: %Y%; --priceX:%X%;" />';
    let orange = '<img class="orange"  id="%id%" src="images/orange.jpg" style="--priceY: %Y%; --priceX:%X%;" />';
    let pear =  '<img class="pear" id="%id%" src="images/pear.jpg" style="--priceY: %Y%; --priceX:%X%;" />';

    // make array with the different fruits
    let fruitArray = [apple, pineapple, grapes, orange, pear];

    // select random fruit from the array
    let price = fruitArray[Math.floor(Math.random() * 5)];

    // set initial values
    let currentID = 0;
    let highScore = 0;
    
    let pricePosition = {x: 0, y: 0};

    // create function constructors
    let PlayerPosition = function(x, y) {
        this.x = x;
        this.y = y;
    };

    let PoopPosition = function(x, y) {
        this.x = x;
        this.y = y;
    };

    let FruitPosition = function(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
    };
    
    // startGame function
    let startGame = function() {
        
        console.log('New Game Started');

        // hide start and gameOver screen
        document.querySelector('#start_game').classList.add('hide');
        document.querySelector('#instructions').classList.add('hide');
        document.querySelector('#game_over').classList.add('hide');
        document.querySelector('#poopGIF').classList.add('hide');
        document.querySelector('#try_again').classList.add('hide');

        // display player and turn left
        player.classList.remove('hide');
        player.style = 'transform: scaleX(1);';

        // reset arrays
        steps = [];
        poop = [];
        fruits = [];

        // reset scores and ids
        ID = 0;
        currentID = 0;
        poopID = 0;
        fruitID = 0;
        score = 0;

        // player always starts in the same position
        steps[currentID] = new PlayerPosition(2, 19);
        player.style.setProperty('--playerY', steps[0].y);
        player.style.setProperty('--playerX', steps[0].x);

        // add 5 fruits at random locations
        drawPrice();
        drawPrice();
        drawPrice();
        drawPrice();
        drawPrice();

        // reset displayed score
        document.getElementById('score').innerHTML = 'Score: ';
    };

    // set up all eventListeners
    let setupEventListener = function() { 
        
        // If start game button is pressed, start new game
        document.querySelector('#start_game').addEventListener('click', startGame);
        
        // If try again button is pressed, start new game
        document.querySelector('#try_again').addEventListener('click', startGame);

        // If any button is pressed on keyboard
        document.addEventListener('keydown', btnPress);   
        
        
    };

    // different functions depending on what key is pressed on keyboard
    let btnPress = function(event) {
        // ENTER key
        if (event.keyCode === 13 || event.which === 13) { 
            // start screen
            if (document.querySelector('#start_game').classList.contains('hide') != true) {
                startGame();
            };
            // game over screen
            if (document.querySelector('#try_again').classList.contains('hide') != true) {
                startGame();
            };

        // LEFT ARROW key
        } else if (event.keyCode === 37 || event.which === 37) { 
            if (steps[currentID].y > 1){ //if player is on the grid
                steps[currentID].y -= 1; 
                newPosition(steps[currentID].x, steps[currentID].y); //move player
                player.style = 'transform: scaleX(1);'; // turn left
                drawImgs(); // draw player
                checkLocation(); // compare to price or poop
            };

        // UP ARROW key
        } else if (event.keyCode === 38 || event.which === 38) { 
            if (steps[currentID].x > 1){
                steps[currentID].x -= 1;
                newPosition(steps[currentID].x, steps[currentID].y)
                drawImgs();
                checkLocation();
            };

        // RIGHT ARROW key
        } else if (event.keyCode === 39 || event.which === 39) { 
            if (steps[currentID].y < 20){
                steps[currentID].y += 1;
                newPosition(steps[currentID].x, steps[currentID].y)
                player.style = 'transform: scaleX(-1);'; // turn right
                drawImgs();
                checkLocation();
            };

        // DOWN ARROW key
        } else if (event.keyCode === 40 || event.which === 40) { 
            if (steps[currentID].x < 20){
                steps[currentID].x += 1;
                newPosition(steps[currentID].x, steps[currentID].y)
                drawImgs();
                checkLocation();
            };
        };
    };

    // register the players new postition
    let newPosition = function (x, y) {
        // add to array of steps
        currentID++;
        steps[currentID] = new PlayerPosition(x, y);
    };

    const drawImgs = function() {
        // display player at new position
        player.style.setProperty('--playerX', steps[currentID].x);
        player.style.setProperty('--playerY', steps[currentID].y);
    };

    const drawPrice = function() {
        // display fruit at new random location
        while (true) {
            // to make sure that the fruit isn't position on the player or a poop..
            let isSame = 0;

            pricePosition.x = (Math.floor(Math.random() * 19) + 1); 
            pricePosition.y = (Math.floor(Math.random() * 19) + 1);

            // Compare all the poops to the potential position
            poop.forEach(element => {
                if (element.x === pricePosition.x && element.y === pricePosition.y) {
                // .. add 1 every time the positions align
                isSame++;
                console.log('Poop avoided at x: ' + element.y + ', y: ' + element.x + ', new fruit position');
                }  
            });
            if (steps[currentID].x === pricePosition.y && steps[currentID].y === pricePosition.x) {
                console.log('Player avoided, new fruit position');
                isSame++;
            };

            // if the positions dont align, display a random fruit
            if (isSame < 1) { 
                html = fruitArray[Math.floor(Math.random() * 5)];
                
                let newHTML = html.replace('%id%', ID);
                newHTML = newHTML.replace('%Y%', pricePosition.y);
                newHTML = newHTML.replace('%X%', pricePosition.x);

                fruits[fruitID] = new FruitPosition(pricePosition.x, pricePosition.y, ID);
                
                document.querySelector('.playArea').insertAdjacentHTML('beforeend', newHTML);
                
                fruitID++;
                ID++;

                // the while loop only breaks when the positions don't align
                break;
            };  
        };
    };

    const checkLocation = function() {

        // If there are poops.. 
        if (poop.length > -1) {
            for (let i=0; i<poop.length; i++) {
                // ..comare their positions to the players' 
                if (steps[currentID].x === poop[i].x && steps[currentID].y === poop[i].y) {
                    // if they align, you loose
                    gameOver();
                };
            };
        };

        // If there are fruits... 
        if (fruits.length > -1) {
            // compare their positions to the players'
            for (let j=0; j<fruits.length; j++){
                // if the fruit has been eaten..
                if(fruits[j] === undefined) {
                    // ..do nothing
                    // since elements of the array are spliced it gives and error when comparing otherwise

                    // otherwise.. 
                } else if (steps[currentID].x === fruits[j].x && steps[currentID].y === fruits[j].y) {
                    // ..remove fruit from display
                    document.getElementById(fruits[j].id).remove();

                    // ..remove from array so positions dont align anyway
                    fruits.splice(j, 1)
                    
                    // add score
                    score++;

                    // display score
                    document.getElementById('score').innerHTML = 'Score: ' + score;

                    // add poop and display new price
                    addPoop(steps[currentID -2].x, steps[currentID -2].y);
                    drawPrice();
                };
            };
        };
    };
    
    // add step to steps array
    let addPoop = function(x, y) { 
        ID ++;
        
        // poop html
        let html = '<img src="images/poop.jpg" class="poop" style="--poopY: %Y%; --poopX: %X%;" />';

        // insert position
        let newHTML = html.replace('%Y%', y);
        newHTML = newHTML.replace('%X%', x);

        // add to poop array to compare to player position
        poop[poopID] = new PoopPosition(x, y);
        poopID++;

        // add to playArea
        playArea.insertAdjacentHTML('beforeend', newHTML);
    };
    

    let gameOver = function() { // if you step in poop
        
        console.log('Game Over - Score: ' + score);

        // display gameOver screen
        document.querySelector('#game_over').classList.remove('hide');
        document.querySelector('#poopGIF').classList.remove('hide');
        document.querySelector('#try_again').classList.remove('hide');

        // set new highScore
        if (score > highScore) {
            highScore = score;
            console.log('New HighScore!');
            document.getElementById('highScore').innerHTML = 'Highscore: ' + score;
        };

        // hide player
        player.classList.add('hide');

        // remove poops and fruits
        document.querySelectorAll('.poop').forEach(element => {
            element.remove();
        });

        document.querySelectorAll('.apple').forEach(element => {
            element.remove();
        });

        document.querySelectorAll('.pineapple').forEach(element => {
            element.remove();
        });

        document.querySelectorAll('.grapes').forEach(element => {
            element.remove();
        });

        document.querySelectorAll('.orange').forEach(element => {
            element.remove();
        });

        document.querySelectorAll('.pear').forEach(element => {
            element.remove();
        });

    };

    return {
        // initiating application
        init: function() {
            console.log('Application has started');
            setupEventListener();
        }
    }

})();

controller.init();