
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions, ScrollView, TextInput, ToastAndroid, Alert, ActivityIndicator } from 'react-native';
import { SearchableFlatList } from "react-native-searchable-list";
import Modal from "react-native-modal";
import IconFA from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';

import { placesURL } from '../../external_links';
import { getToken } from '../../actions';
import updateToken from '../../actions/updateToken';

const refreshDelay = 5*60*1000;

export class Places extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      refreshTime: Date.now(),
      reminingTime: 0,
      places: [],
      seleccionats: [], // Not a Set() coz it cannot be serialized 
      assigs: [],
      addEntryOpened: false,
      searchedAssig: "",
    };
  }

  componentWillUnmount() {
    try {
      clearInterval(this._interval1);
      clearInterval(this._interval2);
    } catch {}
  }

  async componentDidMount() {
    await this.refresh(forced=true);
    await this.loadAssigsFromStorage();
    await this.getAssigs();
    this._interval1 = setInterval(() => this.refresh(), 1000);
    this._interval2 = setInterval(() => this.updateTimer(), 1000);
    this.setState({ready:true});
  }

  async loadAssigsFromStorage() {
    assigs = await AsyncStorage.getItem("places");
    if (_.isUndefined(assigs) || _.isEmpty(assigs)) {
      this.setState({seleccionats: []});
      AsyncStorage.setItem("places", JSON.stringify([]));
    }
    else {
      assigs = JSON.parse(assigs);
      this.setState({seleccionats: assigs});
    }
  }

  async refresh(forced=false) {
    if ((forced == true) || (this.state.refreshTime !== null && this.state.refreshTime + refreshDelay <= Date.now() )) {

      await updateToken.bind(this)().then( async (token) => {
        this.setState({refreshTime: null});
        try {
          await axios(placesURL, {
            headers: {'Authorization': `Bearer ${token}`, 'Accept-Language':'ca'}
          }).then((resp) => {
            this.setState({places:resp.data.results});
          });
          
        } catch {}
        this.setState({refreshTime: Date.now()});
      });

    }

      //* if ((this.state.refreshTime !== null && this.state.refreshTime > Date.now() + 5min) || forced === true) DONE
        //* await this.state.refreshTime = null DONE
        //* await Fetch FIB API places matr. DONE
        //* await Update state with that DONE
        //* this.state.refreshTime = Date.now() DONE

  }

  addSubject(id, pla) {
    var seleccionats = this.state.seleccionats;
    const found = seleccionats.find( (e) => e.id == id && e.pla == pla);
    if(found === undefined) {
      seleccionats.push({id, pla});
      this.setState({seleccionats});
      AsyncStorage.setItem("places", JSON.stringify(seleccionats));
    } 
  }

  deleteSubject(id, pla) { 
    var seleccionats = this.state.seleccionats;
    const index = _.findIndex(seleccionats, (e) => e.id == id && e.pla == pla);
    if(index !== -1) {
      seleccionats.splice(index, 1);
      this.setState({seleccionats});
      AsyncStorage.setItem("places", JSON.stringify(seleccionats));
    } 
  }

  async getAssigs() {

    var assigs = {};

    this.state.places.forEach( (entrada) => {
      if (!(entrada.assig in assigs)) {
        assigs[entrada.assig] = new Set([entrada.pla]);
      } else {
        assigs[entrada.assig].add(entrada.pla);
      }
    });

    var assigsParsed = [];

    for (const [assig, plans] of Object.entries(assigs)) {
      for (const pla of plans) {
        assigsParsed.push({
            id: assig,
            pla: pla,
          }
        );
      } 
    }

    this.setState({assigs: assigsParsed});
    //alert(JSON.stringify(assigsParsed))
  }

  renderAssigs() {

    var seleccionats = this.state.seleccionats;

    seleccionats.sort((a1, a2) => {
      if (a1.id > a2.id) return 1;
      else return -1;
    });

    var renderedAssigs = [];
    seleccionats.forEach((assig) => {
      renderedAssigs.push(this.renderAssig(assig.id, assig.pla))
    })

    return (
      <ScrollView>
        <View style={{marginTop:12}}>
          {renderedAssigs}
        </View>
      </ScrollView>
    );
  }

  renderAssig(assig, pla) {

    var clases = [];
    this.state.places.forEach((c) => {
      if (c.assig === assig && c.pla === pla) clases.push(c);
    });

    clases = clases.map((c) => {
      return (
        <View key={assig+pla+c.grup} style={{borderWidth:1, borderColor:"#c0c0c0", marginLeft:5, padding:5}}>
          <Text style={{fontWeight:"bold"}}>{this.props.lang.msgGrup + " " + c.grup + " "}</Text>
          <Text style={{color: (c.places_lliures == 0 ? "#ff0000" : "#505050")}}>{c.places_lliures + "/" + c.places_totals}</Text>
        </View>
      );
    });

    return (
      <View key={assig+pla} style={{width: Dimensions.get("window").width,borderTopLeftRadius:6, borderBottomLeftRadius:6, margin:6, marginRigth:0, flexDirection:"row", backgroundColor:"#f0f0f0"}}>
        <View style={{backgroundColor:"#064283", borderTopLeftRadius:6, borderBottomLeftRadius:6, width:55, height:50, justifyContent:"center", elevation:1}}>
          <Text style={{fontSize:16, fontWeight:"bold", color:"#fff", textAlign:"center"}}>{assig}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {
          Alert.alert(
            this.props.lang.titolEliminar,
            this.props.lang.textEliminar,
            [
              {
                text: this.props.lang.textNo,
                onPress: () => {},
                style: "cancel"
              },
              {
                text: this.props.lang.textSi,
                onPress: () => {
                  this.deleteSubject(assig, pla);
                }
              }
            ]
          );
        }}>
          <View style={{backgroundColor:"#064283", height:50, width:20, justifyContent:"center"}}>
            <IconFA style={{}} name='trash-o' size={18} color='#fff' />
          </View>
        </TouchableOpacity>

        <ScrollView horizontal={true} >

          {clases}
          <View style={{width:10}} />

        </ScrollView>
      </View>
    );
  }

  renderModalAdd() {

    return (
    <View>

      <TouchableOpacity onPress={() => {this.setState({addEntryOpened:true})}}>
        <View style={{paddingHorizontal:10, width: 118,justifyContent:"space-between", backgroundColor:"#297DB5", flexDirection:"row", padding:6, borderRadius:6, elevation:5, alignItems:"center"}}>
          <Text style={{color:"#fff", fontWeight:"bold", fontSize:13}} >{`${this.props.lang.bttnAfegir} `}</Text>
          <IconFA style={{marginLeft:5}} name='plus' size={18} color='#fff' />
      </View>
      </TouchableOpacity>

      <Modal 
            isVisible={this.state.addEntryOpened}
            onBackdropPress={() => this.setState({ addEntryOpened:false })} 
            onBackButtonPress={() => this.setState({ addEntryOpened:false })} 
            avoidKeyboard={false}
            style={{margin:0}}
            >
            <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
              <View style={{backgroundColor:"#fff", width:Dimensions.get('window').width-80, height:Dimensions.get('window').height-280, borderRadius:8, padding:14}} >
                
                <TextInput 
                  value={this.state.searchedAssig}
                  onChangeText={(searchedAssig) => this.setState({searchedAssig})}
                  placeholder={`🔎 ${this.props.lang.msgBuscarAssig} `}
                  autoCapitalize="characters"
                  onFocus={() => this.setState({searchedAssig: ""})}
                  style={{ height: 40, borderColor: 'lightgray', backgroundColor:"#fdfdfd", borderWidth:1, borderRadius:3, marginBottom:6, elevation:3}} />

                <SearchableFlatList 
                  style={{}} data={this.state.assigs} searchTerm={this.state.searchedAssig}
                  searchAttribute={"id"} ignoreCase={true}
                  renderItem={({item}) => {
                    
                    var plaExtended = item.pla;
                    // const extended = {
                    //   "GRAU": "Grau en Enginyeria Informàtica",
                    //   "GCED": "Grau en Ciència i Enginyeria de Dades",
                    //   "MEI": "Màster en Enginyeria Informàtica",
                    //   "MIRI": "Màster en Innovació i Recerca en Informàtica",
                    //   "MSEC": "Màster en Formació ESO y Batxillerat",
                    //   "MAI": "Màster en Intel·ligència Artificial",
                    // }
                    try {
                      // plaExtended = extended[item.pla];
                      plaExtended = this.props.lang.cursos[item.pla];
                    } catch {}
                    
                    return ( 
                    <View>

                    <TouchableOpacity onPress={() => {
                      this.addSubject(item.id, item.pla);
                      ToastAndroid.show(
                        item.id + " afegit.",
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM
                      );

                    }} >
                      <View style={{backgroundColor:"#f5f5f5", padding:6, margin:6, elevation:1}}>
                      <Text style={{color:"#505050"}}>{item.id}</Text> 
                      <Text style={{fontSize:13}}>{plaExtended}</Text> 
                      </View>
                    </TouchableOpacity>
                    </View>
                  )}}
                  keyExtractor={assig => assig.id + assig.pla} />
              </View>
            </View>
        </Modal>
      </View>
    );
  }

  millisToMin(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    var time = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    if (time == "4:60") return "5:00"; // Strange bug...
    return time;
  }

  updateTimer() {
    if (this.state.refreshTime === null) {
      this.setState({reminingTime: "..."});
      return;
    } else if (refreshDelay + this.state.refreshTime - now < 0) {
      this.setState({reminingTime: "..."});
      return;
    }
    const now = Date.now();
    const remining = refreshDelay + this.state.refreshTime - now;
    this.setState({reminingTime: this.millisToMin(remining)});
  }
 
  renderUpdateComp() {
    
    return (
      <View>

        <TouchableOpacity onPress={() => {this.refresh(forced=true)}}>
          <View style={{paddingHorizontal:10, width: 118, backgroundColor:"#297DB5", flexDirection:"row", padding:6, borderRadius:6, elevation:5, alignItems:"center",justifyContent:"space-between"}}>
            <Text style={{color:"#fff", fontWeight:"bold", fontSize:13}} >{`${this.props.lang.bttnActualitzar}  `}</Text>
            <IconFA style={{marginLeft:5}} name='refresh' size={18} color='#fff' />
          </View>
      </TouchableOpacity>

        

      </View>
    );

  }

  renderInfoButton() { //TODO

  }

  render() { //TODO

    //AsyncStorage.setItem("places", "[]");

    if (this.state.ready == false) {
      return (
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size='large' color='#2020ff' />
        </View>
      );
    }

    return (
      <View style={{flex:1, backgroundColor:'#fff', alignItems:'center'}}>

        <View style={{backgroundColor:"#064283", paddingBottom:10, elevation:6}}>
          <View style={{width: Dimensions.get("window").width, flexDirection:"row", justifyContent: "space-around", padding:25, paddingBottom:10}}>
            {this.renderModalAdd()}
            {this.renderUpdateComp()}
          </View>
          <Text style={{fontWeight:"600", color:"#fff", textAlign:"center"}}>{this.props.lang.msgActualitzant + " " + this.state.reminingTime}</Text>
        </View>
        {this.renderAssigs()}
      </View>
    );

  }
}

function mapStateToProps(state) {
  return {
    token: state.token,
    lang: state.lang.places,
  };
}

export default connect(mapStateToProps, { getToken })(Places);
