import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

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
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    const renderTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, format: THREE.RGBAFormat });
    const composer = new EffectComposer(renderer, renderTarget);
    const renderPass = new RenderPass(scene, camera);
    renderPass.clearAlpha = 0;
    composer.addPass(renderPass);
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), .58, .72, .78);
    composer.addPass(bloom);

    const universe = new THREE.Group();
    scene.add(universe);
    const disposables = [];

    const shaderUniforms = { uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() } };
    const glass = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 6),
      new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          uniform float uTime;
          uniform vec2 uPointer;
          varying vec3 vNormal;
          varying vec3 vWorld;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            float wave = sin(position.x * 3.2 + uTime * 1.4) * .055;
            wave += sin(position.y * 4.1 - uTime * 1.1) * .04;
            wave += sin(position.z * 3.6 + uTime) * .035;
            vec3 displaced = position + normal * wave;
            displaced.xy += uPointer * .06 * (position.z + 1.5);
            vec4 world = modelMatrix * vec4(displaced, 1.0);
            vWorld = world.xyz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vWorld;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorld);
            float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.6);
            float pulse = .5 + .5 * sin(uTime * 1.2 + vWorld.y * 2.4);
            vec3 blue = vec3(.24, .43, 1.0);
            vec3 pearl = vec3(.82, .9, 1.0);
            vec3 pink = vec3(1.0, .42, .82);
            vec3 color = mix(blue, pearl, pulse * .55);
            color = mix(color, pink, fresnel * .38);
            float alpha = .48 + fresnel * .5;
            gl_FragColor = vec4(color * (1.0 + fresnel * .8), alpha);
          }
        `,
      }),
    );
    universe.add(glass);
    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(.78, 4), new THREE.MeshBasicMaterial({ color: 0x7595ff, transparent: true, opacity: .32 }));
    universe.add(inner);

    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.92, .018, 12, 220), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .38 }));
    halo.rotation.x = 1.18; halo.rotation.y = .25; universe.add(halo);
    const haloTwo = halo.clone(); haloTwo.scale.setScalar(1.38); haloTwo.rotation.set(.5, .8, 1); haloTwo.material = halo.material.clone(); haloTwo.material.opacity = .15; universe.add(haloTwo);

    const trails = new THREE.Group();
    const trailColors = [0x6f8cff, 0xff72cc, 0x69e6ff];
    for (let index = 0; index < 3; index += 1) {
      const points = [];
      for (let step = 0; step < 9; step += 1) {
        const angle = (step / 8) * Math.PI * 2;
        const radius = 3.25 + Math.sin(step * 1.7 + index) * .35;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle * (1 + index * .15)) * 1.45, Math.sin(angle) * radius * .38));
      }
      const curve = new THREE.CatmullRomCurve3(points, true);
      const ribbon = new THREE.Mesh(new THREE.TubeGeometry(curve, 150, .012 + index * .004, 5, true), new THREE.MeshBasicMaterial({ color: trailColors[index], transparent: true, opacity: .23, blending: THREE.AdditiveBlending }));
      ribbon.rotation.set(index * .65, index * .38, index * .72);
      trails.add(ribbon);
    }
    universe.add(trails);

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
      orb.userData.technology = technology.name;
      nodes.push({ group, orb, base: new THREE.Vector3(...technology.position), phase: index * .82, texture: labelTexture, hovered: false });

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

    const raycaster = new THREE.Raycaster();
    const pointerVector = new THREE.Vector2(-10, -10);
    let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0, animationId, scrollDepth = 0;
    const onPointer = (event) => {
      const box = mount.getBoundingClientRect();
      targetX = ((event.clientX - box.left) / box.width - .5) * .65;
      targetY = ((event.clientY - box.top) / box.height - .5) * .45;
      pointerVector.x = ((event.clientX - box.left) / box.width) * 2 - 1;
      pointerVector.y = -((event.clientY - box.top) / box.height) * 2 + 1;
    };
    const onLeave = () => { pointerVector.set(-10, -10); mount.style.cursor = 'grab'; };
    const onScroll = () => { scrollDepth = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1); };
    const onClick = () => {
      raycaster.setFromCamera(pointerVector, camera);
      const hit = raycaster.intersectObjects(nodes.map(({ orb }) => orb), false)[0];
      if (hit?.object.userData.technology) window.dispatchEvent(new CustomEvent('techfocus', { detail: hit.object.userData.technology }));
    };
    const resize = () => {
      const width = mount.clientWidth, height = mount.clientHeight;
      renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix();
      composer.setSize(width, height);
    };
    const clock = new THREE.Clock();
    const animate = () => {
      const time = clock.getElapsedTime();
      pointerX += (targetX - pointerX) * .035; pointerY += (targetY - pointerY) * .035;
      universe.rotation.y = pointerX; universe.rotation.x = -pointerY;
      shaderUniforms.uTime.value = time; shaderUniforms.uPointer.value.set(pointerX, pointerY);
      camera.position.z += ((10.8 - scrollDepth * 1.65) - camera.position.z) * .025;
      glass.rotation.y = time * .08; glass.rotation.x = time * .045;
      inner.scale.setScalar(1 + Math.sin(time * 1.5) * .08);
      halo.rotation.z = time * .13; haloTwo.rotation.z = -time * .08;
      trails.rotation.y = time * .025; trails.rotation.z = Math.sin(time * .18) * .08;
      raycaster.setFromCamera(pointerVector, camera);
      const hoveredOrb = raycaster.intersectObjects(nodes.map(({ orb }) => orb), false)[0]?.object;
      mount.style.cursor = hoveredOrb ? 'pointer' : 'grab';
      nodes.forEach(({ group, orb, base, phase }, index) => {
        group.position.y = base.y + Math.sin(time * .55 + phase) * .16;
        group.position.x = base.x + Math.cos(time * .4 + phase) * .08;
        orb.rotation.y = time * (.12 + index * .01);
        const targetScale = orb === hoveredOrb ? 1.24 : 1;
        const nextScale = THREE.MathUtils.lerp(group.scale.x, targetScale, .08);
        group.scale.setScalar(nextScale);
      });
      particles.rotation.y = time * .012;
      composer.render(); animationId = requestAnimationFrame(animate);
    };
    resize(); animate();
    mount.addEventListener('pointermove', onPointer, { passive: true }); mount.addEventListener('pointerleave', onLeave); mount.addEventListener('click', onClick); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationId); mount.removeEventListener('pointermove', onPointer); mount.removeEventListener('pointerleave', onLeave); mount.removeEventListener('click', onClick); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', resize);
      scene.traverse((object) => { object.geometry?.dispose(); if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose()); else object.material?.dispose(); });
      nodes.forEach(({ texture }) => texture.dispose()); particleGeometry.dispose(); composer.dispose(); renderer.dispose(); renderer.domElement.remove(); disposables.forEach((item) => item.dispose?.());
    };
  }, []);
  return <div className="spatial-canvas" ref={mountRef} aria-label="Interactive 3D technology universe" />;
};
export default ThreeCore;
