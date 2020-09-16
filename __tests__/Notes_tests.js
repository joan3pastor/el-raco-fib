import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureStore from "redux-mock-store";
import React from "react";
import axios from "axios";

import sinon, { expectation } from "sinon"; // Use this to add spies to methods
import AxiosMockAdapter from "axios-mock-adapter"; // Use this if you need to mock REST requests

// COMPONENT TO TEST
import { Notes } from "../src/components/navigation/Notes";

// MOCKS
import {
  assignatures_buit,
  assignatures_1
} from "../__mocks__/fib-api/assignatures";
import { notes_rob, notes_rob_empty } from "../__mocks__/notes";

// LANG
import { ca } from "../src/languages/ca";
const lang = ca.notes;

// Enzyme configuration
Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {}; // If a store is needed replace it here

beforeEach(() => {
  /* ... */
}); // Executed before each test

describe("Testing calculateAVG method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Notes store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: false }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  let calculateAVG = wrapper.instance().calculateAVG;

  it("returns avarage of a subject with no entries.", () => {
    // Context provided to method
    context = {
      props: {
        notes: notes_rob_empty
      },
      state: {},
      setState: obj => {}
    };

    // Assert test case
    expect(calculateAVG.bind(context)("ROB")).toMatchInlineSnapshot(`
                                                Array [
                                                  0,
                                                  "0.00",
                                                  "#ff0000",
                                                ]
                                `);
  });

  it("returns avarage of a subject with no entries.", () => {
    // Context provided to method
    context = {
      props: {
        notes: notes_rob
      },
      state: {},
      setState: obj => {}
    };

    // Assert test case
    expect(calculateAVG.bind(context)("ROB")).toMatchInlineSnapshot(`
                                                Array [
                                                  69.71,
                                                  "6.97",
                                                  "#0bdb00",
                                                ]
                                `);
  });
});

describe("Testing calculateFinal method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Notes store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: false }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  let calculateFinal = wrapper.instance().calculateFinal;

  it("returns final score of a subject with no entries.", () => {
    // Context provided to method
    context = {
      props: {
        notes: notes_rob_empty
      },
      state: {},
      setState: obj => {}
    };

    // Assert test case
    expect(calculateFinal.bind(context)("ROB")).toMatchInlineSnapshot(`
                                                Array [
                                                  0,
                                                  "0.00",
                                                  "#ff0000",
                                                ]
                                `);
  });

  it("returns final score of a subject with no entries.", () => {
    // Context provided to method
    context = {
      props: {
        notes: notes_rob
      },
      state: {},
      setState: obj => {}
    };

    // Assert test case
    expect(calculateFinal.bind(context)("ROB")).toMatchInlineSnapshot(`
                                                Array [
                                                  48.8,
                                                  "4.88",
                                                  "#ff0000",
                                                ]
                                `);
  });
});

describe("Testing calculateProgress method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Notes store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: false }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  let calculateProgress = wrapper.instance().calculateProgress;

  it("returns the progress of a subject with no entries.", () => {
    // Context provided to method
    context = {
      props: {
        notes: notes_rob_empty
      },
      state: {},
      setState: obj => {}
    };

    // Assert test case
    expect(calculateProgress.bind(context)("ROB")).toMatchInlineSnapshot(`
                                          Array [
                                            0,
                                            "0%",
                                          ]
                            `);
  });

  it("returns the progress of a subject with no entries.", () => {
    // Context provided to method
    context = {
      props: {
        notes: notes_rob
      },
      state: {},
      setState: obj => {}
    };

    // Assert test case
    expect(calculateProgress.bind(context)("ROB")).toMatchInlineSnapshot(`
                                          Array [
                                            70,
                                            "70%",
                                          ]
                            `);
  });
});

