
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions, ActivityIndicator, SectionList } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconE from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';

import { QActualURL, aulesURL } from '../../external_links';
import { getToken } from '../../actions';
import updateToken from '../../actions/updateToken';
import { ScrollView } from 'react-native-gesture-handler';

export const aulesTipusLab = ["A5S108","A5S109","A5S112","A5S113","B5S201","B5S202","C6S301","C6S302","C6S303","C6S306","C6S308","C6S309"];
export const aulesEspecials = ["D6003","C5S201","C5S202","C5S203","A4002","A3204","A1S101", "Online", "ONLINE", "---", "-", "*", "UB Classroom"]; //* Aules descartades

export class Aules extends Component {

  constructor(props) {
    super(props);
    this.aulesEspecials = aulesEspecials;
    this.aulesTipusLab = aulesTipusLab;
    this.updateToken = updateToken;
    this.state = {
      ready: false,
      aules: [],
      classes: [],
      aulesParsed: {},
      aulesParsedFiltered: [],
      filterDia: "",
      filterHoraInici: "",
      filterDurada: "",
      filterTipus: this.props.lang.pickerTipus[0], // Tots | Lab | Aula
    };
  }

  async componentDidMount() {
    await this.getData();
    this.parseAules();
    this.setState({ready:true});
  }

  async getData() {
    await this.updateToken.bind(this)().then( async (token) => {
      try {
        await axios(aulesURL, {
          headers: {'Authorization': `Bearer ${token}`, 'Accept-Language':this.props.langCode}
        }).then((resp) => {
          this.setState({aules:resp.data.results});
        });
        
        await axios(QActualURL, {
          headers: {'Authorization': `Bearer ${token}`, 'Accept-Language':this.props.langCode}
        }).then( async (resp1) => {
          await axios(resp1.data.classes, {
            headers: {'Authorization': `Bearer ${token}`, 'Accept-Language':this.props.langCode}
          }).then((resp2) => {
            this.setState({classes:resp2.data.results});
          });
        });

      } catch (err) {} //{alert("Error de connexió...\n").JSON.stringify(err)}
    });
  }

  parseAules() {

    var aules = {};
    this.state.aules.forEach((a) => {
      if (!this.aulesEspecials.includes(a.id)) {
        aules[a.id] = {
          1: new Array(13).fill(false),
          2: new Array(13).fill(false),
          3: new Array(13).fill(false),
          4: new Array(13).fill(false),
          5: new Array(13).fill(false),
        }
      }
    })

    this.state.classes.forEach((c, indexClase) => {
      if (!this.aulesEspecials.includes(c.aules)) {
      
        // Get hores from 08:00 to 20:00 as 0 to 12 
        const inici = Number(c.inici.split(":")[0]) - 8;
        const horesClase = new Array(c.durada);
        for (var i = 0; i < c.durada; i++) horesClase[i] = inici + i;
        //if (indexClase === 0) alert(JSON.stringify(horesClase));
        
        // Get aules
        var aulesClase = [c.aules];
        if (c.aules.includes(',')) {
          aulesClase = JSON.parse( '["' + c.aules.replace(/\s/g,'').replace(/,/g,'","') + '"]' );
        }
        //if (indexClase === 0) alert(JSON.stringify(aulesClase));


        horesClase.forEach((h) => {
          aulesClase.forEach((a) => {
            if (!this.aulesEspecials.includes(a)) {

              
              try {
                aules[a][c.dia_setmana][h] = true;
              } catch (error) {
                //alert(c.codi_assig + " - " + c.grup + " - " + c.dia_setmana + " - " + a)
              }
              
            }
          })
        });
  
      }
    });
    
    this.setState({aulesParsed:aules});

    /**
    {
      A5XXX: {
        1: [](13), // true=Ocupat, false=Free 
        2: [](13),
        3: [](13),
        4: [](13),
        5: [](13),
      }
      ...
    }
     */
    
  }

  getIndexHora(hora) {
    return ( Number(hora.split(":")[0]) - 8 );
  }

