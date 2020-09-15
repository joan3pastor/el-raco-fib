import React, { Component, lazy, Suspense } from 'react';
import { View, StatusBar, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import axios from 'axios';
import qs from 'querystring';
import _ from 'lodash';
import 'react-native-gesture-handler'

const parseString = require('xml2js').parseString;

import { notesToRedux, settingsToRedux, getToken, deleteToken, avisosToRedux, horariToRedux, assigToRedux, noticiesToRedux, imglabsToRedux, storageAvisosToRedux, examensToRedux, eventsToRedux, practiquesToRedux, horariModificatToRedux } from '../actions';
import { tokenURL, clientID, clientSECRET, avisosURL, horariURL, assigURL, noticiesURL, imglabsURL, QActualURL, eventsURL, practiquesURL, upcNoticiesRSSca, upcNoticiesRSSes, upcNoticiesRSSen } from '../external_links';
//import Navigator from './Navigation';

// For debugging purposes
import {assignatures_5, assignatures_1_2} from '../../__mocks__/fib-api/assignatures';
import {noticies} from '../../__mocks__/fib-api/noticies';
import {normal_horari} from '../../__mocks__/fib-api/horaris';

export class Home extends Component {

  async componentDidMount() {
    AsyncStorage.getItem('horari').then((horari) => {
      if (!_.isEmpty(horari)) {
        this.props.horariToRedux(JSON.parse(horari));
        AsyncStorage.getItem('modhorari').then((modhorari) => {
          if (modhorari !== undefined && modhorari !== null && modhorari !== "") {
            this.props.horariModificatToRedux(JSON.parse(horari).data, JSON.parse(modhorari));
          } else {
            this.props.horariModificatToRedux(JSON.parse(horari).data, {afegits:[], eliminats:[]});
          }
        });
      }
    });
    // this.updateToken().then(() => this.loadSettings()).then(() => this.getData());
    await this.updateToken();
    await this.loadSettings();
    await this.getData();
  }

  setGlobalsNavigationTitles() {
    global.langTitleViews = this.props.langTitleViews;
    global.langBottomTabs = this.props.langBottomTabs;
  }

  async loadSettings() {
    await AsyncStorage.getItem('settings').then((settings) => {
      if (!_.isEmpty(settings)) {
        var settingsParsed = JSON.parse(settings);
        if (!_.isNull(settingsParsed)) {
          // Add Default Values of attribute if it's missing
          if (!("AVISOSnotif" in settingsParsed)) settingsParsed["AVISOSnotif"] = true;
          if (!("HORARIminimalist" in settingsParsed)) settingsParsed["HORARIminimalist"] = false;
          if (!("HORARIpalette" in settingsParsed)) settingsParsed["HORARIpalette"] = 1;
          if (!("AVISOSsize" in settingsParsed)) settingsParsed["AVISOSsize"] = 14;
          if (!("HORARIsize" in settingsParsed)) settingsParsed["HORARIsize"] = 13;
          this.props.settingsToRedux(settingsParsed);
        }
      } else { // Load and save a default Settings Ojbect
        this.props.settingsToRedux({
          AVISOSnotif: true, 
          HORARIminimalist: false, 
          HORARIpalette: 1,
          AVISOSsize: 14,
          HORARIsize: 13,
        });
      }
    });
  }

  async updateToken() {
    if (token.expire_date < Date.now()) {

      //Token invalid. Refreshing it...
      const reqBody = {
        grant_type: "refresh_token",
        refresh_token: this.props.token.refresh_token,
        client_id: clientID,
        client_secret: clientSECRET
      }
      var resp;
      try {
        resp = await axios.post(tokenURL, qs.stringify(reqBody));
      } catch (error) {
        alert("Error actualitzant el token. Si persisteix, tanca sessió i autentica't de nou.");
        return;
      }

      if (_.isUndefined(resp.data.access_token)) {
        alert("Error actualitzant el token. Si persisteix, tanca sessió i autentica't de nou.");
      }

      else {
        token = {token: resp.data.access_token, refresh_token: resp.data.refresh_token, expire_date: Date.now()+Number(resp.data.expires_in)*1000-3600000};
        AsyncStorage.setItem('token', JSON.stringify(token))
        .then(this.props.getToken(token))
        .catch((error) => console.error('error saving token to local storage'));
      }
    }
  }

  generateEmptyNotes(assigs, n) {
    var notes = n;
    assigs.results.forEach((assig) => {
      notes[assig.id] = [];
    });
    this.props.notesToRedux(notes);
  }

  async getData() {
    // AVISOS
    axios(avisosURL, {
      headers: {'Authorization': `Bearer ${this.props.token.token}`, 'Accept-Language':this.props.langCode}
    }).then((resp) => {
      this.props.avisosToRedux(resp);
      AsyncStorage.setItem('avisos', JSON.stringify(resp.data));
    });


    // ASSIG.
    axios(assigURL, {
      headers: {'Authorization': `Bearer ${this.props.token.token}`, 'Accept-Language':this.props.langCode}
    }).then(async (resp) => {
      
      // !BORRAR (DEBUGGING)
      if (__DEV__) resp.data = assignatures_5;

      this.props.assigToRedux(resp);
      AsyncStorage.getItem("notes").then((notes) => {

        if (_.isUndefined(notes) || _.isEmpty(notes)) {
          this.generateEmptyNotes(resp.data, {});
        } else {

          notes = JSON.parse(notes);
          var needToGenerate = false;
          resp.data.results.forEach((assig) => {
            if (_.isUndefined(notes[assig.id])) needToGenerate = true;
          });

          if (needToGenerate) this.generateEmptyNotes(resp.data, notes);
          else this.props.notesToRedux(notes);

        }
      });
    });

    // HORARI
    axios(horariURL, {
      headers: {'Authorization': `Bearer ${this.props.token.token}`, 'Accept-Language':this.props.langCode}
    }).then((resp) => {

      respHorari = {data: resp.data};



      // !BORRAR (DEBUGGING)
      if (__DEV__) respHorari.data = normal_horari;

      


      AsyncStorage.getItem('horari').then((horari) => {
        var horariParsed = {};
        if (horari !== undefined && horari !== null && horari !== "") horariParsed = JSON.parse(horari);

        if (JSON.stringify(horariParsed.data) !== JSON.stringify(respHorari.data)) {

          AsyncStorage.setItem('horari', JSON.stringify(respHorari));

          this.props.horariToRedux(respHorari);

          AsyncStorage.getItem('modhorari').then((modhorari) => {
            if (modhorari !== undefined && modhorari !== null && modhorari !== "") {
              this.props.horariModificatToRedux(respHorari.data, JSON.parse(modhorari));
            } else {
              this.props.horariModificatToRedux(respHorari.data, {afegits:[], eliminats:[]});
            }
          });

        }
      })
    });

    // NOTICIES
    axios(noticiesURL, {
      headers: {'Authorization': `Bearer ${this.props.token.token}`, 'Accept-Language':this.props.langCode}
    }).then( async(resp) => {


      // !BORRAR (DEBUGGING)
      //if (__DEV__) resp.data = noticies;



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

      } catch {}
      
      const allNews = _.concat(resp.data.results, noticiesUPC).sort((a,b) => a.data_publicacio < b.data_publicacio);

      this.props.noticiesToRedux({data: {results: allNews}});
    });

    // IMATGES DISP. LABS
    axios(imglabsURL, {
      headers: {'Authorization': `Bearer ${this.props.token.token}`, 'Accept-Language':this.props.langCode}
    }).then((resp) => this.props.imglabsToRedux(resp));
    //EVENTS
    axios(QActualURL, {
      headers: {'Authorization': `Bearer ${this.props.token.token}`, 'Accept-Language':this.props.langCode}
    }).then((respQA) => {
      axios(respQA.data.examens, {
        headers: {'Authorization': `Bearer ${this.props.token.token}`, 'Accept-Language':'ca'}
      }).then((respE) => this.props.examensToRedux(respE.data));
    });
    axios(eventsURL, {
      headers: {'Authorization': `Bearer ${this.props.token.token}`, 'Accept-Language':'ca'}
    }).then((resp) => this.props.eventsToRedux(resp.data));
    axios(practiquesURL, {
      headers: {'Authorization': `Bearer ${this.props.token.token}`, 'Accept-Language':'ca'}
    }).then((resp) => this.props.practiquesToRedux(resp.data));
  }

  async logOut() {
    AsyncStorage.clear()
    .then(this.props.deleteToken());
  }

  render() {

    this.setGlobalsNavigationTitles();
    const Navigator = React.lazy(() => import("./Navigation"));

    var { width } = Dimensions.get('window');
    var widthImg = width - 110;

    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Suspense fallback={
          <View style={{backgroundColor:'#fff', flex:1}}>
            <Image source={require('../../static/ll1080.png')} style={{resizeMode:'center', width:widthImg, height:widthImg, alignSelf:'center'}} />
          </View>
        } >
          <Navigator refreshingWhenChanged={this.props.langCode}/>
        </Suspense>
      </View>
    );
  }
  
}

function mapStateToProps(state) {
  return { 
    token: state.token,
    langCode: state.lang.code,
    langTitleViews: state.lang.titleViews,
    langBottomTabs: state.lang.bottomTabs,
  };
}

export default connect(mapStateToProps, { notesToRedux, settingsToRedux, getToken, deleteToken, avisosToRedux, horariToRedux, horariModificatToRedux, assigToRedux, noticiesToRedux, imglabsToRedux, storageAvisosToRedux, practiquesToRedux, eventsToRedux, examensToRedux })(Home);
