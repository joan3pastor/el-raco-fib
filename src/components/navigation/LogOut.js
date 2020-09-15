import React, { Component } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { connect } from 'react-redux';
import _ from 'lodash';
import qs from 'querystring';
import axios from 'axios';

import { revokeURL, clientID } from "../../external_links";
import { deleteToken } from '../../actions';

class LogOut extends Component {

  componentDidMount() {

    const reqBody = {
      token: this.props.token.token,
      client_id: clientID,
    }

    axios.post(revokeURL, qs.stringify(reqBody));

    AsyncStorage.clear().then(this.props.deleteToken());
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#f2f2f2' }}>
        <Text>Logging out...</Text>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return { 
    token: token,
  };
}

export default connect(mapStateToProps, { deleteToken })(LogOut);
