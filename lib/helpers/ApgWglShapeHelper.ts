/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/14]
 * -----------------------------------------------------------------------
 */

import { Uts, THREE } from "../deps.ts";

export class ApgWglShapeHelper {


  public static getRandomPoligon(
    aradious: number,
    aminVertexN = 3,
    amaxVertexNum = 12
  ) {
    const r = [];
    if (amaxVertexNum > 15) amaxVertexNum = 15;
    const delta = amaxVertexNum - aminVertexN;
    // random between 3 to 15 vertexes
    const vertices = Math.round(Math.random() * delta) + aminVertexN;
    for (let i = 0; i < vertices; i++) {
      const radious = aradious;
      const angle = 2 * Math.PI / vertices * i;
      const x = Math.cos(angle) * radious;
      const y = Math.sin(angle) * radious;
      r.push(
        new THREE.Vector2(
          Uts.ApgUtsMath.RoundToSignificant(x, 3),
          Uts.ApgUtsMath.RoundToSignificant(y, 3)
        )
      );
    }
    return r;
  }

  public static getRandomStar(
    aouterRadious: number,
    ainnerRadious: number,
    aminEdges = 3,
    amaxEdges = 12
  ) {
    const r = [];
    const delta = amaxEdges - aminEdges;
    const sides = (Math.round(Math.random() * delta) + aminEdges) * 2;
    const odd = sides % 4;
    const angleSlice = 2 * Math.PI / sides;
    for (let i = 0; i < sides; i++) {
      const radious = (i % 2 == 0) ? aouterRadious : ainnerRadious;
      const angle = angleSlice * (i + odd * 2)
      const x = Math.cos(angle) * radious;
      const y = Math.sin(angle) * radious;
      r.push(
        new THREE.Vector2(
          Uts.ApgUtsMath.RoundToSignificant(x, 3),
          Uts.ApgUtsMath.RoundToSignificant(y, 3)
        )
      );
    }
    return r;
  }
}