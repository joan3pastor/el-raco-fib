import React, { Component } from 'react';
import { Text, ScrollView, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconE from 'react-native-vector-icons/Entypo';

import { fotoURL, joURL } from '../../external_links';

export class Drawer extends Component {

  constructor(props) {
    super(props);
    this.state = { jo:{} };
  }

  fetching = false;

  me() {
    return (
      <ImageBackground source={require('../../../static/fondo2.png')} style={{height:150, marginBottom:20}}>

        <View style={{margin:12, marginBottom:9, marginTop:18, height:80, width:80, borderRadius:40, overflow:'hidden', elevation:8}}>
        {!_.isUndefined(this.props.token.token) ? <Image 
            source={{uri: fotoURL, headers: {
              'Authorization': `Bearer ${this.props.token.token}`, 
              'Accept-Language': 'ca'
            }}}
            style={{height:80, width:80, borderRadius:40, resizeMode:'cover'}}
            /> : <View />}
        </View>

        {!_.isUndefined(this.state.jo.nom) ? <View style={{marginLeft:15, flexDirection:'column'}}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={{color:'#505050', fontWeight:'400'}}>{`${this.state.jo.nom} ${this.state.jo.cognoms}       `}</Text>
          <Text>{`${this.state.jo.email}       `}</Text>
        </View> : <View />}

      </ImageBackground>
    );
  }

  async getUserData() {
    if (_.isUndefined(this.state.jo.nom) && this.fetching == false) {
      this.fetching = true;
      axios(joURL, {
        headers: {'Authorization': `Bearer ${this.props.token.token}`, 'Accept-Language':'ca'}
      }).then((resp) => {
        this.fetching = false; 
        this.setState({ jo:resp.data });
      });
    }
  }

  render() {
    this.getUserData();
    return (
      <View style={{flex:1}}>
      <View>
        {this.me()}
        <ScrollView >
          <View style={{marginLeft:15}}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('EventsDrawer')}>
              <View style={{alignItems:'center', height:40, flexDirection:'row'}}>
                <IconFA name='calendar' size={26} color='#505050' />
                <Text style={{marginLeft:10, color:'#606060'}}>{` ${this.props.lang.events}      `}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('NotesDrawer')}>
              <View style={{alignItems:'center', height:40, flexDirection:'row'}}>
                <IconFA name='mortar-board' size={26} color='#505050' />
                <Text style={{marginLeft:10, color:'#606060'}}>{`${this.props.lang.notes}     `}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('LabsDrawer')}>
              <View style={{alignItems:'center', height:40, flexDirection:'row'}}>
                <IconFA name='desktop' size={26} color='#505050' />
                <Text style={{marginLeft:10, color:'#606060'}}>{`${this.props.lang.labs}     `}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SalesBiblDrawer')}>
              <View style={{alignItems:'center', height:40, flexDirection:'row'}}>
                <IconFA name='book' size={26} color='#505050' />
                <Text style={{marginLeft:10, color:'#606060'}}>{` ${this.props.lang.bibl}     `}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('AulesDrawer')}>
              <View style={{alignItems:'center', height:40, flexDirection:'row'}}>
                <IconFA name='calendar-o' size={26} color='#505050' />
                <Text style={{marginLeft:10, color:'#606060'}}>{` ${this.props.lang.aules}     `}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('PlacesDrawer')}>
              <View style={{alignItems:'center', height:40, flexDirection:'row'}}>
                <IconFA name='eye' size={26} color='#505050' />
                <Text style={{marginLeft:10, color:'#606060'}}>{` ${this.props.lang.places}     `}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('MobilitatDrawer')}>
              <View style={{alignItems:'center', height:40, flexDirection:'row'}}>
                <IconFA name='plane' size={26} color='#505050' />
                <Text style={{marginLeft:10, color:'#606060'}}>{` ${this.props.lang.mobilitat}     `}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('LecturesDrawer')}>
              <View style={{alignItems:'center', height:40, flexDirection:'row'}}>
                <IconE name='blackboard' size={26} color='#505050' />
                <Text style={{marginLeft:10, color:'#606060'}}>{` ${this.props.lang.lectures}     `}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ExternalLinksDrawer')}> 
              <View style={{alignItems:'center', height:40, flexDirection:'row'}}>
                <IconFA name='external-link' size={25} color='#505050' />
                <Text style={{marginLeft:10, color:'#606060'}}>{`${this.props.lang.links}     `}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('FeedbackDrawer')}>
              <View style={{alignItems:'center', height:40, flexDirection:'row'}}>
                <IconE name='bug' size={26} color='#505050' />
                <Text style={{marginLeft:10, color:'#606060'}}>{`${this.props.lang.feedback}     `}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SettingsDrawer')}> 
              <View style={{alignItems:'center', height:40, flexDirection:'row'}}>
                <IconFA name='gear' size={26} color='#505050' />
                <Text style={{marginLeft:10, color:'#606060'}}>{`${this.props.lang.settings}     `}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('LogOut')}>
              <View style={{alignItems:'center', height:40, flexDirection:'row'}}>
                <IconE name='log-out' size={26} color='#505050' />
                <Text style={{marginLeft:10, color:'#606060'}}>{`${this.props.lang.logout}     `}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </View>
        <View style={{flex:1}}>
          <Text style={{position:'absolute', bottom:10, right:20}}>{"v1.5. "}</Text>
        </View>
      </View>
    );
  }
}
  
function mapStateToProps(state) {
  return { 
    token: state.token,
    lang: state.lang.drawer,
  };
}
  
export default connect(mapStateToProps, {  })(Drawer);


// Nota: preguntar si .../places/ sirve para el proposito de la pestaña matricula ya que la fecha de actualiz. es muy antigua...

//Falta:
// - Prematricula
