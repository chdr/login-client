import { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import config from '../../config';

class OAuthCallback extends Component {
  constructor(props) {
    super(props);
    this.call = this.call.bind(this);
  }

  componentDidMount() {
    const { location, match } = this.props;
    const { search } = location;
    const { authServer } = match.params;
    this.call({ search, authServer });
  }

  call({ search, authServer }) {
    axios.get(`${config.baseUri}/oauth/${authServer}-callback${search}`,
      { withCredentials: true })
      .then((res) => {
        const { onSuccess } = this.props;
        onSuccess(res);
      })
      .catch((err) => {
        const { onError } = this.props;
        onError(err);
      });
  }

  render() {
    return null;
  }
}

OAuthCallback.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      authServer: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default OAuthCallback;
