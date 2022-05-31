class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      innerWidth / innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 2000, 0);
    this.camera.lookAt(this.scene.position);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x000000);
    this.renderer.setSize(window.innerWidth - 30, window.innerHeight - 40);
    this.axes = new THREE.AxesHelper(1000);
    this.scene.add(this.axes);
    this.raycaster = new THREE.Raycaster();
    this.mouseVector = new THREE.Vector2()
    this.checkedPawns = []
    this.started = false
    this.animated = false
    this.animatedM = false
    this.allPawns = []
    this.allSquares = []
    this.allow = false
    this.moves = []
    document.getElementById("root").append(this.renderer.domElement);

    this.render(); // wywołanie metody render

    this.szachownica = [
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
    ];
    this.pionki = [
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
    ];
    this.generateBoard();
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
    if (this.animated) {
      this.tween.update()
    }
    if (this.animatedM) {
      this.newTween.update()
    }
    // ////console.log("render leci");
  };

  generateBoard = () => {
    const geometry = new THREE.BoxGeometry(100, 10, 100);

    for (let i = 0; i < this.szachownica.length; i++) {
      for (let j = 0; j < this.szachownica[i].length; j++) {
        if (this.szachownica[i][j] == 0) {
          const cube = new Item(geometry, "white", (7 - i) * 8 + j);
          cube.position.set(j * 100 - 350, 0, 350 - i * 100);
          this.scene.add(cube);
          this.allSquares[8*(7-i)+j] = cube
        } else {
          const cube = new Item(geometry, "black", (7 - i) * 8 + j);
          cube.position.set(j * 100 - 350, 0, 350 - i * 100);
          this.scene.add(cube);
          this.allSquares[8*(7-i)+j] = cube
        }
      }
    }
  };

  generatePawns = () => {
    const geometry = new THREE.CylinderGeometry(40, 40, 20, 32);

    for (let i = 0; i < this.pionki.length; i++) {
      for (let j = 0; j < this.pionki[i].length; j++) {
        if (this.pionki[i][j] == 1) {
          let color = "white"
          const cylinder = new Pionek(geometry, color, 63 - ((7 - i) * 8 + 7 - j));
          cylinder.position.set(j * 100 - 350, 10, i * 100 - 350);
          this.scene.add(cylinder);
          this.allPawns.push(cylinder)
        } else if (this.pionki[i][j] == 2) {
          let color = "black"
          const cylinder = new Pionek(geometry, color, 63 - ((7 - i) * 8 + 7 - j));
          cylinder.position.set(j * 100 - 350, 10, i * 100 - 350);
          this.scene.add(cylinder);
          this.allPawns.push(cylinder)
        }
      }
    }
  };

  whiteCamera = () => {
    this.camera.position.set(0, 1000, 750);
    this.camera.lookAt(this.scene.position);
    this.camera.updateProjectionMatrix();
    this.color = "white"
    this.allow = true
  };
  blackCamera = () => {
    this.camera.position.set(0, 1000, -750);
    this.camera.lookAt(this.scene.position);
    this.camera.updateProjectionMatrix();
    this.color = "black"
  };
  start = () => {
    this.started = true
    if(this.color=="white"){
      ui.timer(30) 
      document.getElementById('timer').style.display = "block"
    }
    setTimeout(ui.disappear, 5000)
  }
  resize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
  detect = (positionX, positionY) => {
    let mouseVector = new Object()
    mouseVector.x = positionX
    mouseVector.y = positionY
    this.raycaster.setFromCamera(mouseVector, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    ////console.log(intersects.length)
    if (intersects.length > 0 && this.started && this.allow) {
      // ////console.log(intersects[0].object);
      this.checkPawn(intersects)
      this.checkSquare(intersects)
    }
  }

  checkPawn = (intersects) => {
    // ////console.log(intersects[0])
    if (intersects[0].object.pionek) {
      ////console.log('Kliknąłeś pionka!')
      if ((intersects[0].object.colour == "white" && this.color == "white") || (intersects[0].object.colour == "black" && this.color == "black")) {
        if (this.checkedPawns.length == 0) {
          intersects[0].object.material.color.setHex(0xffff00)
          this.checkedPawns.push(intersects[0].object)
        }
        else {
          ////console.log('L1')
          let hex
          if (this.checkedPawns[0].colour == "white") {
            hex = 0xffffff
          }
          else {
            hex = 0xffffff
          }
          ////console.log(hex)
          this.checkedPawns[0].material.color.setHex(hex)
          intersects[0].object.material.color.setHex(0xffff00)
          this.checkedPawns.pop()
          this.checkedPawns.push(intersects[0].object)
        }

        if(this.moves.length == 1){
          // this.moves[0].material.color.setHex(0xffffff)
          this.moves[0].material.map = THREE.ImageUtils.loadTexture('mats/ciemna_plansza.jpg');
          this.moves[0].material.needsUpdate = true;
          this.moves.pop()
        }
        else if(this.moves.length == 2){
          // this.moves[0].material.color.setHex(0xffffff)
          this.moves[0].material.map = THREE.ImageUtils.loadTexture('mats/ciemna_plansza.jpg');
          this.moves[0].material.needsUpdate = true;
          // this.moves[1].material.color.setHex(0xffffff)
          this.moves[1].material.map = THREE.ImageUtils.loadTexture('mats/ciemna_plansza.jpg');
          this.moves[1].material.needsUpdate = true;
          this.moves.pop()
          this.moves.pop()
        }
          // ((this.checkedPawns[0].square + 7 == intersects[0].object.personalId || this.checkedPawns[0].square + 9 == intersects[0].object.personalId ) && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)+1 && this.checkedPawns[0].colour == "black") || ((this.checkedPawns[0].square - 7 == intersects[0].object.personalId || this.checkedPawns[0].square - 9 == intersects[0].object.personalId ) && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)-1 && this.checkedPawns[0].colour == "white")

          //console.log(this.allSquares)
          if(this.checkedPawns[0].square + 7<64){
          if(this.pionki[Math.floor((this.checkedPawns[0].square + 7)/8)][(this.checkedPawns[0].square + 7)%8] == 0 && Math.floor((this.checkedPawns[0].square+7)/8) == Math.floor(this.checkedPawns[0].square/8)+1 && this.checkedPawns[0].colour == "black"){
            //console.log(this.checkedPawns[0].square+7)
            this.moves.push(this.allSquares[this.checkedPawns[0].square+7])
            //console.log('Warunek 1')
          }
          }
          
          if(this.checkedPawns[0].square + 9<64){
          if(this.pionki[Math.floor((this.checkedPawns[0].square + 9)/8)][(this.checkedPawns[0].square + 9)%8] == 0 && Math.floor((this.checkedPawns[0].square+9)/8) == Math.floor(this.checkedPawns[0].square/8)+1 && this.checkedPawns[0].colour == "black"){
            //console.log(this.checkedPawns[0].square+9)
            this.moves.push(this.allSquares[this.checkedPawns[0].square+9])
            //console.log('Warunek 2')
          }
          }

          if(this.checkedPawns[0].square - 7>=0){
            if(this.pionki[Math.floor((this.checkedPawns[0].square - 7)/8)][(this.checkedPawns[0].square - 7)%8] == 0 && Math.floor((this.checkedPawns[0].square-7)/8) == Math.floor(this.checkedPawns[0].square/8)-1 && this.checkedPawns[0].colour == "white"){
              //console.log(this.checkedPawns[0].square-7)
              this.moves.push(this.allSquares[this.checkedPawns[0].square-7])
              //console.log('Warunek 3')
            }
          }

          if(this.checkedPawns[0].square - 9>=0){
            if(this.pionki[Math.floor((this.checkedPawns[0].square - 9)/8)][(this.checkedPawns[0].square - 9)%8] == 0 && Math.floor((this.checkedPawns[0].square-9)/8) == Math.floor(this.checkedPawns[0].square/8)-1 && this.checkedPawns[0].colour == "white"){
              //console.log(this.checkedPawns[0].square-9)
              this.moves.push(this.allSquares[this.checkedPawns[0].square-9])
              //console.log('Warunek 4')
            }

          }

          
          if(this.checkedPawns[0].square + 14<64){
            if(this.pionki[Math.floor((this.checkedPawns[0].square + 14)/8)][(this.checkedPawns[0].square + 14)%8] == 0 && Math.floor((this.checkedPawns[0].square+14)/8) == Math.floor(this.checkedPawns[0].square/8)+2 && this.checkedPawns[0].colour == "black" && this.pionki[Math.floor((this.checkedPawns[0].square + 7)/8)][(this.checkedPawns[0].square + 7)%8] == 1){
              this.moves.push(this.allSquares[this.checkedPawns[0].square+14])
            }
            }
            
            if(this.checkedPawns[0].square + 18<64){
            if(this.pionki[Math.floor((this.checkedPawns[0].square + 18)/8)][(this.checkedPawns[0].square + 18)%8] == 0 && Math.floor((this.checkedPawns[0].square+18)/8) == Math.floor(this.checkedPawns[0].square/8)+2 && this.checkedPawns[0].colour == "black" && this.pionki[Math.floor((this.checkedPawns[0].square + 9)/8)][(this.checkedPawns[0].square + 9)%8] == 1){
              this.moves.push(this.allSquares[this.checkedPawns[0].square+18])
            }
            }
  
            if(this.checkedPawns[0].square - 14>=0){
              if(this.pionki[Math.floor((this.checkedPawns[0].square - 14)/8)][(this.checkedPawns[0].square - 14)%8] == 0 && Math.floor((this.checkedPawns[0].square-14)/8) == Math.floor(this.checkedPawns[0].square/8)-2 && this.checkedPawns[0].colour == "white" && this.pionki[Math.floor((this.checkedPawns[0].square - 7)/8)][(this.checkedPawns[0].square - 7)%8] == 2){
                this.moves.push(this.allSquares[this.checkedPawns[0].square-14])
              }
            }
  
            if(this.checkedPawns[0].square - 18>=0){
              if(this.pionki[Math.floor((this.checkedPawns[0].square - 18)/8)][(this.checkedPawns[0].square - 18)%8] == 0 && Math.floor((this.checkedPawns[0].square-18)/8) == Math.floor(this.checkedPawns[0].square/8)-2 && this.checkedPawns[0].colour == "white" && this.pionki[Math.floor((this.checkedPawns[0].square - 9)/8)][(this.checkedPawns[0].square - 9)%8] == 2){
                this.moves.push(this.allSquares[this.checkedPawns[0].square-18])
              }
  
            }

          this.moves.forEach((elem)=>{
            //console.log('Presto change')
            elem.material.map = THREE.ImageUtils.loadTexture('mats/zielona_plansza.jpg');
            elem.material.needsUpdate = true;
            // elem.material.color.setHex(0xffff00)
          })
          // intersects[0].object.square
          // this.allSquares.forEach((elem)=>{
          //   if(intersects[0].object.colour=="black" && intersects[0].object.square+7==elem.personalId){
          //     elem.material.color.setHex(0x00ff00)
          //     this.moves.push(elem)
          //   }
          // })

      }

    }
  }

  checkSquare = (intersects) => {
    if (intersects[0].object.item && this.checkedPawns.length > 0 && intersects[0].object.colour == "black" && !this.animated && this.pionki[Math.floor(intersects[0].object.personalId / 8)][intersects[0].object.personalId % 8] == 0 ) {
      if(((this.checkedPawns[0].square + 7 == intersects[0].object.personalId || this.checkedPawns[0].square + 9 == intersects[0].object.personalId ) && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)+1 && this.checkedPawns[0].colour == "black") || ((this.checkedPawns[0].square - 7 == intersects[0].object.personalId || this.checkedPawns[0].square - 9 == intersects[0].object.personalId ) && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)-1 && this.checkedPawns[0].colour == "white"))
      {
      this.allow = !this.allow
      ui.eraseTimer()
      ////console.log('Ruch')
      // this.animated = true;
      this.tween = new TWEEN.Tween(this.checkedPawns[0].position)
        .to({ x: intersects[0].object.position.x, z: intersects[0].object.position.z }, 500)
        .repeat(0)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => { this.animated = true; })
        .onComplete(() => {
          this.animated = false; ////console.log('Done');
          let square = this.checkedPawns[0].square
          let startSquare = this.checkedPawns[0].square
          ////console.log(square)
          this.pionki[Math.floor(square / 8)][square % 8] = 0
          this.checkedPawns[0].square = intersects[0].object.personalId
          square = this.checkedPawns[0].square
          ////console.log(square)
          let hex
          if (this.checkedPawns[0].colour == "white") {
            this.pionki[Math.floor(square / 8)][square % 8] = 1
            hex = 0xffffff
          }
          else {
            this.pionki[Math.floor(square / 8)][square % 8] = 2
            hex = 0xffffff
          }
          this.checkedPawns[0].material.color.setHex(hex)
          this.checkedPawns.pop()
          
        if(this.moves.length == 1){
          // this.moves[0].material.color.setHex(0xffffff)
          this.moves[0].material.map = THREE.ImageUtils.loadTexture('mats/ciemna_plansza.jpg');
          this.moves[0].material.needsUpdate = true;
          this.moves.pop()
        }
        else if(this.moves.length == 2){
          // this.moves[0].material.color.setHex(0xffffff)
          this.moves[0].material.map = THREE.ImageUtils.loadTexture('mats/ciemna_plansza.jpg');
          this.moves[0].material.needsUpdate = true;
          // this.moves[1].material.color.setHex(0xffffff)
          this.moves[1].material.map = THREE.ImageUtils.loadTexture('mats/ciemna_plansza.jpg');
          this.moves[1].material.needsUpdate = true;
          this.moves.pop()
          this.moves.pop()
        }

          ////console.log(this.pionki)
          let victory = false
          if(this.color == "white"){
            this.pionki[0].forEach((elem)=>{
              if(elem == 1){
                victory = true
              }
            })
          }
          else{
            this.pionki[7].forEach((elem)=>{
              if(elem == 2){
                victory = true
              }
            })
          }
          if(victory == true){
            this.win()
          }
          net.sendUpdate(startSquare, square, this.color, -1, victory)
        })
        .start()
      this.tween.update()
      }

      // else if((((this.checkedPawns[0].square + 14 == intersects[0].object.personalId || this.checkedPawns[0].square + 18 == intersects[0].object.personalId ) && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)+2 && this.checkedPawns[0].colour == "black") || ((this.checkedPawns[0].square - 14 == intersects[0].object.personalId || this.checkedPawns[0].square - 18 == intersects[0].object.personalId ) && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)-2 && this.checkedPawns[0].colour == "white")) && (((this.pionki[Math.floor(this.checkedPawns[0].square/8)+1][this.checkedPawns[0].square%8+1] == 1 || this.pionki[Math.floor(this.checkedPawns[0].square/8)+1][this.checkNegative((this.checkedPawns[0].square%8)-1)] == 1) && this.checkedPawns[0].colour == "black") || ((this.pionki[this.checkNegative(Math.floor(this.checkedPawns[0].square/8)-1)][this.checkedPawns[0].square%8+1] == 2 || this.pionki[this.checkNegative(Math.floor(this.checkedPawns[0].square/8)-1)][this.checkNegative((this.checkedPawns[0].square%8)-1)] == 2) && this.checkedPawns[0].colour == "white"))){}
      else if(
        (this.checkedPawns[0].square + 14 == intersects[0].object.personalId && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)+2 && this.checkedPawns[0].colour == "black" && this.pionki[Math.floor(this.checkedPawns[0].square/8)+1][this.checkNegative((this.checkedPawns[0].square%8)-1)] == 1) ||

        (this.checkedPawns[0].square + 18 == intersects[0].object.personalId && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)+2 && this.checkedPawns[0].colour == "black" && this.pionki[Math.floor(this.checkedPawns[0].square/8)+1][this.checkedPawns[0].square%8+1] == 1) ||

        (this.checkedPawns[0].square - 18 == intersects[0].object.personalId && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)-2 && this.checkedPawns[0].colour == "white" && this.pionki[this.checkNegative(Math.floor(this.checkedPawns[0].square/8)-1)][this.checkNegative((this.checkedPawns[0].square%8)-1)] == 2) ||

        (this.checkedPawns[0].square - 14 == intersects[0].object.personalId && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)-2 && this.checkedPawns[0].colour == "white" && this.pionki[this.checkNegative(Math.floor(this.checkedPawns[0].square/8)-1)][this.checkedPawns[0].square%8+1] == 2)
        )
      {
      this.allow = !this.allow
      ui.eraseTimer()
      ////console.log('Ruch')
      // this.animated = true;
      this.tween = new TWEEN.Tween(this.checkedPawns[0].position)
        .to({ x: intersects[0].object.position.x, z: intersects[0].object.position.z }, 500)
        .repeat(0)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => { this.animated = true; })
        .onComplete(() => {
          let pawn
          this.allPawns.forEach((elem) => {
            if ((this.checkedPawns[0].square + 14 == intersects[0].object.personalId && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)+2 && this.checkedPawns[0].colour == "black" && this.pionki[Math.floor(this.checkedPawns[0].square/8)+1][this.checkNegative((this.checkedPawns[0].square%8)-1)] == 1) && elem.square == (Math.floor(this.checkedPawns[0].square/8)+1)*8+this.checkNegative((this.checkedPawns[0].square%8)-1)) {
              pawn = elem
              this.pionki[Math.floor(this.checkedPawns[0].square/8)+1][this.checkNegative((this.checkedPawns[0].square%8)-1)] = 0
            }

            else if ((this.checkedPawns[0].square + 18 == intersects[0].object.personalId && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)+2 && this.checkedPawns[0].colour == "black" && this.pionki[Math.floor(this.checkedPawns[0].square/8)+1][this.checkedPawns[0].square%8+1] == 1) && elem.square == (Math.floor(this.checkedPawns[0].square/8)+1)*8+this.checkedPawns[0].square%8+1){
              pawn = elem
              this.pionki[Math.floor(this.checkedPawns[0].square/8)+1][this.checkedPawns[0].square%8+1] = 0
            }

            else if ((this.checkedPawns[0].square - 18 == intersects[0].object.personalId && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)-2 && this.checkedPawns[0].colour == "white" && this.pionki[this.checkNegative(Math.floor(this.checkedPawns[0].square/8)-1)][this.checkNegative((this.checkedPawns[0].square%8)-1)] == 2) && elem.square == (this.checkNegative(Math.floor(this.checkedPawns[0].square/8)-1))*8+this.checkNegative((this.checkedPawns[0].square%8)-1)){
              pawn = elem
              this.pionki[this.checkNegative(Math.floor(this.checkedPawns[0].square/8)-1)][this.checkNegative((this.checkedPawns[0].square%8)-1)] = 0
            }

            else if ((this.checkedPawns[0].square - 14 == intersects[0].object.personalId && Math.floor(intersects[0].object.personalId/8) == Math.floor(this.checkedPawns[0].square/8)-2 && this.checkedPawns[0].colour == "white" && this.pionki[this.checkNegative(Math.floor(this.checkedPawns[0].square/8)-1)][this.checkedPawns[0].square%8+1] == 2) && elem.square == (this.checkNegative(Math.floor(this.checkedPawns[0].square/8)-1))*8+this.checkedPawns[0].square%8+1){
              pawn = elem
              this.pionki[this.checkNegative(Math.floor(this.checkedPawns[0].square/8)-1)][this.checkedPawns[0].square%8+1] = 0
            }
          })
          
          pawn.geometry.dispose();
          pawn.material.dispose();
          this.scene.remove(pawn);

          this.animated = false; ////console.log('Done');
          let square = this.checkedPawns[0].square
          let startSquare = this.checkedPawns[0].square
          ////console.log(square)
          this.pionki[Math.floor(square / 8)][square % 8] = 0
          this.checkedPawns[0].square = intersects[0].object.personalId
          square = this.checkedPawns[0].square
          ////console.log(square)
          let hex
          if (this.checkedPawns[0].colour == "white") {
            this.pionki[Math.floor(square / 8)][square % 8] = 1
            hex = 0xffffff
          }
          else {
            this.pionki[Math.floor(square / 8)][square % 8] = 2
            hex = 0xffffff
          }
          this.checkedPawns[0].material.color.setHex(hex)
          this.checkedPawns.pop()

          
        if(this.moves.length == 1){
          // this.moves[0].material.color.setHex(0xffffff)
          this.moves[0].material.map = THREE.ImageUtils.loadTexture('mats/ciemna_plansza.jpg');
          this.moves[0].material.needsUpdate = true;
          this.moves.pop()
        }
        else if(this.moves.length == 2){
          // this.moves[0].material.color.setHex(0xffffff)
          this.moves[0].material.map = THREE.ImageUtils.loadTexture('mats/ciemna_plansza.jpg');
          this.moves[0].material.needsUpdate = true;
          // this.moves[1].material.color.setHex(0xffffff)
          this.moves[1].material.map = THREE.ImageUtils.loadTexture('mats/ciemna_plansza.jpg');
          this.moves[1].material.needsUpdate = true;
          this.moves.pop()
          this.moves.pop()
        }

          ////console.log(this.pionki)
          let victory = true
          if(this.color == "white"){
            this.pionki.forEach((elem)=>{
              //console.log(elem)
              elem.forEach((lilElem)=>{
                //console.log(lilElem)
                if(lilElem == 2){
                  victory = false
                }
              })
            })
          }
          else{
            this.pionki.forEach((elem)=>{
              //console.log(elem)
              elem.forEach((lilElem)=>{
                //console.log(lilElem)
                if(lilElem == 1){
                  victory = false
                }
              })
            })
          }
          if(victory == false){
          if(this.color == "white"){
            this.pionki[0].forEach((elem)=>{
              if(elem == 1){
                victory = true
              }
            })
          }
          else{
            this.pionki[7].forEach((elem)=>{
              if(elem == 2){
                victory = true
              }
            })
          }
          }
          if(victory == true){
            this.win()
          }
          net.sendUpdate(startSquare, square, this.color, pawn.square, victory)
        })
        .start()
      this.tween.update()
      }
    }
  }

  checkNegative = (num)=>{
    if(num<0){
      return 0
    }
    else{
      return num
    }
  }
  animateMove = (start, end, color, deleted=-1) => {
    ////console.log("Move")
    //console.log("Animate ",deleted)
    let pawn
    console.group("animation")
    this.allPawns.forEach((elem) => {
      //console.log(elem.square, start)
      if (elem.square == start) {
        pawn = elem
      }
    })
    console.groupEnd("animation")
    let item
    this.allSquares.forEach((elem) => {
      if (elem.personalId == end) {
        item = elem
      }
    })
    ////console.log(pawn)
    ////console.log(item)
    ////console.log(color)
    ////console.log(this.color)
    ////console.log('Move trial')
    ////console.log(color)
    ////console.log(this.color)
    if (color != this.color) {
      ////console.log("Animate move")
      let pawn
      this.allPawns.forEach((elem) => {
        if (elem.square == start) {
          pawn = elem
        }
      })
      let item
      this.allSquares.forEach((elem) => {
        if (elem.personalId == end) {
          item = elem
        }
      })
      // this.animatedM = true;
      this.newTween = new TWEEN.Tween(pawn.position)
        .to({ x: item.position.x, z: item.position.z }, 500)
        .repeat(0)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => { this.animatedM = true; })
        .onComplete(() => {
          this.animatedM = false; ////console.log('Done');
          this.pionki[Math.floor(start / 8)][start % 8] = 0
          if (pawn.colour == "white") {
            this.pionki[Math.floor(end / 8)][end % 8] = 1
          }
          else {
            this.pionki[Math.floor(end / 8)][end % 8] = 2
          }
          pawn.square = end
          //console.log(this.pionki)
          if(deleted!=-1){
            let deletedPawn
            this.allPawns.forEach((elem) => {
              //console.log(elem.square)
              if (elem.square == deleted) {
                deletedPawn = elem
              }
            })
            deletedPawn.geometry.dispose();
            deletedPawn.material.dispose();
            this.scene.remove(deletedPawn);
            this.pionki[Math.floor(deleted/8)][deleted%8] = 0
          }
          this.allow = !this.allow
          ui.makeTimer()
        })
        .start()
      this.newTween.update()

    }
  }

  endGame = () =>{
    this.started = false
    document.getElementById('timer').style.display = "none"
    net.endGame(this.color)
    net.clearIntervals()
    ui.losingMessage()
    //console.log('You lost')
  }

  winGame = ()=>{
    this.started = false
    //console.log('You won')
    ui.winningMessage()
  }

  lose = ()=>{
    this.started = false
    //console.log('You lost')
    ui.losing()
    ui.eraseTimer()
    net.clearIntervals()
  }

  win = ()=>{
    this.started = false
    //console.log('You won')
    ui.winning()
    ui.eraseTimer()
    net.clearIntervals()
  }
}

// export default Game;
