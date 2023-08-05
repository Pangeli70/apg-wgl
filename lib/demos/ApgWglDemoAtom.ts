import { THREE } from "../deps.ts";



enum eApgWglDemoAtomNames {
    NUCLEUS = "Nucleus",
    ELECTRON = "Electron"
}

interface IApgWglDemoAtomUserData {
    disclaimer: string;
    animationCallBack: string;
    pivot?: THREE.Group;
    protonsN: number,
    neutronsN: number,
    electronsN: number,
    electrons: IApgWglDemoAtomElectronUserData[];

}

interface IApgWglDemoAtomElectronUserData {
    orbit_r: number;
    orbit_speed: number;
    angle: number;
    name: string;
    obj?: THREE.Mesh;
}

export class ApgWgDemoAtom {

    userData: IApgWglDemoAtomUserData = {
        disclaimer: "Inspiration taken from https://codepen.io/frank890417/pen/zoaZvb",
        protonsN: 10,
        neutronsN: 10,
        electronsN: 10,
        electrons: [],
        animationCallBack: "",
    };


    init() {
        const scene = new THREE.Scene();

        scene.fog = new THREE.Fog(0x090b33, 5, 50)

        //renderer.shadowMap.enable = true;

        const group = new THREE.Group();
        group.name = eApgWglDemoAtomNames.NUCLEUS;
        scene.add(group);

        const radius = 2;
        const stepdiv = 4;
        let isProton = true;
        for (let angle1 = 0; angle1 < Math.PI * 2; angle1 += Math.PI / stepdiv) {
            for (let angle2 = 0; angle2 < Math.PI * 2; angle2 += Math.PI / stepdiv) {
                const layerRadius = Math.sin(angle1) * radius;

                const quarkColor = isProton ? 0xff0000 : 0x2e30d1;
                const quarkName = isProton ? 'proton' : 'neutron';
                this.#generateSphere(group, 0.9, new THREE.Color(quarkColor), quarkName,
                    layerRadius * Math.cos(angle2),
                    radius * Math.cos(angle1),
                    layerRadius * Math.sin(angle2));
                isProton = !isProton;
            }
            isProton = !isProton;
        }

        const electronsN = 10;
        for (let i = 0; i < electronsN; i++) {

            this.userData.electrons.push({
                orbit_r: 10,
                orbit_speed: 0.05,
                angle: Math.random() * Math.PI * 2,
                name: eApgWglDemoAtomNames.ELECTRON + i.toString()
            });
            this.#generateSphere(
                group,
                0.2,
                new THREE.Color(0xffffff),
                eApgWglDemoAtomNames.ELECTRON + i.toString());
        }

        this.userData.animationCallBack = this.animateCallBack.toString();
        scene.userData = this.userData;

        return scene;
    }

    #generateSphere(
        group: THREE.Group,
        r: number,
        color: THREE.Color,
        name: string,
        x = 0,
        y = 0,
        z = 0
    ) {
        const sphereGeometry = new THREE.SphereGeometry(r, 4, 4);
        const sphereMaterial = new THREE.MeshLambertMaterial({
            color: color,
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.name = name;
        sphere.position.set(x, y, z);
        group.add(sphere);
        return sphere;
    }

    animateCallBack() {
        const globalScope = (window as any);
        if (globalScope.firstExecution == undefined) {
            globalScope.firstExecution = true;

            const scene = globalScope.scene as THREE.Scene;
            globalScope.ctx = scene.userData as IApgWglDemoAtomUserData;

            globalScope.ctx.pivot = scene.getObjectByName(eApgWglDemoAtomNames.NUCLEUS) as THREE.Group;
            globalScope.ctx.el1!.obj = scene.getObjectByName(eApgWglDemoAtomNames.ELECTRON + "1") as THREE.Mesh;
            globalScope.ctx.el2!.obj = scene.getObjectByName(eApgWglDemoAtomNames.ELECTRON + "2") as THREE.Mesh;
            globalScope.ctx.el3!.obj = scene.getObjectByName(eApgWglDemoAtomNames.ELECTRON + "3") as THREE.Mesh;
        }

        const ctx = globalScope.ctx;

        ctx.el1.obj.position.x = ctx.el1.orbit_r * Math.cos(ctx.el1.angle);
        ctx.el1.obj.position.z = ctx.el1.orbit_r * Math.sin(ctx.el1.angle);
        ctx.el1.angle += ctx.el1.orbit_speed;

        ctx.el2.obj.position.y = ctx.el2.orbit_r * Math.cos(ctx.el2.angle);
        ctx.el2.obj.position.z = ctx.el2.orbit_r * Math.sin(ctx.el2.angle);
        ctx.el2.angle += ctx.el2.orbit_speed;

        ctx.el3.obj.position.x = ctx.el3.orbit_r * Math.cos(ctx.el3.angle);
        ctx.el3.obj.position.y = ctx.el3.orbit_r * Math.sin(ctx.el3.angle);
        ctx.el3.angle += ctx.el3.orbit_speed;

        ctx.pivot.rotation.y += 0.002;

    }
}
