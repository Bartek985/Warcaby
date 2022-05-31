class Item extends THREE.Mesh {
  constructor(geometry, colour, personalId = 3, item = true) {

    const whiteMaterial = new THREE.MeshBasicMaterial({
      color: 0xe9e3d0,
      side: THREE.DoubleSide,
      wireframe: false,
      map: new THREE.TextureLoader().load('mats/jasna_plansza.jpg')
    });
    const blackMaterial = new THREE.MeshBasicMaterial({
      // color: 0x600000,
      side: THREE.DoubleSide,
      wireframe: false,
      map: new THREE.TextureLoader().load('mats/ciemna_plansza.jpg')
    });

    if(colour == "white"){
      super(geometry, whiteMaterial); // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
      ////console.log(this);
    }
    else{
      super(geometry, blackMaterial); // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
      ////console.log(this);
    }
    this.colour = colour
    this.item = item
    this.personalId = personalId
  }
}

