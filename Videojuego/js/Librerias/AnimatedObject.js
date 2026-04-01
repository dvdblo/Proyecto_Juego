/*
 * Class for an animated game object in "HyperJump"
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 */

"use strict";

// Class to control the animation of characters and objects
class AnimatedObject extends GameObject {
    constructor(position, width, height, color, type, sheetCols) {
        super(position, width, height, color, type);
        // Animation properties
        this.frame = 0;
        this.minFrame = 0;
        this.maxFrame = 0;
        this.sheetCols = sheetCols;

        this.repeat = true;

        // Delay between frames (in milliseconds)
        this.frameDuration = 100;
        this.totalTime = 0;
    }

    setAnimation(minFrame, maxFrame, repeat, duration) {
        this.minFrame = minFrame;
        this.maxFrame = maxFrame;
        this.frame = minFrame;
        this.repeat = repeat;
        this.totalTime = 0;
        this.frameDuration = duration;
    }

    /*
     * Change the frame number to the next one.
     * Loop back to the first frame if the animation is set to repeat.
     * Also set the rectangle to be drawn from the spritesheet according to the current frame.
     *
     * Arguments:
     *   deltaTime: Time elapsed since the last frame (in milliseconds)
     */
    updateFrame(deltaTime) {
        this.totalTime += deltaTime;
        if (this.totalTime > this.frameDuration) {

            // Loop around the animation frames if the animation is set to repeat
            // Otherwise stay on the last frame
            let restartFrame = this.repeat ? this.minFrame : this.maxFrame;

            this.frame = this.frame == this.maxFrame ? restartFrame : this.frame + 1;

            //Changes the area to draw from the sprite sheet
            this.spriteRect.x = this.frame % this.sheetCols * this.spriteRect.width;
            this.spriteRect.y = Math.floor(this.frame / this.sheetCols) * this.spriteRect.height;

            // Restart the time count
            this.totalTime = 0;
        }
    }
}
