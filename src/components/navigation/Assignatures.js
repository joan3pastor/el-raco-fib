import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
import Modal from "react-native-modal";
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';

import updateToken from '../../actions/updateToken';
import { getToken } from '../../actions';

export class Assignatures extends Component {

  constructor(props) {
    super(props);
    this.state = {needToFetch:true};

    this.updateToken = updateToken;
  }

  componentDidMount() {
    setTimeout(() => this.fetchData(), 3 * 1000);
  }

  renderProfs(profs) {
    var lista = [];
    profs.forEach((prof) => {
      if (prof.is_responsable) {
        lista.unshift(
          <View key={prof.email} style={{ padding:5 }}>
            <Text style={{ color:'#404040', fontSize:this.props.AVISOSsize}}>{`${prof.nom} (${this.props.lang.responsable}) `}</Text>
            <Text style={{ color:'#404040', fontSize:this.props.AVISOSsize }}>{prof.email}</Text>
          </View>
        );
      } else {
        lista.push(
          <View key={prof.email} style={{ padding:5 }}>
            <Text style={{ color:'#404040', fontSize:this.props.AVISOSsize }}>{prof.nom}</Text>
            <Text style={{ color:'#404040', fontSize:this.props.AVISOSsize }}>{prof.email}</Text>
          </View>
        );
      }
    });
    return lista;
  }

  createCards() {
    var cards = [];
    if (_.isUndefined(this.props.assig.results)) {
      return (
        <View style={{height:120, flex:1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size='large' color='#2020ff' />
        </View>
      );
    }

    var orderedAssig = _.orderBy(this.props.assig.results, ['id'], ['asc']);

    const deviceWidth = Dimensions.get("window").width;
    const deviceHeight = require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");


    //if (deviceHeight != Dimensions.get("window").height) alert(`Real:${deviceHeight} Calculated:${Dimensions.get("window").height}`);

    var paleta = ['#ffdfba','#baffc9','#ffb3ba','#ffffba','#bae1ff', '#d291bc', '#e0bbe4', '#fec8d8', '#ffffff', '#ffffff'];
    orderedAssig.forEach( (assig, index) => {
      cards.push(
        
        <View key={assig.id} style={{ backgroundColor:'#fff', margin:20, marginBottom:0, 
        borderColor:'#f2f2f2', borderWidth:0.5, borderRadius:5, elevation:3, overflow:"hidden" }}>
          <TouchableOpacity  onPress={() => {
            this.fetchData();
            this.setState({ [assig.id]:true });
            }}>

            <View style={{flex:1}}>
              <View style={{ flex:1, padding:10, borderBottomWidth:1, borderBottomColor:'gray' }}>
                <Text style={{ fontWeight:'bold', color:'#606060' }}>{assig.nom + '  '}</Text>
              </View>
              <View style={{ flex:1, padding:10, backgroundColor: paleta[index] }}>
                <Text>{`${assig.sigles} - ${this.props.lang.grup}: ${assig.grup} - ${this.props.lang.credits}: ${assig.credits} - ${this.props.lang.semestre}: ${(_.isEmpty(assig.semestre)) ? "? " : assig.semestre}`}</Text>
              </View>
            </View>

            <Modal 
              isVisible={!_.isUndefined(this.state[assig.id]) && this.state[assig.id] == true }
              onBackdropPress={() => this.setState({ [assig.id]:false })}
              onBackButtonPress={() => this.setState({ [assig.id]:false})}
              deviceWidth={deviceWidth}
              deviceHeight={deviceHeight}
              //animationIn={'fadeIn'}
              style={{margin:0, flex:1, overflow:'visible', padding:0}}
              //useNativeDriver={true}
              //hideModalContentWhileAnimating={true}
            >
              <View style={{ flex: 1, backgroundColor:'#fafafa', margin:20, marginTop:70, marginBottom:100, borderRadius:10, overflow:'hidden' }}>
                <View style={{ backgroundColor:'#f0f0f0', padding:15, alignItems: 'center' }}>
                  <Text style={{ fontWeight:'900', fontSize: Math.max(this.props.AVISOSsize+1, 17), color:'#606060' }}>{'  ' + assig.nom + '  '}</Text>
                </View>
                <ScrollView>

                  <View style={{ backgroundColor:'#fafafa', padding:15 }}>
                    <Text style={{ fontWeight:'bold', fontSize:this.props.AVISOSsize, color:'#202020', marginBottom:6 }}>{`${this.props.lang.professors}   `}</Text>
                    {(_.isUndefined(this.state[`${assig.id}guia`])) ? <Text style={{ color:'#404040', fontSize:this.props.AVISOSsize }}>{`${this.props.lang.loadingProfessors}   `}</Text> : this.renderProfs(this.state[`${assig.id}guia`].professors)}
                  </View>

                  <View style={{ backgroundColor:'#fafafa', padding:15}}>
                    <Text style={{ fontWeight:'bold', fontSize:this.props.AVISOSsize, color:'#202020', marginBottom:6 }}>{`${this.props.lang.avaluacio}   `}</Text>
                    <Text style={{ color:'#404040', fontSize:this.props.AVISOSsize }}>{(!_.isUndefined(this.state[`${assig.id}guia`])) ? this.state[`${assig.id}guia`]['metodologia_avaluacio'] : `${this.props.lang.loadingAvaluacio}   `}</Text>
                  </View>

                  <View style={{ backgroundColor:'#fafafa', padding:15}}>
                    <Text style={{ fontWeight:'bold', fontSize:this.props.AVISOSsize, color:'#202020', marginBottom:6 }}>{`${this.props.lang.metodologia}   `}</Text>
                    <Text style={{ color:'#404040', fontSize:this.props.AVISOSsize }}>{(!_.isUndefined(this.state[`${assig.id}guia`])) ? this.state[`${assig.id}guia`]['metodologia_docent'] : `${this.props.lang.loadingMetodologia}   `}</Text>
                  </View>

                </ScrollView>
              </View>
            </Modal>

          </TouchableOpacity>
        </View>
        
      );
    });

    return cards;
  }

  async fetchData() {

    try {
      if (typeof(this.props.assig.results) === 'undefined') {} // This will raise an error when not yet defined
    } catch (error) {
      setTimeout(() => this.fetchData(), 2*1000);
      return;
    }

    if (this.state.needToFetch) {

    await this.updateToken.bind(this)().then( async (new_token) => {
      await this.props.assig.results.forEach( async (assig) => {
        await axios(assig.guia, {
          headers: {'Authorization': `Bearer ${new_token}`, 'Accept-Language':this.props.langCode}
        }).then(({data}) => { 
          this.setState({needToFetch:false});
          this.setState({ [`${assig.id}guia`]:data });
          }).catch((err) => {/*console.log(err.response.status)*/});
        });
      });
    }
  }

  render() {
    if (!_.isUndefined(this.props.assig.count) && Number(this.props.assig.count) < 1) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#fafafa' }} >
          <Text>{`   ${this.props.lang.msgEmpty}    `}</Text>
        </View>
      );
    }
    return (
      <ScrollView style={{ flex: 1, backgroundColor:'#fafafa' }}>
        {this.createCards()}
        <Text></Text>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return { 
    assig: state.assig,
    token: state.token,
    AVISOSsize: state.settings.AVISOSsize,
    lang: state.lang.assig,
    langCode: state.lang.code,
  };
}

export default connect(mapStateToProps, { getToken })(Assignatures);
