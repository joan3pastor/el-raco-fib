import React, { Component } from 'react';
import { Text, View, ImageBackground, Linking, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Picker} from '@react-native-community/picker';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';
import qs from 'querystring';

import { getCode, getToken } from '../actions';
import { authURL, tokenURL, callbackURI, clientID, clientSECRET } from '../external_links';

class Login extends Component {

  constructor(props) {
    super(props);
    this.requestToken = this.requestToken.bind(this);
    this.state = {
      lang:"ca",
    };
  }

  // componentWillUnmount() {
  //   Linking.removeEventListener('url', (event) => {
  //     if (event.url) {
  //       alert("Event listener activated. " + JSON.stringify(event.url));
  //       this.setState({url: event.url});
  //       this.props.getCode(url);
  //     }
  //   });
  // }

  componentDidMount() {
    //Getting callback link:
    //alert("Login Mounted");
    Linking.addEventListener('url', (event) => {
      //alert("addEventListener activated. " + JSON.stringify(event));
      if (event.url) {
        //this.setState({url: event.url});
        this.props.getCode(event.url);
      }
    });
    Linking.getInitialURL().then((url) => {
      if (url) {
        //alert("getInitialURL activated. " + JSON.stringify(url));
        //this.setState({url});
        this.props.getCode(url);
      }
    });
  }

  async requestCode() {
    // Asking for auth code from API FIB:
    
    await Linking.getInitialURL().then((url) => {
      if (url) {
        //alert("getInitialURL <Button> activated. " + JSON.stringify(url));
        //this.setState({url});
        this.props.getCode(url);
      }
      // else {
      //   const URL = `${authURL}?client_id=${clientID}&redirect_uri=${callbackURI}&response_type=code&scope=read&approval_prompt=force`;
      //   Linking.openURL(URL);
      // }
    });

    const URL = `${authURL}?client_id=${clientID}&redirect_uri=${callbackURI}&response_type=code&scope=read&approval_prompt=force`;
    Linking.openURL(URL);
  }

  async requestToken() {
    // Asking for token from API FIB:
    if (_.isUndefined(this.props.token.token) && _.isEmpty(this.props.token.token)) { //OR or AND  ???
      const reqBody = {
        grant_type: "authorization_code",
        redirect_uri: callbackURI,
        code: this.props.code,
        client_id: clientID,
        client_secret: clientSECRET
      }
      const resp = await axios.post(tokenURL, qs.stringify(reqBody));
      if (_.isUndefined(resp.data.access_token)) {
        this.props.getToken({token:''});
      }
      else {
        token = {token: resp.data.access_token, refresh_token: resp.data.refresh_token, expire_date: Date.now()+/*600000*/Number(resp.data.expires_in)*1000-3600000};
        AsyncStorage.setItem('token', JSON.stringify(token)).then(this.props.getToken(token)).catch((error) => console.error('error saving token to local storage'));
      }
    }
  }

  ErrorMsg() {
    if (_.isUndefined(this.props.code_error) || _.isEmpty(this.props.code_error)) {
      return (<View></View>);
    }
    var msg = this.props.code_error
    return(
        <Text style={{color:'red', textAlign:'center', fontSize:16}}>{msg}</Text>
    );
  }

  render() {

    if (!_.isUndefined(this.props.code) && !_.isEmpty(this.props.code)) {
      this.requestToken();
    }

    var { width } = Dimensions.get('window');
    var widthImg = width - 110;

    var langImage = null;
    if (this.state.lang === "ca") langImage = require('../../static/ca.png');
    else if (this.state.lang === "es") langImage = require('../../static/es.png');
    else if (this.state.lang === "en") langImage = require('../../static/en.jpg');

    var bttnText = null;
    var footer1 = null;
    var footer2 = null;
    var footer3 = null;
    if (this.state.lang === "ca") {
      bttnText = "  Inicia Sessió  ";
      footer1 = "Per utilitzar aquesta aplicació cal que disposis d'un compte d'estudiant de la FIB.    ";
      footer2 = "Creada amb l'";
      footer3 = "API del Racó. ";
  }
    else if (this.state.lang === "es") {
      bttnText = "  Inicia Sesión  ";
      footer1 = "Para utilizar esta aplicación se requiere una cuenta de estudiante de la FIB.    ";
      footer2 = "Creada con la ";
      footer3 = "API del Racó. ";
  }
    else if (this.state.lang === "en") {
      bttnText = "  Log In  ";
      footer1 = "To use this application you must have a FIB student account.    ";
      footer2 = "Created with ";
      footer3 = "FIB's API. ";
  }

    return (
      <View style={{backgroundColor:'#fff', flex:1}}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <Image source={require('../../static/ll1080.png')} style={{resizeMode:'center', width:widthImg, height:widthImg, alignSelf:'center'}} />
 
        <TouchableOpacity activeOpacity={0.8} onPress={this.requestCode.bind(this)} style={{alignSelf:'center', width:200, marginBottom:10, marginTop: 120}}>
          <View style={{width:200, overflow:'hidden', borderRadius:10, elevation:5}}>
            <ImageBackground source={require('../../static/FacebookMessenger.jpg')} style={{}}>
              <Text style={{alignSelf:'center', padding:8, color:'#fff', fontWeight:'400', fontSize:18}}>{bttnText}</Text>
            </ImageBackground>
          </View>
        </TouchableOpacity>
        {this.ErrorMsg()}

        <View style={{flex:1, justifyContent:'flex-end', padding:10}}>


          <View style={{flexDirection:"row", alignItems:"center", alignSelf:"center", marginBottom:10}}>
            <Image
              style={{height:17, width:24, borderRadius:3, marginTop:2}}
              source={langImage}
            />
            <Picker
              selectedValue={this.state.lang}
              style={{ height: 50, width: 140 }}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({lang: itemValue});
                AsyncStorage.setItem("lang", JSON.stringify(itemValue));
              }}
              >
              <Picker.Item label="Català" value="ca" />
              <Picker.Item label="Español" value="es" />
              <Picker.Item label="English" value="en" />
            </Picker>
          </View>

          <View>

            <Text>{footer1}</Text>
            <View style={{flexDirection:'row', justifyContent:"flex-start"}}>
              <Text>{footer2}</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://api.fib.upc.edu/v2/')}>
              <Text style={{color:'#0645AD'}}>{footer3}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    code: state.code,
    code_error: state.code_error,
    token: state.token
  };
}

export default connect(mapStateToProps, { getCode, getToken })(Login);
