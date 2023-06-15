
import * as THREE from "https://esm.sh/three@0.153.0";
import { OrbitControls } from "https://esm.sh/three@0.153.0/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "https://esm.sh/three@0.153.0/examples/jsm/loaders/RGBELoader.js";
import { EXRLoader } from "https://esm.sh/three@0.153.0/examples/jsm//loaders/EXRLoader.js";
import { GLTFLoader, GLTF } from "https://esm.sh/three@0.153.0/examples/jsm/loaders/GLTFLoader.js";
import { GUI } from "https://esm.sh/three@0.153.0/examples/jsm/libs/lil-gui.module.min.js";


type HTMLCanvasElement = /*unresolved*/ any;

interface IApgWglDomElement {
    id: string;
    clientWidth: number;
    appendChild(achild: IApgWglDomElement | HTMLCanvasElement): void
}

interface IApgWglDomDocument extends IApgWglDomElement {
    getElementById(aid: string): IApgWglDomElement;
    createElement(atag: string): IApgWglDomElement;
    createTextNode(atext: string): IApgWglDomElement;
}

interface IApgWglBrowserWindow {
    devicePixelRatio: number;
}

export class ApgWglGltfViewer {

    window: IApgWglBrowserWindow | null = null;
    document: IApgWglDomDocument | null = null;
    // Three renderer div container
    glDiv: IApgWglDomElement | null = null;
    // string[]
    logger: string[] = [];
    // Ul logger container
    loggerUl: IApgWglDomElement | null = null;
    // Three renderer
    renderer: THREE.WebGLRenderer | null = null;
    // renderer aspect ratio
    aspect = 16 / 9;
    camera: THREE.PerspectiveCamera | null = null;
    scene: THREE.Scene | null = null;
    orbitControls: OrbitControls | null = null;
    ambientLight: THREE.AmbientLight | null = null;
    directionalLight: THREE.DirectionalLight | null = null;
    textureLoader: THREE.TextureLoader | null = null;
    textureMaps: (THREE.Texture | null)[] = [];
    bumpMaps: (THREE.Texture | null)[] = [];
    normalMaps: (THREE.Texture | null)[] = [];
    // env map loader
    hdrLoader: RGBELoader | null = null;
    // extended env map loader
    exrLoader: EXRLoader | null = null;
    currEnv: THREE.DataTexture | null = null;

    gltfResource = "";

    gltf: GLTF | null = null;


    options = {
        ambientLightIntensity: 4,
        directionalLightColor: 0xFFFFFF,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
        // If we set the environment the lights are overwritten
        useEnvMapInsteadThanLights: true,
        useExrInsteadThanHdr: Math.random() > 0.5
    }


    setContainer() {
        const section = this.document!.getElementById('ApgWglGltfViewer');
        this.glDiv = this.document!.createElement('div');
        this.glDiv.id = 'ApgWglGltfViewerCanvas';
        section.appendChild(this.glDiv);
    }


    setupLogger() {

        this.loggerUl = this.document!.createElement('ul');
        this.loggerUl.id = 'ApgWglGltfViewerLogger';
        this.glDiv!.appendChild(this.loggerUl);

        this.log('Loading...');
    }


    log(atext: string) {

        this.logger.push(atext);

        const li = this.document!.createElement('li');
        this.loggerUl!.appendChild(li);

        const litxt = this.document!.createTextNode(atext);
        li.appendChild(litxt);

    }

    initializeRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(this.window!.devicePixelRatio);
        this.renderer.setSize(this.glDiv!.clientWidth, this.glDiv!.clientWidth / this.aspect);
        this.renderer.toneMapping = this.options.toneMapping;
        this.renderer.toneMappingExposure = this.options.toneMappingExposure;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setClearColor(0x00000);
        this.glDiv!.appendChild(this.renderer.domElement);
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

    getLigthColor(atone: number) {
        const color = new THREE.Color(atone, atone, atone)
        return color;
    }

    initializeLights() {

        this.ambientLight = new THREE.AmbientLight();
        this.ambientLight.intensity = 0.2;
        this.ambientLight.visible = false;
        this.scene!.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(this.options.directionalLightColor);
        this.directionalLight.intensity = 0.8;
        this.directionalLight.position.setX(0);
        this.directionalLight.position.setY(10);
        this.directionalLight.position.setZ(5);
        this.directionalLight.castShadow = true;
        this.directionalLight.visible = false;
        this.scene!.add(this.directionalLight);

        this.log('Lights ok ...');
    }

    initializeTextureLoader() {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = '';
        textureLoader.setCrossOrigin("anonymous");
        this.textureLoader = textureLoader;
        this.log('Texture loader ok ...');
    }

