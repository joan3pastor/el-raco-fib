import React, { Component } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import _ from 'lodash';
import {salesBiblioteca} from "../../external_links";

import {  } from '../../actions';

class SalesBibl extends Component {

  render() {
    return (
      <View style={{flex:1, backgroundColor:'#fafafa', margin:2, marginTop:0}}>
        <WebView textZoom={90}
          scalesPageToFit={false}
          source={{uri: salesBiblioteca}}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return { 
    
  };
}

export default connect(mapStateToProps, {  })(SalesBibl);
