import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import axios from 'axios'
import sinon from 'sinon';
import AxiosMockAdapter from 'axios-mock-adapter';

// LANG
import {ca} from "../src/languages/ca";
const lang = ca.avisos;

// Components
import {Avisos} from "../src/components/navigation/Avisos";

// Mocks
import {avisos_buit, avisos, avisos_1, avis, avis_amb_adjunts_1, avis_amb_adjunts_2} from "../__mocks__/fib-api/avisos";
import {assignatures_buit, assignatures_1, assignatures_5} from "../__mocks__/fib-api/assignatures";
import {token, token_buit} from "../__mocks__/fib-api/tokens";
import {default_settings, small_fontsize_settings} from "../__mocks__/app-settings";

// Stubs
import updateToken from "../__stubs__/update_token";

// URLs
import {avisosURL} from '../src/external_links';
import { avisosToRedux } from '../src/actions';

Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {};

beforeEach( () => {})

describe('Testing renderTabs method from Avisos component', () => {

  const wrapper = shallow(
    <Avisos store={mockStore(initialState)} assig={assignatures_buit} avisos={avisos_buit} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
  , {"disableLifecycleMethods": false});

  // Method to test
  renderTabs = wrapper.instance().renderTabs;

  it("renders tabs with no subjects", () => {
    expect(renderTabs.bind({
      props:{assig: assignatures_buit, lang:lang}, 
      state:{active:'Tots'},
      setState: (obj) => obj,
    })()).toMatchSnapshot();
  });

  it("renders tabs with one subject", () => {
    expect(renderTabs.bind({
      props:{assig: assignatures_1}, 
      state:{active:'Tots'},
      setState: (obj) => obj,
    })()).toMatchSnapshot();
  });

  it("renders tabs with five subjects", () => {
    expect(renderTabs.bind({
      props:{assig: assignatures_5}, 
      state:{active:'Tots'},
      setState: (obj) => obj,
    })()).toMatchSnapshot();
  });
  
});

describe('Testing getAvisos method from Avisos component', () => {

  const wrapper = shallow(
    <Avisos store={mockStore(initialState)} assig={assignatures_buit} avisos={avisos_buit} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
  , {"disableLifecycleMethods": false});

  // Method to test
  getAvisos = wrapper.instance().getAvisos;

  it("filters and orders avisos from an empty list of avisos", () => {
    expect(getAvisos.bind({
      props:{avisos: avisos_buit, lang:lang}, 
      state:{active:'Tots'},
      setState: (obj) => obj,
    })()).toMatchSnapshot();
  });

  it("filters avisos from a list of 1 avis of subject 'ASDP' when 'Tots' tab is selected", () => {
    expect(getAvisos.bind({
      props:{avisos: avisos_1, lang:lang}, 
      state:{active:'Tots'},
      setState: (obj) => obj,
    })()).toMatchSnapshot();
  });

  it("filters avisos from a list of 1 avis of subject 'ASDP' when 'ASDP' tab is selected", () => {
    expect(getAvisos.bind({
      props:{avisos: avisos_1}, 
      state:{active:'ASDP'},
      setState: (obj) => obj,
    })()).toMatchSnapshot();
  });

  it("filters avisos from a list of 1 avis of subject 'ASDP' when 'ROB' tab is selected", () => {
    expect(getAvisos.bind({
      props:{avisos: avisos_1}, 
      state:{active:'ROB'},
      setState: (obj) => obj,
    })()).toMatchSnapshot();
  });

});

describe('Testing formatDay method from Avisos component', () => {

  const wrapper = shallow(
    <Avisos store={mockStore(initialState)} assig={assignatures_buit} avisos={avisos_buit} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
  , {"disableLifecycleMethods": true});

  // Method to test
  formatDay = wrapper.instance().formatDay;

  it("formats avis.date into 'DD/MM/AAAA hh:mm", () => {
    expect(formatDay.bind({
      props:{lang:lang}, 
      state:{},
      setState: (obj) => obj,
    })("2020-04-12T21:08:09"))
    .toBe("12/04/2020 21:08");
  });

  it("formats avis.date into 'DD/MM/AAAA hh:mm", () => {
    expect(formatDay.bind({
      props:{lang:lang}, 
      state:{},
      setState: (obj) => obj,
    })("2020-06-29T11:48:50"))
    .toBe("29/06/2020 11:48");
  });

});

