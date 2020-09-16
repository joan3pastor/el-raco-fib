
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, SectionList, Linking } from 'react-native';
import Modal from "react-native-modal";
import { Dropdown } from 'react-native-material-dropdown';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconE from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';

import { mobilitatURL, mobInfoGeneral, mobSessionsInfo, mobCalendari, mobBeques } from '../../external_links';
import { getToken } from '../../actions';
import updateToken from '../../actions/updateToken';

export class Mobilitat extends Component {

  constructor(props) {
    super(props);
    this.updateToken = updateToken,
    this.state = {
      ready: false,
      ofertes: [],
      ofertesFiltrades: [],
      paisos: [],
      programes: [],
      filterPais: this.props.lang.pickerElemTots,
      filterPrograma: this.props.lang.pickerElemTots,
      infoOpened: false,
    };
  }

  async componentDidMount() {
    await this.getData();
    this.getPaisos();
    this.getProgrames();
    this.filterOfertes();
    this.setState({ready:true});
  }

  async getData() {
    await this.updateToken.bind(this)().then( async (token) => {
      try {
        await axios(mobilitatURL, {
          headers: {'Authorization': `Bearer ${token}`, 'Accept-Language':this.props.langCode}
        }).then((resp) => {
          this.setState({ofertes:resp.data.results, ofertesFiltrades:resp.data.results});
        });
      } catch {}
    });
  }

  getPaisos() {
    var paisos = new Set();
    this.state.ofertes.forEach((o) => {
      paisos.add(o.pais);
    })
    paisos = Array.from(paisos);
    paisos.sort();
    this.setState({paisos});
  }

  getProgrames() {
    var programes = new Set();
    this.state.ofertes.forEach((o) => {
      o.programes.forEach((p) => {
        programes.add(p);
      })
    })
    programes = Array.from(programes);
    programes.sort();
    this.setState({programes});
  }

