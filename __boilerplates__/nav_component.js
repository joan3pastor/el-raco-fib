// To create a new app view, this file should be created at the following path: "src/components/navigation"
// and "src/components/Navigation.js" be updated to incorporate the component as wanted.

import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { } from '../../external_links'; // Import any external link needed 
import { getToken } from '../../actions'; // Import any redux action needed
import updateToken from '../../actions/updateToken'; // Call "updateToken.call(this)" to renew token before requesting from FIB's API
import { update } from 'lodash';
import Axios from 'axios';

export class COMP_NAME extends Component {

  constructor(props) {
    super(props);
    this.state = {
        // Initial component state values
    };
  }

  componentDidMount() { } // Executed once after mounting component

  componentWillUnmount() { } // Executed once before unmounting component

  shouldComponentUpdate(nextProps, nextState) { } // If method returns false, component will not update 

  componentDidCatch(error, info) { } // This lifecycle is invoked after an error has been thrown by a descendant component

  render() { // Method called every time the component updates
    // The component updates when this.state or this.props values change.

    // ...

    return (
      <View>
        
      </View>
    );
  }
}

function mapStateToProps(state) { 
  // Declare what redux store keys do you want to connect to your component.
  // To use a value inside the component: "this.props.reduxStoreKey1"
  return {
    token: state.token,
    reduxStoreKey1: state.reduxStoreKey1,
    reduxStoreKey2: state.reduxStoreKey2,

    // ...

  };
}

export default connect(mapStateToProps, { getToken, /* Here other redux actions required */ })(COMP_NAME);


