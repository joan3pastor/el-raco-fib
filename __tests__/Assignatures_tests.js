import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import axios from 'axios';
import sinon from 'sinon';
import AxiosMockAdapter from 'axios-mock-adapter';

// LANG
import {ca} from "../src/languages/ca";
const lang = ca.assig;

// Components
import {Assignatures} from "../src/components/navigation/Assignatures";

// Mocks
import {assignatures_1, assignatures_5, assignatures_buit, assig_guia} from "../__mocks__/fib-api/assignatures";
import {default_settings, minimalist_settings, small_fontsize_settings, paleta} from "../__mocks__/app-settings";

// Stubs
import updateToken from "../__stubs__/update_token";

// URLs
import {assig_guies_urls} from "../__mocks__/fib-api/assignatures";


Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {};

beforeEach( () => {})

describe('Testing renderProfs method from Assignatures component', () => {

  const wrapper = shallow(
    <Assignatures store={mockStore(initialState)} assig={assignatures_buit} lang={lang} />
  , {"disableLifecycleMethods": false});

  // Method to test
  renderProfs = wrapper.instance().renderProfs;

  it("returns a render list of professors sorted and classified by 'is_responsable'", () => {

    context = {
      props:{
        assig: assignatures_buit, 
        AVISOSsize: default_settings.AVISOSsize,
        lang: lang,
      }, 
      state:{},
      setState: (obj) => obj,
    }

    expect(renderProfs.bind(context)(assig_guia.professors))
    .toMatchSnapshot();
  });

  it("returns a render list of professors with the size defined in settings", () => {

    context = {
      props:{
        assig: assignatures_buit, 
        AVISOSsize: small_fontsize_settings.AVISOSsize,
        lang:lang,
      }, 
      state:{},
      setState: (obj) => obj,
    }

    expect(renderProfs.bind(context)(assig_guia.professors))
    .toMatchSnapshot();
  });

});

describe('Testing createCards method from Assignatures component', () => {

  const wrapper = shallow(
    <Assignatures store={mockStore(initialState)} assig={assignatures_buit} lang={lang} />
  , {"disableLifecycleMethods": false});

  // Method to test
  createCards = wrapper.instance().createCards;

  it("returns a rendered list of cards (size=1) with its modal view with '/guia' still not fetched'", () => {

    context = {
      props:{
        assig: assignatures_1, 
        AVISOSsize: default_settings.AVISOSsize,
        lang: lang,
      }, 
      state:{},
      setState: (obj) => obj,
    }

    expect(createCards.bind(context)())
    .toMatchSnapshot();
  });

  it("returns a rendered list of cards (size=5) with its modal view with '/guia' still not fetched'", () => {

    context = {
      props:{
        assig: assignatures_5, 
        AVISOSsize: default_settings.AVISOSsize,
        lang:lang,
      }, 
      state:{},
      setState: (obj) => obj,
    }

    expect(createCards.bind(context)())
    .toMatchSnapshot();
  });

  it("returns a rendered list of cards (size=1) with its modal view with '/guia' fetched'", () => {

    renderProfs = wrapper.instance().renderProfs;

    context = {
      renderProfs,
      props:{
        assig: assignatures_1, 
        AVISOSsize: default_settings.AVISOSsize,
        lang: lang,
      }, 
      state:{
        ROBguia: assig_guia,
      },
      setState: (obj) => obj,
    }

    expect(createCards.bind(context)())
    .toMatchSnapshot();
  });

});

describe('Testing fetchData method from Assignatures component', () => {

  const wrapper = shallow(
    <Assignatures store={mockStore(initialState)} assig={assignatures_buit} lang={lang} />
  , {"disableLifecycleMethods": false});

  // Method to test
  fetchData = wrapper.instance().fetchData;

  // Set axios adapter
  axiosAdapter = new AxiosMockAdapter(axios)

  it("does nothing when called more than one time", async () => {

    context = {
      updateToken,
      props:{
        assig: assignatures_1, 
        lang: lang,
      }, 
      state:{
        needToFetch: false,
      },
      setState: (obj) => obj,
    }

    const setState_spy = sinon.spy(context, "setState");

    await fetchData.bind(context)();

    expect(setState_spy.called).toBe(false);
    
  });

  it("fetches the '/guia' of each taken subject' for first time and does nothing if request fails", async () => {

    // Set axios mocks
    axiosAdapter = new AxiosMockAdapter(axios)
    axiosAdapter.onGet(assig_guies_urls[1]).reply(404, "Bad request...");

    context = {
      updateToken,
      props:{
        assig: assignatures_1, 
      }, 
      state:{
        needToFetch: true,
      },
      setState: (obj) => obj,
    }

    const setState_spy = sinon.spy(context, "setState");

    await fetchData.bind(context)();

    expect(setState_spy.called).toBe(false);
    
  });

  it("fetches the '/guia' of each taken subject' for first time and updates component state", async () => {

    // Set axios mocks
    axiosAdapter = new AxiosMockAdapter(axios)
    axiosAdapter.onGet(assig_guies_urls[1]).reply(200, assig_guia);

    context = {
      updateToken,
      props:{
        assig: assignatures_1, 
      }, 
      state:{
        needToFetch: true,
      },
      setState: (obj) => obj,
    }

    const setState_spy = sinon.spy(context, "setState");

    await fetchData.bind(context)();

    expect(setState_spy.returnValues).toMatchSnapshot();
    
  });

});

describe('Testing Assignatures component', () => {
  
  it("renders info message when you aren't enrolled in any subject", () => {
    
    const wrapper = shallow(
      <Assignatures store={mockStore(initialState)} assig={assignatures_buit} lang={lang} />
    , {"disableLifecycleMethods": false});
    
    expect(wrapper).toMatchSnapshot();
  });

  it("renders list with one subject and modal view of the subject closed", () => {
    
    const wrapper = shallow(
      <Assignatures store={mockStore(initialState)} assig={assignatures_1} lang={lang}/>
    , {"disableLifecycleMethods": false});
    
    expect(wrapper).toMatchSnapshot();
  });

  it("renders list with one subject and modal view of the subject opened", () => {
    
    const wrapper = shallow(
      <Assignatures store={mockStore(initialState)} assig={assignatures_1} lang={lang} />
    , {"disableLifecycleMethods": false});

    wrapper.setState({'ROB':true});
    
    expect(wrapper).toMatchSnapshot();
  });

});