  openInMap(lat, long) { 
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat.toString()},${long.toString()}`);
  }

  filterOfertes() {
    var paisos = this.state.paisos;
    if (this.state.filterPais !== this.props.lang.pickerElemTots) paisos = [this.state.filterPais];

    var programes = this.state.programes;
    if (this.state.filterPrograma !== this.props.lang.pickerElemTots) programes = [this.state.filterPrograma];

    var data = {};
    this.state.ofertes.forEach((oferta, index) => {
      if (paisos.includes(oferta.pais)) {
        if (programes.includes(oferta.programes[0])) {
          if (oferta.pais in data) data[oferta.pais].push(oferta);
          else data[oferta.pais] = [oferta];
        }
      }
    });

    var parsedData = [];
    Object.keys(data).forEach(function(pais) {
      parsedData.push({
        title: pais,
        data: data[pais],
      });
    });

    parsedData.sort( (a,b) => a.title>b.title );
    this.setState({ofertesFiltrades:parsedData});
  }

  renderMenu() { 
  
    return (
      <View style={{backgroundColor:"#064283", height:85, elevation:5, flexDirection:"row", justifyContent:"space-between"}}>

        <View style={{flexDirection:"row"}}>
          <Dropdown
            label={`${this.props.lang.pickerPais} `}
            data={[{value:this.props.lang.pickerElemTots}, ...this.state.paisos.map((p) => {return {value:p}; })]}
            containerStyle={{backgroundColor:"#064283", width:120, marginLeft:16}}
            pickerStyle={{height:300}}
            baseColor="#fff"
            textColor="#fff"
            selectedItemColor="#404040"
            onChangeText={(value) => {
              this.setState({filterPais:value});
              this.filterOfertes();
          } }
          />
          <Dropdown
            label={`${this.props.lang.pickerPrograma} `}
            data={[{value:this.props.lang.pickerElemTots}, ...this.state.programes.map((p) => {return {value:p}; })]}
            containerStyle={{backgroundColor:"#064283", width:120, marginLeft:16}}
            pickerStyle={{height:300}}
            baseColor="#fff"
            textColor="#fff"
            selectedItemColor="#404040"
            onChangeText={(value) => {
              this.setState({filterPrograma:value});
              this.filterOfertes();
          } }
          />
        </View>

        <TouchableOpacity onPress={() => this.setState({infoOpened:true})}>
          <IconFA style={{marginRight:20, marginTop:28}} name='info-circle' size={30} color='#fff' />
        </TouchableOpacity>

      </View>
    );

  }

  renderInfo() {
    return(
      <Modal 
        isVisible={this.state.infoOpened}
        onBackdropPress={() => this.setState({ infoOpened:false })} 
        onBackButtonPress={() => this.setState({ infoOpened:false })} 
        onSwipeComplete={() => this.setState({ infoOpened:false })}
        swipeDirection="down"
        style={{margin:0}}
      >
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
          <View style={{backgroundColor:"#fff", width:250, height:270, borderRadius:8, padding:14}} >
            
            <View style={{borderBottomWidth:2, borderColor:"#ddd", paddingBottom:4}}>
              <Text style={{fontSize:20, color:"#404040", fontWeight:"bold", textAlign:"center"}}>{`  ${this.props.lang.modalTitol}  `}</Text>
            </View>
            <View style={{marginTop:20, alignItems:"center"}}>

              <TouchableOpacity onPress={() => {Linking.openURL(mobInfoGeneral)}}>
                <View style={{marginBottom:10, flexDirection:"row", elevation:2, backgroundColor:"#1672a3", padding:5, borderRadius:5, justifyContent:"space-between", width:190}}>
                  <Text style={{fontSize:14, color:"#fff", fontWeight:"bold"}}>{`${this.props.lang.modalLink1}  `}</Text>
                  <IconFA style={{marginLeft:6}} name='external-link' size={20} color='#fff' />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {Linking.openURL(mobSessionsInfo)}}>
                <View style={{marginBottom:10, flexDirection:"row", elevation:2, backgroundColor:"#1672a3", padding:5, borderRadius:5, justifyContent:"space-between", width:190}}>
                  <Text style={{fontSize:14, color:"#fff", fontWeight:"bold"}}>{`${this.props.lang.modalLink2}  `}</Text>
                  <IconFA style={{marginLeft:6}} name='external-link' size={20} color='#fff' />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {Linking.openURL(mobCalendari)}}>
                <View style={{marginBottom:10, flexDirection:"row", elevation:2, backgroundColor:"#1672a3", padding:5, borderRadius:5, justifyContent:"space-between", width:190}}>
                  <Text style={{fontSize:14, color:"#fff", fontWeight:"bold"}}>{`${this.props.lang.modalLink3}  `}</Text>
                  <IconFA style={{marginLeft:6}} name='external-link' size={20} color='#fff' />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {Linking.openURL(mobBeques)}}>
                <View style={{marginBottom:10, flexDirection:"row", elevation:2, backgroundColor:"#1672a3", padding:5, borderRadius:5, justifyContent:"space-between", width:190}}>
                  <Text style={{fontSize:14, color:"#fff", fontWeight:"bold"}}>{`${this.props.lang.modalLink4}  `}</Text>
                  <IconFA style={{marginLeft:6}} name='external-link' size={20} color='#fff' />
                </View>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderOferta(item) {

    var pdf = <View/>;
    if (item.pdf_info !== "") {
      pdf = (
        <TouchableOpacity onPress={() => {
          Linking.openURL(item.pdf_info);
        }}>
          <View style={{marginBottom:5, flexDirection:"row", elevation:2, backgroundColor:"#1672a3", padding:4, paddingHorizontal:8, borderRadius:5, justifyContent:"space-between", width:118}}>
            <Text style={{fontSize:14, color:"#fff", fontWeight:"bold"}}>{`${this.props.lang.bttnPDF}  `}</Text>
            <IconFA style={{marginLeft:6}} name='file-pdf-o' size={18} color='#fff' />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={{width:Dimensions.get("window").width-30, margin:15, marginBottom:5, backgroundColor:"#f6f6f6", elevation:3, borderRadius:4, padding:7}}>
        <View style={{borderBottomWidth:1, borderColor:"#ccc", paddingBottom:5, marginBottom:8}}>
          <Text style={{fontSize:14, color:"#595959", fontWeight:"bold"}}>{item.universitat}</Text>
          <Text>{(item.centre === "" ? "-" : item.centre) + "  "}</Text>
        </View>
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>

          <View>
            <Text style={{color:"#606060", fontSize:14}}>{this.props.lang.msgPais+": "+item.pais+" "}</Text>
            <Text style={{color:"#606060", fontSize:14}}>{this.props.lang.msgPrograma+": "+item.programes[0]+" "}</Text>
            <Text style={{color:"#606060", fontSize:14}}>{this.props.lang.msgVigent+" "+item.vigent_fins+" "}</Text>
          </View>

          <View>

            <TouchableOpacity onPress={() => {Linking.openURL(item.web)}}>
              <View style={{marginBottom:5, flexDirection:"row", elevation:2, backgroundColor:"#1672a3", padding:4, paddingHorizontal:8, borderRadius:5, justifyContent:"space-between", width:118}}>
                <Text style={{fontSize:14, color:"#fff", fontWeight:"bold"}}>{`${this.props.lang.bttnWeb}  `}</Text>
                <IconFA style={{marginLeft:6}} name='external-link' size={18} color='#fff' />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {this.openInMap(item.coord["lat"], item.coord["long"]);}}>
              <View style={{marginBottom:5, flexDirection:"row", elevation:2, backgroundColor:"#1672a3", padding:3, paddingHorizontal:8, borderRadius:5, justifyContent:"space-between", width:118}}>
                <Text style={{fontSize:14, color:"#fff", fontWeight:"bold"}}>{`${this.props.lang.bttnMapa}  `}</Text>
                <IconE style={{marginLeft:6}} name='map' size={18} color='#fff' />
              </View>
            </TouchableOpacity>

            {pdf}

          </View>

        </View>
      </View>
    );
  }

  renderOfertes() {

    return (
      <View style={{flex:1}}>
        <SectionList
          sections={this.state.ofertesFiltrades}
          keyExtractor={(item) => item.codi}
          renderItem={({ item }) => this.renderOferta(item)}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={{fontSize:22, color:"#4a4a4a", fontWeight:"bold", borderBottomWidth:2, borderColor:"#ddd", width:150, paddingBottom:4, marginLeft:12, marginTop:20}}>{title+"  "}</Text>
          )}
        />
      </View>
    );
  
  }

  render() {

    if (this.state.ready == false) {
      return (
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size='large' color='#2020ff' />
        </View>
      );
    }

    return (
      <View style={{flex:1, backgroundColor:'#fff'}}>
        {this.renderMenu()}
        {this.renderInfo()}
        {this.renderOfertes()}
      </View>
    );

  }
}

function mapStateToProps(state) {
  return {
    token: state.token,
    lang: state.lang.mobilitat,
    langCode: state.lang.code,
  };
}

export default connect(mapStateToProps, { getToken })(Mobilitat);
