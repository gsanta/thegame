import { WorldItem } from '../world_items/item_types/WorldItem';
import { World } from '../World';
import { GwmWorldItem } from '@nightshifts.inc/world-generator';
import { WorldItemFactory } from './WorldItemFactory';
import { EnemyFactory } from '../world_items/factories/EnemyFactory';
import { Polygon } from '@nightshifts.inc/geometry';
import { WorldItemBoundingBoxCalculator } from './WorldItemBoundingBoxCalculator';
import { WorldItemRotationCalculator } from './WorldItemRotationCalculator';
import { Direction } from '../../model/utils/Direction';

export interface GenericItemImporter<T> {
    createItem(itemInfo: T, world: World): WorldItem;
}

export class WorldFactory {
    private factories: {[key: string]: GenericItemImporter<GwmWorldItem>};
    private worldItemFactoryMap: Map<string, WorldItemFactory>;
    private enemyFactory: EnemyFactory;
    private worldItemBoundingBoxCalculator: WorldItemBoundingBoxCalculator;
    private worldItemRotationCalculator: WorldItemRotationCalculator;

    constructor(
        enemyFactory: EnemyFactory,
        worldItemFactoryMap: Map<string, WorldItemFactory>,
        factories: {[key: string]: GenericItemImporter<GwmWorldItem>},
        worldItemBoundingBoxCalculator: WorldItemBoundingBoxCalculator,
        worldItemRotationCalculator: WorldItemRotationCalculator
    ) {
        this.factories = factories;
        this.worldItemFactoryMap = worldItemFactoryMap;
        this.enemyFactory = enemyFactory;
        this.worldItemBoundingBoxCalculator = worldItemBoundingBoxCalculator;
        this.worldItemRotationCalculator = worldItemRotationCalculator;
    }

    public createWall(itemInfo: GwmWorldItem, world: World): WorldItem {
        return this.factories.wall.createItem(itemInfo, world);
    }

    public createPlayer(itemInfo: GwmWorldItem, world: World): WorldItem {
        return this.worldItemFactoryMap.get('player').createItem(itemInfo, world);
    }

    public createWindow(itemInfo: GwmWorldItem, world: World): WorldItem {
        return  this.factories.window.createItem(itemInfo, world);
    }

    public createDoor(itemInfo: GwmWorldItem, world: World): WorldItem {
        return this.factories.door.createItem(itemInfo, world);
    }

    public createFloor(itemInfo: GwmWorldItem, world: World): WorldItem {
        return this.worldItemFactoryMap.get('floor').createItem(itemInfo, world);
    }

    public createBed(itemInfo: GwmWorldItem, world: World): WorldItem {
        const worldItemFactory = this.worldItemFactoryMap.get('bed');
        const bed = this.create(worldItemFactory, itemInfo, world);
        bed.hasDefaultAction = true;
        return bed;
    }

    public createTable(itemInfo: GwmWorldItem, world: World): WorldItem {
        const worldItemFactory = this.worldItemFactoryMap.get('table');
        return this.create(worldItemFactory, itemInfo, world);
    }

    public createBathtub(itemInfo: GwmWorldItem, world: World): WorldItem {
        const worldItemFactory = this.worldItemFactoryMap.get('bathtub');
        return this.create(worldItemFactory, itemInfo, world);
    }

    public createWashbasin(itemInfo: GwmWorldItem, world: World): WorldItem {
        const worldItemFactory = this.worldItemFactoryMap.get('washbasin');
        return this.create(worldItemFactory, itemInfo, world);
    }

    public createCupboard(itemInfo: GwmWorldItem, world: World): WorldItem {
        const worldItemFactory = this.worldItemFactoryMap.get('cupboard');
        const cupboard = this.create(worldItemFactory, itemInfo, world);
        cupboard.hasDefaultAction = true;

        return cupboard;
    }

    public createRoom(itemInfo: GwmWorldItem, world: World): WorldItem {
        return this.factories.room.createItem(itemInfo, world);
    }

    public createEmptyArea(itemInfo: GwmWorldItem, world: World): WorldItem {
        return this.worldItemFactoryMap.get('empty').createItem(itemInfo, world);
    }

    public createEnemy(polygon: Polygon, world: World): WorldItem {
        return this.enemyFactory.create(polygon, world);
    }

    private create(factory: WorldItemFactory, itemInfo: GwmWorldItem, world: World): WorldItem {
        const meshes = factory.meshInfo[0].map(mesh => mesh.clone(`${factory.meshInfo[0][0].name}`));
        const polygon = this.worldItemBoundingBoxCalculator.getBoundingBox(world, itemInfo, meshes[0]);
        const rotation = this.worldItemRotationCalculator.getRotation(itemInfo);

        return (<any> factory).createItem(meshes, polygon, rotation);
    }
}
