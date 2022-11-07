
export default function intersectSphereAABB( sPos, sRadius, bMin, bMax ){
    // Get the closest box point
    const x     = Math.max( bMin[ 0 ], Math.min( sPos[ 0 ], bMax[ 0 ] ) );
    const y     = Math.max( bMin[ 1 ], Math.min( sPos[ 1 ], bMax[ 1 ] ) );
    const z     = Math.max( bMin[ 2 ], Math.min( sPos[ 2 ], bMax[ 2 ] ) );
    
    // Now do a Point inside sphere check
    const dist  = Math.sqrt(
        (x - sPos[ 0 ])**2 +
        (y - sPos[ 1 ])**2 +
        (z - sPos[ 2 ])**2
    );

    return dist < sRadius;
}