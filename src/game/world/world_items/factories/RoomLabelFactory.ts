import { WorldItem } from '../item_types/WorldItem';
import { World } from '../../World';
import { Scene, MeshBuilder, Vector3, StandardMaterial, DynamicTexture, Color3 } from '@babylonjs/core';
import { Polygon } from '@nightshifts.inc/geometry';
import { SimpleWorldItem } from '../item_types/SimpleWorldItem';


export class RoomLabelFactory {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public createItem(polygon: Polygon, world: World, label: string): WorldItem {
        const mesh = this.createMesh(polygon, label);
        return new SimpleWorldItem(mesh, 'room-label', polygon);
    }

    private createMesh(dimensions: Polygon, label: string) {
        const roomTop = MeshBuilder.CreatePolygon(
            'room-label',
            {
                shape: dimensions.points.map(point => new Vector3(point.x, 0, point.y)),
                depth: 2,
                updatable: true
            },
            this.scene
        );

        roomTop.translate(new Vector3(0, 6.6, 0), 1);

        roomTop.material = this.createMaterial(label);

        return roomTop;
    }

    private createMaterial(label: string): StandardMaterial {
        const textureGround = new DynamicTexture('room-label-texture', {width: 512, height: 256}, this.scene, false);

        const material = new StandardMaterial('door-closed-material', this.scene);
        material.diffuseTexture = textureGround;
        // material.alpha = 0.5;

        const font = 'bold 60px Arial';
        textureGround.drawText(label, 200, 150, font, 'green', '#8B4513', true, true);

        return material;
    }
}