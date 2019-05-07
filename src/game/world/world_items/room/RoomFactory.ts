import { Scene, MeshBuilder, Vector3 } from '@babylonjs/core';
import { GwmWorldItem } from '@nightshifts.inc/world-generator';
import { ContainerWorldItem } from '../ContainerWorldItem';
import { Room } from './Room';
import { World } from '../../World';
import { Point, Polygon } from '@nightshifts.inc/geometry';
import { GameConstants } from '../../../GameConstants';
import { RoomLabelFactory } from './RoomLabelFactory';
const colors = GameConstants.colors;

export class RoomFactory {
    private scene: Scene;
    private roomLabelFactory: RoomLabelFactory;

    constructor(scene: Scene) {
        this.scene = scene;
        this.roomLabelFactory = new RoomLabelFactory(scene);
    }

    public createItem(worldItem: GwmWorldItem, world: World): ContainerWorldItem {
        const translateX = - (world.dimensions.x() / 2);
        const translateY = - (world.dimensions.y() / 2);

        const dimensions  = worldItem.dimensions
            .negateY()
            .translate(new Point(translateX, -translateY));

        const mesh = this.createRoomFloor(dimensions);
        mesh.receiveShadows = true;

        const roomLabel = this.roomLabelFactory.createItem(dimensions, world);
        roomLabel.setVisible(false);

        const room = new Room(mesh, dimensions, 'room');
        room.addChild(roomLabel);
        return room;
    }

    private createRoomFloor(dimensions: Polygon) {
        return MeshBuilder.CreatePolygon(
            'room',
            {
                shape: dimensions.points.map(point => new Vector3(point.x, 2, point.y)),
                depth: 2,
                updatable: true
            },
            this.scene
        );
    }
}
