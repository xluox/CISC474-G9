var myGamePiece;
var obstacles = [];
var buildings = [];
var myScore;
var lifeUsed = 0;
var jumpConst = 2;
var keyTime = jumpConst;
var onGround = false;
var onBlock = false;
var Ctop = 0;
var Cbottom = 510;
var CleftEdge = 30;
var CrightEdge = 930;
var Hspeed = 0;
var moveSpeed = 0.9;
var jumpSpeed = 3;
var intervalRate = 5;
var baseLevel = 5;
var level = baseLevel;
var startLevel = 0;
var myLevel;
var gameOver;
var gameTitle;
var gameMenu;
var gameTutorial;
var gameCredits;
var creditsText;
var creditsText2;
var tutorialText1;
var tutorialText2;
var tutorialText3;
var tutorialText4;
var jumping = false;
var playerGravity = 0.07;
var mainPieceSize = 15;
var gatePoint = [Cbottom-21, Cbottom-21,Cbottom-21, 300, Cbottom-21, Ctop+60, Cbottom-21,Cbottom-21]





function startGame() {
    myGameArea.start();
    obstacles = getObstacles(baseLevel);
    buildings = getBuildings(baseLevel);
    myGamePiece = getPlayer(level);
    myScore = new component("30px", "Consolas", "black", 750, 30, "text");
    myLevel = new component("30px", "Consolas", "black", 40, 30, "text");
    gameOver= new component("90px", "Georgia", "white", 230, 250, "gameOver");
    gameTitle = new component("70px", "Georgia", "black", 60, 120, "text");
    gameMenu = new component("30px", "Consolas", "black", 435, 360, "text");
    gameTutorial = new component("30px", "Consolas", "black", 760, 450, "text");
    gameCredits = new component("30px", "Consolas", "black", 50, 450, "text");
    creditsText = new component("70px", "Georgia", "black", 180, 120, "text");
    tutorialText1 = new component("30px", "Consolas", "black", 50, 430, "text");
    tutorialText2 = new component("30px", "Consolas", "black", 320, 400, "text");
    tutorialText3 = new component("30px", "Consolas", "black", 600, 250, "text");
    tutorialText4 = new component("70px", "Georgia", "black", 180, 120, "text");

}
function getPlayer(level){
    player =  new component(mainPieceSize, mainPieceSize, "slime_monster_spritesheet.png", 40, gatePoint[level], "hero");
    player.gravity = playerGravity;
    return player;
}
function getPlayerFromLeft(level){
    player =  new component(mainPieceSize, mainPieceSize, "slime_monster_spritesheet.png", CleftEdge-20, gatePoint[level], "hero");
    player.gravity = playerGravity;
    return player;
}
function getPlayerFromRight(level){
    player =  new component(mainPieceSize, mainPieceSize, "slime_monster_spritesheet.png", CrightEdge+20, gatePoint[level+1], "hero");
    player.gravity = playerGravity;
    return player;
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 960;
        this.canvas.height = 540;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;        
        this.interval = setInterval(updateGameArea, intervalRate);
        window.addEventListener('keydown', function (e) {
            // console.log(e.key);
            if(e.key == "ArrowUp" && keyTime > 0){ jump();}
            if (e.key == "r") {myGameArea.restart(); }

            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        gameOver.text = "GameOver!!!";
        gameOver.update();
        clearInterval(this.interval);
    },
    restart : function(){
        // console.log("Hspeed: " + Hspeed);
        clearInterval(this.interval);
        this.interval = setInterval(updateGameArea, intervalRate);
        // level = baseLevel;
        obstacles = getObstacles(level);
        buildings = getBuildings(level);
        myGamePiece = getPlayer(level);
        lifeUsed++;
    }
}


function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "hero") {
        this.image = new Image();
        this.image.src = color;
    }
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;   
    this.gravity = 0.05;
    this.gravitySpeed = 0; 
    this.speedLimit = 3;
    this.x = x;
    this.y = y;
    this.radius = 6;
    this.center = [this.x + mainPieceSize/2, this.y + mainPieceSize/2];
    this.direction = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image, 
            this.x, 
            this.y,
            this.width, this.height);
        }   
        else if (type == "hero") {
            ctx.drawImage(this.image, 
            this.x-1.5, 
            this.y-1.5,
            this.width+3, this.height+3);
        } 
        else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (this.type == "gameOver"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.fillText(this.text, this.x, this.y);
            ctx.strokeText(this.text, this.x, this.y);
        } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.renewCircle = function(){
        this.center = [this.x + this.radius, this.y + this.radius];
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        if(this.gravitySpeed > this.speedLimit){
            this.gravitySpeed = this.speedLimit;
        }
        if(this.gravitySpeed < 0){
            jumping = true;
        }
        else{
            jumping = false;
        }
        this.x += this.speedX;
        this.y += this.gravitySpeed; 
        this.renewCircle(); 


        for(i of obstacles){
            if(i.type == "triangle"){
                if(this.crashWithTriangle(i)){
                    myGameArea.stop();
                }
            }
            else if(i.type == "door"){
                if(this.crashWith(i)){
                    lifeUsed = 0;
                    level = 3;
                    console.log("level changed: " + level);
                    obstacles = getObstacles(level);
                    buildings = getBuildings(level);
                    myGamePiece = getPlayer(level);
                }
            }

        }
        for (i of buildings){
            this.hitBuilding(i);
        }
        this.reachLevelPoint();
         
    }
    this.hitBuilding = function(object){

        // stand on top
        if(jumping){

        }
        else if (this.y >= (object.y - this.height -(jumpSpeed-0.5)) && 
        this.y + this.height <= (object.y  +0.5) &&
        (this.x < (object.x + object.width)) &&
        (this.x > (object.x - this.width))      ) {
            this.gravitySpeed = 0;
            this.y = object.y - this.height ;
            keyTime = jumpConst;
        }

        // hit from left
        if ((this.y < (object.y + object.height)) && 
        (this.y > (object.y - this.height)) &&
        (this.x < (object.x - this.width)+ (moveSpeed+0.5) ) &&
        (this.x > (object.x - this.width))) {
            this.x = object.x - this.width;
        }

        // hit from right
        else if ((this.y < (object.y + object.height)) && 
        (this.y > (object.y - this.height)) &&
        (this.x < (object.x + object.width) ) &&
        (this.x > (object.x + object.width)-(moveSpeed+0.5) )) {
            this.x = object.x + object.width;
        }
        // hit from bottom
        else if ((this.y <= (object.y + object.height)) && 
        (this.y > (object.y + object.height) - jumpSpeed) &&
        (this.x < (object.x + object.width)) &&
        (this.x > (object.x - this.width))) {
            this.gravitySpeed = 0 ;
            this.y = object.y + object.height;
        }
        

        
    }


    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }

    this.reachLevelPoint = function(){
        if(this.x > CrightEdge + 30){
            level++;
            console.log("level changed: " + level);
            obstacles = getObstacles(level);
            buildings = getBuildings(level);
            myGamePiece = getPlayerFromLeft(level);

        }
        else if(this.x+this.width < CleftEdge-30){
            level--;
            console.log("level changed: " + level);
            obstacles = getObstacles(level);
            buildings = getBuildings(level);
            myGamePiece = getPlayerFromRight(level);

        }


    }

    this.crashWithTriangle = function(object){
        var circleHero = {radius: this.radius, x: this.center[0], y: this.center[1]};
        var circle1 = {radius: object.radius, x: object.center1[0], y: object.center1[1]};
        var circle2 = {radius: object.radius, x: object.center2[0], y: object.center2[1]};
        var circle3 = {radius: object.radius, x: object.center3[0], y: object.center3[1]};

        var dx1 = circleHero.x - circle1.x;
        var dy1 = circleHero.y - circle1.y;
        var dx2 = circleHero.x - circle2.x;
        var dy2 = circleHero.y - circle2.y;
        var dx3 = circleHero.x - circle3.x;
        var dy3 = circleHero.y - circle3.y;
        var distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        var distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        var distance3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

        // console.log("distance1: "+ distance1 + "radius: " + circleHero.radius + circle1.radius );
        // console.log("distance2: "+ distance2 + "radius: " + circleHero.radius + circle2.radius );
        // console.log("distance3: "+ distance3 + "radius: " + circleHero.radius + circle3.radius );

        if (distance1 < circleHero.radius + circle1.radius) {
            // collision detected!
            return true;
        }
        else if (distance2 < circleHero.radius + circle2.radius) {
            // collision detected!
            return true;
        }
        else if (distance3 < circleHero.radius + circle3.radius) {
            // collision detected!
            return true;
        }

        return false;
    }
}