  filterAules() {
    if (this.state.filterDia == "" || this.state.filterHoraInici == "" || this.state.filterDurada == "") return;
      if (this.getDia(this.state.filterDia) === -1) { // Avui == fin de semana
        this.setState({aulesParsedFiltered: []});
        return;
      }

    var aulesFiltered = [];

    Object.keys(this.state.aulesParsed).forEach((aula) => {
      if ( (this.state.filterTipus === this.props.lang.pickerTipus[2] && this.aulesTipusLab.includes(aula)) || (this.state.filterTipus === this.props.lang.pickerTipus[1] && !this.aulesTipusLab.includes(aula)) || (this.state.filterTipus === this.props.lang.pickerTipus[0]) ) {
        const dia = this.state.aulesParsed[aula][this.getDia(this.state.filterDia)];
        const horaInici = this.getIndexHora(this.state.filterHoraInici);
        const durada = Number(this.state.filterDurada.split("h")[0])

        var aulaValida = true;

        for (var i = 0; i < durada; i++) {
          if (horaInici+i < 13) {
            if (dia[horaInici+i] === true) aulaValida = false;
          }
        }

        
        if (aulaValida === true) {
          
          var horesLliures = 0;
          var broken = false;
          for (var i = horaInici; i < 13; i++) {
            if (!broken) {
              if (dia[i] === true) broken = true;
              else horesLliures++;
            }
          }
          
          aulesFiltered.push({
            "aula": aula,
            "inici": horaInici + 8,
            "final": horaInici + horesLliures + 8,
          });

        }
      }
    });

    this.setState({aulesParsedFiltered: aulesFiltered});
  
  }

  getDia(d) {
    if (d == this.props.lang.pickerDia[0]) {
      const date = new Date();
      if (date.getDay() > 5 || date.getDay() == 0) return -1;
      return date.getDay();
    } 
    else if (d == this.props.lang.pickerDia[1] || d == "dl.") return 1;
    else if (d == this.props.lang.pickerDia[2] || d == "dt.") return 2;
    else if (d == this.props.lang.pickerDia[3] || d == "dc.") return 3;
    else if (d == this.props.lang.pickerDia[4] || d == "dj.") return 4;
    else if (d == this.props.lang.pickerDia[5] || d == "dv.") return 5;
    return -1;
  } 

  renderMenu() {
    // Buscar Aula Lliure
    //  - Dia
    //  - HoraInici
    //  - Tipus Aula
    //  - Durada
    // Consultar Aula
    //  - Seleccionar Aula

    return (
      <View style={{backgroundColor:"#064283", height:75, elevation:5, flexDirection:"row", justifyContent:"space-between"}}>
        <View style={{flexDirection:"row"}}>
          <ScrollView horizontal={true}>
          
        <Dropdown
            label={`${this.props.lang.pickerDiaNom} `}
            //data={[{value:"Avui"}, {value:"DILLUNS"}, {value:"DIMARTS"}, {value:"DIMECRES"}, {value:"DIJOUS"}, {value:"DIVENDRES"}]}
            data={this.props.lang.pickerDiaFormat}
            containerStyle={{backgroundColor:"#064283", width:80, marginLeft:16}}
            pickerStyle={{height:260}}
            baseColor="#fff"
            textColor="#fff"
            selectedItemColor="#404040"
            onChangeText={(value) => {
              this.setState({filterDia:value});
              this.filterAules();
          }}
          />

          <Dropdown
            label={`${this.props.lang.pickerIniciNom} `}
            data={[{value:"08:00"}, {value:"09:00"}, {value:"10:00"}, {value:"11:00"}, {value:"12:00"}, {value:"13:00"}, {value:"14:00"}, {value:"15:00"}, {value:"16:00"}, {value:"17:00"}, {value:"18:00"}, {value:"19:00"}, {value:"20:00"}, ]}
            containerStyle={{backgroundColor:"#064283", width:65, marginLeft:16}}
            pickerStyle={{height:400}}
            baseColor="#fff"
            textColor="#fff"
            selectedItemColor="#404040"
            onChangeText={(value) => {
              this.setState({filterHoraInici:value});
              this.filterAules();
          } }
          />

          <Dropdown
            label={`${this.props.lang.pickerDuradaNom} `}
            data={[{value:"1h+"}, {value:"2h+"}, {value:"3h+"}, {value:"4h+"}, {value:"5h+"}, {value:"6h+"},]}
            containerStyle={{backgroundColor:"#064283", width:85, marginLeft:16}}
            pickerStyle={{height:260}}
            baseColor="#fff"
            textColor="#fff"
            selectedItemColor="#404040"
            onChangeText={(value) => {
              this.setState({filterDurada:value});
              this.filterAules();
          } }
          />

          <Dropdown
            label={`${this.props.lang.pickerTipusNom} `}
            data={this.props.lang.pickerTipusFormat}
            containerStyle={{backgroundColor:"#064283", width:65, marginLeft:16}}
            pickerStyle={{height:150}}
            baseColor="#fff"
            textColor="#fff"
            selectedItemColor="#404040"
            onChangeText={(value) => {
              this.setState({filterTipus:value});
              this.filterAules();
          } }
          />

        </ScrollView>

        </View>
      </View>
    );
  }

