import * as THREE from 'three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

let mixer, bakedMesh, headMesh, animationAction, isProducts, isTestimonials, isCameraAnimInProgress, index = 0;
const container = document.querySelector('.webgl');
const slides = document.querySelectorAll(".js-hero-text-slides .hero-slide");
const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();
const frustumSize = 534;
const uvsArray = new Float32Array([1, 1, 0, 1, 0, 0, 1, 0]);
// const objectUrl = 'https://web-assets.chaingpt.org/assets/3d/chainGPT_robo_BAKED_CYCLE.glb';
const objectUrl = 'assets/3d/main.glb';
const envMapUrl = 'https://web-assets.chaingpt.org/assets/3d/Cannon_Exterior.hdr';
// const envMapUrl = '/assets/3d/light.hdr';

const buttonClickDelay = 6.5;

// mouse interaction variables
const spherical = new THREE.Spherical();
const sphericalDelta = new THREE.Spherical();
const rotateStart = new THREE.Vector2();
const rotateEnd = new THREE.Vector2();
const rotateDelta = new THREE.Vector2();
const headInitialRotation = new THREE.Vector3();
const moveThreshold = 30;

const targetVector = new THREE.Vector3(0, 420, 0);
const screens = ['hero', 'products'];
const positioning = {
hero: {
  camera: new THREE.Vector3(462, 740, 612),
  zoom: 1,
  targetVector: new THREE.Vector3(0, 420, 0)
},
products: {
  camera: new THREE.Vector3(-38, 560, 612),
  zoom: 1.4,
  targetVector: new THREE.Vector3(0, 570, 0)
}
}

// // shader stuff
// const eyeVideo = document.getElementById('eye-video');
// eyeVideo.play();
// const eyeTexture = new THREE.VideoTexture(eyeVideo);
// eyeTexture.minFilter = THREE.LinearFilter;
// eyeTexture.magFilter = THREE.LinearFilter;
// eyeTexture.format = THREE.RGBAFormat;

// const clickVideo = document.getElementById('click-video');
// const clickTexture = new THREE.VideoTexture(clickVideo);
// clickTexture.minFilter = THREE.LinearFilter;
// clickTexture.magFilter = THREE.LinearFilter;
// clickTexture.format = THREE.RGBAFormat;
// clickVideo.onplay = () => {
// setTimeout(changeSlide, 200);
// }

const shaderMaterial = new THREE.ShaderMaterial( {
vertexShader: document.getElementById( 'vertexShader' ).textContent,
fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
transparent: true
} );

new RGBELoader().load(envMapUrl, texture => {
texture.mapping = THREE.EquirectangularReflectionMapping;

scene.environment = texture;
});

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera( - frustumSize * aspect, frustumSize * aspect, frustumSize, - frustumSize, 1, 5000 );
camera.position.set(
positioning[screens[0]].camera.x,
positioning[screens[0]].camera.y,
positioning[screens[0]].camera.z
);
camera.lookAt(positioning[screens[0]].targetVector);
const initialPos = camera.position.clone();
const initialRot = camera.rotation.clone();

const light = new THREE.DirectionalLight(0xfefefe, 2);
light.position.set(136, 58, 184);

scene.add(light);

