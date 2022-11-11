import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

function addModelToBG() {
	let container;
	let camera;
	let renderer;
	let scene;
	let box;

	function init() {
		container = document.querySelector(".scene.one");
		scene = new THREE.Scene();

		const fov = 35;
		const aspect = container.clientWidth / container.clientHeight;
		const near = 0.9;
		const far = 1000;

		//Camera setup
		camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

		//Renderer
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
		});

		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);

		container.appendChild(renderer.domElement);

		function render() {
			renderer.render(scene, camera);
		}
		animate();
	}

	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}

	init();

	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath("/draco/");

	const gltfLoader = new GLTFLoader();
	gltfLoader.setDRACOLoader(dracoLoader);

	let mixer = null;

	gltfLoader.load(
		"/models/human.gltf",
		gltf => {
			let model = gltf.scene;
			mixer = new THREE.AnimationMixer(model);
			const action = mixer.clipAction(gltf.animations[0]);

			action.play();

			model.scale.set(0.5, 0.5, 0.5);
			scene.add(model);
		},

		progress => {
			console.log("progress");
			console.log(progress);
		},
		error => {
			console.log("error");
			console.log(error);
		}
	);

	function onWindowResize() {
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.clientWidth, container.clientHeight);
	}

	const clock = new THREE.Clock();
	let previousTime = 0;

	const tick = () => {
		const elapsedTime = clock.getElapsedTime();
		const deltaTime = elapsedTime - previousTime;
		previousTime = elapsedTime;

		//Update mixer
		if (mixer !== null) {
			mixer.update(deltaTime);
		}

		// Render
		renderer.render(scene, camera);

		// Call tick again on the next frame
		window.requestAnimationFrame(tick);
	};

	tick();

	window.addEventListener("resize", onWindowResize);

	gsap.registerPlugin(ScrollTrigger);

	scene.rotation.set(0, 0, 0);
	camera.position.set(2, 0, 5);

	ScrollTrigger.defaults({
		immediateRender: false,
		ease: "power1.inOut",
		scrub: true,
	});

	let car_anim = gsap.timeline();

	// Full Height

	car_anim.to(scene.rotation, {
		y: -4.79,
		scrollTrigger: {
			trigger: ".section-two",

			endTrigger: ".section-four",
			end: "top bottom",
			markers: {
				startColor: "yellow",
				endColor: "red",
				fontSize: "4rem",
				indent: 200,
			},
		},
	});

	// Slide 2

	car_anim.to(camera.position, {
		x: -0.1,
		scrollTrigger: {
			trigger: ".section-two",

			start: "top bottom",
			end: "top top",
		},
	});

	// Slide 3

	car_anim.to(scene.rotation, {
		z: -1.6,
		y: -Math.PI / 2,
		scrollTrigger: {
			trigger: ".section-three",

			start: "top bottom",
			end: "top top",
		},
	});
}
addModelToBG();
