// deno-lint-ignore-file no-explicit-any
/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/14-2022/06/05]
 * -----------------------------------------------------------------------
 */

import { A2D, THREE } from "../deps.ts";
import { IApgWglPolylineExtrusionSettings } from "../interfaces/IApgWglPolylineExtrusionSettings.ts";

import { ApgWglProfileHelper } from './ApgWglProfileHelper.ts'
import { ApgWglShapeHelper } from './ApgWglShapeHelper.ts'


export class ApgWglExtrusionHelper {


  public static randomShape_Extrusion_Along_ClosedSpline() {
    const edges = Math.round(Math.random() * 9) + 6; // always even
    const steps = edges * 20; // more edges more steps
    const closedSpline = ApgWglProfileHelper.getRandomizedStarShapeSplineProfile(edges);

    const extrudeSettings = {
      steps: steps,
      bevelEnabled: false,
      extrudePath: closedSpline
    };
    const shapePoints = (Math.random() > 0.5) ?
      ApgWglShapeHelper.getRandomStar(30, 25) :
      ApgWglShapeHelper.getRandomPoligon(20);
    const shape = new THREE.Shape(shapePoints);

    const r = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return r;
  }


  public static randomShape_Extrusion_Along_OpenedSpline() {
    const openedSpline = ApgWglProfileHelper.getRandomizedLineSplineProfile();
    const extrudeSettings = {
      steps: 100,
      bevelEnabled: false,
      extrudePath: openedSpline
    };
    const shapePoints = (Math.random() > 0.5) ?
      ApgWglShapeHelper.getRandomStar(30, 20) :
      ApgWglShapeHelper.getRandomPoligon(20);
    const shape = new THREE.Shape(shapePoints);

    const r = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return r;
  }




  public static randomShape_Extrusion_Along_PolyLine_Generators(
    aoptions: IApgWglPolylineExtrusionSettings
  ) {

    const polyLine = ApgWglProfileHelper.getRandomizedXYPolyline(
      aoptions.nodes,
      aoptions.segmentLength,
      aoptions.maxAngleDeg
    );
    const shapePoints = (Math.random() > 0.5) ?
      ApgWglShapeHelper.getRandomStar(30, 25, 3, 4) :
      ApgWglShapeHelper.getRandomPoligon(30, 3, 4);
    const shape = new THREE.Shape(shapePoints);

    return { shape, polyLine };
  }


  public static randomShape_Extrusion_Along_PolyLine(
    agenerators: { shape: THREE.Shape, polyLine: THREE.Vector2[] },
    aoptions: IApgWglPolylineExtrusionSettings
  ) {
    const r = this._polyLineExtrusion(
      agenerators.shape,
      agenerators.polyLine,
      aoptions.capped,
      aoptions.closed
    );
    return r;
  }

  public static randomShape_Extrusion_Along_PolyLine_Generators_Geometry(
    agenerators: { shape: THREE.Shape, polyLine: THREE.Vector2[] }
  ) {
    const r = this._polyLineExtrusionGeneratorsGeometry(agenerators.shape, agenerators.polyLine);
    return r;
  }


  public static randomShape_Extrusion_Along_Line() {

    const extrudeSettings = {
      depth: 20,
      steps: 5,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 4,
      bevelSegments: 1
    };
    const shapePoints = (Math.random() > 0.5) ?
      ApgWglShapeHelper.getRandomStar(30, 10) :
      ApgWglShapeHelper.getRandomPoligon(20);

    const shape = new THREE.Shape(shapePoints);

    const r = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return r;
  }


  private static _log(alog: string[], atext: string, anum: number, aradToDeg = false) {
    const num = aradToDeg ? A2D.Apg2DUtility.RadToDeg(anum) : anum;
    const entry = atext + ":" + num.toString();
    alog.push(entry);
  }


  private static _applyMatrix(avector: THREE.Vector3, amatrix: THREE.Matrix4) {
    const x = avector.x;
    const y = avector.y;
    const z = avector.z;
    const m = amatrix.elements;

    const s = 1 / (m[3] * x + m[7] * y + m[11] * z + m[15]);

    avector.x = (m[0] * x + m[4] * y + m[8] * z + m[12]) * s;
    avector.y = (m[1] * x + m[5] * y + m[9] * z + m[13]) * s;
    avector.z = (m[2] * x + m[6] * y + m[10] * z + m[14]) * s;

    return avector;
  }


