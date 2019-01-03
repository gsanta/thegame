import { StandardMaterial, Scene, MeshBuilder, ShadowGenerator, Light, SpotLight, Vector3 } from 'babylonjs';
import { VectorModel } from './VectorModel';
import { MeshModel } from './MeshModel';
import { Player } from '../creature/type/Player';
import { UserInputEventEmitter } from '../creature/motion/UserInputEventEmitter';
import { CollisionDetector } from '../creature/collision/CollisionDetector';
import { ManualMotionStrategy } from '../creature/motion/ManualMotionStrategy';
import { EyeSensor } from '../creature/sensor/EyeSensor';
import { GameConstants } from '../../GameConstants';
import { MultiMeshModel } from './MultiMeshModel';
import { Door } from '../creature/type/Door';
import { Window } from '../creature/type/Window';
import { ActionStrategy } from '../creature/action/ActionStrategy';
import { WorldMap } from '../../game_map_creator/WorldMap';
import { Furniture } from '../creature/type/Furniture';
import { Promise } from 'es6-promise';
import { Orientation } from '../utils/Orientation';
import { ModelLoader } from './io/ModelLoader';
import { MeshModelTemplate } from './io/MeshModelTemplate';

const colors = GameConstants.colors;

export class MeshFactory {
    private scene: Scene;
    private shadowGenerator: ShadowGenerator;
    private idCounter = 0;
    private spotLight: SpotLight;
    private materialTemplates: {[key: string]: StandardMaterial};
    private modelTemplates: {[key: string]: MeshModelTemplate};

    constructor(
        scene: Scene,
        shadowGenerator: ShadowGenerator,
        spotLight: SpotLight,
        materialTemplates: {[key: string]: StandardMaterial} = MeshFactory.initMaterials(scene),
        modelTemplates: {[key: string]: MeshModelTemplate}
    ) {
        this.scene = scene;
        this.shadowGenerator = shadowGenerator;
        this.spotLight = spotLight;
        this.shadowGenerator = this.createShadow(this.spotLight);
        this.modelTemplates = modelTemplates;
        this.materialTemplates = materialTemplates;
    }

    public createWall(translate: VectorModel, dimensions: VectorModel): Promise<MeshModel> {
        const mesh = MeshBuilder.CreateBox(
            'wall-' + this.idCounter++,
            { width: dimensions.x(), depth: dimensions.z(), height: dimensions.y() },
            this.scene
        );

        mesh.checkCollisions = true;
        mesh.isPickable = true;
        mesh.material = this.materialTemplates.wall;
        mesh.receiveShadows = true;

        const meshModel = new MeshModel(mesh);
        meshModel.translate(translate);
        meshModel.translate(new VectorModel(0, dimensions.y() / 2, 0));

        const shadowMap = this.shadowGenerator.getShadowMap();
        if (shadowMap && shadowMap.renderList) {
            shadowMap.renderList.push(mesh);
        }

        meshModel.name = 'wall';

        return Promise.resolve(meshModel);
    }

    public createPlayer(translate: VectorModel, worldMap: WorldMap): Promise<MeshModel> {
        const keyboardHandler = new UserInputEventEmitter();

        const player = new Player(this.scene, this.spotLight, translate, keyboardHandler);

        const actionStrategy = new ActionStrategy(player, worldMap);

        const collisionDetector = new CollisionDetector(player, this.scene)
        const manualMotionStrategy = new ManualMotionStrategy(player, collisionDetector, keyboardHandler);
        keyboardHandler.subscribe();

        player.setMotionStrategy(manualMotionStrategy)
        player.setSensor(new EyeSensor(player, this.scene));
        player.setActionStrategy(actionStrategy);

        return Promise.resolve(player);
    }

