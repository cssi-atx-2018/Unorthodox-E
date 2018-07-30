let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = 'canvas'
}
PIXI.utils.sayHello(type)
//Create a Pixi Application
//There are more properties that can be altered
//look at the documentation for PIXI.Application
let app = new PIXI.Application({width: 256, height: 256});
app.renderer.backgroundColor = 0x061639
app.renderer.autoResize = true
app.renderer.resize(512,512)

//The following lines can be used to fill the whole screen
// app.renderer.view.style.position = 'absolute'
// app.renderer.view.style.display = 'block'
// app.renderer.autoResize = true
// app.renderer.resize(window.innerWidth, window.innerHeight)

//add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view)

PIXI.loader
  .add('images/pepe.png')
  .load(setup)

//State is a variable that represents the state of the app
//If state is assigned to play that means that the appliaciton
//is in the play states. Same thing with pause, main menu, etc.

//This funtion can be used to create keyboard input
function keyboard(keyCode) {
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

let sprite, state

function setup() {
  sprite = new PIXI.Sprite(PIXI.loader.resources['images/pepe.png'].texture)
  sprite.vy = 0
  sprite.vx = 0
  sprite.scale.y = .5
  sprite.scale.x = .5
  app.stage.addChild(sprite)

  let left = keyboard(37)
      right = keyboard(39)

  left.press = () => {
    if(sprite.x > 0){
      sprite.vx = -5;
      sprite.vy = 0;
    }
  };
  left.release = () => {
    if (!right.isDown && sprite.vy === 0) {
      sprite.vx = 0;
    }
  };

  //Right
  right.press = () => {
    if(sprite.x < app.width){
      sprite.vx = 5;
      sprite.vy = 0;
    }
  };
  right.release = () => {
  if (!left.isDown && sprite.vy === 0) {
  sprite.vx = 0;
  }
  };

  state = play
  app.ticker.add(delta => gameLoop(delta))

  }

  function gameLoop(delta){
  state(delta)
}

function play(delta){
  sprite.y += sprite.vy
  sprite.x += sprite.vx
}
