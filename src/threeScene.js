import * as THREE from 'three';

/**
 * High-Performance Interactive 3D WebGL Scene
 * Features:
 * 1. Deep 3D Starfield & Floating Medical Particles
 * 2. Interactive 3D Pharmaceutical Core (Capsule, Molecular Rings, DNA Helix, Crystal Nodes)
 * 3. Smooth mouse parallax, spring damping & 360° drag rotation
 * 4. Responsive viewport resizing with auto pixel-ratio optimization
 */

export function initThreeScene() {
  const container = document.getElementById('threeHeroContainer');
  if (!container) return;

  const width = container.clientWidth || 450;
  const height = container.clientHeight || 450;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00f2fe, 3, 20);
  cyanLight.position.set(4, 5, 4);
  scene.add(cyanLight);

  const emeraldLight = new THREE.PointLight(0x10b981, 2.5, 20);
  emeraldLight.position.set(-4, -3, 3);
  scene.add(emeraldLight);

  const violetLight = new THREE.PointLight(0xa855f7, 2, 20);
  violetLight.position.set(0, 4, -3);
  scene.add(violetLight);

  // Main 3D Pivot Group
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. 3D Capsule Geometry (Pharmacy & Dispensing)
  const capsuleGroup = new THREE.Group();

  // Top half: Translucent Cyan Glass
  const topGeo = new THREE.CapsuleGeometry(0.85, 1.2, 32, 32);
  const glassMaterialCyan = new THREE.MeshPhysicalMaterial({
    color: 0x00f2fe,
    metalness: 0.15,
    roughness: 0.1,
    transmission: 0.65,
    thickness: 1.2,
    transparent: true,
    opacity: 0.92,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  const capsuleMesh = new THREE.Mesh(topGeo, glassMaterialCyan);
  capsuleGroup.add(capsuleMesh);

  // Metallic Center Ring / Band
  const bandGeo = new THREE.CylinderGeometry(0.87, 0.87, 0.18, 36);
  const bandMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x00f2fe,
    emissiveIntensity: 0.3
  });
  const bandMesh = new THREE.Mesh(bandGeo, bandMat);
  capsuleGroup.add(bandMesh);

  // Lower Half Inner Core Glow
  const innerGeo = new THREE.CapsuleGeometry(0.65, 0.9, 16, 16);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  capsuleGroup.add(innerMesh);

  // Tilt capsule naturally
  capsuleGroup.rotation.z = Math.PI / 4.5;
  capsuleGroup.rotation.x = Math.PI / 7;
  mainGroup.add(capsuleGroup);

  // 2. Orbiting Holographic Rings (Cold-Chain & Precision Dispensing)
  const ringGroup = new THREE.Group();

  const ringGeo1 = new THREE.TorusGeometry(1.7, 0.03, 16, 100);
  const ringMat1 = new THREE.MeshStandardMaterial({
    color: 0x00f2fe,
    emissive: 0x00f2fe,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.8
  });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI / 2.2;
  ringGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(2.1, 0.025, 16, 100);
  const ringMat2 = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 0.7,
    roughness: 0.3,
    metalness: 0.8
  });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.y = Math.PI / 3;
  ring2.rotation.x = Math.PI / 6;
  ringGroup.add(ring2);

  mainGroup.add(ringGroup);

  // 3. Orbiting Molecular Atoms / Satellite Spheres
  const satelliteGroup = new THREE.Group();
  const satGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const satMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.9,
    metalness: 0.7,
    roughness: 0.2
  });

  const satCount = 5;
  const satellites = [];
  for (let i = 0; i < satCount; i++) {
    const sat = new THREE.Mesh(satGeo, satMat);
    const angle = (i / satCount) * Math.PI * 2;
    const radius = 1.9;
    sat.position.set(Math.cos(angle) * radius, (Math.sin(angle * 2) * 0.4), Math.sin(angle) * radius);
    satelliteGroup.add(sat);
    satellites.push({ mesh: sat, angle: angle, speed: 0.015 + i * 0.005 });
  }
  mainGroup.add(satelliteGroup);

  // 4. Background Particle Field (Floating Stars/Molecules)
  const particleCount = 450;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color(0x00f2fe);
  const colorEmerald = new THREE.Color(0x10b981);
  const colorWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 16;
    positions[i + 1] = (Math.random() - 0.5) * 16;
    positions[i + 2] = (Math.random() - 0.5) * 10 - 2;

    const chosenColor = Math.random() > 0.6 ? colorCyan : (Math.random() > 0.5 ? colorEmerald : colorWhite);
    colors[i] = chosenColor.r;
    colors[i + 1] = chosenColor.g;
    colors[i + 2] = chosenColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Interactive Mouse Parallax & Drag Rotation
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  const handlePointerMove = (e) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    } else {
      mouseX = x;
      mouseY = y;
    }
  };

  const handlePointerDown = (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
    container.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    isDragging = false;
    container.style.cursor = 'grab';
  };

  container.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);

  // Global mouse move for ambient depth tracking
  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    cyanLight.position.x = 4 + normX * 2;
    cyanLight.position.y = 5 + normY * 2;
  });

  // Switch 3D Model modes (Capsule vs Helix/Rings)
  window.switchThreeMode = (mode) => {
    if (mode === 'capsule') {
      capsuleMesh.visible = true;
      innerMesh.visible = true;
      ring1.visible = true;
      ring2.visible = true;
    } else if (mode === 'molecule') {
      capsuleMesh.visible = false;
      innerMesh.visible = true;
      ring1.visible = true;
      ring2.visible = true;
    } else if (mode === 'rings') {
      capsuleMesh.visible = true;
      innerMesh.visible = false;
      ring1.visible = true;
      ring2.visible = true;
    }
  };

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate components
    if (!isDragging) {
      mainGroup.rotation.y += 0.007;
      mainGroup.rotation.x = THREE.MathUtils.lerp(mainGroup.rotation.x, mouseY * 0.4, 0.05);
      mainGroup.rotation.y = THREE.MathUtils.lerp(mainGroup.rotation.y, mainGroup.rotation.y + mouseX * 0.003, 0.05);
    } else {
      mainGroup.rotation.x = THREE.MathUtils.lerp(mainGroup.rotation.x, targetRotationX, 0.1);
      mainGroup.rotation.y = THREE.MathUtils.lerp(mainGroup.rotation.y, targetRotationY, 0.1);
    }

    // Floating bobbing effect
    mainGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

    // Orbiting rings
    ring1.rotation.z += 0.012;
    ring2.rotation.z -= 0.01;

    // Satellites motion
    satellites.forEach(sat => {
      sat.angle += sat.speed;
      sat.mesh.position.x = Math.cos(sat.angle) * 1.95;
      sat.mesh.position.z = Math.sin(sat.angle) * 1.95;
      sat.mesh.position.y = Math.sin(sat.angle * 2 + elapsedTime) * 0.5;
    });

    // Gentle particle drift
    particleSystem.rotation.y = elapsedTime * 0.02;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  // Resize listener
  const handleResize = () => {
    if (!container) return;
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  };

  window.addEventListener('resize', handleResize);
}
