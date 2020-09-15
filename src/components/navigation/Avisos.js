import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Dimensions, FlatList, PermissionsAndroid, ActivityIndicator, Platform, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import IconFA from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { Col, Grid } from "react-native-easy-grid";
import RNFetchBlob from 'rn-fetch-blob';
import Modal from "react-native-modal";
import _ from 'lodash';
import axios from 'axios';

import { avisosToRedux, getToken } from '../../actions';
import { avisosURL } from '../../external_links';
import updateToken from '../../actions/updateToken';

export class Avisos extends Component {

  constructor(props) {
    super(props);
    this.state = {active:'Tots', activeAvis:'', openedAvis:false, refreshing:false};

    // For mocking purposes
    this.updateToken = updateToken;
    this.alert = Alert;
  }

  renderTabs() {
    var assigs = _.sortBy(this.props.assig.results, 'id');
    assigs.unshift({id:'Tots'});
    var tabs = [];
    assigs.forEach((assig) => {
      var active = (this.state.active == assig.id /*|| (_.isEmpty(this.state.active) && assig.id == assigs[0].id)*/);
      tabs.push(
        <Col key={assig.id}>
          <View style={{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor:(active)?'#1672a3':'#064283', overflow:'hidden'}}>
            <TouchableOpacity onPress={() => this.setState({active:assig.id})}>
              <View style={{flex:1, alignItems: 'center', justifyContent: 'center', width:Dimensions.get('window').width/assigs.length}}>
                <Text style={{color:'#fff', fontSize:18, fontWeight:'900'}}>{' ' + assig.id.replace(/-\w+/g, '') + ' '}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Col>
      );
    }); 
    return (
      <View style={{height:55, backgroundColor:'#064283', elevation:5}}>
        <Grid>
          {tabs}
        </Grid>
      </View>
    );
  }

  getAvisos() {
    // Filtra los avisos segun en la pestaña en la que se encuentre el usuario y las ordena cronologicamente

    var avisos = [];
    this.props.avisos.results.forEach( (noticia) => {
      if (this.state.active == 'Tots' || this.state.active == noticia.codi_assig) {
        avisos.push(
          noticia
        );
      }
    });
    //var avisos = _.orderBy(avisos, 'data_modificacio', 'desc');
    avisos.sort((a, b) => {
      var dA;
      var dB;
      if (a.data_insercio < a.data_modificacio)  dA = a.data_modificacio;
      else dA = a.data_insercio;
      if (b.data_insercio < b.data_modificacio)  dB = b.data_modificacio;
      else dB = b.data_insercio;
      return (dA < dB) ? 1 : (dA == dB) ? 0 : -1;
    });
    return avisos; 
  }

  renderAvisos() {
    return (
      <FlatList 
        data={this.getAvisos()}
        keyExtractor={(item) => `${item.titol}-${item.data_modificacio}`}
        renderItem={(item) => this.renderAvis(item)}
        ListEmptyComponent={<View style= {{flex:1, paddingTop:20, alignItems: 'center', justifyContent: 'center'}}><Text key={1}>{`   ${this.props.lang.msgEmpty}   `}</Text></View>}
        onRefresh={() => this.updateAvisos()}
        refreshing={this.state.refreshing}
      />
    );
  }

