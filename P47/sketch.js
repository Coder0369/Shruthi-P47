var bg,bgImg;
var player, shooterImg, shooter_shooting;
var crow, crowImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var crowGroup;

var score = 0;
var life = 3;
var bullets = 40;

var heart1, heart2, heart3

var gameState = "fight"

var lose, winning, explosionSound;


function preload(){
  
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  crowImg = loadImage("assets/crow.gif")

  bgImg = loadImage("assets/bg.jpg")

  lose = loadSound("assets/lose.mp3")
  winning = loadSound("assets/win.mp3")
  explosionSound = loadSound("assets/explosion.mp3")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 2.5
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)


   //creating sprites to depict lives remaining
   heart1 = createSprite(displayWidth-150,40,20,20)
   heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(displayWidth-100,40,20,20)
    heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(displayWidth-150,40,20,20)
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4
   

    //creating groups for crows and bullets
    bulletGroup = new Group()
    crowGroup = new Group()



}

function draw() {
  background(0); 


if(gameState === "fight"){

  //displaying the appropriate image according to lives reamining
  if(life===3){
    heart3.visible = true
    heart1.visible = false
    heart2.visible = false
  }
  if(life===2){
    heart2.visible = true
    heart1.visible = false
    heart3.visible = false
  }
  if(life===1){
    heart1.visible = true
    heart3.visible = false
    heart2.visible = false
  }

  //go to gameState "lost" when 0 lives are remaining
  if(life===0){
    gameState = "lost"
    
  }


  //go to gameState "won" if score is 100
  if(score==100){
    gameState = "won"
    winning.play();
  }

  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  bullet = createSprite(displayWidth-1150,player.y-30,20,10)
  bullet.velocityX = 20
  
  bulletGroup.add(bullet)
  player.depth = bullet.depth
  player.depth = player.depth+2
  player.addImage(shooter_shooting)
  bullets = bullets-1
  explosionSound.play();
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

//go to gameState "bullet" when player runs out of bullets
if(bullets==0){
  gameState = "bullet"
  lose.play();
    
}

//destroy the crow when bullet touches it and increase score
if(crowGroup.isTouching(bulletGroup)){
  for(var i=0;i<crowGroup.length;i++){     
      
   if(crowGroup[i].isTouching(bulletGroup)){
        crowGroup[i].destroy()
        bulletGroup.destroyEach()
        explosionSound.play();
 
        score = score+2
        } 
  
  }
}

//reduce life and destroy crow when player touches it
if(crowGroup.isTouching(player)){
 
   lose.play();
 

 for(var i=0;i<crowGroup.length;i++){     
      
  if(crowGroup[i].isTouching(player)){
       crowGroup[i].destroy()
      
      life=life-1
       } 
 
 }
}

//calling the function to spawn crows
enemy();
}




drawSprites();

//displaying the score and remaining lives and bullets
textSize(20)
  fill("black")
text("Bullets = " + bullets,displayWidth-210,displayHeight/2-250)
text("Score = " + score,displayWidth-200,displayHeight/2-220)
text("Lives = " + life,displayWidth-200,displayHeight/2-280)

//destroy crow and player and display a message in gameState "lost"
if(gameState == "lost"){
  
  textSize(100)
  fill("red")
  text("You Lost ",400,400)
  crowGroup.destroyEach();
  player.destroy();

}

//destroy crow and player and display a message in gameState "won"
else if(gameState == "won"){
 
  textSize(100)
  fill("black")
  text("You Won ",400,400)
  crowGroup.destroyEach();
  player.destroy();

}

//destroy crow, player and bullets and display a message in gameState "bullet"
else if(gameState == "bullet"){
 
  textSize(50)
  fill("black")
  text("You ran out of bullets!!!",470,410)
  crowGroup.destroyEach();
  player.destroy();
  bulletGroup.destroyEach();

}

}


//creating function to spawn crows
function enemy(){
  if(frameCount%50===0){

    //giving random x and y positions for crow to appear
    crow = createSprite(random(500,1100),random(100,500),40,40)

    crow.addImage(crowImg)
    crow.scale = 0.31
    crow.velocityX = -3
    crow.debug= true
    crow.setCollider("rectangle",0,0,400,400)
    crow.setCollider = false;
    crow.lifetime = 400
   crowGroup.add(crow)
  }

}
