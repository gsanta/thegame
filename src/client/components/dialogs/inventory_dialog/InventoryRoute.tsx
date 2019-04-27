
import { AppState } from '../../../state/app_state/AppState';
import GrabToolActions from '../../../state/tools_state/tools_actions/GrabToolActions';
import { connect } from 'react-redux';
import { Tool } from '../../../../game/tools/Tool';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as React from 'react';
import InventoryDialog, { InventoryDialogProps } from './InventoryDialog';
import ReleaseToolActions from '../../../state/tools_state/tools_actions/ReleaseToolActions';

const mapStateToProps = (state: AppState) => {
    return {
        tools: state.tools
    };
};

const mapDispatchToProps = dispatch => ({
    grabTool: (tool: Tool) => dispatch(GrabToolActions.request(tool)),
    releaseTool: (tool: Tool) => dispatch(ReleaseToolActions.request(tool))
});

export const InventoryRoute = withRouter(connect(mapStateToProps, mapDispatchToProps)((props: RouteComponentProps & InventoryDialogProps) => {
    const headerOptions = {
        close: () => props.history.push('/'),
        title: 'inventory'
    };

    return (
        <InventoryDialog {...props} headerOptions={headerOptions}/>
    );
}));
