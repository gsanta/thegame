import { UserStore } from './UserStore';
import { UserQuery } from '../query/user/UserQuery';
import { AppStore } from './app/AppStore';
import { AppModel } from './app/AppModel';
import { User } from './User';

export class UserActions {
    private userStore: UserStore;
    private appStore: AppStore;
    private userQuery: UserQuery;

    constructor(userStore: UserStore, appStore: AppStore, userQuery: UserQuery) {
        this.userStore = userStore;
        this.userQuery = userQuery;
        this.appStore = appStore;
    }

    public loadUser() {
        this.userQuery.fetchUser()
            .then(user => {
                this.userStore.setModel(user);
            })
            .finally(() => {
                const appModel: AppModel = {...this.appStore.getModel(), appState: 'ready'};
                this.appStore.setModel(appModel);
            });
    }

    public updateUser(user: User) {
        const appModel: AppModel = {...this.appStore.getModel(), dataLoadingState: 'loading'};

        this.appStore.setModel(appModel);

        this.userQuery.updateUser(user)
            .then(updatedUser => {
                this.userStore.setModel(updatedUser);
                this.appStore.setModel({...this.appStore.getModel(), dataLoadingState: 'recently_loaded'});
                this.setLoadedStateAfterDelay();
            })
            .catch(() => {
                this.appStore.setModel({...this.appStore.getModel(), dataLoadingState: 'recently_loaded'});
                this.setLoadedStateAfterDelay();
            });
    }

    public signOut() {
        this.userStore.setModel(null);
    }

    public fetchUser() {}

    private setLoadedStateAfterDelay() {
        setTimeout(
            () => {
                this.appStore.setModel({...this.appStore.getModel(), dataLoadingState: 'loaded'});
            },
            1000
        );
    }
}

