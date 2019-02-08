import { UserStore } from './UserStore';
import { UserQuery } from '../query/user/UserQuery';
import { AppStore } from './app/AppStore';
import { User } from './User';
import { PasswordUpdateDto } from '../query/user/PasswordUpdateDto';
import { ActionType } from './ActionType';
import { ErrorMessage } from '../gui/ErrorMessage';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import { AppState } from '../state/AppState';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const getUserQuery = (state: AppState) => state.query.user;


export function* loadUser(action: {userQuery: UserQuery}) {
    try {
        const user = yield call(action.userQuery.fetchUser);
        yield put({type: ActionType.GET_USER_SUCCESS, user});
    } catch (error) {
        yield put({type: ActionType.GET_USER_FAILURE});
    }
}

export const loadUserRequest = (userQuery: UserQuery) => {
    return {
        type: ActionType.GET_USER_REQUEST,
        userQuery
    };
};

export function* watchGetUserRequest() {
    yield takeEvery(ActionType.GET_USER_REQUEST, loadUser);
}

export const updateUserRequest = (user: User) => {
    return {
        type: ActionType.UPDATE_USER_REQUEST,
        user
    };
};

export function* updateUser(action: {user: User}) {
    try {
        const userQuery = yield select(getUserQuery);

        const updatedUser = yield call([userQuery, userQuery.updateUser], action.user);
        yield put({type: ActionType.UPDATE_USER_SUCCESS, user: updatedUser});
    } catch (error) {
        throw error;
    }
}

export function* watchUpdateUserRequest() {
    yield takeEvery(ActionType.UPDATE_USER_REQUEST, updateUser);
}

export const signoutRequest = (userQuery: UserQuery) => {
    return {
        type: ActionType.SIGNOUT_REQUEST,
        userQuery
    };
};

export function* signout(action: { userQuery: UserQuery }) {
    action.userQuery.signout();
    yield put({type: ActionType.SIGNOUT_SUCCESS});
}

export function* watchSignoutRequest() {
    yield takeEvery(ActionType.SIGNOUT_REQUEST, signout);
}

export function* loginFacebook(action: { accessToken: string, userQuery: UserQuery }) {
    try {
        const user = yield call(action.userQuery.loginFacebook, action.accessToken);
        yield put({type: ActionType.LOGIN_FACEBOOK_SUCCESS, user});
    } catch (error) {
        throw error;
    }
}

export const loginFacebookRequest = (accessToken: string, userQuery: UserQuery) => {
    return {
        type: ActionType.LOGIN_FACEBOOK_REQUEST,
        accessToken,
        userQuery
    };
};

export function* watchLoginFacebookRequest() {
    yield takeEvery(ActionType.LOGIN_FACEBOOK_REQUEST, loginFacebook);
}

export const signupRequest = (email: string, password: string, userQuery: UserQuery) => {
    return {
        type: ActionType.SIGNUP_REQUEST,
        email,
        password,
        userQuery
    };
};

export function* signup(action: { email: string, password: string, userQuery: UserQuery }) {
    try {
        const user = yield call(action.userQuery.signup, { email: action.email, password: action.password });
        yield put({type: ActionType.SIGNUP_SUCCESS, user});
    } catch (e) {
        yield put({type: ActionType.SIGNUP_FAILURE, errors: [<ErrorMessage> e.response.data]});
    }
}

export function* watchSignupRequest() {
    yield takeEvery(ActionType.SIGNUP_REQUEST, signup);
}

export const updatePassworRequest = (user: User, newPassword: string, oldPassword: string, userQuery: UserQuery) => {
    return {
        type: ActionType.UPDATE_PASSWORD_REQUEST,
        newPassword,
        oldPassword,
        user,
        userQuery
    };
};

export function* updatePassword(action: { user: User, newPassword: string, oldPassword: string, userQuery: UserQuery }) {
    const passwordUpdateDto: PasswordUpdateDto = {
        id: action.user.id,
        oldPassword: action.oldPassword,
        newPassword: action.newPassword
    };
    try {
        yield call(action.userQuery.updatePassword, passwordUpdateDto);
        yield put({ type: ActionType.UPDATE_PASSWORD_SUCCESS});
    } catch (e) {
        yield put({type: ActionType.UPDATE_PASSWORD_FAILURE, errors: [<ErrorMessage> e.response.data]});
    }

}

export function* watchUpdatePassword() {
    yield takeEvery(ActionType.UPDATE_PASSWORD_REQUEST, updatePassword);
}

