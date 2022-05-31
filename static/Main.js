// import Game from "./Game";
let game;
let net;
let ui;
window.onload = () => {
  game = new Game();
  net = new Net();
  ui = new Ui();
  window.onresize = game.resize();
};
