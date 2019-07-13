import { World } from '../world/World';
import { WorldItem } from '../world/world_items/item_types/WorldItem';
import { LightSwitcher } from './environment_actions/active_room_lightning_action/LightSwitcher';
import { NormalLightSwitcher } from './environment_actions/active_room_lightning_action/NormalLightSwitcher';
import { ServiceFacade } from '../services/ServiceFacade';

export class DebugServices {
    private world: World;
    private services: ServiceFacade;
    private lightSwitcher: LightSwitcher;

    constructor(services: ServiceFacade, world: World) {
        this.services = services;
        this.world = world;
        this.lightSwitcher = new NormalLightSwitcher();
    }

    public displayRoofs() {
        this.services.activeRoomService.isShowRoofs = true;
        this.services.activeRoomService.calcActiveRoomAtPoint(this.world.player.mesh.getAbsolutePosition());
    }

    public hideRoofs() {
        this.world.getWorldItemsByName('room')
            .forEach((room: WorldItem) => {
                room.getChildren().filter(child => child.type === 'room-label').forEach(roomLabel => roomLabel.setVisible(false));
            });
        this.services.activeRoomService.isShowRoofs = false;
    }

    public displayBoundingBoxes() {
        this.world.config.displayBoundingBoxes = true;
        this.world.worldItems.forEach(item => {
            if (item.getBoundingMesh()) {
                item.getBoundingMesh().isVisible = true;
            }
        });
    }

    public hideBoundingBoxes() {
        this.world.config.displayBoundingBoxes = false;
        this.world.worldItems.forEach(item => {
            if (item.getBoundingMesh()) {
                item.getBoundingMesh().isVisible = false;
            }
        });
    }

    public turnOnAllLights() {
        this.world.getWorldItemsByName('room').forEach(room => {
            this.lightSwitcher.on(<WorldItem> room, this.world);
        });
    }

    public turnOffAllLights() {
        this.world.getWorldItemsByName('room').forEach(room => {
            this.lightSwitcher.off(<WorldItem> room, this.world);
        });
    }
}
