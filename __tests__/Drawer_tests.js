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
const lang = ca.drawer;

import {Drawer} from "../src/components/navigation/Drawer";
import {jo} from "../__mocks__/fib-api/jo";
import {navigation} from "../__stubs__/navigation_stub";

Enzyme.configure({ adapter: new Adapter() });

beforeEach( () => {})

const wrapper = shallow(
  <Drawer token={{token:undefined}} lang={lang} />
);
const instance = wrapper.instance();

describe('Testing Drawer component', () => {
  it('renders as expected when token not yet provided', () => {
    expect(wrapper).toMatchSnapshot();
  });
  
  it('calls getUserData() once when token provided', () => {
    const spy_getUserData = sinon.spy(instance, "getUserData");
    wrapper.setProps({token:{token:"aToken"}, lang:lang});
    expect(spy_getUserData.calledOnce).toBe(true);
  });

  it('renders as expected when token provided', () => {
    expect(wrapper).toMatchSnapshot();
  });  

  it('renders user info correctly after fetching user data', () => {
    instance.fetching = false;
    wrapper.setState({jo: jo});
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('navigates correctly to EventsDrawer', () => {
    const navigation_spy = sinon.spy(navigation, "navigate");
    wrapper.setProps({navigation: navigation, lang:lang});
    navigation.navigate("EventsDrawer"); //todo
    expect(navigation_spy.returnValues[navigation_spy.returnValues.length-1]).toBe("EventsDrawer");
  });
  
});
