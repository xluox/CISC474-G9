function building(width, height, color, x, y, type) {
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

}

function getBuildings(){
    list = [];
    list.push(new building(30, 30, "green", 300, 510));

    return list;
}