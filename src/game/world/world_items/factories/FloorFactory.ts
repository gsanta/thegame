import { Mesh, Scene, StandardMaterial, MeshBuilder, Skeleton } from '@babylonjs/core';
import { WorldItemInfo } from '@nightshifts.inc/world-generator';
import { GameConstants } from '../../../GameConstants';
import { VectorModel } from '../../../model/core/VectorModel';
import { World } from '../../World';
import { GwmItemImporter } from '../../world_factory/GwmItemImporter';
import { WorldItem } from '../item_types/WorldItem';
import { WorldItemToRealWorldCoordinateMapper } from '../world_item_mappers/WorldItemToRealWorldCoordinateMapper';
import { Color3 } from '@babylonjs/core';
import { WorldItemToWorldCenterTranslatorDecorator } from '../world_item_mappers/WorldItemToWorldCenterTranslatorDecorator';
import { SimpleWorldItem } from '../item_types/SimpleWorldItem';
const colors = GameConstants.colors;


export class FloorFactory implements GwmItemImporter {
    private scene: Scene;
    public meshInfo: [Mesh[], Skeleton[]];

    constructor(scene: Scene) {
        this.scene = scene;
    }


    public createItem(worldItem: WorldItemInfo, world: World): WorldItem {
        const gameObjectTranslator = new WorldItemToWorldCenterTranslatorDecorator(world, new WorldItemToRealWorldCoordinateMapper());

        const boundingBox = gameObjectTranslator.getTranslate(worldItem.dimensions);
        const translate = new VectorModel(boundingBox.minX(), 0, -boundingBox.maxY());
        translate.addZ(-2);

        const meshModel = new SimpleWorldItem(null, null, {type: 'floor'});
        meshModel.translate(translate);

        return meshModel;
    }

    private createMaterial(scene: Scene): StandardMaterial {
        const material = new StandardMaterial('empty-area-material', scene);
        material.diffuseColor = Color3.FromHexString(colors.cold);
        return material;
    }

    private createMesh(worldItem: WorldItemInfo): Mesh {
        return MeshBuilder.CreateGround(
                'floor',
                { width: worldItem.dimensions.xExtent(), height: worldItem.dimensions.yExtent(), updatable: true },
                this.scene
            );
    }
}
