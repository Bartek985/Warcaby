var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.text());
var users = [];
var pawnsPosition = []
var gameEnded = false
var losingColor = "white"
var deletedPawn = -1
let firstColor = new String();
let victoryHere = false
app.use(express.static("static"));
app.post("/ADD_USER", (req, res) => {
  //console.log(req.body);
  let obj = JSON.parse(req.body);
  let lastObj;
  //console.log(obj.user);
  if (users.length < 2) {
    if (obj.user == "") {
      lastObj = { user: "", error: "lack" };
      res.end(JSON.stringify(lastObj));
    } else {
      let repetition = false;
      users.forEach((elem) => {
        if (elem.user == obj.user) {
          repetition = true;
        }
      });
      if (repetition) {
        lastObj = { user: "", error: "repeat" };
        res.end(JSON.stringify(lastObj));
      } else {
        if (users.length == 0) {
          let color;
          let ran = Math.random();
          //console.log(ran);
          if (ran > 0.5) {
            color = "white";
          } else {
            color = "black";
          }
          firstColor = color;
          users.push(obj);
          lastObj = {
            user: obj.user,
            error: "none",
            color: color,
            play: "false",
          };
          res.end(JSON.stringify(lastObj));
        } else {
          gameEnded = false
          deletedPawn = -1
          pawnsPosition = []
          let color;
          //console.log(firstColor);
          if (firstColor == "white") {
            color = "black";
          } else {
            color = "white";
          }
          users.push(obj);
          lastObj = {
            user: obj.user,
            error: "none",
            color: color,
            play: "true",
          };
          res.end(JSON.stringify(lastObj));
        }
      }
    }
  } else {
    lastObj = { user: "", error: "many" };
    res.end(JSON.stringify(lastObj));
  }
});

app.post("/RESET", (req, res) => {
  users = [];
  pawnsPosition = []
  gameEnded = false
  losingColor = "white"
  deletedPawn = -1
  victoryHere = false
  firstColor = "";
  res.end()
});

app.post("/CHECK", (req, res) => {
  if (users.length == 2) {
    res.end(JSON.stringify({ play: "true" }));
  } else {
    res.end(JSON.stringify({ play: "false" }));
  }
});

app.post("/UPDATE_TAB", (req, res) => {
  let obj = JSON.parse(req.body);
  pawnsPosition.push(obj.start)
  pawnsPosition.push(obj.end)
  pawnsPosition.push(obj.color)
  deletedPawn = obj.deleted
  victoryHere = obj.victory
  res.end()
})

app.post("/CHECK_TAB", (req, res) => {
  //console.log("Check")
  let obj = JSON.parse(req.body);
  // //console.log(obj.colour)
  if (pawnsPosition.length == 3) {
    //console.log('Length')
    // //console.log(obj.colour)
    // //console.log(pawnsPosition[2])
    if (obj.colour != pawnsPosition[2]) {
      res.send(JSON.stringify({ start: pawnsPosition[0], end: pawnsPosition[1], color: pawnsPosition[2], deleted: deletedPawn, victory: victoryHere }))
      //console.log(JSON.stringify({ start: pawnsPosition[0], end: pawnsPosition[1], color: pawnsPosition[2] }))
      pawnsPosition.pop()
      pawnsPosition.pop()
      pawnsPosition.pop()
    }
    else {
      res.end(JSON.stringify({ start: false, end: false }))
    }
  }
  else {
    //console.log(gameEnded)
    if(gameEnded && obj.colour != losingColor){
      //console.log('Wysyłam odpowiedź')
      res.end(JSON.stringify({ start: false, end: false, endGame: true, color: losingColor}))
    }
    else{
      res.end(JSON.stringify({ start: false, end: false, endGame: false }))

    }
  }
})

app.post("/CHECK_TAB_O", (req, res) => {
  //console.log("Check 2")
  // //console.log(req.body)
  let obj = JSON.parse(req.body);
  // //console.log(obj.colour)
  if (pawnsPosition.length == 3) {
    //console.log('Length 2')
    if (obj.colour != pawnsPosition[2]) {
      res.send(JSON.stringify({ start: pawnsPosition[0], end: pawnsPosition[1], color: pawnsPosition[2], deleted: deletedPawn, victory: victoryHere  }))
      //console.log(JSON.stringify({ start: pawnsPosition[0], end: pawnsPosition[1], color: pawnsPosition[2] }))
      pawnsPosition.pop()
      pawnsPosition.pop()
      pawnsPosition.pop()
      //console.log(pawnsPosition)
    }
    else {
      res.end(JSON.stringify({ start: false, end: false }))
    }
  }
  else {
    //console.log(gameEnded)
    if(gameEnded && obj.colour != losingColor){
      //console.log('Wysyłam odpowiedź')
      res.end(JSON.stringify({ start: false, end: false, endGame: true}))
    }
    else{
      res.end(JSON.stringify({ start: false, end: false, endGame: false }))

    }
  }
})

app.post('/END_GAME', (req,res)=>{
  gameEnded = true
  let obj = JSON.parse(req.body);
  losingColor = obj.color
  //console.log(`Odebrałem kolor ${losingColor}`)
  res.end()
})
app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});
