import { GwmWorldItem } from 'game-worldmap-generator';
import { GwmItemImporter } from '../../world_factory/GwmItemImporter';
import { Scene, StandardMaterial } from 'babylonjs';
import { AdditionalData } from '../../world_import/AdditionalData';
import { World } from '../../World';
import { WorldItem } from '../WorldItem';
import { Door } from './Door';
import { GameConstants } from '../../../GameConstants';
const colors = GameConstants.colors;

export class DoorFactory implements GwmItemImporter {
    private scene: Scene;
    private material: StandardMaterial;

    constructor(scene: Scene) {
        this.scene = scene;
        this.material = this.createMaterial();
    }

    public createItem(worldItem: GwmWorldItem<AdditionalData>, world: World): WorldItem {
        const door = Door.fromGwmWorldItem(worldItem, this.scene, world);
        door.material = this.material;
        return door;
    }

    private createMaterial(): StandardMaterial {
        const doorMaterial = new BABYLON.StandardMaterial('door-material', this.scene);
        doorMaterial.diffuseColor = BABYLON.Color3.FromHexString(colors.door);
        return doorMaterial;
    }
}
