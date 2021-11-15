import * as BABYLON from "babylonjs";
import 'babylonjs-loaders';

// Default BabylonJS setup
const canvas : any = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Camera setup
const camera = new BABYLON.ArcRotateCamera("camera1", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, false);

// Lightning setup
const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0,5,0), scene);
const light2 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 5, 0), scene);

// Object setup
// make a ground to visualize the movement
let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 250, height: 250}, scene);

// make a variable to store the loaded teapot
let teapot: BABYLON.AbstractMesh;
// load the Utah teapot model to the scene
BABYLON.SceneLoader.ImportMeshAsync("", "dist/models/", "teapot.obj", scene).then((result) => {
    teapot = result.meshes[0];

    // set the camera target to the teapot
    camera.target = teapot.getAbsolutePosition();
    // set scaling, rotation, and position for the teapot
    teapot.scaling = new BABYLON.Vector3(0.025, 0.025, 0.025);
    teapot.rotation = new BABYLON.Vector3(-Math.PI/2, 0, 0);
    teapot.position = new BABYLON.Vector3(0, 12, 0);
    // set the teapot color
    let red = new BABYLON.Color3(1.0, 0.0, 0.0);
    let mat =  new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseColor = red;
    teapot.material = mat;

    // create a PointerDragBehavior to allow the teapot to be moved by mouse
    let dragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0, 1, 0)});
    dragBehavior.moveAttached = false;
    dragBehavior.useObjectOrientationForDragging = false;

    // listen to the drag events
    dragBehavior.onDragObservable.add((event) => {
        // update the teapot position
        teapot.position = event.dragPlanePoint;
    });

    // add the drag behavior to the teapot
    teapot.addBehavior(dragBehavior);
});


engine.runRenderLoop( () => {
    scene.render();
})   

window.addEventListener("resize", () => {
    engine.resize();
})