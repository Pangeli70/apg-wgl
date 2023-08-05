/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/14]
 * @version 0.9.8 [APG 2023/07/22]
 * -----------------------------------------------------------------------
 */

import { THREE } from "../deps.ts";
import { eApgWglCatmullRomTypes } from "../enums/eApgWglCatmullRomTypes.ts";



export class ApgWglPathBuilder {


  public static buildRandomizedOpenedSplinePath(
    asplineType: THREE.CurveType = eApgWglCatmullRomTypes.catmullrom
  ) {
    const randomizedLineNodes = this.#getRandomized3DNodesAlongYAxis();
    const openedSpline = new THREE.CatmullRomCurve3(randomizedLineNodes, false, asplineType);
    return openedSpline;
  }
  

  static #getRandomized3DNodesAlongYAxis(
    anodes = 10,
    asegmentLength = 50,
    axzRange = 10
  ) {
    const randomPoints = [];
    for (let i = 0; i < anodes; i++) {
      const minY = anodes * asegmentLength / 2;

      const x = THREE.MathUtils.randFloat(-axzRange, axzRange);
      const y = i * asegmentLength - minY;
      const z = THREE.MathUtils.randFloat(-axzRange, axzRange);

      randomPoints.push(
        new THREE.Vector3(
          Math.round(x),
          Math.round(y),
          Math.round(z)
        )
      );
    }
    return randomPoints;
  }


  public static buildRandomizedStarShapeClosedSplinePath(
    aedges: number,
    asplineType: THREE.CurveType = eApgWglCatmullRomTypes.catmullrom
  ) {
    const randomizedLineNodes = this.#getRandomizedStarShape3DNodes(aedges);
    const closedSpline = new THREE.CatmullRomCurve3(randomizedLineNodes, true, asplineType);
    return closedSpline;
  }


  static #getRandomizedStarShape3DNodes(aedges: number, aradious = 100) {
    const radious = aradious;
    const segments = aedges * 2;
    const innerRadious = 0.9 * (segments / 24); // 90% when maximum segments
    const nodes: THREE.Vector3[] = [];
    for (let j = 0; j < segments; j++) {

      const odd = (j % 2) == 1;
      const deltaRadius = (odd) ? innerRadious : 1; // odd nodes have inner radious
      const angle = 2 * Math.PI / segments * (j + 1);

      const x = Math.cos(angle) * radious * deltaRadius;
      const y = Math.sin(angle) * radious * deltaRadius;
      const z = Math.random() * radious / 4 - radious / 8; // ad z noise

      const vector = new THREE.Vector3(
        Math.round(x),
        Math.round(y),
        Math.round(z)
      );
      nodes.push(vector);
    }
    return nodes;
  }


  public static buildRandomizedXYPolyline(
    anodes = 10,
    asegmentLength = 50,
    amaxAngleDeg = 30
  ) {
    const maxAngleRad = amaxAngleDeg / 180 * Math.PI;

    const randomPoints = [];
    randomPoints.push(new THREE.Vector2(0, 0));

    let currentAngle = 2 * Math.PI / 4; // 90°

    for (let i = 1; i < anodes; i++) {

      const randAngle = (i == 0) ? 0 : (Math.random() - 0.5) * maxAngleRad;
      currentAngle += randAngle;
      //currentAngle += currentAngle;
      const x: number = Math.cos(currentAngle) * asegmentLength + randomPoints[i - 1].x;
      const y: number = Math.sin(currentAngle) * asegmentLength + randomPoints[i - 1].y;

      randomPoints.push(
        new THREE.Vector2(
          Math.round(x),
          Math.round(y)
        )
      );
    }

    return randomPoints;
  }

}