import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import configureStore from "redux-mock-store";
import { shallow } from "enzyme";
import axios from "axios";
import sinon from "sinon";
import AxiosMockAdapter from "axios-mock-adapter";
import AsyncStorage from "@react-native-community/async-storage";

// Mocks
import {token_valid, token_caducat, token_nou} from "../__mocks__/fib-api/tokens";

// URLs
import {tokenURL} from "../src/external_links";

// Method to test
import updateToken from "../src/actions/updateToken";

Enzyme.configure({ adapter: new Adapter() });
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

const initialState = {};

beforeEach(() => {});

describe("Testing updateToken global method", () => {

  it("reutrns current token if redux token is still valid", async () => {
    expect( await
      updateToken.bind({
        props: {
          token: token_valid,
          getToken: function(token) {return token},
        },
        state: {},
      })()
    ).toBe("token_valid_original");
  });

  it("reutrns current token if token saved in asyncStorage is still valid", async () => {

    // Mocking AsyncStorage
    AsyncStorage.getItem = jest.fn((key) => {if (key == 'token') return JSON.stringify(token_valid);});

    expect( await
      updateToken.bind({
        props: {
          token: token_caducat,
          getToken: function(token) {return token},
        },
        state: {},
      })()
    ).toBe("token_valid_original");
  });

  it("reutrns new token if current token from redux store and asyncStorage have expired and updates the token of those stores", async () => {

    // Mocking axios requests
    axiosAdapter = new AxiosMockAdapter(axios)
    axiosAdapter.onPost(tokenURL).reply(200, token_nou)

    // Mocking AsyncStorage
    AsyncStorage.getItem = jest.fn(async (key) => {if (key == 'token') return JSON.stringify({token:token_caducat});});
    AsyncStorage.setItem = jest.fn(async (key, value) => {return value});

    context = {
      props: {
        token: token_caducat,
        getToken: jest.fn((token) => token),
      },
      state: {},
    };

    expect( await
      updateToken.bind(context)()
    ).toBe("token_valid_nou");
    expect(AsyncStorage.setItem.mock.calls.length).toBe(1);
    expect(context.props.getToken.mock.calls.length).toBe(1);
  });

  it("reutrns 0 when token has expired but request returns an error", async () => {

    // Mocking axios requests
    axiosAdapter = new AxiosMockAdapter(axios)
    axiosAdapter.onPost(tokenURL).reply(404, {code: 404})

    // Mocking AsyncStorage
    AsyncStorage.getItem = jest.fn(async (key) => {if (key == 'token') return JSON.stringify({token:token_caducat});});
    AsyncStorage.setItem = jest.fn(async (key, value) => {return value});

    alert = jest.fn((msg) => msg);

    expect( await
      updateToken.bind({
        props: {
          token: token_caducat,
          getToken: function(token) {return token},
        },
        state: {},
      })()
    ).toBe(0);
  });

});
