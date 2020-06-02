import * as THREE from 'three'
import AlphaMap from '../assets/sphere/DisplacementMap.png'
import BumpMap from '../assets/sphere/NormalMap.png'
import SpecularMap from '../assets/sphere/SpecularMap.png'

function loadSphereTextures() {


    // instantiate a loader
    var loader = new THREE.TextureLoader();
  
    // earth textures
    var textures = {
      'map': {
        url: AlphaMap,
        val: undefined
      },
      'bumpMap': {
        url:BumpMap,
        val: undefined
      },
      'specularMap': {
        url: SpecularMap,
        val: undefined
      }
    };
  
    var texturePromises = [], path = './';
  
    for (var key in textures) {
      texturePromises.push(new Promise((resolve, reject) => {
        var entry = textures[key]
        var url = entry.url
        loader.load(url,
          texture => {
            entry.val = texture;
            if (entry.val instanceof THREE.Texture) resolve(entry);
          },
          xhr => {
            console.log(url + ' ' + (xhr.loaded / xhr.total * 100) +
              '% loaded');
          },
          xhr => {
            reject(new Error(xhr +
              'An error occurred loading while loading: ' +
              entry.url));
          }
        );
      }));
    }
  
    // load the geometry and the textures
    return Promise.all(texturePromises)
  
  }
  



  export default loadSphereTextures;