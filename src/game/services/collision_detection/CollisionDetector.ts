import { Vector3, Scene, AbstractMesh, Ray, Mesh } from '@babylonjs/core';
import { VectorModel } from '../../model/core/VectorModel';
import { GameObject } from '../../world/world_items/item_types/GameObject';

export interface CollisionInfo {
    mesh: AbstractMesh | null;
    normal: VectorModel | null;
}

export class CollisionDetector {
    private creature: GameObject;
    private scene: Scene;

    constructor(creature: GameObject, scene: Scene) {
        this.creature = creature;
        this.scene = scene;
    }

    public collidesWith(otherMesh: Mesh): boolean {
        return this.creature.mesh.intersectsMesh(otherMesh);
    }

    public getAdjustedDelta(delta: VectorModel): VectorModel {

        const collisionInfo = this.castRay(new Vector3(delta.x, delta.y, delta.z));

        if (collisionInfo.mesh) {
            if (collisionInfo.mesh.name !== 'ray') {
                let invNormal = collisionInfo.normal!.negate();
                invNormal = invNormal.scale(delta.multiply(collisionInfo.normal!).length()); // Change normal to direction's length and normal's axis
                let adjustedDelta = delta.subtract(invNormal);

                const collisionInfo2 = this.castRay(new Vector3(adjustedDelta.x, adjustedDelta.y, adjustedDelta.z));

                if (collisionInfo2.mesh) {
                    return new VectorModel(0, 0, 0);
                }
                return adjustedDelta;
            }
        }

        return delta;
    }


    private castRay(delta: Vector3):  CollisionInfo {
        const centerPoint = this.creature.getBoundingBox().getBoundingCenter();
        const vector3 = new VectorModel(centerPoint.x, 0, centerPoint.y);
        const origin = vector3.clone();
        origin.addY(origin.y + 1);

        const ray = new Ray(new Vector3(origin.x, 0.1, origin.z), delta, 3);

        const hit = this.scene.pickWithRay(ray, (pickedMesh: AbstractMesh) => {
            return ['ray', 'ground', 'thermometer', 'bounding-box-ignore-collision', 'container'].indexOf(pickedMesh.name) === -1;
        });

        let normal: Vector3 | null = null;
        let mesh: AbstractMesh | null = null;
        if (hit && hit.pickedMesh) {
            normal = hit.getNormal();
            mesh = hit.pickedMesh;
        }


        return {
            mesh: mesh,
            normal: normal ? new VectorModel(normal.x, normal.y, normal.z) : null
        };
    }
}