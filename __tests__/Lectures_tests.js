import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureStore from "redux-mock-store";
import React from "react";
import axios from "axios";

import sinon from "sinon"; // Use this to add spies to methods
import AxiosMockAdapter from "axios-mock-adapter"; // Use this if you need to mock REST requests

// COMPONENT TO TEST
import { Lectures } from "../src/components/navigation/Lectures";

// MOCKS
import { empty_lectures, lectures } from "../__mocks__/fib-api/lectures";

// STUBS
import updateToken from "../__stubs__/update_token";

import { lecturesURL } from "../src/external_links";

// LANG
import { ca } from "../src/languages/ca";
const lang = ca.lectures;
const langCode = "ca";

// Enzyme configuration
Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {}; // If a store is needed replace it here

beforeEach(() => {});

describe("Testing getData method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Lectures store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  getData = wrapper.instance().getData;

  it("It fetches next 'lectures' correctly.", async () => {
    // AXIOS ADAPTER
    const axiosAdapter = new AxiosMockAdapter(axios);
    axiosAdapter.onGet(lecturesURL).reply(200, lectures);

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

describe("Testing getPlans method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Lectures store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  getPlans = wrapper.instance().getPlans;

  it("It extracts all 'plans' found in 'lectures' data.", () => {
    const setStateStubSpy = jest.fn(obj => obj);

    // Context provided to method
    context = {
      props: {},
      state: {
        lectures: lectures.results
      },
      setState: setStateStubSpy
    };

    // Execute method
    getPlans.bind(context)();

    // Assert test case
    expect(setStateStubSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "plans": Array [
          "GRAU",
          "GCED",
          "MEI",
          "MIRI",
          "MSEC",
          "MAI",
        ],
      }
    `);
  });
});

describe("Testing filterLectures method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Lectures store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  filterLectures = wrapper.instance().filterLectures;

  it("filters `lectures` by selected `pla`.", () => {
    const setStateStubSpy = jest.fn(obj => obj);

    // Context provided to method
    context = {
      props: {
        lang: lang,
      },
      state: {
        plaSeleccionat: "GRAU",
        lectures: lectures.results
      },
      setState: setStateStubSpy
    };

    // Execute method
    filterLectures.bind(context)();

    // Assert test case
    expect(setStateStubSpy.mock.calls[0][0]).toMatchSnapshot();
  });

  it("Does nothing when `pla` == `Tots`. (lectures = lecturesFiltered)", () => {
    const setStateStubSpy = jest.fn(obj => obj);

    // Context provided to method
    context = {
      props: {
        lang: lang,
      },
      state: {
        plaSeleccionat: "Tots",
        lectures: lectures.results
      },
      setState: setStateStubSpy
    };

    // Execute method
    filterLectures.bind(context)();

    // Assert test case
    expect(setStateStubSpy.mock.calls[0][0]).toMatchSnapshot();
  });
});

describe("Testing formatDay method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Lectures store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Method to test
  formatDay = wrapper.instance().formatDay;

  it("formats avis.date (2020-04-12T21:08:09) into 'DD/MM/AAAA hh:mm", () => {
    expect(
      formatDay.bind({
        props: {lang:lang},
        state: {},
        setState: obj => obj
      })("2020-04-12T21:08:09")
    ).toBe("12/04/2020 21:08");
  });

  it("formats avis.date (2020-06-29T11:48:50) into 'DD/MM/AAAA hh:mm", () => {
    expect(
      formatDay.bind({
        props: {lang:lang},
        state: {},
        setState: obj => obj
      })("2020-06-29T11:48:50")
    ).toBe("29/06/2020 11:48");
  });
});

describe("Testing Lectures component", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Lectures store={mockStore(initialState)} lang={lang} langCode={langCode} />, // Add props if your component requires them
    { disableLifecycleMethods: true }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  it("It renders correctly.", () => {

    wrapper.instance().updateToken = updateToken;

    // AXIOS ADAPTER
    const axiosAdapter = new AxiosMockAdapter(axios);
    axiosAdapter.onGet(lecturesURL).reply(200, lectures);

    // Assert test case
    expect(wrapper).toMatchSnapshot();
  });
});
