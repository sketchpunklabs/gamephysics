import { vec3 } from 'gl-matrix';

// https://gdbooks.gitbooks.io/3dcollisions/content/Chapter1/plane.html
export default function planeFromTri( a, b, c, onorm=[0,0,0] ) {
    // Triangle's Normal
    const ba = vec3.sub( [0,0,0], b, a );
    const ca = vec3.sub( [0,0,0], c, a );
    vec3.cross( onorm, ba, ca );
    vec3.normalize( onorm, onorm );

    // Distance from origin
    const dist = vec3.dot( onorm, a ); 
    return [ onorm, dist ];
}