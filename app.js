/*jshint esversion: 6 */

var camera,
    plight,
    myScene;


function main() {

  var canvas = document.getElementById('renderCanvas');
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = function() {
    // Create a basic BJS Scene object.
    let scene = new BABYLON.Scene(engine);

    // Create a FreeCamera
    // var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(10, 5,-10), scene);

    // Create Arc Rotate Camera
    // Parameters: alpha, beta, radius, target position, scene
    // var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera = new BABYLON.ArcRotateCamera("Camera", (Math.PI * 1.5), (Math.PI * 0.4), 20, new BABYLON.Vector3(0,0,0), scene);
    // Target the camera to scene origin.
    // camera.setTarget( new BABYLON.Vector3(-1,0,0) );
    // Positions the camera overwriting alpha, beta, radius
    // camera.setPosition(new BABYLON.Vector3(0,0, 16));
    // Attach the camera to the canvas.
    camera.attachControl(canvas, true);

    // Create a basic light, aiming 0,1,0 - meaning, to the sky.
    var hemlight1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,2,-0.5), scene);
    // plight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(1, -10, 1), scene);
    // console.dir(plight);

    // faceColors = [color1,color2...color6]
    // [front,back,left,]
    var boxFaceColors = new Array(6);

    boxFaceColors[0] = myColors.cTeal;   // back
    boxFaceColors[1] = myColors.cTeal;   // front
    boxFaceColors[2] = myColors.cBrick;    // right
    boxFaceColors[3] = myColors.cBrick;    // left
    boxFaceColors[4] = myColors.cBrick;    //  top
    boxFaceColors[5] = myColors.cBrick;   // bottom

    // BABYLON.MeshBuilder.CreateBox( name, {options}, scene)
    // options: { size, height, width, depth, faceColors[BABYLON.Color4 x 6], faceUV[texture x 6], updatable, sideOrientation }
    var backBox = BABYLON.MeshBuilder.CreateBox("myBox", {height: 5, width: 10, depth: 0.5, faceColors: boxFaceColors}, scene);
    backBox.position = new BABYLON.Vector3(0,2,5);


    var faceColorsAllGreen = new Array(6);
    for (let i = 0; i < 6; i++) { faceColorsAllGreen[i] = myColors.cTeal; }
    faceColorsAllGreen[1] = myColors.cBrick;
    console.log(faceColorsAllGreen);
    // options: { size, height, width, depth, faceColors[BABYLON.Color4 x 6], faceUV[texture x 6], updatable, sideOrientation }
    var testBox1 = BABYLON.MeshBuilder.CreateBox("testBox", {height: 1, width: 1, depth: 10, faceColors: faceColorsAllGreen, updatable: true}, scene);
    testBox1.position = new BABYLON.Vector3(-5,1,0);

    var testBox2 = BABYLON.MeshBuilder.CreateBox("testBox2", {height: 1, width: 1, depth: 10, faceColors: faceColorsAllGreen, updatable: true}, scene);
    testBox2.position = new BABYLON.Vector3(5,1,0);

    var sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {segments:16, diameter:2}, scene);
    sphere.position.y = 1; // by default the center of the objct is 0,0,0
    sphere.vel = 0.001;

    // Create a built-in "ground" shape.
    var ground = BABYLON.MeshBuilder.CreateGround('ground1', {height:10, width:10, subdivisions: 2}, scene);

    // Keyboard events
    var inputMap = {};
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
            sphere.position.z += 0.1;
        }
        if(inputMap["a"]){
            sphere.position.x -= 0.1;
        }
        if(inputMap["s"]){
            sphere.position.z -= 0.1;
        }
        if(inputMap["d"]){
            sphere.position.x += 0.1;
        }
    });

    scene.onBeforeRenderObservable.add( () => {
      sphere.position.x += sphere.vel;
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
  cTeal: new BABYLON.Color4.FromInts(66,159,158,1)
};
