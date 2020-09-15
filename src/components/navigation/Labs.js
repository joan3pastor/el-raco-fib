import React, { Component } from 'react';
import { Text, View, Image, Dimensions, ScrollView, Button } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getToken } from '../../actions';
import updateToken from '../../actions/updateToken';

export class Labs extends Component {

  constructor(props) {
    super(props);
    this.state = {update:false};
  }

  componentDidMount() {
    this.refresh();
  }

  async refresh() {
    updateToken.bind(this)().then(() => this.setState({update: JSON.stringify(Date.now())}));
  }

  renderLabs() {
    var windowWidth = Dimensions.get('window').width;
    var labs = [];
    var reload_date = JSON.stringify(Date.now())
    if (!_.isUndefined(this.props.testsnapshot)) reload_date = "1";
    _.forOwn(this.props.imglabs.imatges, (lab, key) => {
      labs.push(
        <View key={key} style={{backgroundColor:'#fafafa'}}>
          <Text style={{alignSelf:'center', fontSize:17, padding:5, marginTop:15, fontWeight:'bold', color:'#424848'}}>{key}</Text>
          <Image 
            source={{uri: `${lab}?reload=${reload_date}`, headers: {
              'Authorization': `Bearer ${this.props.token.token}`, 
              'Accept-Language': 'ca'
            }}}
            style={{width:windowWidth, height:250, resizeMode:'stretch'}}
          />
        </View>
      );
    });
    return labs;
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor:'#fafafa' }}>
        <Button
          onPress={() => this.refresh()}
          title={this.props.lang.bttnActualitzar}
          color="#1E90FF"
        />
        {this.renderLabs()}
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return { 
    imglabs: state.imglabs,
    token: state.token,
    lang: state.lang.labs,
  };
}

export default connect(mapStateToProps, { getToken })(Labs);
