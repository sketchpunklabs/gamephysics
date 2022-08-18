export default function closestPointToSegment( p, a, b, out=[0,0,0] ){
    const dx = b[ 0 ] - a[ 0 ];
    const dy = b[ 1 ] - a[ 1 ];
    const dz = b[ 2 ] - a[ 2 ];
    let   t  = ( 
        ( p[ 0 ] - a[ 0 ] ) * dx + 
        ( p[ 1 ] - a[ 1 ] ) * dy + 
        ( p[ 2 ] - a[ 2 ] ) * dz
    ) / ( dx*dx + dy*dy + dz*dz ) ;

    t = Math.min( Math.max( t, 0 ), 1 );

    const ti = 1 - t;
    out[ 0 ] = a[ 0 ] * ti + b[ 0 ] * t;
    out[ 1 ] = a[ 1 ] * ti + b[ 1 ] * t;
    out[ 2 ] = a[ 2 ] * ti + b[ 2 ] * t;
    return out;
}