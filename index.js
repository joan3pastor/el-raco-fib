// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

/** @format */

import {AppRegistry} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import App from './src/components/App';
import {name as appName} from './app.json';
import BackgroundJob from 'react-native-background-job';

import notifWorker from './src/actions/notificationsAvisos';

var PushNotification = require('react-native-push-notification');
PushNotification.cancelAllLocalNotifications();



/*
AsyncStorage.getItem('settings').then((unparsedSettings)=>{
    if (!_.isEmpty(unparsedSettings)) {

        var settings = JSON.parse(unparsedSettings);
        if (!settings.AVISOSnotif) {

        }
    }
});
*/



const backgroundJob = {
    jobKey: "getingAvisos", //Sí, sé que falta una 't'... No lo puedo cambiar ya que crearia dos backgroundEvents
    timeout: 8000,
    period: 1200000, // Cada 20 min (1200000). Mínimo 15 min (900000).
    override: true,
    allowWhileIdle: true,
    notificationText: 'Cercant nous avisos...',
    notificationTitle: 'FIB service worker',
    job: () => {
        const nw = new notifWorker();
        nw.execute();
    }
};

try {
    BackgroundJob.register(backgroundJob);
    BackgroundJob.schedule({ jobKey: 'getingAvisos' });
}
catch {}

AppRegistry.registerComponent(appName, () => App);
