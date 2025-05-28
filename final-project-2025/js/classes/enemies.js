class CommonMob {
    constructor() {
        this.mapSize = 800;
        this.position = {
            baseX : canvas.width * Math.random(),
            baseY : canvas.height * Math.random(),
            x : this.mapSize * Math.random(),
            y : this.mapSize * Math.random(),
        };
        this.velocity = {
            x : 0,
            y : 0,
        };
        this.baseSize = 100 * (Math.random() + 0.8);
        this.size = canvas.width / this.baseSize;
        this.colour = "rgba(255, 140, 140, 0.8)";
        this.state = "idle";
        // this.visibility = {
        //     state : false,
        //     timer : 3000,
        // };
        this.stateTimer = Math.random() * 1 + 1;
        this.angle = Math.random() * Math.PI * 2 + 0.0001;
        this.newAngle;
        this.angleChange = false;
        this.direction = {
            x : 0,
            y : 0,
        };
        this.distanceToMove = {
            x : 0,
            y : 0,
        };
        this.speed = canvas.width / 1200;
        this.fleeSpeed = canvas.width / 1200;
        this.turnSpeed = Math.random() + 1.2;
        this.friction = canvas.width / 10;
        this.range = canvas.width / 100;
        this.fov = Math.PI / 3;
        this.visionRange = {
            x : this.size * this.range * this.direction.x,
            y : this.size * this.range * this.direction.y,
        };
        this.fear = false;
        this.image = new Image();
        this.image.src = "./images/ghost-spriteSheets/idle.png";
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
        this.sourceSize = 24;
        this.spriteTimer = 0;
        this.spriteType = "idle";
        this.lastDirection = 1;
    }

//updates the position  and size of the mob in proportion to window resize

    updateVars(){
        this.size = canvas.width / this.baseSize / mapScale;

        this.speed = canvas.width / 10 * deltaTime / mapScale;
        this.friction = 800 / canvas.width * mapScale;

        this.range = this.mapSize / 100;
        this.visionRange.x = this.size * this.range * this.direction.x;
        this.visionRange.y = this.size * this.range * this.direction.y;

        // if(this.visibility.state){
        //     this.colour = "yellow";            
        // } else {
        //     this.visibility.timer = 3000;
        // }
    }

    spriteAnimation(){        
        this.spriteTimer += 1000 * deltaTime;
        if(this.spriteTimer >= 75){
            this.spriteTimer -= 75;
            if(this.spriteType == "idle") {
                this.image.src = "./images/ghost-spriteSheets/idle.png";
                this.sourcePosition.x = (this.sourcePosition.x + 1) % 3;
            } else if(this.spriteType == "walk") {
                this.image.src = "./images/ghost-spriteSheets/walk.png";
                this.sourcePosition.x = (this.sourcePosition.x + 1) % 4;
            }
        }
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

        c.beginPath();
        c.arc(this.position.x - cameraOffset.x, this.position.y - cameraOffset.y, this.size, 0 + this.angle, Math.PI*2 + this.angle);
        c.fillStyle = this.colour;
        c.fill();
        c.closePath();

//to draw the direction/front of the enemy
        // c.beginPath();
        // c.moveTo(this.position.x - cameraOffset.x, this.position.y - cameraOffset.y);
        // c.lineTo(
        //     this.position.x + this.visionRange.x - cameraOffset.x, 
        //     this.position.y + this.visionRange.y - cameraOffset.y
        // )
        // c.lineWidth = this.mapSize / 1000;
        // c.strokeStyle = "red";
        // c.stroke();
        // c.closePath();
    }

//check for if enemy got scanned

//     updateVis() {
//         if(!player.scan.state && !this.visibility.state) return; //returns if player isnt scanning
//         const dx = player.position.oldX - this.position.x;
//         const dy = player.position.oldY - this.position.y;
//         const distance = Math.hypot(dx, dy);

//         // Check if player scan reached the creature
//         if (distance < player.scan.currentRadius + this.size) {
//             this.visibility.state = true;                        
//         }
//         this.visibility.timer -= deltaTime * 1000;
        
//         if (this.visibility.timer <= 0) {
//             this.visibility.state = false;
//         }
// }

//check if there's collision between enemy and player
    // checkPlayerCollision(){
    //     const dx = player.position.x - (this.position.x);
    //     const dy = player.position.y - (this.position.y);
    //     const distance = Math.hypot(dx, dy);
    //     if(this.visibility.state == true){
    //         return distance < (player.r + this.size);
    //     }
    // }

//generate levy flight for roaming/idle state
    levyFlight(pace = 1.0){
        const random = Math.max(Math.random(), 0.00001);
        return pace / Math.pow(random, 1 / 3);
    }

//drift of the creature between movements
    drift(){
        let slowDown = Math.exp(this.friction * deltaTime);
        this.velocity.x /= slowDown;
        this.velocity.y /= slowDown;
    }

//movement of the enemies during their idle state
    idle(){
        const dx = player.position.x - (this.position.x);
        const dy = player.position.y - (this.position.y);
        const distance = Math.hypot(dx, dy);

//if player gets too close during idle animation - all of that just to simulate realism :c
        if(distance <= 10 * this.size && this.fear == false){
            this.fear = true;
            this.velocity.x = -Math.cos(this.angle) * this.speed;
            this.velocity.y = -Math.sin(this.angle) * this.speed;
        } else if(distance >= 150 && this.fear == false){
            this.velocity.x = Math.cos(this.angle) * this.speed;
            this.velocity.y = Math.sin(this.angle) * this.speed;
        } else {
            this.velocity.x = -Math.cos(this.angle) * this.speed;
            this.velocity.y = -Math.sin(this.angle) * this.speed;
        } 
    }

//movement of the enemies when they're fleeing
    // flee(){
    //     const dx = player.position.x - this.position.x;
    //     const dy = player.position.y - this.position.y;
    //     const distance = Math.hypot(dx, dy);
    //     const freeze = this.speed / 2;
    //     this.fleeSpeed = this.speed * 10 / distance + this.speed; //flees faster the closer the player is
    //     this.angle = Math.atan2(-dy, -dx);

    //     if(distance >= player.r * 5){
    //         this.velocity.x = Math.cos(this.angle) * this.fleeSpeed;
    //         this.velocity.y = Math.sin(this.angle) * this.fleeSpeed;
    //     } else { //added freeze range (enemies move slower due to fear and how close the player is, also helps player catch the enemies)
    //         this.velocity.x = Math.cos(this.angle) * freeze;
    //         this.velocity.y = Math.sin(this.angle) * freeze;
    //     }
    // }

//randomizes the new direction of movement
    chooseDirection(){
        if(Math.hypot(this.velocity.x, this.velocity.y) <= 0.2 && this.angleChange == false){
            this.newAngle = Math.random() * Math.PI * 2 + 0.0001;
            this.angleChange = true;
        }
    }

//rotate towards the direction they want to go to
    rotate(){
        let angleDiff = this.newAngle - this.angle;
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        const maxTurn = this.turnSpeed * deltaTime;
        if(Math.abs(angleDiff) > 0.001){
            this.angle += Math.sign(angleDiff) * Math.min(maxTurn, Math.abs(angleDiff));

            this.direction.x = Math.cos(this.angle);
            this.direction.y = Math.sin(this.angle);
        } else {
            this.angleChange = false;
        }
    }

//to not move outside of canvas
    avoidEdge(edgeZone = this.mapSize / 100){
        let pullForce = this.mapSize / 200000;
        let center = {
            x : this.mapSize / 2 - this.position.x,
            y : this.mapSize / 2 - this.position.y,
        };
        let dist = Math.hypot(center.x, center.y);
        if(this.position.x >= this.mapSize - edgeZone ||
            this.position.x <= edgeZone ||
            this.position.y >= this.mapSize - edgeZone ||
            this.position.y <= edgeZone
        ){
            this.velocity.x += center.x / dist * pullForce;
            this.velocity.y += center.y / dist * pullForce;
        }
    }

//so that player cant directly eat an enemy on top of them when scanning, also makes enemies look at the player if they're too close, for more realism
    avoidPlayer(){
        const dx = player.position.x - (this.position.x);
        const dy = player.position.y - (this.position.y);
        const distance = Math.hypot(dx, dy);
        if(distance <= this.size * 10){
            this.angle = Math.atan2(dy, dx);
            this.colour = "blue";
            if(this.state != "idle"){
                this.velocity.x = Math.cos(-this.angle) * this.speed;
                this.velocity.y = Math.sin(-this.angle) * this.speed;
            } 
        }
    }

    updateBehaviour(){
        this.rotate();

        // if(this.visibility.state == true && this.state != "flee"){
        //     this.state = "flee";
        //     this.stateTimer = this.visibility.timer / 1000;
        // }

        if(this.state == "idle"){
            this.idle();
            this.stateTimer -= deltaTime;
            
            if(this.stateTimer <= 0){
                this.fear = false;
                this.stateTimer = this.levyFlight(5);
                this.state = "drift";
            }

        } else if(this.state == "drift"){
            this.drift();
            this.stateTimer -= deltaTime;

            if(this.stateTimer <= 0){                
                this.stateTimer = this.levyFlight();
                this.chooseDirection();
                this.state = "idle";
            }
        } 
        // else if(this.state == "flee"){
        //     this.flee();
        //     this.stateTimer -= deltaTime;

        //     if(this.stateTimer <= 0){             
        //         this.stateTimer = this.levyFlight(5);
        //         this.state = "drift";
        //     }
        // }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    updateMob(){
        this.updateBehaviour();
        this.updateVars();
        this.avoidEdge();
        this.avoidPlayer();
        this.spriteAnimation();
        this.alertSound();
        this.draw();
    }
}















