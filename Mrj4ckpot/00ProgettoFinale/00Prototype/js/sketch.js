
//
//
//
// GUI 3D
//
//
//

let tassella = {
  Taxelation: "Random",
  Resolution: 12,
  Behold: function() {
    indovina();
    background(30);},

   Display: function() {

     if (beholder && mappa){
       createCanvas(windowWidth, windowHeight, WEBGL);
       avviaEasycam();

       $("#divGui1").hide();
       gui3D();
       $("#divGui2").show();

       ginoMask = gino;
       ginoMask.mask(mappa);
       mondo3D = true;
     }
    },

    ReMap: function() {
      res = tassella.Resolution;
      f = 0;
      k = 0;

if(tassella.Taxelation == "Random"){
     // Scelgo random se il tassello proviene da A o da B
     for (let x = 0; x < beholder.width; x+=res) {
       Tasselli[x] = [];
       for (let y = 0; y < beholder.height; y+=res) {

         if(random(2)>=1){
         Tasselli[x][y] = true;
           contaA++;
         } else {
         Tasselli[x][y] = false;
           contaB++;
         }

         let posx = x;
         let posy = y;

         let dimx = res;
         let dimy = res;
       k=0;
       f++;
       }
     }

} else if (tassella.Taxelation == "Sight"){
  // La probabilità che venga preso un tassello da B aumenta mano a mano che ci spostiamo a Sx
  let dove;

  for (let x = 0; x < beholder.width; x+=res) {
    Tasselli[x] = [];
    for (let y = 0; y < beholder.height; y+=res) {

      dove = map((beholder.width - x), beholder.width, 1, 5, 0);


      if(random(dove)>1){
      Tasselli[x][y] = true;
        contaA++;
      } else {
      Tasselli[x][y] = false;
        contaB++;
      }

      let posx = x;
      let posy = y;

      let dimx = res;
      let dimy = res;
    k=0;
    f++;
    }
  }
} else if (tassella.Taxelation == "CatadioptricLight"){

  for (let x = 0; x < beholder.width; x+=res) {
    Tasselli[x] = [];
    for (let y = 0; y < beholder.height; y+=res) {

      let catA = A.get(x, y);
      let catB = B.get(x, y);

      if( catA <= catB){
      Tasselli[x][y] = true;
        contaA++;
      } else {
      Tasselli[x][y] = false;
        contaB++;
      }

      let posx = x;
      let posy = y;

      let dimx = res;
      let dimy = res;
    k=0;
    f++;
    }
  }
} else if (tassella.Taxelation == "CatadioptricDark"){

  for (let x = 0; x < beholder.width; x+=res) {
    Tasselli[x] = [];
    for (let y = 0; y < beholder.height; y+=res) {

      let catA = A.get(x, y);
      let catB = B.get(x, y);

      if( catA >= catB){
      Tasselli[x][y] = true;
        contaA++;
      } else {
      Tasselli[x][y] = false;
        contaB++;
      }

      let posx = x;
      let posy = y;

      let dimx = res;
      let dimy = res;
    k=0;
    f++;
    }
  }
}



   },
};



let oggetto = {
  Smooth: function() {
    mappaTemp.filter(BLUR, 3);
    caricaModello();
  },
  Geometry: "Mesh",
  BlackAndWhite: false,
  Brightness: 1,
  Heightmap: 1,

  CellShape: "Circle",
  CellScale: 1,

  Wireframe: false,
};


function guiTassella(){

  var gui1 = new dat.GUI({ autoPlace: false });

  var t1 = gui1.addFolder('1: Look at');
  t1.add(tassella, 'Taxelation', [ 'Random', 'Sight', 'CatadioptricLight',  'CatadioptricDark'] );
  t1.add(tassella, 'Resolution', 1, 25 );
  t1.add(tassella, 'ReMap');


  var t2 = gui1.addFolder('2: Behold');
  t2.add(tassella, 'Behold');

  var t3 = gui1.addFolder('3: Display');
  t3.add(tassella, 'Display');

  var customContainer = document.getElementById('divGui1');
  customContainer.appendChild(gui1.domElement);
}



