const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1

canvas.width = innerWidth;
canvas.height = innerHeight;

const mapScale = 6;

function initCreatures(){
	const player = new Player({
	    position : {
	        x : 96,
			// x : 640,
	        y : 704,
	        oldX : 0,
	        oldY : 0,
	    },
	});
	const leviathan = new Leviathan();
}


const hintImage = new Image();
hintImage.src = "./images/keys/Pixel Keys x16/Tiles White/pxkw_e.png";

let endAnimationFrame;
let deltaTime = 0.016;
let lastTime = performance.now();
let key = {
    w : false, 
    a : false, 
    s : false, 
    d : false
}

let cameraOffset = {
    x : player.position.x - canvas.width / 2 / mapScale + player.width,
    y : player.position.y - canvas.height / 2 / mapScale + player.height,
}

let mobs = [];
let maxMobs = 100;

const layersData = {
   l_Ground: l_Ground,
   l_Alternating_Sides: l_Alternating_Sides,
   l_Sides: l_Sides,
   l_Bricks: l_Bricks,
   l_bottom_static_decorations: l_bottom_static_decorations,
//    l_Animation_Blocks: l_Animation_Blocks,
   l_Animated_Decorations: l_Animated_Decorations,
   l_Collisions: l_Collisions,
   l_Boss: l_Boss,
};

const frontRendersLayersData = {
   l_Static_Decorations: l_Static_Decorations,
   l_Static_Decorations_overlap: l_Static_Decorations_overlap,
}

const tilesets = {
  l_Ground: { imageUrl: './images/background-spriteSheets/4183f421-954c-4fe7-5310-56cea0135e00.png', tileSize: 16 },
  l_Alternating_Sides: { imageUrl: './images/background-spriteSheets/3df0be51-6c03-4154-88f8-10fe93f5df00.png', tileSize: 16 },
  l_Sides: { imageUrl: './images/background-spriteSheets/3df0be51-6c03-4154-88f8-10fe93f5df00.png', tileSize: 16 },
  l_Bricks: { imageUrl: './images/background-spriteSheets/593d229c-a250-4e43-5d3e-b36806ccd900.png', tileSize: 16 },
  l_bottom_static_decorations: { imageUrl: './images/background-spriteSheets/33431420-5af8-4b94-dfd5-16dd0b4d4b00.png', tileSize: 16 }, 
  l_Static_Decorations: { imageUrl: './images/background-spriteSheets/33431420-5af8-4b94-dfd5-16dd0b4d4b00.png', tileSize: 16 },
  l_Static_Decorations_overlap: { imageUrl: './images/background-spriteSheets/33431420-5af8-4b94-dfd5-16dd0b4d4b00.png', tileSize: 16 },
  l_Animation_Blocks: { imageUrl: './images/background-spriteSheets/0419bf63-e4e3-43da-ab0b-f735ba10a500.png', tileSize: 16 },
  l_Animated_Decorations: { imageUrl: './images/background-spriteSheets/d981a516-267b-4732-cab7-12744ccc0300.png', tileSize: 16 },
  l_Collisions: { imageUrl: './images/background-spriteSheets/3df0be51-6c03-4154-88f8-10fe93f5df00.png', tileSize: 16 },
  l_Boss: { imageUrl: './images/background-spriteSheets/75420c4e-0756-4a47-720f-5f7f2a268600.png', tileSize: 16 },
};

// Tile setup
const collisionBlocks = []
const blockSize = 16 // Assuming each tile is 16x16 pixels

collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        }),
      )
    }
  })
})

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  // Calculate the number of tiles per row in the tileset
  // We use Math.ceil to ensure we get a whole number of tiles
  const tilesPerRow = Math.ceil(tilesetImage.width / tileSize)

  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        // Adjust index to be 0-based for calculations
        const tileIndex = symbol - 1

        // Calculate source coordinates
        const srcX = (tileIndex % tilesPerRow) * tileSize
        const srcY = Math.floor(tileIndex / tilesPerRow) * tileSize

        context.drawImage(
          tilesetImage, // source image
          srcX,
          srcY, // source x, y
          tileSize,
          tileSize, // source width, height
          x * 16,
          y * 16, // destination x, y
          16,
          16, // destination width, height
        )
      }
    })
  })
}

const renderStaticLayers = async (layersData) => {
  const offscreenCanvas = document.createElement('canvas')
  offscreenCanvas.width = canvas.width
  offscreenCanvas.height = canvas.height
  const offscreenContext = offscreenCanvas.getContext('2d')

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName]
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl)
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext,
        )
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error)
      }
    }
  }

  // Optionally draw collision blocks and platforms for debugging
//   collisionBlocks.forEach(block => block.draw(offscreenContext));

  return offscreenCanvas
}

function winGame(){
	cancelAnimationFrame(endAnimationFrame);
	document.getElementById("win-screen").style.display = "block";
	updateLore();
	winSound.play();
	stopAllSound();
}