class Leviathan {
    constructor(){
        this.mapSize = 800;
        this.position = {
            x : this.mapSize / 1.2,
            y : this.mapSize / 2.5,
            baseX : this.mapSize / 1.2,
            baseY : this.mapSize / 2.5,
        };
        this.size = {
            base : 10,
            width : 128 / 1.5,
            height : 150 / 1.5,
        };
        this.velocity = {
            x : 0,
            y : 0,
        };
        this.speed = 0;
        this.friction = 800 / canvas.width;
        this.turnSpeed = 1.3;
        this.angle = Math.PI * 5 / 3;
        this.newAngle;
        this.angleChange = false;
        this.direction = {
            x : 0,
            y : 0,
        };
        this.viewLength = 0;
        this.state = "idle";
        this.stateTimer = 0;
        this.agrv = 0;
        this.image = new Image();
        this.image.src = "./images/leviathan-spriteSheet/fly.png";
        this.image.onload = () => {
            this.load = true;
        };
        this.drawPosition = {
            x : this.position.x,
            y : this.position.y,
        };

        this.sourcePosition = {
            x : 0,
            y : 0,
        };
        this.sourceSize = {
            x : 128,
            y : 150,
        };
        this.drawSize = {
            x : this.size.width,
            y : this.size.height,
        };
        this.spriteTimer = 0;
        this.spriteType = 1;
        this.lastDirection = 1;
    }

