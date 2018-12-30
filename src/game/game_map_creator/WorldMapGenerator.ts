import { MeshFactory } from '../model/core/MeshFactory';
import { VectorModel } from '../model/core/VectorModel';
import { WorldMap } from './WorldMap';
import { Rectangle, GameObject, GameObjectParser } from 'game-worldmap-generator';
import { MeshModel } from '../model/core/MeshModel';
import { number } from 'prop-types';
import { Player } from '../model/creature/type/Player';


export class WorldMapGenerator {
    private meshFactory: MeshFactory;
    private gameObjectToMeshSizeRatio: number;
    private gameObjectParser: GameObjectParser;

    constructor(gameObjectParser: GameObjectParser, meshFactory: MeshFactory, gameObjectToMeshSizeRatio = 10) {
        this.gameObjectParser = gameObjectParser;
        this.meshFactory = meshFactory;
        this.gameObjectToMeshSizeRatio = gameObjectToMeshSizeRatio;
    }

    public create(worldMapStr: string): WorldMap {
        const worldMap = new WorldMap();
        const gameObjects = this.gameObjectParser.parse(worldMapStr);
        const worldDimensions = this.getWorldDimensions(gameObjects);
        const meshes = gameObjects.map(gameObject => this.createMesh(gameObject, worldDimensions, worldMap))
            .filter(mesh => mesh);

        worldMap.gameObjects = meshes.filter(mesh => mesh.name !== 'floor');
        worldMap.floor = meshes.filter(mesh => mesh.name === 'floor')[0];
        worldMap.player = <Player> meshes.filter(mesh => mesh.name === 'player')[0];

        return worldMap;
    }

    private createMesh(gameObject: GameObject, worldDimensions: { width: number, height: number }, worldMap: WorldMap): any {

        const translate = this.rectangleToTranslateVector(gameObject.dimensions, worldDimensions);
        const dimensions = this.rectangleToDimensionVector(gameObject.dimensions);

        switch(gameObject.name) {
            case 'wall':
                return this.meshFactory.createWall(translate, dimensions);
            case 'door':
                if (gameObject.additionalData) {
                    const pivotVector = this.getPivotVector(gameObject.dimensions, gameObject.additionalData.axis);
                    return this.meshFactory.createDoor(translate, dimensions, pivotVector, BABYLON.Tools.ToRadians(gameObject.additionalData.angle));
                }
                return this.meshFactory.createDoor(translate, dimensions);
            case 'window':
                return this.meshFactory.createWindow(translate, dimensions);
            case 'floor':
                return this.meshFactory.createFloor(translate, dimensions);
            case 'player':
                return this.meshFactory.createPlayer(translate, worldMap);
            default:
                throw new Error('Unknown GameObject type: ' + gameObject.name);
        }
    }

    private rectangleToTranslateVector(rect: Rectangle, worldDimensions: { width: number, height: number }): VectorModel {
        const x = (rect.left + rect.width / 2) * this.gameObjectToMeshSizeRatio - (worldDimensions.width / 2) * this.gameObjectToMeshSizeRatio;
        const z = (-rect.top - rect.height / 2) * this.gameObjectToMeshSizeRatio + (worldDimensions.height / 2) * this.gameObjectToMeshSizeRatio;
        return new VectorModel(x, 0, z);
    }

    private rectangleToDimensionVector(rect: Rectangle): VectorModel {
        return new VectorModel(rect.width * this.gameObjectToMeshSizeRatio, 5, rect.height * this.gameObjectToMeshSizeRatio);
    }

    private getWorldDimensions(gameObjects: GameObject[]): { width: number, height: number } {
        const floor = gameObjects.filter(gameObject => gameObject.name === 'floor')[0];

        return {
            width: floor.dimensions.width,
            height: floor.dimensions.height
        };
    }

    private getPivotVector(rect: Rectangle, pivotAxis: {x: number, y: number}) {
        const isDoorHorizontal = () => rect.width > rect.height;

        if (isDoorHorizontal()) {
            if (pivotAxis.x === rect.left) {
                return new VectorModel(rect.width / 2, 0, 0).scale(this.gameObjectToMeshSizeRatio);
            } else if (pivotAxis.x === rect.left + rect.width) {
                return new VectorModel(- rect.width / 2, 0, 0).scale(this.gameObjectToMeshSizeRatio);
            }
        }
    }
}