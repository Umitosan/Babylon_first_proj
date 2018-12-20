/*jshint esversion: 6 */


window.addEventListener('DOMContentLoaded', function() {
    // All the following code is entered here.

    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function() {
      // Create a basic BJS Scene object.
      var scene = new BABYLON.Scene(engine);

      // Create a FreeCamera
      // var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(10, 5,-10), scene);
      // Create Arc Rotate Camera
      // Parameters: alpha, beta, radius, target position, scene
      // var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
      var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 8, new BABYLON.Vector3(0,0,0), scene);
      // Target the camera to scene origin.
      // camera.setTarget( BABYLON.Vector3(10,5,-10) );
      // Positions the camera overwriting alpha, beta, radius
      camera.setPosition(new BABYLON.Vector3(Math.PI * -2, Math.PI, 16));
      // Attach the camera to the canvas.
      camera.attachControl(canvas, true);

      // Create a basic light, aiming 0,1,0 - meaning, to the sky.
      var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,2,-0.5), scene);

      // faceColors = [color1,color2...color6]
      // [front,back,left,]
      var boxFaceColors = new Array(6);

      // new BABYLON.Color4(r,g,b,a);
      var cRed = new BABYLON.Color4(1,0,0,1);
      var cGreen = new BABYLON.Color4(0,1,0,1);
      var cBlue = new BABYLON.Color4(0,0,1,1);
      var cPurple = new BABYLON.Color4(1,0,1,1);
      var cWhite = new BABYLON.Color4(1,1,1,1);
      boxFaceColors[0] = cGreen;    // front
      boxFaceColors[1] = cPurple;   // back
      boxFaceColors[2] = cRed;    // left
      boxFaceColors[3] = cRed;    // right
      boxFaceColors[4] = cBlue;   //  top
      boxFaceColors[5] = cBlue;   // bottom

      // BABYLON.MeshBuilder.CreateBox( name, {options}, scene)
      // options: { size, height, width, depth, faceColors[BABYLON.Color4 x 6], faceUV[texture x 6], updatable, sideOrientation }
      var myBox = BABYLON.MeshBuilder.CreateBox("myBox", {height: 5, width: 5, depth: 0.5, faceColors: boxFaceColors}, scene);
      // Create a built-in "sphere" shape.
      myBox.position.y = 2;
      myBox.position.z = -3;

      var sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {segments:16, diameter:2}, scene);
      // Move the sphere upward 1/2 of its height.
      sphere.position.y = 1;

      // Create a built-in "ground" shape.
      var groundColors = new Array(6);
      for (var i = 0; i < 6; i++) {
        groundColors[i] = cWhite;
      }
      var ground = BABYLON.MeshBuilder.CreateGround('ground1', {height:6, width:6, subdivisions: 2}, scene);

      // Return the created scene.
      return scene;
    };

    var scene = createScene();

    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener('resize', function() {  // without this resizer the image will distort and squish
        engine.resize();
    });

});
