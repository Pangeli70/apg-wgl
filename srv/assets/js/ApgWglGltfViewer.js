import * as THREE from 'https://ga.jspm.io/npm:three@0.153.0/build/three.module.js';

import { OrbitControls } from 'https://ga.jspm.io/npm:three@0.153.0/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'https://ga.jspm.io/npm:three@0.153.0/examples/jsm/loaders/RGBELoader.js';
import { EXRLoader } from 'https://ga.jspm.io/npm:three@0.153.0/examples/jsm/loaders/EXRLoader.js';
import { GLTFLoader } from 'https://ga.jspm.io/npm:three@0.153.0/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'https://ga.jspm.io/npm:three@0.153.0/examples/jsm/libs/lil-gui.module.min.js';


export class ApgWglGltfViewer {

    // Three renderer div container
    glDiv = null;
    // string[]
    logger = [];
    // Ul logger container
    loggerUl = null;
    // Three renderer
    renderer = null;
    // renderer aspect ratio
    aspect = 16 / 9;
    camera = null;
    scene = null;
    orbitControls = null;
    ambientLight = null;
    pointLight = null;
    textureLoader = null;
    textureMaps = [];
    bumpMaps = [];
    normalMaps = [];
    // env map loader
    hdrLoader = null;
    // standard environment maps
    hbrs = [];
    // extended env map loader
    exrLoader = null;
    // extended environment maps
    exrs = [];

    gltf = null;


    options = {
        ambientLightTone: 0xcF,
        pointLightColor: 0xFFAA00,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
        // If we set the environment the lights are overwritten
        useEnvMapInsteadThanLights: false
    }


    setContainer() {
        const section = document.getElementById('ApgWglViewer');
        this.glDiv = document.createElement('div');
        this.glDiv.id = 'ApgWglContainer';
        section.appendChild(this.glDiv);
    }


    setupLogger() {

        this.loggerUl = document.createElement('ul');
        this.loggerUl.id = 'ApgWglLogger';
        this.glDiv.appendChild(this.loggerUl);

        this.log('Loading...');
    }


    log(atext) {

        this.logger.push(atext);

        const li = document.createElement('li');
        this.loggerUl.appendChild(li);

        const litxt = document.createTextNode(atext);
        li.appendChild(litxt);

    }

