import { MotionStrategy } from './motion_actions/MotionStrategy';
import { ServiceFacade } from './ServiceFacade';
import { ManualMotionStrategy } from './motion_actions/ManualMotionStrategy';
import { World } from '../world/World';
import { RotationDirection } from './motion_actions/UserInputEventEmitter';

export enum Keys {
    FORWARD = 38,
    BACKWARD = 40,
    LEFT = 37,
    RIGHT = 39,
    W = 87,
    D = 68,
    A = 65,
    S = 83,
    E = 69,
    SPACE = 32
}

export class KeyboardHandler {
    private services: ServiceFacade;
    private motionStrategy: ManualMotionStrategy;
    private moveAnimationFrameTimestamp: number = null;
    private rotationAnimationFrameTimestamp: number = null;
    private prevMoveTime: number = null;
    private prevRotationTime: number = null;
    private activeMoveDirection: Keys.FORWARD | Keys.BACKWARD = null;
    private activeRotationDirection: Keys.LEFT | Keys.RIGHT = null;
    private world: World;

    constructor(services: ServiceFacade, motionStrategy: ManualMotionStrategy, world: World) {
        this.services = services;
        this.motionStrategy = motionStrategy;
        this.world = world;
    }

    public onKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case Keys.FORWARD:
                if (this.activeMoveDirection !== Keys.FORWARD) {
                    this.world.scene.beginAnimation(this.world.player.skeleton, 0, 100, true, 1.0);
                    this.activeMoveDirection = Keys.FORWARD;
                    this.forward();
                }
                break;
            case Keys.BACKWARD:
                this.backward();
                break;
            case Keys.LEFT:
                if (this.activeRotationDirection !== Keys.LEFT) {
                    this.turnLeft();
                    this.activeRotationDirection = Keys.LEFT;
                }
                break;
            case Keys.RIGHT:
                if (this.activeRotationDirection !== Keys.RIGHT) {
                    this.turnRight();
                    this.activeRotationDirection = Keys.RIGHT;
                }
                break;
            case Keys.SPACE:
                this.doAction();
                break;
            default:
                break;
        }
    }

    public onKeyUp(event: KeyboardEvent) {
        switch (event.keyCode) {
            case Keys.FORWARD:
            case Keys.BACKWARD:
                this.activeMoveDirection = null;
                this.world.scene.stopAnimation(this.world.player.skeleton);
                if (this.moveAnimationFrameTimestamp !== null) {
                    cancelAnimationFrame(this.moveAnimationFrameTimestamp);
                    this.moveAnimationFrameTimestamp = null;
                }
                break;

            case Keys.LEFT:
            case Keys.RIGHT:
                this.prevRotationTime = null;
                this.activeRotationDirection = null;
                if (this.rotationAnimationFrameTimestamp !== null) {
                    cancelAnimationFrame(this.rotationAnimationFrameTimestamp);
                    this.rotationAnimationFrameTimestamp = null;
                }
                break;
            default:
                break;
        }
    }

    private forward() {
        this.moveAnimationFrameTimestamp = requestAnimationFrame(() => {

            if (this.moveAnimationFrameTimestamp !== null) {
                this.forward.bind(this)();
            }
            const currentTime = Date.now();

            if (this.prevMoveTime) {
                const elapsedTime = currentTime - this.prevMoveTime;

                const delta = this.motionStrategy.calcNextPositionDelta(elapsedTime, 'FORWARD');
                this.services.playerService.move(delta);
            }
            this.prevMoveTime = currentTime;
        });
    }

    private turnLeft() {
        this.rotationAnimationFrameTimestamp = requestAnimationFrame(() => {
            this.rotate('LEFT');

            if (this.rotationAnimationFrameTimestamp !== null) {
                this.turnLeft.bind(this)();
            }
        });
    }

    private turnRight() {
        this.rotationAnimationFrameTimestamp = requestAnimationFrame(() => {
            this.rotate('RIGHT');

            if (this.rotationAnimationFrameTimestamp !== null) {
                this.turnRight.bind(this)();
            }
        });
    }

    private doAction() {

    }

    private backward() {

    }

    private rotate(direction: RotationDirection) {
        const currentTime = Date.now();

        if (this.prevRotationTime) {
            const elapsedTime = currentTime - this.prevRotationTime;

            const delta = this.motionStrategy.calcNextRotationDelta(elapsedTime, direction);
            this.world.player.rotateY(delta);
        }
        this.prevRotationTime = currentTime;
    }
}