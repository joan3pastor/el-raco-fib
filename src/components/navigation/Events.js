import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import {  } from '../../actions';

export class Events extends Component {

  filterExamens() {
    var assigs = _.uniqBy(this.props.assig.results, 'id').map((assig) => assig.id);
    var allEvents = [...this.props.examens.results.filter((examen) => {
      return assigs.find((assig) => { return assig == examen.assig; }) 
    }).map((examen) => {
      return {
        tipus: 'examen', 
        assig: examen.assig, 
        dia: /\d+-\d+-\d+/.exec(examen.inici)[0], 
        horaInici: /\d+:\d+/.exec(examen.inici)[0], 
        horaFi: /\d+:\d+/.exec(examen.fi)[0], 
        tipusExamen: examen.tipus};
    })];
    return allEvents;
  }

  filterEvents(events) {
    var eventsFI = [];
    var allEvents = [...events, ...this.props.events.results.filter(({nom}) =>  nom == 'FESTIU' || nom == 'CANVI DIA' || nom == 'VACANCES' || nom == 'FESTA FIB' || nom == 'FI-EXAMENS' || nom == 'CURS').map((event) => {
      if (event.inici != event.fi && event.nom != 'FESTIU') {
        eventsFI.push({
          tipus: 'event',
          nom: 'FI-' + event.nom,
          dia: /\d+-\d+-\d+/.exec(event.fi)[0], 
          hora: '00:00',
        });
        return {
          tipus: 'event',
          nom: 'INICI-' + event.nom,
          dia: /\d+-\d+-\d+/.exec(event.inici)[0], 
          hora: '00:00',
        };

      } else if (event.inici != event.fi && event.nom == 'FESTIU') { //Si és un Festiu de més d'un día
        let dateInici = new Date(/\d+-\d+-\d+/.exec(event.inici)[0]);
        let dateFi = new Date(/\d+-\d+-\d+/.exec(event.fi)[0]);
        while (dateFi.getTime() > dateInici.getTime()) {

          dateInici.setDate(dateInici.getDate()+1);
          let diaAny = String(dateInici.getFullYear());
          let diaMes = String(dateInici.getMonth()+1);
          let diaDia = String(dateInici.getDate());
          if (diaMes.length == 1) diaMes = '0'+diaMes;
          if (diaDia.length == 1) diaDia = '0'+diaDia;
          eventsFI.push({
            tipus: 'event',
            nom: event.nom,
            dia: `${diaAny}-${diaMes}-${diaDia}`, 
            hora: '00:00',
          });
        }
        return {
          tipus: 'event',
          nom: event.nom,
          dia: /\d+-\d+-\d+/.exec(event.inici)[0], 
          hora: '00:00',
        };

      } //Si és un event d'un únic día
      return {
        tipus: 'event',
        nom: event.nom,
        dia: /\d+-\d+-\d+/.exec(event.inici)[0], 
        hora: '00:00',
      };
    })];
    allEvents = [...allEvents, ...eventsFI];

    return allEvents;
  }

  filterByDay(events) {
    var allEvents = _.orderBy(events, ['dia', 'hora'], ['asc', 'asc']).filter((ev) => {
      // * 3 Meses en ms = 7776000000
      // * 1 Dia en ms = 86400000
      let diff = new Date(ev.dia) - new Date();
      if (diff < -86400000) return false;  //Si ya ha pasado 1 día
      if (diff > 7776000000) return false; // Si faltan mas de 3 meses
      return true;
    });
    return allEvents;
  }

  // filterPractiques(events) {
  //   var allEvents = [...events, ...this.props.practiques.results.map((practica) => {
  //     return {
  //       tipus: 'practica',
  //       nom: practica.titol,
  //       assig: practica.codi_asg,
  //       dia: /\d+-\d+-\d+/.exec(practica.data_limit)[0], 
  //       hora: /\d+:\d+/.exec(practica.data_limit)[0],
  //     };
  //   })];
  //   return allEvents;
  // }

  getEvents() {
    //FILTER EXAMENS:
    var allEvents = this.filterExamens();
    //FILTER EVENTS:
    allEvents = this.filterEvents(allEvents);
    //FILTER BY DAY:
    allEvents = this.filterByDay(allEvents);
    return allEvents;
  }

  formatDay(pre) {
    try {
      var ind = pre.split('-');
      return `${ind[2]}/${ind[1]}/${ind[0]}`;
    } catch {
      return "?";
    }
  }

  render() {
    if (_.isUndefined(this.props.examens.results) || _.isUndefined(this.props.events.results) /*|| _.isUndefined(this.props.practiques.results)*/) {
      return (
        <View style={{backgroundColor:'#fafafa', flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text>Carregant propers esdeveniments...</Text>
        </View>
      );
    }

    displayEvents = this.getEvents().map((ev) => {
      if (ev.tipus == 'examen') {
        return (
          <View key={`ex${ev.dia}${ev.inici}${ev.assig}`} style={{flexDirection:'row', backgroundColor:'#fff',  margin:5, marginLeft:15, marginRight:15, borderRadius:5, padding: 12, elevation:1}}>
            <Text style={{color:'#555555'}}>{`${this.formatDay(ev.dia)} ${ev.horaInici}-${ev.horaFi}: `}</Text>
            <Text style={{color:'#555555', fontWeight:'bold'}}>{`${ev.assig} Examen ${ev.tipusExamen=='P' ? 'Parcial' : 'Final'}   `}</Text>
          </View>
        );
      }
      if (ev.tipus == 'event') {
        return (
          <View key={`ev${ev.dia}${ev.nom}`} style={{flexDirection:'row', backgroundColor:'#fff',  margin:5, marginLeft:15, marginRight:15, borderRadius:5, padding: 12, elevation:1}}>
            <Text style={{color:'#555555'}}>{`${this.formatDay(ev.dia)}: `}</Text>
            <Text style={{color:'#555555', fontWeight:'bold'}}>{`${ev.nom}   `}</Text>
          </View>
        );
      }
      if (ev.tipus == 'practica') {
        return (
          <View key={`pr${ev.assig}${ev.nom}`} style={{flexDirection:'row', backgroundColor:'#fff',  margin:5, marginLeft:15, marginRight:15, borderRadius:5, padding: 12, elevation:1}}>
            <Text style={{color:'#555555'}}>{`${this.formatDay(ev.dia)} ${ev.hora}: `}</Text>
            <Text style={{color:'#555555', fontWeight:'bold'}}>{`${ev.assig} Practica ${ev.nom}   `}</Text>
          </View>
        );
      }
      return <View ></View>
    });

    return (
      <ScrollView style={{backgroundColor:'#fafafa', flex:1, paddingTop:10}}>
        {displayEvents}
    <Text style={{margin:10, marginBottom:30}}>{`${this.props.lang.footer}     `}</Text>
      </ScrollView>
    );
  }

}

function mapStateToProps(state) {
  return { 
    examens: state.examens,
    events: state.events,
    practiques: state.practiques,
    assig: state.assig,
    lang: state.lang.events,
  };
}

export default connect(mapStateToProps, {  })(Events);
