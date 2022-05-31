class Net {
  constructor() { }

  fetchPost = (user) => {
    ////console.log(user);
    const body = JSON.stringify({ user: user }); // body czyli przesyłane na serwer dane
    fetch("/ADD_USER", { method: "post", body }) // fetch
      .then((response) => response.json())
      .then(
        (data) => {
          ////console.log(data);
          // let obj = JSON.parse(data);
          data;
          if (data.error == "none") {
            ////console.log(data.user + " loler");
            document.getElementById("waiting").style.display = "flex";
            document.getElementById(
              "nickname"
            ).textContent = `Witaj ${data.user}`;
            document.getElementById("login").style.display = "none";
            document.getElementById("error-handler").style.display = "none";
            if (data.color == "white") {
              document.getElementById("kolor").textContent = "Grasz białymi";
              game.whiteCamera();
            } else {
              document.getElementById("kolor").textContent = "Grasz czarnymi";
              game.blackCamera();
            }
            if (data.play == "true") {
              document.getElementById("waiting").style.display = "none";
              document.getElementById("start").style.display = "block";
              game.start()
              this.myInterval1 = setInterval(this.checkUpdateO, 500, data.color);
            } else {
              this.interval = setInterval(this.checkGame, 1000);
              this.myInterval2 = setInterval(this.checkUpdate, 500, data.color);
            }
            game.generatePawns();
          } else if (data.error == "repeat") {
            document.getElementById("error-handler").style.display = "flex";
            document.getElementById("error-handler").textContent =
              "This nickname is already taken";
          } else if (data.error == "lack") {
            document.getElementById("error-handler").style.display = "flex";
            document.getElementById("error-handler").textContent =
              "Please provide valid nickname";
          } else if (data.error == "many") {
            document.getElementById("error-handler").style.display = "flex";
            document.getElementById("error-handler").textContent =
              "Sorry, there are already two players";
          }
        } // dane odpowiedzi z serwera
      );
  };

  reset = () => {
    const body = JSON.stringify({ reset: "true" }); // body czyli przesyłane na serwer dane
    fetch("/RESET", { method: "post", body }); // fetch
  };

  checkGame = () => {
    const body = { quest: "czy jest juz?" };
    fetch("/CHECK", { method: "post", body }) // fetch
      .then((response) => response.json())
      .then(
        (data) => {
          ////console.log(data);
          if (data.play == "true") {
            document.getElementById("waiting").style.display = "none";
            document.getElementById("start").style.display = "block";
            game.start()
            clearInterval(this.interval);
          }
        } // dane odpowiedzi z serwera
      );
  };

  sendUpdate = (starting, ending, color, deleted=-1, victory = false) => {
    //console.log("Send ",deleted)
    const body = JSON.stringify({ start: starting, end: ending, color: color, deleted: deleted, victory: victory}); // body czyli przesyłane na serwer dane
    fetch("/UPDATE_TAB", { method: "post", body }); // fetch
  }

  checkUpdate = (color) => {
    //console.log(color)
    const body = JSON.stringify({ colour: String(color) });
    fetch("/CHECK_TAB", { method: "post", body }) // fetch
      .then((response) => response.json())
      .then(
        (data) => {
          // ////console.log(data);
          if (data.start != false && data.end != false) {
            ////console.log('Odpowiedz')
            game.animateMove(data.start, data.end, data.color, data.deleted)
            if(data.victory == true){
              game.lose()
            }
            // clearInterval(this.myInterval2)
            // this.myInterval2 = setInterval(this.checkUpdate, 500)
          }
          else{
            if(data.endGame == true){
              game.winGame()
              this.clearIntervals()
            }
          }
        } // dane odpowiedzi z serwera
      );
  }

  checkUpdateO = (color) => {
    //console.log(color)
    const body = JSON.stringify({ colour: String(color) });
    fetch("/CHECK_TAB_O", { method: "post", body }) // fetch
      .then((response) => response.json())
      .then(
        (data) => {

          // ////console.log(data);
          if (data.start != false && data.end != false) {
            ////console.log('Odpowiedz')
            game.animateMove(data.start, data.end, data.color, data.deleted)
            if(data.victory == true){
              game.lose()
            }
            // clearInterval(this.myInterval1)
            // this.myInterval1 = setInterval(this.checkUpdateO, 500)
          }
          else{
            //console.log('Start i end są równe false')
            if(data.endGame == true){
              //console.log('Wygrywam grę')
              game.winGame()
              this.clearIntervals()
            }
          }
        } // dane odpowiedzi z serwera
      );
  }

  endGame = (color) =>{
    //console.log('Przesyłam kolor')
    const body = JSON.stringify({ color: color }); // body czyli przesyłane na serwer dane
    fetch("/END_GAME", { method: "post", body }); // fetch
  }

  clearIntervals = ()=>{
    clearInterval(this.myInterval1);
    clearInterval(this.myInterval2);
  }
}
