
import * as THREE from "https://esm.sh/three@0.154.0";
import { OrbitControls } from "https://esm.sh/three@0.154.0/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "https://esm.sh/three@0.154.0/examples/jsm/loaders/RGBELoader.js";
import { EXRLoader } from "https://esm.sh/three@0.154.0/examples/jsm//loaders/EXRLoader.js";
import { GLTFLoader, GLTF } from "https://esm.sh/three@0.154.0/examples/jsm/loaders/GLTFLoader.js";
import { STLLoader } from "https://esm.sh/three@0.154.0/examples/jsm/loaders/STLLoader.js";

import { IApgWglBrowserWindow, IApgWglDomCanvas, IApgWglDomDocument, IApgWglDomElement, } from "./ApgWglGltfViewerInterfaces.ts"



export interface IApgWglGltfViewerOptions {

    worldSize: number;

    fogColor: number;
    fogMinDistance: number;
    fogMaxDistance: number;

    toneMapping: THREE.ToneMapping;
    toneMappingExposure: number;

    outputColorSpace: THREE.ColorSpace;

    shadowMapEnabled: true;
    shadowMapType: THREE.ShadowMapType;
    shadowMapRadious: number;
    shadowMapSize: number;

    clearColor: number;

    perspCameraFov: number;
    perspCameraNear: number;
    perspCameraFar: number;
    perspCameraPosition: THREE.Vector3;

    useEnvMapInsteadThanLights: boolean;

    ambLightColor: THREE.Color;
    ambLightIntensity: number;

    dirLightColor: THREE.Color;
    dirLightIntensity: number;
    dirLightPosition: THREE.Vector3;
    dirLightShadowMapCameraSize: number,
    dirLightShadowMapCameraNear: number,
    dirLightShadowMapCameraFar: number,

    orbControlsTarget: THREE.Vector3;
    orbControlsMinDistance: number;
    orbControlsMaxDistance: number;
    useExrInsteadThanHdr: boolean;
}

export class ApgWglGltfViewer {

    window: IApgWglBrowserWindow;
    document: IApgWglDomDocument;
    // Three renderer div container
    container: IApgWglDomElement;
    canvas: IApgWglDomCanvas | null = null;
    // string[]
    logger: string[] = [];
    // Ul logger container
    loggerUl: IApgWglDomElement | null = null;
    // Three renderer
    renderer: THREE.WebGLRenderer | null = null;
    // renderer aspect ratio
    aspect = 16 / 9;
    perspCamera: THREE.PerspectiveCamera | null = null;
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

    resourceName = "";

    gltf: GLTF | null = null;

    readonly EYE_HEIGHT = 1.65;
    readonly WORLD_SIZE = 2000; // 1 km radious!! 

    readonly APG_WGL_GLTF_VIEWER_OPTIONS_LOCAL_STORAGE_KEY = 'APG_WGL_GLTF_VIEWER_OPTIONS_LOCAL_STORAGE_KEY';

    readonly DEFAULT_OPTIONS: IApgWglGltfViewerOptions = {

        worldSize: this.WORLD_SIZE,

        fogColor: 0x888888,
        fogMinDistance: this.WORLD_SIZE / 2.5,
        fogMaxDistance: this.WORLD_SIZE / 2,

        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,

        outputColorSpace: THREE.SRGBColorSpace,

        shadowMapEnabled: true,
        shadowMapType: THREE.PCFSoftShadowMap,
        //shadowMapType: THREE.BasicShadowMap,
        shadowMapRadious: 4,
        shadowMapSize: 1024 * 4,

        clearColor: 0x000000,

        perspCameraFov: 45,
        perspCameraNear: 0.1, // 100mm
        perspCameraFar: this.WORLD_SIZE / 2,
        perspCameraPosition: new THREE.Vector3(0, this.EYE_HEIGHT, 5),

        useEnvMapInsteadThanLights: false,

        ambLightColor: new THREE.Color(0xffffff),
        ambLightIntensity: 0.4,

        dirLightColor: new THREE.Color(0xffffff),
        dirLightIntensity: 0.6,
        dirLightPosition: new THREE.Vector3(0, this.WORLD_SIZE / 2.1, this.WORLD_SIZE / 8),

        dirLightShadowMapCameraSize: this.WORLD_SIZE / 4,
        dirLightShadowMapCameraNear: this.WORLD_SIZE / 10,
        dirLightShadowMapCameraFar: this.WORLD_SIZE / 1.8,

        orbControlsTarget: new THREE.Vector3(0, 0, 0),
        orbControlsMinDistance: 0.1,
        orbControlsMaxDistance: this.WORLD_SIZE / 20,

        useExrInsteadThanHdr: Math.random() > 0.5
    }

