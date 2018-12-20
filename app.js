/*jshint esversion: 6 */

var camera,
    plight,
    myScene,
    myBall;


function main() {

  let canvas = document.getElementById('renderCanvas');
  let engine = new BABYLON.Engine(canvas, true);

  let createScene = function() {
    // Create a basic BJS Scene object.
    let scene = new BABYLON.Scene(engine);

    // Create a FreeCamera
    // var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(10, 5,-10), scene);

    // Create Arc Rotate Camera
    // Parameters: alpha, beta, radius, target position, scene
    // var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera = new BABYLON.ArcRotateCamera("Camera", (Math.PI * 1.5), (Math.PI * 0.3), 25, new BABYLON.Vector3(0,0,0), scene);
    // Target the camera to scene origin.
    // camera.setTarget( new BABYLON.Vector3(-1,0,0) );
    // Positions the camera overwriting alpha, beta, radius
    // camera.setPosition(new BABYLON.Vector3(0,0, 16));
    // Attach the camera to the canvas.
    camera.attachControl(canvas, true);

    // Create a basic light, aiming 0,1,0 - meaning, to the sky.
    let hemlight1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,2,-0.5), scene);
    // plight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(1, -10, 1), scene);
    // console.dir(plight);

    // faceColors = [color1,color2...color6]
    // [front,back,left,]
    let boxFaceColors = new Array(6);
    // faceColor(back,front,right,left,top,bottom)
    boxFaceColors[0] = myColors.cTeal;   // back
    boxFaceColors[1] = myColors.cTeal;   // front
    boxFaceColors[2] = myColors.cTeal;    // right
    boxFaceColors[3] = myColors.cTeal;    // left
    boxFaceColors[4] = myColors.cTeal;    //  top
    boxFaceColors[5] = myColors.cTeal;   // bottom

    let faceColorsLR = new Array(6);
    for (let i = 0; i < 6; i++) { faceColorsLR[i] = myColors.cTeal; }
    faceColorsLR[0] = myColors.cBrick;
    faceColorsLR[1] = myColors.cBrick;

    let faceColorsFB = new Array(6);
    for (let i = 0; i < 6; i++) { faceColorsFB[i] = myColors.cTeal; }
    faceColorsFB[2] = myColors.cBrick;
    faceColorsFB[3] = myColors.cBrick;

    let groundColors = new Array(6);
    for (let i = 0; i < 6; i++) { groundColors[i] = myColors.cTeal; }
    groundColors[4] = myColors.cLightTeal;

    // options: { size, height, width, depth, faceColors[BABYLON.Color4 x 6], faceUV[texture x 6], updatable, sideOrientation }

    // BABYLON.MeshBuilder.CreateBox( name, {options}, scene)
    // options: { size, height, width, depth, faceColors[BABYLON.Color4 x 6], faceUV[texture x 6], updatable, sideOrientation }

    let groundCoverHeight = 0.1;
    let groundCover = BABYLON.MeshBuilder.CreateBox("myBox", {height: groundCoverHeight, width: 10, depth: 10, faceColors: groundColors}, scene);
    groundCover.position = new BABYLON.Vector3(0,0,0);

    let backBoxDetph = 1;
    let backBox = BABYLON.MeshBuilder.CreateBox("myBox", {height: 6.2, width: 12.2, depth: backBoxDetph, faceColors: faceColorsFB}, scene);
    backBox.position = new BABYLON.Vector3(0,2,5+(backBoxDetph/2));

    let boxLeftWidth = 1;
    let boxLeft = BABYLON.MeshBuilder.CreateBox("boxLeft", {height: 2, width: boxLeftWidth, depth: 12.2, faceColors: faceColorsLR, updatable: true}, scene);
    boxLeft.position = new BABYLON.Vector3(-5-(boxLeftWidth/2),0,0);

    let boxRightWidth = 1;
    let boxRight = BABYLON.MeshBuilder.CreateBox("boxRight", {height: 2, width: boxRightWidth, depth: 12.2, faceColors: faceColorsLR, updatable: true}, scene);
    boxRight.position = new BABYLON.Vector3(5+(boxLeftWidth/2),0,0);

    let boxFrontDepth = 1;
    let boxFront = BABYLON.MeshBuilder.CreateBox("boxFront", {height: 2.2, width: 12.2, depth: boxFrontDepth, faceColors: faceColorsFB, updatable: true}, scene);
    boxFront.position = new BABYLON.Vector3(0,0,-5-(boxFrontDepth/2));

    let diam = 1;
    myBall = BABYLON.MeshBuilder.CreateSphere('myBall', {segments:16, diameter:diam}, scene);
    myBall.position.y = diam/2; // by default the center of the objct is 0,0,0
    myBall.xVel = 0.06;
    myBall.zVel = 0.05;
    myBall.rad = diam / 2;


    // Create a built-in "ground" shape.
    let ground = BABYLON.MeshBuilder.CreateGround('ground1', {height:10, width:10, subdivisions: 2}, scene);

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // KEYBOARD INPUTS
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    let inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    let times = 0;
    // Game/Render loop
    scene.onBeforeRenderObservable.add( (evt) => {
        // if(inputMap["w"] || inputMap["ArrowUp"]){
        if (times === 0) {
          console.log('evt = ', evt);
          times = 1;
        }
        if(inputMap["w"]){
            myBall.position.z += 0.1;
        }
        if(inputMap["a"]){
            myBall.position.x -= 0.1;
        }
        if(inputMap["s"]){
            myBall.position.z -= 0.1;
        }
        if(inputMap["d"]){
            myBall.position.x += 0.1;
        }
    });

    scene.onBeforeRenderObservable.add( () => {
      mainUpdate();
    });

    // Return the created scene.
    return scene;
  }; // END SCENE CREATION


  window.addEventListener('resize', function() {  // without this resizer the image will distort and squish
    engine.resize();
  });

  myScene = createScene();

  engine.runRenderLoop(function() {
    myScene.render();
  });

} // END MAIN


window.addEventListener('DOMContentLoaded', function() {
    // All the following code is entered here.
    main();
});


////////////////////////////////////////////////////////////////////////////////////////////////////
///////    UPDATE
////////////////////////////////////////////////////////////////////////////////////////////////////
function mainUpdate() {
  myBall.position.x += myBall.xVel;
  myBall.position.z += myBall.zVel;
  if ( ((myBall.position.x + myBall.rad) >= 5) || ((myBall.position.x - myBall.rad) <= -5) ) {
    myBall.xVel *= -1;
  }
  if ( ((myBall.position.z + myBall.rad) >= 5) || ((myBall.position.z - myBall.rad) <= -5) ) {
    myBall.zVel *= -1;
  }
}







////////////////////////////////////////////////////////////////////////////////////////////////////
///////    HELPERS
////////////////////////////////////////////////////////////////////////////////////////////////////
var myColors = {
  // new BABYLON.Color4(r,g,b,a);
  cRed: new BABYLON.Color4(1,0,0,1),
  cGreen: new BABYLON.Color4(0,1,0,1),
  cBlue: new BABYLON.Color4(0,0,1,1),
  cPurple: new BABYLON.Color4(1,0,1,1),
  cWhite: new BABYLON.Color4(1,1,1,1),
  cBrick: new BABYLON.Color4.FromInts(240,95,59,1), // rgba(240,95,59,1),
  cTeal: new BABYLON.Color4.FromInts(66,159,158,1),
  cLightTeal: new BABYLON.Color4.FromInts(165,197,195,1),
  cDarkTeal: new BABYLON.Color4.FromInts(0,120,114,1)
};