export const loginRequest = (email: string, password: string, userQuery: UserQuery) => {
    return {
        type: ActionType.LOGIN_REQUEST,
        email,
        password,
        userQuery
    };
};

export function* login(action: { email: string, password: string, userQuery: UserQuery }) {
    try {
        const user = yield call(action.userQuery.login, { email: action.email, password: action.password});
        yield put({ type: ActionType.LOGIN_SUCCESS, user});
    } catch (e) {
        yield put({type: ActionType.LOGIN_FAILURE, errors: [<ErrorMessage> e.response.data]});
    }
}

export function* watchLogin() {
    yield takeEvery(ActionType.LOGIN_REQUEST, login);
}

export const clearErrors = () => {
    return {
        type: ActionType.CLEAR_ERRORS
    };
};

export function* dataLoaded() {
    yield delay(1000);
    yield put({ type: ActionType.DATA_LOADED });
}

export function* watchDataLoadedState() {
    yield takeEvery(
        [
            ActionType.UPDATE_PASSWORD_SUCCESS,
            ActionType.UPDATE_USER_REQUEST
        ],
        dataLoaded
    );
}

export class UserActions {
    private userStore: UserStore;
    private appStore: AppStore;
    private userQuery: UserQuery;

    constructor(userStore: UserStore, appStore: AppStore, userQuery: UserQuery) {
        this.userStore = userStore;
        this.userQuery = userQuery;
        this.appStore = appStore;
    }

    // public loadUser() {
    //     this.userQuery.fetchUser()
    //         .then(user => {
    //             this.userStore.setModel(user);
    //         })
    //         .finally(() => {
    //             const appModel: AppModel = {...this.appStore.getModel(), appState: 'ready'};
    //             this.appStore.setModel(appModel);
    //         });
    // }

    // public updateUser(user: User) {
    //     const appModel: AppModel = {...this.appStore.getModel(), dataLoadingState: 'loading', lastActiontType: ActionType.UPDATE_USER};
    //     this.appStore.setModel(appModel);

    //     this.userQuery.updateUser(user)
    //         .then(updatedUser => {
    //             this.userStore.setModel(updatedUser);
    //             this.appStore.setModel({...this.appStore.getModel(), dataLoadingState: 'recently_loaded'});
    //             this.setLoadedStateAfterDelay();
    //         })
    //         .catch((e) => {
    //             this.userStore.setErrors([<ErrorMessage> e.response.data]);
    //             this.appStore.setModel({...this.appStore.getModel(), dataLoadingState: 'loaded'});
    //         });
    // }

    // public updatePassword(passwordDto: PasswordUpdateDto) {
    //     const appModel: AppModel = {...this.appStore.getModel(), dataLoadingState: 'loading', lastActiontType: ActionType.UPDATE_PASSWORD};
    //     this.appStore.setModel(appModel);

    //     this.userQuery.updatePassword(passwordDto)
    //     .then(() => {
    //         this.appStore.setModel({...this.appStore.getModel(), dataLoadingState: 'recently_loaded'});
    //         this.setLoadedStateAfterDelay();
    //     })
    //     .catch((e) => {
    //         this.userStore.setErrors([<ErrorMessage> e.response.data]);
    //         this.appStore.setModel({...this.appStore.getModel(), dataLoadingState: 'loaded'});
    //     });
    // }

    // public signOut() {
    //     this.userStore.setModel(null);
    // }

    // public loginFacebook(accessToken: string) {
    //     this.userQuery.loginFacebook(accessToken)
    //         .then((user: User) => {
    //             this.userStore.setModel(user);
    //         })
    //         .catch((e) => {
    //             this.userStore.setErrors([<ErrorMessage> e.response.data]);
    //         });
    // }

    // public login(email: string, password: string) {
    //     this.userQuery.login({ email: email, password: password})
    //     .then((user: User) => {
    //         this.userStore.setModel(user);
    //     })
    //     .catch((e) => {
    //         this.userStore.setErrors([<ErrorMessage> e.response.data]);
    //     });
    // }

    // public signup(email: string, password: string) {
    //     this.userQuery.signup({ email, password })
    //         .then((user: User) => {
    //             this.userStore.setModel(user);
    //         })
    //         .catch((e) => {
    //             this.userStore.setErrors([<ErrorMessage> e.response.data]);
    //         });
    // }

    private setLoadedStateAfterDelay() {
        setTimeout(
            () => {
                this.appStore.setModel({...this.appStore.getModel(), dataLoadingState: 'loaded'});
            },
            1000
        );
    }
}

