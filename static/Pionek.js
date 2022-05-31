class Pionek extends THREE.Mesh {
  constructor(geometry, colour, square, pionek = true) {

    if (colour == "white") {
      const whiteMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        wireframe: false,
        map: new THREE.TextureLoader().load('mats/jasny_pionek.jpg')
      });
      super(geometry, whiteMaterial)

    }
    else if (colour == "black") {
      const blackMaterial = new THREE.MeshBasicMaterial({
        // color: 0x000000,
        side: THREE.DoubleSide,
        wireframe: false,
        map: new THREE.TextureLoader().load('mats/ciemny_pionek.jpg')
      });
      super(geometry, blackMaterial)
    }
    ////console.log(this);
    this.colour = colour
    this.pionek = pionek
    this.square = square
  }
}

// const pionek = new Pionek();
// ////console.log(pionek.type);
