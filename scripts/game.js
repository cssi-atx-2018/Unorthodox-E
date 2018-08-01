
//the following if-statement decides if the browser is going to render
//the application with WebGL or canvas
let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = 'canvas'
}



// `input` will be defined elsewhere, it's a means
// for us to capture the state of input from the player

//this print a message on the console. use dev tools to see
PIXI.utils.sayHello(type)

//Create a Pixi Application
//There are more properties that can be altered
//look at the documentation for PIXI.Application
let appWidth = 512 * 2
    appHeight = 512 * 1.5
let app = new PIXI.Application({width: appWidth, height: appHeight});
app.renderer.backgroundColor = 0x061639
app.renderer.autoResize = true


//add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view)

//PIXI.loader takes in paths for images and renders it so that they cna be used
//for textures
PIXI.loader
  .add(['images/food_truck_2.png',
        'images/neon_green.png',
        'images/pink.png',
        'images/orange.png',
        'images/can.png',
        'images/logo.png',
  ])
  .load(setup)

function keyboard(keyCode) {
  //this funtion can be used to add functionality to keys on the keyboard
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  if(hit){
    console.log('you got hit')
  }
  return hit;
};

function playerContain(sprite, container) {
  //this funtion is used to contain the player
  let collision = undefined;

  //Left
  if (sprite.x - sprite.width / 2 < container.x) {
    sprite.x = sprite.width/2;
    collision = "left";
  }

  //Right
  if (sprite.x + sprite.width / 2 > container.width) {
    sprite.x = container.width - sprite.width/2;
    collision = "right";
  }

  //Return the `collision` value
  return collision;
}

//State is a variable that represents the state of the app
//If state is assigned to play that means that the appliaciton
//is in the play states. Same thing with pause, main menu, etc.
let sprite, state
let car1, car2, car3, can1, can2
let carVelocity = 3
let currentSet
let points=0
let gameOverContainer, startGameContainer
let spacePressed, spacebar
let returnPressed, returnButton
let score
let spriteLogo
let pointThreshold = 10

function setUpEnd(){
  gameOverContainer = new PIXI.Container()

  let style = new PIXI.TextStyle({
    fontFamily: 'Press Start 2P, cursive',
    fontSize: 70,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });

  let title = new PIXI.Text('GAME OVER', style)
  title.anchor.x = .5
  title.anchor.y = .5
  gameOverContainer.addChild(title)
  title.position.set(appWidth/2, appHeight/3)
  app.stage.addChild(gameOverContainer)

  returnButton = keyboard(16)
  returnButton.press = () => {
    returnPressed = true
  }
  returnButton.release = () => {
    returnPressed = false
  }

  state = gameOver
}

function setUpCars(){
  car1 = new PIXI.Sprite(PIXI.loader.resources['images/neon_green.png'].texture)
  car2 = new PIXI.Sprite(PIXI.loader.resources['images/pink.png'].texture)
  car3 = new PIXI.Sprite(PIXI.loader.resources['images/orange.png'].texture)

  car1.anchor.y = .5
  car1.anchor.x = .5
  car1.scale.x = .375
  car1.scale.y = .375

  car2.anchor.y = .5
  car2.anchor.x = .5
  car2.scale.x = .375
  car2.scale.y = .375

  car3.anchor.y = .5
  car3.anchor.x = .5
  car3.scale.x = .375
  car3.scale.y = .375
}

function setUpCans(){
  can1 = new PIXI.Sprite(PIXI.loader.resources['images/can.png'].texture)
  // can2 = new PIXI.Sprite(PIXI.loader.resources['images/can.png'].texture)

  can1.anchor.y = .5
  can1.anchor.x = .5
  can1.scale.x = .375
  can1.scale.y = .375

  // car2.anchor.y = .5
  // car2.anchor.x = .5
  // car2.scale.x = .375
  // car2.scale.y = .375
}

function setupPlayer() {
  //this funtion sets up the player in the game
  sprite = new PIXI.Sprite(PIXI.loader.resources['images/food_truck_2.png'].texture)
  sprite.anchor.y = .5
  sprite.anchor.x = .5
  sprite.x = appWidth / 2
  sprite.y = appHeight - 200
  sprite.vy = 0
  sprite.vx = 0
  sprite.scale.y = .375
  sprite.scale.x = .375
  app.stage.addChild(sprite)



  //this section set up the keyboard presses for the player
  let left = keyboard(37)
      right = keyboard(39)

  left.press = () => {
    sprite.vx = -5;
    sprite.vy = 0;
  };
  left.release = () => {
    if (!right.isDown && sprite.vy === 0) {
      sprite.vx = 0;
    }
  };
  right.press = () => {
    sprite.vx = 5;
    sprite.vy = 0;
  };
  right.release = () => {
  if (!left.isDown && sprite.vy === 0) {
    sprite.vx = 0;
    }
  };
}

