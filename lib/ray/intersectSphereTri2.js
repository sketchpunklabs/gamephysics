import { vec3 }                 from 'gl-matrix';
import closestPointToSegment    from './closestPointToSegment.js';

// https://wickedengine.net/2020/04/26/capsule-collision-detection/
export default function intersectSphereTri( sPos, sRadius, v0, v1, v2, onorm=[0,0,0] ){
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // TEST IF SPHERE INTERSECTS TRIANGLE INFINITE PLANE
    const edg0   = vec3.sub( [0,0,0], v1, v0 );
    const edg1   = vec3.sub( [0,0,0], v2, v0 );
    const toCent = vec3.sub( [0,0,0], sPos, v0 );
    
    vec3.cross( onorm, edg0, edg1 );
    vec3.normalize( onorm, onorm );

    // Distance sphere center is to the plane
    const cDist  = vec3.dot( toCent, onorm );

    // if( cDist > 0 ) return false; // Backface;
    if( cDist < -sRadius || cDist > sRadius ) return false;  // no intersection'

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // FIGURE OUT IF SPHERE CENTER IS INSIDE THE SPHERE

    // Project the sphere center onto the plane
    const tmp = [0,0,0];
    const pnt = [0,0,0];
    vec3.scale( tmp, onorm, cDist );
    vec3.sub( pnt, sPos, tmp );

    // Now determine whether projected point is inside all triangle edges
                 vec3.sub( edg1, v2, v1 );
    const edg2 = vec3.sub( [0,0,0], v0, v2 );
    const c0   = vec3.cross( [0,0,0], vec3.sub( tmp, pnt, v0 ), edg0 );
    const c1   = vec3.cross( [0,0,0], vec3.sub( tmp, pnt, v1 ), edg1 );
    const c2   = vec3.cross( [0,0,0], vec3.sub( tmp, pnt, v2 ), edg2 );

    const inside = ( 
        vec3.dot( c0, onorm ) <= 0 &&
        vec3.dot( c1, onorm ) <= 0 &&
        vec3.dot( c2, onorm ) <= 0
    );

    if( inside ) return true;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // CHECK WHEN CENTER IS NOT INSIDE THE TRIANGLE
    const radiusSqr = sRadius**2;
    let intersects  = false;

    closestPointToSegment( sPos, v0, v1, tmp ); // point1
    intersects ||= ( vec3.sqrDist( sPos, tmp ) < radiusSqr );

    closestPointToSegment( sPos, v1, v2, tmp ); // point2
    intersects ||= ( vec3.sqrDist( sPos, tmp ) < radiusSqr );

    closestPointToSegment( sPos, v2, v0, tmp ); // point3
    intersects ||= ( vec3.sqrDist( sPos, tmp ) < radiusSqr );

    // NOTE, Excluding the part that finds the point of intersection between the two
    // console.log( 'hit?', inside, intersects );
    return intersects;
}