function updateGameArea() {

    myGameArea.clear();


    for (i of obstacles){
        i.trapMove(myGamePiece);
        i.update();

    }
    for (i of buildings){
        i.update();
    }


    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;    
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -moveSpeed; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = moveSpeed; }


    if(level == 1){
        gameTitle.text = "I WANNA BE SUFFERING";
        gameMenu.text = "Start";
        gameTutorial.text = "Tutorial-->>";
        gameCredits.text = "<<--Credits";
        gameTitle.update();
        gameMenu.update();
        gameTutorial.update();
        gameCredits.update();
    }
    else if(level == 0){
        creditsText.text = "Produce     Yifu Li";
        creditsText.update();
    }
    else if(level == 2){
        tutorialText1.text = "Press < > to move";
        tutorialText2.text = "Press ^ to jump!";
        tutorialText3.text = "^ twice to jump higher!!";
        tutorialText4.text = "Press R to restart!!!";
        tutorialText1.update();
        tutorialText2.update();
        tutorialText3.update();
        tutorialText4.update();
    }
    else{
        myScore.text = "Life used: " + lifeUsed;
        myScore.update();
        myLevel.text = "Level: " + (level-2);
        myLevel.update();
    }

    
    myGamePiece.newPos();
    myGamePiece.update();

}
function jump(){
    // console.log("Jump!!!");

    accelerate(-jumpSpeed); 
    keyTime -= 1;
    // console.log("Jump left: " + keyTime);
}
function accelerate(n) {
  myGamePiece.gravitySpeed = n;
}




