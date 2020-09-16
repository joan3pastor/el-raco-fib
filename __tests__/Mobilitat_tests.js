import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureStore from "redux-mock-store";
import React from "react";
import axios from "axios";

import sinon from "sinon"; // Use this to add spies to methods
import AxiosMockAdapter from "axios-mock-adapter"; // Use this if you need to mock REST requests

// COMPONENT TO TEST
import { Mobilitat } from "../src/components/navigation/Mobilitat";

// MOCKS
import { mobilitat_empty, mobilitat, paisos, programes } from "../__mocks__/fib-api/mobilitat";

// STUBS
import updateToken from "../__stubs__/update_token";

import { mobilitatURL } from "../src/external_links";

// LANG
import { es } from "../src/languages/es";
const lang = es.mobilitat;
const langCode = "es";

// Enzyme configuration
Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {}; // If a store is needed replace it here

beforeEach(() => {});

describe("Testing getData method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Mobilitat store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  getData = wrapper.instance().getData;

  it("It fetches mobility offers correctly.", async () => {
    // AXIOS ADAPTER
    const axiosAdapter = new AxiosMockAdapter(axios);
    axiosAdapter.onGet(mobilitatURL).reply(200, mobilitat);

    const setStateStubSpy = jest.fn(obj => obj);

    // Context provided to method
    context = {
      updateToken: updateToken,
      props: {
        langCode: langCode
      },
      state: {},
      setState: setStateStubSpy
    };

    // Execute method
    await getData.bind(context)();

    // Assert test case
    expect(setStateStubSpy.mock.calls[0][0]).toMatchSnapshot();
  });
});

describe("Testing getPaisos method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Mobilitat store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  getPaisos = wrapper.instance().getPaisos;

  it("returns sorted list of countries found in mobility offers.", () => {
    const setStateStubSpy = jest.fn(obj => obj);

    // Context provided to method
    context = {
      props: {},
      state: {
        ofertes: mobilitat.results
      },
      setState: setStateStubSpy
    };

    // Execute method
    getPaisos.bind(context)();

    // Assert test case
    expect(setStateStubSpy.mock.calls[0][0]).toMatchSnapshot();
  });
});

describe("Testing getProgrames method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Mobilitat store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  getProgrames = wrapper.instance().getProgrames;

  it("returns sorted list of programs found in mobility offers.", () => {
    const setStateStubSpy = jest.fn(obj => obj);

    // Context provided to method
    context = {
      props: {},
      state: {
        ofertes: mobilitat.results
      },
      setState: setStateStubSpy
    };

    // Execute method
    getProgrames.bind(context)();

    // Assert test case
    expect(setStateStubSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "programes": Array [
          "DOUBLE DEGREE",
          "ERASMUS+",
          "SICUE",
          "SMILE",
          "UPC-AL",
          "UPC-CANADA",
          "UPC-MON",
          "UPC-USA",
        ],
      }
    `);
  });
});

describe("Testing filterOfertes method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Mobilitat store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  filterOfertes = wrapper.instance().filterOfertes;

  it("returns a list of offers that match country='Francia' and program='ERASMUS+'.", () => {
    const setStateStubSpy = jest.fn(obj => obj);

    // Context provided to method
    context = {
      props: {
        lang: lang,
      },
      state: {
        paisos: paisos, 
        programes: programes,
        ofertes: mobilitat.results,
        filterPais: "Francia", 
        filterPrograma: "ERASMUS+", 
      },
      setState: setStateStubSpy
    };

    // Execute method
    filterOfertes.bind(context)();

    // Assert test case
    expect(setStateStubSpy.mock.calls[0][0]).toMatchSnapshot();
  });

  it("returns a list of ALL offers when matched with country='Todos' and program='Todos'.", () => {
    const setStateStubSpy = jest.fn(obj => obj);

    // Context provided to method
    context = {
      props: {
        lang: lang,
      },
      state: {
        paisos: paisos, 
        programes: programes,
        ofertes: mobilitat.results,
        filterPais: "Todos", 
        filterPrograma: "Todos", 
      },
      setState: setStateStubSpy
    };

    // Execute method
    filterOfertes.bind(context)();

    // Assert test case
    expect(setStateStubSpy.mock.calls[0][0]).toMatchSnapshot();
  });
});

describe("Testing Mobilitat component", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Mobilitat store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  it("It renders correctly.", () => {

    wrapper.instance().updateToken = updateToken;

    // AXIOS ADAPTER
    const axiosAdapter = new AxiosMockAdapter(axios);
    axiosAdapter.onGet(mobilitatURL).reply(200, mobilitat);

    // Assert test case
    expect(wrapper).toMatchSnapshot();
  });
});
