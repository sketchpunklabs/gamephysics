import { vec3, mat4 }        from 'gl-matrix';
import closestPointToSegment from './closestPointToSegment.js';
import intersectSphereTri    from './intersectSphereTri.js';
import intersectTri          from './intersectTri.js';
import intersectAABB         from './intersectAABB.js';

function vec3_fromBuf( ary, idx, out ){
    out[ 0 ] = ary[ idx ];
    out[ 1 ] = ary[ idx + 1 ];
    out[ 2 ] = ary[ idx + 2 ];
    return out;
}

export default function sphereCast( ray, radius, aryObject, debug=null ){
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // https://gist.github.com/dfbrown/9be30c511c2eb0288daccb89f2ca548e
    // In moving sphere intersect it handles AABB by resizing the box
    // by the radius of the sphere's radius to make up any space as
    // an optization trick
    let bMin, bMax, mat;
    let tMin   = Infinity;
    let hitObj = null;
    for( const obj of aryObject ){
        // Get Bounding Box in world spalce
        bMin     = obj.geometry.boundingBox.min.toArray();
        bMax     = obj.geometry.boundingBox.max.toArray();
        mat      = obj.matrixWorld.toArray();

        // NOTE: disable because this causes boxes to overlap which causes issues.
        // Expand by Sphere Radius
        // bMin[0] -= radius; bMin[1] -= radius; bMin[2] -= radius;
        // bMax[0] += radius; bMax[1] += radius; bMax[2] += radius;

        // NOTE: Move box to world space BUT if rotation isn't in 90deg
        // increments then the intersect tests won't work correctly.
        vec3.transformMat4( bMin, bMin, mat );
        vec3.transformMat4( bMax, bMax, mat );

        if( debug ) debug.ln.box( bMin, bMax, 0x00ffff );

        // hit Test
        let hit = intersectAABB( ray, bMin, bMax );
        if( hit ){
            if( hit[0] < tMin ){
                tMin    = hit[ 0 ];
                hitObj  = obj;
            }
        }
    }

    if( !hitObj ) return null;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // The mesh data exists in localspace, its easier to move the ray
    // to local space to handle all the sphere & ray intersection tests.
    //hitObj.updateMatrixWorld( true ); // Shouldn't need to do it during casting, calling after placing meshes
          mat       = hitObj.matrixWorld.toArray();         // Save to shift hitpos to world space
    const invMat    = mat4.invert( mat.slice(), mat );      // Invert to move things into local space of mesh
    const lRay      = ray.clone().applyMatrix( invMat );    // Move ray into local space

    const vert      = hitObj.geometry.attributes.position.array;
    const ind       = hitObj.geometry.index.array;

    const triMid    = [0,0,0]; 
    const spos      = [0,0,0]; // Sphere position
    const triNorm   = [0,0,0]; // Return Triangle Normal on success
    const idx       = [0,0,0]; // Starting index for each vertex in triangale
    const tri       = [        // Each vertex position of the triangle
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    const rtn       = {
        hitpos  : [ 0,0,0 ],
        faces   : [],
    };

    for( let i=0; i < ind.length; i+=3 ){
        // Get indices of triangle vertices
        idx[ 0 ] = ind[ i + 0 ] * 3;
        idx[ 1 ] = ind[ i + 1 ] * 3;
        idx[ 2 ] = ind[ i + 2 ] * 3;

        // Vertices of the triangle
        vec3_fromBuf( vert, idx[0], tri[0] );   
        vec3_fromBuf( vert, idx[1], tri[1] );
        vec3_fromBuf( vert, idx[2], tri[2] );

        // Triangle Center
        vec3.add( triMid, tri[0], tri[1],  );
        vec3.add( triMid, triMid, tri[2] );
        vec3.scale( triMid, triMid, 1/3 );

        // Find the closest point to sphere collider to triangle
        closestPointToSegment( triMid, lRay.posStart, lRay.posEnd, spos );

        // Check if sphere intersects the triangle
        if( !intersectSphereTri( lRay, spos, radius, tri[0], tri[1], tri[2], triNorm ) ) continue;

        // Test ray on triangle to find main point of contact
        intersectTri( lRay, tri[0], tri[1], tri[2], rtn.hitpos, false );

        // Save triangle to list
        rtn.faces.push({
            center : triMid.slice(),
            norm   : triNorm.slice(),
        });

        if( debug ){
            vec3.transformMat4( tri[0], tri[0], mat );
            vec3.transformMat4( tri[1], tri[1], mat );
            vec3.transformMat4( tri[2], tri[2], mat );
            
            debug.ln.add( tri[0], tri[1], 0xff0000 );
            debug.ln.add( tri[1], tri[2], 0xff0000 );
            debug.ln.add( tri[2], tri[0], 0xff0000 );
            
            // vec3.transformMat4( triMid, triMid, mat );
            // debug.ln.add( triMid, vec3.scaleAndAdd( [0,0,0], triMid, triNorm, 1 ), 0xff0000 );
            // debug.pnt.add( triMid, 0xff0000, 3 );
        }
    }

    vec3.transformMat4( rtn.hitpos, rtn.hitpos, mat ); // Move hit point to world space
    return rtn;
}