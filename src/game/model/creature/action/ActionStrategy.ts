import { Player } from '../type/Player';
import { WorldMap } from '../../../game_map_creator/WorldMap';
import { MeshModel } from '../../core/MeshModel';
import { GameObject } from 'game-worldmap-generator';
import { VectorModel } from '../../core/VectorModel';


export class ActionStrategy {
    private player: Player;
    private worldMap: WorldMap;
    private actionableObjects: MeshModel[];

    constructor(player: Player, worldMap: WorldMap) {
        this.player = player;
        this.worldMap = worldMap;
    }

    /**
     * If there is an `Actionable` mesh nearby it activates the default action on that mesh
     */
    public activateClosestMeshAction() {
        this.actionableObjects = this.filterActionableObjects(this.worldMap);
        const reduceToClosestMeshModel = (val: [MeshModel, number], current: MeshModel): [MeshModel, number] => {
            const distance = VectorModel.Distance(this.player.getCenterPosition(), current.getPosition());
            return !val || val[1] > distance ? [current, distance] : val;
        };

        const meshModelAndDistanceTuple = this.actionableObjects.reduce(reduceToClosestMeshModel, null);

        if (meshModelAndDistanceTuple) {
            meshModelAndDistanceTuple[0].doDefaultAction();
        }
    }

    private filterActionableObjects(worldMap: WorldMap) {
        return worldMap.gameObjects.filter(obj => obj.hasDefaultAction);
    }
}