    public createWindow(
        translate: VectorModel, dimensions: VectorModel, pivotPosition1?: VectorModel, pivotPosition2?: VectorModel, pivotAngle?: number
    ): Promise<MeshModel> {
        const bottom = MeshBuilder.CreateBox(
            'window-' + this.idCounter++,
            { width: dimensions.x(), depth: dimensions.z(), height: dimensions.y() / 6 },
            this.scene
        );

        bottom.translate(new Vector3(0, - dimensions.y() / 2 + dimensions.y() / 12, 0), 1);

        bottom.checkCollisions = true;
        bottom.isPickable = true;
        bottom.material = this.materialTemplates.wall;
        bottom.receiveShadows = true;

        const isHorizontal = dimensions.x() > dimensions.y();

        let [middle1, middle2] = isHorizontal ? this.createHorizontalWindowMeshes(dimensions) : this.createVerticalWindowMeshes(dimensions);

        const top = MeshBuilder.CreateBox(
            'window-' + this.idCounter++,
            { width: dimensions.x(), depth: dimensions.z(), height: dimensions.y() / 6 },
            this.scene
        );

        top.translate(new Vector3(0, dimensions.y() / 2 - dimensions.y() / 12, 0), 1);

        top.checkCollisions = true;
        top.isPickable = true;
        top.material = this.materialTemplates.wall;
        top.receiveShadows = true;

        let meshModel: MeshModel;

        if (pivotPosition1) {
            meshModel = new Window([bottom, middle1, middle2, top], pivotPosition1, pivotPosition2, pivotAngle);
        } else {
            meshModel = new MultiMeshModel([bottom, middle1, middle2, top]);
        }


        meshModel.translate(translate);
        meshModel.translate(new VectorModel(0, dimensions.y() / 2, 0));

        const shadowMap = this.shadowGenerator.getShadowMap();
        if (shadowMap && shadowMap.renderList) {
            shadowMap.renderList.push(bottom, middle1, middle2, top);
        }

        meshModel.name = 'window';

        return Promise.resolve(meshModel);
    }

    private createHorizontalWindowMeshes(dimensions: VectorModel) {
        const middle1 = MeshBuilder.CreateBox(
            'window-' + this.idCounter++,
            { width: dimensions.x() / 2, depth: dimensions.z(), height: 4 * dimensions.y() / 6 },
            this.scene
        );

        middle1.translate(new Vector3(- dimensions.x() / 4, 0, 0), 1);

        middle1.checkCollisions = true;
        middle1.isPickable = true;
        middle1.material = this.materialTemplates.window;
        middle1.receiveShadows = true;

        const middle2 = MeshBuilder.CreateBox(
            'window-' + this.idCounter++,
            { width: dimensions.x() / 2, depth: dimensions.z(), height: 4 * dimensions.y() / 6 },
            this.scene
        );

        middle2.translate(new Vector3(+ dimensions.x() / 4, 0, 0), 1);

        middle2.checkCollisions = true;
        middle2.isPickable = true;
        middle2.material = this.materialTemplates.window;
        middle2.receiveShadows = true;

        return [middle1, middle2];
    }

    private createVerticalWindowMeshes(dimensions: VectorModel) {
        const middle1 = MeshBuilder.CreateBox(
            'window-' + this.idCounter++,
            { width: dimensions.x(), depth: dimensions.z() / 2, height: 4 * dimensions.y() / 6 },
            this.scene
        );

        middle1.translate(new Vector3(0, 0, dimensions.z() / 4), 1);

        middle1.checkCollisions = true;
        middle1.isPickable = true;
        middle1.material = this.materialTemplates.window;
        middle1.receiveShadows = true;

        const middle2 = MeshBuilder.CreateBox(
            'window-' + this.idCounter++,
            { width: dimensions.x(), depth: dimensions.z() / 2, height: 4 * dimensions.y() / 6 },
            this.scene
        );

        middle2.translate(new Vector3(0, 0, -dimensions.z() / 4), 1);

        middle2.checkCollisions = true;
        middle2.isPickable = true;
        middle2.material = this.materialTemplates.window;
        middle2.receiveShadows = true;

        return [middle1, middle2];
    }


    public createDoor(translate: VectorModel, dimensions: VectorModel, pivotPosition?: VectorModel, pivotAngle?: number): Promise<MeshModel> {
        const mesh = MeshBuilder.CreateBox(
            'door-' + this.idCounter++,
            { width: dimensions.x(), depth: dimensions.z(), height: dimensions.y() },
            this.scene
        );

        mesh.checkCollisions = true;
        mesh.isPickable = true;
        mesh.material = this.materialTemplates.door;
        mesh.receiveShadows = true;

        let meshModel: MeshModel;

        if (pivotPosition) {
            meshModel = new Door(mesh, pivotPosition, pivotAngle);
        } else {
            meshModel = new MeshModel(mesh);
        }

        meshModel.translate(translate);
        meshModel.translate(new VectorModel(0, dimensions.y() / 2, 0));

        const shadowMap = this.shadowGenerator.getShadowMap();
        if (shadowMap && shadowMap.renderList) {
            shadowMap.renderList.push(mesh);
        }

        meshModel.name = 'door';

        return Promise.resolve(meshModel);
    }