  private static _polyLineExtrusion(
    aprofileShape: THREE.Shape,
    aextrusionPath: THREE.Vector2[],
    apathCapped = false,
    apathClosed = false
  ) {

    const rad90 = Math.PI / 2;
    const log: string[] = [];

    apathCapped = apathClosed === true ? false : apathCapped;

    // ProfileShape is on X-Y plane
    const profileGeometry = new THREE.ShapeGeometry(aprofileShape);

    // Transpose profile on plane X-Z
    profileGeometry.rotateX(rad90);
    const profile = profileGeometry.getAttribute('position');
    // for (let i = 0; i < profile.array.length; i += 3) {
    //   const y = profile.array[i + 1];
    //   profile.array[i + 1] = profile.array[i + 2]; //y=z
    //   profile.array[i + 2] = y; //z=y
    // }
    const addCaps = apathCapped === true ? 2 : 0;
    const extrusionPoints = new Float32Array(profile.count * (aextrusionPath.length + addCaps) * 3);

    const lastI = aextrusionPath.length - 1;
    const capProfiles = [];

    for (let i = 0; i < aextrusionPath.length; i++) {

      const prevIndex = (i - 1 < 0) ? lastI : i - 1;
      this._log(log, "PrevPathIndex", prevIndex);
      const a = aextrusionPath[prevIndex];

      this._log(log, "CurrPathIndex", i);
      const b = aextrusionPath[i];

      const nextIndex = (i + 1 == aextrusionPath.length) ? 0 : i + 1;
      this._log(log, "NextPathIndex", nextIndex);
      const c = aextrusionPath[nextIndex];

      const v1 = new THREE.Vector2().subVectors(a, b);
      const v2 = new THREE.Vector2().subVectors(c, b);

      const angle = v2.angle() - v1.angle();
      this._log(log, "Angle", angle, true);

      let halfAngle = angle / 2;
      let rotationAngle = v2.angle() + rad90;

      if (!apathClosed) {
        if (i == 0 || i == lastI) {
          halfAngle = rad90
        }
        if (i == lastI) {
          rotationAngle = v1.angle() - rad90;
        }
      }
      this._log(log, "HalfAngle", halfAngle, true);
      this._log(log, "RotatAngle", rotationAngle, true);

      const shearAngle = halfAngle - rad90;
      const shear = Math.tan(shearAngle);
      this._log(log, "ShearAngle", shearAngle, true);
      this._log(log, "XShear", shear);

      const shearMatrix = new THREE.Matrix4().set(
        1, 0, 0, 0,
        -shear, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );

      const zRotationMatrix = new THREE.Matrix4().set(
        Math.cos(rotationAngle), -Math.sin(rotationAngle), 0, 0,
        Math.sin(rotationAngle), Math.cos(rotationAngle), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );

      const translationMatrix = new THREE.Matrix4().set(
        1, 0, 0, aextrusionPath[i].x,
        0, 1, 0, aextrusionPath[i].y,
        0, 0, 1, 0,
        0, 0, 0, 1,
      );

      const clonedProfile = profile.clone();

      let transfMatrix = new THREE.Matrix4().multiplyMatrices(shearMatrix, zRotationMatrix);
      transfMatrix = new THREE.Matrix4().multiplyMatrices(transfMatrix, translationMatrix);
      //transfMatrix = translationMatrix;
      //this._applyTrasnformationMatrix(clonedProfile, transfMatrix);

      clonedProfile.applyMatrix4(shearMatrix);
      clonedProfile.applyMatrix4(zRotationMatrix);
      clonedProfile.applyMatrix4(translationMatrix);

      const offset = clonedProfile.count * i * 3;
      extrusionPoints.set(clonedProfile.array, offset);

      if (apathCapped === true) {
        if (i === 0 || i === lastI) {
          capProfiles.push(clonedProfile);
        }
      }
    }

    // Add a further copy of the base and top profiles
    // TODO is it necessary? We could reuse the already in place profiles 
    capProfiles.forEach((aprofile, idx) => {
      const offset = aprofile.count * (aextrusionPath.length + idx) * 3
      extrusionPoints.set(aprofile.array, offset)
    });


    const fullProfileGeometry = new THREE.BufferGeometry();
    fullProfileGeometry.setAttribute("position", new THREE.BufferAttribute(extrusionPoints, 3));

    const triangleIndexes = this._getTriangleIndexesForExtrusion(aextrusionPath, profile.count, apathClosed);

    if (apathCapped === true) {
      // add indices from profile geometries
      this._copyIndexesFromShapeCaps(
        profileGeometry,
        profile.count,
        aextrusionPath.length,
        triangleIndexes
      );
    }

    fullProfileGeometry.setIndex(triangleIndexes);
    fullProfileGeometry.computeVertexNormals();

    const uvs: number[] = [];
    uvs.length = 2 * extrusionPoints.length / 3;
    fullProfileGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    return fullProfileGeometry;
  }