    initializeTextures() {
        const texturesPath = '/assets/img/gltf/maps/'
        const textureImages = [
            '01_wood.png',
            '02_wood.png',
            '03_wood.png',
            '04_wood.png',
            '05_wood.png',
            '06_micaceus.png',
        ]

        // since those are loaded asycronously we must refer to them by index
        // and so we must preload empty objects
        this.textureMaps = [null, null, null, null, null, null,];

        // Load texture Maps
        for (let i = 0; i < textureImages.length; i++) {
            const textureFile = texturesPath + textureImages[i];
            this.textureLoader!.load(
                textureFile,
                (atexture: THREE.Texture) => {
                    atexture.colorSpace = THREE.SRGBColorSpace;
                    atexture.flipY = false;
                    atexture.wrapS = THREE.RepeatWrapping;
                    atexture.repeat.x = 4;
                    atexture.wrapT = THREE.RepeatWrapping;
                    atexture.repeat.y = 4;
                    this.textureMaps[i] = atexture;
                    this.log('Load ' + textureImages[i] + ' ok ...');

                    if (i == 1) {
                        // Create textured Box stub
                        const box = new THREE.Mesh(
                            new THREE.BoxGeometry(100, 100, 100),
                            new THREE.MeshPhongMaterial({
                                color: 0xFFFFFF,
                                map: atexture
                            }));
                        // add the box mesh to the scene
                        this.scene!.add(box);
                        this.log('Stub ok ...');
                    }
                },
                undefined, // progress callback
                (aerr: ErrorEvent) => { console.error(aerr) } // error callback
            );

        }
    }

    initializeBumpMaps() {
        const bumpsPath = '/assets/img/gltf/bumps/'
        const bumpImages = [
            '01_stucco.png',
        ]

        this.bumpMaps = [null,];
        const bumpFile = bumpsPath + bumpImages[0];
        // Load Bump Maps
        this.textureLoader!.load(
            bumpFile,
            (atexture: THREE.Texture) => {
                atexture.colorSpace = THREE.SRGBColorSpace;
                atexture.flipY = false;
                atexture.wrapS = THREE.RepeatWrapping;
                atexture.wrapT = THREE.RepeatWrapping;
                atexture.repeat.x = 2;
                atexture.repeat.y = 2;
                this.bumpMaps[0] = atexture;
                this.log('Load Bump Map ' + bumpImages[0] + ' ok ...');
            },
            undefined,
            (aerr: ErrorEvent) => { console.error(aerr) }
        );
    }

    initializeNormalMaps() {
        const normalsPath = '/assets/img/gltf/normals'
        const normalsImages = [
            '/01_woodgrain.png',
        ]
        this.normalMaps = [null,];

        const normalsFile = normalsPath + normalsImages[0];

        // Load normal maps
        this.textureLoader!.load(
            normalsFile,
            (atexture: THREE.Texture) => {
                atexture.colorSpace = THREE.SRGBColorSpace;
                atexture.flipY = false;
                atexture.wrapS = THREE.RepeatWrapping;
                atexture.wrapT = THREE.RepeatWrapping;
                atexture.repeat.x = 2;
                atexture.repeat.y = 2;
                this.normalMaps[0] = atexture;
                this.log('Load Normal Map ' + normalsImages[0] + ' ok ...');
            },
            undefined,
            (aerr: ErrorEvent) => { console.error(aerr) }
        );
    }

    initializeHdrEnvMap() {
        if (this.options.useExrInsteadThanHdr) return;
        // Setup Background HDRS
        const hdrPath = "/assets/img/gltf/hdrs/";
        const hdrFiles = [
            'circus_maximus_2_2k.hdr',
            'industrial_workshop_foundry_1k.hdr',
            'peppermint_powerplant_2_1k.hdr',
            'piazza_martin_lutero_2k.hdr',
            'stone_alley_02_2k.hdr',
            'stone_pines_2k.hdr',
            'tiber_2_2k.hdr',
        ]
        const currentHDRIndex = Math.floor(Math.random() * hdrFiles.length);

        // Load HDR envMap scene Background
        if (this.hdrLoader == null) {
            this.hdrLoader = new RGBELoader();
        }
        const hdrFile = hdrPath + hdrFiles[currentHDRIndex]
        const _hdrLoaderResult = this.hdrLoader
            .load(hdrFile, (hdrMap) => {
                hdrMap.mapping = THREE.EquirectangularReflectionMapping;
                this.currEnv = hdrMap;
                this.scene!.background = hdrMap;

                if (this.options.useEnvMapInsteadThanLights) {
                    this.scene!.environment = hdrMap;
                }
                this.log('Load ' + hdrFiles[currentHDRIndex] + ' ok');
                // force re rendering the scene as soon as the envMap is loaded
                this.render();
            });
    }

