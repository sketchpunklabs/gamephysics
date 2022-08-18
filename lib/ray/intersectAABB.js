import { vec3 }         from 'gl-matrix';

// https://gist.github.com/DomNomNom/46bb1ce47f68d255fd5d
/** returns the ray LENGTH, use directionAt() */
export default function intersectAABB( ray, min, max ){
    const tMin = vec3.sub( [0,0,0], min, ray.posStart );
    const tMax = vec3.sub( [0,0,0], max, ray.posStart );
    vec3.div( tMin, tMin, ray.direction );
    vec3.div( tMax, tMax, ray.direction );

    const t1    = vec3.min( [0,0,0], tMin, tMax );
    const t2    = vec3.max( [0,0,0], tMin, tMax );
    const tNear = Math.max( Math.max( t1[0], t1[1] ), t1[2] );
    const tFar  = Math.min( Math.min( t2[0], t2[1] ), t2[2] );

    return ( tNear < tFar )? [tNear, tFar] : null;
}