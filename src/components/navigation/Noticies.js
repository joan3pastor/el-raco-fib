import React, { Component } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert, Button, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import _, { random } from 'lodash';
import axios from 'axios';

import { noticiesURL, upcNoticiesRSSca, upcNoticiesRSSes, upcNoticiesRSSen } from '../../external_links';
import { noticiesToRedux, getToken } from '../../actions';
import updateToken from '../../actions/updateToken';

const parseString = require('xml2js').parseString;

//import {noticies} from '../../../__mocks__/fib-api/noticies'; //!BORRAR (DEBUGGING)



export class Noticies extends Component {

  constructor(props) {
    super(props);
    this.state = { opened:false, url:'', refreshing:false };

    // For mocking purposes
    this.updateToken = updateToken;
    this.alert = Alert;
  }

  renderNoticia({item}) {
    const dimensions = Dimensions.get('window');
    const imageHeight = Math.round(dimensions.width * 9 / 32);
    const imageWidth = dimensions.width -32;
    return (
      <View style={{margin:16, marginBottom:5, overflow:'hidden', borderWidth:0, borderRadius:5, elevation:3, backgroundColor:'#fdfdfd'}}>
        <TouchableOpacity onPress={() => this.setState({opened:true, url:item.link})} testID='1' >

          <ImageBackground 
            source={{uri: item.img}}
            style={{width:imageWidth, height:imageHeight, resizeMode:'cover'}} >
              <View style={{backgroundColor:"#064283", width:45, paddingVertical:5, alignSelf:"flex-end", borderBottomLeftRadius:10, elevation:1}}>
                <Text style={{textAlign:"center", fontWeight:"bold", color:"#fff"}}>{` ${item.centre} `}</Text>
              </View>
          </ImageBackground>

          <View style={{padding:8, borderTopWidth:0.5}}>
            <Text style={{fontWeight:'bold', fontSize:15, color:'#606060', marginBottom:5}}>{item.title}</Text>
            <Text>{item.description
              .replace(/<(\/p|br)>/g,'\n')
              .replace(/<script(.|\n)*<\/script>/gm, '')
              .replace(/<[^>]+>/g, '')
              .replace(/&nbsp;/g, ' ')
              .replace('\\n', '\n')}</Text>
            <Text style={{fontStyle:'italic', alignSelf:'flex-end', paddingRight:8, paddingTop:3}}>{item.date}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  getData() {
    var noticies = [];
    if (!_.isUndefined(this.props.noticies.results)) {
      this.props.noticies.results.forEach( (noticia) => {

        var imageLink = 'https://image.flaticon.com/icons/png/512/36/36601.png';
        try {
          imageLink = noticia.descripcio.split("src=\"")[1].split("\"")[0];
        } catch {}

        var description = '';
        try {
          description = noticia.descripcio.split('<div class="field-item even"><p>')[1].split('</p>')[0];
        } catch {}

        var date = '';
        try {
          date = noticia.data_publicacio.replace('T', ' ').split(':')[0] + ':' + noticia.data_publicacio.split(':')[1];
        } catch {}

        var centre = "FIB";
        try {
          if (noticia.UPC == true) {
            centre = "UPC";
            imageLink = noticia.link+"/@@images/imatge";
          }
        } catch {}

        noticies.push(
          {
            title: noticia.titol,
            img: imageLink,
            description: description,
            link: noticia.link,
            date: date,
            centre: centre,
          }
        );
      });
    }
    return noticies; 
  }

  async refreshData() {
    this.setState({refreshing:true});
    await this.updateToken.bind(this)().then( async (new_token) => {
    await axios(noticiesURL, {
      headers: {'Authorization': `Bearer ${new_token}`, 'Accept-Language':this.props.langCode}
    }).then( async (resp) => {


      // !BORRAR (DEBUGGING)
      //if (__DEV__) resp = {data: noticies};


      var newsLinkUPC = upcNoticiesRSSca;
      if (this.props.langCode == "es") newsLinkUPC = upcNoticiesRSSes;
      else if (this.props.langCode == "en") newsLinkUPC = upcNoticiesRSSen;
      
      const respRSS = await axios(newsLinkUPC);
      var noticiesUPC = [];

      try {
        parseString(respRSS.data, function (err, result) {

          noticiesUPC = result["rdf:RDF"]["item"].map((noticiaUPC) => {
            return ({
              titol: noticiaUPC.title[0],
              link: noticiaUPC.link[0],
              descripcio: "", //noticiaUPC.description,
              data_publicacio: noticiaUPC["dc:date"][0].replace("Z",""),
              UPC: true,
            });
          });

        });

      } catch { alert("Error loading UPC news from RSS channel")}
      
      const allNews = _.concat(resp.data.results, noticiesUPC).sort((a,b) => a.data_publicacio < b.data_publicacio);

      this.props.noticiesToRedux({data: {results: allNews}});
      this.setState( {refreshing:false} );

  }).catch(() => {this.alert.alert('Error actualitzant.'); this.setState( {refreshing:false} );});
   }).catch(() => {this.alert.alert('Error actualitzant.'); this.setState( {refreshing:false} );});
  }

  forceTokenRefresh() {

    forceUpdateToken.bind(this)();
    // For debuging
    //import forceUpdateToken from '../../actions/forceUpdateToken';
    // <Button title='currentToken' onPress={() => alert(JSON.stringify(this.props.token))}/>
    // <Button title='refreshToken' onPress={() => this.forceTokenRefresh()}/>
    
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor:'#fafafa' }}>
        <FlatList 
          data={this.getData()}
          keyExtractor={(item) => item.title + item.link}
          renderItem={(item) => this.renderNoticia(item)}
          ListEmptyComponent={<View style={{height:120, alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size='large' color='#2020ff' /></View>}
          onRefresh={() => this.refreshData()}
          refreshing={this.state.refreshing}
        />
        <Modal 
          isVisible={this.state.opened == true }
          onBackdropPress={() => this.setState({ opened:false })} 
          onBackButtonPress={() => this.setState({ opened:false })} 
          style={{margin:0}}
        >
          <View style={{elevation:3}}>
            <Icon.Button name='close' borderRadius={0} size={26} paddingTop={20} paddingVertical={8} onPress={() => this.setState({opened:false})} />
          </View> 
          <View style={{flex:1, backgroundColor:'#fdfdfd', overflow:'hidden'}}>
            <WebView textZoom={100} 
              scalesPageToFit={false}
              source={{uri:this.state.url}}
              style={{flex:1}}
              startInLoadingState={true}
              renderLoading={() => {return (<View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size='large' color='#2020ff' /></View>);}}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return { 
    noticies: state.noticies,
    token: state.token,
    langCode: state.lang.code,
  };
}

export default connect(mapStateToProps, { noticiesToRedux, getToken })(Noticies);
