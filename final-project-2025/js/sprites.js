// eyeIdle = new Image();
// eyeIdle.onload = () => {

// }




class Sprite {
    constructor(src, x, y) {
        this.load = false;
        this.image = new Image(4152, 4152);
        this.image.src = src;
        this.image.onload = () => {
            this.load = true;
        };
        this.drawPosition = {
            x : x,
            y : y,
        };
        this.drawSize = 500;
        this.sourcePosition = {
            x : 0,
            y : 0,
        };
        this.sourceSize = 519;
        this.counter = 0;
    }

    draw(){
        if(!this.load) return;
        c.drawImage(
            this.image, 
            this.sourceSize * this.sourcePosition.x,
            this.sourceSize * this.sourcePosition.y,
            this.sourceSize,
            this.sourceSize,
            this.drawPosition.x,
            this.drawPosition.y,
            this.drawSize,
            this.drawSize
        )
    }

    switchFrame(){
        this.counter -= 1000 * deltaTime;
        if(this.counter <= 0){
            this.counter = 30;
            if(this.sourcePosition.x >= 7){
                this.sourcePosition.y = (this.sourcePosition.y + 1) % 7;
            }
            this.sourcePosition.x = (this.sourcePosition.x + 1) % 8;
        }
    }

    updateSprite(){
        this.draw();
        this.switchFrame();
    }
}
    
// const enemyIdleSpriteSheet = new Image(4152, 4152);

// function initSprites(){
//     enemyIdleSpriteSheet.src = "./images/eye-sprite-sheets/eyeball-idle.png";
// }


// const OffscreenCanvasIdleContext = enemyIdleSpriteSheet.getContext("")