import { World } from '../../../world/World';
import { Room } from '../../../world/world_items/room/Room';
import { GameActionType } from '../../GameActionType';
import { ActionHandler } from '../../ActionHandler';
import { NormalLightSwitcher } from './NormalLightSwitcher';
import { FlashingLightSwitcher } from './FlashingLightSwitcher';
import _ from 'lodash';


//TODO: better naming needed because now this handles `SHOW_ROOM_NAMES` action also
export class ActiveRoomLightingActionHandler implements ActionHandler {
    private static instance: ActiveRoomLightingActionHandler;

    private prevActiveRoom: Room;
    private lightSwitcher: NormalLightSwitcher;
    private flashingLightSwitcher: FlashingLightSwitcher;
    private isShowCeiling = false;

    private constructor() {
        this.lightSwitcher = new NormalLightSwitcher();
        this.flashingLightSwitcher = new FlashingLightSwitcher(this.lightSwitcher);
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new ActiveRoomLightingActionHandler();
        }

        return this.instance;
    }

    public handle(type: string, world: World, payload: Room | boolean) {

        switch (type) {
            case GameActionType.GAME_IS_READY:
                this.handleGameIsReady(world);
                return;
            case GameActionType.ENTER_ROOM:
                this.handleEnterRoom(<Room> payload, world);
                if (this.isShowCeiling) {
                    this.handleShowRoomLabels(world);
                }
                return;
            case GameActionType.TURN_ON_ALL_LIGHTS:
                this.handleTurnOnAllLights(world);
                return;
            case GameActionType.TURN_OFF_LIGHTS_FOR_NOT_ACTIVE_ROOMS:
                this.handleTurnOffLightsForNotActiveRoom(world);
                return;

            case GameActionType.SHOW_ROOM_NAMES:
                if (payload) {
                    this.handleShowRoomLabels(world);
                    this.isShowCeiling = true;
                } else {
                    this.hideCeiling(world);
                    this.isShowCeiling = false;
                }
                return;
            default:
                return;
        }
    }

    private hideCeiling(world: World) {
        world.getWorldItemsByName('room')
            .forEach((room: Room) => {
                room.children.filter(child => child.type === 'room-label').forEach(roomLabel => roomLabel.setVisible(false));
            });
    }

    private showCeiling(world: World) {
        world.getWorldItemsByName('room')
        .forEach((room: Room) => {
            room.children.filter(child => child.type === 'room-label').forEach(roomLabel => roomLabel.setVisible(true));
        });
    }

    private handleShowRoomLabels(world: World) {
        const rooms = <Room[]> world.getWorldItemsByName('room');
        const activeRoom = _.find(rooms, room => room.isActive);
        _.chain(world.getWorldItemsByName('room'))
            .without(activeRoom)
            .forEach((room: Room) => {
                room.children.filter(child => child.type === 'room-label').forEach(roomLabel => roomLabel.setVisible(true));
            })
            .value();

        activeRoom.children.filter(child => child.type === 'room-label').forEach(roomLabel => roomLabel.setVisible(false));
    }

    private handleEnterRoom(activeRoom: Room, world: World) {
        if (activeRoom.lampBehaviour === 'onWhenActive') {
            this.lightSwitcher.on(activeRoom, world);
        } else if (activeRoom.lampBehaviour === 'flashesWhenEntering') {
            this.flashingLightSwitcher.on(activeRoom, world)
                .then(() => this.lightSwitcher.off(activeRoom, world));
        }

        if (this.prevActiveRoom) {
            this.lightSwitcher.off(this.prevActiveRoom, world);
        }

        this.prevActiveRoom = activeRoom;
    }

    private handleGameIsReady(world: World) {
        world.getWorldItemsByName('room').forEach(room => {
            this.lightSwitcher.off(<Room> room, world);
        });
    }

    private handleTurnOnAllLights(world: World) {
        world.getWorldItemsByName('room').forEach(room => {
            this.lightSwitcher.on(<Room> room, world);
        });
    }

    private handleTurnOffLightsForNotActiveRoom(world: World) {
        world.getWorldItemsByName('room').forEach(room => {
            if ((<Room> room).isActive) {
                this.prevActiveRoom = <Room> room;
                this.lightSwitcher.on(<Room> room, world);
            } else {
                this.lightSwitcher.off(<Room> room, world);
            }
        });
    }
}
