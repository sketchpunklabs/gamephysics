import { UtilGltf2, Gltf2 } from '../../lib/UtilGltf2.js';
import { MeshPhongMaterial } from 'three';

export default class TrackLoader{
    constructor(){
        this.gltf = null;
    }

    async init(){
        this.gltf = await Gltf2.fetch( '../assets/models/marble_kit.gltf' );
        return this;
    }
    
    loadMesh( meshName, parent=null, mat=null ){
        const mesh = UtilGltf2.loadMesh( this.gltf, meshName, mat || new MeshPhongMaterial() );
        if( parent ) parent.add( mesh );
        return mesh;
    }

    loadSet( ary, parent=null, mat=null ){
        const material  = mat || new MeshPhongMaterial();
        const rtn       = [];
        for( const i of ary ){
            const mesh = this.loadMesh( i.name, parent, material );
            if( i.pos ) mesh.position.fromArray( i.pos );
            if( i.rot ) mesh.rotation.fromArray( i.rot );

            rtn.push( mesh );
        }

        return rtn;
    }
}