    updateVars(){
        if(Math.abs(this.velocity.x) > 0.2 || Math.abs(this.velocity.y) > 0.2){
            this.spriteType = 6;
        } else { 
            this.spriteType = 6;
        }
        if(this.velocity.x > 0) this.lastDirection = -1;
        else if (this.velocity.x < 0) this.lastDirection = 1;
        this.speed = this.mapSize * deltaTime / 8;
        this.turnSpeed = this.agrv / 1.6 + 1;
        this.friction = 5000 / this.mapSize;

        this.drawPosition.x = this.position.x - this.size.width / 2;
        this.drawPosition.y = this.position.y - this.size.height / 2;

        //update the leviathan's aggressiveness depending on player actions
        this.agrv = Math.min(3, Math.floor(0.001 * ((player.exposure + 2) ** 2) + 0.6));
    }

    spriteAnimation(){        
        this.spriteTimer += 1000 * deltaTime;
        if(this.spriteTimer >= 90){
            this.spriteTimer -= 90;
            this.sourcePosition.y = 0;
            this.sourcePosition.x = (this.sourcePosition.x + 1) % this.spriteType;
        }
    }

    alertSound(){
        if(alertCounter != 0) return;
        playAlert();
    }

//draw function
    draw(){
        c.save();
        if (this.lastDirection === -1) {
// Facing left — flip horizontally
            c.translate(
                (this.drawPosition.x - cameraOffset.x) + this.drawSize.x,
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

        if(!this.load) return;
        c.drawImage(
            this.image, 
            this.sourceSize.x * this.sourcePosition.x,
            this.sourceSize.y * this.sourcePosition.y,
            this.sourceSize.x - 0.5,
            this.sourceSize.y - 0.5,
            0,//this.drawPosition.x - cameraOffset.x,
            0,//this.drawPosition.y - cameraOffset.y,
            this.drawSize.x,
            this.drawSize.y
        )
        c.restore();

    }

//levy flight curve (same as normal enemies)
    levyFlight(pace = 1.2){
        const random = Math.max(Math.random(), 0.00001);
        return pace / Math.pow(random, 1 / 3);
    }

//preventive, checks if the final destination of the movement will be out of bounds, if so: change in advance
    avoidEdge(edgeZone = -this.mapSize / 100){
        let moveX = this.speed * Math.cos(this.angle) * this.stateTimer;
        let moveY = this.speed * Math.sin(this.angle) * this.stateTimer;
        let destX = moveX + this.position.x;
        let destY = moveY + this.position.y;
        let center = {
            x : this.mapSize / 2 - this.position.x,
            y : this.mapSize / 2 - this.position.y,
        };
        if(destX >= canvas.width * 2 - edgeZone ||
            destX <= edgeZone ||
            destY >= canvas.height * 2 - edgeZone ||
            destY <= edgeZone
        ){
            this.angle = -this.angle;
        }

    }

//so that the leviathan doesnt straight go to player cuz of rng...
    avoidPlayer(){
        let dx = player.position.x - this.position.x;
        let dy = player.position.y - this.position.y;
        let dist = Math.hypot(dx, dy);
        let proximity = -this.mapSize / 3 * (this.agrv) + this.mapSize * 0.8;
        const spriteSize = Math.hypot(this.size.width / 2, this.size.height / 2)

        if(dist <= proximity){
            this.newAngle = Math.atan2(dy, dx);
            this.colour = "blue";
            if(this.state != "idle"){
                this.velocity.x = Math.cos(-this.angle) * this.speed;
                this.velocity.y = Math.sin(-this.angle) * this.speed;
            } 
        } else { 
            this.colour = "magenta";
        }
        if(dist <= spriteSize){
	        caughtSound.play();
            endGame();
        }
    }

//hard cap for if leviathan goes too far out
    hardEdge(edgeZone = -this.mapSize / 80){
        if(this.position.x >= this.mapSize - edgeZone ||
            this.position.x <= edgeZone ||
            this.position.y >= this.mapSize - edgeZone ||
            this.position.y <= edgeZone
        ){
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
    }

//choses where to go for next idle
    chooseDirection(){
        if(Math.hypot(this.velocity.x, this.velocity.y) <= 0.8 && this.angleChange == false){
//player's direction in rad
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const angleToPlayer = Math.atan2(-dy, dx);

//cubic fit function to convert agrv value into correct angle range
        let x = this.agrv;
        const range = -0.436332 * x ** 3 + 3.05433 * x ** 2 - 7.33038 * x + 6.28319;  

//converts the precise angle to player into a randomized range
        const minAngle = angleToPlayer - range;
        const maxAngle = angleToPlayer + range;
        const finalAngle = this.getRandomArbitrary(minAngle, maxAngle);

        this.newAngle = finalAngle;
        this.angleChange = true;
        }
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }


    rotate(){
        let angleDiff = this.newAngle - this.angle;
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        const maxTurn = this.turnSpeed * deltaTime;
        if(Math.abs(angleDiff) > 0.001){
            this.angle += Math.sign(angleDiff) * Math.min(maxTurn, Math.abs(angleDiff));

            this.direction.x = Math.cos(this.angle);
            this.direction.y = Math.sin(this.angle);
        } else {
            this.angleChange = false;
        }
    }

    idle(){
        this.velocity.x = Math.cos(this.angle) * this.speed;
        this.velocity.y = -Math.sin(this.angle) * this.speed;
    }

    drift(){
        let slowDown = Math.exp(this.friction * deltaTime);
        this.velocity.x /= slowDown;
        this.velocity.y /= slowDown;
    }

    roam(){
        if(this.state == "idle"){
            this.idle();
            this.stateTimer -= deltaTime;
            
            if(this.stateTimer <= 0){
                this.stateTimer = this.levyFlight(5);
                this.state = "drift";
                this.avoidEdge();
            }

        } else if(this.state == "drift"){
            this.drift();
            this.stateTimer -= deltaTime;

            if(this.stateTimer <= 0){                
                this.stateTimer = this.levyFlight(4);
                this.chooseDirection();
                this.state = "idle";
                this.avoidEdge();
            }
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    lurk(){
        if(this.state == "idle"){
            this.idle();
            this.stateTimer -= deltaTime;
            
            if(this.stateTimer <= 0){
                this.stateTimer = this.levyFlight(3);
                this.state = "drift";
                this.avoidEdge();
            }

        } else if(this.state == "drift"){
            this.drift();
            this.stateTimer -= deltaTime;

            if(this.stateTimer <= 0){                
                this.stateTimer = this.levyFlight(2);
                this.chooseDirection();
                this.state = "idle";
                this.avoidEdge();
            }
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

//leviathan becomes more aggressive and shows itself more often
    stalk(){    
        this.alertSound();
        if(this.state == "idle"){
            this.idle();
            this.stateTimer -= deltaTime;
            
            if(this.stateTimer <= 0){
                this.stateTimer = this.levyFlight(1);
                this.state = "drift";
                this.avoidEdge();
            }

        } else if(this.state == "drift"){
            this.drift();
            this.stateTimer -= deltaTime;

            if(this.stateTimer <= 0){                
                this.stateTimer = this.levyFlight(1);
                this.chooseDirection();
                this.state = "idle";
                this.avoidEdge();
            }
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

//leviathan hunts the player down to eliminate them
    hunt(){
        playHunt();
        let dx = player.position.x - this.position.x;
        let dy = player.position.y - this.position.y;
        this.angle = Math.atan2(-dy, dx);

        this.velocity.x = Math.cos(this.angle) * this.speed;
        this.velocity.y = Math.sin(-this.angle) * this.speed;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

//updates leviathan's behaviour depending on its aggressiveness
    updateBehaviour(){
        if(this.agrv == 0){
            this.roam();
        } else if(this.agrv == 1){
            this.lurk();
        } else if(this.agrv == 2){
            this.stalk();
        } else {
            this.hunt();
        }
    }

    updateLev(){
        this.updateBehaviour();
        this.updateVars();
        this.avoidPlayer();
        this.hardEdge();
        this.spriteAnimation();
        this.rotate();
    }

}