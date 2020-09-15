import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import axios from 'axios'
import sinon from 'sinon';

// LANG
import {ca} from "../src/languages/ca";
const lang = ca.horari;

// Components
import {Horari} from "../src/components/navigation/Horari";

// Mocks
import {horari_buit, normal_horari, horari_with_overlap, parsed_horari_buit, parsed_horari, parsed_horari_with_overlap, normal_class, overlapped_class_1, overlapped_class_2} from "../__mocks__/fib-api/horaris";
import {default_settings, minimalist_settings, small_fontsize_settings, paleta} from "../__mocks__/app-settings";

Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {};

beforeEach( () => {})

describe('Testing parseHorari method from Horari component', () => {
  const wrapper = shallow(
    <Horari store={mockStore(initialState)} settings={default_settings} lang={lang} />
  );

  parseHorari = wrapper.instance().parseHorari;

  it("parses an empty schelude", () => {
    expect(parseHorari(paleta, horari_buit))
    .toMatchSnapshot();
  });

  it("parses a normal schelude", () => {
    expect(parseHorari(paleta, normal_horari))
    .toMatchSnapshot();
  });

  it("parses a schelude with overlapping", () => {
    expect(parseHorari(paleta, horari_with_overlap))
    .toMatchSnapshot();
  });

});

describe('Testing printCell method from Horari component', () => {
  const wrapper = shallow(
    <Horari store={mockStore(initialState)} settings={default_settings} lang={lang} />
  );

  printCell = wrapper.instance().printCell;
  WWidth = 400;

  it("returns a cell which doesn't contain a class from the provided parsed schelude [settings: minimalist=false]", () => {
    expect(printCell.bind({props:{settings:default_settings, lang:lang}})(parsed_horari[1], 1, 8, parsed_horari[0], false, WWidth))
    .toMatchSnapshot();
  });

  it("returns a cell which doesn't contain a class from the provided parsed schelude [settings: minimalist=true]", () => {
    expect(printCell.bind({props:{settings:minimalist_settings, lang:lang}})(parsed_horari[1], 1, 8, parsed_horari[0], false, WWidth))
    .toMatchSnapshot();
  });

  it("returns a cell which contains a class from the provided parsed schelude [settings: minimalist=false]", () => {
    expect(printCell.bind({props:{settings:default_settings, lang:lang}})(parsed_horari[1], 1, 16, parsed_horari[0], false, WWidth))
    .toMatchSnapshot();
  });

  it("returns a cell which contains a class from the provided parsed schelude [settings: minimalist=true]", () => {
    expect(printCell.bind({props:{settings:minimalist_settings, lang:lang}})(parsed_horari[1], 1, 16, parsed_horari[0], false, WWidth))
    .toMatchSnapshot();
  });

  it("returns a cell which contains a class from the provided parsed schelude [settings: size=smaller(12)]", () => {
    expect(printCell.bind({props:{settings:small_fontsize_settings, lang:lang}})(parsed_horari[1], 1, 16, parsed_horari[0], false, WWidth))
    .toMatchSnapshot();
  });

  it("returns a cell which contains an overlapping of two classes from the provided parsed schelude [settings: minimalist=false]", () => {
    expect(printCell.bind({props:{settings:default_settings, lang:lang}})(parsed_horari_with_overlap[1], 1, 16, parsed_horari_with_overlap[0], false, WWidth))
    .toMatchSnapshot();
  });

  it("returns a cell which contains an overlapping of two classes from the provided parsed schelude [settings: minimalist=true]", () => {
    expect(printCell.bind({props:{settings:minimalist_settings, lang:lang}})(parsed_horari_with_overlap[1], 1, 16, parsed_horari_with_overlap[0], false, WWidth))
    .toMatchSnapshot();
  });
});

describe('Testing openAlert method from Horari component', () => {

  const wrapper = shallow(
    <Horari store={mockStore(initialState)} settings={default_settings} lang={lang} />
  );

  // Get function
  openAlert = wrapper.instance().openAlert;

  // Set spy on a fake Alert object
  alert = function (title, msg) {return `${title} - ${msg}`};
  context = {alert:{alert}, props:{lang:lang}}
  alertSpy = sinon.spy(context.alert, "alert");

  it("opens correctly an alert corresponding with a cell with one class", () => {
    openAlert.bind(context)(normal_class);
    expect(alertSpy.returnValues[alertSpy.returnValues.length-1])
    .toBe("ROB - ROB-T Grup: 10 Aula: C6S303");
  });

  it("opens correctly an alert corresponding with a cell with two classes overlapped", () => {
    openAlert.bind(context)(overlapped_class_1);
    expect(alertSpy.returnValues[alertSpy.returnValues.length-1])
    .toBe("AS + ROB - AS-T Grup: 10 Aula: A6102\nROB-T Grup: 10 Aula: C6S303\n");
  });

  it("opens correctly an alert corresponding with a cell with three classes overlapped", () => {
    openAlert.bind(context)(overlapped_class_2);
    expect(alertSpy.returnValues[alertSpy.returnValues.length-1])
    .toBe("AS + ROB + AS - AS-T Grup: 10 Aula: A6102\nROB-L Grup: 14 Aula: C6S303\nAS-T Grup: 12 Aula: A6102\n");
  });

});

describe('Testing Horari component', () => {

  it('renders an empty schelude when schelude data not provided', () => {
    const wrapper = shallow(
      <Horari store={mockStore(initialState)} settings={default_settings} lang={lang} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders the schelude correctly when provided an empty schelude data [settings: minimalist=false]', () => {
    const wrapper = shallow(
      <Horari store={mockStore(initialState)} settings={default_settings} horari={horari_buit} lang={lang} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders the schelude correctly when provided an empty schelude data [settings: minimalist=true]', () => {
    const wrapper = shallow(
      <Horari store={mockStore(initialState)} settings={minimalist_settings} horari={horari_buit} lang={lang} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders the schelude correctly when provided a normal schelude data [settings: minimalist=false]', () => {
    const wrapper = shallow(
      <Horari store={mockStore(initialState)} settings={default_settings} horari={normal_horari} lang={lang} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders the schelude correctly when provided a normal schelude data [settings: minimalist=true]', () => {
    const wrapper = shallow(
      <Horari store={mockStore(initialState)} settings={minimalist_settings} horari={normal_horari} lang={lang} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders the schelude correctly when provided a schelude data with overlapping [settings: minimalist=false]', () => {
    const wrapper = shallow(
      <Horari store={mockStore(initialState)} settings={default_settings} horari={horari_with_overlap} lang={lang} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders the schelude correctly when provided a schelude data with overlapping [settings: minimalist=true]', () => {
    const wrapper = shallow(
      <Horari store={mockStore(initialState)} settings={minimalist_settings} horari={horari_with_overlap} lang={lang} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders the schelude correctly when provided a normal schelude data [settings: size=smaller(12)]', () => {
    const wrapper = shallow(
      <Horari store={mockStore(initialState)} settings={small_fontsize_settings} horari={normal_horari} lang={lang} />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

});