function gui3D(){

  var gui2 = new dat.GUI();
  gui2.add(oggetto, 'Geometry', [ 'Mesh', 'Causeway'] );
  gui2.add(oggetto, 'BlackAndWhite' );
  gui2.add(oggetto, 'Smooth');
  gui2.add(oggetto, 'Brightness', 0, 5 );
  gui2.add(oggetto, 'Heightmap', -5, 5 );
  gui2.add(oggetto, 'Wireframe' );

  var f1 = gui2.addFolder('Causeway options');
  f1.add(oggetto, 'CellShape', [ 'Circle', 'Square'] );
  f1.add(oggetto, 'CellScale', 0, 5 );

  var f2 = gui2.addFolder('Mesh options');

  var customContainer2 = document.getElementById('divGui2');
  customContainer2.appendChild(gui2.domElement);
}



// VARIABILI DI BEHOLDER MAP RECOGNITION
let A, B;
let puntiA = [];
let puntiB = [];

let beholder;
let Tasselli = [];

let res = 12;

let contaA = 0;
let contaB = 0;

let prontoA=false;
let prontoB=false;

let classifier;

let gino = false;
let mappa = false;
let mappaTemp = false;
let ginoMask= false;
let daMappare;
let imgsResolution;

let posIniX;
let posIniY;



// VARIABILI DI BEHOLDER 3D EDITOR
let easycam;
let punti = [];
let voxel = [];
let voxelBN = [];

let viewMode = 0;
let rot=0;

let multi = 1;

let cam1;

let colore;
let u,v;

let mondo3D = false;



function ALoad() {
  A.loop();
  A.volume(0);
}

function BLoad() {
  B.loop();
  B.volume(0);
}





function carica(url, id){
let img = loadImage(url,  ready => { id=true;  });
  return img;
}

// precarico ml5 e le immagini sorgente
function preload() {
  classifier = ml5.imageClassifier('MobileNet');

          // SOURCE IMMAGINI
//  A = carica("https://i.imgur.com/0CCUUrr.jpg?1", prontoA);
  B = carica("https://i.imgur.com/4g85mHn.jpg?1", prontoB);

          // SOURCE VIDEO
  A = createVideo (['vid/videoA.mp4']);
//  A.resize(510, 510);
//  A.size(510, 510);
  ALoad();
  A.hide();

  B = createVideo (['vid/videoB.mp4']);
  BLoad();
  B.hide();

          // SOURCE WEBCAM
//  A = createCapture(VIDEO);
//  A.size(510, 510);
//  A.hide();

//  B = createCapture(VIDEO);
//  B.size(500, 500);
  //B.hide();

}



//
//
//
// FUNZIONI DI BEHOLDER MAP RECOGNITION
//
//
//



// ml5 riconosce l'immagine
function gotResult(error, results) {

  if (error) {
    console.error(error);
  }

  console.log(results);

      daMappare = results[0].label;


}


// inserisce il suggerimento di ml5 e cerca l'immagine corrispettiva su unsplash
function aCheAssimiglia(immagine, keywords) {
  imgsResolution= immagine.width + "x" + immagine.height;
  var url = "https://source.unsplash.com/" + imgsResolution + "/?" + keywords + "&" + random(200); // < un random per caricarne sempre una nuova anche sugli stessi temi
  var img_Loading = loadImage(url);
  return img_Loading;
}


// inserisco gotResult e aChiAssomiglia dentro una funzione in modo da fermare il programma
function indovina(){

  gino = get(posIniX, posIniY, beholder.width, beholder.height);
  classifier.classify(gino, gotResult);
  mappa = aCheAssimiglia(gino, daMappare);

}







// // // // // //
// // // //
// //
// SETUP
// //
// // // //
// // // // // //




