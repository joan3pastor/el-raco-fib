import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import promise from "redux-promise";

import reducers from "../reducers";
import Root from './Root';


const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

type Props = {};
class App extends Component<Props> {
  render() {
    return (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <View style={{flex:1}}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <Root />
        </View>
      </Provider>
    );
  }
}

export default App;
