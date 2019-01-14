import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { gaPage } from '../../lib/analytics';
import { state } from '../../features/workspaces/state';
import WorkspacesDashboard from '../../components/settings/workspaces/WorkspacesDashboard';
import ErrorBoundary from '../../components/util/ErrorBoundary';

@inject('actions') @observer
class WorkspacesScreen extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      workspace: PropTypes.shape({
        edit: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  componentDidMount() {
    gaPage('Settings/Workspaces Dashboard');
  }

  render() {
    const { workspace } = this.props.actions;
    return (
      <ErrorBoundary>
        <WorkspacesDashboard
          workspaces={state.workspaces}
          isLoading={state.isLoading}
          onWorkspaceClick={w => workspace.edit({ workspace: w })}
        />
      </ErrorBoundary>
    );
  }
}

export default WorkspacesScreen;
