import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import configureStore from "redux-mock-store";
import { shallow } from "enzyme";
//import jest from 'jest';
import axios from "axios";
import sinon from "sinon";
import AxiosMockAdapter from "axios-mock-adapter";

// LANG
import {ca} from "../src/languages/ca";
const lang = ca.events;

// Components
import { Events } from "../src/components/navigation/Events";

// Mocks
import {
  events_buit,
  events,
  event_parsed_old,
  event_parsed_more_3months
} from "../__mocks__/fib-api/events";
import { examens_buit, examens } from "../__mocks__/fib-api/examens";
import {
  assignatures_buit,
  assignatures_5
} from "../__mocks__/fib-api/assignatures";
import {
  default_settings,
  minimalist_settings,
  small_fontsize_settings,
  paleta
} from "../__mocks__/app-settings";

Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {};

beforeEach(() => {});

describe("Testing formatDay method from Events component", () => {
  const wrapper = shallow(
    <Events
      store={mockStore(initialState)}
      events={events_buit}
      assig={assignatures_buit}
      examens={examens_buit}
      lang={lang}
    />,
    { disableLifecycleMethods: true }
  );

  // Method to test
  formatDay = wrapper.instance().formatDay;

  it("formats avis.date into 'DD/MM/AAAA hh:mm", () => {
    expect(
      formatDay.bind({
        props: {lang:lang},
        state: {},
        setState: obj => obj
      })("2020-04-12T21:08:09")
    ).toBe("12T21:08:09/04/2020");
  });

  it("formats avis.date into 'DD/MM/AAAA hh:mm", () => {
    expect(
      formatDay.bind({
        props: {lang:lang},
        state: {},
        setState: obj => obj
      })("2020-06-29T11:48:50")
    ).toBe("29T11:48:50/06/2020");
  });
});

describe("Testing filterExamens method from Events component", () => {
  const wrapper = shallow(
    <Events
      store={mockStore(initialState)}
      events={events_buit}
      assig={assignatures_buit}
      examens={examens_buit}
      lang={lang}
    />,
    { disableLifecycleMethods: false }
  );

  // Method to test
  filterExamens = wrapper.instance().filterExamens;

  it("returns 0 'examens' when there are no subjects", () => {
    context = {
      props: {
        events: events_buit,
        assig: assignatures_buit,
        examens: examens,
        lang:lang,
      },
      state: {},
      setState: obj => obj
    };

    expect(filterExamens.bind(context)()).toMatchInlineSnapshot("Array []");
  });

  it("returns 'examens' from the active subjects", () => {
    context = {
      props: {
        events: events_buit,
        assig: assignatures_5,
        examens: examens,
        lang:lang,
      },
      state: {},
      setState: obj => obj
    };

    expect(filterExamens.bind(context)()).toMatchSnapshot();
  });
});

describe("Testing filterEvents method from Events component", () => {
  const wrapper = shallow(
    <Events
      store={mockStore(initialState)}
      events={events_buit}
      assig={assignatures_buit}
      examens={examens_buit}
      lang={lang}
    />,
    { disableLifecycleMethods: false }
  );

  // Method to test
  filterEvents = wrapper.instance().filterEvents;

  it("returns 0 'events' when <reduxstore>.events is empty", () => {
    context = {
      props: {
        events: events_buit,
        assig: assignatures_buit,
        examens: examens_buit,
        lang:lang,
      },
      state: {},
      setState: obj => obj
    };

    expect(filterEvents.bind(context)([])).toMatchInlineSnapshot("Array []");
  });

  it("returns 'events' from <reduxstore>.events parsed", () => {
    context = {
      props: {
        events: events,
        assig: assignatures_buit,
        examens: examens_buit,
        lang:lang,
      },
      state: {},
      setState: obj => obj
    };

    expect(filterEvents.bind(context)([])).toMatchSnapshot();
  });
});

describe("Testing filterByDay method from Events component", () => {
  const wrapper = shallow(
    <Events
      store={mockStore(initialState)}
      events={events_buit}
      assig={assignatures_buit}
      examens={examens_buit}
      lang={lang}
    />,
    { disableLifecycleMethods: false }
  );

  // Method to test
  filterByDay = wrapper.instance().filterByDay;

  it("returns 0 'events' because the 'event' provided is too old", () => {
    context = {
      props: {},
      state: {},
      setState: obj => obj
    };

    expect(filterByDay.bind(context)(event_parsed_old)).toMatchInlineSnapshot(
      "Array []"
    );
  });

  it("returns 0 'events' because the date from the 'event' provided is in more than 3 months", () => {
    context = {
      props: {},
      state: {},
      setState: obj => obj
    };

    expect(
      filterByDay.bind(context)(event_parsed_more_3months)
    ).toMatchInlineSnapshot("Array []");
  });
});

describe("Testing getEvents method from Events component", () => {
  const wrapper = shallow(
    <Events
      store={mockStore(initialState)}
      events={events_buit}
      assig={assignatures_buit}
      examens={examens_buit}
      lang={lang}
    />,
    { disableLifecycleMethods: false }
  );

  // Method to test
  getEvents = wrapper.instance().getEvents;

  it("gathers all events from filterExamens and filterEvents and filters them by day with filterByDay", () => {
    context = {
      filterExamens: function() {
        return [1, 2];
      },
      filterEvents: function(evs) {
        return [...evs, 3, 4];
      },
      filterByDay: function(evs) {
        return [...evs, 5, 6];
      },
      props: {},
      state: {},
      setState: obj => obj
    };

    expect(getEvents.bind(context)()).toMatchInlineSnapshot(
      `
      Array [
        1,
        2,
        3,
        4,
        5,
        6,
      ]
    `
    );
  });
});

describe("Testing render from Events component", () => {
  it("renders view with 0 events", () => {
    const wrapper = shallow(
      <Events
        store={mockStore(initialState)}
        events={events_buit}
        assig={assignatures_buit}
        examens={examens_buit}
        lang={lang}
      />,
      { disableLifecycleMethods: false }
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("renders view with events and examens", () => {
    const wrapper = shallow(
      <Events
        store={mockStore(initialState)}
        events={events}
        assig={assignatures_5}
        examens={examens}
        lang={lang}
      />,
      { disableLifecycleMethods: false }
    );

    expect(wrapper).toMatchSnapshot();
  });
});
