/*
 * Class for general game objects in "HyperJump"
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 * 
 * This code was extracted from the repository of the class
 */

"use strict";

// Global variables to select whether to display bounding boxes and colliders
let showBBox = false;
let showColl = false;

// Register event listeners to toggle bounding boxes
window.addEventListener('keydown', event => {
    if (event.key == 'y') showBBox = !showBBox;
    if (event.key == 'u') showColl = !showColl;
});


class GameObject {
    constructor(position, width, height, color, type, hostile) {
        this.position = position;
        this.size = new Vector(width, height);
        this.halfSize = new Vector(width / 2, height / 2);
        this.color = color;
        this.type = type;

        // Default scale for all new objects
        this.scale = 1.0;

        // Sprite properties
        this.spriteImage = undefined;
        this.spriteRect = undefined;

        // Intialize a collider with the default object size
        this.collision = true;  //Solid or no
        //this.setCollider(position.x, position. y, width, height);

        //If the object can be or have hostile entities
        this.hostile = false;
    }

    //To set the sprite in the area of the sprite sheet
    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }

    setScale(scale) {
        this.scale = scale;
    }

    //To draw the objects
    draw(ctx) {
        //If there is a sprite, use it
        if (this.spriteImage) {
            //If there is a specific region to draw, use that
            if (this.spriteRect) {
                ctx.drawImage(this.spriteImage,
                              // The coordiantes within the image file to show
                              this.spriteRect.x,
                              this.spriteRect.y,
                              this.spriteRect.width,
                              this.spriteRect.height,
                              // The position to draw the image
                              (this.position.x - this.halfSize.x * this.scale),
                              (this.position.y - this.halfSize.y * this.scale),
                              this.size.x * this.scale,
                              this.size.y * this.scale);
            } else {
                //If there is no specifit region, draw all the sprite
                ctx.drawImage(this.spriteImage,
                              // The position to draw the image
                              (this.position.x - this.halfSize.x * this.scale),
                              (this.position.y - this.halfSize.y * this.scale),
                              this.size.x * this.scale,
                              this.size.y * this.scale);
            }
        } else {
            //If there is no sprite, put a rect with default color
            ctx.fillStyle = this.color;
            ctx.fillRect((this.position.x - this.halfSize.x * this.scale),
                         (this.position.y - this.halfSize.y * this.scale),
                         this.size.x * this.scale,
                         this.size.y * this.scale);
        }

        //To show the limits of the sprite in the canvas (in our case, this limits are the same for the colliders)
        if (showBBox) this.drawBoundingBox(ctx);
    }

    //To show the limits of the sprite in the canvas
    drawBoundingBox(ctx) {
        // Attempt to compose the overlay so it makes the image lighter
        ctx.globalCompositeOperation = "screen";
        // A transparent layer on top
        ctx.fillStyle = "rgb(0.5, 0.5, 0.5, 0.3)";
        ctx.fillRect((this.position.x - this.halfSize.x * this.scale),
                     (this.position.y - this.halfSize.y * this.scale),
                     this.size.x * this.scale,
                     this.size.y * this.scale);
        // Return to default composition type
        ctx.globalCompositeOperation = "source-over";

        // Draw the bounding box of the sprite
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect((this.position.x - this.halfSize.x * this.scale),
                 (this.position.y - this.halfSize.y * this.scale),
                 this.size.x * this.scale,
                 this.size.y * this.scale);
        ctx.stroke();

        // A dot in the center of the sprite
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x - 2, this.position.y - 2, 4, 4);
    }

    // Empty template for all GameObjects to be able to update
    update() {

    }
}
