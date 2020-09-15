import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import { connect } from 'react-redux';
import _ from 'lodash';

import Login from './Login';
import Home from './Home';
import { tokenToRedux, updateConnexion, changeLanguage, loadLanguage } from '../actions';

class Root extends Component {

  componentDidMount() {

    // Load language pack
    this.props.loadLanguage();
    
    // Load token from async-storage:
    if (_.isUndefined(this.props.token.token) || _.isEmpty(this.props.token.token)) {
      AsyncStorage.getItem('token').then((unparsedToken)=>{
        token = JSON.parse(unparsedToken);
        if (!_.isNull(token)) {
          this.props.tokenToRedux(token);
        }
      }).catch(() => console.error('error loading token from local storage'));
    }
  }

  render() {

    if (_.isEmpty(this.props.token.token) || _.isEmpty(this.props.lang)) {
      return (
        <Login />
      );
    }
    
    return (
      <Home />
    );
    
  }
}

function mapStateToProps(state) {
  return { 
      token: state.token,
      hasConnexion: state.hasConnexion,
      lang: state.lang,
    };
}

export default connect(mapStateToProps, { tokenToRedux, updateConnexion, changeLanguage, loadLanguage })(Root);