  private static _copyIndexesFromShapeCaps(
    profileGeometry: THREE.ShapeGeometry,
    aprofileNodes: number,
    apathLenght: number,
    aindexBuffer: number[]
  ) {
    // Base cap
    const flippedProfileGeometry = this._flipShapeProfileGeometry(profileGeometry);
    flippedProfileGeometry.index?.array.forEach((index: number) => {
      const offset = aprofileNodes * apathLenght;
      aindexBuffer.push(offset + index);
    });
    // Top Cap
    profileGeometry.index?.array.forEach((index: number) => {
      const offset = aprofileNodes * (apathLenght + 1);
      aindexBuffer.push(offset + index);
    });
  }

  private static _flipShapeProfileGeometry(ashapeGeometry: THREE.ShapeGeometry) {
    const flippedGeometry = ashapeGeometry.clone();
    for (let i = 0; i < flippedGeometry.attributes.position.count; i++) {
      flippedGeometry.attributes.position.array[i * 3] *= -1;
    }
    flippedGeometry.attributes.position.needsUpdate = true;

    const indexes = flippedGeometry.index.array;
    // invert triangle creation order
    for (let i = 0; i < indexes.length; i += 3) {
      const tmp = indexes[i + 1];
      indexes[i + 1] = indexes[i + 2];
      indexes[i + 2] = tmp;
    }
    flippedGeometry.computeVertexNormals();
    return flippedGeometry;
  }


  private static _applyTransformationMatrix(clonedProfile: any, atransfMatrix: THREE.Matrix4) {
    for (let k = 0; k < clonedProfile.array.length; k += 3) {
      const vec = new THREE.Vector3(
        clonedProfile.array[k],
        clonedProfile.array[k + 1],
        clonedProfile.array[k + 2]
      );
      this._applyMatrix(vec, atransfMatrix);
      clonedProfile.array[k] = vec.x;
      clonedProfile.array[k + 1] = vec.y;
      clonedProfile.array[k + 2] = vec.z;
    }
  }

  private static _getTriangleIndexesForExtrusion(
    aextrusionPath: THREE.Vector2[],
    aprofilePoints: number,
    apathClosed: boolean,
  ) {
    const triangleIndexes = [];

    const lastPathNode = apathClosed == false ? aextrusionPath.length - 1 : aextrusionPath.length;
    for (let i = 0; i < lastPathNode; i++) {

      const currPathNodeIndex = i;
      const nextPathNodeIndex = ((i + 1) == aextrusionPath.length) ? 0 : i + 1;

      const currNodeProfileDispl = aprofilePoints * currPathNodeIndex;
      const nextNodeProfileDispl = aprofilePoints * nextPathNodeIndex;

      for (let j = 0; j < aprofilePoints; j++) {

        const currProfilePointIndex = j;
        const nextProfilePointIndex = ((j + 1) == aprofilePoints) ? 0 : j + 1;

        const a = currProfilePointIndex + currNodeProfileDispl;
        const b = currProfilePointIndex + nextNodeProfileDispl;
        const c = nextProfilePointIndex + nextNodeProfileDispl;
        const d = nextProfilePointIndex + currNodeProfileDispl;

        triangleIndexes.push(a, d, b);
        triangleIndexes.push(b, d, c);
      }
    }
    return triangleIndexes;
  }


  private static _polyLineExtrusionGeneratorsGeometry(
    aprofileShape: THREE.Shape,
    aextrusionPath: THREE.Vector2[]
  ) {

    const points: THREE.Vector3[] = [];

    const profileGeometry = new THREE.ShapeGeometry(aprofileShape);
    const profile = profileGeometry.getAttribute('position');
    // Transpose profile on plane X-Z
    for (let i = 0; i < profile.array.length; i += 3) {
      points.push(
        new THREE.Vector3(
          profile.array[i], //x=x
          profile.array[i + 2], //y=z
          profile.array[i + 1] //z=y
        )
      )
    }
    // close profile
    points.push(
      new THREE.Vector3(
        profile.array[0], //x=x
        profile.array[2], //y=z
        profile.array[1] //z=y
      )
    )

    // Add path points
    for (let j = 0; j < aextrusionPath.length; j++) {
      points.push(
        new THREE.Vector3(
          aextrusionPath[j].x,
          aextrusionPath[j].y,
          0
        )
      )

    }

    const r = new THREE.BufferGeometry().setFromPoints(points);

    return r;
  }

}