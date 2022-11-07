import { vec3 }         from 'gl-matrix';

// https://gdbooks.gitbooks.io/3dcollisions/content/Chapter4/point_in_triangle.html
export default function isPointInTri( p, a, b, c ){
    // Move the triangle so that the point becomes the triangles origin
    const ap = vec3.sub( [0,0,0], a, p );
    const bp = vec3.sub( [0,0,0], b, p );
    const cp = vec3.sub( [0,0,0], c, p );
    
    // Compute the normal vectors for triangles:
    // u = normal of PBC
    // v = normal of PCA
    // w = normal of PAB
    const u = vec3.cross( [0,0,0], bp, cp );
    const v = vec3.cross( [0,0,0], cp, ap );
    const w = vec3.cross( [0,0,0], ap, bp );
  
    // Test to see if the normals are facing 
    // the same direction, return false if not
    // if( vec3.dot(u, v) < 0 ) return false;
    // if( vec3.dot(u, w) < 0 ) return false;
  
    // All normals facing the same way, return true
    // return true;

    return !( vec3.dot(u, v) < 0 || vec3.dot(u, w) < 0 );
  }