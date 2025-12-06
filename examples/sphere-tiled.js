import * as THREE from 'three';
import { ThreeDOM } from "../lib.js";

// create container
const sphere = new ThreeDOM();

const geometry = new THREE.SphereGeometry( 15, 32, 16 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff000 } );
const cube = new THREE.Mesh( geometry, material );
sphere.scene.add( cube );

sphere.camera.position.z = 5;
sphere.renderer.render( sphere.scene, sphere.camera );

// export
sphere.saveAsHTML("./examples/sphere-tiled.html");
sphere.saveAsSVG("./examples/sphere-tiled.svg");
