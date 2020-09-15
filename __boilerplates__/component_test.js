import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import React from 'react';
import axios from 'axios';

import sinon from 'sinon'; // Use this to add spies to methods
import AxiosMockAdapter from 'axios-mock-adapter'; // Use this if you need to mock REST requests

// COMPONENT TO TEST
//  Import component to test and other dependencies
import { Comp } from "../src/components/navigation/Comp";

// MOCKS
//  Static objects to feed our tests with
import {  objEmpty, obj1, obj2, /* objN */} from "../__mocks__/ [...] ";

// STUBS
// Controllable replacements for existing dependencies
import Obj from "../__stubs__/ [...] ";

// LANG
import { ca } from "../src/languages/ca";
const lang = ca.comonent_name; // Extract language package of your component
const langCode = "ca";

// Enzyme configuration
Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {}; // If a store is needed replace it here

beforeEach( () => { /* ... */ }) // Executed before each test 

// Create a test block for a feature of the component
describe(' [Describe what will be tested] ', () => {

  // Create component wrapper
  const wrapper = shallow(
    <Comp store={mockStore(initialState)} lang={lang} prop1={obj1} /> // Add props if your component requires them
  , {"disableLifecycleMethods": true}); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  method1 = wrapper.instance().method1;

  it(" [Describe what it has to do] ", () => {

    // Context provided to method
    context = {
      props:{
        // ...
      }, 
      state:{
        // ...
      },
      setState: (obj) => { /* ... */ },
    };

    // Assert test case
    expect( method1.bind(context)(atr1, atr2 /* atributes provided to method*/) )
    .toMatchSnapshot(); 
  });

});


// expect() common METHODS for matching:
//  - toMatchSnapshot() Will create a snapshot of the object the first time executed. Following executions will compare equalty with saved snapshot.
//  - toMatchInlineSnapshot(` [...] `) Is the same as toMatchSnapshot() but it will create the snapshot inline.
//  - toBe( value ) Will compare for equalty.
//  - toEqual( obj ) Recursively checks every field of an object or array for equalty.
//  - toMatch( /regexp expression/ ) Checks for matching regexp expression on String values.
//  - ToThrow( Err ) Expects to throw error.

// You can also make snapshots of full wrappers using: expect(wrapper).toMatchSnapshot()
// Usefull for View Integration Tests.  