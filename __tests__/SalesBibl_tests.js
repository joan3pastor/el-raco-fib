import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import axios from 'axios'

import SalesBibl from "../src/components/navigation/SalesBibl";
import {salesBiblioteca} from "../src/external_links";

Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {};

beforeEach( () => {})

describe('Testing SalesBibl component', () => {
  it('renders as expected', () => {
    const wrapper = shallow(
      <SalesBibl store={mockStore(initialState)} token={undefined} />
    );
    expect(wrapper.dive().dive()).toMatchSnapshot();
  });
  it("sales bibl. link works", async () => {
    resp = await axios.get(salesBiblioteca);
    expect(resp.status == 200).toBe(true);
  });
});

