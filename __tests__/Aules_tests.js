import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureStore from "redux-mock-store";
import React from "react";
import axios from "axios";

import sinon from "sinon"; // Use this to add spies to methods
import AxiosMockAdapter from "axios-mock-adapter"; // Use this if you need to mock REST requests

// COMPONENT TO TEST
import {
  Aules,
  aulesTipusLab,
  aulesEspecials
} from "../src/components/navigation/Aules";
import { aulesURL, QActualURL } from "../src/external_links";

// MOCKS
import { quadri_actual, aules } from "../__mocks__/fib-api/aules";
import { classes, classesURL } from "../__mocks__/fib-api/classes";

// STUBS
import updateToken from "../__stubs__/update_token";

// LANG
import { ca } from "../src/languages/ca";
const lang = ca.aules;
const langCode = "ca";

// Enzyme configuration
Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {}; // If a store is needed replace it here

beforeEach(() => {}); // Executed before each test

describe("Testing getData method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Aules store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  getData = wrapper.instance().getData;

  it("Fetches 'aules' and 'classes' correctly.", async () => {
    // AXIOS ADAPTER
    const axiosAdapter = new AxiosMockAdapter(axios);
    axiosAdapter.onGet(aulesURL).reply(200, aules);
    axiosAdapter.onGet(QActualURL).reply(200, quadri_actual);
    axiosAdapter.onGet(classesURL).reply(200, classes);

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

    // Execute
    await getData.bind(context)();

    // Assert test cases
    expect(setStateStubSpy.mock.calls[0][0]).toMatchSnapshot(); // aules
    expect(setStateStubSpy.mock.calls[1][0]).toMatchSnapshot(); // classes
  });
});

describe("Testing parseAules method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Aules store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  parseAules = wrapper.instance().parseAules;

  it("Parses correctly 'aules'.", () => {
    const setStateStubSpy = jest.fn(obj => obj);

    // Context provided to method
    context = {
      aulesEspecials,
      aulesTipusLab,
      props: {},
      state: {
        classes: classes.results,
        aules: aules.results
      },
      setState: setStateStubSpy
    };

    // Execute
    parseAules.bind(context)();

    // Assert test cases
    expect(setStateStubSpy.mock.calls[0][0]).toMatchSnapshot(); // parsed aules
  });
});

describe("Testing parseAules method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Aules store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  parseAules = wrapper.instance().parseAules;

  it("Parses correctly 'aules'.", () => {
    const setStateStubSpy = jest.fn(obj => obj);

    // Context provided to method
    context = {
      aulesEspecials,
      aulesTipusLab,
      props: {},
      state: {
        classes: classes.results,
        aules: aules.results
      },
      setState: setStateStubSpy
    };

    // Execute
    parseAules.bind(context)();

    // Assert test cases
    expect(setStateStubSpy.mock.calls[0][0]).toMatchSnapshot(); // parsed aules
  });
});

describe("Testing filterAules method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Aules store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  filterAules = wrapper.instance().filterAules;

  it("Filters 'aules' correctly.", () => {
    const setStateStubSpy = jest.fn(obj => obj);

    // Context provided to method
    context = {
      getIndexHora: () => 1,
      getDia: () => 1,
      props: {
        lang: lang
      },
      state: {
        filterDia: "dl.",
        filterHoraInici: "09:00",
        filterDurada: "2h+",
        aulesParsed: {
          A5202: {
            1: new Array(13).fill(false)
          }
        }
      },
      setState: setStateStubSpy
    };

    // Execute
    filterAules.bind(context)();

    // Assert test cases
    expect(setStateStubSpy.mock.calls[0][0]).toMatchSnapshot(); // filtered aules
  });
});

describe("Testing getIndexHora method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Aules store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  getIndexHora = wrapper.instance().getIndexHora;

  it("Generates index for a given hour string.", () => {
    // Assert test cases
    expect(getIndexHora("08:00")).toBe(0);
    expect(getIndexHora("15:00")).toBe(7); 
  });
});

describe("Testing getDia method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Aules store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  getDia = wrapper.instance().getDia;

  it("Returns the index of the day for given string.", () => {

    const context = {
      props: {lang},
    }

    // Assert test cases
    expect(getDia.bind(context)("dl.")).toBe(1);
    expect(getDia.bind(context)("dt.")).toBe(2);
    expect(getDia.bind(context)("dc.")).toBe(3);
    expect(getDia.bind(context)("dj.")).toBe(4);
    expect(getDia.bind(context)("dv.")).toBe(5);

  });
});

describe("Testing Aules component", () => {

  it("Renders correctly", () => {

    // Create component wrapper
    const wrapper = shallow(
      <Aules store={mockStore(initialState)} lang={lang} langCode={langCode} />, // Add props if your component requires them
      { disableLifecycleMethods: true }
    ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

    wrapper.instance().updateToken = updateToken;

    expect(wrapper).toMatchSnapshot();
  });
});
