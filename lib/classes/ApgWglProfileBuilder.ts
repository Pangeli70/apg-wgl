/** -----------------------------------------------------------------------
 * @module [apg-wgl]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/05/14]
 * @version 0.9.8 [APG 2023/07/22]
 * -----------------------------------------------------------------------
 */

import { Uts, THREE } from "../deps.ts";

export class ApgWglProfileBuilder {


  public static buildRandomPolygonProfile(
    aradious: number,
    aminVertexNum = 3,
    amaxVertexNum = 12
  ) {
    const r = [];
    if (aminVertexNum < 3) aminVertexNum = 3;
    if (amaxVertexNum > 15) amaxVertexNum = 15;
    const delta = amaxVertexNum - aminVertexNum;
    // random between 3 to 15 vertexes
    const vertices = Math.round(Math.random() * delta) + aminVertexNum;
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

  public static buildRandomStarProfile(
    aouterRadious: number,
    ainnerRadious: number,
    aminEdgesNum = 3,
    amaxEdgesNum = 12
  ) {
    const r = [];
    if (aminEdgesNum < 3) aminEdgesNum = 3;
    if (amaxEdgesNum > 12) amaxEdgesNum = 12;
    const delta = amaxEdgesNum - aminEdgesNum;
    const sides = (Math.round(Math.random() * delta) + aminEdgesNum) * 2;
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