function setup() {

    // stage = new PIXI.Container(); //creates a stage object
    // renderer = PIXI.autoDetectRenderer(
    //   1024,
    //   768,
    //   {view:document.getElementById("game-canvas")}
    // ); //lets Pixi select appropriate renderer

    var farTexture = PIXI.Texture.fromImage("images/art.png");
    far = new PIXI.extras.TilingSprite(farTexture, 1024, 768);
    far.position.x = 0;
    far.position.y = 0;
    far.tilePosition.x = 0;
    far.tilePosition.y = 0;
    app.stage.addChild(far);

    spacebar = keyboard(32);

    spacebar.press = () => {
      spacePressed = true
    }
    spacebar.release = () => {
      spacePressed = false
    }

    // var midTexture = PIXI.Texture.fromImage("resources/art.png");
    // mid = new PIXI.extras.TilingSprite(midTexture, 512, 256);
    // mid.position.x = 0;
    // mid.position.y = 128;
    // mid.tilePosition.x = 0;
    // mid.tilePosition.y = 0;
    // stage.addChild(mid);

  //the setup function runs at the start of the applcation

  //this function sets up the car objects
  //setUpCars()
  currentSet = new PIXI.Container()

  gameOverContainer = new PIXI.Container()
  //this function sets up the can objects
  setUpCans()
  printPoints()
  setOfCans = new PIXI.Container()

  startGame()

  //here the state of the game is set to the intro function

  //this funtion sets up the player inside the game
  //setupPlayer()

  //pixi's ticker function allows the gameLoop to run 60 times per second
  app.ticker.add(delta => gameLoop(delta))
  // chooseRandomSet()
  // canSet()
}

function update() {
  far.tilePosition.y += 10;
  // mid.tilePosition.y -= 0.64;
  //renderer.render(stage);
  //requestAnimationFrame(update);
}

function middleCarSet(){
  console.log('The middle Car Set started')
  currentSet.addChild(car1)
  app.stage.addChild(currentSet)
  console.log(currentSet)
  car1.x = appWidth / 2
  car1.y = 0 - car1.height/2

  app.stage.addChild(currentSet)
}

function CarCheck(){
  let index = 0
  for(index = 0; index < currentSet.children.length; index += 1)
  {
    currentSet.children[index].y += carVelocity
    if(currentSet.children[index].y > appHeight + currentSet.children[index].height/2){
      app.stage.removeChild(currentSet)
      currentSet.removeChildren()
      chooseRandomSet()
      return
    }
  }
}

function CanCheck(){
  let index = 0
  for(index = 0; index < setOfCans.children.length; index += 1)
  {
    setOfCans.children[index].y += carVelocity
    if(hitTestRectangle(can1, sprite)){
      app.stage.removeChild(setOfCans)
      setOfCans.removeChildren()
      points+=1
      setTimeout(canSet(), 5000);
      console.log(points)
    }
    if(setOfCans.children[index].y > appHeight + setOfCans.children[index].height/2){
      app.stage.removeChild(setOfCans)
      setOfCans.removeChildren()
      setTimeout(canSet(), 5000);
      return
    }
  }
}

function canLocationCheck(canObject) {
  if(hitTestRectangle(canObject, car1)){
    return true
  }
  if (hitTestRectangle(canObject, car2)) {
    return true
  }
  if(hitTestRectangle(canObject, car3)) {
    return true
  }
  return false
}

function splitCarSet(){
  console.log('The split car set started')
  currentSet.addChild(car1)
  currentSet.addChild(car3)
  app.stage.addChild(currentSet)
  car1.x = Math.ceil(appWidth * 1/6)
  car1.y = 0 - car1.height/2
  car3.x = Math.ceil(appWidth * (5/6))
  car3.y = 0 - car3.height/2

  app.stage.addChild(currentSet)
}

function leftPairCarSet(){
  console.log('the left pair car set started')
  currentSet.addChild(car1)
  currentSet.addChild(car2)
  app.stage.addChild(currentSet)
  car1.x = Math.ceil(appWidth * 1/6)
  car1.y = 0 - car1.height/2
  car2.x = appWidth / 2
  car2.y = 0 - car2.height/2

  app.stage.addChild(currentSet)
}

