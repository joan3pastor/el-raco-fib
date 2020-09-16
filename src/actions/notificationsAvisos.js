import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import _ from 'lodash';
import qs from 'querystring';

import { avisosURL, tokenURL, clientID, clientSECRET } from '../external_links';

export default class {
    
    constructor() {
        this.PushNotification = require('react-native-push-notification');
    }

    async sendNotification(title, message) {
        await this.PushNotification.localNotification({
            autoCancel: true, // (optional) default: true
            largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
            smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
            subText: "Nou avis:", // (optional) default: none
            group: "avisos", // (optional) add group to message
            tag: "avisos",
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            priority: "high", // (optional) set notification priority, default: high
            visibility: "private", // (optional) set notification visibility, default: private
            importance: "high", // (optional) set notification importance, default: high
            title: title, // "Nou avís: ASSIG", // (optional)
            message: message, // "Títol del avís", // (required)
            playSound: true, // (optional) default: true
            soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        });
    }

    async getToken() {
        await AsyncStorage.getItem('token').then((unparsedToken)=>{
            this.token = JSON.parse(unparsedToken);
            if (_.isUndefined(this.token.token)) {
                return -1; // Break. Not logged in.
            }
        });

        if (this.token.expire_date < Date.now() + 1*3600*1000) {
            //Token invalid. Refreshing it...
            const reqBody = {
              grant_type: "refresh_token",
              refresh_token: this.token.refresh_token,
              client_id: clientID,
              client_secret: clientSECRET
            }

            var resp;
            try {
                resp = await axios.post(tokenURL, qs.stringify(reqBody));
            } catch (error) {
                return -1;
            }

            if (_.isUndefined(resp.data.access_token)) {
                return -1;
            } else {
              this.token = {token: resp.data.access_token, refresh_token: resp.data.refresh_token, expire_date: Date.now()+Number(resp.data.expires_in)*1000-3600000};
              await AsyncStorage.setItem('token', JSON.stringify(this.token));
            }
        }
        return 1;
    }

    async checkSettings() {
        var notifsEnabled = true;
        await AsyncStorage.getItem('settings').then((unparsedSettings)=>{
            if (!_.isEmpty(unparsedSettings)) {

                var settings = JSON.parse(unparsedSettings);
                if (settings.AVISOSnotif == false) notifsEnabled = false;
            }
        });
        if (!notifsEnabled) return -1;
        return 1;
    }

    async getAvisosFromAsync() {
        await AsyncStorage.getItem('avisos').then((upAvisos) => {
            this.asyncAvisos = JSON.parse(upAvisos);
            if (_.isUndefined(this.asyncAvisos.results)) {
                return -1; // Break. No avisos previously loaded.
            }
        });
        return 1;
    }

    async fetchNewAvisos() {
        await axios(avisosURL, {headers: {'Authorization': `Bearer ${this.token.token}`, 'Accept-Language':'ca'}})
        .then(({data}) => {
            this.fetchedAvisos = data;
        });
    }

    async saveAsyncAvisos() {
        await AsyncStorage.setItem('avisos', JSON.stringify(this.fetchedAvisos));
    }

    comparator(a, b) {
        return _.isEqual(`${a.titol}${a.data_modificacio}`, `${b.titol}${b.data_modificacio}`);
    }

    async execute() {
        //this.sendNotification('Inicialitzating service!', 'Inserting new "Avis". Good luck...'); // * For debugging
        this.err = await this.checkSettings();
        if (this.err == -1) return;
        this.err = await this.getToken();
        if (this.err == -1) this.err = await this.getToken();
        if (this.err == -1) return;
        this.err = await this.getAvisosFromAsync();
        if (this.err == -1) return;
        await this.fetchNewAvisos();
        await this.saveAsyncAvisos();
        var avisosNEW = this.fetchedAvisos.results;
        var avisosOLD = this.asyncAvisos.results;
        
        //avisosOLD.splice(0, 3); // * For debugging

        if (avisosNEW.length == avisosOLD.length) {
            //this.sendNotification('Congrats!', 'All executed correctly even no new "Avisos" where found.'); // * For debugging
            //this.sendNotification('INFO', `NEW${avisosNEW.length} OLD:${avisosOLD.length}`); // * For debugging
            return;
        } 

        var avisosDIFF = _.differenceWith(avisosNEW, avisosOLD, this.comparator); //Cambiado en 1.4
        //this.sendNotification('INFO', `DIFF:${avisosDIFF.length} NEW${avisosNEW.length} OLD:${avisosOLD.length}`); // * For debugging
        if (avisosDIFF.length <= 5) {
            avisosDIFF.forEach((newAvis) => {
                this.sendNotification(`Nou avís: ${newAvis.codi_assig}`, newAvis.titol);    
            })
        } /*else {
            this.sendNotification(`Tens ${avisosDIFF.length} avisos nous.`, '');
        }*/
        //this.sendNotification('INFO', 'Process has ended.'); // * For debugging
    }

}
