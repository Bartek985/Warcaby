class Ui {
  constructor() {}
  click = () => {
    const user = document.getElementById("user-input").value;
    net.fetchPost(user);
  };
  timer = (duration) =>{
    let seconds;
    if (parseInt(duration) % 60 > 9) {
      seconds = parseInt(duration) % 60;
    } else {
      seconds = `0${parseInt(duration) % 60}`;
    }
  
    document.getElementById("seconds").textContent = `${seconds}`;
  
    let counter = parseInt(duration);
  
    this.myInterval = setInterval(countDown, 1000);
    function countDown() {
      counter--;
      if (counter != 0) {
        let seconds2;
        if (counter % 60 > 9) {
          seconds2 = counter % 60;
        } else {
          seconds2 = `0${counter % 60}`;
        }
  
  
        document.getElementById("seconds").textContent = seconds2;
      } else {
        document.getElementById("seconds").textContent = "00";
        game.endGame()
        // document.getElementById("time").style.display = "none";
        // document.getElementById("third-groups").style.display = "flex"
        // document.getElementById("des").style.display = "none"
        // document.getElementById('draw-button').style.display = "block"
        clearInterval(this.myInterval)
      }
    }
  }

  winningMessage = () =>{
    document.getElementById('win').style.display = "flex"
  }
  losingMessage = () =>{
    document.getElementById('lose').style.display = "flex"
  }
  winning = () =>{
    document.getElementById('win-real').style.display = "flex"
  }
  losing = () =>{
    document.getElementById('lose-real').style.display = "flex"
  }
  disappear = () =>{
    document.getElementById('start').style.display = "none"
  }
  eraseTimer = () =>{
    clearInterval(this.myInterval)
    document.getElementById('timer').style.display = "none"
  }
  makeTimer = () =>{
    document.getElementById('seconds').textContent = "30"
    document.getElementById('timer').style.display = "block"
    this.timer(30)
  }
}
