/*
 * Classes for regions in in "HyperJump"
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 */

"use strict";

//Region used for drawing objects
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

//Region for generation of platforms 
class generation_zone {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
    }
}
