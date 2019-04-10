import { MeshWrapper } from '../wrappers/MeshWrapper';
import { StandardMaterial, Mesh, Vector3 } from 'babylonjs';
import { MeshTemplateConfig } from '../../game/model/core/templates/MeshTemplate';
import { SerializedMeshModel, WorldItem } from '../../game/world_items/WorldItem';
import { Vector2Model } from '../../game/model/utils/Vector2Model';
import { VectorModel } from '../../game/model/core/VectorModel';
import { Polygon, Rectangle } from 'game-worldmap-generator';
import { Point } from 'game-worldmap-generator/build/model/Point';
import { ContainerWorldItem } from './ContainerWorldItem';
import { BabylonMeshWrapper } from '../wrappers/babylon/BabylonMeshWrapper';


export class SimpleWorldItem<M = Mesh> implements WorldItem {
    public mesh: BabylonMeshWrapper;
    public name: string;
    public hasDefaultAction = false;

    public materials: {[key: string]: StandardMaterial} = {};

    protected counter = 1;

    constructor(mesh: BabylonMeshWrapper, name: string, config?: MeshTemplateConfig) {
        this.mesh = mesh;
        this.name = name;

        if (config) {
            this.initMesh(config);
        }
    }

    public doDefaultAction() {
        throw new Error('No default action defined');
    }

    public serialize(): SerializedMeshModel {
        return {
            name: this.name,
            scaling: {
                x: this.mesh.getScale().x,
                y: this.mesh.getScale().y,
                z: this.mesh.getScale().z,
            },
            translate: {
                x: this.mesh.getPosition().x,
                y: this.mesh.getPosition().y,
                z: this.mesh.getPosition().z
            },
            additionalData: {
                rotation: this.mesh.getRotation().y
            }
        };
    }

    public unserialize(model: SerializedMeshModel): SimpleWorldItem<M> {
        return null;
    }

    public clone() {
        const clonedMesh = this.mesh.clone(`${this.mesh.getId()}-${this.counter++}`);
        const name = this.name;

        const clone = new SimpleWorldItem(clonedMesh, name);
        this.copyTo(clone);

        return clone;
    }

    public rotateAtCenter(vectorModel: VectorModel, amount: number): void {
        this.mesh.rotateAtCenter(vectorModel, amount);
    }

    public translate(vectorModel: VectorModel) {
        this.mesh.translate(vectorModel);
    }

    public scale(vectorModel: VectorModel) {
        this.mesh.setScale(vectorModel);
    }

    public getCenterPosition(): VectorModel {
        return this.mesh.getPosition();
    }

    public getScale(): VectorModel {
        return this.mesh.getScale();
    }

    public getRotation(): VectorModel {
        return new VectorModel(0, 0, 0);
    }

    public getBoundingPolygon(): Polygon {
        const mesh: any = this.mesh.wrappedMesh;
        const width = mesh.geometry.extend.maximum.x - mesh.geometry.extend.minimum.x;
        const height = mesh.geometry.extend.maximum.z - mesh.geometry.extend.minimum.z;
        const position = (this.mesh.wrappedMesh as any).getAbsolutePosition();
        const centerPoint = new Point(position.x, position.z);

        return new Rectangle(centerPoint.x - width / 2, centerPoint.y - height / 2, width, height);
    }

    public setParent(worldItem: WorldItem) {
        this.mesh.wrappedMesh.parent = (<ContainerWorldItem> worldItem).containerMesh.wrappedMesh;
    }

    protected copyTo(meshModel: WorldItem): WorldItem {
        meshModel.materials = {...this.materials};
        meshModel.name = this.name;
        meshModel.hasDefaultAction = this.hasDefaultAction;

        return meshModel;
    }

    private initMesh(config: MeshTemplateConfig) {
        this.materials = config.materials;
    }
}