function endGame(){
	cancelAnimationFrame(endAnimationFrame);
	document.getElementById("end-screen").style.display = "block";
}

function restart(){
	window.location.reload();
}

function menu(){
	document.getElementById("start-screen").style.display = "none";
	menuMusic.play();
	setVolume();
	updateLore();
}

const menuButtons = document.getElementsByClassName("menu-buttons");

function info(){
	document.getElementById("title").style.transform = "translate(-50%, -250%)";
	for (let i = 0; i < 4; i++) {
		menuButtons[i].style.transform = "translate(-50%, 900%)";
	}
	document.getElementById("info").style.display = "block";
}

function credits(){
	document.getElementById("title").style.transform = "translate(-50%, -250%)";
	for (let i = 0; i < 4; i++) {
		menuButtons[i].style.transform = "translate(-50%, 900%)";
	}
	document.getElementById("credits").style.display = "block";
}

function back(){
	document.getElementById("title").style.transform = "translate(-50%, -50%)";
	for (let i = 0; i < 4; i++) {
		menuButtons[i].style.transform = "translate(-50%, -50%)";
	}
	document.getElementById("credits").style.display = "none";
	document.getElementById("info").style.display = "none";
}

let frontRendersCanvas
//animates the game
function animate(backgroundCanvas){
    c.save();
    c.clearRect(0, 0, canvas.width, canvas.height);
    // c.translate(-cameraOffset.x ,-cameraOffset.y);
    c.scale(dpr, dpr);
    c.scale(mapScale, mapScale);
    c.drawImage(backgroundCanvas, 0 - cameraOffset.x, 0 - cameraOffset.y);
	player.draw();
	c.drawImage(frontRendersCanvas, 0 - cameraOffset.x, 0 - cameraOffset.y);
    leviathan.draw();
//draw health bar
        if(player.lastDirection === -1){
            c.beginPath();
            c.fillStyle = player.health.colour;
            c.fillRect(
                player.position.x - player.width / 3 - cameraOffset.x, 
                player.position.y - player.height / 2 - cameraOffset.y, 
                player.health.size, 
                player.height / 8
            )
            c.fill()
            c.closePath();
        } else {
            c.beginPath();
            c.fillStyle = player.health.colour;
            c.fillRect(
                player.position.x - player.width / 10 - cameraOffset.x, 
                player.position.y - player.height / 2 - cameraOffset.y, 
                player.health.size, 
                player.height / 8
            )
            c.fill()
            c.closePath();
        }
        if(player.hint){
            c.drawImage(
                hintImage, 
                0,
                0,
                16,
                16,
                player.drawPosition.x + player.width - cameraOffset.x,
                player.drawPosition.y - 4 - cameraOffset.y,
                8,
                8
            )
        }
    c.restore();



    leviathan.updateLev();
    player.updatePlayer(deltaTime, collisionBlocks);
}

//update/gameloop
function update(backgroundCanvas){
    const currentTime = performance.now();
    deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    if(isNaN(deltaTime) || !isFinite(deltaTime)){
        console.warn("Bad deltaTime: ", deltaTime);
        deltaTime = 0.016; //fallback for if dt is undefined or NaN
    }

    animate(backgroundCanvas);
	applyFilters();
	// alternateFootstepSound();
    endAnimationFrame = requestAnimationFrame(() => update(backgroundCanvas))
}

const startRendering = async () => {
  	try {
    	const backgroundCanvas = await renderStaticLayers(layersData);
    	frontRendersCanvas = await renderStaticLayers(frontRendersLayersData);
		
    if (!backgroundCanvas) {
      	console.error('Failed to create the background canvas')
      	return
    }

    update(backgroundCanvas)
  	} catch (error) {
    	console.error('Error during rendering:', error)
  	}
}

//initiation function
function init(){
    deltaTime = 0.016;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    //make canvas pixelated and sharp (along with image-rendeing pixelated for css)
    c.imageSmoothingEnabled       = false;
    c.webkitImageSmoothingEnabled = false;
    c.mozImageSmoothingEnabled    = false;
    c.msImageSmoothingEnabled     = false;
    c.oImageSmoothingEnabled      = false;
	document.getElementById("menu").style.display = "none";
	initCreatures();
    	startRendering();
	playAmbiance();
	updateLore();
	menuMusic.pause();
}

const observer = new ResizeObserver((entries) => {
 	const {width, height} = canvas.getBoundingClientRect();
 	const displayWidth  = Math.round(width * dpr);
  	const displayHeight = Math.round(height * dpr);
  	canvas.width = displayWidth;
  	canvas.height = displayHeight;
	c.imageSmoothingEnabled       = false;
    c.webkitImageSmoothingEnabled = false;
    c.mozImageSmoothingEnabled    = false;
    c.msImageSmoothingEnabled     = false;
    c.oImageSmoothingEnabled      = false;
});
observer.observe(canvas)
