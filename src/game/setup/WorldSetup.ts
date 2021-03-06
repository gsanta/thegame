import { World } from '../model/game_objects/World';
import { CameraSetup } from './CameraSetup';
import { MainLightSetup } from './MainLightSetup';


export class WorldSetup {
    private cameraSetup: CameraSetup;
    private lightSetup: MainLightSetup;

    constructor(cameraSetup: CameraSetup, lightSetup: MainLightSetup) {
        this.cameraSetup = cameraSetup;
        this.lightSetup = lightSetup;
    }

    public setup(world: World): World {
        world.camera = this.cameraSetup.createCamera(world.scene, world.player);
        world.environmentLight = this.lightSetup.createEnvironmentLight(world);
        world.roomLight = this.lightSetup.createRoomLight(world.scene);
        world.roomLight.intensity = 1;
        return world;
    }
}