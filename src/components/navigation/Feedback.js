import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, ScrollView, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import _ from 'lodash';
import email from 'react-native-email';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconE from 'react-native-vector-icons/Entypo';

import {playstorelink, githubURL} from "../../external_links";

export class Feedback extends Component {

  sendMail() {
    email(['joan3pastor@gmail.com'], {
      subject: 'FIB APP - Feedback & Bugs',
    }).catch(() => alert('Error obrint el client de correu... Pots enviar el teus comentaris a joan.marc.pastor@est.fib.upc.edu'));
  }

  redirectToPlayStore() {
    Linking.openURL(playstorelink);
  }

  render() {
    var { width, height } = Dimensions.get('window');
    return (
      <View style={{flex:1, alignItems:'center', backgroundColor:'#fefefe', padding:10}}>
          <View style={{width:width-20, height:height/2-90}}>
            <WebView  textZoom={100} 
            scalesPageToFit={false}
            source={{
              html: this.props.lang.text
            }}/>
          </View>

          <TouchableOpacity onPress={this.redirectToPlayStore} activeOpacity={0.8}>
              <View style={{marginTop:30, width:220, flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#00671D', borderRadius:5, padding:8}}>
                <IconE name="google-play" color='#fff' size={25} style={{marginLeft:5}}/>
                <View style={{flex:1}}>
                  <Text style={{marginRight:0, fontFamily: 'Arial', fontSize: 16, fontWeight:'bold', color:'#fff', textAlign:"center"}}>{`  ${this.props.lang.bttnValora}  ❤   `}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.sendMail} activeOpacity={0.8}>
              <View style={{marginTop:30, width:220, flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#B40404', borderRadius:5, padding:8}}>
                <Icon name="envelope-o" color='#fff' size={25} style={{marginLeft:5}}/>
                <View style={{flex:1}}>
                  <Text style={{marginRight:0, fontFamily: 'Arial', fontSize: 16, fontWeight:'bold', color:'#fff', textAlign:"center"}}>{`  ${this.props.lang.bttnSendMail}  `}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL(githubURL)} activeOpacity={0.8}>
              <View style={{marginTop:30, width:220, flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#064283', borderRadius:5, padding:8}}>
                <Icon name="github" color='#fff' size={25} style={{marginLeft:5}}/>
                <View style={{flex:1}}>
                  <Text style={{marginRight:0, fontFamily: 'Arial', fontSize: 16, fontWeight:'bold', color:'#fff', textAlign:"center"}}>{`  ${this.props.lang.bttnGithub}  `}</Text>
                </View>
              </View>
            </TouchableOpacity>

          <Text style={{position:'absolute', bottom:20}}>{`  ${this.props.lang.footer}  `}</Text>
        </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    lang: state.lang.feedback,
  };
}

export default connect(mapStateToProps, {  })(Feedback);
