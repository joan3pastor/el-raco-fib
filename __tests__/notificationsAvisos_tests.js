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
import notificationsAvisos from "../src/actions/notificationsAvisos";

// Mocks
import {
  avis,
  avis_amb_adjunts_1,
  avisos,
  avisos_1new,
  avisos_2new
} from "../__mocks__/fib-api/avisos";
import { token } from "../__mocks__/fib-api/tokens";
import { default_settings } from "../__mocks__/app-settings";

// URLs
import { avisosURL } from "../src/external_links";

Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {};

beforeEach(() => {});

const notificationObj = new notificationsAvisos();
notificationObj.getToken = jest.fn(() => 1);
notificationObj.token = token;

describe("Testing comparator method from NotificationsAvisos class", () => {
  const comparator = notificationObj.comparator;

  it("returns True when two 'avisos' are the same", async () => {
    expect(comparator(avis, avis)).toBe(true);
  });

  it("returns False when two 'avisos' aren't the same", async () => {
    expect(comparator(avis, avis_amb_adjunts_1)).toBe(false);
  });
});

describe("Testing checkSettings method from NotificationsAvisos class", () => {
  const checkSettings = notificationObj.checkSettings;

  it("returns 1 if 'notificationsAvisos' are enabled on the settings saved in device cache", async () => {
    // AsyncStorage Mock
    AsyncStorage.getItem = jest.fn(async key => {
      if (key == "settings") return JSON.stringify(default_settings);
    });

    expect(await checkSettings()).toBe(1);
  });

  it("returns -1 if 'notificationsAvisos' are disabled on the settings saved in device cache", async () => {
    // AsyncStorage Mock
    AsyncStorage.getItem = jest.fn(async key => {
      if (key == "settings") return JSON.stringify(settings_notif_disabled);
    });

    expect(await checkSettings()).toBe(-1);
  });
});

describe("Testing sendNotification method from NotificationsAvisos class", () => {
  const comparator = notificationObj.comparator;

  it("calls localNotification from this.PushNotification object with the correct parameters", async () => {
    const notificationObj1 = new notificationsAvisos();

    const PushNotification = { localNotification: jest.fn(() => {}) };
    notificationObj1.PushNotification = PushNotification;

    // Execute
    notificationObj1.sendNotification("Título del aviso", "Mensaje del aviso");

    expect(PushNotification.localNotification.mock.calls[0][0])
      .toMatchInlineSnapshot(`
                              Object {
                                "autoCancel": true,
                                "group": "avisos",
                                "importance": "high",
                                "largeIcon": "ic_launcher",
                                "message": "Mensaje del aviso",
                                "playSound": true,
                                "priority": "high",
                                "smallIcon": "ic_notification",
                                "soundName": "default",
                                "subText": "Nou avis:",
                                "tag": "avisos",
                                "title": "Título del aviso",
                                "vibrate": true,
                                "vibration": 300,
                                "visibility": "private",
                              }
                    `);
  });
});

describe("Testing execute method from NotificationsAvisos class", () => {
  const comparator = notificationObj.comparator;

  it("gets 'avisos' from local device storage and parses 'avisos' from FIB's API. When there is a new one, send a new notification about it", async () => {
    const notifObj = new notificationsAvisos();

    // Mocks
    const checkSettings = jest.fn(() => {
      1;
    });
    notifObj.checkSettings = checkSettings;
    const getToken = jest.fn(() => {
      1;
    });
    notifObj.getToken = getToken;
    const getAvisosFromAsync = jest.fn(() => {});
    notifObj.getAvisosFromAsync = getAvisosFromAsync;
    const fetchNewAvisos = jest.fn(() => {});
    notifObj.fetchNewAvisos = fetchNewAvisos;
    const saveAsyncAvisos = jest.fn(() => {});
    notifObj.saveAsyncAvisos = saveAsyncAvisos;
    const sendNotification = jest.fn((title, msg) => {
      //console.log(title + msg);
    });
    notifObj.sendNotification = sendNotification;

    notifObj.fetchedAvisos = avisos_1new;
    notifObj.asyncAvisos = avisos;

    // Execute
    await notifObj.execute();

    expect(sendNotification.mock.calls.length).toBe(1);
    expect(sendNotification.mock.calls[0][0]).toMatchInlineSnapshot(
      `"Nou avís: ROB"`
    );
  });

  it("gets 'avisos' from local device storage and parses 'avisos' from FIB's API. When there are more than one new 'avis', send a new notification for each of them", async () => {
    const notifObj = new notificationsAvisos();

    // Mocks
    const checkSettings = jest.fn(() => {
      1;
    });
    notifObj.checkSettings = checkSettings;
    const getToken = jest.fn(() => {
      1;
    });
    notifObj.getToken = getToken;
    const getAvisosFromAsync = jest.fn(() => {});
    notifObj.getAvisosFromAsync = getAvisosFromAsync;
    const fetchNewAvisos = jest.fn(() => {});
    notifObj.fetchNewAvisos = fetchNewAvisos;
    const saveAsyncAvisos = jest.fn(() => {});
    notifObj.saveAsyncAvisos = saveAsyncAvisos;
    const sendNotification = jest.fn((title, msg) => {
      //console.log(title + msg);
    });
    notifObj.sendNotification = sendNotification;

    notifObj.fetchedAvisos = avisos_2new;
    notifObj.asyncAvisos = avisos;

    // Execute
    await notifObj.execute();

    expect(sendNotification.mock.calls.length).toBe(2);
    expect(sendNotification.mock.calls[0][0]).toMatchInlineSnapshot(`"Nou avís: ASDP"`);
    expect(sendNotification.mock.calls[1][0]).toMatchInlineSnapshot(`"Nou avís: ROB"`);
  });
});

/**
 * execute -7
 */