    initializeExrEnvMap() {
        if (!this.options.useExrInsteadThanHdr) return;
        const exrPath = "/assets/img/gltf/exrs/";
        const exrFiles = [
            'abandoned_construction_2k.exr',
            'auto_service_2k.exr',
            'bank_vault_1k.exr',
            'canary_wharf_2k.exr',
            'empty_warehouse_01_1k.exr',
            'industrial_workshop_foundry_1k.exr',
            'machine_shop_01_2k.exr',
            'machine_shop_02_2k.exr',
            'neon_photostudio_1k.exr',
            'old_bus_depot_2k.exr',
            'paul_lobe_haus_2k.exr',
            'peppermint_powerplant_2_1k.exr',
            'peppermint_powerplant_2k.exr',
            'stone_alley_03_2k.exr',
            'unfinished_office_night_2k.exr',
            'urban_courtyard_02_2k.exr',
            'urban_courtyard_2k.exr',
            'urban_street_02_2k.exr',
        ]
        const currentExrIndex = Math.floor(Math.random() * exrFiles.length);
        const exrFile = exrPath + exrFiles[currentExrIndex];
        // Load Exr envMap scene Background
        if (this.exrLoader == null) {
            this.exrLoader = new EXRLoader();
        }
        //exrLoader.setPath(".");
        const _exrLoaderResult = this.exrLoader
            .load(exrFile, (exrMap) => {
                exrMap.mapping = THREE.EquirectangularReflectionMapping;
                this.currEnv = exrMap;
                this.scene!.background = exrMap;
                // If we set the environment the lights are overwritten
                if (this.options.useEnvMapInsteadThanLights) {
                    this.scene!.environment = exrMap;
                }
                this.log('Load ' + exrFiles[currentExrIndex] + ' ok');
                // force re rendering the scene as soon as the envMap is loaded
                this.render();
            });
    }

    initializeGui() {
        
    }

    initializeOrbitControls() {
        const controls = new OrbitControls(this.camera!, this.renderer!.domElement);
        controls.minDistance = 2;
        controls.maxDistance = 500;
        controls.target.set(0, 0, 0);
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = true;
        controls.maxPolarAngle = Math.PI / 2;
        controls.listenToKeyEvents(window); // optional
        controls.update();
        controls.addEventListener('change', (e) => { this.render() }); // use if there is no animation loop
        this.orbitControls = controls;
        this.log('Orbit controls ok ...');
    }

    init(
        awindow: IApgWglBrowserWindow,
        adocument: IApgWglDomDocument,
        agltfResource: string
    ) {
        this.window = awindow;
        this.document = adocument;
        this.setContainer();
        this.setupLogger();
        this.initializeRenderer();
        this.initializeCamera();
        this.initializeScene();
        this.initializeLights();
        this.initializeTextureLoader();
        this.initializeTextures();
        this.initializeBumpMaps();
        this.initializeNormalMaps();
        if (this.options.useExrInsteadThanHdr) {
            this.initializeExrEnvMap();
        } else {
            this.initializeHdrEnvMap();
        }
        this.initializeGui();
        this.initializeOrbitControls();
        this.loadGltf(agltfResource)
    }

    loadGltf(agltfResource: string) {

        // Gltf model
        const gltfLoader = new GLTFLoader();
        // gltfResource comes from the external script injected into the page
        const gltfLoaderResult = gltfLoader
            .load(agltfResource, (gltf) => {
                this.gltfResource = agltfResource;
                gltf.scene.name = agltfResource;
                this.log(agltfResource + ' ok');
                this.scene!.add(gltf.scene);
                this.gltf = gltf;
                this.setMaterials(gltf);
                this.render();
            });
    }

    setMaterials(agltf: GLTF) {
        agltf.scene.traverse((aGltfNode) => {
            if ((<any>aGltfNode).isMesh) {
                const mesh = aGltfNode as any;
                //console.log(aGltfNode.material.name);
                const materialAttributes = mesh.material.name.split('_');

                if (materialAttributes[0] == 'Textured') {
                    let textureIndex = +materialAttributes[1] - 1;
                    textureIndex = textureIndex % this.textureMaps.length;
                    mesh.material.map = this.textureMaps[textureIndex];
                    mesh.material.color = new THREE.Color(1, 1, 1);
                }
                else if (materialAttributes[0] == 'Bumped') {
                    let bumpIndex = +materialAttributes[1] - 1;
                    bumpIndex = bumpIndex % this.bumpMaps.length;
                    mesh.material.bumpMap = this.bumpMaps[bumpIndex];
                    mesh.material.bumpScale = 0.5; // depth of the bump effect
                }
                else if (materialAttributes[0] == 'Normaled') {
                    let normalIndex = +materialAttributes[1] - 1;
                    normalIndex = normalIndex % this.normalMaps.length;
                    mesh.material.normalMap = this.normalMaps[normalIndex];
                }

                const uvs = mesh.geometry.attributes.uv.array;
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
                mesh.material.needsUpdate = true;
                // console.log(aGltfNode.material);
                // console.log(aGltfNode.geometry);
            };
        });
        this.log('Scene materials ok');
    }

    resize() {
        this.camera!.aspect = this.aspect;
        this.camera!.updateProjectionMatrix();

        const newWidth = this.glDiv!.clientWidth;

        this.renderer!.setSize(
            newWidth,
            newWidth / this.aspect
        );

        this.render();
    }

    render() {
        this.renderer!.render(this.scene!, this.camera!);
    }
}