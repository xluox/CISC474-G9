var myGamePiece;
var obstacles = [];
var buildings = [];
var myObstacle;
var myObstacle2;
var myScore;
var lifeUsed = 0;
var jumpConst = 2;
var keyTime = jumpConst;
var onGround = false;
var onBlock = false;


function startGame() {
    myGameArea.start();
    // myObstacle =  new component(30, 30, "green", 300, 510); 
    // myObstacle2 = new component(60, 30, "green", 450, 450);
    obstacles = getObstacles();
    buildings = getBuildings();
    myGamePiece = getPlayer();
    myScore = new component("30px", "Consolas", "black", 780, 40, "text");

}
function getPlayer(){
    player =  new component(15, 15, "red", 40, 330);
    player.gravity = 0.8;
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
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            // console.log(e.key);
            if(e.key == "ArrowUp" && keyTime > 0){ jump();}
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
    // clearInterval(this.interval);
        this.restart();
    },
    restart : function(){
        obstacles = getObstacles();
        myGamePiece = getPlayer();
        lifeUsed++;
    }
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
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
    this.x = x;
    this.y = y;
    this.direction = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image, 
            this.x, 
            this.y,
            this.width, this.height);
        }    
        else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;  
        // this.hitBottom();  
        for (i of buildings){
            this.hitBuilding(i);
        }
        // this.hitBuilding(myObstacle2);
         
    }
    this.hitBuilding = function(object){
        // stand on top
        if ((this.y >= (object.y - this.height)) && 
        (this.y < (object.y - this.height)+10) &&
        (this.x < (object.x + object.width)) &&
        (this.x > (object.x - this.width))) {
            this.gravitySpeed = 0;
            this.y = object.y - this.height ;
            onGround = true;
            keyTime = 2;
        }

        // hit from bottom
        if ((this.y <= (object.y + object.height)) && 
        (this.y > (object.y + object.height) - 10) &&
        (this.x < (object.x + object.width)) &&
        (this.x > (object.x - this.width))) {
            this.gravitySpeed = 0;
            this.y = object.y + object.height;
            this.speedY = 0;
        }

        // hit from left
        if ((this.y <= (object.y + object.height)) && 
        (this.y > (object.y - this.height)) &&
        (this.x < (object.x - this.width)+5 ) &&
        (this.x >= (object.x - this.width))) {
            this.x = object.x - this.width;
            this.speedX = 0;
        }

        // hit from right
        if ((this.y <= (object.y + object.height)) && 
        (this.y > (object.y - this.height)) &&
        (this.x <= (object.x + object.width) ) &&
        (this.x > (object.x + object.width)-5 )) {
            this.x = object.x + object.width;
            this.speedX = 0;
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
}

function updateGameArea() {

    myGameArea.clear();
    for (i of obstacles){
        i.trapMove();
        i.update();
        if(myGamePiece.crashWith(i) ){
            myGameArea.stop();
        }
    }
    for (i of buildings){
        i.update();
    }

    // myObstacle2.update();

    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;    
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -4; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 4; }
    myScore.text = "Life used: " + lifeUsed;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();

}
function jump(){
    // console.log("Jump!!!");
    accelerate(-10); 
    keyTime -= 1;
}
function accelerate(n) {
  myGamePiece.gravitySpeed = n;
}


