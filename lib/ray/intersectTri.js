import { vec3 }         from 'gl-matrix';

// https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-rendering-a-triangle/moller-trumbore-ray-triangle-intersection
export default function intersectTri( ray, v0, v1, v2, out=null, cullFace=true ){
    const v0v1  = vec3.sub( [0,0,0], v1, v0 );
    const v0v2  = vec3.sub( [0,0,0], v2, v0 );
    const pvec 	= vec3.cross( [0,0,0], ray.direction, v0v2 );
    const det   = vec3.dot( v0v1, pvec );

    if( cullFace && det < 0.000001 ) return false;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const idet  = 1 / det;
    const tvec  = vec3.sub( [0,0,0], ray.posStart, v0 );
    const u     = vec3.dot( tvec, pvec ) * idet;

    if( u < 0 || u > 1 ) return false;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const qvec  = vec3.cross( [0,0,0], tvec, v0v1 );
    const v     = vec3.dot( ray.direction, qvec ) * idet;

    if( v < 0 || u+v > 1 ) return false;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if( out ){
        const len = vec3.dot( v0v2, qvec ) * idet;
        ray.directionAt( len, out );
    }

    return true;
}