    public createFloor(translate: VectorModel, dimensions: VectorModel): Promise<MeshModel> {
        const ground = BABYLON.MeshBuilder.CreateGround(
            'ground',
            { width: dimensions.x(), height: dimensions.z() },
            this.scene
        );

        ground.receiveShadows = true;
        ground.material = this.materialTemplates.floor;

        const meshModel = new MeshModel(ground);
        meshModel.name = 'floor';
        translate.setZ(-2);
        meshModel.translate(translate);

        return Promise.resolve(meshModel);
    }

    public createBed(translate: VectorModel): Promise<MeshModel> {
        return Furniture
            .createBed(this.scene, translate, '/models/furniture/', 'bed.babylon', 'beds.png')
            .then(meshModel => {
                const shadowMap = this.shadowGenerator.getShadowMap();
                if (shadowMap && shadowMap.renderList) {
                    shadowMap.renderList.push(meshModel.mesh);
                }

                return meshModel;
            });
    }

    public createTableWide(translate: VectorModel): Promise<MeshModel> {
        return Furniture
            .createTableWide(this.scene, translate)
            .then(meshModel => {
                const shadowMap = this.shadowGenerator.getShadowMap();
                if (shadowMap && shadowMap.renderList) {
                    shadowMap.renderList.push(meshModel.mesh);
                }

                return meshModel;
            });
    }

    public createTable(translate: VectorModel): Promise<MeshModel> {
        return Furniture
            .createTable(this.scene, translate, '/models/furniture/', 'table.babylon', 'furniture.png')
            .then(meshModel => {
                const shadowMap = this.shadowGenerator.getShadowMap();
                if (shadowMap && shadowMap.renderList) {
                    shadowMap.renderList.push(meshModel.mesh);
                }

                return meshModel;
            });
    }

    public createCupboard(translate: VectorModel): Promise<MeshModel> {
        const cupboard = Furniture.createCupboard(this.scene, translate, this.modelTemplates.cupboard, this.materialTemplates.cupboard);

        const shadowMap = this.shadowGenerator.getShadowMap();
        if (shadowMap && shadowMap.renderList) {
            shadowMap.renderList.push(cupboard.mesh);
        }

        return Promise.resolve(cupboard);
    }

    public createCupboardWithShelves(translate: VectorModel, orientation: Orientation): Promise<MeshModel> {
        return Furniture
            .createCupboardWithShelves(this.scene, translate, orientation)
            .then(meshModel => {
                const shadowMap = this.shadowGenerator.getShadowMap();
                if (shadowMap && shadowMap.renderList) {
                    shadowMap.renderList.push(meshModel.mesh);
                }

                return meshModel;
            });
    }

    private createShadow(spotLight: SpotLight): ShadowGenerator {
        const shadowGenerator = new BABYLON.ShadowGenerator(1024, spotLight);
        shadowGenerator.usePoissonSampling = true;

        return shadowGenerator;
    }

    public static importModels(scene: Scene): Promise<{[key: string]: MeshModelTemplate}> {
        const furnitureLoader = new ModelLoader('/models/furniture/', scene);

        const cupboard = furnitureLoader.load('cupboard.babylon');

        return Promise.all([cupboard])
            .then((values) => {
                return {
                    cupboard: values[0]
                };
            });
    }

    public static initMaterials(scene: Scene): {[key: string]: StandardMaterial} {
        const door = new BABYLON.StandardMaterial('doorMaterial', scene);
        door.diffuseColor = new BABYLON.Color3(colors.door.r, colors.door.g, colors.door.b);

        const window = new BABYLON.StandardMaterial('windowMaterial', scene);
        window.diffuseColor = BABYLON.Color3.FromHexString(colors.window);

        const wall = new BABYLON.StandardMaterial('wallMaterial', scene);
        wall.diffuseColor = BABYLON.Color3.FromHexString(colors.wall);
        wall.emissiveColor = BABYLON.Color3.FromHexString('#111111');


        const floor = new BABYLON.StandardMaterial('floorMaterial', scene);
        floor.diffuseColor = BABYLON.Color3.FromHexString(colors.floor);

        const cupboard = new BABYLON.StandardMaterial('cupboard-material', scene);
        cupboard.diffuseTexture = new BABYLON.Texture(`models/furniture/furniture.png`, scene);

        return {
            door,
            window,
            wall,
            floor,
            cupboard
        };
    }
}
