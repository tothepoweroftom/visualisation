import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import { RGBELoader } from "./loaders/RGBELoader.js";
import hdr from "./assets/royal_esplanade_1k.hdr"
const s_group = new THREE.Group();
import loadSphereTextures from './three/Globe'
import Tetrahedron from './three/Tetrahedron'

let params = {
  color: 0xffffff,
  transparency: 0.850,
  envMapIntensity: 0.9,
  lightIntensity: 0.6,
  exposure: 1, 

  mapRadius: 50,
};

// Mouse Control


let colors = [new THREE.Color('red'), new THREE.Color('green'), new THREE.Color('orange')]

const main = () => {
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(18);
  let hdrCubeRenderTarget;
  let spotLight1, spotLight2;
  let mesh1, mesh2;
  let innerGeometry, innerMaterial;
  let mouse = new THREE.Vector2(), INTERSECTED;
  let raycaster;

  let speedControls = []



  let sphereGroup = new THREE.Group();
  //--
  const controls = new OrbitControls(camera, canvas);
  // controls.target.set(0, 0, 0);
  controls.update();
  controls.minDistance = 200;
				controls.maxDistance = 650;
  //--
  camera.position.z = 500;
  scene.add(s_group);
  scene.add(sphereGroup);
  let arrowControls = new THREE.Group()
  scene.add(arrowControls)




  //--

  // Control
  const onDocumentMouseMove = (event) => {
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    event.preventDefault();
  
    // update the mouse variable
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  const onDocumentTouchBegan = event => {
    event.preventDefault();
  
    // update the mouse variable
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  const onDocumentMouseDown = (event) => {
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    event.preventDefault();
  
    if(INTERSECTED){
      INTERSECTED.children[1].scale.x = 2
      INTERSECTED.children[1].scale.y = 2
      INTERSECTED.children[1].scale.z = 2

    }
  }

  const init = () => {
    renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = params.exposure;

        renderer.outputEncoding = THREE.sRGBEncoding;
        
        // add hdr
        var pmremGenerator = new THREE.PMREMGenerator( renderer );
				hdrCubeRenderTarget = pmremGenerator.fromEquirectangular( hdrEquirect );
				hdrEquirect.dispose();
				pmremGenerator.dispose();


        raycaster = new THREE.Raycaster();

        scene.background = new THREE.Color(0xcccccc)

  }

  const addContent = (textures) => {

    var geometry = new THREE.SphereBufferGeometry( 10, 32, 16 );

				var texture = new THREE.CanvasTexture( generateTexture() );
				texture.magFilter = THREE.NearestFilter;
				texture.wrapT = THREE.RepeatWrapping;
				texture.wrapS = THREE.RepeatWrapping;
				texture.repeat.set( 1, 3.5 );

				var material = new THREE.MeshPhysicalMaterial( {
					color: params.color,
					metalness: 0,
					roughness: 0,
					alphaMap: texture,
					alphaTest: 0.5,
					envMap: hdrCubeRenderTarget.texture,
					envMapIntensity: params.envMapIntensity,
					depthWrite: false,
					transparency: params.transparency, // use material.transparency for glass materials
					opacity: 1,                        // set material.opacity to 1 when material.transparency is non-zero
					transparent: true
				} );


          let controlGeo = new THREE.TetrahedronGeometry(2,0);
          let controlMaterial = new THREE.MeshBasicMaterial({ transparent: true, color: new THREE.Color('white')})
          let upControl = new THREE.Mesh(controlGeo, controlMaterial)
          let downControl = new THREE.Mesh(controlGeo, controlMaterial)
          upControl.position.y = 15
          upControl.rotation.y = Math.PI/4
          upControl.rotation.x = Math.PI/4 + Math.PI
          upControl.rotation.z = Math.PI

          downControl.position.y = -15
          downControl.rotation.z = Math.PI/4
          downControl.rotation.x = Math.PI/4
          arrowControls.add(upControl)
          arrowControls.add(downControl)
          arrowControls.children.forEach((child)=>{
            child.material.opacity = 0
          })
         
          



        


        for(let i=0; i<11; i++){
          var material1 = new THREE.MeshPhysicalMaterial().copy( material );

          var material1b = new THREE.MeshPhysicalMaterial().copy( material );
          material1b.side = THREE.BackSide;
          let sphere = new THREE.Mesh( geometry, material1 );
          sphere.userData = {name: "something", speed: 1}
          // mesh1.position.x = 0.0;
          // scene.add( mesh1 );
  
          var mesh = new THREE.Mesh( geometry, material1b );
          mesh.renderOrder = - 1;
          sphere.add( mesh );
  
          let innerGeometry = new THREE.SphereBufferGeometry( 1+(i%3), 32, 16 );
          let innerMaterial = new THREE.MeshPhysicalMaterial( {
            color: colors[i%colors.length],
            metalness: 0.2,
            roughness: 0.5,
            alphaMap: textures[0].val,
            bumpMap: textures[1].val,
            bumpScale: 5,
            specularMap: textures[2].val,
            specular: new THREE.Color('grey'),
            alphaTest: 0.25,
            envMap: hdrCubeRenderTarget.texture,
            envMapIntensity: params.envMapIntensity,
            depthWrite: false,
            // transparency: 0., // use material.transparency for glass materials
            opacity: 0.9,                        // set material.opacity to 1 when material.transparency is non-zero
            // transparent: true
          } );
          let innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
          console.log(innerSphere)
          console.log(colors[i%colors.length])
          

          sphere.add(innerSphere)
          

          if(i!=0){
            sphere.position.x = params.mapRadius * Math.sin(i*(2*Math.PI/10))
            sphere.position.y = params.mapRadius * Math.cos(i*(2*Math.PI/10))
          } else {
            sphere.position.x = 0;
            sphere.position.y = 0;
          }

         

          sphereGroup.add(sphere);
        }

     

			


  }


  

  const addLights = () => {
    				//

    spotLight1 = new THREE.SpotLight( 0xffffff, params.lightIntensity );
    spotLight1.position.set( 100, 200, 200 );
    spotLight1.angle = Math.PI / 6;
    scene.add( spotLight1 );

    spotLight2 = new THREE.SpotLight( 0xffffff, params.lightIntensity );
    spotLight2.position.set( - 100, - 200, - 200 );
    spotLight2.angle = Math.PI / 6;
    scene.add( spotLight2 );
  }

  const animation = () => {
    requestAnimationFrame(animation);

    // check for intersections
    findIntersections()
    var t = performance.now();


    camera.lookAt(scene.position);
    camera.updateMatrixWorld();

    sphereGroup.children.forEach((child, index)=>{
        child.rotation.x  = t * (0.0002+ 1/(10000+index*10000)) * child.userData.speed;
         child.rotation.z = - t * (0.0002+ 1/(10000+index*10000))  * child.userData.speed;
         child.position.y += 0.02*Math.sin(t*(0.002+ 1/(1000+index*1000)))
    })
   
    renderer.render(scene, camera);
  };

  const onWindowResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  const findIntersections = () => {
    // find intersections

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( sphereGroup.children );

    if ( intersects.length > 0 ) {

      if ( INTERSECTED != intersects[ 0 ].object ) {

        if ( INTERSECTED ) INTERSECTED.children[0].material.emissive.setHex( INTERSECTED.currentHex );
        // console.log(intersects)

        INTERSECTED = intersects[ 0 ].object;
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.children[0].material.emissive.setHex( 0xffffff );

        arrowControls.position.x = INTERSECTED.position.x
        arrowControls.position.y = INTERSECTED.position.y
        arrowControls.children.forEach((child)=>{child.material.opacity = 1})
        INTERSECTED.userData.speed = 5

      }

    } else {

      if ( INTERSECTED ) {
        INTERSECTED.userData.speed = 1

        INTERSECTED.children[0].material.emissive.setHex( INTERSECTED.currentHex );
      }

      INTERSECTED = null;

    }

  }

  const generateTexture = () => {

      var canvas = document.createElement( 'canvas' );
      canvas.width = 2;
      canvas.height = 2;

      var context = canvas.getContext( '2d' );
      context.fillStyle = 'white';
      context.fillRect( 0,1,2, 2 );

      return canvas;

    
  }


  init();

  
  loadSphereTextures().then((textures)=>{
    console.log("loaded", textures)
    addContent(textures);


  })

  addLights();

  animation();
  onWindowResize();
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'ontouchended', onDocumentMouseMove, false );

  window.addEventListener("resize", onWindowResize, false);
};

var hdrEquirect = new RGBELoader()
  .setDataType(THREE.FloatType)
  .load(hdr, function(texture) {
    main();
  });
