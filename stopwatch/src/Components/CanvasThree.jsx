import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function CanvasThree({ curKey }) {
  const canvasRef = useRef(null);
  const mixerRef = useRef(null);
  const characterRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const frustumSize = 3.25;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );
    camera.position.set(3, 2, 4);
    scene.add(camera);

    // Light
    const ambientLight = new THREE.AmbientLight("#fff", 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("#fff", 2);
    directionalLight.position.set(1, 0, 2);
    scene.add(directionalLight);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 2.5;
    controls.enableZoom = false;

    // Mesh
    const gltfLoader = new GLTFLoader();
    const modelPath =
      "./assets/ddg.glb" || `${process.env.PUBLIC_URL}/assets/ddg.glb`;

    gltfLoader.load(modelPath, (glb) => {
      characterRef.current = glb.scene;

      // actions
      const mixer = new THREE.AnimationMixer(characterRef.current);
      mixerRef.current = mixer;

      characterRef.current.traverse((child) => {
        if (child.isMesh) {
          child.userData.actions = glb.animations.map((clip) =>
            mixer.clipAction(clip)
          );

          child.userData.actions[0].reset().play();
          child.userData.actions[0].timeScale = 0.5;
        }
      });
      scene.add(characterRef.current);
      camera.lookAt(characterRef.current.position);
    });

    window.addEventListener("resize", setSize);
    function setSize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const aspect = width / height;

      camera.left = (-frustumSize * aspect) / 2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.render(scene, camera);
    }

    // window.addEventListener("keydown", handleKeydown);

    // function handleKeydown(e) {
    //   if (e.code === "KeyZ") {
    //     playAction(characterRef.current);
    //   }
    // }

    // update
    renderer.setAnimationLoop(animate);
    const clock = new THREE.Clock();
    function animate() {
      const delta = clock.getDelta();
      if (mixerRef.current) mixerRef.current.update(delta);
      controls.update();
      renderer.render(scene, camera);
    }

    return () => {
      window.removeEventListener("resize", setSize);
      // window.removeEventListener("keydown", handleKeydown);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (curKey === "Space") {
      console.log(curKey);
      playAction(characterRef.current);
    }
  }, [curKey]);

  function playAction(mesh) {
    if (!mesh) return;

    mesh.traverse((child) => {
      if (child.isMesh) {
        const actions = child.userData.actions;

        actions[0].fadeOut(0.5);
        actions[1].setLoop(THREE.LoopOnce, 1);
        actions[1].reset().fadeIn(0.5).play();
        actions[1].clampWhenFinished = true;
        actions[1].fadeIn(0.5).play();

        mixerRef.current.addEventListener("finished", function onFinish(e) {
          if (e.action === actions[1]) {
            actions[1].fadeOut(0.5);
            actions[0].reset().fadeIn(0.5).play();

            mixerRef.current.removeEventListener("finished", onFinish);
          }
        });
      }
    });
  }

  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      style={{ width: "260px", height: "260px", touchAction: "none" }}
    ></canvas>
  );
}
