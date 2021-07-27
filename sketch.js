
var trex ,trex_running, ground, invisible_ground, score, cloudGroup, obstacleGroup, gameState="play", gameOver, trex_collided, restart, gameOverImg, restartImg, highscore, jump, die, checkpoint;


function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  ground_image = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");
  
  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");
  
  trex_collided = loadAnimation("trex_collided.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3");
}


function setup(){
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale= 0.5;
  // for bot:
  // trex.setCollider("rectangle",0,0,400,trex.height);
  // trex.debug = true;
  
  ground = createSprite(300, 180, 600, 10)
  ground.addImage("ground", ground_image);
  ground.x = ground.width/2;
  
  invisible_ground = createSprite(300, 185, 600, 5);
  invisible_ground.visible = false;
  
  gameOver = createSprite(300, 100);
  gameOver.addImage("gameover", gameOverImg);
  gameOver.scale = 0.5
  gameOver.visible = false;
  
  restart = createSprite(300,140);
  restart.addImage("restart", restartImg);
  restart.scale = 0.5;
  restart.visible = false;
  
  trex.depth = ground.depth;
  trex.depth = trex.depth + 1;
  //console.log(trex.depth);
  //console.log(ground.depth);
  
  score = 0;
  highscore = 0;
  
  //STRING CONCATENATION
  //console.log("hello");
  //console.log("good evening");
  //var a = "hello";
  //var b = "good evening";
  //console.log(a)
  //console.log(b)
  //console.log(a+b)
  
  //var score = 0;
  // score = score+2
  // console.log("score: "+ score)
  
  cloudGroup = new Group();
  obstacleGroup = new Group();
  //cloudGroup = createGroup();
  
}


function draw(){
  background(180);
  textSize (15);
  fill("black");
  text ("Score: "+ score,500, 50);
  text ("High Score: " + highscore, 370, 50);

  
  if(gameState == "play"){
    score = Math.round(score+getFrameRate()/60);
    if (score % 100 == 0 && score>0){
       checkpoint.play();
    }
    
  ground.velocityX= -(6+3*score/100);
   if (keyDown("space")&& trex.y>=159){
       trex.velocityY= -10;
       jump.play();
     }
    
  trex.velocityY= trex.velocityY+0.5;
   if (ground.x<0){
       ground.x= ground.width/2;
     }
   
    spawnCloud();
    spawnObstacle();
    
  if (obstacleGroup.isTouching(trex)){
       gameState = "end";
       die.play();
       if (highscore <score){
       highscore = score;
         
       // for bot:
       // jump.play();
       // trex.velocityY = -8;
        }
        
   }
 }
  
  
  else if(gameState == "end"){
    ground.velocityX= 0;
    trex.velocityY= 0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided",trex_collided);
    gameOver.visible = true;
    restart.visible = true;
  }
  
  
  if (mousePressedOver(restart)){
    gameState = "play";
    obstacleGroup.destroyEach();
    cloudGroup.destroyEach();
    gameOver.visible = false;
    restart.visible = false;
    trex.changeAnimation("running", trex_running);
    score = 0;
  }

  
  //console.log(trex.y);
  trex.collide(invisible_ground);
 
  drawSprites();
}


function spawnCloud(){
  
  if (frameCount % 60 == 0){
    cloud = createSprite (600, 80, 40, 10);
    cloud.velocityX = -3;
    cloud.y = Math.round(random(80,130));
    cloud.addImage("cloud", cloud_image);
    cloud.scale = 0.5;
    
   //console.log(trex.depth);
   //console.log(cloud.depth);
    
   trex.depth = cloud.depth;
   trex.depth = trex.depth + 1;
    
   // console.log(gameOver.depth);
   // console.log(cloud.depth);
    
   cloud.depth = gameOver.depth
   gameOver.depth = gameOver.depth + 1;
    
   //time= distance/speed
   cloud.lifetime = 210;
    
   cloudGroup.add(cloud);
  }
  
}


function spawnObstacle(){
  if (frameCount % 80 == 0){
    obstacle = createSprite (600, 160, 10, 40);
    obstacle.velocityX = -(6+3*score/100);
    
    var rand = Math.round(random(1,6));
    
    switch(rand){
      case 1: obstacle.addImage(obs1);
      break;
      case 2: obstacle.addImage(obs2);
      break;
      case 3: obstacle.addImage(obs3);
      break;
      case 4: obstacle.addImage(obs4); 
      break;
      case 5: obstacle.addImage(obs5);
      break;
      case 6: obstacle.addImage(obs6);
      break;
      default : break;
    }
    
    obstacle.scale = 0.5;
    obstacle.lifetime = 110;
    obstacleGroup.add(obstacle);
   }
}

