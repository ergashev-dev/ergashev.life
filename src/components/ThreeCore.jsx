import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeCore = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.35, 5),
      new THREE.MeshPhysicalMaterial({ color: 0x6f35ff, roughness: 0.18, metalness: 0.32, clearcoat: 1, clearcoatRoughness: 0.1, emissive: 0x220077, emissiveIntensity: 1.8 }),
    );
    world.add(core);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 2),
      new THREE.MeshBasicMaterial({ color: 0xc8ff32, wireframe: true, transparent: true, opacity: 0.28 }),
    );
    world.add(wire);

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.15, 0.015, 220, 12, 2, 5),
      new THREE.MeshBasicMaterial({ color: 0x9e7cff, transparent: true, opacity: 0.62 }),
    );
    world.add(knot);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xc8ff32, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
    for (let index = 0; index < 3; index += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.5 + index * 0.38, 0.008, 8, 160), ringMaterial);
      ring.rotation.set(Math.PI / 2.4 + index * 0.35, index * 0.65, index * 0.25);
      world.add(ring);
    }

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = window.innerWidth < 700 ? 500 : 1100;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 3 + Math.random() * 3.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xb9a8ff, size: 0.018, transparent: true, opacity: 0.8 }));
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0x8877ff, 1.3));
    const purple = new THREE.PointLight(0x7138ff, 30, 12); purple.position.set(3, 3, 4); scene.add(purple);
    const green = new THREE.PointLight(0xc8ff32, 22, 10); green.position.set(-3, -2, 3); scene.add(green);

    let pointerX = 0;
    let pointerY = 0;
    let animationId;
    const pointer = (event) => {
      const bounds = mount.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 1.2;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 1.2;
    };
    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const clock = new THREE.Clock();
    const animate = () => {
      const time = clock.getElapsedTime();
      world.rotation.y += (pointerX * 0.45 + time * 0.09 - world.rotation.y) * 0.035;
      world.rotation.x += (-pointerY * 0.35 + Math.sin(time * 0.42) * 0.08 - world.rotation.x) * 0.035;
      core.scale.setScalar(1 + Math.sin(time * 1.7) * 0.035);
      wire.rotation.y = -time * 0.16;
      wire.rotation.z = time * 0.07;
      knot.rotation.x = time * 0.08;
      particles.rotation.y = time * 0.018;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    resize();
    animate();
    mount.addEventListener('pointermove', pointer, { passive: true });
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      mount.removeEventListener('pointermove', pointer);
      window.removeEventListener('resize', resize);
      particleGeometry.dispose();
      particles.material.dispose();
      world.traverse((object) => { if (object.geometry) object.geometry.dispose(); if (object.material) object.material.dispose(); });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="three-core" ref={mountRef} aria-hidden="true" />;
};

export default ThreeCore;
