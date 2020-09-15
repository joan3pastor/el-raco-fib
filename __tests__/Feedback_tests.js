import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import axios from 'axios'

// LANG
import {ca} from "../src/languages/ca";
const lang = ca.feedback;

import {Feedback} from "../src/components/navigation/Feedback";
import {playstorelink, githubURL} from "../src/external_links";

Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {};

beforeEach( () => {})

describe('Testing Feedback component', () => {
  it('renders as expected', () => {
    const wrapper = shallow(
      <Feedback store={mockStore(initialState)} lang={lang} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it("playstorelink url returns 200[OK] code", async () => {
    resp = await axios.get(playstorelink);
    expect(resp.status == 200).toBe(true);
  });
  it("github url returns 200[OK] code", async () => {
    resp = await axios.get(githubURL);
    expect(resp.status == 200).toBe(true);
  });
});

