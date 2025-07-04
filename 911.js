
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas1.width = window.innerWidth;
  canvas1.height = window.innerHeight;

  // Optional: reposition objects if needed
});





// 🎨 Main visible canvas
const canvas = document.getElementById('can');
const con = canvas.getContext('2d');


// 🕵️ Hidden canvas for pixel-perfect collision detection using colors
const canvas1 = document.getElementById('coll');
const coll = canvas1.getContext('2d', { willReadFrequently: true });




// Match size with main canvas
const collw = canvas1.width = window.innerWidth;
const collh = canvas1.height = window.innerHeight;

// Set canvas size to fill the entire window
const canw = canvas.width = window.innerWidth;
const canh = canvas.height = window.innerHeight;





let speed = 1;      // master speed multiplier (controlled by slider)
const bg1 = new Image(); bg1.src = 'sky1.png';

// 🕒 Game timing and state variables
let reveninter = 501;      // Interval (currently unused but can be used to slow down spawning)
let lastt = 0;            // Last frame timestamp
let timetonext = 0;       // Time accumulator for spawning ravens
let gf = 0;               // Global frame counter
let points = 0;           // Score
let lives =10;
con.font = '40px Impact'; // Score font

// 🐦 Array of active ravens on screen
let revens = [];
let explosion =[];
let smoke=[];

// 🐦 Raven class - represents a flying object to hit
class raven {
  constructor() {
    this.width = 110;
    this.height = 40;

    // Start at right edge, random vertical position
    this.x = canw;
    this.y = Math.random() * (canh - this.height);

    // Random speed and direction
    this.dirx = Math.random() * 5;
    this.diry = Math.random();

    // Sprite sheet values
    this.img = new Image();
    // this.img.src = "raven.png";
     this.img.src = "999.png";
    this.sw = 300;
    this.sh = 93;
    this.sf = 0;
    this.maxsf = 4; // Total frames
    this.wings = 0; // Timer to control flapping
    this.interval = Math.random() * 50 + 50;

    this.markdele = false; // Will be set true if hit

    // 🟪 Unique color for collision detection (used on hidden canvas)
    this.rancol = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    ];
    this.color = 'rgb(' + this.rancol[0] + ',' + this.rancol[1] + ',' + this.rancol[2] + ')';
  }

  // ⏱️ Movement & animation logic
   update(deltatime) {
    // Bounce off top and bottom
    if (this.y < 0 || this.y > canh - this.height) {
      this.diry *= -1;
    }

    // Move left + slight vertical motion
    this.x -= this.dirx;
    this.y += this.diry;

    // Control sprite frame switching based on elapsed time
    this.wings += deltatime;
    if (this.wings > this.interval) {
      if(this.sf>this.maxsf) this.sf=0;
      else this.sf++;
      this.wings = 0;

      smoke.push(new Smoke(this.x,this.y,this.width,"grey"));
    }

    // // Extra logic based on frame count (can be reused for syncing animations)
    if (gf % this.wings === 0) {
      this.sf = (this.sf + 1) % (this.maxsf + 1);
    }
  }

  // 🎨 Draw to both canvases
  draw() {
    // Draw hitbox with solid color on hidden canvas
    coll.fillStyle = this.color;
    coll.fillRect(this.x, this.y, this.width, this.height);
     
    // Draw raven sprite on visible canvas
    con.drawImage(
      this.img,
      0, // Crop frame from sprite sheet
      0,
      this.sw,
      this.sh,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
};


// Explosion class handles image/sound, position, animation frames, and rotation
class Explosion {
    constructor(x, y,size) {
        // Load explosion image (spritesheet)
        this.img = new Image();
        this.img.src = "boom.png";

        // Load explosion sound
        this.sound = new Audio();
        this.sound.src = "sound/Wind effects 5.wav";

        // Explosion position (where user clicked)
        this.x = x;
        this.y = y;

        // Sprite frame width and height (from image)
        this.sw = 200;
        this.sh = 178;

        // Scale explosion size to 70%
        this.width = this.sw * 0.7;
        this.height = this.sh * 0.7;

        // Sprite frame index
        this.sf = 0;
        this.size=size;

        // Timer for controlling animation speed
        this.timer = 0;
 this.interval = Math.random() * 50 + 50;
        // Random rotation angle for effect variety
        this.angle = Math.random() * 6.2; // ~0 to 2π radians
        this.markdele = false; // Will be set true if hit
    }

    // Update explosion frame and play sound once
     update(deltatime) {
        if (this.sf === 0) this.sound.play(); // Play sound only on first frame
       

         // Control sprite frame switching based on elapsed time
    this.timer += deltatime;
    if (this.timer > this.interval) {
     
         this.sf++; // Go to next sprite frame every 10 ticks
this.timer=0;
         if(this.sf>5) this.markdele=true;
    }
    }

    // Draw current explosion frame with rotation
    draw() {
    
        // Draw current frame of sprite
        con.drawImage(
            this.img,
            this.sf * this.sw, // source x in spritesheet
            0,
            this.sw,
            this.sh,
            this.x , // center it
            this.y- this.size / 4,
            this.size,
            this.size
        );

       
    }
};



class layer {
    constructor(image, speedm) {
        this.x = 0;                          // current x position of image
        this.y = 0;                          // y is fixed at top
        this.x1 = 600;                        // backup x1 (not used directly here)
        this.width = canw;
        this.height = canh;
        this.x2 = this.width;               // secondary image position (for seamless scroll)
        this.image = image;                 // image to draw
        this.speedm = speedm;               // speed multiplier for parallax effect
        this.speed = speed * this.speedm;   // final calculated speed
    }

    update() {
        this.speed = speed * this.speedm;   // update speed if global speed changes

        // reset image position once it moves off screen
        if (this.x <= -this.width) this.x = 0;

        // move image to left
        this.x = Math.floor(this.x - this.speed);
    }

    draw() {
        // draw two copies of the image side-by-side for infinite scrolling effect
        con.drawImage(this.image, this.x, this.y, this.width, this.height);
        con.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
};



class Smoke{
   constructor(x, y,size,color) {
       
        this.size=size;
        // Explosion position (where user clicked)
        this.x = x + this.size/2;
        this.y = y + this.size/3;

        this.rad=Math.random()*this.size/7;
        this.maxrad=Math.random()*10+5;
        // Sprite frame index
        this.sf = 0;
       
         this.speedx=Math.random();
        this.color=color;
        this.markdele = false; // Will be set true if hit
    }

    update(){
      this.x+=this.speedx;
      this.rad+=0.2;
      if(this.rad>this.maxrad) this.markdele=true;
    }
    draw(){
      con.beginPath();
      con.fillStyle=this.color;
      con.arc(this.x,this.y,this.rad,0,Math.PI*2);
      con.fill();

    }

};


class Obstacle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img1 = new Image();
this.img1.src = "build1.png";
 this.img2 = new Image();
this.img2.src = "build2.png";
  }

  draw() {
    if(lives>0)
    con.drawImage(
            this.img1,this.x,this.y,this.width,this.height
        );
        else 
          con.drawImage(
            this.img2,this.x,this.y,this.width,this.height
        );


  }
}


