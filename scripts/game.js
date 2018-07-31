
//the following if-statement decides if the browser is going to render
//the application with WebGL or canvas
let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = 'canvas'
}

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
  .add('images/food_truck.png')
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

function setupPlayer() {
  //this funtion sets up the player in the game
  sprite = new PIXI.Sprite(PIXI.loader.resources['images/food_truck.png'].texture)
  sprite.anchor.y = .5
  sprite.anchor.x = .5
  sprite.x = appWidth / 2
  sprite.y = appHeight - 200
  sprite.vy = 0
  sprite.vx = 0
  sprite.scale.y = .3
  sprite.scale.x = .3
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
  //the setup function runs at the start of the applcation

  //this funtion sets up the player inside the game
  setupPlayer()

  //here the state of the game is set to the play function
  state = play

  //pixi's ticker function allows the gameLoop to run 60 times per second
  app.ticker.add(delta => gameLoop(delta))
}

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
  playerContain(sprite, {x: 0, y: 0, width: appWidth, height: appHeight})

}
