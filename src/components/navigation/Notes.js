
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions, ScrollView, Alert, Button, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import Collapsible from 'react-native-collapsible';
import IconFA from 'react-native-vector-icons/FontAwesome';
import ProgressCircle from 'react-native-progress-circle';
import Modal from "react-native-modal";

import { connect } from 'react-redux';
import _ from 'lodash';

import { notesToRedux } from '../../actions';
import { stringify } from 'querystring';

export class Notes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      opened:null, // OPENED ASSIG
      addEntryOpened:null, // OPENED MODAL
      addNom:null,
      addWeight: null,
      addNota: null,
      addIndex: null,
    };
  }

  renderNotes(assigid) {
    var notes = [];

    //alert(JSON.stringify(this.props.notes[assigid]))

    this.props.notes[assigid].forEach((n, index) => {
      notes.push(
        <View key={n.titol + index.toString() + assigid} style={{ flexDirection:"row", justifyContent:"space-between", padding:10, marginHorizontal:10, marginVertical:5 , backgroundColor:"#f0f0f0", borderRadius:6}}>
          <View>
            <Text style={{fontWeight:"bold"}}>{n.titol+"  "}</Text>
            <Text style={{}}>{"(" + (n.weight*100).toFixed()+"%)" + `    ${this.props.lang.textNota}: ` + (n.nota === "" || n.nota === null ? "-" : n.nota.toFixed(2)) + "  "}</Text>
          </View>
          <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
            <TouchableOpacity onPress={() => {

              var nota = n.nota;
              if (nota !== null) nota = nota.toString();

              this.setState({
                addEntryOpened:assigid,
                addNom:n.titol,
                addWeight: n.weight.toString(),
                addNota: nota,
                addIndex: index,
              });
            }}><IconFA style={{marginTop:7}} name='pencil' size={22} color='#505050' /></TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert(
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
                    var notes = this.props.notes;
                    notes[assigid].splice(index,1);
                    this.props.notesToRedux(notes);
                    this.setState({forceUpdate: Date.now()});
                  }
                }
              ]
            )
          }>
            <IconFA style={{marginTop:7, marginLeft:18, marginRight:5}} name='trash' size={22} color='#505050' />
          </TouchableOpacity>
          </View>
        </View>
      );
    });

    return notes;
  }

  verifyAndSaveForm(index) {

    //alert(JSON.stringify(this.props.notes)); return;

    var nom, nota, pes;

    if (this.state.addNom === "" || this.state.addNom === null) {
      alert("ERROR: Nom no introduït.");
      return;
    }

    if (this.state.addWeight === "" || this.state.addWeight === null) {
      alert("ERROR: Pes no introduït.");
      return;
    }

    nom = this.state.addNom;
    pes = this.state.addWeight
    nota = this.state.addNota
    if (typeof(this.state.addWeight) == "string") pes = this.state.addWeight.replace(",", ".");
    if (typeof(this.state.addNota) == "string") nota = this.state.addNota.replace(",", ".");

    pes = Number(pes);
    if (isNaN(pes)) {
      alert("ERROR: Pes no vàlid. Entre 0 i 1.");
      return;
    }
    else if (pes > 1 || pes < 0) {
      alert("ERROR: Pes no vàlid. Entre 0 i 1.");
      return;
    }
    else {
      // Comprobar que el total no exceda del 100
      var totalWeight = pes;
      this.props.notes[this.state.addEntryOpened].forEach((n) => {
        totalWeight += n.weight;
      });
      if (!_.isUndefined(index)) totalWeight -= this.props.notes[this.state.addEntryOpened][index].weight;
      if (totalWeight > 1.0005) {
        alert("ERROR: El pes total de l'assignatura supera el 100%.");
        return;
      }
    }

    if (nota !== "" && nota !== null) {
      nota = Number(nota);
      if (isNaN(nota)) {
        alert("ERROR: Nota no vàlilda. Entre 0 i 10 o nul.");
        return;
      }
      else if (nota > 10 || nota < 0) {
        alert("ERROR: Nota no vàlilda. Entre 0 i 10 o nul.");
        return;
      }
    }
    
    if (nota === "") nota = null;
    
    const entrada = {
      titol: nom,
      weight: pes,
      nota: nota,
    };
    
    var notes = this.props.notes;

    if (_.isUndefined(index)) notes[this.state.addEntryOpened].push(entrada); 
    else notes[this.state.addEntryOpened][index] = entrada;
    this.props.notesToRedux(notes);
    this.setState({
      addEntryOpened:null,
      addNom:null,
      addWeight: null,
      addNota: null,
      addIndex: null,
    });

  }

  renderAfegirEntrada() {
    return (
      <Modal 
          isVisible={this.state.addEntryOpened !== null }
          onBackdropPress={() => this.setState({ addEntryOpened:null })} 
          onBackButtonPress={() => this.setState({ addEntryOpened:null })} 
          style={{margin:0}}
        >
          <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <View style={{backgroundColor:"#fff", width:Dimensions.get('window').width-80, height:330, borderRadius:8, padding:14}} >
              
              <View style={{marginTop:10}} >
                <Text style={{fontSize:16, fontWeight:"400", color:"#606060"}}>{this.props.lang.aeNom+"*:  "}</Text>
                <TextInput 
                  value={this.state.addNom}
                  onChangeText={(nom) => this.setState({addNom:nom})}
                  style={{ height: 40, borderColor: 'lightgray', backgroundColor:"#f2f2f2", borderWidth:1, borderRadius:3}}
                />
              </View>

              <View style={{marginTop:10}} >
                <Text style={{fontSize:16, fontWeight:"400", color:"#606060"}}>{this.props.lang.aePes+"*:  "}</Text>
                <TextInput 
                  keyboardType="decimal-pad"
                  value={this.state.addWeight}
                  onChangeText={(pes) => this.setState({addWeight:pes})}
                  style={{ height: 40, borderColor: 'lightgray', backgroundColor:"#f2f2f2", borderWidth:1, borderRadius:3}}
                />
              </View>

              <View style={{marginTop:10}} >
                <Text style={{fontSize:16, fontWeight:"400", color:"#606060"}}>{this.props.lang.aeNota+":  "}</Text>
                <TextInput 
                  keyboardType="decimal-pad"
                  value={this.state.addNota}
                  onChangeText={(nota) => this.setState({addNota:nota})}
                  style={{ height: 40, borderColor: 'lightgray', backgroundColor:"#f2f2f2", borderWidth:1, borderRadius:3}}
                />
              </View>

              <View style={{flexDirection:"row", justifyContent:"space-around", marginTop:26}} >
                <TouchableOpacity activeOpacity={0.9} onPress={() => {
                  this.setState({
                    addEntryOpened:null,
                    addNom:null,
                    addWeight: null,
                    addNota: null,
                    addIndex: null,
                  });
                }} >
                  <View style={{backgroundColor:"#dc3545", padding:6, borderRadius:6, elevation:4, width:110, justifyContent:"center"}}>
                    <Text style={{color:"#fff", fontWeight:"bold", alignSelf:"center"}} >{` ${this.props.lang.bttnCancellar} `}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} onPress={()=>{

                  if (this.state.addIndex === null) this.verifyAndSaveForm();
                  else this.verifyAndSaveForm(this.state.addIndex);

                }} >
                  <View style={{backgroundColor:"#28a745", padding:6, borderRadius:6, elevation:4, width:110, justifyContent:"center"}}>
                    <Text style={{color:"#fff", fontWeight:"bold", alignSelf:"center"}} >{` ${this.props.lang.bttnGuardar} `}</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </View>
      </Modal>
    );
  }

  renderOverview() {

    var progress = 0;
    var final = 0;
    var avg = 0;
    var trueProgress = 0;
    const assigP = [];
    const assigA = [];

    this.props.assig.results.forEach((assig) => {
      progress += this.calculateProgress(assig.id)[0] / this.props.assig.count;
      trueProgress += this.calculateProgress(assig.id)[0];
      final += this.calculateFinal(assig.id)[0] / this.props.assig.count;

      assigP.push(this.calculateProgress(assig.id)[0]);
      assigA.push(this.calculateAVG(assig.id)[0]);
    });

    assigA.forEach((a, index) => {
      avg += a * assigP[index];
    })
    avg = avg / trueProgress;

    if (isNaN(avg)) avg = 0;
    if (isNaN(final)) final = 0;
    if (isNaN(progress)) progress = 0;

    return (
    <View style={{backgroundColor:"#064283", width:Dimensions.get('window').width, padding:14, elevation:5, flexDirection:"row", justifyContent:"space-around"}}>
      <View style={{alignItems:"center"}}>
        <ProgressCircle percent={avg} radius={26} borderWidth={7} color="#3399FF" shadowColor="#fff" bgColor="#064283">
          <Text style={{fontSize:13, color:"#fff", fontWeight:"bold", textAlign:"center"}}>{"  "+(avg/10).toFixed(2)+"  "}</Text>
        </ProgressCircle>
        <Text style={{fontSize:14, color:"#fff", fontWeight:"bold", marginTop:4, textAlign:"center"}} >{`  ${this.props.lang.mitja}  `}</Text>
      </View>
      <View style={{alignItems:"center"}}>
        <ProgressCircle percent={final} radius={26} borderWidth={7} color="#3399FF" shadowColor="#fff" bgColor="#064283">
          <Text style={{fontSize:13, color:"#fff", fontWeight:"bold", textAlign:"center"}}>{"  "+(final/10).toFixed(2)+"  "}</Text>
        </ProgressCircle>
    <Text style={{fontSize:14, color:"#fff", fontWeight:"bold", marginTop:4, textAlign:"center"}} >{`  ${this.props.lang.final}  `}</Text>
      </View>
      <View style={{alignItems:"center"}}>
        <ProgressCircle percent={progress} radius={26} borderWidth={7} color="#3399FF" shadowColor="#fff" bgColor="#064283">
          <Text style={{fontSize:13, color:"#fff", fontWeight:"bold", textAlign:"center"}}>{"  "+progress.toFixed(0)+"%  "}</Text>
        </ProgressCircle>
        <Text style={{fontSize:14, color:"#fff", fontWeight:"bold", marginTop:4, textAlign:"center"}} >{`  ${this.props.lang.progres}  `}</Text>
      </View>
    </View>
    );
  }

  calculateAVG(assig) {
    const notes = this.props.notes[assig];
    var avg = 0;
    var weight = 0;
    notes.forEach(n => {
      if (n.nota !== null && n.nota !== '') {
        avg += n.nota * n.weight;
        weight += n.weight;
      }
    });

    if (weight > 0) avg = avg / weight;

    var color = '#ff0000';
    if (avg >= 5) color = '#0bdb00';

    return [Number((avg*10).toFixed(2)), avg.toFixed(2), color];
  }

  calculateFinal(assig) {
    const notes = this.props.notes[assig];
    var final = 0;
    notes.forEach(n => {
      if (n.nota !== null && n.nota !== '') final += n.nota * n.weight;
    });

    var color = '#ff0000';
    if (final >= 5) color = '#0bdb00';

    return [final*10, final.toFixed(2), color];
  }

  calculateProgress(assig) {
    const notes = this.props.notes[assig];
    var progress = 0;
    notes.forEach(n => {
      if (n.nota !== null && n.nota !== '') progress += n.weight;
    });

    return [progress*100,(progress*100).toFixed(0)+'%'];
  }  

  afegirEntrada(assigid) {
    if (this.calculateProgress(assigid)[0] >= 100) {
      alert("La suma dels pesos de cada entrada és igual o major a 100%.");
      return;
    }
    this.setState({
      addEntryOpened:assigid,
      addNom:"",
      addWeight: "",
      addNota: "",
      addIndex: null,
    });
  }

  renderAssigs() {

    const paleta = ['#bae1ff','#baffc9','#ffb3ba','#ffffba','#ffdfba', '#d291bc', '#e0bbe4', '#fec8d8'];

    var assigs = this.props.assig.results.map((a, index) => {

      return (
        <View key={a.id} style={{marginHorizontal:30, marginTop:15, backgroundColor:'#fff', borderColor:'#f2f2f2', borderWidth:0.5, borderRadius:5, elevation:3}}>

          <View style={{}}>
            <TouchableOpacity activeOpacity={0.9} onPress={()=>{
              if (this.state.opened !== a.id) this.setState({opened:a.id});
              else this.setState({opened:null});
          }}> 
              <View style={{flex:1,borderTopLeftRadius:5, borderTopRightRadius:5 , backgroundColor:paleta[index], flexDirection:"row",justifyContent: "space-between" , borderBottomWidth:1, borderBottomColor:'gray', }}>
                <View style={{width:Dimensions.get('window').width - 55}}>
                  <Text style={{fontWeight:'bold', color:'#505050', padding:10}}>{a.nom + "   "}</Text>
                </View>
              </View>
              <View style={{flexDirection:"row", justifyContent:"space-around", marginHorizontal:10}} >
                <View style={{alignItems:"center", padding:8, paddingTop:12}} >
                  <ProgressCircle percent={this.calculateAVG(a.id)[0]} radius={20} borderWidth={5} color={this.calculateAVG(a.id)[2]} shadowColor="#d7d7d7" bgColor="#fff">
                    <Text style={{ fontSize: 12, textAlign:"center" }}>{"  "+this.calculateAVG(a.id)[1]+"  "}</Text>
                  </ProgressCircle>
                  <Text style={{fontSize:12, textAlign:"center"}} >{`  ${this.props.lang.mitja}  `}</Text>
                </View>
                <View style={{alignItems:"center", padding:8, paddingTop:12}} >
                  <ProgressCircle percent={this.calculateFinal(a.id)[0]} radius={20} borderWidth={5} color={this.calculateFinal(a.id)[2]} shadowColor="#d7d7d7" bgColor="#fff">
                    <Text style={{ fontSize: 12, textAlign:"center" }}>{"  "+this.calculateFinal(a.id)[1]+"  "}</Text>
                  </ProgressCircle>
                  <Text style={{fontSize:12, textAlign:"center"}} >{`  ${this.props.lang.final}  `}</Text>
                </View>
                <View style={{alignItems:"center", padding:8, paddingTop:12}} >
                  <ProgressCircle percent={this.calculateProgress(a.id)[0]} radius={20} borderWidth={5} color="#3399FF" shadowColor="#d7d7d7" bgColor="#fff">
                    <Text style={{ fontSize: 12, textAlign:"center" }}>{"  "+this.calculateProgress(a.id)[1]+"  "}</Text>
                  </ProgressCircle>
                  <Text style={{fontSize:12, textAlign:"center"}} >{`  ${this.props.lang.progres}  `}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{}}>
            <Collapsible collapsed={this.state.opened !== a.id}>
              {this.renderNotes(a.id)}
              <View style={{margin:10}}>
                <Button title={this.props.lang.bttnAfegir} onPress={() => this.afegirEntrada(a.id)} />
              </View>
            </Collapsible>
          </View>
          
        </View>
      );
    });
    
    return assigs;
  }

  render() {


    //alert(this.state.addNota)
    //alert(JSON.stringify(this.props.assig.results))

    if ((_.isUndefined(this.props.notes) || _.isEmpty(this.props.notes)) || (_.isUndefined(this.props.assig) || _.isEmpty(this.props.assig))) {
      return (
        <View style= {{flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#fafafa'}}>
          <Text>{`  ${this.props.lang.empty}  `}</Text>
        </View>
      );
    }

    return (
      <View style={{flex:1, backgroundColor:'#fdfdfd', alignItems:'center'}}>

        {this.renderOverview()}
        <ScrollView>
          {this.renderAssigs()}
          <Text/>
        </ScrollView>

        {this.renderAfegirEntrada()}

      </View>
    );

  }
}

function mapStateToProps(state) {
  return {
    notes: state.notes,
    assig: state.assig,
    lang: state.lang.notes,
  };
}

export default connect(mapStateToProps, { notesToRedux })(Notes);


/**

import { Alert } from 'react-native'; 

onButtonPress = () => {
    Alert.prompt(
      "Enter password",
      "Enter your password to claim your $1.5B in lottery winnings",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: password => console.log("OK Pressed, password: " + password)
        }
      ],
      "secure-text"
    );
  };
}

 */


/*
    this.props.notesToRedux(
      notes = {
        AS: [
         {
           titol: "Examen Parcial 1",
           nota: 5.6,
           weight: 0.30
         },
         {
           titol: "Examen Parcial 2",
           nota: 8,
           weight: 0.40
         },
         {
           titol: "Lab",
           nota: null,
           weight: 0.30
         },
        ],
        ROB: [
         {
           titol: "Examen Parcial 1",
           nota: 5.6,
           weight: 0.30
         },
         {
           titol: "Examen Parcial 2",
           nota: 8,
           weight: 0.40
         },
         {
           titol: "Lab",
           nota: null,
           weight: 0.30
         },
        ],
        ASW: [
         {
           titol: "Examen Parcial 1",
           nota: 5.6,
           weight: 0.30
         },
         {
           titol: "Examen Parcial 2",
           nota: 8,
           weight: 0.40
         },
         {
           titol: "Lab",
           nota: null,
           weight: 0.30
         },
        ],
        ER: [],
        ASDP: [],
      }
    );
*/



// NOTA MITJA QUADRI MAL