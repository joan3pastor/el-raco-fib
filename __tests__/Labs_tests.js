import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AxiosMockAdapter from 'axios-mock-adapter';
import _ from 'lodash';

// LANG
import {ca} from "../src/languages/ca";
const lang = ca.labs;

import {Labs} from "../src/components/navigation/Labs";
import {labImages} from "../__mocks__/fib-api/labs";
import {token} from "../__mocks__/fib-api/tokens";

Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {};

beforeEach( () => {})

const wrapper = shallow(
  <Labs token={{token:undefined}} imglabs={labImages} testsnapshot={true} store={mockStore(initialState)} lang={lang} />
);

const instance = wrapper.instance();

describe('Testing Labs component', () => {
  it('renders as expected when token not yet provided', () => {
    wrapper.setProps({lang:lang});
    expect(wrapper).toMatchSnapshot();
  });

  it('renders as expected when token provided', () => {
    wrapper.setProps({token: token, lang:lang});
    expect(wrapper).toMatchSnapshot();
  });
});