function setup() {
  createCanvas(windowWidth, windowHeight);
    background(220);
    noStroke();
    background(40);

  //  gui3D();
    guiTassella();

    beholder = createImage(500, 500);

    posIniX=(windowWidth/2)-(beholder.width);
    posIniY=(windowHeight/2)-beholder.width/2;

/*
// EASYCAM
    Dw.EasyCam.prototype.apply = function(n) {
        var o = this.cam;
        n = n || o.renderer,
        n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))

      };

    easycam = new Dw.EasyCam(_renderer, {
      distance: 350,
      center: [0,0,0]
    });

    easycam.setViewport([0, 0, windowWidth, windowHeight]);

    // start with an animated rotation
    easycam.setRotation(Dw.Rotation.create({
      angles_xyz: [0, -PI / 3, PI / 2]
    }), 4000);
    easycam.setDistance(500, 2500);
*/
  //console.log("TOTALE "+(contaA+contaB)+"||||||||||||||||||"+contaA+" BLU"+"|||||||"+contaB+" ROSSO");



  // CREA IL MOSAICO DEI TASSELLI
  //if(gino==false){
     f = 0;
     k = 0;
    for (let x = 0; x < beholder.width; x+=res) {
      Tasselli[x] = [];
      for (let y = 0; y < beholder.height; y+=res) {

        if(random(2)>=1){
        Tasselli[x][y] = true;
          contaA++;
        } else {
        Tasselli[x][y] = false;
          contaB++;
        }

        let posx = x;
        let posy = y;

        let dimx = res;
        let dimy = res;

      k=0;
      f++;
      }

    }



}





// // // // // //
// // // //
// //
// DRAW
// //
// // // //
// // // // // //





function draw() {

background(30);
if (mondo3D==false){



// DISPONE I TASSELLI DELLE DUE SORGENTI
  //A.resize(beholder.width, beholder.height);
  //B.resize(beholder.width, beholder.height);

    for (let x = 0; x < beholder.width; x+=res) {
      for (let y = 0; y < beholder.height; y+=res) {

        posx = x+posIniX;
        posy = y+posIniY;

        if(Tasselli[x][y]==false){
           image(A, posx, posy, res, res, posx-posIniX, posy-posIniY, res, res);
           } else{
           image(B, posx, posy, res, res, posx-posIniX, posy-posIniY, 1.1*res, 1.2*res);
           }
      }
    }
//}

// PREMI TASTO A:
// STAMPA A SCHERMO L'IMMAGINE SORGENTE E LA BASE PER L'HEIGHTMAP
if (gino && mappa){
   gino.resize(500,500);
   image(gino,posIniX,posIniY);

  mappa.resize(500,500);
  //mappa.filter(TRESHOLD);
  //mappa.filter(BLUR, 4);

  image(mappa, (windowWidth/2), (windowHeight/2)-250);

  for (let x = 0; x < beholder.width; x+=res) {
    for (let y = 0; y < beholder.height; y+=res) {

      posx = x+posIniX;
      posy = y+posIniY;

      if(Tasselli[x][y]==false){
         image(A, posx, posy, res, res, posx-posIniX, posy-posIniY, res, res);
         } else{
         image(B, posx, posy, res, res, posx-posIniX, posy-posIniY, 1.1*res, 1.2*res);
         }
    }
  }

  fill(30);
  rect(0,0, windowWidth, posIniY);

  fill(255);
  textSize(32);
  textAlign(CENTER);

  caricaModello();
  text("It looks like a "+daMappare, windowWidth/2, (windowHeight/2)-300);
}

noFill();
strokeWeight(3);
stroke(240);

rect(posIniX, posIniY, beholder.width, beholder.height);
rect(posIniX+beholder.width, posIniY, beholder.width, beholder.height);

strokeWeight(0);
 }


 // PREMI TASTO S:
 // CREA IL MODELLO 3D CON TEXTURE
else{

background(30);

translate(-gino.width/2, -gino.height/2, -oggetto.Heightmap/2);
stroke(255);
ambientLight(255);
fill(255);
strokeWeight(.5);


//-------------CAUSEWAY
//--------------------------------
//--------------------------------
  if (oggetto.Geometry == "Causeway") {
    noStroke();
    for (let x = 0; x < punti.length; x++) {
      for (let y = 0; y < punti[x].length; y++) {
        let h = punti[x][y];
        push();
        translate(x*res,y*res,h*oggetto.Heightmap);


if( oggetto.BlackAndWhite == false){
fill(voxel[x][y]);
} else {
fill(voxelBN[x][y]*oggetto.Brightness);
}



if( oggetto.CellShape == "Square"){
rect(0,0,res*oggetto.CellScale,res*oggetto.CellScale);
}

if( oggetto.CellShape == "Circle"){
ellipse(0,0,res*oggetto.CellScale,res*oggetto.CellScale);
}

        pop();
      }
    }
  }




  // MESH
  //--------------------------------
  //--------------------------------
  //--------------------------------

    //texture(img);
    for (let x = 0; x < punti.length-1; x++) {


        beginShape(TRIANGLE_STRIP);
        for (let y = 0; y < punti[x].length-1; y++) {

          if(oggetto.Wireframe == true){


            noFill();
            if( oggetto.BlackAndWhite == false){
            stroke(voxel[x][y]);
            } else {
            stroke(voxelBN[x][y]*oggetto.Brightness);
            }


          } else {
            texture(ginoMask);
          }
            vertex(x * res, y * res, punti[x][y]*oggetto.Heightmap, u-res, v);
            vertex((x+1) * res , y * res, punti[x+1][y]*oggetto.Heightmap, u, v);
            v +=res;
        }
        v = 0;
        u +=res;
        endShape();
    }
    u=0;
}



}