describe("Testing verifyAndSaveForm method", () => {
  // Create component wrapper
  const wrapper = shallow(
    <Notes store={mockStore(initialState)} lang={lang} />, // Add props if your component requires them
    { disableLifecycleMethods: false }
  ); // If true, render(), componetDidMount() & componetWillUnmount() will not be called

  // Extract method to test from wrapper
  let verifyAndSaveForm = wrapper.instance().verifyAndSaveForm;

  it("returns error when entry name not inserted", () => {
    // Context provided to method

    const alert_stub = jest.fn(msg => msg);
    global.alert = alert_stub;

    context = {
      props: {
        notes: notes_rob
      },
      state: {
        addNom: null,
        addWeight: "0.2",
        addNota: "7.2",
        addEntryOpened: "ROB",
        addIndex: 0
      },
      setState: obj => {
        /* ... */
      }
    };

    // Execute method
    verifyAndSaveForm.bind(context)(0);

    // Assert test case
    expect(alert_stub.mock.calls[0][0]).toMatchInlineSnapshot(
      `"ERROR: Nom no introduït."`
    );
  });

  it("returns error when entry weight not inserted", () => {
    // Context provided to method

    const alert_stub = jest.fn(msg => msg);
    global.alert = alert_stub;

    context = {
      props: {
        notes: notes_rob
      },
      state: {
        addNom: "Examen Parcial 1",
        addWeight: null,
        addNota: "7.2",
        addEntryOpened: "ROB",
        addIndex: 0
      },
      setState: obj => {
        /* ... */
      }
    };

    // Execute method
    verifyAndSaveForm.bind(context)(0);

    // Assert test case
    expect(alert_stub.mock.calls[0][0]).toMatchInlineSnapshot(
      `"ERROR: Pes no introduït."`
    );
  });

  it("returns error when entry weight out of range (0 - 1)", () => {
    // Context provided to method

    const alert_stub = jest.fn(msg => msg);
    global.alert = alert_stub;

    context = {
      props: {
        notes: notes_rob
      },
      state: {
        addNom: "Examen Parcial 1",
        addWeight: "2",
        addNota: "7.2",
        addEntryOpened: "ROB",
        addIndex: 0
      },
      setState: obj => {
        /* ... */
      }
    };

    // Execute method
    verifyAndSaveForm.bind(context)(0);

    // Assert test case
    expect(alert_stub.mock.calls[0][0]).toMatchInlineSnapshot(
      `"ERROR: Pes no vàlid. Entre 0 i 1."`
    );
  });

  it("returns error when the subject total weight surpases 100%", () => {
    // Context provided to method

    const alert_stub = jest.fn(msg => msg);
    global.alert = alert_stub;

    context = {
      props: {
        notes: notes_rob
      },
      state: {
        addNom: "Examen Parcial 1",
        addWeight: "0.7",
        addNota: "7.2",
        addEntryOpened: "ROB",
        addIndex: 0
      },
      setState: obj => {
        /* ... */
      }
    };

    // Execute method
    verifyAndSaveForm.bind(context)(0);

    // Assert test case
    expect(alert_stub.mock.calls[0][0]).toMatchInlineSnapshot(
      `"ERROR: El pes total de l'assignatura supera el 100%."`
    );
  });

  it("returns error when entry score out of range (0 - 10)", () => {
    // Context provided to method

    const alert_stub = jest.fn(msg => msg);
    global.alert = alert_stub;

    context = {
      props: {
        notes: notes_rob
      },
      state: {
        addNom: "Examen Parcial 1",
        addWeight: "0.2",
        addNota: "12",
        addEntryOpened: "ROB",
        addIndex: 0
      },
      setState: obj => {
        /* ... */
      }
    };

    // Execute method
    verifyAndSaveForm.bind(context)(0);

    // Assert test case
    expect(alert_stub.mock.calls[0][0]).toMatchInlineSnapshot(
      `"ERROR: Nota no vàlilda. Entre 0 i 10 o nul."`
    );
  });

  it("saves new entry when data is valid", () => {
    // Context provided to method

    const notesToReduxStub = jest.fn(msg => msg);

    context = {
      props: {
        notes: notes_rob,
        notesToRedux: notesToReduxStub
      },
      state: {
        addNom: "Examen Parcial 1",
        addWeight: "0.2",
        addNota: "7.2",
        addEntryOpened: "ROB",
        addIndex: 0
      },
      setState: obj => {
        /* ... */
      }
    };

    // Execute method
    verifyAndSaveForm.bind(context)(0);

    // Assert test case
    expect(notesToReduxStub.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "ROB": Array [
            Object {
              "nota": 7.2,
              "titol": "Examen Parcial 1",
              "weight": 0.2,
            },
            Object {
              "nota": 8,
              "titol": "Examen Parcial 2",
              "weight": 0.4,
            },
            Object {
              "nota": null,
              "titol": "Lab",
              "weight": 0.3,
            },
          ],
        },
      ]
    `);
  });
});

describe("Testing Notes component", () => {

  it("Renders correctly when 'assigs' and 'notes' are NOT provided", () => {
    // Create component wrapper
    const wrapper = shallow(
      <Notes store={mockStore(initialState)} lang={lang} />, 
      { disableLifecycleMethods: false }
    ); 

    expect(wrapper).toMatchSnapshot();
  });

  it("Renders correctly when 'assigs' and 'notes' are provided", () => {
    // Create component wrapper
    const wrapper = shallow(
      <Notes store={mockStore(initialState)} lang={lang} assig={assignatures_1} notes={notes_rob} />, 
      { disableLifecycleMethods: false }
    ); 

    expect(wrapper).toMatchSnapshot();
  });
});