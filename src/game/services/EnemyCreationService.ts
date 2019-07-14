import { World } from '../world/World';
import { WorldItem } from '../world/world_items/item_types/WorldItem';
import { StandardMaterial, Color3 } from '@babylonjs/core';
import find from 'lodash/find';
import { Polygon } from '@nightshifts.inc/geometry';

export class EnemyCreationService {
    private world: World;

    constructor(world: World) {
        this.world = world;

        const rooms = world.getWorldItemsByName('room');

        if (rooms.length > 1) {
            this.createEnemy(rooms[1]);
        }

        if (rooms.length > 2) {
            this.createEnemy(rooms[2]);
        }
    }


    public createEnemy(room: WorldItem): WorldItem {
        const emptyArea = find(room.getChildren(), child => child.type === 'empty');

        const material = new StandardMaterial('empty-area-material', this.world.scene);
        material.diffuseColor = Color3.FromHexString('00FF00');
        emptyArea.mesh.material = material;

        const enemyPosition = emptyArea.getCenterPosition();

        const rect = Polygon.createRectangle(enemyPosition.x, enemyPosition.z, 1, 1);

        const enemy =  this.world.factory.createEnemy(rect, this.world);
        room.addChild(enemy);

        return enemy;
    }
}
