import { combineReducers } from 'redux';
import { debugReducer } from '../debug_state/debugReducer';
import { WorldRequests } from '../world_state/WorldRequests';
import { UserRequests } from '../user_state/UserRequests';
import { appLoadingStateReducer } from './appLoadingStateReducer';
import { errorsReducer } from './errorsReducer';
import { gameActionDispatcherReducer } from '../world_state/gameActionDispatcherReducer';
import { toolsReducer } from '../tools_state/toolsReducer';
import { userReducer } from '../user_state/userReducer';
import { worldReducer } from '../world_state/worldReducer';

export default combineReducers({
    query: (state = {user: new UserRequests(), game: new WorldRequests(null, null)}) => state,
    world: worldReducer,
    tools: toolsReducer,
    user: userReducer,
    debugOptions: debugReducer,
    appLoadingState: appLoadingStateReducer,
    errors: errorsReducer,
    gameActionDispatcher: gameActionDispatcherReducer
});
