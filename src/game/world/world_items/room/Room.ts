import { ContainerWorldItem } from '../ContainerWorldItem';
import { WorldItem } from '../WorldItem';
import { Polygon, GwmWorldItem } from 'game-worldmap-generator';
import { Scene, Vector3, Mesh } from 'babylonjs';
import { Point } from 'game-worldmap-generator/build/model/Point';
import { World } from '../../World';
import { Door } from '../door/Door';
import { VectorModel } from '../../../model/core/VectorModel';

export class Room extends ContainerWorldItem {
    public borderItems: WorldItem[] = [];
    public mesh: Mesh;
    public name: string;
    private boundingPolygon: Polygon;
    public temperature = 20 + Math.floor(Math.random() * 10);
    public isActive: boolean;

    constructor(mesh: Mesh, boundingPolygon: Polygon, name: string) {
        super([]);
        this.name = name;
        this.mesh = mesh;
        this.boundingPolygon = boundingPolygon;
    }

    public getAllMeshes(): Mesh[] {
        return [this.mesh, ...super.getAllMeshes()];
    }

    public getBoundingPolygon(): Polygon {
        return this.boundingPolygon;
    }

    public getCenterPosition(): VectorModel {
        const center = this.boundingPolygon.getBoundingCenter();
        return new VectorModel(center.x, 0, center.y);
    }

    public getDoors(): Door[] {
        return <Door[]> this.borderItems.filter(child => child instanceof Door);
    }

    public static fromGwmWorldItem(gwmWorldItem: GwmWorldItem, scene: Scene, world: World): Room {
        const translateX = - (world.dimensions.x() / 2);
        const translateY = - (world.dimensions.y() / 2);

        const dimensions  = gwmWorldItem.dimensions
            .negateY()
            .translate(new Point(translateX, -translateY));

        const roomMesh = BABYLON.MeshBuilder.CreatePolygon(
            'room',
            {
                shape: dimensions.points.map(point => new Vector3(point.x, 2, point.y)),
                depth: 2,
                updatable: true
            },
            scene
        );


        const room = new Room(roomMesh, dimensions, 'room');
        return room;
    }
}
