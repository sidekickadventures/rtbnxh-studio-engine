// RTBNXH Studio Engine - 100% Local / Secure
// No data sent anywhere. Runs inside your browser locally.

// Wait for DOM
document.addEventListener('DOMContentLoaded', init);

// Configuration
const playerEl = document.getElementById('player');
const posXDisplay = document.getElementById('pos-x');
const posYDisplay = document.getElementById('pos-y');
const backgroundEl = document.getElementById('background');

// Settings
const speed = 6;
// Update default start to middle of a 1360x768 image
let px = 680; 
let py = 380; 

const keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

// We will load the yellow line image onto a hidden canvas to check collision pixels
const collisionCanvas = document.createElement('canvas');
const ctx = collisionCanvas.getContext('2d', { willReadFrequently: true });
let maskReady = false;

// 1. Setup the mask image
function init() {
    const maskImg = new Image();
    maskImg.crossOrigin = "Anonymous"; 
    
    // We expect a file called path_mask.jpg in this folder.
    maskImg.src = 'path_mask.jpg?' + new Date().getTime(); // Force reload to avoid browser cache
    backgroundEl.style.backgroundImage = "url('bg.jpg')";

    maskImg.onload = () => {
        // Size the canvas to the background image dimensions
        collisionCanvas.width = maskImg.width;
        collisionCanvas.height = maskImg.height;
        ctx.drawImage(maskImg, 0, 0);
        maskReady = true;
        console.log("Collision mask loaded. Dimensions:", maskImg.width, maskImg.height);
        
        // Let's find the FIRST walkable pixel to start the player at, just in case (680, 380) is off the path
        findStartingPoint();

        // Start the game loop only when the mask is ready
        requestAnimationFrame(update);
    };
    
    maskImg.onerror = () => {
        console.warn("⚠️ NO path_mask.jpg FOUND. Movement will be unrestricted.");
        maskReady = false;
        requestAnimationFrame(update);
    };

    // Listen for keys
    window.addEventListener('keydown', e => { if (keys.hasOwnProperty(e.key)) keys[e.key] = true; });
    window.addEventListener('keyup', e => { if (keys.hasOwnProperty(e.key)) keys[e.key] = false; });
}

function findStartingPoint() {
    // If the default center is valid, stick with it
    if (isWalkable(px, py)) return;

    // Otherwise, scan from the center outward to drop them safely on the yellow path
    console.log("Starting position wasn't yellow. Finding a safe drop point...");
    const centerX = Math.floor(collisionCanvas.width / 2);
    const centerY = Math.floor(collisionCanvas.height / 2);
    
    // Quick outward spiral search
    for (let r = 10; r < 800; r += 20) {
        for (let a = 0; a < Math.PI * 2; a += 0.5) {
            let tx = centerX + Math.cos(a) * r;
            let ty = centerY + Math.sin(a) * r;
            if (isWalkable(tx, ty)) {
                px = tx;
                py = ty;
                console.log("Dropped player at: ", px, py);
                return;
            }
        }
    }
}

// 2. The Game Loop
function update() {
    let dx = 0;
    let dy = 0;

    // Movement intent
    if (keys.w || keys.ArrowUp) dy = -speed;
    if (keys.s || keys.ArrowDown) dy = speed;
    if (keys.a || keys.ArrowLeft) dx = -speed;
    if (keys.d || keys.ArrowRight) dx = speed;

    // Normalize diagonal speed so you don't move 1.4x faster diagonally
    if (dx !== 0 && dy !== 0) {
        const factor = speed / Math.sqrt(dx*dx + dy*dy);
        dx *= factor;
        dy *= factor;
    }

    // Try moving X axis first
    if (dx !== 0 && isWalkable(px + dx, py)) {
        px += dx;
    }
    // Try moving Y axis second (sliding along walls)
    if (dy !== 0 && isWalkable(px, py + dy)) {
        py += dy;
    }

    // Apply movement
    playerEl.style.left = px + 'px';
    playerEl.style.top = py + 'px';
    
    // Y-SORTING (Depth illusion): The lower on screen (higher Y), the higher the z-index
    playerEl.style.zIndex = Math.floor(py);

    // Update UI
    posXDisplay.innerText = Math.floor(px);
    posYDisplay.innerText = Math.floor(py);

    requestAnimationFrame(update);
}

// 3. Collision Detection against the Yellow Lines Image
function isWalkable(x, y) {
    if (!maskReady) return true; // Fail open if no mask

    // Ensure we are inside the image bounds
    if (x < 0 || x >= collisionCanvas.width || y < 0 || y >= collisionCanvas.height) return false;

    // Grab the pixel at the target coordinate
    const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    // UPDATED THRESHOLD: Any pixel that is significantly bright and has more red/green than blue
    // Backgrounds are dark (under 50). This easily catches blurry JPEG edges of the yellow lines.
    const isYellowPath = (r > 80 && g > 80 && b < r);
    
    return isYellowPath;
}