function keyPressed(){
 // TASTO A FA LO SCREEN DI BEHOLDER E TROVA UN'IMMAGINE CHE GLI SOMIGLIA
  if (key == 'a') {

    indovina();
    background(30);

   }


   // TASTO A FA LO SCREEN DI BEHOLDER E TROVA UN'IMMAGINE CHE GLI SOMIGLIA
    if (key == 's') {

      createCanvas(windowWidth, windowHeight, WEBGL);
      avviaEasycam();

      $("#divGui1").hide();
      gui3D();
      $("#divGui2").show();

      ginoMask = gino;
      ginoMask.mask(mappa);
      mondo3D = true;

     }
}


function windowResized() {
resizeCanvas(windowWidth, windowHeight);
posIniX=(windowWidth/2)-(beholder.width)/2-beholder.width;
posIniY=(windowHeight/2)-beholder.width/2;
}



//
//
//
// FUNZIONI DI BEHOLDER 3D EDITOR
//
//
//

function caricaModello() {
  // CARICA MAPPA DISPLACEMENT
   mappaTemp = mappa;
   //mappaTemp.filter(BLUR, oggetto.Smooth);


    mappaTemp.loadPixels();
    let f = 0;
    let k = 0;
    for (let x = 0; x < mappaTemp.width-res; x+=res) {
      punti[f] = [];
      for (let y = 0; y < mappaTemp.height-res; y+=res) {
        let c = mappaTemp.get(x, y);
        let h = brightness(c);
        punti[f][k] = h;
        k++;
      }
      k=0;
      f++;
    }
    mappaTemp.updatePixels();

  // CARICA TEXTURE
    gino.loadPixels();
    let i = 0;
    let j = 0;
    for (let x = 1; x <= gino.width-res; x+=res) {
      voxel[i] = [];
      voxelBN[i] = [];
      for (let y = 1; y <= gino.height-res; y+=res) {
        let c = gino.get(x, y);
        let h = brightness(c);
        voxel[i][j] = c;
        voxelBN[i][j] = h;
        j++;
      }
      j=0;
      i++;
    }
    gino.updatePixels();
}


function avviaEasycam(){
  // EASYCAM
      Dw.EasyCam.prototype.apply = function(n) {
          var o = this.cam;
          n = n || o.renderer,
          n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))

        };

      easycam = new Dw.EasyCam(_renderer, {
        distance: 350,
        center: [0,0,0]
      });

      easycam.setViewport([0, 0, windowWidth, windowHeight]);

      // start with an animated rotation
      easycam.setRotation(Dw.Rotation.create({
        angles_xyz: [0, -PI / 3, PI / 2]
      }), 4000);
      easycam.setDistance(500, 2500);
}
