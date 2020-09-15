import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import axios from 'axios'

// LANG
import {ca} from "../src/languages/ca";
const lang = ca.links;

import {ExternalLinks} from "../src/components/navigation/ExternalLinks";
import {linkDEFIB, linkAssociacions, linkEduroam, linkCorreu, linkImpressio, linkUPClink, linkAcordsUPC, linkVMware, linkGithub, linkAzure, linkOffice, linkGCP} from "../src/external_links";

Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {};

beforeEach( () => {})

describe('Testing ExternalLinks component', () => {
  it('renders as expected', () => {
    const wrapper = shallow(
      <ExternalLinks store={mockStore(initialState)} lang={lang} />
    );
    expect(wrapper.dive().dive()).toMatchSnapshot();
  });
  // it("linkDEFIB url returns 200[OK] code", async () => {
  //   resp = await axios.get(linkDEFIB);
  //   expect(resp.status == 200).toBe(true);
  // });
  it("linkAssociacions url returns 200[OK] code", async () => {
    resp = await axios.get(linkAssociacions);
    expect(resp.status == 200).toBe(true);
  });
  it("linkEduroam url returns 200[OK] code", async () => {
    resp = await axios.get(linkEduroam);
    expect(resp.status == 200).toBe(true);
  });
  it("linkCorreu url returns 200[OK] code", async () => {
    resp = await axios.get(linkCorreu);
    expect(resp.status == 200).toBe(true);
  });
  it("linkImpressio url returns 200[OK] code", async () => {
    resp = await axios.get(linkImpressio);
    expect(resp.status == 200).toBe(true);
  });
  it("linkUPClink url returns 200[OK] code", async () => {
    resp = await axios.get(linkUPClink);
    expect(resp.status == 200).toBe(true);
  });
  it("linkAcordsUPC url returns 200[OK] code", async () => {
    resp = await axios.get(linkAcordsUPC);
    expect(resp.status == 200).toBe(true);
  });
  it("linkVMware url returns 200[OK] code", async () => {
    resp = await axios.get(linkVMware);
    expect(resp.status == 200).toBe(true);
  });
  it("linkGithub url returns 200[OK] code", async () => {
    resp = await axios.get(linkGithub);
    expect(resp.status == 200).toBe(true);
  });
  it("linkAzure url returns 200[OK] code", async () => {
    resp = await axios.get(linkAzure);
    expect(resp.status == 200).toBe(true);
  });
  it("linkOffice url returns 200[OK] code", async () => {
    resp = await axios.get(linkOffice);
    expect(resp.status == 200).toBe(true);
  });
  it("linkGCP url returns 200[OK] code", async () => {
    resp = await axios.get(linkGCP);
    expect(resp.status == 200).toBe(true);
  });
});