function rightPairCarSet(){
  console.log('the right pair car set started')
  currentSet.addChild(car2)
  currentSet.addChild(car3)
  app.stage.addChild(currentSet)
  car2.x = appWidth / 2
  car2.y = 0 - car2.height/2
  car3.x = Math.ceil(appWidth * (5/6))
  car3.y = 0 - car3.height/2

  app.stage.addChild(currentSet)
}

function canSet(){
  console.log('The can set started')
  setOfCans.addChild(can1)
  app.stage.addChild(setOfCans)
  console.log(setOfCans)
  let xpos = [appWidth / 2, Math.ceil(appWidth * (5/6)), Math.ceil(appWidth * 1/6)]
  can1.x = xpos[Math.floor(Math.random() * xpos.length)]
  can1.y = 0 - can1.height/2
  while(canLocationCheck(can1)){
    can1.x = xpos[Math.floor(Math.random() * xpos.length)]
    can1.y = 0 - can1.height/2
  }
  // can1.x = xpos[Math.floor(Math.random() * xpos.length)]
  // can1.y = 0 - can1.height/2

  app.stage.addChild(setOfCans)
}

let sets = [middleCarSet, splitCarSet, leftPairCarSet, rightPairCarSet]

function chooseRandomSet(){
  let i = Math.floor(Math.random() * sets.length)
  sets[i]()
  //setTimeout(canSet(), 100);
}
//chooses car position scenarios

function gameLoop(delta){
  //the gameLoop funtion runs 60 times per second
  //this funtion dictates what is happening on the screen
  state(delta)
}

function play(delta){
  //the play funtion should only be assigned to the state variable
  //(DONT USE IT FOR ANYTHING ELSE OR BAD THINGS WILL HAPPEN)
  //this funtion dictates what happens during the "play state" of the game
  sprite.y += sprite.vy
  sprite.x += sprite.vx
  CarCheck()
  CanCheck()
  updatePoints()
  requestAnimationFrame(update);
  playerContain(sprite, {x: 0, y: 0, width: appWidth, height: appHeight})


  if(hitTestRectangle(car1, sprite)){
    //state = gameOver
    state = setUpEnd
    return
  }
  else if(hitTestRectangle(car2, sprite))
  {
    //state = gameOver
    state = setUpEnd
    return
  }
  else if(hitTestRectangle(car3, sprite)){
    //state = gameOver
    state = setUpEnd
    return
  }
}

function gameOver(delta){
  console.log('game over')

  if(returnPressed){
    app.stage.removeChild(sprite)
    app.stage.removeChild(currentSet)
    currentSet.removeChildren()
    app.stage.removeChild(gameOverContainer)
    app.stage.removeChild(setOfCans)
    state = startGame
  }
}

function intro() {
  update();
  if(spacePressed){
    setupPlayer()
    app.stage.removeChild(startGameContainer)
    car1 = undefined
    car2 = undefined
    car3 = undefined
    setUpCars()

    app.stage.removeChild(spriteLogo)
    state = play
    chooseRandomSet()
    canSet()
  }
}

function startGame(){
  startGameContainer = new PIXI.Container()
  points = 0
  score.text = 'Your score: ' + points

  let style = new PIXI.TextStyle({
    fontFamily: 'Press Start 2P, cursive',
    fontSize: 20,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });

  let title = new PIXI.Text('press spacebar to begin', style)
  // var img = document.createElement("img");
  // img.src = "images/logo.png";

  spriteLogo = new PIXI.Sprite(PIXI.loader.resources['images/logo.png'].texture)
  app.stage.addChild(spriteLogo)

  spriteLogo.anchor.x = -1.15
  spriteLogo.anchor.y = -0.4
  title.anchor.x = .5
  title.anchor.y = -6
  startGameContainer.addChild(title)
  title.position.set(appWidth/2, appHeight/3)
  app.stage.addChild(startGameContainer)
  gameOverContainer.removeChildren()
  app.stage.removeChild(car1)
  app.stage.removeChild(car2)
  app.stage.removeChild(car3)

  state = intro
}

function printPoints(){

  let style = new PIXI.TextStyle({
    fontFamily: 'Press Start 2P, cursive',
    fontSize: 20,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });

  score = new PIXI.Text('Your score: '+points, style)
  score.text = 'Your score: '+points
  score.anchor.x = -.05
  score.anchor.y = -.2
  app.stage.addChild(score)

}

function updatePoints(){
  score.text = 'Your score: '+points
  if(points >= pointThreshold){
    carVelocity += 1
    pointThreshold += 10
  }

}
