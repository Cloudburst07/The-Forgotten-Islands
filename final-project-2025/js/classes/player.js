class Player {
    constructor({position}) {
        this.load = false;
        this.position = position;
        this.velocity = {
            x : 0,
            y : 0,
        };
        this.accel = 0.1;
        this.friction = 0.05;
        this.width = 12 * dpr;
        this.height = 14 * dpr;
        this.colour = "rgba(0, 0, 255, 1)";
        this.maxSpeed = 4;
        this.health = {
            baseValue : 1000,
            value : 1000,
            decay : 25,
            upgrade : 1,
            colour : "rgba(149, 235, 154, 0.8)",
            size : 0,
        }
        this.image = new Image();
        this.image.src = "./images/player-spriteSheet/player.png";
        this.image.onload = () => {
            this.load = true;
        };
        this.drawPosition = {
            x : this.position.x,
            y : this.position.y,
        };
        this.drawSize = 0;
        this.sourcePosition = {
            x : 0,
            y : 0,
        };
        this.sourceSize = 32;
        this.spriteTimer = 0;
        this.spriteType = "idle";
        this.lastDirection = 1;
        this.cornerNudge = 0.4;
        this.cornerSlack = 4;
        this.hint = false;
        this.sanity = 1;
        this.exposure = 0;
        this.exposureDecay = 5;
        this.footstepTimer = 0;
    }

    updateVariables(){
//keep player related size variables proportional to window size
        this.accel = 2;
        this.maxSpeed = 0.75;
        this.friction = this.width * 5;

//health related vars
        if(this.health.value >= 0 && !isPage){
            if(Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1){
                this.health.value += this.health.decay * deltaTime * 3;
            } else if(this.health.value > 0){
                this.health.value -= this.health.decay * deltaTime;
            } else if(this.health.value <= 0){
                this.health.value = 0;
            }
            this.health.size = this.health.value / this.health.baseValue * this.width * 1.5;
        }
//max health
        if(this.health.value >= 1000){
            this.health.value = this.health.baseValue;
        } else if(this.health.value >= 750){
            this.sanity = 1;
        } else if(this.health.value >= 500){
            this.sanity = 2;
            playSanity();
        } else if(this.health.value >= 250){
            this.sanity = 3;
            playSanity();
        } else if(this.health.value > 0){
            this.sanity = 4;
            playSanity();
        } else if(this.health.value <= 0){
            endGame();
        }

//exposure relatated 
        if(Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1){
            this.exposure += this.exposureDecay * deltaTime;
        } else if(this.exposure > 0){
            this.exposure -= this.exposureDecay * deltaTime / 2
        } else if(this.exposure <= 0){
            this.exposure = 0;
        }
//sprite
            this.drawPosition.x = this.position.x - this.width / 1.3;
            this.drawPosition.y = this.position.y - this.height / 1.1;
            this.drawSize = 15 * 2.1;
    }

    spriteAnimation(){        
        this.spriteTimer += 1000 * deltaTime;
        if(this.spriteTimer >= 75){
            this.spriteTimer -= 75;
            if(this.spriteType == "idle") {
                this.sourcePosition.y = 0;
                this.sourcePosition.x = (this.sourcePosition.x + 1) % 6;
            } else if(this.spriteType == "run") {
                this.sourcePosition.y = 1;
                this.sourcePosition.x = (this.sourcePosition.x + 1) % 8;
            } else if(this.spriteType == "death"){
                this.sourcePosition.y = 5
            } else if(this.spriteType == "stop"){
                this.sourcePosition.y = 2;
                this.sourcePosition.x = (this.sourcePosition.x + 1) % 4;
            }
        }
    }

    footstep(){
        if(this.spriteType != "run") return;
        this.footstepTimer += 1000 * deltaTime;
        if(this.footstepTimer >= 300){
            this.footstepTimer -= 300;
            alternateFootstepSound();
        }
    }


    applyMovement(){
//apply accel depending on key pressed
        if(isPage){
            return;
        }
        if(key.w){ 
            this.velocity.y -= this.accel * deltaTime;
            this.spriteType = "run";
        }
        if(key.a){ 
            this.lastDirection = -1;
            this.velocity.x -= this.accel * deltaTime;
            this.spriteType = "run";
        }
        if(key.s){ 
            this.velocity.y += this.accel * deltaTime;
            this.spriteType = "run";
        }
        if(key.d){ 
            this.lastDirection = 1;
            this.velocity.x += this.accel * deltaTime;
            this.spriteType = "run";
        }

//check if movement is being applied
        if(key.w == false && key.s == false && Math.abs(this.velocity.y) > 0){
            this.velocity.y = this.applyDeceleration(this.velocity.y);
        }
        if(key.a == false && key.d == false){
            this.velocity.x = this.applyDeceleration(this.velocity.x);
        }

//limit the player's max speed
        if(Math.abs(this.velocity.x) >= this.maxSpeed){
            this.velocity.x = Math.sign(this.velocity.x) * this.maxSpeed;
        }
        if(Math.abs(this.velocity.y) >= this.maxSpeed){
            this.velocity.y = Math.sign(this.velocity.y) * this.maxSpeed;
        }
//reset sprite
        if(Math.abs(this.velocity.x) <= 0 && Math.abs(this.velocity.y) <= 0){
            this.spriteType = "idle";
        }
    }

    applyDeceleration(velocity){
        const slowDown = this.friction * deltaTime * 0.1;
        if(velocity > 0){
            return Math.max(velocity - slowDown, 0);
        } else if(velocity < 0){
            return Math.min(velocity + slowDown, 0);
        }
        return velocity;
    }

    draw(){

        c.save();
        if (this.lastDirection === -1) {
// Facing left — flip horizontally
            c.translate(
                (this.drawPosition.x - cameraOffset.x) + this.drawSize,
                this.drawPosition.y - cameraOffset.y
            );
            c.scale(-1, 1);
        } else {
// Facing right — normal
            c.translate(
                this.drawPosition.x - cameraOffset.x,
                this.drawPosition.y - cameraOffset.y
            );
        }

//draw sprite
        if(!this.load) return;
        c.drawImage(
            this.image, 
            this.sourceSize * this.sourcePosition.x,
            this.sourceSize * this.sourcePosition.y,
            this.sourceSize,
            this.sourceSize,
            0,//this.drawPosition.x - cameraOffset.x,
            0,//this.drawPosition.y - cameraOffset.y,
            this.drawSize,
            this.drawSize
        )

        c.restore();
    }
//camera movement
    cameraPanning(){
        cameraOffset.x = this.position.x - canvas.width / mapScale / 2;
        cameraOffset.y = this.position.y - canvas.height / mapScale / 2;
        
    }

// if player gets too close to the edge (useless)
    deathZone(){
        const dx = this.position.x - leviathan.position.x;
        const dy = this.position.y - leviathan.position.y;
        const dist = Math.hypot(dx, dy);        

        if(dist < 200){
            const intensity = -(dist) / 40 + 5;
            applyShake(intensity);
        } else {
            resetShake();
        }
    }

    checkForHorizontalCollisions(collisionBlocks) {
        const buffer = 0.0001;

        for (let i = 0; i < collisionBlocks.length; i++) {
            const block = collisionBlocks[i];

            const isColliding =
                this.position.x <= block.x + block.width &&
                this.position.x + this.width >= block.x &&
                this.position.y + this.height >= block.y &&
                this.position.y <= block.y + block.height;

            if (!isColliding) continue;

            const dx = (this.position.x + this.width / 2) - (block.x + block.width / 2);
            const dy = (this.position.y + this.height / 2) - (block.y + block.height / 2);
            const dist = Math.hypot(dx, dy);
            const maxAllowedDist = Math.hypot((this.width + block.width) / 2, (this.height + block.height) / 2);

            if (dist > maxAllowedDist - this.cornerSlack) {
                // soft collision — gently push away from the corner
                const nudgeDirection = Math.sign(dx); // +1 means push right, -1 push left
                this.position.x += nudgeDirection * this.cornerNudge;
                continue;
            }

            // Hard collision
            if (this.velocity.x < 0) {
                this.velocity.x = 0;
                this.position.x = block.x + block.width + buffer;
                break;
            }

            if (this.velocity.x > 0) {
                this.velocity.x = 0;
                this.position.x = block.x - this.width - buffer;
                break;
            }
        }
    }

    checkForVerticalCollisions(collisionBlocks) {
        const buffer = 0.0001;

        for (let i = 0; i < collisionBlocks.length; i++) {
            const block = collisionBlocks[i];

            const isColliding =
                this.position.x <= block.x + block.width &&
                this.position.x + this.width >= block.x &&
                this.position.y + this.height >= block.y &&
                this.position.y <= block.y + block.height;

            if (!isColliding) continue;

            const dx = (this.position.x + this.width / 2) - (block.x + block.width / 2);
            const dy = (this.position.y + this.height / 2) - (block.y + block.height / 2);
            const dist = Math.hypot(dx, dy);
            const maxAllowedDist = Math.hypot((this.width + block.width) / 2, (this.height + block.height) / 2);

            if (dist > maxAllowedDist - this.cornerSlack) {
                // soft corner — gently push out of it
                const nudgeDirection = Math.sign(dy); // +1 = push down, -1 = push up
                this.position.y += nudgeDirection * this.cornerNudge;
                continue;
            }

            // Hard collision
            if (this.velocity.y < 0) {
                this.velocity.y = 0;
                this.position.y = block.y + block.height + buffer;
                break;
            }

            if (this.velocity.y > 0) {
                this.velocity.y = 0;
                this.position.y = block.y - this.height - buffer;
                break;
            }
        }
    }

    checkInteractibles(){
        const playerCenter = {
            x : player.position.x - player.width / 2,
            y : player.position.y - player.height / 2
        }
        if(
            playerCenter.x >= 588 &&
            playerCenter.x <= 704 &&
            playerCenter.y >= 176 &&
            playerCenter.y <= 255
        ){
            this.showInput(5);
        } else if(            
            playerCenter.x >= 42 &&
            playerCenter.x <= 82 &&
            playerCenter.y >= 644 &&
            playerCenter.y <= 688
        ){
            this.showInput(1);
        } else if(            
            playerCenter.x >= 92 &&
            playerCenter.x <= 130 &&
            playerCenter.y >= 318 &&
            playerCenter.y <= 368
        ){
            this.showInput(2);
        } else if(            
            playerCenter.x >= 356 &&
            playerCenter.x <= 402 &&
            playerCenter.y >= 250 &&
            playerCenter.y <= 290
        ){
            this.showInput(3);
        } else if(            
            playerCenter.x >= 550 &&
            playerCenter.x <= 598 &&
            playerCenter.y >= 656 &&
            playerCenter.y <= 704
        ){
            this.showInput(4);
        } else {
            this.closeInput();
        }
    }

    showInput(scene){
        sceneToShow = scene;
        this.hint = true;
    }

    closeInput(){
        this.hint = false;
    }


    updatePlayer(deltaTime, collisionBlocks){
    
        if (!deltaTime || !isGame) return;
        this.cameraPanning();
        this.applyMovement();
        this.deathZone();
        this.checkInteractibles();
        this.updateVariables();
        this.spriteAnimation();
        this.footstep();

        this.position.x += this.velocity.x;
        this.checkForHorizontalCollisions(collisionBlocks)
        this.position.y += this.velocity.y;
        this.checkForVerticalCollisions(collisionBlocks)

    }
}
