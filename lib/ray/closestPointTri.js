import { vec3 }               from 'gl-matrix';
import closestPointToSegment  from './closestPointToSegment.js';

// https://gdbooks.gitbooks.io/3dcollisions/content/Chapter4/closest_point_to_triangle.html
export default function closestPointTri( p, a, b, c, pnt=[0,0,0], onorm=[0,0,0] ){
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // planeFromTri( a, b, c );
    const ba        = vec3.sub( [0,0,0], b, a );    // Triangle's Normal
    const ca        = vec3.sub( [0,0,0], c, a );
    vec3.cross( onorm, ba, ca );
    vec3.normalize( onorm, onorm );
    
    const plDist    = vec3.dot( onorm, a );         // Distance from origin

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // closestPointTnPlane( plNorm, plDist, p, out=[0,0,0] )
    const dir      = vec3.scale( [0,0,0], onorm, vec3.dot( onorm, p ) - plDist );
    const plPnt    = vec3.sub( pnt, p, dir );

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // isPointInTri( p, a, b, c )
    // Move the triangle so that the point becomes the triangles origin
    const ap = vec3.sub( [0,0,0], a, pnt );
    const bp = vec3.sub( [0,0,0], b, pnt );
    const cp = vec3.sub( [0,0,0], c, pnt );
    
    // Compute the normal vectors for triangles:
    // u = normal of PBC
    // v = normal of PCA
    // w = normal of PAB
    const u = vec3.cross( [0,0,0], bp, cp );
    const v = vec3.cross( [0,0,0], cp, ap );
    const w = vec3.cross( [0,0,0], ap, bp );
    
    if(!( vec3.dot(u, v) < 0 || vec3.dot(u, w) < 0 ) ) return pnt;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const c0    = closestPointToSegment( pnt, a, b );
    const c1    = closestPointToSegment( pnt, b, c );
    const c2    = closestPointToSegment( pnt, c, a );
    const mag0  = vec3.sqrDist( pnt, c0 );
    const mag1  = vec3.sqrDist( pnt, c1 ); 
    const mag2  = vec3.sqrDist( pnt, c2 ); 
    const min   = Math.min( mag0, mag1, mag2 );

    if( min === mag1 )      vec3.copy( pnt, c1 );
    else if( min === mag2 ) vec3.copy( pnt, c2 )
    else                    vec3.copy( pnt, c0 );

    return pnt
}