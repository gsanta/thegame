import { MeshModel } from '../MeshModel';
import { World } from '../../World';

export interface GenericItemDeserializer<T> {
    createItem(itemInfo: T, world: World): MeshModel;
}

export class MeshFactory<T> {
    private factories: {[key: string]: GenericItemDeserializer<T>};

    constructor(factories: {[key: string]: GenericItemDeserializer<T>}) {
        this.factories = factories;
    }

    public createWall(itemInfo: T, world: World): MeshModel {
        return this.factories.wall.createItem(itemInfo, world);
    }

    public createPlayer(itemInfo: T, world: World): MeshModel {
        return this.factories.player.createItem(itemInfo, world);
    }

    public createWindow(itemInfo: T, world: World): MeshModel {
        return  this.factories.window.createItem(itemInfo, world);
    }

    public createDoor(itemInfo: T, world: World): MeshModel {
        return this.factories.door.createItem(itemInfo, world);
    }

    public createFloor(itemInfo: T, world: World): MeshModel {
        return this.factories.floor.createItem(itemInfo, world);
    }

    public createBed(itemInfo: T, world: World): MeshModel {
        return this.factories.bed.createItem(itemInfo, world);
    }

    public createTable(itemInfo: T, world: World): MeshModel {
        return this.factories.table.createItem(itemInfo, world);
    }

    public createBathtub(itemInfo: T, world: World): MeshModel {
        return this.factories.bathtub.createItem(itemInfo, world);
    }

    public createWashbasin(itemInfo: T, world: World): MeshModel {
        return this.factories.washbasin.createItem(itemInfo, world);
    }

    public createCupboard(itemInfo: T, world: World): MeshModel {
        return this.factories.cupboard.createItem(itemInfo, world);
    }
}