import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { connect } from 'react-redux';

import {  } from '../../actions';
import {linkDEFIB, linkAssociacions, linkEduroam, linkCorreu, linkImpressio, linkUPClink, linkAcordsUPC, linkVMware, linkGithub, linkAzure, linkOffice, linkGCP} from "../../external_links";

const styleLinks = {color:'#0645AD', fontWeight:'bold', paddingTop:10, paddingBottom:5, paddingRight:10};

export class ExternalLinks extends Component {

  render() {

    return (
      <ScrollView style={{flex:1, backgroundColor:'#fff', overflow:'hidden'}}>
            <View style={{padding:15, backgroundColor:'#f2f2f2', elevation:1.5}}>
            <Text style={{color:'#202020', fontSize:20, fontWeight:'400'}}>{`${this.props.lang.title1}   `}</Text>
            </View>
            <View style={{marginLeft:20, backgroundColor: '#fff'}}>

                <TouchableOpacity onPress={() => Linking.openURL(linkDEFIB)}>
                    <Text style={{color:'#0645AD', fontWeight:'bold', paddingTop:10, paddingBottom:0}}>{`${this.props.lang.A1E1}   `}</Text>
                </TouchableOpacity>
                <Text>{`${this.props.lang.A1E1Comentari}   `}</Text>

                <TouchableOpacity onPress={() => Linking.openURL(linkAssociacions)}>
                    <Text style={styleLinks}>{`${this.props.lang.A1E2}   `}</Text>
                </TouchableOpacity>

            </View>
            <View style={{padding:15, backgroundColor:'#f2f2f2', marginTop:25, elevation:1.5}}>
                <Text style={{color:'#202020', fontSize:20, fontWeight:'400'}}>{`${this.props.lang.title2}   `}</Text>
            </View>
            <View style={{marginLeft:20, backgroundColor: '#fff'}}>

                <TouchableOpacity onPress={() => Linking.openURL(linkEduroam)}>
                    <Text style={styleLinks}>{`${this.props.lang.A2E1}   `}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(linkCorreu)}>
                    <Text style={styleLinks}>{`${this.props.lang.A2E2}   `}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(linkImpressio)}>
                    <Text style={styleLinks}>{`${this.props.lang.A2E3}   `}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(linkUPClink)}>
                    <Text style={styleLinks}>{`${this.props.lang.A2E4}   `}</Text>
                </TouchableOpacity>

            </View>
            <View style={{padding:15, backgroundColor:'#f2f2f2', marginTop:25, elevation:1.5}}>
                <Text style={{color:'#202020', fontSize:20, fontWeight:'400'}}>{`${this.props.lang.title3}   `}</Text>
            </View>
            <View style={{marginLeft:20, backgroundColor: '#fff'}}>

                <TouchableOpacity onPress={() => Linking.openURL(linkAcordsUPC)}>
                    <Text style={styleLinks}>{`${this.props.lang.A3E1}   `}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(linkVMware)}>
                    <Text style={styleLinks}>{`${this.props.lang.A3E2}   `}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(linkGithub)}>
                    <Text style={styleLinks}>{`${this.props.lang.A3E3}   `}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(linkAzure)}>
                    <Text style={styleLinks}>{`${this.props.lang.A3E4}   `}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(linkOffice)}>
                    <Text style={styleLinks}>{`${this.props.lang.A3E5}   `}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(linkGCP)}>
                    <Text style={styleLinks}>{`${this.props.lang.A3E6}   `}</Text>
                </TouchableOpacity>

            </View>
            <Text style={{padding:12, marginTop:20}}>{`${this.props.lang.msgManteniment}   `}</Text>
      </ScrollView>
    );

  }

}

function mapStateToProps(state) {
  return {
      lang: state.lang.links,
  };
}

export default connect(mapStateToProps, {  })(ExternalLinks);
