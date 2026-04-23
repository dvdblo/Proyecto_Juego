/*
 * Collection of functions that will be used in "HyperJump"
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 */

"use strict";

/*
 * Detect a collision of two box colliders
 *
 * Arguments:
 * - obj1: An instance of the Rect class with properties x, y, width, height
 * - obj2: An instance of the Rect class with properties x, y, width, height
 *
 * Returns:
 * - the direction of the collision
 */
function boxOverlap(obj1, obj2, deltaTime, dephase) {

    //Previous position (change from the old function)
    const prevX = obj1.position.x - (obj1.velocity?.x || 0) * deltaTime;
    const prevY = obj1.position.y - (obj1.velocity?.y || 0) * deltaTime;

    //Obj1 limits
    const L1 = obj1.position.x - obj1.halfSize.x;
    const R1 = obj1.position.x + obj1.halfSize.x;
    const T1 = obj1.position.y - obj1.halfSize.y;
    const B1 = obj1.position.y + obj1.halfSize.y;

    //Obj2 limits
    const L2 = obj2.position.x - obj2.halfSize.x;
    const R2 = obj2.position.x + obj2.halfSize.x;
    const T2 = obj2.position.y - obj2.halfSize.y/dephase;
    const B2 = obj2.position.y + obj2.halfSize.y;

    //If there is no overlap, you can return
    if (!(L1 < R2 && R1 > L2 && T1 < B2 && B1 > T2)) {
        return false;
    }
    

    //Previous limits
    const prevL1 = prevX - obj1.halfSize.x;
    const prevR1 = prevX + obj1.halfSize.x;
    const prevT1 = prevY - obj1.halfSize.y;
    const prevB1 = prevY + obj1.halfSize.y;

    //Check the side of the collision (change from the old function)
    //From top
    if (prevB1 <= T2) {  //Asks if in the previous position, the objects were seprated from that direction, if true, that means thats the direction of the collision
        return "top";
    }

    //From bottom
    if (prevT1 >= B2) {
        return "bottom";
    }

    //From left
    if (prevR1 <= L2) {
        return "left";
    }

    //From right
    if (prevL1 >= R2) {
        return "right";
    }
}

/*
 * Generate a random integer in the range [start, start + size - 1]
 *
 * Arguments:
 * - size: The size of the range (number of possible values)
 * - start: The starting value of the range (default is 0)
 *
 * Returns:
 * - A random integer in the specified range
*/
function randomRange(size, start) {
    return Math.floor(Math.random() * size) + ((start === undefined) ? 0 : start);
}

//To add a platform in the game (thus was a method in class Game, now it is here)
function addPlatform(x, y, width, height, lst, unit, hostile) {

    const box = new AnimatedObject(
        new Vector(x, y),
        width*unit,
        height*unit,
        "gray",
        "obstacle",
        6
    );
    
    box.setSprite(`../assets/sprites/plataformas_auto/1_${gameConfig.actualDiff}.png`,
                            new Rect(1024, 0, 1024, 450));  // If we want to draw the whole sprite, no need to add a rect
    //box.setAnimation(1, 1, true, 200);
    box.destroy = false;
    box.hostile = hostile;
    lst.push(box);
}

//OLD FUNCTION, MAINTAINING THIS FOR POSIBLE REFERENCE IN FUTURE
// function boxOverlap(obj1, obj2, deltaTime) {

//     //Limits of obj1
//     const L1 = obj1.position.x - obj1.halfSize.x + obj1.halfSize.x*0.1; //This "size*0.x" is to reduce the region of the object, solves the "apparent double/instant jump" and "top side magnetic platform" bug
//     const R1 = obj1.position.x + obj1.halfSize.x - obj1.halfSize.x*0.1;
//     const T1 = obj1.position.y - obj1.halfSize.y;
//     const B1 = obj1.position.y + obj1.halfSize.y;

//     //Limits of obj2
//     const L2 = obj2.position.x - obj2.halfSize.x;
//     const R2 = obj2.position.x + obj2.halfSize.x;
//     const T2 = obj2.position.y - obj2.halfSize.y;
//     const B2 = obj2.position.y + obj2.halfSize.y;

//     // Compare the values to determine if the boxes overlap and direction
//     if (L1 < R2 && R1 > L2 && T1 < B2 && B1 > T2) {

//         //In X
//         const overlapX = Math.min(R1, R2) - Math.max(L1, L2);

//         //In Y
//         const overlapY = Math.min(B1, B2) - Math.max(T1, T2);

//         //Gives preference to X overlap
//         if (overlapX < overlapY) {

//             //Lateral collisions
//             if (obj1.position.x < obj2.position.x) {
//                 return "left";
//             } else {
//                 return "right";
//             }
//         } else {
//             //Vertical collisions
//             if (obj1.position.y < obj2.position.y) {
//                 return "top";
//             } else {
//                 return "bottom";
//             }
//         }
//     }
//     return false;
// }