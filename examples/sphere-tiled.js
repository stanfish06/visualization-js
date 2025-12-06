import * as THREE from "three";
import { ThreeDOM } from "../lib.js";

// create container
const sphere = new ThreeDOM();

// Create 4 colored patches on the sphere surface
// ['0071bc', 'd85218', 'ecb01f', '7d2e8d', '76ab2f', '4cbded', 'a1132e', 'ffd509', '6481fc', 'ff4439', '00a2a2', 'ca835c']
const colors = [0x0071bc, 0xd85218, 0xecb01f, 0x76ab2f];

for (let i = 0; i < 4; i++) {
  const phiStart = (i * Math.PI) / 2; // Rotate 45 degrees to align with circles
  const phiLength = Math.PI / 2;

  const patchGeometry = new THREE.SphereGeometry(
    1,
    64,
    32,
    phiStart,
    phiLength,
    0,
    Math.PI,
  );

  const patchMaterial = new THREE.MeshBasicMaterial({
    color: colors[i],
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
  });

  const patch = new THREE.Mesh(patchGeometry, patchMaterial);
  patch.rotation.z = Math.PI / 2;
  sphere.scene.add(patch);
}

const curve1 = new THREE.EllipseCurve(0, 0, 1, 1, 0, 2 * Math.PI);
const points1 = curve1.getPoints(1000);
const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
const line1 = new THREE.Line(
  geometry1,
  new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }),
);
line1.scale.set(1.025, 1.025, 1.025);
sphere.scene.add(line1);

const curve2 = new THREE.EllipseCurve(0, 0, 1, 1, 0, 2 * Math.PI);
const points2 = curve2.getPoints(1000);
const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
const line2 = new THREE.Line(
  geometry2,
  new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }),
);
line2.rotation.x = Math.PI / 2;
line2.scale.set(1.025, 1.025, 1.025);
sphere.scene.add(line2);

const dotGeometry = new THREE.SphereGeometry(0.05, 16, 16);
const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const dot1 = new THREE.Mesh(dotGeometry, dotMaterial);
dot1.position.set(1, 0, 0);
sphere.scene.add(dot1);

const dot2 = new THREE.Mesh(dotGeometry, dotMaterial);
dot2.position.set(-1, 0, 0);
sphere.scene.add(dot2);

sphere.camera.position.set(-4, 1, 2);
sphere.camera.lookAt(0, 0, 0);
sphere.renderer.render(sphere.scene, sphere.camera);

// export
sphere.saveAsHTML("./examples/sphere-tiled.html");
sphere.saveAsSVG("./examples/sphere-tiled.svg");
