import { vec3 } from 'gl-matrix';

export default function closestPointTnPlane( plNorm, plDist, p, out=[0,0,0] ){
    // If the plane normal wasn't normalized, we'd need this:
    // distance = distance / DOT(plane.Normal, plane.Normal);
    const distance = vec3.dot( plNorm, p ) - plDist;
    const dir      = vec3.scale( [0,0,0], plNorm, distance );
    return vec3.sub( out, p, dir );
}