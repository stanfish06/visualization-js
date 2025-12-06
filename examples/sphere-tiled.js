import * as THREE from 'three';
import { ThreeDOM } from "../lib.js";

// create container
const sphere = new ThreeDOM();

const geometry = new THREE.SphereGeometry( 1, 32, 16 );
const material = new THREE.MeshBasicMaterial({ 
  color: 0x00ff00,
  transparent: true,
  opacity: 0.75
});
const sphereMesh = new THREE.Mesh( geometry, material );
sphere.scene.add( sphereMesh );

const curve1 = new THREE.EllipseCurve(0, 0, 1, 1, 0, 2 * Math.PI);
const points1 = curve1.getPoints(200);
const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
const line1 = new THREE.Line(geometry1, new THREE.LineBasicMaterial({ color: 0x000000 }));
sphere.scene.add(line1);

const curve2 = new THREE.EllipseCurve(0, 0, 1, 1, 0, 2 * Math.PI);
const points2 = curve2.getPoints(200);
const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
const line2 = new THREE.Line(geometry2, new THREE.LineBasicMaterial({ color: 0x000000 }));
line2.rotation.x = Math.PI / 2;
sphere.scene.add(line2);

sphere.camera.position.set(-4, 1, 2);
sphere.camera.lookAt(0, 0, 0);
sphere.renderer.render( sphere.scene, sphere.camera );

// export
sphere.saveAsHTML("./examples/sphere-tiled.html");
sphere.saveAsSVG("./examples/sphere-tiled.svg");