describe('Testing decodeSC method from Avisos component', () => {

  const wrapper = shallow(
    <Avisos store={mockStore(initialState)} assig={assignatures_buit} avisos={avisos_buit} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
  , {"disableLifecycleMethods": true});

  // Method to test
  decodeSC = wrapper.instance().decodeSC;

  encoded = ['&quot;','&amp;','&apos;','&nbsp;','&agrave;','&aacute;','&egrave;','&eacute;','&igrave;','&iacute;','&ograve;','&oacute;','&ugrave;','&uacute;','&iuml;','&uuml;','&Agrave;','&Aacute;','&Egrave;','&Eacute;','&Igrave;','&Iacute;','&Ograve;','&Oacute;','&Ugrave;','&Uacute;','&lt;','&gt;','&iexcl;','&ordf;','&laquo;','&deg;','&middot;','&ordm;','&raquo;','&iquest;','&Ccedil;','&ccedil;','&Ntilde;','&ntilde;','other'];
  decoded = ['"','&','\'',' ','à','á','è','é','ì','í','ò','ó','ù','ú','ï','ü','À','Á','È','É','Ì','Í','Ò','Ó','Ù','Ú','<','>','¡','ª','«','°','·','º','»','¿','Ç','ç','Ñ','ñ',''];

  for (let i = 0; i < encoded.length; i++) {
    it(`decodes ${encoded[i]} into ${decoded[i]}`, () => {
      expect(decodeSC.bind({
        props:{lang:lang}, 
        state:{},
        setState: (obj) => obj,
      })(encoded[i]))
      .toBe(decoded[i]);
    });
  }
});

describe('Testing loadingComp method from Avisos component', () => {

  const wrapper = shallow(
    <Avisos store={mockStore(initialState)} assig={assignatures_buit} avisos={avisos_buit} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
  , {"disableLifecycleMethods": true});

  // Method to test
  loadingComp = wrapper.instance().loadingComp;

  it("renders loading component correcly", () => {
    expect(loadingComp.bind({
      props:{assig: assignatures_buit, lang:lang}, 
      state:{active:'Tots'},
      setState: (obj) => obj,
    })()).toMatchSnapshot();
  });
  
});

describe('Testing updateAvisos method from Avisos component', () => {

  const wrapper = shallow(
    <Avisos store={mockStore(initialState)} assig={assignatures_buit} avisos={avisos_buit} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
  );

  // Method to test
  updateAvisos = wrapper.instance().updateAvisos;

  it("fetches new avisos and updates the state of redux store", async () => {
    
    // Set axios mocks
    axiosAdapter = new AxiosMockAdapter(axios)
    axiosAdapter.onGet(avisosURL).reply(200, avisos);

    alert = function (msg) {return msg};

    var context = {
      alert:{alert},
      updateToken: updateToken,
      props: {
        lang:lang,
        avisosToRedux: function (obj) {return obj.data},
      }, 
      state:{},
      setState: (obj) => {return obj},
    }

    // Set spy in avisosToRedux stub
    const avisosToRedux_spy = sinon.spy(context.props, "avisosToRedux");
    //context.props.avisosToRedux(avisos);
    
    await updateAvisos.bind(context)();

    expect(avisosToRedux_spy.calledOnce).toBe(true);
    expect(avisosToRedux_spy.returnValues).toMatchSnapshot();
  });

  it("displays alert message when GET request not returned code 200[OK]", async () => {
    
    // Set axios mocks
    axiosAdapter = new AxiosMockAdapter(axios)
    axiosAdapter.onGet(avisosURL).reply(404, {});

    alert = function (msg) {return msg};

    var context = {
      alert:{alert},
      updateToken: updateToken,
      props: {
        avisosToRedux: function (obj) {return obj},
      }, 
      state:{},
      setState: (obj) => {return obj},
    }

    // Set spy in alert method
    alertSpy = sinon.spy(context.alert, "alert");
    
    await updateAvisos.bind(context)();
    expect(alertSpy.returnValues[alertSpy.returnValues.length-1]).toBe('Error updating.');
  });

});

describe('Testing renderAvis method from Avisos component', () => {

  const wrapper = shallow(
    <Avisos store={mockStore(initialState)} assig={assignatures_buit} avisos={avisos_buit} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
  , {"disableLifecycleMethods": false});

  // Method to test
  renderAvis = wrapper.instance().renderAvis;
  decodeSC = wrapper.instance().decodeSC;
  formatDay = wrapper.instance().formatDay;

  it("renders correctly an 'avis' without attachments", () => {
    expect(renderAvis.bind({
      formatDay,
      decodeSC,
      props:{lang:lang}, 
      state:{},
      setState: (obj) => obj,
    })({item: avis}))
    .toMatchSnapshot();
  });

  it("renders correctly an 'avis' with attachments", () => {
    expect(renderAvis.bind({
      formatDay,
      decodeSC,
      props:{lang:lang}, 
      state:{},
      setState: (obj) => obj,
    })({item: avis_amb_adjunts_1}))
    .toMatchSnapshot();
  });

});

