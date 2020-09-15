import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import configureStore from "redux-mock-store";
import { shallow } from "enzyme";
import axios from "axios";
import sinon from "sinon";
import AxiosMockAdapter from "axios-mock-adapter";
import AsyncStorage from "@react-native-community/async-storage";

// Components
import { Home } from "../src/components/Home";

// Mocks
import {token} from "../__mocks__/fib-api/tokens";
import {avisos} from "../__mocks__/fib-api/avisos";
import {assignatures_1} from "../__mocks__/fib-api/assignatures";
import {normal_horari} from "../__mocks__/fib-api/horaris";
import {noticies_1} from "../__mocks__/fib-api/noticies";
import {labImages} from "../__mocks__/fib-api/labs";
import {events} from "../__mocks__/fib-api/events";
import {examens} from "../__mocks__/fib-api/examens";
import {Q_Actual} from "../__mocks__/fib-api/quadrimestres";
import {
  changed_settings,
  missing_settings,
  empty_settings
} from "../__mocks__/app-settings";

// Navigation mock
jest.mock("../src/components/Navigation", () => {
  return {
    __esModule: true,
    default: () => {
      return 0;
    }
  };
});

// URLs
import { avisosURL, horariURL, assigURL, noticiesURL, imglabsURL, QActualURL, eventsURL, practiquesURL } from "../src/external_links";

Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {};

beforeEach(() => {});

describe("Testing loadSettings method from Noticies component", () => {
  const wrapper = shallow(<Home store={mockStore(initialState)} />, {
    disableLifecycleMethods: true
  });

  // Method to test
  loadSettings = wrapper.instance().loadSettings;

  it("feeds redux store the default settings if no previous settings were saved", async () => {
    // AsyncStorage Mock
    AsyncStorage.getItem = jest.fn(async key => {
      if (key == "settings") return JSON.stringify(empty_settings);
    });

    // settingsToRedux mocked spy
    var settingsToRedux = jest.fn(settings => settings);

    await loadSettings.bind({
      props: {
        settingsToRedux
      },
      state: {},
      setState: obj => obj
    })();

    expect(settingsToRedux.mock.calls.length).toBe(1);
    expect(settingsToRedux.mock.calls[0][0]).toMatchInlineSnapshot(`
                  Object {
                    "AVISOSnotif": true,
                    "AVISOSsize": 14,
                    "HORARIminimalist": false,
                    "HORARIpalette": 1,
                    "HORARIsize": 13,
                  }
            `);
  });

  it("feeds redux store the saved settings from the device cache", async () => {
    // AsyncStorage Mock
    AsyncStorage.getItem = jest.fn(async key => {
      if (key == "settings") return JSON.stringify(changed_settings);
    });

    // settingsToRedux mocked spy
    var settingsToRedux = jest.fn(settings => settings);

    await loadSettings.bind({
      props: {
        settingsToRedux
      },
      state: {},
      setState: obj => obj
    })();

    expect(settingsToRedux.mock.calls.length).toBe(1);
    expect(settingsToRedux.mock.calls[0][0]).toMatchInlineSnapshot(`
            Object {
              "AVISOSnotif": false,
              "AVISOSsize": 17,
              "HORARIminimalist": true,
              "HORARIpalette": 1,
              "HORARIsize": 16,
            }
        `);
  });

  it("loads settings from memory cache, adds the missing attribute with the default value and feeds it to redux store", async () => {
    // AsyncStorage Mock
    AsyncStorage.getItem = jest.fn(async key => {
      if (key == "settings") return JSON.stringify(missing_settings);
    });

    // settingsToRedux mocked spy
    var settingsToRedux = jest.fn(settings => settings);

    await loadSettings.bind({
      props: {
        settingsToRedux
      },
      state: {},
      setState: obj => obj
    })();

    expect(settingsToRedux.mock.calls.length).toBe(1);
    expect(settingsToRedux.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "AVISOSnotif": false,
        "AVISOSsize": 17,
        "HORARIminimalist": false,
        "HORARIpalette": 1,
        "HORARIsize": 16,
      }
    `);
  });
});

describe("Testing logOut method from Noticies component", () => {
  const wrapper = shallow(<Home store={mockStore(initialState)} />, {
    disableLifecycleMethods: true
  });

  // Method to test
  logOut = wrapper.instance().logOut;

  it("clears token from redux store and device cache", async () => {
    // AsyncStorage Mock
    AsyncStorage.clear = jest.fn( async () => {});

    // settingsToRedux mocked spy
    var deleteToken = jest.fn(() => {});

    await logOut.bind({
      props: {
        deleteToken
      },
      state: {},
      setState: obj => obj
    })();

    expect(AsyncStorage.clear.mock.calls.length).toBe(1);
    expect(deleteToken.mock.calls.length).toBe(1);

  });

});

describe("Testing getData method from Noticies component", () => {
  const wrapper = shallow(<Home store={mockStore(initialState)} />, {
    disableLifecycleMethods: true
  });

  // Method to test
  getData = wrapper.instance().getData;

  it("Prefetches the data from FIB's API for the app components feeding them to the redux store", async () => {

    // AsyncStorage Mock
    AsyncStorage.getItem = jest.fn(async key => {
      if (key == "horari") return JSON.stringify({});
    });
    AsyncStorage.setItem = jest.fn(async (key, value) => {});

    // Set axios mocks
    axiosAdapter = new AxiosMockAdapter(axios)
    axiosAdapter.onGet(avisosURL).reply(200, avisos);
    axiosAdapter.onGet(assigURL).reply(200, assignatures_1);
    axiosAdapter.onGet(horariURL).reply(200, normal_horari);
    axiosAdapter.onGet(noticiesURL).reply(200, noticies_1);
    axiosAdapter.onGet(imglabsURL).reply(200, labImages);
    axiosAdapter.onGet(QActualURL).reply(200, Q_Actual);
    axiosAdapter.onGet("/examens").reply(200, examens);
    axiosAdapter.onGet(eventsURL).reply(200, events);
    axiosAdapter.onGet(practiquesURL).reply(200, {});

    // redux calls mocked spies
    var avisosToRedux = jest.fn(() => {});
    var assigToRedux = jest.fn(() => {});
    var horariToRedux = jest.fn(() => {});
    var noticiesToRedux = jest.fn(() => {});
    var imglabsToRedux = jest.fn(() => {});
    var examensToRedux = jest.fn(() => {});
    var eventsToRedux = jest.fn(() => {});
    var practiquesToRedux = jest.fn(() => {});

    await getData.bind({
      props: {
        token,
        avisosToRedux,
        assigToRedux,
        horariToRedux,
        noticiesToRedux,
        imglabsToRedux,
        examensToRedux,
        eventsToRedux,
        practiquesToRedux,
      },
      state: {},
      setState: obj => obj
    })();

    expect(avisosToRedux.mock.calls.length).toBe(1);
    expect(avisosToRedux.mock.calls[0][0]).toMatchSnapshot();

    expect(assigToRedux.mock.calls.length).toBe(1);
    expect(assigToRedux.mock.calls[0][0]).toMatchSnapshot();

    expect(horariToRedux.mock.calls.length).toBe(0);

    expect(imglabsToRedux.mock.calls.length).toBe(1);
    expect(imglabsToRedux.mock.calls[0][0]).toMatchSnapshot();

    expect(eventsToRedux.mock.calls.length).toBe(1);
    expect(eventsToRedux.mock.calls[0][0]).toMatchSnapshot();

    expect(practiquesToRedux.mock.calls.length).toBe(1);
    expect(practiquesToRedux.mock.calls[0][0]).toMatchSnapshot();

  });

});