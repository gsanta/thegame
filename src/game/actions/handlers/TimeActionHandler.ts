import { ActionHandler } from '../../../engine/actions/ActionHandler';
import { Room } from '../../../engine/world_items/Room';
import { World } from '../../model/World';
import { GameActionType } from '../GameActionType';
import { ActionDispatcher } from '../../../engine/actions/ActionDispatcher';
import { Timer } from './Timer';


export class TimeActionHandler implements ActionHandler {
    private actionDispatcher: ActionDispatcher;

    private timer: Timer;
    // private currentDayTimer =

    constructor(actionDispatcher: ActionDispatcher) {
        this.actionDispatcher = actionDispatcher;
    }

    public handle(type: string) {
        switch (type) {
            case GameActionType.GAME_IS_READY:
                this.timer = new Timer(100);
                this.timer.onDayPassed(() => this.onHourPassed());
                break;
            default:
                break;
        }
    }

    private onHourPassed() {
        this.actionDispatcher.dispatch(GameActionType.DAY_PASSED);
    }
}