describe('Testing adjuntos method from Avisos component', () => {

  const wrapper = shallow(
    <Avisos store={mockStore(initialState)} assig={assignatures_buit} avisos={avisos_buit} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
  , {"disableLifecycleMethods": false});

  // Method to test
  adjuntos = wrapper.instance().adjuntos;

  it("renders correctly the attachment section when there is no attachments", () => {
    expect(adjuntos.bind({
      props:{
        AVISOSsize: default_settings.AVISOSsize,
        lang:lang,
      }, 
      state:{
        activeAvis: avis,
      },
      setState: (obj) => obj,
    })())
    .toMatchSnapshot();
  });

  it("renders correctly the attachment section when there is one attachment", () => {
    expect(adjuntos.bind({
      props:{
        AVISOSsize: default_settings.AVISOSsize,
      }, 
      state:{
        activeAvis: avis_amb_adjunts_1,
      },
      setState: (obj) => obj,
    })())
    .toMatchSnapshot();
  });

  it("renders correctly the attachment section when there is more than one attachment", () => {
    expect(adjuntos.bind({
      props:{
        AVISOSsize: default_settings.AVISOSsize,
      }, 
      state:{
        activeAvis: avis_amb_adjunts_2,
      },
      setState: (obj) => obj,
    })())
    .toMatchSnapshot();
  });

});

describe('Testing modal method from Avisos component', () => {

  const wrapper = shallow(
    <Avisos store={mockStore(initialState)} assig={assignatures_buit} avisos={avisos_buit} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
  , {"disableLifecycleMethods": false});

  // Method to test
  modal = wrapper.instance().modal;
  adjuntos = wrapper.instance().adjuntos;
  formatDay = wrapper.instance().formatDay;
  decodeSC = wrapper.instance().decodeSC;

  it("renders correctly the extended view (modal) of an 'avis' without attachments", () => {
    expect(modal.bind({
      formatDay,
      decodeSC,
      adjuntos,
      props:{
        AVISOSsize: default_settings.AVISOSsize,
        lang:lang,
      }, 
      state:{
        activeAvis: avis,
      },
      setState: (obj) => obj,
    })())
    .toMatchSnapshot();
  });

  it("renders correctly the extended view (modal) of an 'avis' with one attachment", () => {
    expect(modal.bind({
      formatDay,
      decodeSC,
      adjuntos,
      props:{
        lang:lang,
        AVISOSsize: default_settings.AVISOSsize,
      }, 
      state:{
        activeAvis: avis_amb_adjunts_1,
      },
      setState: (obj) => obj,
    })())
    .toMatchSnapshot();
  });

  it("renders correctly the extended view (modal) of an 'avis' with more than one attachment", () => {
    expect(modal.bind({
      formatDay,
      decodeSC,
      adjuntos,
      props:{
        lang:lang,
        AVISOSsize: default_settings.AVISOSsize,
      }, 
      state:{
        activeAvis: avis_amb_adjunts_2,
      },
      setState: (obj) => obj,
    })())
    .toMatchSnapshot();
  });

});

describe('Testing Avisos component', () => {

  it("renders correctly with any 'avisos' and any 'assignatures'", () => {
    const wrapper = shallow(
      <Avisos store={mockStore(initialState)} assig={assignatures_buit} avisos={avisos_buit} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
    , {"disableLifecycleMethods": false});
    expect(wrapper).toMatchSnapshot();
  });

  it("renders correctly with any 'avisos' and 1 'assignatures'", () => {
    const wrapper = shallow(
      <Avisos store={mockStore(initialState)} assig={assignatures_1} avisos={avisos_buit} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
    , {"disableLifecycleMethods": false});
    expect(wrapper).toMatchSnapshot();
  });

  it("renders correctly with any 'avisos' and 5 'assignatures'", () => {
    const wrapper = shallow(
      <Avisos store={mockStore(initialState)} assig={assignatures_5} avisos={avisos_buit} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
    , {"disableLifecycleMethods": false});
    expect(wrapper).toMatchSnapshot();
  });

  it("renders correctly with many 'avisos' and 5 'assignatures' [tab_selected=Tots]", () => {
    const wrapper = shallow(
      <Avisos store={mockStore(initialState)} assig={assignatures_5} avisos={avisos} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
    , {"disableLifecycleMethods": false});
    expect(wrapper).toMatchSnapshot();
  });

  it("renders correctly with many 'avisos' and 5 'assignatures' [tab_selected=ROB]", () => {
    const wrapper = shallow(
      <Avisos store={mockStore(initialState)} assig={assignatures_5} avisos={avisos} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
    , {"disableLifecycleMethods": false});
    wrapper.setState({active:"ROB"});
    expect(wrapper).toMatchSnapshot();
  });

  it("renders correctly with many 'avisos' and 5 'assignatures' and an 'avis' selected [tab_selected=Tots]", () => {
    const wrapper = shallow(
      <Avisos store={mockStore(initialState)} assig={assignatures_5} avisos={avisos} AVISOSsize={default_settings.AVISOSsize} lang={lang} />
    , {"disableLifecycleMethods": false});
    wrapper.setState({activeAvis:avis, openedAvis:true});
    expect(wrapper).toMatchSnapshot();
  });

});
