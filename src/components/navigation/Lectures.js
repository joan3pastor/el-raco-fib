
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconE from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';

import { lecturesURL } from '../../external_links';
import { getToken } from '../../actions';
import updateToken from '../../actions/updateToken';

export class Lectures extends Component {

  constructor(props) {
    super(props);
    this.updateToken = updateToken;
    this.state = {
      ready: false,
      lectures: [],
      lecturesFiltered: [],
      plans: [],
      plaSeleccionat: this.props.lang.pickerElemTots,
      infoOpened: false,
    };
  }

  async componentDidMount() {
    await this.getData();
    this.getPlans();
    this.filterLectures();
    this.setState({ready:true});
  }

  async getData() {
    await this.updateToken.bind(this)().then( async (token) => {
      try {
        await axios(lecturesURL, {
        //await axios('https://api.fib.upc.edu/v2/lectures/?page=43', { // !BORRAR (DEBUGGING)
          headers: {'Authorization': `Bearer ${token}`, 'Accept-Language':this.props.langCode}
        }).then((resp) => {
          this.setState({lectures:resp.data.results, lecturesFiltered:resp.data.results});
        });
      } catch {}
    });
  }

  getPlans() {
    var plans = new Set();
    const defaultPlans = ["GRAU","GCED","MEI","MIRI","MSEC","MAI"];
    
    // Mirar si hi ha de nous i afegir-los
    defaultPlans.forEach((p) => plans.add(p));
    this.state.lectures.forEach((l) => {
      plans.add(l.pla);
    });

    plans = Array.from(plans);
    this.setState({plans});
  }

  filterLectures() {
    if (this.state.plaSeleccionat === this.props.lang.pickerElemTots) {
      this.setState({lecturesFiltered: this.state.lectures});
      return;
    }

    var lecturesFiltered = this.state.lectures.filter((l) => {
      return (l.pla === this.state.plaSeleccionat);
    });
    this.setState({lecturesFiltered});
  }

  renderMenu() {
    return (
      <View style={{backgroundColor:"#064283", height:75, elevation:5, flexDirection:"row", justifyContent:"space-between"}}>

        <View style={{flexDirection:"row"}}>
          <Dropdown
            label={`${this.props.lang.pickerPla} `}
            data={[{value:this.props.lang.pickerElemTots}, ...this.state.plans.map((p) => {return {value:p}; })]}
            containerStyle={{backgroundColor:"#064283", width:120, marginLeft:16}}
            pickerStyle={{height:300}}
            baseColor="#fff"
            textColor="#fff"
            selectedItemColor="#404040"
            onChangeText={(value) => {
              this.setState({plaSeleccionat:value});
              this.filterLectures();
          } }
          />
          
        </View>

      </View>
    );
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

  renderLectura(item) {
    return (
      <View style={{width:Dimensions.get("window").width-30, margin:15, marginBottom:5, backgroundColor:"#f6f6f6", elevation:3, borderRadius:4, padding:7}}>
        <View style={{borderBottomWidth:1, borderColor:"#ccc", paddingBottom:5, marginBottom:8}}>
          <Text style={{fontSize:14, color:"#595959", fontWeight:"bold"}}>{item.titol}</Text>
        </View>
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>

          <View style={{flex:1}}>
            <Text>{this.props.lang.director+": "+ item.director.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase())}</Text>
            <Text>{this.props.lang.estudiant+": "+ item.estudiant.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase())}</Text>
          </View>

          <View style={{borderLeftWidth:3, borderColor:"#d6d6d6", paddingLeft:5}}>
            <Text style={{color:"#606060", fontSize:14}}>{this.props.lang.dia+": "+this.formatDay(item.inici)+" "}</Text>
            <Text style={{color:"#606060", fontSize:14}}>{this.props.lang.lloc+": "+item.lloc+" "}</Text>
            <Text style={{color:"#606060", fontSize:14}}>{this.props.lang.modalitat+": "+item.modalitat+" "}</Text>
            <Text style={{color:"#606060", fontSize:14}}>{this.props.lang.pla+": "+item.pla+" "}</Text>
          </View>

        </View>
      </View>
    );

  }

  renderLectures() {

    if (this.state.lecturesFiltered.length === 0) {
      return (
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
          <Text>{`${this.props.lang.msgBuit}   `}</Text>
        </View>
      );
    }

    return (
      <View>
        <FlatList
          data={this.state.lecturesFiltered}
          renderItem={({item}) => this.renderLectura(item)}
          keyExtractor={(item) => item.codi.toString()}
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
        {this.renderLectures()}
      </View>
    );

  }
}

function mapStateToProps(state) {
  return {
    token: state.token,
    lang: state.lang.lectures,
    langCode: state.lang.code,
  };
}

export default connect(mapStateToProps, { getToken })(Lectures);
