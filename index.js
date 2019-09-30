var myGamePiece;
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
    myObstacle =  new component(30, 30, "green", 300, 510); 
    myObstacle2 = new component(60, 30, "green", 450, 450);
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.8;
    // myObstacle.gravity = 0;
    myScore = new component("30px", "Consolas", "black", 800, 40, "text");
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
            if(e.key == "ArrowUp" && keyTime > 0){ jump(); console.log(keyTime);}
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
        myGamePiece.gravitySpeed = 0;
        myGamePiece.x = 10;
        myGamePiece.y = 120;
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
        this.hitBottom();  
        this.standOnBlocks(myObstacle2);  
    }
    this.standOnBlocks = function(object){
        var blockBottom = object.y - this.height;

        if(this.y >= blockBottom && (this.x+this.width) > object.x && this.x < (object.x+object.width)){
            // console.log("Y: "+ this.y + "BB:" + blockBottom);
            onBlock = true;
        }
        else{
            onBlock = false;
        }
        // console.log(onBlock);
        if(onBlock){
            this.gravitySpeed = 0;
            this.y = blockBottom;
            keyTime = jumpConst;
        }
    }
    this.hitBottom = function() {
    var rockbottom = myGameArea.canvas.height - this.height;
    // console.log("Y : " + this.y);
    if (this.y >= rockbottom) {

        this.gravitySpeed = 0;
        this.y = rockbottom;
        onGround = true;
        keyTime = jumpConst;
    }
    else{
        // console.log("On Sky");
        // onGround = false;
        // keyTime = 0;
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
    if (myGamePiece.crashWith(myObstacle)) {
    myGameArea.stop();
    } else {

        myGameArea.clear();

        myObstacle.update();
        myObstacle2.update();
        myGamePiece.speedX = 0;
        myGamePiece.speedY = 0;    
        if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -4; }
        if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 4; }
        // if (myGameArea.keys && myGameArea.keys[38] && keyTime > 0) {  jump(); console.log("Jump left: " + keyTime);}
        // if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 2; }
        myScore.text = "Life used: " + lifeUsed;
        myScore.update();
        myGamePiece.newPos();
        myGamePiece.update();

    }
}
function jump(){
    console.log("Jump!!!");
    accelerate(-10); 
    keyTime -= 1;
    // onGround = false;
}
function accelerate(n) {
  myGamePiece.gravitySpeed = n;
}


