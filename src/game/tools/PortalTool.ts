import { Mesh, Vector3 } from 'babylonjs';
import { GameObject } from '../model/game_objects/GameObject';
import { World } from '../model/game_objects/World';
import { Tool } from './Tool';
import { RayCaster } from '../model/utils/RayCaster';

export class PortalTool implements Tool {
    name = 'portal';

    private portal: GameObject;
    private player: GameObject;
    private rayCaster: RayCaster;

    constructor(world: World, rayCaster: RayCaster = new RayCaster(world)) {
        this.portal = world.getWorldItemsByType('portal')[0];
        this.player = world.getWorldItemsByType('player')[0];
        this.rayCaster = rayCaster;
    }

    createPreview() {

    }

    enable() {

    }

    disable() {

    }

    update() {
        const pickingInfo = this.rayCaster.castRay(this.player, new Vector3(0, 0, -1));

        if (pickingInfo.intersectionPoint) {

            const position = new Vector3(pickingInfo.intersectionPoint.x, 8, pickingInfo.intersectionPoint.y);
            this.portal.setPosition(position);
            this.portal.meshes[0].rotationQuaternion = pickingInfo.pickedGameObject.meshes[0].rotationQuaternion;
        }
    }
}