    options: IApgWglGltfViewerOptions = { ...this.DEFAULT_OPTIONS };

    #log(atext: string) {

        this.logger.push(atext);

        const li = this.document!.createElement('li');
        this.loggerUl!.appendChild(li);

        const litxt = this.document!.createTextNode(atext);
        li.appendChild(litxt);
        console.log(atext);

    }

    #deltaTime(astart: number) {
        return (performance.now() - astart).toFixed(2) + 'ms';
    }

    #initLogger() {
        const start = performance.now();
        this.loggerUl = this.document!.createElement('ul');
        this.loggerUl.id = 'ApgWglGltfViewerLogger';
        this.container!.appendChild(this.loggerUl);
        this.#log(`Logging... ${(performance.now() - start).toFixed()}ms`);
    }

    #buildCanvas() {
        const start = performance.now();
        this.canvas = this.document!.createElement('canvas') as IApgWglDomCanvas;
        this.canvas.id = 'ApgWglGltfViewerCanvas';
        this.container.appendChild(this.canvas);
        this.#log(`Canvas built... ${this.#deltaTime(start)}`);
    }

    #initRenderer() {
        const start = performance.now();
        let msg = "reinitialized";
        let r = this.renderer;
        if (!r) {
            r = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas });
            msg = "initialized";
        }
        r.setPixelRatio(this.window.devicePixelRatio);
        //this.renderer.setSize(this.container.clientWidth, this.container!.clientHeight);
        r.setSize(this.window.innerWidth, this.window.innerHeight * 0.7);
        r.toneMapping = this.options.toneMapping;
        r.toneMappingExposure = this.options.toneMappingExposure;
        r.outputColorSpace = this.options.outputColorSpace;
        r.shadowMap.enabled = this.options.shadowMapEnabled;
        r.shadowMap.type = this.options.shadowMapType;
        //r.shadowMap.autoUpdate = true;
        r.setClearColor(this.options.clearColor);

        this.#log(`Renderer ${msg} ...${this.#deltaTime(start)}`);
        return r;
    }

    #initPerspectiveCamera() {
        const start = performance.now();
        let msg = "reinitialized";
        let r = this.perspCamera;
        if (!r) {
            r = new THREE.PerspectiveCamera();
            msg = "initialized";
        }
        r.fov = this.options.perspCameraFov;
        this.aspect = this.container!.clientWidth / this.container!.clientHeight;
        r.aspect = this.aspect;
        r.near = this.options.perspCameraNear;
        r.far = this.options.perspCameraFar;
        r.position.set(
            this.options.perspCameraPosition.x,
            this.options.perspCameraPosition.y,
            this.options.perspCameraPosition.z);
        r.updateProjectionMatrix();
        this.#log(`Perspective camera ${msg} ...${this.#deltaTime(start)}`);
        return r;
    }

    #initScene() {
        const start = performance.now();
        const r = new THREE.Scene();
        r.fog = new THREE.Fog(
            this.options.fogColor,
            this.options.fogMinDistance,
            this.options.fogMaxDistance
        );
        this.#log(`Scene built ...${this.#deltaTime(start)}`);
        return r;
    }

    #initPlane() {
        const background = new THREE.Mesh(
            new THREE.CircleGeometry(this.options.worldSize * 2, 100),
            new THREE.MeshPhongMaterial({
                color: 0x888888,
            }));
        background.rotation.x = -(Math.PI / 2);
        background.position.y = - 1;
        this.scene!.add(background);

        const plane = new THREE.Mesh(
            new THREE.CircleGeometry(this.options.worldSize / 2, 100),
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
            }));
        plane.rotation.x = -(Math.PI / 2);
        plane.position.y = -0.01;
        plane.receiveShadow = true;
        // add the box mesh to the scene
        this.scene!.add(plane);
        this.#log('Plane ok ...');
    }

    #initLights() {
        const start = performance.now();
        let isNew = false;
        let msg = "reinitialized";
        if (!this.ambientLight) {
            this.ambientLight = new THREE.AmbientLight()
            msg = "initialized";
            isNew = true;
        }
        this.ambientLight.color = this.options.ambLightColor;
        this.ambientLight.intensity = this.options.ambLightIntensity;
        if (this.options.useEnvMapInsteadThanLights) {
            this.ambientLight.visible = false;
        }
        if (isNew) {
            this.scene!.add(this.ambientLight);
        }
        this.#log(`Ambient light ${msg} ...${this.#deltaTime(start)}`);

        isNew = false;
        msg = "reinitialized";
        if (!this.directionalLight) {
            this.directionalLight = new THREE.DirectionalLight()
            msg = "initialized";
            isNew = true;
        }
        this.directionalLight.color = this.options.dirLightColor;
        this.directionalLight.intensity = this.options.dirLightIntensity;

        this.directionalLight.position.set(
            this.options.dirLightPosition.x,
            this.options.dirLightPosition.y,
            this.options.dirLightPosition.z);

        if (this.options.shadowMapEnabled) {
            this.directionalLight.castShadow = true;
            this.directionalLight.shadow.radius = this.options.shadowMapRadious;
            this.directionalLight.shadow.mapSize.width = this.options.shadowMapSize;
            this.directionalLight.shadow.mapSize.height = this.options.shadowMapSize;
            this.directionalLight.shadow.camera.top = this.options.dirLightShadowMapCameraSize;
            this.directionalLight.shadow.camera.right = this.options.dirLightShadowMapCameraSize;
            this.directionalLight.shadow.camera.bottom = -this.options.dirLightShadowMapCameraSize;
            this.directionalLight.shadow.camera.left = -this.options.dirLightShadowMapCameraSize;
            this.directionalLight.shadow.camera.near = this.options.dirLightShadowMapCameraNear;
            this.directionalLight.shadow.camera.far = this.options.dirLightShadowMapCameraFar;
            //this.directionalLight.shadow.bias = -0.001;
            this.directionalLight.shadow.bias = -0.0001;
            //this.directionalLight.shadow.normalBias = 0.3;

            const directionalLightShadowCameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
            this.scene!.add(directionalLightShadowCameraHelper);
        }

        this.directionalLight.visible = !this.options.useEnvMapInsteadThanLights;

        if (isNew) {
            this.scene!.add(this.directionalLight);
        }

        this.#log(`Directional light ${msg} ...${this.#deltaTime(start)}`);

    }

    #initTextureLoader() {
        const start = performance.now();
        this.textureLoader = new THREE.TextureLoader();
        this.textureLoader.crossOrigin = '';
        this.textureLoader.setCrossOrigin("anonymous"); // TODO ??
        this.#log(`Texture loader built ...${this.#deltaTime(start)}`);
    }

    #initTextures() {
        const texturesPath = '/assets/img/gltf/maps/'
        const textureImages = [
            'Wood_01_1024x512.png',
            'Wood_02_1024x512.png',
            'Wood_03_1024x512.png',
            'Wood_04_1024x512.png',
            'Wood_05_512x512.png',
            'Micaceous_01_512x512.png',
        ]

        // since those are loaded asycronously we must refer to them by index
        // and so we must preload empty objects
        this.textureMaps = [null, null, null, null, null, null,];
        const starts: number[] = [];
        // Load texture Maps
        for (let i = 0; i < textureImages.length; i++) {
            starts.push(performance.now());
            const textureFile = texturesPath + textureImages[i];
            const resolution = +textureImages[i].split("_")[2].split("x")[0];
            this.textureLoader!.load(
                textureFile,
                (atexture: THREE.Texture) => {

                    atexture.colorSpace = THREE.SRGBColorSpace;
                    atexture.flipY = false;
                    atexture.wrapS = THREE.RepeatWrapping;
                    // atexture.repeat.x = 4;
                    atexture.wrapT = THREE.RepeatWrapping;
                    // atexture.repeat.y = 4;
                    this.textureMaps[i] = atexture;
                    this.#log(`Loaded texture (${textureImages[i]}) ...${this.#deltaTime(starts[i])}`);

                    if (i == 1) {
                        // Create textured Box stub to check if textures and shadows are working
                        const stubBackground = new THREE.Mesh(
                            new THREE.BoxGeometry(1.024, 0.512, 1.024),
                            new THREE.MeshPhongMaterial({
                                color: 0xFFFFFF,
                                map: atexture
                            }));
                        stubBackground.position.y = 0.256;
                        stubBackground.castShadow = true;
                        stubBackground.receiveShadow = true;
                        // add the box mesh to the scene
                        this.scene!.add(stubBackground);
                        this.#log('Stub ok ...');
                    }
                },
                undefined, // progress callback
                (aerr: ErrorEvent) => { console.error(aerr) } // error callback
            );

        }
    }

    #initBumpMaps() {
        const bumpsPath = '/assets/img/gltf/bumps/'
        const bumpImages = [
            '01_stucco.png',
        ]

        this.bumpMaps = [null,];
        const starts: number[] = [];
        starts.push(performance.now())
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
                this.#log(`Loaded bump map (${bumpImages[0]}) ...${this.#deltaTime(starts[0])}`);

            },
            undefined,
            (aerr: ErrorEvent) => { console.error(aerr) }
        );
    }

    #initNormalMaps() {
        const normalsPath = '/assets/img/gltf/normals'
        const normalsImages = [
            '/01_woodgrain.png',
        ]
        this.normalMaps = [null,];
        const starts: number[] = [];
        starts.push(performance.now());
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
                this.#log(`Loaded Normal map (${normalsImages[0]}) ...${this.#deltaTime(starts[0])}`);
            },
            undefined,
            (aerr: ErrorEvent) => { console.error(aerr) }
        );
    }

    initHdrEnvMap() {
        if (this.options.useExrInsteadThanHdr) return;
        // Setup Background HDRS
        const hdrPath = "/assets/img/gltf/hdrs/";
        const hdrFiles = [
            'aristea_wreck_puresky_2k.hdr',
            'autumn_park_2k.hdr',
            'circus_maximus_2_2k.hdr',
            'drakensberg_solitary_mountain_puresky_2k.hdr',
            'eilenriede_park_2k.hdr',
            'green_point_park_2k.hdr',
            'industrial_workshop_foundry_1k.hdr',
            'kloofendal_43d_clear_puresky_2k.hdr',
            'kloofendal_48d_partly_cloudy_puresky_2k.hdr',
            'lilienstein_2k.hdr',
            'noon_grass_2k.hdr',
            'peppermint_powerplant_2_1k.hdr',
            'piazza_martin_lutero_2k.hdr',
            'residential_garden_2k.hdr',
            'stone_alley_02_2k.hdr',
            'stone_pines_2k.hdr',
            'sunflowers_puresky_2k.hdr',
            'tiber_2_2k.hdr',
            'tiergarten_2k.hdr'
        ]
        const currentHDRIndex = Math.floor(Math.random() * hdrFiles.length);

        // Load HDR envMap scene Background
        if (this.hdrLoader == null) {
            this.hdrLoader = new RGBELoader();
        }
        const hdrFile = hdrPath + hdrFiles[currentHDRIndex];
        const starts: number[] = [];
        starts.push(performance.now());
        const _hdrLoaderResult = this.hdrLoader
            .load(hdrFile, (hdrMap) => {
                hdrMap.mapping = THREE.EquirectangularReflectionMapping;
                this.currEnv = hdrMap;
                this.scene!.background = hdrMap;

                if (this.options.useEnvMapInsteadThanLights) {
                    this.scene!.environment = hdrMap;
                }
                this.#log(`Loaded hdr map (${hdrFiles[currentHDRIndex]}) ...${this.#deltaTime(starts[0])}`);
                // force re rendering the scene as soon as the envMap is loaded
                this.render();
            });
    }

    initExrEnvMap() {
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
        if (this.exrLoader == null) {
            this.exrLoader = new EXRLoader();
        }
        const currentExrIndex = Math.floor(Math.random() * exrFiles.length);
        const exrFile = exrPath + exrFiles[currentExrIndex];
        const starts: number[] = [];
        starts.push(performance.now());

        // Load Exr envMap scene Background
        const _exrLoaderResult = this.exrLoader
            .load(exrFile, (exrMap) => {
                exrMap.mapping = THREE.EquirectangularReflectionMapping;
                this.currEnv = exrMap;
                this.scene!.background = exrMap;
                // If we set the environment the lights are overwritten
                if (this.options.useEnvMapInsteadThanLights) {
                    this.scene!.environment = exrMap;
                }
                this.#log(`Loaded exr map (${exrFiles[currentExrIndex]}) ...${this.#deltaTime(starts[0])}`);
                // force re rendering the scene as soon as the envMap is loaded
                this.render();
            });
    }

    #initOrbitControls() {
        const start = performance.now();
        let msg = "reinitialized";
        if (!this.orbitControls) {
            this.orbitControls = new OrbitControls(this.perspCamera!, this.renderer!.domElement);
            msg = "initialized";
        }
        this.orbitControls.minDistance = this.options.orbControlsMinDistance;
        this.orbitControls.maxDistance = this.options.orbControlsMaxDistance;
        this.orbitControls.target.set(
            this.options.orbControlsTarget.x,
            this.options.orbControlsTarget.y,
            this.options.orbControlsTarget.z,
        );
        this.orbitControls.maxPolarAngle = Math.PI;
        this.orbitControls.minPolarAngle = Math.PI / 4;
        this.orbitControls.update();

        //controls.addEventListener('change', (e) => { this.render() }); // use if there is no animation loop
        this.#log(`Orbit controls ${msg} ...${this.#deltaTime(start)}`);

    }

    #loadGltfSceneFromResource(agltfResource: string) {

        const start = performance.now();
        const gltfLoader = new GLTFLoader();
        // gltfResource comes from the external script injected into the page
        gltfLoader.load(agltfResource, (gltf) => {
            
            this.resourceName = agltfResource;
            gltf.scene.name = agltfResource;
            this.#upgradeGltfMaterialsWithTextures(gltf);
            this.#setGltfUvCubeMapping(gltf);
            this.scene!.add(gltf.scene);
            this.gltf = gltf;
            this.#log(`Loaded Gltf (${agltfResource}) ...${this.#deltaTime(start)}`);
            // force re rendering the scene as soon as the GLTF is loaded
            this.render();
        });
    }

    #loadStlSceneFromResource(astlResource: string) {

        const start = performance.now();
        const stlLoader = new STLLoader();
        // gltfResource comes from the external script injected into the page
        stlLoader.load(astlResource, (stlGeometry) => {

            stlGeometry.computeBoundingBox();
            const boundingBox = stlGeometry.boundingBox;
            const size = new THREE.Vector3();
            boundingBox!.getSize(size);
            const max = size.x > size.y ?
                (size.x > size.z ? size.x : size.z) :
                (size.y > size.z ? size.y : size.z);
            stlGeometry.scale(1 / max, 1 / max, 1 / max)

            this.resourceName = astlResource;

            const material = new THREE.MeshPhongMaterial({ color: 0xff9c7c, specular: 0x494949, shininess: 200 });
            const stlMesh = new THREE.Mesh(stlGeometry, material);


            stlMesh.castShadow = true;
            stlMesh.receiveShadow = true;
            stlMesh.name = astlResource;

            this.scene!.add(stlMesh);

            this.#log(`Loaded Glb (${astlResource}) ...${this.#deltaTime(start)}`);

            // force re rendering the scene as soon as the GLB is loaded
            this.render();
        });
    }

    #loadGlbSceneFromResource(aglbResource: string) {

        const start = performance.now();
        const gltfLoader = new GLTFLoader();
        // gltfResource comes from the external script injected into the page
        gltfLoader.load(aglbResource, (glb) => {
            this.resourceName = aglbResource;
            glb.scene.name = aglbResource;

            this.#upgradeGltfMaterialsWithTextures(glb);
            this.#setGltfUvCubeMapping(glb);

            this.scene!.add(glb.scene);

            this.gltf = glb;
            this.#log(`Loaded Glb (${aglbResource}) ...${this.#deltaTime(start)}`);
            // force re rendering the scene as soon as the GLTF is loaded
            this.render();
        });
    }

    #upgradeGltfMaterialsWithTextures(agltf: GLTF) {
        agltf.scene.traverse((aGltfNode) => {
            if (aGltfNode instanceof THREE.Mesh && aGltfNode.isMesh) {

                const mesh = aGltfNode as THREE.Mesh;
                mesh.geometry.scale(0.01, 0.01, 0.01);

                mesh.castShadow = true;
                mesh.receiveShadow = true;

                //console.log(aGltfNode.material.name);
                const meshMaterials = (!Array.isArray(mesh.material)) ? [mesh.material] : mesh.material;
                for (const m of meshMaterials) {
                    const material = m as THREE.MeshPhongMaterial;
                    const materialAttributes = material.name.split('_');
                    // TODO use user data instead than attributes gathered from material name --APG 20230731
                    if (materialAttributes[1] == 'Textured') {
                        let textureIndex = +materialAttributes[2] - 1;
                        textureIndex = textureIndex % this.textureMaps.length;
                        material.map = this.textureMaps[textureIndex];
                        //material.color = new THREE.Color(1, 1, 1);
                        material.needsUpdate = true;
                    }
                    else if (materialAttributes[1] == 'BumpMapped') {
                        let bumpIndex = +materialAttributes[2] - 1;
                        bumpIndex = bumpIndex % this.bumpMaps.length;
                        material.bumpMap = this.bumpMaps[bumpIndex];
                        material.bumpScale = 0.5; // depth of the bump effect
                        material.needsUpdate = true;
                    }
                    else if (materialAttributes[1] == 'NormalMapped') {
                        let normalIndex = +materialAttributes[2] - 1;
                        normalIndex = normalIndex % this.normalMaps.length;
                        material.normalMap = this.normalMaps[normalIndex];
                        material.needsUpdate = true;
                    }

                }
            }
        });
        this.#log('GLTF/GLB materials upgraded');
    }

    #setGltfUvCubeMapping(agltf: GLTF) {
        agltf.scene.traverse((aGltfNode) => {
            if (aGltfNode instanceof THREE.Mesh && aGltfNode.isMesh) {

                const mesh = aGltfNode as THREE.Mesh;

                // GLBs or STLs converted files might not have UVs
                if (!mesh.geometry.attributes.uv) {
                    const uvs: number[] = [];
                    const count = mesh.geometry.attributes.position.array.length / 3 * 2;
                    for (let i = 0; i < count; i++) {
                        uvs.push(0);
                    }
                    mesh.geometry.attributes.uv = new THREE.BufferAttribute(new Float32Array(uvs), 2, false)
                }

                const uvs = mesh.geometry.attributes.uv.array;

                // GLBs or STLs converted files might not have normals
                mesh.geometry.computeVertexNormals();
                const normals = mesh.geometry.attributes.normal.array;
                const vertexes = mesh.geometry.attributes.position.array;

                let j = 0;
                for (let i = 0; i < normals.length; i += 3) {
                    const nx = Math.abs(normals[i]);
                    const ny = Math.abs(normals[i + 1]);
                    const nz = Math.abs(normals[i + 2]);

                    // xz mapping
                    if (ny > nx && ny > nz) {
                        uvs[j] = vertexes[i + 0];
                        uvs[j + 1] = vertexes[i + 2];
                    }
                    // zy mapping
                    else if (nx > ny && nx > nz) {
                        uvs[j] = vertexes[i + 2];
                        uvs[j + 1] = vertexes[i + 1];
                    }
                    // xy mapping
                    else {
                        uvs[j] = vertexes[i + 0];
                        uvs[j + 1] = vertexes[i + 1];
                    }
                    j += 2;
                }
            }
        });
        this.#log('GLTF/GLB Uvs ok');
    }

    constructor(
        awindow: IApgWglBrowserWindow,
        adocument: IApgWglDomDocument,
        asceneResource: string
    ) {
        this.window = awindow;
        this.document = adocument;
        this.container = this.document!.getElementById('ApgWglGltfViewerContainer');

        this.#initLogger();
        this.#buildCanvas();
        this.renderer = this.#initRenderer();
        this.perspCamera = this.#initPerspectiveCamera();
        this.scene = this.#initScene();
        this.#initLights();
        this.#initTextureLoader();
        this.#initTextures();
        this.#initBumpMaps();
        this.#initNormalMaps();
        if (this.options.useExrInsteadThanHdr) {
            this.initExrEnvMap();
        } else {
            this.initHdrEnvMap();
        }
        this.#initOrbitControls();

        this.#initPlane();
        this.loadSceneFromResource(asceneResource);
    }

    loadSceneFromResource(asceneResource: string) {
        if (asceneResource.indexOf('.glb') != -1) {
            this.#loadGlbSceneFromResource(asceneResource);
        }
        else {
            this.#loadGltfSceneFromResource(asceneResource);
        }
    }

    loadOptionsFromLocalStorage() {
        const options = this.window!.localStorage.getItem(this.APG_WGL_GLTF_VIEWER_OPTIONS_LOCAL_STORAGE_KEY) as IApgWglGltfViewerOptions;
        if (options) {
            this.options = { ...options }
        }
    }

    #saveOptionsToLocalStorage() {
        this.window!.localStorage.setItem(
            this.APG_WGL_GLTF_VIEWER_OPTIONS_LOCAL_STORAGE_KEY,
            this.options
        );
    }

    resetOptions() {
        this.options = { ...this.DEFAULT_OPTIONS };
        this.#saveOptionsToLocalStorage();
        this.#initRenderer();
        this.#initPerspectiveCamera();
        this.#initLights();
    }

    updateLights() {
        this.#initLights();
        this.#saveOptionsToLocalStorage();
    }

    resize() {
        this.#initRenderer();
        this.#initPerspectiveCamera();
        this.render();
    }

    render() {
        this.renderer!.render(this.scene!, this.perspCamera!);
    }
}