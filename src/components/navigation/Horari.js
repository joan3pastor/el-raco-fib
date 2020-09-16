import React, { Component } from 'react';
import { Text, View, TouchableHighlight, Alert, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Col, Row, Grid } from "react-native-easy-grid";
import _ from 'lodash';

export class Horari extends Component {

  constructor(props) {
    super(props);
    // defining Alert reference to enable to add a spy wrapper (for testing purposes)
    this.alert = Alert;
  }

  render() {
    
    const paleta = ['#bae1ff','#baffc9','#ffb3ba','#ffffba','#ffdfba', '#d291bc', '#e0bbe4', '#fec8d8'];
    // const paleta = ['#F6BF26','#D50000','#F4511E','#7CB342','#8E24AA', '#039BE5', '#3F51B5', '#0B8043'];

    /**
     * Amarillo: #F6BF26 - 
     * Lila oscuro: #8E24AA -
     * Verde claro: #7CB342 -
     * Azul oscuro: #3F51B5 -
     * Rojo oscuro: #D50000 -
     * Azul claro: #039BE5 - 
     * Verde oscuro: #0B8043 -
     * nARANJA OSCURO: #F4511E
     * 
     * Estilo de fuente original: 500 (ahora "bold")
     * negro -> blanco
     */ 
    
    var { width } = Dimensions.get('window');
    var smallScreen = (width <= 335) ? true : false;

    var horari = null; 
    if (!_.isUndefined(this.props.horari) && !_.isEmpty(this.props.horari)) {
      horari = this.props.horari;
    }
    var parsed = this.parseHorari(paleta, horari);
    var colors = parsed[0];
    var parsedHorari = parsed[1];

    return (
      <View style={{ flex: 1, backgroundColor:'#fafafa' }}>
        <Grid>
          <Row size={70}>
            <Col></Col>
            <Col><View style={{flex:1, justifyContent: 'center', alignItems:'center'}}><Text style={{fontWeight: 'bold', color:'black'}}>{` ${this.props.lang.diesSetmana[0]} `}</Text></View></Col>
            <Col><View style={{flex:1, justifyContent: 'center', alignItems:'center'}}><Text style={{fontWeight: 'bold', color:'black'}}>{` ${this.props.lang.diesSetmana[1]} `}</Text></View></Col>
            <Col><View style={{flex:1, justifyContent: 'center', alignItems:'center'}}><Text style={{fontWeight: 'bold', color:'black'}}>{` ${this.props.lang.diesSetmana[2]} `}</Text></View></Col>
            <Col><View style={{flex:1, justifyContent: 'center', alignItems:'center'}}><Text style={{fontWeight: 'bold', color:'black'}}>{` ${this.props.lang.diesSetmana[3]} `}</Text></View></Col>
            <Col><View style={{flex:1, justifyContent: 'center', alignItems:'center'}}><Text style={{fontWeight: 'bold', color:'black'}}>{` ${this.props.lang.diesSetmana[4]} `}</Text></View></Col>
          </Row>
          {this.printGrid(parsedHorari, colors, smallScreen)}
        </Grid>
      </View>
    );
  }

  parseHorari(paleta, horari) {
    var colorsUtilitzats = 0;
    var colors = {};
    var parsedHorari = {};
    parsedHorari[1] = {};
    parsedHorari[2] = {};
    parsedHorari[3] = {};
    parsedHorari[4] = {};
    parsedHorari[5] = {};
    if (!_.isUndefined(horari) && !_.isEmpty(horari)) {
      horari.results.forEach(clase => {
        if (_.isUndefined(colors[clase.codi_assig.replace(/-\w+/g, '')])) {
          colors[clase.codi_assig.replace(/-\w+/g, '')] = paleta[colorsUtilitzats];
          colorsUtilitzats++;
        }
        for (let i = 0; i < clase.durada; i++) {
          if (_.isUndefined(parsedHorari[clase.dia_setmana][Number(clase.inici.replace(':00',''))+i])) {
            parsedHorari[clase.dia_setmana][Number(clase.inici.replace(':00',''))+i] = {nom:clase.codi_assig.replace(/-\w+/g, ''), grup:clase.grup, tipus:clase.tipus, aules:clase.aules};
          }
          else if (Array.isArray(parsedHorari[clase.dia_setmana][Number(clase.inici.replace(':00',''))+i])) {
            parsedHorari[clase.dia_setmana][Number(clase.inici.replace(':00',''))+i].push({nom:clase.codi_assig.replace(/-\w+/g, ''), grup:clase.grup, tipus:clase.tipus, aules:clase.aules});
          }
          else {
            parsedHorari[clase.dia_setmana][Number(clase.inici.replace(':00',''))+i] = [ parsedHorari[clase.dia_setmana][Number(clase.inici.replace(':00',''))+i], {nom:clase.codi_assig.replace(/-\w+/g, ''), grup:clase.grup, tipus:clase.tipus, aules:clase.aules} ];
          }
        }
      });
    }
    return [colors, parsedHorari]
  }

