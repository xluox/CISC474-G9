var consSpeed = 1;

function obstacle(width, height, color, x, y, direction, type) {
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
    this.direction = direction;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image, 
            this.x, 
            this.y,
            this.width, this.height);
        }    else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.trapMove = function(){
        switch(this.direction){
            case 1:
                this.y += -consSpeed;
                break;
            case 2:
                this.y += consSpeed;
                break;
            case 3:
                this.x += -consSpeed;
                break;
            case 4:
                this.x += consSpeed;

        }
    }
}

function getObstacles(){
    list = [];
    list.push(new obstacle(30, 30, "green", 600, 510, 1));
    list.push(new obstacle(30, 30, "green", 660, 510, 1));
    list.push(new obstacle(30, 30, "green", 720, 510, 1));
    list.push(new obstacle(30, 30, "green", 780, 510, 1));

    return list;
}