import PropTypes from 'prop-types';
import Workspace from '../models/Workspace';

export default {
  edit: {
    workspace: PropTypes.instanceOf(Workspace).isRequired,
  },
};
