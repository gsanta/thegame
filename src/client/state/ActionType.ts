export enum ActionType {
    UPDATE_USER = 'UPDATE_USER',
    UPDATE_PASSWORD = 'UPDATE_USER',

    LOGIN = 'LOGIN',

    SIGNOUT_REQUEST = 'SIGNOUT_REQUEST',
    SIGNOUT_SUCCESS = 'SIGNOUT_SUCCESS',
    SIGNOUT_FAILURE = 'SIGNOUT_FAILURE',

    SIGNUP_REQUEST = 'SIGNUP_REQUEST',
    SIGNUP_SUCCESS = 'SIGNUP_SUCCESS',
    SIGNUP_FAILURE = 'SIGNUP_FAILURE',

    LOGIN_FACEBOOK_REQUEST = 'LOGIN_FACEBOOK_REQUEST',
    LOGIN_FACEBOOK_SUCCESS = 'LOGIN_FACEBOOK_SUCCESS',
    LOGIN_FACEBOOK_FAILURE = 'LOGIN_FACEBOOK_FAILURE',

    LOGIN_REQUEST = 'LOGIN_REQUEST',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',

    GET_USER_REQUEST = 'GET_USER_REQUEST',
    GET_USER_SUCCESS = 'GET_USER_SUCCESS',
    GET_USER_FAILURE = 'GET_USER_FAILURE',

    UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST',
    UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS',
    UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE',

    UPDATE_PASSWORD_REQUEST = 'UPDATE_PASSWORD_REQUEST',
    UPDATE_PASSWORD_SUCCESS = 'UPDATE_PASSWORD_SUCCESS',
    UPDATE_PASSWORD_FAILURE = 'UPDATE_PASSWORD_FAILURE',

    GET_WORLD_REQUEST = 'GET_WORLD_REQUEST',
    GET_WORLD_SUCCESS = 'GET_WORLD_SUCCESS',
    GET_WORLD_FAILURE = 'GET_WORLD_FAILURE',

    SET_WORLD_REQUEST = 'SET_WORLD',

    DATA_LOADED = 'DATA_LOADED',

    CLEAR_ERRORS = 'CLEAR_ERRORS',

    UPDATE_GAME_REQUEST = 'UPDATE_GAME_REQUEST',
    UPDATE_GAME_SUCCESS = 'UPDATE_GAME_SUCCESS',
    UPDATE_GAME_FAILURE = 'UPDATE_GAME_FAILURE',

    GRAB_TOOL = 'GRAB_TOOL'
}

export interface WatchableAction<T> {
    request(payload: T);
    watch();
}

export interface WatchableActionConstructor<T> {
    new (): WatchableAction<T>;
    prototype: any;
}