gltfLoader.load(objectUrl, (gltf) => {
bakedMesh = gltf.scene;
// const screenMesh = bakedMesh.getObjectByName('FACE');
headMesh = bakedMesh.getObjectByName('mixamorigHead');
// headInitialRotation.copy(headMesh.rotation);

// screenMesh.geometry.setAttribute('uv', new THREE.BufferAttribute(uvsArray, 2));
// screenMesh.material = shaderMaterial.clone();
// screenMesh.material.uniforms = {
//   videoTexture: { type: 'sampler2D', value: eyeTexture }
// };

// const buttonMesh = bakedMesh.getObjectByName('TOUCH');
// buttonMesh.geometry.setAttribute('uv', new THREE.BufferAttribute(uvsArray, 2));
// buttonMesh.material = shaderMaterial.clone();
// buttonMesh.material.uniforms = {
//   videoTexture: { type: 'sampler2D', value: clickTexture }
// };

if (gltf.animations.length) {
  mixer = new THREE.AnimationMixer(gltf.scene);
  animationAction = mixer.clipAction(gltf.animations[0]);
  animationAction.play();
}
/* animations on scroll */
function scrollAnimHeroFunc() {
  const animTriggers = document.querySelectorAll("[anim-trigger-hero]");
  animTriggers.forEach((item) => {
    let itemTl = gsap.timeline({
      paused: true
    });
    itemTl.to(item.querySelector("[anim-trigger-text-hero]"), {
      scrambleText: {
        chars: "061kzeorqsputf",
        text: "{original}",
        speed: 2,
        delimiter: ""
      },
      duration: 0.8
    });

    ScrollTrigger.create({
      trigger: item,
      start: "top 95%",
      end: "top center",
      onEnter: () => {
        setTimeout(()=> {
          item.classList.add('is-animated');
          itemTl.timeScale(1).play();
        }, 500)
      },
    })
  });
}

scene.add(bakedMesh);
document.body.classList.add('loaded');
setTimeout(()=> {
  scrollAnimHeroFunc();
}, 500)
/* onscroll anim text */
function scrollAnimFunc() {
  const animTriggers = document.querySelectorAll("[anim-trigger]");
  animTriggers.forEach((item) => {
    let itemTl = gsap.timeline({
      paused: true
    });
    itemTl.to(item.querySelector("[anim-trigger-text]"), {
      scrambleText: {
        chars: "061kzeorqsputf",
        text: "{original}",
        speed: 2,
        delimiter: ""
      },
      duration: 0.8
    });

    ScrollTrigger.create({
      trigger: item,
      start: "top 92%",
      onEnter: () => {
        setTimeout(()=> {
          item.classList.add('is-animated');
          itemTl.timeScale(1).play();
        }, 300)
      },
    })
  });
}
scrollAnimFunc();
/* onscroll refresh trigger */
const refreshTrigger = document.querySelectorAll("[refresh-trigger]");
refreshTrigger.forEach((item) => {
  ScrollTrigger.create({
    trigger: item,
    start: "top 90%",
    end: "top center",
    toggleActions: "restart pause resume pause",
    onEnter: () => {
      ScrollTrigger.refresh();
    },
  })
});
});

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
renderer.setClearColor(0xffffff, 0);
renderer.setPixelRatio( window.devicePixelRatio * 0.95 );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

const clock = new THREE.Clock();
/**
* Animate
*/
const tick = () => {
const mixerUpdateDelta = clock.getDelta();

// Render
renderer.render(scene, camera);

mixer?.update(mixerUpdateDelta);

// Call tick again on the next frame
window.requestAnimationFrame(tick);
};

// eyeVideo.addEventListener('timeupdate', (e) => {
// if (eyeVideo.currentTime >= 2.5 && !isTestimonials) {
//   eyeVideo.currentTime = 0;
// }
// if (animationAction && animationAction.time >= buttonClickDelay && animationAction.time <= buttonClickDelay + 0.5) {
//   clickVideo.play();
// }
// });

const getMouseDegrees = (x, y, degreeLimit) => {
let dx = 0,
  dy = 0,
  xdiff,
  xPercentage,
  ydiff,
  yPercentage;

const w = { x: window.innerWidth, y: window.innerHeight };

// Left (Rotates neck left between 0 and -degreeLimit)
// 1. If cursor is in the left half of screen
if (x <= w.x / 2) {
  // 2. Get the difference between middle of screen and cursor position
  xdiff = w.x / 2 - x;
  // 3. Find the percentage of that difference (percentage toward edge of screen)
  xPercentage = xdiff / (w.x / 2) * 100;
  // 4. Convert that to a percentage of the maximum rotation we allow for the neck
  dx = degreeLimit * xPercentage / 100 * -1;
}

// Right (Rotates neck right between 0 and degreeLimit)
if (x >= w.x / 2) {
  xdiff = x - w.x / 2;
  xPercentage = xdiff / (w.x / 2) * 100;
  dx = degreeLimit * xPercentage / 100;
}
// Up (Rotates neck up between 0 and -degreeLimit)
if (y <= w.y / 2) {
  ydiff = w.y / 2 - y;
  yPercentage = ydiff / (w.y / 2) * 100;
  // Note that I cut degreeLimit in half when she looks up
  dy = degreeLimit * 0.5 * yPercentage / 100 * -1;
}
// Down (Rotates neck down between 0 and degreeLimit)
if (y >= w.y / 2) {
  ydiff = y - w.y / 2;
  yPercentage = ydiff / (w.y / 2) * 100;
  dy = degreeLimit * yPercentage / 100;
}
return { x: dx, y: dy };
}

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: '.hero',
  start: 'top top',
  end: '95%',
  onLeaveBack: () => {
    animationAction?.play();
  },
  onUpdate: (event) => {
    cameraAnimation(event.progress);
  }
});

