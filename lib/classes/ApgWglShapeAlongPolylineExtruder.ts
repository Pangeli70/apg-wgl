
import { THREE } from "../deps.ts";


export class G {

    shape: THREE.Shape;
    path: THREE.Vector2[];
    pathClosed: boolean;
    openEnded: boolean;

    indices?: Uint32Array;
    positions?: Float32Array;

    constructor(
        shape: THREE.Shape,
        path: THREE.Vector2[],
        pathClosed: boolean,
        openEnded: boolean
    ) {

        this.shape = shape;
        this.path = path;

        this.pathClosed = pathClosed;
        this.openEnded = pathClosed === true ? false : openEnded;

    }


    ExtrudeShapeAlongPath() {
        // This fills the shape with the triangles and will be useful to be used as the first cap
        const shapeGeometry = new THREE.ShapeGeometry(this.shape);

        // This will be eventually used for the last cap
        const flippedShapeGeometry = this.flipShapeGeometry(shapeGeometry);

        // Rotate 90° ?? Orient shape on x-z plane
        shapeGeometry.rotateX(Math.PI * 0.5);

        // extract points as triplets
        const profilePointsAsTriplets = shapeGeometry.attributes.position;

        // Maybe 1 ?? do we need 2 additional profiles??
        const addEnds = this.openEnded === false ? 2 : 0;

        // add space for eventual endprofiles
        const allExtrudedPointsAsTriplets = new Float32Array(profilePointsAsTriplets.count * (this.path.length + addEnds) * 3);

        const endProfiles = [];

        /* Compute triangles vertices
        ------------------------------------------------------------------------
        */

        for (let i = 0; i < this.path.length; i++) {
            const point1 = this.path[i - 1 < 0 ? this.path.length - 1 : i - 1];
            const v1 = new THREE.Vector2().subVectors(point1, this.path[i]);
            const point2 = this.path[i + 1 == this.path.length ? 0 : i + 1]
            const v2 = new THREE.Vector2().subVectors(point2, this.path[i]);
            const angle = v2.angle() - v1.angle();
            const halfAngle = angle * 0.5;

            let hA = halfAngle;
            let tA = v2.angle() + Math.PI * 0.5;// +90°
            if (!this.pathClosed) {
                if (i == 0 || i == this.path.length - 1) {
                    hA = Math.PI * 0.5;
                }
                if (i == this.path.length - 1) {
                    tA = v1.angle() - Math.PI * 0.5;
                }
            }

            const shift = Math.tan(hA - Math.PI * 0.5);
            const shiftMatrix = new THREE.Matrix4().set(
                1, 0, 0, 0,
                -shift, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );

            const tempAngle = tA;
            const rotationMatrix = new THREE.Matrix4().set(
                Math.cos(tempAngle), -Math.sin(tempAngle), 0, 0,
                Math.sin(tempAngle), Math.cos(tempAngle), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );

            const translationMatrix = new THREE.Matrix4().set(
                1, 0, 0, this.path[i].x,
                0, 1, 0, this.path[i].y,
                0, 0, 1, 0,
                0, 0, 0, 1,
            );

            const clonedProfile = profilePointsAsTriplets.clone();
            clonedProfile.applyMatrix4(shiftMatrix);
            clonedProfile.applyMatrix4(rotationMatrix);
            clonedProfile.applyMatrix4(translationMatrix)

            allExtrudedPointsAsTriplets.set(clonedProfile.array, clonedProfile.count * i * 3);

            if (this.openEnded === false && (i === 0 || i === this.path.length - 1)) {
                endProfiles.push(clonedProfile);
            }
        }

        endProfiles.forEach((ep, idx) => {
            // adds at 0 and at last
            allExtrudedPointsAsTriplets.set(ep.array, ep.count * (this.path.length + idx) * 3)
        });

        const fullProfileGeometry = new THREE.BufferGeometry();
        fullProfileGeometry.setAttribute("position", new THREE.BufferAttribute(allExtrudedPointsAsTriplets, 3));

        /* Compute triangle indexes 
        ------------------------------------------------------------------------
        */
        const indexesAsTriplets = [];

        const lastPathIndex = this.pathClosed == false ? this.path.length - 1 : this.path.length;
        for (let i = 0; i < lastPathIndex; i++) {
            for (let j = 0; j < profilePointsAsTriplets.count; j++) {
                const currCorner = i;
                const nextCorner = i + 1 == this.path.length ? 0 : i + 1;
                const currPoint = j;
                const nextPoint = j + 1 == profilePointsAsTriplets.count ? 0 : j + 1;

                const a = nextPoint + profilePointsAsTriplets.count * currCorner;
                const b = currPoint + profilePointsAsTriplets.count * currCorner;
                const c = currPoint + profilePointsAsTriplets.count * nextCorner;
                const d = nextPoint + profilePointsAsTriplets.count * nextCorner;


                indexesAsTriplets.push(a, b, d);
                indexesAsTriplets.push(b, c, d);
            }
        }

        if (this.openEnded === false) {
            // add indices from profile geometries

            let indexes = flippedShapeGeometry.attributes.index;
            let displacement = profilePointsAsTriplets.count * (this.path.length);
            for (let i = 0; i < indexes.count; i += 3) {
                const j = i + displacement;
                const a = indexes.getX(j);
                const b = indexes.getY(j);
                const c = indexes.getZ(j);
                indexesAsTriplets.push(a,b,c);
            }
            indexes = shapeGeometry.attributes.index;
            displacement = profilePointsAsTriplets.count * (this.path.length);
            for (let i = 0; i < indexes.count; i += 3) {
                const j = i + displacement;
                const a = indexes.getX(j);
                const b = indexes.getY(j);
                const c = indexes.getZ(j);
                indexesAsTriplets.push(a, b, c);
            }

        }

        fullProfileGeometry.setIndex(indexesAsTriplets);
        fullProfileGeometry.computeVertexNormals();

        return fullProfileGeometry;
    }

    flipShapeGeometry(shapeGeometry: THREE.ShapeGeometry) {
        const r = shapeGeometry.clone();
        const positions = r.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const v = positions.getZ(i) * -1;
            positions.setZ(i, v);
        }
        r.attributes.position.needsUpdate = true;

        const indexes = r.attributes.index;
        for (let i = 0; i < indexes.count; i += 3) {
            const y = indexes.getY(i);
            const z = indexes.getZ(i);
            indexes.setY(i, z);
            indexes.setZ(i, y);
        }
        r.computeVertexNormals();
        return r;
    }

}