import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import configureStore from "redux-mock-store";
import { shallow } from "enzyme";
//import jest from 'jest';
import axios from "axios";
import sinon from "sinon";
import AxiosMockAdapter from "axios-mock-adapter";
import { TouchableOpacity } from "react-native";

// LANG
import {ca} from "../src/languages/ca";
const lang = ca.noticies;

// Components
import { Noticies } from "../src/components/navigation/Noticies";

// Mocks
import {
  noticia,
  noticies,
  noticies_1,
  noticies_buit
} from "../__mocks__/fib-api/noticies";
import {
  default_settings,
  minimalist_settings,
  small_fontsize_settings,
  paleta
} from "../__mocks__/app-settings";

// Stubs
import updateToken from "../__stubs__/update_token";

// URLs
import { noticiesURL } from "../src/external_links";

Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {};

beforeEach(() => {});

describe("Testing getData method from Noticies component", () => {
  const wrapper = shallow(
    <Noticies store={mockStore(initialState)} noticies={noticies_buit} lang={lang} />,
    { disableLifecycleMethods: false }
  );

  // Method to test
  getData = wrapper.instance().getData;

  it("returns an empty list when providing an empty list of 'noticies'", () => {
    expect(
      getData.bind({
        props: { noticies: noticies_buit, lang:lang },
        state: {},
        setState: obj => obj
      })()
    ).toMatchInlineSnapshot(`Array []`);
  });

  it("extracts and maps the relevant data from a list of unparsed 'noticies' (list size = 1)", () => {
    expect(
      getData.bind({
        props: { noticies: noticies_1, lang:lang },
        state: {},
        setState: obj => obj
      })()
    ).toMatchSnapshot();
  });

  it("extracts and maps the relevant data from a list of unparsed 'noticies' (list size = 11)", () => {
    expect(
      getData.bind({
        props: { noticies: noticies, lang:lang },
        state: {},
        setState: obj => obj
      })()
    ).toMatchSnapshot();
  });
});

describe("Testing renderNoticia method from Noticies component", () => {
  const wrapper = shallow(
    <Noticies store={mockStore(initialState)} noticies={noticies_buit} lang={lang} />,
    { disableLifecycleMethods: false }
  );

  // Method to test
  renderNoticia = wrapper.instance().renderNoticia;

  it("renders the preview of the notice", () => {
    expect(renderNoticia({ item: noticia })).toMatchSnapshot();
  });
});

describe("Testing refreshData method from Noticies component", () => {
  const wrapper = shallow(
    <Noticies store={mockStore(initialState)} noticies={noticies_buit} lang={lang} />
  );

  // Method to test
  refreshData = wrapper.instance().refreshData;

  // Set axios adapter
  axiosAdapter = new AxiosMockAdapter(axios);

  it("fetches new notices and updates the state of redux store", async () => {
    // Set axios mocks
    //axiosAdapter.restore();
    axiosAdapter.onGet(noticiesURL).reply(200, noticies);

    alert = function(msg) {
      return msg;
    };

    var context = {
      alert: { alert },
      updateToken: updateToken,
      props: {
        lang:lang,
        noticiesToRedux: function(obj) {
          return obj.data;
        }
      },
      state: {},
      setState: obj => {
        return obj;
      }
    };

    // Set spy in noticiesToRedux stub
    const noticiesToRedux_spy = sinon.spy(context.props, "noticiesToRedux");

    // Execute function refreshData
    await refreshData.bind(context)();

    expect(noticiesToRedux_spy.returnValues).toMatchSnapshot();
  });

  it("fetches new notices with bad response and notifies user", async () => {
    // Set axios mocks
    axiosAdapter.restore();
    axiosAdapter.onGet(noticiesURL).reply(400, "Bad request");

    var alert = function(msg) {
      return msg;
    };

    var context = {
      alert: { alert },
      updateToken: updateToken,
      props: {
        lang:lang,
        noticiesToRedux: function(obj) {
          return obj.data;
        }
      },
      state: {},
      setState: obj => {
        return obj;
      }
    };

    // Set spy in noticiesToRedux stub
    const alert_spy = sinon.spy(context.alert, "alert");

    // Execute function refreshData
    await refreshData.bind(context)();

    expect(alert_spy.returnValues).toMatchSnapshot();
  });
});

describe("Testing Noticies component", () => {
  it("renders an empty list", () => {
    const wrapper = shallow(
      <Noticies store={mockStore(initialState)} noticies={noticies_buit} lang={lang} />,
      { disableLifecycleMethods: false }
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("renders a list with one notice", () => {
    const wrapper = shallow(
      <Noticies store={mockStore(initialState)} noticies={noticies_1} lang={lang} />,
      { disableLifecycleMethods: false }
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("renders a list with more than one notice", () => {
    const wrapper = shallow(
      <Noticies store={mockStore(initialState)} noticies={noticies} lang={lang} />,
      { disableLifecycleMethods: false }
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("renders an open notice", () => {
    const wrapper = shallow(
      <Noticies store={mockStore(initialState)} noticies={noticies_1} lang={lang} />,
      { disableLifecycleMethods: false }
    );

    wrapper.setState({
      opened: true,
      url: "https://www.fib.upc.edu/es/noticias/la-fib-estrena-rotulacion"
    });

    expect(wrapper).toMatchSnapshot();
  });

});