ScrollTrigger.create({
  trigger: '.unlimited-solutions',
  start: 'top 10%',
  onEnter: () => {
    isProducts = true;
    animationAction?.stop();
  },
  onLeaveBack: () => {
    isProducts = false;
    if (headMesh) {
      gsap.to(headMesh.rotation, {
        x: headInitialRotation.x,
        y: headInitialRotation.y,
        duration: 0.1,
        delay: 0.01
      })
    }
  }
});

// ScrollTrigger.create({
//   trigger: '.reviews-section',
//   start: 'top 70%',
//   onEnter: () => {
//     isTestimonials = true;
//     eyeVideo.currentTime = 2.5;
//     eyeVideo.play();
//     eyeVideo.removeAttribute('loop');
//   },
//   onLeaveBack: () => {
//     isProducts = true;
//     isTestimonials = false;
//     eyeVideo.currentTime = 0;
//     eyeVideo.play();
//     eyeVideo.setAttribute('loop', 'true');
//   }
// });

// const changeSlide = () => {
// index = index > slides.length - 2 ? 0 : index;
// slides.forEach((slide, i) => {
//   index === i ? slide.classList.add('active') : slide.classList.remove('active');
// });
// index++;
// }

// changeSlide();

const cameraAnimation = (progress) => {
if (isCameraAnimInProgress) {
  return;
}

const targetYPos = positioning[screens[0]].targetVector.y + progress * (positioning[screens[1]].targetVector.y - positioning[screens[0]].targetVector.y);

gsap.to(camera, {
  zoom: positioning[screens[0]].zoom + progress * (positioning[screens[1]].zoom - positioning[screens[0]].zoom)
});

gsap.to(camera.position, {
  x: positioning[screens[0]].camera.x + progress * (positioning[screens[1]].camera.x - positioning[screens[0]].camera.x),
  y: positioning[screens[0]].camera.y + progress * (positioning[screens[1]].camera.y - positioning[screens[0]].camera.y),
  z: positioning[screens[0]].camera.z + progress * (positioning[screens[1]].camera.z - positioning[screens[0]].camera.z),
  onUpdate: () => {
    targetVector.set(0, targetYPos, 0);
    camera.lookAt(targetVector);
    camera.updateProjectionMatrix();
  },
  onComplete: () => {
    initialPos.copy(camera.position);
    initialRot.copy(camera.rotation);
    // eyeVideo.currentTime = 2.5;
    isCameraAnimInProgress = false;
  }
});

animationAction?.setEffectiveWeight(1 - progress);
}

const updatePointsData = () => {
const offset = new THREE.Vector3();

// so camera.up is the orbit axis
const quat = new THREE.Quaternion().setFromUnitVectors(camera.up, new THREE.Vector3( 0, 1, 0 ) );
const quatInverse = quat.clone().invert();

const position = camera.position;

offset.copy(position).sub(targetVector);

// rotate offset to "y-axis-is-up" space
offset.applyQuaternion(quat);

// angle from z-axis around y-axis
spherical.setFromVector3(offset);

spherical.theta += sphericalDelta.theta;
spherical.phi += sphericalDelta.phi;

spherical.makeSafe();

offset.setFromSpherical(spherical);

// rotate offset back to "camera-up-vector-is-up" space
offset.applyQuaternion(quatInverse);

position.copy(targetVector).add(offset);

camera.lookAt(targetVector);
}

['mouseleave', 'mouseenter'].forEach( evt =>
document.body.addEventListener(evt, () => {
  if (bakedMesh) {
    gsap.to(camera.position, {
      x: initialPos.x,
      y: initialPos.y,
      z: initialPos.z,
      duration: 0.1,
      delay: 0.01
    });

    gsap.to(camera.rotation, {
      x: initialRot.x,
      y: initialRot.y,
      z: initialRot.z,
      duration: 0.1,
      delay: 0.01
    });

    rotateDelta.set(0, 0, 0);
  }

  if (headMesh && isProducts) {
    gsap.to(headMesh.rotation, {
      x: headInitialRotation.x,
      y: headInitialRotation.y,
      duration: 0.1,
      delay: 0.01
    })
  }
})
);

