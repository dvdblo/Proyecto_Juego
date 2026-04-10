/*
 * Class for the principal game object (player) in "HyperJump"
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 */

class AnimatedPlayer extends AnimatedObject {
    constructor( position, width, height, color, sheetCols, motion ) {
        super(
            position,
            width,
            height,
            color,
            "player",
            sheetCols
        );

        this.velocity = new Vector(0, 0);
        this.speed = 1.0; // Default value for player speed

        //For gravity simulation
        this.fallSpeed = 0;
        this.gravity = 0.0009;
        this.jumpForce = -0.6;
        this.onGround = false;

        //Keys pressed to move the player
        this.keys = [];

        //Data structure with the directions a character can move, the
        //direction sign and the related animation.
        this.motion = motion;
    }

    //To update the player
    update(deltaTime, canvas) {

        // Restart the velocity on x
        this.velocity.x = 0;

        // Modify the velocity according to the directions pressed
        for (const direction of this.keys) {

            //Jump movement, only if the player is on the ground
            if (direction === "up" && this.onGround) {
                this.fallSpeed = this.jumpForce;  //The fall speed controls if player goes up or down, and the velocity
                this.onGround = false;
            }
            if (this.fallSpeed > 1.5) {  //Max velocity
                this.fallSpeed = 1.5;
            }

            //Controls the velocity in X and Y
            const axis = this.motion[direction].axis;
            const sign = this.motion[direction].sign;

            this.velocity[axis] += sign;

            //Adapt the animation according to the direction
            const dirData = this.motion[direction];

            //Make changes only if the direction is different
            if (!dirData.status) {
                dirData.status = true;
                this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
            }
        }

        //Simulation of gravity
        this.fallSpeed += this.gravity * deltaTime;
        this.velocity.y = this.fallSpeed;

        //Movement in X
        this.velocity.x *= this.speed;

        //New position
        this.position = this.position.plus(this.velocity.times(deltaTime));

        //Restrict the player to move only within the canvas area
        this.clampWithinCanvas(canvas);

        // Update to show then next frame when necessary
        this.updateFrame(deltaTime);

        // Change the collider's position
        //this.setCollider(this.position.x, this.position.y,this.width, this.height);
    }

    clampWithinCanvas(canvas) {
        // Top border
        if (this.position.y - this.halfSize.y < 0) {
            this.position.y = this.halfSize.y;
        }
        // Left border
        if (this.position.x - this.halfSize.x < 0) {
            this.position.x = this.halfSize.x;
        }
        // Bottom border (in the future, this is going to have a game over condition)
        if (this.position.y + this.halfSize.y > canvas.height) {
            this.position.y = canvas.height - this.halfSize.y;
            this.fallSpeed = 0;
            this.onGround = true;
        }
        // Right border
        if (this.position.x + this.halfSize.x > canvas.width*3) { //The constant represet the size where the player can move 
            this.position.x = canvas.width*3 - this.halfSize.x;
            gameConfig.levelComplete = true;
        }
    }

    //To set the speed
    setSpeed(newSpeed) {
        this.speed = newSpeed;
    }

    //To detect the keys pressed
    startMovement(direction) {
        
        // Check whether we are already moving in a direction
        const dirData = this.motion[direction];

        // Make changes only if the direction is different
        if (!dirData.status) {
            dirData.status = true;
            this.setAnimation(...dirData.moveFrames, dirData.repeat, dirData.duration);
        }
    }

    //To stop movement when key is released
    stopMovement(direction) {
        const dirData = this.motion[direction];
        dirData.status = false;
        this.setAnimation(...dirData.idleFrames, dirData.repeat, dirData.duration);
    }
}
