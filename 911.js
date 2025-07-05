
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas1.width = window.innerWidth;
  canvas1.height = window.innerHeight;


});






const canvas = document.getElementById('can');
const con = canvas.getContext('2d');


const canvas1 = document.getElementById('coll');
const coll = canvas1.getContext('2d', { willReadFrequently: true });





const collw = canvas1.width = window.innerWidth;
const collh = canvas1.height = window.innerHeight;


const canw = canvas.width = window.innerWidth;
const canh = canvas.height = window.innerHeight;





let speed = 1;     
const bg1 = new Image(); bg1.src = 'sky1.png';


let reveninter = 1201;      
let lastt = 0;            
let timetonext = 0;       
let gf = 0;               
let points = 0;          
let lives =10;
con.font = '40px Impact'; 


let revens = [];
let explosion =[];
let smoke=[];


class raven {
  constructor() {
    this.width = 110;
    this.height = 40;

  
    this.x = canw;
    this.y = Math.random() * (canh - this.height);

   
    this.dirx = Math.random() * 5;
    this.diry = Math.random();

    
    this.img = new Image();
    // this.img.src = "raven.png";
     this.img.src = "999.png";
    this.sw = 300;
    this.sh = 93;
    this.sf = 0;
    this.maxsf = 4; 
    this.wings = 0; 
    this.interval = Math.random() * 50 + 50;
       this.hast=Math.random()>0.5;

    this.markdele = false; 

   
    this.rancol = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    ];
    this.color = 'rgb(' + this.rancol[0] + ',' + this.rancol[1] + ',' + this.rancol[2] + ')';
  }

  
   update(deltatime) {
    // Bounce off top and bottom
    if (this.y < 0 || this.y > canh - this.height) {
      this.diry *= -1;
    }

  
    this.x -= this.dirx;
    this.y += this.diry;

  
    this.wings += deltatime;
    if (this.wings > this.interval) {
      if(this.sf>this.maxsf) this.sf=0;
      else this.sf++;
      this.wings = 0;

     if(this.hast){
  for(let i=0;i<5;i++)
smoke.push(new Smoke(this.x,this.y,this.width,"grey"));
}
   
    }

  
    if (gf % this.wings === 0) {
      this.sf = (this.sf + 1) % (this.maxsf + 1);
    }
  }

 
  draw() {
    
    coll.fillStyle = this.color;
    coll.fillRect(this.x, this.y, this.width, this.height);
    
    con.drawImage(
      this.img,
      0, 
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



class Explosion {
    constructor(x, y,size) {
        
        this.img = new Image();
        this.img.src = "boom.png";

        
        this.sound = new Audio();
        this.sound.src = "sound/Wind effects 5.wav";

        
        this.x = x;
        this.y = y;

        
        this.sw = 200;
        this.sh = 178;

        
        this.width = this.sw * 0.7;
        this.height = this.sh * 0.7;

        // Sprite frame index
        this.sf = 0;
        this.size=size;

        
        this.timer = 0;
 this.interval = Math.random() * 50 + 50;
        
        this.angle = Math.random() * 6.2; 
        this.markdele = false; 
    }

    
     update(deltatime) {
        if (this.sf === 0) this.sound.play(); 
       

    this.timer += deltatime;
    if (this.timer > this.interval) {
     
         this.sf++; 
this.timer=0;
         if(this.sf>5) this.markdele=true;
    }
    }

    
    draw() {
    
        
        con.drawImage(
            this.img,
            this.sf * this.sw, 
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
        this.x = 0;                       
        this.y = 0;                         
        this.x1 = 600;                       
        this.width = canw;
        this.height = canh;
        this.x2 = this.width;               
        this.speedm = speedm;              
        this.speed = speed * this.speedm;  
        this.image=image; 
    }

    update() {
        this.speed = speed * this.speedm;   


        if (this.x <= -this.width) this.x = 0;

        // move image to left
        this.x = Math.floor(this.x - this.speed);
    }

    draw() {
       
        con.drawImage(this.image, this.x, this.y, this.width, this.height);
        con.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
};



class Smoke{
   constructor(x, y,size,color) {
       
        this.size=size;
       
        this.x = x + this.size/2;
        this.y = y + this.size/3;

        this.rad=Math.random()*this.size/10;
        this.maxrad=Math.random()*20+20;
        
        this.sf = 0;
       
         this.speedx=Math.random()*0.1 +0.5;
        this.color=color;
        this.markdele = false; 
    }

    update(){
      this.x+=this.speedx;
      this.rad+=0.3;
      if(this.rad>this.maxrad-5) this.markdele=true;
    }
    draw(){
     con.save();
      con.globalAlpha=1-this.rad/this.maxrad;
      con.beginPath();
      con.fillStyle=this.color;
      con.arc(this.x,this.y,this.rad,0,Math.PI*2);
      con.fill();
      con.restore();

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


function point() {
  con.fillStyle = 'black'; 
  con.fillText('Score: ' + points, 20, 77);
  con.fillStyle = 'white'; 
  con.fillText('Score: ' + points, 20, 75);
   con.fillStyle = 'black'; 
  con.fillText('Lives: ' + lives, canw-200, 77);
   con.fillStyle = 'red'; 
  con.fillText('Lives: ' + lives, canw-202, 75);
}


window.addEventListener('click', function (e) {
  const canvasPos = canvas1.getBoundingClientRect(); 
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
      lives--; 
    }
  }
}

};



function gameover(){

       con.fillStyle = 'black'; 
  con.fillText('Game Over :  Score = ' + points, canw/2, canh/2);
   con.fillStyle = 'red'; 
 con.fillText('Game Over :  Score = ' + points, canw/2+2, canh/2+2);
    
}








let obstacles = [
  new Obstacle( canw*0.1, canh / 2 - 50, canw*0.08, canh/2+100),  new Obstacle(canw*0.2, canh / 2 - 50,canw*0.08, canh/2+100), // Example centered obstacle
];
const l1 = new layer(bg1, 0.5);

function loop(timestamp) {
  
  con.clearRect(0, 0, canw, canh);
  coll.clearRect(0, 0, collw, collh);


  check();
 
  let deltatime = timestamp - lastt;
  lastt = timestamp;
  timetonext += deltatime;

 
  if (timetonext > reveninter) {
    revens.push(new raven());
    timetonext = 0;

   
    revens.sort(function (a, b) {
      return a.width - b.width;
    });
  };


   
        l1.update();
        l1.draw();
    
  [...smoke,...revens,...explosion].forEach(object=>object.update(deltatime));
  [...smoke,...revens,...explosion].forEach(object=>object.draw());
 

for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].draw();
  }
  
  revens = revens.filter(object => !object.markdele);
  explosion = explosion.filter(object => !object.markdele);

  smoke = smoke.filter(object => !object.markdele);








  point();
if(lives<1) gameover();
else
  requestAnimationFrame(loop); 
}

loop(0); 


























































