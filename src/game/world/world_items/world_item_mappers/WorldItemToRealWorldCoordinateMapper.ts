import { GwmWorldItem } from '@nightshifts.inc/world-generator';
import { Direction } from '../../../model/utils/Direction';
import { Vector2Model } from '../../../model/utils/Vector2Model';
import { AdditionalData } from '../../world_import/AdditionalData';
import { Orientation } from '../../../model/utils/Orientation';
import { World } from '../../World';
import { Rectangle, Polygon } from '@nightshifts.inc/geometry';

export interface WorldItemTranslator {
    getTranslate(worldItem: GwmWorldItem, world: World, realMeshDimensions?: Vector2Model): Vector2Model;
    getDimensions(worldItem: GwmWorldItem): Vector2Model;
    getRotation(worldItem: GwmWorldItem): number;
}

export class WorldItemToRealWorldCoordinateMapper implements WorldItemTranslator {
    private gameObjectToMeshSizeRatio: number;

    constructor(gameObjectToMeshSizeRatio: number) {
        this.gameObjectToMeshSizeRatio = gameObjectToMeshSizeRatio;
    }

    public getTranslate(worldItem: GwmWorldItem, world: World, realMeshDimensions: Vector2Model = new Vector2Model(0, 0)): Vector2Model {
        const realDimensions = <Rectangle> worldItem.dimensions; //this.changeToRealWorldDimensions(worldItem.dimensions, this.gameObjectToMeshSizeRatio);

        const dock = worldItem.additionalData && worldItem.additionalData.dock !== undefined ? worldItem.additionalData.dock : Direction.MIDDLE;
        return this.getDockPosition(dock, realDimensions, realMeshDimensions);
    }

    public getDimensions(worldItem: GwmWorldItem): Vector2Model {
        const rect = worldItem.dimensions;
        // return new Vector2Model(rect.width, rect.height);
        if (rect.width > rect.height) {
            return new Vector2Model(rect.width * this.gameObjectToMeshSizeRatio, this.gameObjectToMeshSizeRatio);
        } else {
            return new Vector2Model(this.gameObjectToMeshSizeRatio, rect.height * this.gameObjectToMeshSizeRatio);
        }
    }

    public getRotation(worldItem: GwmWorldItem<AdditionalData>) {
        const orientation = worldItem.additionalData.orientation;

        return this.getRotationForOrientation(orientation);
    }

    private getRotationForOrientation(orientation: Orientation) {
        switch (orientation) {
            case Orientation.NORTH:
                return Math.PI;
            case Orientation.EAST:
                return - Math.PI / 2;
            case Orientation.WEST:
                return Math.PI / 2;
            case Orientation.SOUTH:
            default:
                return 0;
        }
    }

    private changeToRealWorldDimensions(rect: Polygon, gameObjectToMeshSizeRatio: number) {
        const ratio = gameObjectToMeshSizeRatio;
        return new Rectangle(rect.left * ratio, rect.top * ratio, rect.width * ratio, rect.height * ratio);
    }

    private getDockPosition(dock: Direction, dimensions: Rectangle, meshDimensions: Vector2Model) {
        const x = dimensions.left;
        const y = dimensions.top;

        const topLeft = new Vector2Model(x, y);

        switch (dock) {
            case Direction.NORTH_WEST:
                return new Vector2Model(topLeft.x() + meshDimensions.x(), topLeft.y() + meshDimensions.y());
            case Direction.NORTH_EAST:
                return new Vector2Model(topLeft.x() + dimensions.width, topLeft.y());
            case Direction.SOUTH_EAST:
                return new Vector2Model(topLeft.x() + dimensions.width, topLeft.y() + dimensions.height);
            case Direction.SOUTH_WEST:
                return new Vector2Model(topLeft.x() + meshDimensions.x(), topLeft.y() + dimensions.height - meshDimensions.y());
            case Direction.MIDDLE:
                return new Vector2Model(x + dimensions.width / 2, y + dimensions.height / 2);
            default:
                throw new Error('Invalid dock direction: ' + dock);
        }
    }
}
