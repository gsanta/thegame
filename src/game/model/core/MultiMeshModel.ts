import { Mesh, Vector3 } from 'babylonjs';
import { VectorModel } from './VectorModel';
import _ = require('lodash');
import { WorldItem } from '../../world_items/WorldItem';


export class MultiMeshModel extends WorldItem {
    protected meshes: Mesh[];
    public name: string;

    constructor(meshes: Mesh[], name: string) {
        super(null, name);
        this.meshes = meshes;
    }

    public translate(vectorModel: VectorModel) {
        this.meshes.forEach(mesh => mesh.translate(new Vector3(vectorModel.x, vectorModel.y, vectorModel.z), 1));
    }

    public intersectsPoint(vector: VectorModel) {
        return _.some(this.meshes, mesh => mesh.intersectsPoint(new Vector3(vector.x, vector.y, vector.z)));
    }
}