  renderAula(item) {

    const m = 10;
    const w = Dimensions.get("window").width / 3 - (m * 2) - 7;

    return (
      <View style={{height:80, width:w, margin:m, backgroundColor:"#f6f6f6", elevation:3, borderRadius:4, padding:7, alignItems:"center"}} key={item.aula+item.inici.toString()+item.final.toString()}>
        <Text style={{color:"#6a6a6a", fontWeight:"bold", marginTop:4, marginBottom:2, fontSize:16}}>{"  "+item.aula+"  "}</Text>
        <Text style={{textAlign:"center"}}>{`  ${this.props.lang.aulaMsgLinia1}  `}</Text>
        <Text style={{textAlign:"center"}}>{"  "+this.props.lang.aulaMsgLinia2+" " + item.final.toString() + ":00  "}</Text>
      </View>
    );
  }

  renderAules() {

    var msg = "";
    if (this.state.filterDia === "") msg = `${this.props.lang.msgSelecDia}  `;
    else if (this.state.filterHoraInici === "") msg = `${this.props.lang.msgSelecInici}  `;
    else if (this.state.filterDurada === "") msg = `${this.props.lang.msgSelecDurada}  `;
    if (msg !== "") {
      return (
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
          <Text>{"   "+msg+"  "}</Text>
        </View>
      );
    }

    if (this.state.aulesParsedFiltered.length === 0) {
      return (
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
          <Text>{"No hi ha aules que compleixin els requisits.  "}</Text>
        </View>
      );
    }


  //alert(JSON.stringify(this.state.aulesParsed["A6101"]));

    var aules = [];
    var labs = [];
    this.state.aulesParsedFiltered.forEach((a) => {
      if (this.aulesTipusLab.includes(a.aula)) labs.push(a);
      else aules.push(a);
    })

    var titleAules = <View />;
    var titleLabs = <View />;
    if (aules.length > 0) {
      titleAules = (
        <Text style={{fontSize:22, color:"#4a4a4a", fontWeight:"bold", borderBottomWidth:2, borderColor:"#ddd", width:150, paddingBottom:4, marginLeft:12, marginTop:20}}>{`${this.props.lang.sectionAules}  `}</Text>
      );
    }
    if (labs.length > 0) {
      titleLabs = (
        <Text style={{fontSize:22, color:"#4a4a4a", fontWeight:"bold", borderBottomWidth:2, borderColor:"#ddd", width:150, paddingBottom:4, marginLeft:12, marginTop:20}}>{`${this.props.lang.sectionLabs}  `}</Text>
      );
    }

    return (
      <ScrollView>

        {titleAules}
        <View style={{flexDirection:"row", flexWrap:"wrap", paddingHorizontal:10}}>
          {aules.map((a) => this.renderAula(a))}
        </View>

        {titleLabs}
        <View style={{flexDirection:"row", flexWrap:"wrap", paddingHorizontal:10}}>
          {labs.map((a) => this.renderAula(a))}
        </View>

      </ScrollView>
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
        {this.renderAules()}
      </View>
    );

  }
}

function mapStateToProps(state) {
  return {
    token: state.token,
    lang: state.lang.aules,
    langCode: state.lang.code,
  };
}

export default connect(mapStateToProps, { getToken })(Aules);
