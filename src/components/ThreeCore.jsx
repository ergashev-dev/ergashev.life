import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const technologies = [
  { name: 'TS', color: '#3178c6', position: [-2.7, 1.5, .1] },
  { name: 'JS', color: '#f7df1e', position: [2.65, 1.25, -.2] },
  { name: 'Nest', color: '#e0234e', position: [-3.05, -.95, -.5] },
  { name: 'Next', color: '#ffffff', position: [2.95, -.95, -.4] },
  { name: 'React', color: '#61dafb', position: [-1.55, -2.45, -.8] },
  { name: 'Node', color: '#68a063', position: [1.55, -2.35, -.6] },
  { name: 'SQL', color: '#53a5dd', position: [0, 2.85, -1] },
];

const createLabel = (text, accent) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, 512, 256);
  const gradient = context.createLinearGradient(80, 0, 430, 256);
  gradient.addColorStop(0, 'rgba(255,255,255,.98)');
  gradient.addColorStop(1, accent);
  context.fillStyle = gradient;
  context.font = `700 ${text.length > 3 ? 92 : 118}px Arial`;
  context.textAlign = 'center'; context.textBaseline = 'middle';
  context.fillText(text, 256, 132);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const ThreeCore = () => {
  const mountRef = useRef(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.set(0, .1, 10.8);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    const universe = new THREE.Group();
    scene.add(universe);
    const disposables = [];

    const glass = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.45, 6),
      new THREE.MeshPhysicalMaterial({ color: 0xb8caff, emissive: 0x172968, emissiveIntensity: .65, metalness: .05, roughness: .05, transmission: .58, thickness: 1.9, ior: 1.42, clearcoat: 1, clearcoatRoughness: .02, iridescence: 1, iridescenceIOR: 1.6 }),
    );
    universe.add(glass);
    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(.78, 4), new THREE.MeshBasicMaterial({ color: 0x7595ff, transparent: true, opacity: .32 }));
    universe.add(inner);

    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.92, .018, 12, 220), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .38 }));
    halo.rotation.x = 1.18; halo.rotation.y = .25; universe.add(halo);
    const haloTwo = halo.clone(); haloTwo.scale.setScalar(1.38); haloTwo.rotation.set(.5, .8, 1); haloTwo.material = halo.material.clone(); haloTwo.material.opacity = .15; universe.add(haloTwo);

    const nodes = [];
    technologies.forEach((technology, index) => {
      const group = new THREE.Group();
      group.position.set(...technology.position);
      const material = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(technology.color), emissive: new THREE.Color(technology.color), emissiveIntensity: .22, roughness: .12, metalness: .08, transmission: .45, thickness: .7, clearcoat: 1, transparent: true, opacity: .94 });
      const orb = new THREE.Mesh(new THREE.SphereGeometry(index % 2 ? .49 : .56, 48, 48), material);
      const rim = new THREE.Mesh(new THREE.SphereGeometry(index % 2 ? .54 : .61, 20, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(technology.color), wireframe: true, transparent: true, opacity: .11 }));
      const labelTexture = createLabel(technology.name, technology.color);
      const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTexture, transparent: true, depthTest: false }));
      label.scale.set(1.12, .56, 1); label.position.z = .57;
      group.add(orb, rim, label); universe.add(group);
      nodes.push({ group, orb, base: new THREE.Vector3(...technology.position), phase: index * .82, texture: labelTexture });

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), group.position.clone()]);
      const line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: new THREE.Color(technology.color), transparent: true, opacity: .1 }));
      universe.add(line);
    });

    const particleCount = innerWidth < 700 ? 450 : 950;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 3.4 + Math.random() * 4.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[index * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xc8d2ff, size: .018, transparent: true, opacity: .55 }));
    scene.add(particles);

    const ambient = new THREE.AmbientLight(0xc5d3ff, 1.8); scene.add(ambient);
    const blue = new THREE.PointLight(0x5985ff, 42, 16); blue.position.set(3, 3, 6); scene.add(blue);
    const pink = new THREE.PointLight(0xff85cf, 28, 14); pink.position.set(-4, -2, 4); scene.add(pink);

    let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0, animationId;
    const onPointer = (event) => {
      const box = mount.getBoundingClientRect();
      targetX = ((event.clientX - box.left) / box.width - .5) * .65;
      targetY = ((event.clientY - box.top) / box.height - .5) * .45;
    };
    const resize = () => {
      const width = mount.clientWidth, height = mount.clientHeight;
      renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix();
    };
    const clock = new THREE.Clock();
    const animate = () => {
      const time = clock.getElapsedTime();
      pointerX += (targetX - pointerX) * .035; pointerY += (targetY - pointerY) * .035;
      universe.rotation.y = pointerX; universe.rotation.x = -pointerY;
      glass.rotation.y = time * .08; glass.rotation.x = time * .045;
      inner.scale.setScalar(1 + Math.sin(time * 1.5) * .08);
      halo.rotation.z = time * .13; haloTwo.rotation.z = -time * .08;
      nodes.forEach(({ group, orb, base, phase }, index) => {
        group.position.y = base.y + Math.sin(time * .55 + phase) * .16;
        group.position.x = base.x + Math.cos(time * .4 + phase) * .08;
        orb.rotation.y = time * (.12 + index * .01);
      });
      particles.rotation.y = time * .012;
      renderer.render(scene, camera); animationId = requestAnimationFrame(animate);
    };
    resize(); animate();
    mount.addEventListener('pointermove', onPointer, { passive: true }); window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationId); mount.removeEventListener('pointermove', onPointer); window.removeEventListener('resize', resize);
      scene.traverse((object) => { object.geometry?.dispose(); if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose()); else object.material?.dispose(); });
      nodes.forEach(({ texture }) => texture.dispose()); particleGeometry.dispose(); renderer.dispose(); renderer.domElement.remove(); disposables.forEach((item) => item.dispose?.());
    };
  }, []);
  return <div className="spatial-canvas" ref={mountRef} aria-label="Interactive 3D technology universe" />;
};
export default ThreeCore;
