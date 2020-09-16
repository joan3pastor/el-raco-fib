import _ from 'lodash';
import qs from 'querystring';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { tokenURL, clientID, clientSECRET } from '../external_links';

async function updateToken() {
  // Need to bind 'this' to updateToken with a this.props.token object and this.props.getToken (token to redux store) method.
  // To execute: updateToken.bind(this)();
  if (this.props.token.expire_date < Date.now()) {
    // * redux::token invalid. 
    // * Checking if async::token is invalid

    var asyncToken = await JSON.parse( await AsyncStorage.getItem('token'));
    if (asyncToken.token.expire_date < Date.now()) {
      //* async::token invalid. Refreshing it.

      const reqBody = {
        grant_type: "refresh_token",
        refresh_token: asyncToken.refresh_token,
        client_id: clientID,
        client_secret: clientSECRET
      }

      var resp;
      try {
        resp = await axios.post(tokenURL, qs.stringify(reqBody));
      } catch (error) {
        alert("Error actualitzant el token. Si persisteix, tanca sessió i autentica't de nou.");
        return 0;
      }

      if (!_.isUndefined(resp.data.access_token)) {
        token = {token: resp.data.access_token, refresh_token: resp.data.refresh_token, expire_date: Date.now()+Number(resp.data.expires_in)*1000-3600000};
        await AsyncStorage.setItem('token', JSON.stringify(token))
        .then(this.props.getToken(token))
        .catch((error) => console.error('error saving token to local storage'));
        return token.token;
      }
      return 0;

    }

    // * Token to redux:
    this.props.getToken(asyncToken);
    return asyncToken.token;
  }
  return this.props.token.token;
}

export default updateToken;


// ! En Home.js y notificationsAvisos.js también hay definidas funciones para actualizar el token.