// 🧾 Draw score text (can reuse this style in all games)
function point() {
  con.fillStyle = 'black'; // Shadow
  con.fillText('score: ' + points, 52, 77);
  con.fillStyle = 'white'; // Foreground
  con.fillText('score: ' + points, 50, 75);
   con.fillStyle = 'black'; // Shadow
  con.fillText('Lives: ' + lives, 502, 77);
   con.fillStyle = 'white'; // Foreground
  con.fillText('Lives: ' + lives, 500, 75);
}

// 🎯 Click detection - get pixel color under mouse and match it with raven color
window.addEventListener('mouseover', function (e) {
  const canvasPos = canvas1.getBoundingClientRect(); // Always subtract canvas position
  const x = e.x - canvasPos.left;
  const y = e.y - canvasPos.top;

  const detect = coll.getImageData(x, y, 1, 1);
  const pc = detect.data;

  for (let i = 0; i < revens.length; i++) {
    if (
      revens[i].rancol[0] === pc[0] &&
      revens[i].rancol[1] === pc[1] &&
      revens[i].rancol[2] === pc[2]
    ) {
      revens[i].markdele = true;
      points++;
       explosion.push(new Explosion(revens[i].x, revens[i].y,revens[i].width)); // Add new explosion to array
       console.log(explosion);
    }

  }
});


function check(){
    // Check raven-obstacle collision
for (let i = 0; i < revens.length; i++) {
  for (let j = 0; j < obstacles.length; j++) {
    const r = revens[i];
    const o = obstacles[j];

    if (
      r.x < o.x + o.width &&
      r.x + r.width > o.x &&
      r.y < o.y + o.height &&
      r.y + r.height > o.y
    ) {
      r.markdele = true;
      explosion.push(new Explosion(r.x, r.y, r.width));
      lives--; // Optional: lose points if raven hits obstacle
    }
  }
}

};



function gameover(){

       con.fillStyle = 'black'; // Shadow
  con.fillText('Game Over :  Score = ' + points, canw/2, canh/2);
   con.fillStyle = 'red'; // Foreground
 con.fillText('Game Over :  Score = ' + points, canw/2+2, canh/2+2);
    
}








let obstacles = [
  new Obstacle( canw*0.1, canh / 2 - 50, canw*0.08, 394),  new Obstacle(canw*0.2, canh / 2 - 50,canw*0.08, 394), // Example centered obstacle
];
const l1 = new layer(bg1, 0.5);
// 🔁 Game loop
function loop(timestamp) {
  // Clear both canvases
  con.clearRect(0, 0, canw, canh);
  coll.clearRect(0, 0, collw, collh);


  check();
  // ⏱️ Time tracking for deltaTime-based animation
  let deltatime = timestamp - lastt;
  lastt = timestamp;
  timetonext += deltatime;

  // ⏳ Spawn new raven after time delay
  if (timetonext > reveninter) {
    revens.push(new raven());
    timetonext = 0;

    // Sort ravens by width (if needed for depth sorting or rendering order)
    revens.sort(function (a, b) {
      return a.width - b.width;
    });
  };

  // 📦 Update & draw only 1/8th of ravens for performance
  // for (let i = 0; i < revens.length / 8; i++) {
  //   revens[i].update(deltatime); 
  //   revens[i].draw(); 
  //   }
   
        l1.update();
        l1.draw();
    
  [...smoke,...revens,...explosion].forEach(object=>object.update(deltatime));
  [...smoke,...revens,...explosion].forEach(object=>object.draw());
 

for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].draw();
  }
  // 🧹 Remove ravens marked for deletion
  revens = revens.filter(object => !object.markdele);
  explosion = explosion.filter(object => !object.markdele);

  smoke = smoke.filter(object => !object.markdele);







  // Draw score
  point();
if(lives<1) gameover();
else
  requestAnimationFrame(loop); // Call next frame
}

loop(0); 


























