document.addEventListener('mousemove', e => {
rotateEnd.set(e.clientX, e.clientY);

rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(0.05);

rotateStart.copy(rotateEnd);

if (!bakedMesh || Math.abs(rotateDelta.x) > moveThreshold || Math.abs(rotateDelta.y) > moveThreshold || isCameraAnimInProgress) {
  return;
}

gsap.to(sphericalDelta, {
  theta: 2 * Math.PI * -rotateDelta.x / renderer.domElement.clientHeight,
  duration: 0.1,
  onComplete: () => {
    sphericalDelta.set( 0, 0, 0 );
  }
});

gsap.to(sphericalDelta, {
  phi: 2 * Math.PI * -rotateDelta.y / renderer.domElement.clientHeight,
  duration: 0.1,
  onComplete: () => {
    sphericalDelta.set( 0, 0, 0 );
  }
});

// if (isProducts) {
//   const degrees = getMouseDegrees(e.clientX, e.clientY, 10);

//   gsap.to(headMesh.rotation, {
//     x: THREE.MathUtils.degToRad(degrees.y) * 1.5,
//     y: THREE.MathUtils.degToRad(degrees.x) * 1.5,
//     duration: 0.1
//   });
// }

// updateEyesPos(e);

updatePointsData();
});

// const updateEyesPos = (e) => {
//   const pupils = document.querySelector('.pupils');
//   const rect = pupils.getBoundingClientRect();
//   if (rect.top > window.innerHeight) {
//     return;
//   }
//   const x = (e.clientX - rect.left) / 40 + "px";
//   const y = (e.clientY - rect.top) / 15 + "px";
//   pupils.style.transform = "translate3d(" + x + "," + y + ", 0px)";
// }

window.addEventListener("resize", () => {
// Update camera
const aspect = window.innerWidth / window.innerHeight;
camera.left = -frustumSize * aspect;
camera.right = frustumSize * aspect;
camera.top = frustumSize;
camera.bottom = - frustumSize;
camera.updateProjectionMatrix();

// Update renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Reapply the desired opacity to the 'webgl' element
gsap.to(webglElement, { opacity: 0, duration: 0.5 }); // Adjust the opacity value as needed
});

tick();


// // Replace '.trigger-element' with the selector of the element that serves as the trigger
// const triggerElement = document.querySelector('.trigger-element');

// // Replace '.webgl' with the selector of the element you want to modify
// const webglElement = document.querySelector('.webgl');

// // Create a ScrollTrigger
// gsap.registerPlugin(ScrollTrigger);

// ScrollTrigger.create({
//     trigger: triggerElement, // Set the trigger element
//     start: 'top center',     // Set the start position of the trigger
//     end: 'bottom center',    // Set the end position of the trigger
//     onEnter: () => {
//         // Set the opacity of the 'webgl' element to 0 when scrolling down
//         gsap.to(webglElement, { opacity: 0, duration: 0 });
//     },
//     onEnterBack: () => {
//         // Set the opacity of the 'webgl' element to 1 when scrolling back up
//         gsap.to(webglElement, { opacity: 1, duration: 0 });
//     },
// });


// Replace '.trigger-element' with the selector of the element that serves as the trigger
const triggerElement = document.querySelector('.trigger-element');

// Replace '.webgl' with the selector of the element you want to modify
const webglElement = document.querySelector('.webgl');

// Create a ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
    trigger: triggerElement, // Set the trigger element
    start: 'top center',     // Set the start position of the trigger
    end: 'bottom center',    // Set the end position of the trigger
    onEnter: () => {
        // Set the opacity of the 'webgl' element to 0 gradually when scrolling down
        gsap.to(webglElement, { opacity: 0, duration: 0.5 });
    },
    onEnterBack: () => {
        // Set the opacity of the 'webgl' element to 1 gradually when scrolling back up
        gsap.to(webglElement, { opacity: 1, duration: 0.5 });
    },
});