    initializeRenderer() {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(this.glDiv.clientWidth, this.glDiv.clientWidth / this.aspect);
        renderer.toneMapping = this.options.toneMapping;
        renderer.toneMappingExposure = this.options.toneMappingExposure;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x888888);
        this.glDiv.appendChild(renderer.domElement);
        this.renderer = renderer;
        this.log("Renderer ok ...")
    }

    initializeCamera() {
        const camera = new THREE.PerspectiveCamera(50, this.aspect, 1, 10000);
        camera.position.set(0, 2000, 5000);
        this.camera = camera;
        this.log('Camera ok ...',);
    }

    initializeScene() {
        const scene = new THREE.Scene();
        this.scene = scene;
        this.log('Scene ok ...');
    }

    getLigthColor(atone) {
        return atone * 0xff * 0xff + atone * 0xff + atone;
    }

    initializeLights() {

        const ambientLight = new THREE.AmbientLight(this.getLigthColor(this.options.ambientLightTone));
        this.scene.add(ambientLight);
        this.ambientLight = ambientLight;

        const pointLight = new THREE.PointLight(this.options.pointLightColor);
        pointLight.position.copy(this.camera.position);
        this.scene.add(pointLight);
        this.pointLight = pointLight;

        this.log('Lights ok ...');
    }

    initializeTextures() {

        const textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = '';
        textureLoader.setCrossOrigin("anonymous");
        this.textureLoader = textureLoader;

        const textureImages = [
            '/assets/img/gltf/maps/01_wood.png',
            '/assets/img/gltf/maps/02_wood.png',
            '/assets/img/gltf/maps/03_wood.png',
            '/assets/img/gltf/maps/04_wood.png',
            '/assets/img/gltf/maps/05_wood.png',
            '/assets/img/gltf/maps/06_micaceus.png',
        ]

        const bumpImages = [
            '/assets/img/gltf/bumps/01_stucco.png',
        ]

        const normalImages = [
            '/assets/img/gltf/normals/01_woodgrain.png',
        ]

        // since those are loaded asycronously we must refer to them by index
        // and so we must preload empty objects
        this.textureMaps = [{}, {}, {}, {}, {}];
        this.bumpMaps = [{}];
        this.normalMaps = [{}];

        // Load texture Maps
        for (let i = 0; i < textureImages.length; i++) {

            textureLoader.load(
                textureImages[i],
                (atexture) => {
                    atexture.colorSpace = THREE.SRGBColorSpace;
                    atexture.flipY = false;
                    atexture.wrapS = THREE.RepeatWrapping;
                    atexture.repeat.x = 4;
                    atexture.wrapT = THREE.RepeatWrapping;
                    atexture.repeat.y = 4;
                    this.textureMaps[i] = atexture;
                    this.log(textureImages[i] + ' ok ...');

                    if (i == 1) {
                        // Create textured Box stub
                        const box = new THREE.Mesh(
                            new THREE.BoxGeometry(100, 100, 100),
                            new THREE.MeshPhongMaterial({
                                color: 0xFFFFFF,
                                map: atexture
                            }));
                        // add the box mesh to the scene
                        this.scene.add(box);
                        this.log('Stub ok ...');
                    }
                },
                undefined, // progress callback
                (aerr) => { console.error(aerr) } // error callback
            );

        }

        // Load Bump Maps
        textureLoader.load(
            bumpImages[0],
            (atexture) => {
                atexture.colorSpace = THREE.SRGBColorSpace;
                atexture.flipY = false;
                atexture.wrapS = THREE.RepeatWrapping;
                atexture.wrapT = THREE.RepeatWrapping;
                atexture.repeat.x = 2;
                atexture.repeat.y = 2;
                this.bumpMaps[0] = atexture;
                this.log('Bump Map ok');
            },
            undefined,
            (aerr) => { console.error(aerr) }
        );

        // Load normal maps
        textureLoader.load(
            normalImages[0],
            (atexture) => {
                atexture.colorSpace = THREE.SRGBColorSpace;
                atexture.flipY = false;
                atexture.wrapS = THREE.RepeatWrapping;
                atexture.wrapT = THREE.RepeatWrapping;
                atexture.repeat.x = 2;
                atexture.repeat.y = 2;
                this.normalMaps[0] = atexture;
                this.log('Normal Map ok ...');
            },
            undefined,
            (aerr) => { console.error(aerr) }
        );
    }

    initializeHbrs() {
        // Setup Background HDRS
        const hdrPath = "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/";
        const hdrFiles = [
            'red_wall_1k.hdr',
            'palermo_square_1k.hdr',
            'residential_garden_1k.hdr'
        ]
        const currentHDRIndex = Math.floor(Math.random() * 3);

        // Load HDR envMap scene Background
        const hdrLoader = new RGBELoader();
        hdrLoader.setPath(hdrPath);
        const hdrLoaderResult = hdrLoader
            .load(hdrFiles[currentHDRIndex], (hbrMap) => {
                hbrMap.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.background = hbrMap;

                if (this.options.useEnvMapInsteadThanLights) {
                    this.scene.environment = hbrMap;
                }
                this.log(hdrFiles[currentHDRIndex] + ' ok');
                // force re rendering the scene as soon as the envMap is loaded
                this.render();
            });
        this.hdrLoader = hdrLoader;
    }

    initializeExrs() {
        const exrFiles = [
            '/assets/img/gltf/exrs/empty_warehouse_01_1k.exr',
            '/assets/img/gltf/exrs/neon_photostudio_1k.exr',
        ]
        const currentExrIndex = Math.floor(Math.random() * 2);

        // Load Exr envMap scene Background
        const exrLoader = new EXRLoader();
        //exrLoader.setPath(".");
        const exrLoaderResult = exrLoader
            .load(exrFiles[currentExrIndex], (exrMap) => {
                exrMap.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.background = exrMap;
                // If we set the environment the lights are overwritten
                if (this.options.useEnvMapInsteadThanLights) {
                    this.scene.environment = exrMap;
                }
                this.log(exrFiles[currentExrIndex] + ' ok');
                // force re rendering the scene as soon as the envMap is loaded
                this.render();
            });
        this.exrLoader = exrLoader;
    }

    initializeGui() {
        const gui = new GUI();

        gui.add(this.options, 'ambientLightTone', 0, 0xff, 2).onChange(() => {
            this.ambientLight.color = this.getLigthColor(this.options.ambientLightTone)
            this.render();
        });
        gui.open();
    }

    initializeOrbitControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.minDistance = 2;
        controls.maxDistance = 500;
        controls.target.set(0, 0, 0);
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = true;
        controls.maxPolarAngle = Math.PI / 2;
        controls.listenToKeyEvents(window); // optional
        controls.update();
        controls.addEventListener('change', this.render()); // use if there is no animation loop
        this.orbitControls = controls;
        this.log('Orbit controls ok ...');
    }

    init() {
        this.setContainer();
        this.setupLogger();
        this.initializeRenderer();
        this.initializeCamera();
        this.initializeScene();
        this.initializeLights();
        this.initializeTextures();
        this.initializeHbrs();
        this.initializeExrs();
        this.initializeGui();
        this.initializeOrbitControls();
    }

    loadGltf(agltfResource) {

        // Gltf model
        const gltfLoader = new GLTFLoader();
        // gltfResource comes from the external script injected into the page
        const gltfLoaderResult = gltfLoader
            .load(agltfResource, (gltf) => {
                this.log(agltfResource + ' ok');
                this.scene.add(gltf.scene);
                this.gltf = gltf;
                this.setMaterials(gltf);
                this.render();
            });
    }

    setMaterials(agltf) {
        agltf.scene.traverse((aGltfNode) => {
            if (aGltfNode.isMesh) {
                //console.log(aGltfNode.material.name);
                const materialAttributes = aGltfNode.material.name.split('_');

                if (materialAttributes[0] == 'Textured') {
                    let textureIndex = +materialAttributes[1] - 1;
                    textureIndex = textureIndex % textureMaps.length;
                    aGltfNode.material.map = textureMaps[textureIndex];
                    aGltfNode.material.color = new THREE.Color(1, 1, 1);
                }
                else if (materialAttributes[0] == 'Bumped') {
                    let bumpIndex = +materialAttributes[1] - 1;
                    bumpIndex = bumpIndex % bumpMaps.length;
                    aGltfNode.material.bumpMap = bumpMaps[bumpIndex];
                    aGltfNode.material.bumpScale = 0.5; // depth of the bump effect
                }
                else if (materialAttributes[0] == 'Normaled') {
                    let normalIndex = +materialAttributes[1] - 1;
                    normalIndex = normalIndex % normalMaps.length;
                    aGltfNode.material.normalMap = normalMaps[normalIndex];
                }

                const uvs = aGltfNode.geometry.attributes.uv.array;
                let maxu = 0;
                let minu = 0;
                let maxv = 0;
                let minv = 0;
                for (let i = 0; i < uvs.length; i += 2) {
                    if (uvs[i] > maxu) {
                        //console.log(i, maxu, uvs[i]);
                        maxu = uvs[i];
                    }
                    if (uvs[i] < minu) {
                        //console.log(i, minu, uvs[i]);
                        minu = uvs[i];
                    }
                    if (uvs[i + 1] > maxv) maxv = uvs[i + 1];
                    if (uvs[i + 1] < minv) minv = uvs[i + 1];
                }
                console.log(minu, maxu, minv, maxv);
                const deltau = maxu - minu;
                const deltav = maxv - minv;
                for (let i = 0; i < uvs.length; i += 2) {
                    uvs[i] = uvs[i] / deltau + 0.5;
                    uvs[i + 1] = uvs[i + 1] / deltav + 0.5;
                }
                //console.log(uvs);

                //console.log(aGltfNode.material.color);
                // if (aGltfNode.material.map?.repeat) {
                //   aGltfNode.material.map.repeat.x = 1;
                //   aGltfNode.material.map.repeat.y = 1;
                // }
                // else {
                //   console.log(aGltfNode.material.name);
                // }
                aGltfNode.material.needsUpdate = true;
                // console.log(aGltfNode.material);
                // console.log(aGltfNode.geometry);
            };
        });
        this.log('Scene materials ok');
    }

    resize() { 
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();

        const newWidth = this.glDiv.innerWidth;

        this.renderer.setSize(
            newWidth,
            newWidth / this.aspect
        );

        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}