  renderAvis({item}) {
    // * Añadido en version v1.1: Decode special characters from 'titol'
    return (
      <TouchableOpacity onPress={() => {
        this.setState({activeAvis:item, openedAvis:true});
      }}>
        <View style={{backgroundColor:'#fff', margin:5, marginLeft:15, marginRight:15, borderRadius:5, padding: 12, elevation:1}}>
          <Text style={{fontSize:15, color:'#606060', fontWeight:'bold'}}>{item.titol.replace(/&\w+;/g, this.decodeSC)}</Text>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{fontSize:15}}>{item.codi_assig.replace(/-\w+/g, '')} - {this.formatDay(item.data_modificacio)}  </Text>
            {item.adjunts.length > 0 ? 
              <View style={{flexDirection:'row', alignItems:'center'}}>
              <IconFA name='paperclip' size={14} color='#808080' />
              <Text style={{fontSize:15}}> {item.adjunts.length}</Text></View> 
              : <View/>}          
          </View>
        </View>
      </TouchableOpacity>
    );
  } 

  adjuntos() {
    var conjAdj = [];
    if (!_.isEmpty(this.state.activeAvis.adjunts)) {
      this.state.activeAvis.adjunts.forEach((adj) => {
        conjAdj.push(
          <TouchableOpacity  key={adj.nom} onPress={() => {
            this.pedirPermisosWrite().then(() => updateToken.bind(this)()).then((newToken) => {

              ToastAndroid.show(
                "Downloading...",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );

              RNFetchBlob.config({
                fileCache : true,
                addAndroidDownloads : {
                  useDownloadManager : true, 
                  notification : true,
                  title : adj.nom,
                  description : adj.nom,
                  mime : adj.tipus_mime,
                  mediaScannable : true,
                  path : RNFetchBlob.fs.dirs.DownloadDir + `${String(Math.floor(Math.random()*10000))}_${adj.nom}`,
                }
              })
              .fetch('GET', adj.url, {Authorization:`Bearer ${newToken}`})
              .then((res) => {
                if (adj.tipus_mime == 'application/pdf') {
                  //alert(res.path());
                  RNFetchBlob.android.actionViewIntent(res.path(), 'application/pdf')
                }
                else {
                  alert('S\'ha descarregat el document a la carpeta \"Downloads\"');
                }
              }).catch((err) => alert('Error downloading document. Try it again...'));
              
            });

          }}>
          <View style={{marginBottom:3}}>
            <Text style={{color:'#222', fontSize:this.props.AVISOSsize}}>{adj.nom}</Text>
          </View>
          </TouchableOpacity>
        );
      });
      return (
        <View style={{backgroundColor:'#e8e8e8', padding:8, borderRadius:5, margin:15, marginRight:20, marginBottom:25}}>
        <Text style={{fontWeight:'bold', color:'#333', paddingBottom: 5, fontSize:this.props.AVISOSsize}}>Adjunts:</Text>
          {conjAdj}
        </View>
      );
    }
    return (<View style={{margin:5}}></View>);
  }

  formatDay(pre) {
    try { //Están dentro de un try ya que al acceder a elementos dentro del array puede generar errores si el split ha generado de menos.
      var dh = pre.split('T');
      var dia = dh[0];
      var diaP = dia.split('-');
      var horaP = dh[1].split(':');
      return `${diaP[2]}/${diaP[1]}/${diaP[0]} ${horaP[0]}:${horaP[1]}`;
    }
    catch {
      return "";
    }
  }

  decodeSC(c) {
    if (c == '&quot;') return '"';
    else if (c == '&amp;') return '&';
    else if (c == '&apos;') return '\'';
    else if (c == '&nbsp;') return ' ';
    
    else if (c == '&agrave;') return 'à';
    else if (c == '&aacute;') return 'á';
    else if (c == '&egrave;') return 'è';
    else if (c == '&eacute;') return 'é';
    else if (c == '&igrave;') return 'ì';
    else if (c == '&iacute;') return 'í';
    else if (c == '&ograve;') return 'ò';
    else if (c == '&oacute;') return 'ó';
    else if (c == '&ugrave;') return 'ù';
    else if (c == '&uacute;') return 'ú';
    else if (c == '&iuml;') return 'ï';
    else if (c == '&uuml;') return 'ü';

    else if (c == '&Agrave;') return 'À';
    else if (c == '&Aacute;') return 'Á';
    else if (c == '&Egrave;') return 'È';
    else if (c == '&Eacute;') return 'É';
    else if (c == '&Igrave;') return 'Ì';
    else if (c == '&Iacute;') return 'Í';
    else if (c == '&Ograve;') return 'Ò';
    else if (c == '&Oacute;') return 'Ó';
    else if (c == '&Ugrave;') return 'Ù';
    else if (c == '&Uacute;') return 'Ú';

    else if (c == '&lt;') return '<';
    else if (c == '&gt;') return '>';
    else if (c == '&iexcl;') return '¡';
    else if (c == '&ordf;') return 'ª';
    else if (c == '&laquo;') return '«';
    else if (c == '&deg;') return '°';
    else if (c == '&middot;') return '·';
    else if (c == '&ordm;') return 'º';
    else if (c == '&raquo;') return '»';
    else if (c == '&iquest;') return '¿';

    else if (c == '&Ccedil;') return 'Ç';
    else if (c == '&ccedil;') return 'ç';
    else if (c == '&Ntilde;') return 'Ñ';
    else if (c == '&ntilde;') return 'ñ';

    return '';
  }

  modal() {

    const deviceWidth = Dimensions.get("window").width;
    const deviceHeight = Platform.OS === "ios" 
    ? Dimensions.get("window").height
    : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

    var text = this.state.activeAvis.text;
    var titol = this.state.activeAvis.titol;
    var data = '';
    if (!_.isUndefined(text)) {
      text = _
        //.replace(text, /<\/p>/g, '\n')
        //.replace(/<[^>]+>/g,'') // * <-- Cambio de version v1.0 a v1.1 (Remover HTML tags)
        .replace(text, /<(\/p|br)>/g,'\n') // * <-- Cambio en version v1.3
        .replace(/<[^>]+>/g, '') // * <-- Cambio en version v1.3
        .replace(/&#(\d+);/g, (m, n) => String.fromCharCode(n))
        .replace(/&\w+;/g, this.decodeSC); // * <-- Añadido version v1.1 (Decode special characters)
      data = this.formatDay(this.state.activeAvis.data_modificacio);
      titol = titol.replace(/&\w+;/g, this.decodeSC); // * <-- Añadido version v1.1 (Decode special characters)
    }
    return (
      <Modal 
        isVisible={this.state.openedAvis == true }
        onBackdropPress={() => this.setState({ openedAvis:false })} 
        onBackButtonPress={() => this.setState({ openedAvis:false })} 
        style={{margin:25, marginBottom:140, marginTop:90, overflow:'hidden', borderRadius:15}}
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
      <View style={{flex:1, backgroundColor:'#fdfdfd', padding:12}}>
        <Text style={{fontWeight:'bold', color:'#505050', fontSize:this.props.AVISOSsize}}>{titol}</Text>
        <ScrollView style={{flex:1, borderTopWidth:1, marginTop:8, paddingTop:12}}>
          <Text selectable={true} style={{paddingBottom:10, color:'#454545', fontSize:this.props.AVISOSsize}}>{`${text}`}</Text>
          {this.adjuntos()}
        </ScrollView>
          <Text style={{fontStyle:'italic', alignSelf:'flex-end', paddingRight:8, paddingTop:3, fontSize:this.props.AVISOSsize}}>{data}</Text>
        </View>
      </Modal>
    );
  }

  async pedirPermisosWrite() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          'title': 'We need WRITE_EXTERNAL_STORAGE Permission',
          'message': 'So you can download documents'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //alert("You can use the WRITE_EXTERNAL_STORAGE");
      } else {
        alert("WRITE_EXTERNAL_STORAGE permission denied");
      }
    } catch (err) {
      alert(JSON.stringify(err));
    }
    try {
      const grantedR = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          'title': 'We need READ_EXTERNAL_STORAGE Permission',
          'message': 'So you can download documents'
        }
      )
      if (grantedR === PermissionsAndroid.RESULTS.GRANTED) {
        //alert("You can use the READ_EXTERNAL_STORAGE");
      } else {
        alert("READ_EXTERNAL_STORAGE permission denied");
      }
    } catch (err) {
      alert(JSON.stringify(err));
    }
  }

  async updateAvisos() {
    this.setState({refreshing:true});
    await this.updateToken.bind(this)().then( async (new_token) => {
      await axios(avisosURL, {
          headers: {'Authorization': `Bearer ${new_token}`, 'Accept-Language':'ca'}
        }).then((resp) => {
          this.props.avisosToRedux(resp); 
          this.setState({refreshing:false});
          AsyncStorage.setItem('avisos', JSON.stringify(resp.data));
        }).catch((err) => {this.alert.alert('Error updating.'); this.setState({refreshing:false});});
    }).catch(() => {this.alert.alert('Error updating.'); this.setState({refreshing:false});});
  }

  loadingComp() {
    return (
      <View style={{flex:1}}>
        <View style={{backgroundColor:'#064283', height:55}}>
        </View>
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size='large' color='#2020ff' />
        </View>
      </View>
    );
  }

  render() {
    
    if (!_.isUndefined(this.props.assig.results) && !_.isUndefined(this.props.avisos.results) && !_.isEmpty(this.props.assig.results)) {
      return (
        <View style={{ flex: 1, backgroundColor:'#fafafa' }}>
          {this.renderTabs()}
          {this.renderAvisos()}
          {this.modal()}
        </View>
      );
    }
    if (_.isUndefined(this.props.assig.results) || _.isUndefined(this.props.avisos.results)) {
      return (
        <View style= {{flex:1, backgroundColor:'#fafafa'}}>
          {this.loadingComp()}
        </View>
      )
    }
    return (
      <View style={{flex:1}}>
        <View style={{height:55, backgroundColor:'#064283', elevation:5}} />
        <View style= {{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#fafafa'}}>
          <Text>{`   ${this.props.lang.msgEmpty}   `}</Text>
        </View>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    avisos: state.avisos,
    assig: state.assig,
    token: state.token,
    AVISOSsize: state.settings.AVISOSsize,
    lang: state.lang.avisos,
  };
}

export default connect(mapStateToProps, { avisosToRedux, getToken })(Avisos);
