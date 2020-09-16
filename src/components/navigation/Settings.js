
// ! Para añadir otro setting en el stackObject de settings, modificar:
// !  -  Home.js (tiene un objeto settings default)

import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions, ScrollView, Image, TextInput } from 'react-native';
import {Picker} from '@react-native-community/picker';
import { Dropdown } from 'react-native-material-dropdown';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-community/async-storage';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import _ from 'lodash';
import Modal from "react-native-modal";


import { settingsToRedux, loadLanguage, changeLanguage, horariModificatToRedux } from '../../actions';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      iniciado: false,
      AVISOSnotif: true, 
      HORARIminimalist: true, 
      HORARIpalette: 1,
      AVISOSsize: 14,
      HORARIsize: 13,
      lang:"ca",
      modhorari: {
        afegits: [],
        eliminats: [],
      },
      openedModal: "",

      addcCodi: "",
      addcDia: "",
      addcInici: "",
      addcDurada: "",
      addcTipus: "",
      addcAula: "",
      addcGrup: "",
    };
  }

  componentDidMount() {
    if (this.state.iniciado == false && !_.isEmpty(this.props.settings)) {
      this.setState({iniciado: true, ...this.props.settings});
    }
    this.getLang();
    this.getModificacionsHorari();
  }

  async getModificacionsHorari() {
    var modhorari = await AsyncStorage.getItem("modhorari");
    if (modhorari !== undefined && modhorari !== null && modhorari !== "") {
      modhorari = JSON.parse(modhorari);
      this.setState({modhorari});
    }
  }

  async horariAfegirClase(dia, inici, durada, codi_assig, grup, tipus, aula) {
    var dia_setmana = 1;
    if (dia == this.props.lang.dies[1]) dia_setmana = 2;
    else if (dia == this.props.lang.dies[2]) dia_setmana = 3;
    else if (dia == this.props.lang.dies[3]) dia_setmana = 4;
    else if (dia == this.props.lang.dies[4]) dia_setmana = 5;
    const clase = {
      codi_assig: codi_assig,
      grup: grup,
      dia_setmana: dia_setmana,
      inici: inici,
      durada: durada,
      tipus: tipus,
      aules: aula,
    };

    var modhorari = this.state.modhorari;

    modhorari.afegits.push(clase);
    this.setState(modhorari);
    await this.dispatchHorariModificat();
    await this.saveHorariModifications();
  }

  async horariEliminarClase(afegida, dia, inici, durada, codi_assig, grup, tipus, aula) {
    var dia_setmana = dia;
    if (dia == this.props.lang.dies[0]) dia_setmana = 1;
    else if (dia == this.props.lang.dies[1]) dia_setmana = 2;
    else if (dia == this.props.lang.dies[2]) dia_setmana = 3;
    else if (dia == this.props.lang.dies[3]) dia_setmana = 4;
    else if (dia == this.props.lang.dies[4]) dia_setmana = 5;
    if (!afegida) { // Eliminar clase default
      const clase = {
        codi_assig: codi_assig,
        grup: grup,
        dia_setmana: dia_setmana,
        inici: inici,
        durada: durada,
        tipus: tipus,
        aules: aula,
      };
      var modhorari = this.state.modhorari;
      modhorari.eliminats.push(clase);
      this.setState(modhorari);
      await this.dispatchHorariModificat();
      await this.saveHorariModifications();
    } else { // Eliminar clase creada
      var modhorari = this.state.modhorari;
      var index = null;
      modhorari.afegits.forEach((c, i) => {
        if (c.dia_setmana == dia_setmana && c.inici == inici && c.durada == durada && c.codi_assig == codi_assig && c.aules == aula) {
          index = i;
        }
      });
      if (index !== null) {
        modhorari.afegits.splice(index,1);
        this.setState(modhorari);
        await this.dispatchHorariModificat();
        await this.saveHorariModifications();
      }
    }
  }

  async dispatchHorariModificat() {
    await this.props.horariModificatToRedux({results:Object.assign([], this.props.horariPur.results)}, this.state.modhorari);
  }

  async saveHorariModifications() {
    await AsyncStorage.setItem("modhorari", JSON.stringify(this.state.modhorari));
  }

  async resetHorariModifications() {
    this.setState({modhorari:{afegits:[], eliminats:[]}});
    await AsyncStorage.setItem("modhorari", JSON.stringify({afegits:[], eliminats:[]}));
    await this.dispatchHorariModificat();
  }

  async getLang() {
    this.setState({lang: this.props.langCode});
  }

  closeAndCleanModals() {
    this.setState({
      addcCodi: "",
      addcDia: "",
      addcInici: "",
      addcDurada: "",
      addcTipus: "",
      addcAula: "",
      addcGrup: "",
      openedModal: "",
    });
  }

  verifyAndSaveAddClass() {
    if (this.state.addcCodi === "") alert(`${this.props.lang.A5Alert1} `);
    else if (this.state.addcAula === "") alert(`${this.props.lang.A5Alert2} `);
    else if (this.state.addcDia === "") alert(`${this.props.lang.A5Alert3} `);
    else if (this.state.addcInici === "") alert(`${this.props.lang.A5Alert4} `);
    else if (this.state.addcDurada === "") alert(`${this.props.lang.A5Alert5} `);
    else if (this.state.addcGrup === "") alert(`${this.props.lang.A5Alert6} `);
    else if (this.state.addcTipus === "") alert(`${this.props.lang.A5Alert7} `);
    else {
      this.horariAfegirClase(dia=this.state.addcDia, inici=this.state.addcInici, durada=this.state.addcDurada, codi_assig=this.state.addcCodi, grup=this.state.addcGrup, tipus=this.state.addcTipus, aula=this.state.addcAula);
      this.closeAndCleanModals();
    }
  }

  renderModalAdd() {

    return(
      <Modal 
          isVisible={this.state.openedModal == "addclassrooom" }
          onBackdropPress={() => this.closeAndCleanModals()} 
          onBackButtonPress={() => this.closeAndCleanModals()} 
          style={{margin:0}}
        >
          <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <View style={{backgroundColor:"#fff", width:Dimensions.get('window').width-80, height:380, borderRadius:8, padding:14}} >
              

            <View style={{borderBottomWidth:2, borderColor:"#ddd", paddingBottom:4, marginBottom:5}}>
              <Text style={{fontSize:20, color:"#404040", fontWeight:"bold", textAlign:"left"}}>{`${this.props.lang.A5ModalTitle}  `}</Text>
            </View>


              <View style={{flexDirection:"row", marginBottom:5}}>
                <View style={{marginTop:10}} >
                  <Text style={{fontSize:16, fontWeight:"400", color:"#606060", marginBottom:3}}>{`${this.props.lang.A5ModalP1}: `}</Text>
                  <TextInput 
                    value={this.state.addcCodi}
                    onChangeText={(codi) => this.setState({addcCodi:codi})}
                    style={{ height: 40, borderColor: 'lightgray', backgroundColor:"#f2f2f2", borderWidth:1, borderRadius:3, width:100}}
                    />
                </View>

                <View style={{marginTop:10, marginLeft:20}} >
                  <Text style={{fontSize:16, fontWeight:"400", color:"#606060", marginBottom:3}}>{`${this.props.lang.A5ModalP2}: `}</Text>
                  <TextInput 
                    value={this.state.addcAula}
                    onChangeText={(aula) => this.setState({addcAula:aula})}
                    style={{ height: 40, borderColor: 'lightgray', backgroundColor:"#f2f2f2", borderWidth:1, borderRadius:3, width:100}}
                    />
                </View>
              </View>

              <View style={{flexDirection:"row"}}>
                <ScrollView horizontal={true}>
                  <Dropdown
                    label={`${this.props.lang.A5ModalP3} `}
                    data={this.props.lang.pickerDies}
                    containerStyle={{backgroundColor:"#fff", width:60}}
                    pickerStyle={{height:220}}
                    baseColor="#505050"
                    textColor="#505050"
                    selectedItemColor="#404040"
                    onChangeText={(value) => {
                      this.setState({addcDia:value});
                    } }
                  />
                  <Dropdown
                    label={`${this.props.lang.A5ModalP4} `}
                    data={[{value:"08:00"},{value:"09:00"},{value:"10:00"},{value:"11:00"},{value:"12:00"},{value:"13:00"},{value:"14:00"},{value:"15:00"},{value:"16:00"},{value:"17:00"},{value:"18:00"},{value:"19:00"},{value:"20:00"}]}
                    containerStyle={{backgroundColor:"#fff", width:75, marginLeft:16}}
                    pickerStyle={{height:350}}
                    baseColor="#505050"
                    textColor="#505050"
                    selectedItemColor="#404040"
                    onChangeText={(value) => {
                      this.setState({addcInici:value});
                    } }
                  />
                  <Dropdown
                    label={`${this.props.lang.A5ModalP5} `}
                    data={[{value:"1h"},{value:"2h"},{value:"3h"},{value:"4h"}]}
                    containerStyle={{backgroundColor:"#fff", width:85, marginLeft:16}}
                    pickerStyle={{height:180}}
                    baseColor="#505050"
                    textColor="#505050"
                    selectedItemColor="#404040"
                    onChangeText={(value) => {
                      this.setState({addcDurada:Number(value.replace("h",""))});
                    } }
                  />
                </ScrollView>
              </View>

              <View style={{flexDirection:"row"}}>
                <View style={{marginTop:15, marginRight:10}} >
                  <Text style={{fontSize:16, fontWeight:"400", color:"#606060", marginBottom:3}}>{`${this.props.lang.A5ModalP6}: `}</Text>
                  <TextInput 
                    value={this.state.addcGrup}
                    keyboardType="decimal-pad"
                    onChangeText={(grup) => this.setState({addcGrup:grup})}
                    style={{ height: 40, borderColor: 'lightgray', backgroundColor:"#f2f2f2", borderWidth:1, borderRadius:3, width:60}}
                    />
                </View>
                <Dropdown
                    label={`${this.props.lang.A5ModalP7} `}
                    data={[{value:"T"},{value:"L"},{value:"P"}]}
                    containerStyle={{backgroundColor:"#fff", width:85, marginLeft:16}}
                    pickerStyle={{height:150}}
                    baseColor="#505050"
                    textColor="#505050"
                    selectedItemColor="#404040"
                    onChangeText={(value) => {
                      this.setState({addcTipus:value});
                    } }
                  />
              </View>

              <View style={{flexDirection:"row", justifyContent:"space-around", marginTop:40}} >
                <TouchableOpacity activeOpacity={0.9} onPress={() => this.closeAndCleanModals()} >
                  <View style={{backgroundColor:"#dc3545", padding:6, borderRadius:6, elevation:4, width:110, justifyContent:"center"}}>
                    <Text style={{color:"#fff", fontWeight:"bold", alignSelf:"center"}} >{` ${this.props.lang.A5ModalBttn1} `}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} onPress={()=>this.verifyAndSaveAddClass()} >
                  <View style={{backgroundColor:"#28a745", padding:6, borderRadius:6, elevation:4, width:110, justifyContent:"center"}}>
                    <Text style={{color:"#fff", fontWeight:"bold", alignSelf:"center"}} >{` ${this.props.lang.A5ModalBttn2} `}</Text>
                  </View>
                </TouchableOpacity>
              </View>






            </View>
          </View>
      </Modal>
    );
  }

  renderModalDelete() {
    return(
      <Modal 
          isVisible={this.state.openedModal == "deleteclassrooom" }
          onBackdropPress={() => this.closeAndCleanModals()} 
          onBackButtonPress={() => this.closeAndCleanModals()} 
          style={{margin:0}}
        >
          <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <View style={{backgroundColor:"#fff", width:Dimensions.get('window').width-80, height:Dimensions.get('window').height-200, borderRadius:8, padding:14}} >
              
            <View style={{borderBottomWidth:2, borderColor:"#ddd", paddingBottom:4, marginBottom:15}}>
              <Text style={{fontSize:20, color:"#404040", fontWeight:"bold", textAlign:"left"}}>{`${this.props.lang.A5Modal2Title}  `}</Text>
            </View>

            <ScrollView>


              <View style={{borderBottomWidth:2, borderColor:"#eee", paddingBottom:4, marginBottom:10, width:150}}>
                <Text style={{fontSize:16, color:"#666", fontWeight:"bold", textAlign:"left"}}>{`${this.props.lang.A5Modal2txt1}  `}</Text>
              </View>

 
              <View style={{flexDirection:"row", flexWrap:"wrap"}}>
                {this.props.horariPur.results.filter((c1) => {
                  var descartat = false;
                  this.state.modhorari.eliminats.forEach((c2) => {
                    if (c1.codi_assig==c2.codi_assig && c1.grup==c2.grup && c1.dia_setmana==c2.dia_setmana && c1.inici==c2.inici && c1.durada==c2.durada && c1.aules==c2.aules) descartat = true;
                  });
                  if (descartat) return false;
                  else return true;
                }).map((c) => {
                  const width = Dimensions.get("window").width - 115;
                  return (
                    <View 
                      style= {{width, height: 40, backgroundColor:"#f2f2f2", elevation:1, borderRadius:7, padding:5, marginVertical:5, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}
                      key={c.aula+c.codi_assig+c.inici+c.dia_setmana.toString()}>
                      <Text style={{maxWidth:width-40}}>{`[ ${this.props.lang.dies[c.dia_setmana]} - ${c.inici} ] ${c.codi_assig}-${c.tipus} ${c.aules}   `}</Text>
                      <TouchableOpacity activeOpacity={0.8} onPress={() => this.horariEliminarClase(afegida=false, dia=c.dia_setmana, inici=c.inici, durada=c.durada, codi_assig=c.codi_assig, grup=c.grup, tipus=c.tipus, aula=c.aules)}>
                        <IconFA name='trash' size={20} color='#444' style={{marginRight:5}} />
                      </TouchableOpacity>
                    </View>
                  );

                })}
              </View>

              <View style={{borderBottomWidth:2, borderColor:"#eee", paddingBottom:4, marginBottom:10, marginTop:20, width:150}}>
                <Text style={{fontSize:16, color:"#666", fontWeight:"bold", textAlign:"left"}}>{`${this.props.lang.A5Modal2txt2}  `}</Text>
              </View>

              <View style={{flexDirection:"row", flexWrap:"wrap"}}>
                {this.state.modhorari.afegits.map((c) => {
                  const width = Dimensions.get("window").width - 115;
                  return (
                    <View 
                      style= {{width, height: 40, backgroundColor:"#f2f2f2", elevation:1, borderRadius:7, padding:5, marginVertical:5, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}
                      key={c.aula+c.codi_assig+c.inici+c.dia_setmana.toString()}>
                      <Text style={{maxWidth:width-40}}>{`[ ${this.props.lang.dies[c.dia_setmana]} - ${c.inici} ] ${c.codi_assig}-${c.tipus} ${c.aules}   `}</Text>
                      <TouchableOpacity activeOpacity={0.8} onPress={() => this.horariEliminarClase(afegida=true, dia=c.dia_setmana, inici=c.inici, durada=c.durada, codi_assig=c.codi_assig, grup=c.grup, tipus=c.tipus, aula=c.aules)}>
                        <IconFA name='trash' size={20} color='#444' style={{marginRight:5}} />
                      </TouchableOpacity>
                    </View>
                  );

                })}
              </View>

          </ScrollView>

            </View>
          </View>
      </Modal>
    );
  }

  render() {
    var { width } = Dimensions.get('window');
    if (width > 300) width = Math.floor(width*0.85); 
    
    var active = '#1B72B5';
    var noactive = '#C3CDF1';

    var WWidth = Dimensions.get('window').width;
    var realWWidth = Math.ceil(0.170048 * WWidth+1);
    WWidth = Math.ceil(0.170048 * WWidth + 6);
    if (Number.isNaN(WWidth)) WWidth = "auto";

    var WHeigth = Dimensions.get('window').height;
    WHeigth = Math.floor(0.0625 * WHeigth-2);
    if (Number.isNaN(WHeigth)) WHeigth = "auto";

    var langImage = null;
    if (this.state.lang === "ca") langImage = require('../../../static/ca.png');
    else if (this.state.lang === "es") langImage = require('../../../static/es.png');
    else if (this.state.lang === "en") langImage = require('../../../static/en.jpg');

    return (
      <ScrollView>
      <View style={{flex:1, backgroundColor:'#fff', alignItems:'center', marginBottom:20}}>
  
        <View style={{backgroundColor:'#f2f2f2', width: width, padding:20, paddingBottom:8, borderRadius:8, marginTop:25}}>
          <Text style={{color:'#303030', fontSize:20, fontWeight:'800'}}>{`${this.props.lang.A1Title}   `}</Text>
          <View style={{flexDirection: 'row', marginTop: 10, justifyContent:"center"}}>
            <TouchableOpacity onPress={async () => {
              this.setState({AVISOSnotif: true});
              AsyncStorage.setItem('settings', JSON.stringify({HORARIsize: this.state.HORARIsize, AVISOSnotif: true, HORARIminimalist: this.state.HORARIminimalist, HORARIpalette: this.state.HORARIpalette, AVISOSsize: this.state.AVISOSsize})); 
              this.props.settingsToRedux({HORARIsize: this.state.HORARIsize, AVISOSnotif: true, HORARIminimalist: this.state.HORARIminimalist, HORARIpalette: this.state.HORARIpalette, AVISOSsize: this.state.AVISOSsize});
            }}>
              <Text style={{backgroundColor:(this.state.AVISOSnotif)?active:noactive, width:110, textAlign:'center', margin:10, padding:5, borderRadius:6}}>{` ${this.props.lang.A1Bttn1} `}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => {
              this.setState({AVISOSnotif: false});
              AsyncStorage.setItem('settings', JSON.stringify({HORARIsize: this.state.HORARIsize, AVISOSnotif: false, HORARIminimalist: this.state.HORARIminimalist, HORARIpalette: this.state.HORARIpalette, AVISOSsize: this.state.AVISOSsize})); 
              this.props.settingsToRedux({HORARIsize: this.state.HORARIsize, AVISOSnotif: false, HORARIminimalist: this.state.HORARIminimalist, HORARIpalette: this.state.HORARIpalette, AVISOSsize: this.state.AVISOSsize});
            }}>
              <Text style={{backgroundColor:(!this.state.AVISOSnotif)?active:noactive, width:110, textAlign:'center', margin:10, padding:5, borderRadius:6}}>{` ${this.props.lang.A1Bttn2} `}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{fontSize:14}}>{(this.state.AVISOSnotif) ? `${this.props.lang.A1Nota1}   ` : ''}</Text>
          <Text style={{fontSize:14}}>{(this.state.AVISOSnotif) ? `${this.props.lang.A1Nota2}   ` : ''}</Text>
        </View>

        <View style={{backgroundColor:'#f2f2f2', width: width, padding:20, paddingBottom:8, borderRadius:8, marginTop:25}}>
          <Text style={{color:'#303030', fontSize:20, fontWeight:'800'}}>{`${this.props.lang.A4Title}   `}</Text>
          
          <View style={{flexDirection:"row", alignItems:"center", marginLeft:6}}>

          <Image
            style={{height:17, width:24, borderRadius:3, marginTop:2}}
            source={langImage}
          />

            <Picker
              selectedValue={this.state.lang}
              style={{ height: 50, width: 140 }}
              onValueChange={(itemValue, itemIndex) => {
                if (itemValue !== this.state.lang) {
                  alert("Restart app to apply full changes. " )
                  this.setState({lang: itemValue});
                  this.props.changeLanguage(itemValue);
                }
              }}
              >
              <Picker.Item label="Català" value="ca" />
              <Picker.Item label="Español" value="es" />
              <Picker.Item label="English" value="en" />
            </Picker>

          </View>

        </View>

        <View style={{backgroundColor:'#f2f2f2', width: width, padding:20, borderRadius:8, marginTop:25}}>
          <Text style={{color:'#303030', fontSize:20, fontWeight:'800', marginBottom: 20}}>{`${this.props.lang.A2Title}   `}</Text>
          <Text style={{fontSize:this.state.AVISOSsize, backgroundColor:"#fff", textAlign:"center", padding:8}}>{`  ${this.props.lang.A2text}  `}</Text>
          <Slider 
            style={{marginTop: 15}}
            maximumValue={20}
            minimumValue={12}
            step={1}
            value={this.state.AVISOSsize}
            onValueChange={(sliderValue) => {
              this.setState({ AVISOSsize: sliderValue });
              AsyncStorage.setItem('settings', JSON.stringify({HORARIsize: this.state.HORARIsize, AVISOSnotif: this.state.AVISOSnotif, HORARIminimalist: this.state.HORARIminimalist, HORARIpalette: this.state.HORARIpalette, AVISOSsize: sliderValue}));
              this.props.settingsToRedux({HORARIsize: this.state.HORARIsize, AVISOSnotif: this.state.AVISOSnotif, HORARIminimalist: this.state.HORARIminimalist, HORARIpalette: this.state.HORARIpalette, AVISOSsize: sliderValue});
            }}
            />
        </View>

        <View style={{backgroundColor:'#f2f2f2', width: width, padding:20, borderRadius:8, marginTop:25}}>
          <Text style={{color:'#303030', fontSize:20, fontWeight:'800', marginBottom:20}}>{`${this.props.lang.A3Title}   `}</Text>

          <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>

            {(this.state.HORARIminimalist) ? 
            <View style={{width:realWWidth, height:WHeigth, backgroundColor: '#ffdfba', flex:1, justifyContent: 'center', alignItems:'center', overflow:'hidden', elevation:1}}>
              <Text style={{fontSize:this.state.HORARIsize+2, textAlign:"center", color: '#404545', fontWeight:'500', width:WWidth}}>{'ABCD-L'}</Text>
            </View>
            : 
            <View style={{width:realWWidth, height:WHeigth, backgroundColor: '#ffdfba', flex:1, justifyContent: 'center', alignItems:'center', overflow:'hidden', elevation:1}}>
              <Text style={{fontSize:this.state.HORARIsize, textAlign:"center", color: '#404545', fontWeight:'500', width:WWidth}}>{'ABCD-L 22'}</Text>
              <Text style={{fontSize:this.state.HORARIsize, textAlign:"center", color: '#404545', fontWeight:'500', width:WWidth}}>{'C6S309'}</Text>
            </View>
            }

          </View>
          <Slider 
            style={{marginTop: 25}} 
            maximumValue={16}
            minimumValue={11}
            step={1}
            value={this.state.HORARIsize}
            onValueChange={(sliderValue) => {
              this.setState({ HORARIsize: sliderValue });
              AsyncStorage.setItem('settings', JSON.stringify({HORARIsize: sliderValue, AVISOSnotif: this.state.AVISOSnotif, HORARIminimalist: this.state.HORARIminimalist, HORARIpalette: this.state.HORARIpalette, AVISOSsize: this.state.AVISOSsize}));
              this.props.settingsToRedux({HORARIsize: sliderValue, AVISOSnotif: this.state.AVISOSnotif, HORARIminimalist: this.state.HORARIminimalist, HORARIpalette: this.state.HORARIpalette, AVISOSsize: this.state.AVISOSsize});
          }}
            />

          <View style={{flexDirection: 'row', marginTop: 10, justifyContent:"center", backgroundColor:"#f2f2f2", borderRadius:8}}>
            <TouchableOpacity onPress={async () => {
              this.setState({HORARIminimalist: false});
              AsyncStorage.setItem('settings', JSON.stringify({HORARIsize: this.state.HORARIsize, AVISOSnotif: this.state.AVISOSnotif, HORARIminimalist: false, HORARIpalette: this.state.HORARIpalette, AVISOSsize: this.state.AVISOSsize})); 
              this.props.settingsToRedux({HORARIsize: this.state.HORARIsize, AVISOSnotif: this.state.AVISOSnotif, HORARIminimalist: false, HORARIpalette: this.state.HORARIpalette, AVISOSsize: this.state.AVISOSsize});
            }}>
              <Text style={{backgroundColor:(!this.state.HORARIminimalist)?active:noactive, width:110, textAlign:'center', margin:10, padding:5, borderRadius:6}}>{` ${this.props.lang.A3Bttn1} `}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => {
              this.setState({HORARIminimalist: true});
              AsyncStorage.setItem('settings', JSON.stringify({HORARIsize: this.state.HORARIsize, AVISOSnotif: this.state.AVISOSnotif, HORARIminimalist: true, HORARIpalette: this.state.HORARIpalette, AVISOSsize: this.state.AVISOSsize})); 
              this.props.settingsToRedux({HORARIsize: this.state.HORARIsize, AVISOSnotif: this.state.AVISOSnotif, HORARIminimalist: true, HORARIpalette: this.state.HORARIpalette, AVISOSsize: this.state.AVISOSsize});
            }}>
              <Text style={{backgroundColor:(this.state.HORARIminimalist)?active:noactive, width:110, textAlign:'center', margin:10, padding:5, borderRadius:6}}>{` ${this.props.lang.A3Bttn2} `}</Text>
            </TouchableOpacity>
          </View>
        </View>


        <View style={{backgroundColor:'#f2f2f2', width: width, padding:20, paddingBottom:8, borderRadius:8, marginTop:25}}>
          <Text style={{color:'#303030', fontSize:20, fontWeight:'800', marginBottom:10}}>{`${this.props.lang.A5Title}   `}</Text>

          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
            <View>

              <TouchableOpacity style={{width:130}} onPress={async () => {this.setState({openedModal: "addclassrooom"})}}>
                <View style={{flexDirection:"row", alignItems:"center", width:130, margin:5, padding:5, borderRadius:6, backgroundColor:noactive}}>
                  <IconFA name='plus' size={20} color='#222' style={{marginRight:3}} />
                  <Text style={{textAlign:'left', color:"#444"}}>{` ${this.props.lang.A5Bttn1} `}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{width:130}} onPress={async () => this.setState({openedModal: "deleteclassrooom"})}>
                <View style={{flexDirection:"row", alignItems:"center", width:130, margin:5, padding:5, borderRadius:6, backgroundColor:noactive}}>
                  <IconFA name='trash' size={20} color='#222' style={{marginRight:3}} />
                  <Text style={{textAlign:'left', color:"#444"}}>{` ${this.props.lang.A5Bttn2} `}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{width:130}} onPress={async () => {this.resetHorariModifications()}}>
                <View style={{flexDirection:"row", alignItems:"center", width:130, margin:5, padding:5, borderRadius:6, backgroundColor:noactive}}>
                  <IconFA name='repeat' size={20} color='#222' style={{marginRight:3}} />
                  <Text style={{textAlign:'left', color:"#444"}}>{` ${this.props.lang.A5Bttn3} `}</Text>
                </View>
              </TouchableOpacity>

            </View>
            <View style={{paddingBottom:10}}>
              <Text style={{}}>{`${this.props.lang.A5txt1}: ${this.state.modhorari.afegits.length.toString()} `}</Text>
              <Text style={{}}>{`${this.props.lang.A5txt2}: ${this.state.modhorari.eliminats.length.toString()} `}</Text>
            </View>
          </View>

        
        </View>

      </View>
          
      {this.renderModalAdd()}
      {this.renderModalDelete()}

      </ScrollView>
    );

  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    lang: state.lang.settings,
    langCode: state.lang.code,
    horariPur: state.horari,
    horari: state.horari_modificat,
  };
}

export default connect(mapStateToProps, { settingsToRedux, changeLanguage, loadLanguage, horariModificatToRedux })(Settings);
