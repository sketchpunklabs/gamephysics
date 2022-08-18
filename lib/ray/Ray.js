import { vec3, vec4, mat4 } from 'gl-matrix';

export default class Ray{
    posStart    = [0,0,0];  // Origin
    posEnd      = [0,0,0];
    direction   = [0,0,0];  // Direction from Start to End
    vecLength   = [0,0,0];  // Vector Length between start to end

    //#region GETTERS / SETTERS
    /** Get position of the ray from T Scale of VecLen */
    posAt( t, out=[0,0,0] ){
        // RayVecLen * t + RayOrigin
        // also works lerp( RayOrigin, RayEnd, t )
        out[ 0 ] = this.vecLength[ 0 ] * t + this.posStart[ 0 ];
        out[ 1 ] = this.vecLength[ 1 ] * t + this.posStart[ 1 ];
        out[ 2 ] = this.vecLength[ 2 ] * t + this.posStart[ 2 ];
        return out;
    }

    /** Get position of the ray from distance from origin */
    directionAt( len, out=[0,0,0]) {
        out[ 0 ] = this.direction[ 0 ] * len + this.posStart[ 0 ];
        out[ 1 ] = this.direction[ 1 ] * len + this.posStart[ 1 ];
        out[ 2 ] = this.direction[ 2 ] * len + this.posStart[ 2 ];        
        return out;
    }

    fromScreenProjection( x, y, w, h, projMatrix, camMatrix ){
        // http://antongerdelan.net/opengl/raycasting.html
		// Normalize Device Coordinate
        const nx  = x / w * 2 - 1;
        const ny  = 1 - y / h * 2;

        // inverseWorldMatrix = invert( ProjectionMatrix * ViewMatrix ) OR
		// inverseWorldMatrix = localMatrix * invert( ProjectionMatrix ) 
        const invMatrix = mat4.invert( mat4.create(), projMatrix );
        mat4.mul( invMatrix, camMatrix, invMatrix );
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // https://stackoverflow.com/questions/20140711/picking-in-3d-with-ray-tracing-using-ninevehgl-or-opengl-i-phone/20143963#20143963
        // Clip Cords would be [nx,ny,-1,1];
        const clipNear   = [ nx, ny, -1, 1 ];
        const clipFar    = [ nx, ny, 1, 1 ];

        // using 4d Homogeneous Clip Coordinates
        vec4.transformMat4( clipNear, clipNear, invMatrix );
        vec4.transformMat4( clipFar, clipFar, invMatrix );

        // Normalize by using W component
        for( let i=0; i < 3; i++){
            clipNear[ i ]	/= clipNear[ 3 ];
            clipFar [ i ] 	/= clipFar [ 3 ];
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        vec3.copy( this.posStart, clipNear );               // Starting Point of the Ray
        vec3.copy( this.posEnd, clipFar );                  // The absolute end of the ray
        vec3.sub( this.vecLength, clipFar, clipNear );      // Vector Length
        vec3.normalize( this.direction, this.vecLength );   // Normalized Vector Length
        return this;
    }

    fromEndPoints( a, b ){
        vec3.copy( this.posStart, a );                      // Starting Point of the Ray
        vec3.copy( this.posEnd, b );                        // The absolute end of the ray
        vec3.sub( this.vecLength, b, a );                   // Vector Length
        vec3.normalize( this.direction, this.vecLength );   // Normalized Vector Length
        return this;
    }

    clone(){
        const r = new Ray();
        vec3.copy( r.posStart, this.posStart );
        vec3.copy( r.posEnd, this.posEnd );
        vec3.copy( r.direction, this.direction  );
        vec3.copy( r.vecLength, this.vecLength );    
        return r;
    }

    applyMatrix( m ){
        const a = vec3.transformMat4( [0,0,0], this.posStart, m );
        const b = vec3.transformMat4( [0,0,0], this.posEnd, m ); 
        this.fromEndPoints( a, b );
        return this;
    }
    //#endregion /////////////////////////////////////////////////////////////////
}