  printGrid(parsedHorari, colors, smallScreen) {
    var WWidth = Dimensions.get('window').width;
    WWidth = Math.ceil(0.170048 * WWidth + 6);
    if (Number.isNaN(WWidth)) WWidth = "auto";

    var rows = [];
      for (let i = 0; i < 13; i++) {
        var color = (i % 2 == 0) ? '#f6f6f6' : '#fafafa';
        rows.push(
        <Row size={100} key={i} style={{borderTopWidth:0.6, borderColor:'#e0e0e0', backgroundColor:color}}>
          <Col size={155}><View style={{flex:1, justifyContent: 'center', alignItems:'center', backgroundColor:'#E0F2F7'}}><Text style={{fontWeight: 'bold'}}>{' ' + (8+i).toString()+':00' + ' '}</Text></View></Col>
          <Col size={176}>{this.printCell(parsedHorari, 1, 8+i, colors, smallScreen, WWidth)}</Col>
          <Col size={176}>{this.printCell(parsedHorari, 2, 8+i, colors, smallScreen, WWidth)}</Col>
          <Col size={176}>{this.printCell(parsedHorari, 3, 8+i, colors, smallScreen, WWidth)}</Col>
          <Col size={176}>{this.printCell(parsedHorari, 4, 8+i, colors, smallScreen, WWidth)}</Col>
          <Col size={176}>{this.printCell(parsedHorari, 5, 8+i, colors, smallScreen, WWidth)}</Col>
        </Row>);
      }
      return rows;
  }

  printCell(parsedHorari, dia, hora, colors, smallScreen, WWidth) {
    // ! If "size={176}" is changed, calculate new width factor (Actual: 0.170048).

    var textStyle = {color: '#404545', fontWeight:'600', fontSize:this.props.settings.HORARIsize, width: WWidth, textAlign: 'center'};
    if (_.isEmpty(this.props.settings)) {
      return <View />; 
    }
    else if (!_.isEmpty(parsedHorari[dia][hora])){
      if (Array.isArray(parsedHorari[dia][hora])) { //Si té solapaments
        var assigsSolapadas = [];
        parsedHorari[dia][hora].forEach((assig) => {
          assigsSolapadas.push(
            <Text  style={textStyle} key={assig.nom}>{assig.nom}</Text>
          );
        });
        return (
          <TouchableHighlight onPress={() => this.openAlert(parsedHorari[dia][hora]) } style={{flex:1}}>
            <View style={{flex:1, justifyContent: 'center', alignItems:'center', overflow:'hidden', backgroundColor:'#e6e6e6'}}>
              {assigsSolapadas}
            </View>
          </TouchableHighlight>
        );
      }
      else if (/*smallScreen || */(!_.isEmpty(this.props.settings) && this.props.settings.HORARIminimalist)) {
        return (
          <TouchableHighlight onPress={() => this.openAlert(parsedHorari[dia][hora]) } style={{flex:1}}>
            <View style={{flex:1, justifyContent: 'center', alignItems:'center', overflow:'hidden', backgroundColor:colors[parsedHorari[dia][hora].nom]}}>
              <Text   style={{...textStyle, fontSize: textStyle.fontSize+2}}>{parsedHorari[dia][hora].nom + '-' + parsedHorari[dia][hora].tipus}</Text>
            </View>
          </TouchableHighlight>
        );
      }
      return (
      <TouchableHighlight onPress={() => this.openAlert(parsedHorari[dia][hora]) } style={{flex:1}}>
        <View   style={{flex:1, justifyContent: 'center', alignItems:'center', overflow:'hidden', backgroundColor:colors[parsedHorari[dia][hora].nom]}}>
          <Text   style={textStyle}>{parsedHorari[dia][hora].nom + '-' + parsedHorari[dia][hora].tipus + ' ' + parsedHorari[dia][hora].grup}</Text>
          <Text   style={textStyle}>{(!parsedHorari[dia][hora].aules.includes(',')) ? parsedHorari[dia][hora].aules : '...' }</Text>
        </View>
      </TouchableHighlight>
      );
    }
    return (<View />);
  }

  openAlert(clase) {
    if (Array.isArray(clase)) {
      var nom = clase[0].nom;
      var body = '';
      clase.forEach((assig, index) => {
        if (index != 0) {
          nom = nom + ' + ' + assig.nom;
        }
        body = body + `${assig.nom}-${assig.tipus} ${this.props.lang.grup}: ${assig.grup} ${this.props.lang.aula}: ${assig.aules}\n`;
      });
      this.alert.alert(nom, body);
    }
    else {
      this.alert.alert(clase.nom, clase.nom+'-'+clase.tipus+' '+this.props.lang.grup+': '+clase.grup+' '+this.props.lang.aula+': '+clase.aules);
    }
  }
}

function mapStateToProps(state) {
  return {
    horari: state.horari_modificat,
    settings: state.settings,
    lang: state.lang.horari,
  };
}

export default connect(mapStateToProps, {  })(Horari);
