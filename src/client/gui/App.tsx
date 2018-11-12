import * as React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import { UserStore } from '../stores/UserStore';
import { UserModel } from '../stores/UserModel';
import Header from './header/Header';
import { RootRoute } from './routes/root/RootRoute';
import { UserActions } from '../stores/UserActions';
import { UserQuery } from '../query/user/UserQuery';
import { Settings } from './routes/settings/Settings';
import Sidebar from './Sidebar';
import { Game } from './Game';

export const GlobalContext = React.createContext<GlobalProps>({
    userStore: null,
    userActions: null
});

export interface GlobalProps {
    userStore: UserStore | null;
    userActions: UserActions | null;
}

export class App extends React.Component<any, AppState> {
    private userStore: UserStore;
    private userActions: UserActions;

    constructor(props: any) {
        super(props);

        this.onUserStoreChange = this.onUserStoreChange.bind(this);
        this.setUser = this.setUser.bind(this);
        this.closeSidebar = this.closeSidebar.bind(this);
        this.openSidebar = this.openSidebar.bind(this);

        this.userStore = new UserStore();
        this.userActions = new UserActions(this.userStore, new UserQuery());

        this.state = {
            user: null,
            isSidebarOpen: false
        };
    }

    public componentDidMount() {
        this.userStore.onChange(this.onUserStoreChange);
    }

    public componentWillUnmount() {
        this.userStore.offChange(this.onUserStoreChange);
    }

    public render() {
        return (
            <GlobalContext.Provider value={{userStore: this.userStore, userActions: this.userActions}}>
                <Router>
                    <div>
                        <Header openSidebar={this.openSidebar}/>
                        <Switch>
                            <Route exact path="/settings" component={Settings}/>
                            <Route component={Game}/>
                        </Switch>
                        <Sidebar isOpen={this.state.isSidebarOpen} close={this.closeSidebar}/>
                        <Route path="/" exact render={(props) => <RootRoute {...props} user={this.state.user}/>}/>
                        <Route path="/login" exact render={(props) => <Login {...props} user={this.state.user} setUser={this.setUser}/>}/>
                        <Route
                            path="/signup"
                            exact
                            render={(props) => <Signup {...props} user={this.state.user} setUser={this.setUser}/>}
                        />
                    </div>
                </Router>
            </GlobalContext.Provider>
        );
    }

    private onUserStoreChange() {
        this.setState({
            user: this.userStore.getModel()
        });
    }

    private setUser(user: UserModel) {
        this.userStore.setModel(user);
    }

    private closeSidebar() {
        this.setState({
            isSidebarOpen: false
        });
    }

    private openSidebar() {
        this.setState({
            isSidebarOpen: true
        });
    }
}

export interface AppState {
    user: UserModel | null;
    isSidebarOpen: boolean;
}
