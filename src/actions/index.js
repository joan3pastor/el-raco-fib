export const GET_TOKEN = 'GET_TOKEN';
export const GET_CODE = 'GET_CODE';
export const LOAD_TOKEN = 'LOAD_TOKEN';
export const DELETE_TOKEN = 'DELETE_TOKEN';
export const HAS_CONNEXION = 'HAS_CONNEXION';
export const AVISOS = 'AVISOS';
export const HORARI = 'HORARI';
export const HORARI_MODIFICAT = 'HORARI_MODIFICAT';
export const ASSIG = 'ASSIG';
export const NOTICIES = 'NOTICIES';
export const IMGLABS = 'IMGLABS';
export const STORAGEAVISOS = 'STORAGEAVISOS';
export const EXAMENS = 'EXAMENS';
export const EVENTS = 'EVENTS';
export const PRACTIQUES = 'PRACTIQUES'; 
export const SETTINGS = 'SETTINGS';
export const NOTES = 'NOTES';
export const LANG = 'LANG';

import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';

// Languages pack
import lang from '../languages/index'

export function getCode(url) {
    const codeIndex = url.indexOf('code=') + 5;
    if (codeIndex > 4) {
        const code = url.substring(codeIndex);
        return {
            type: GET_CODE,
            payload: { code, code_error: '' }
        };
    }
    else {
        return {
            type: GET_CODE,
            payload: { code: '', code_error: 'Accés denegat' }
        };
    }
}

export function getToken(token) {
    // Esta función es llmada una vez se consigue el response debido 
    // a que es complicado trabajar con promesas en action creators...
    return {
        type: GET_TOKEN,
        resp: token
    };
}

export function tokenToRedux(token) {
    if (_.isEmpty(token)) {
        return {
            type: LOAD_TOKEN,
            resp: {token: ''}
        }
    }
    return {
        type: LOAD_TOKEN,
        resp: token
    };
}

export function deleteToken() {
    return {
        type: DELETE_TOKEN,
        resp: {token: ''}
    }
}

export function updateConnexion(b) {
    return {
        type: HAS_CONNEXION,
        payload: b
    }
}

export function avisosToRedux(resp) {
    return {
        type: AVISOS,
        resp: resp
    }
}

export function horariToRedux(resp) {
    return {
        type: HORARI,
        resp: resp
    }
}

export function horariModificatToRedux(respHorari, modhorari) {

    // anadir clases creadas
    var horari = respHorari;

    modhorari.afegits.forEach((clase) => horari.results.push(clase));

    // eliminar clases borradas
    var indicesAEliminar = [];
    modhorari.eliminats.forEach((c1) => {
        horari.results.forEach((c2, index) => {
            if (c1.dia_setmana == c2.dia_setmana && c1.codi_assig == c2.codi_assig && c1.inici == c2.inici && c1.grup == c2.grup && c1.durada == c2.durada && c1.aules == c2.aules) {
                indicesAEliminar.push(index);
            }
        })
    })

    indicesAEliminar.sort().reverse();
    indicesAEliminar.forEach((index) => {
        horari.results.splice(index, 1);
    });


    return {
        type: HORARI_MODIFICAT,
        resp: horari // resp = {count:1, results:[]}
    }
}

export function assigToRedux(resp) {
    return {
        type: ASSIG,
        resp: resp
    }
}

export function noticiesToRedux(resp) {
    return {
        type: NOTICIES,
        resp: resp
    }
}

export function imglabsToRedux(resp) {
    return {
        type: IMGLABS,
        resp: resp
    }
}

export function storageAvisosToRedux(data) {
    return {
        type: STORAGEAVISOS,
        payload: data
    }
}

export function examensToRedux(resp) {
    return {
        type: EXAMENS,
        resp: resp
    }
}

export function eventsToRedux(resp) {
    return {
        type: EVENTS,
        resp: resp
    }
}

export function practiquesToRedux(resp) {
    return {
        type: PRACTIQUES,
        resp: resp
    }
}

export function settingsToRedux(data) {
    return {
        type: SETTINGS,
        resp: data
    }
}

export function notesToRedux(data) {

    AsyncStorage.setItem("notes", JSON.stringify(data));

    return {
        type: NOTES,
        resp: data
    }
}

export async function loadLanguage() {

    var langSelected = "ca";

    const langUnparsed = await AsyncStorage.getItem("lang");
    if (langUnparsed != "" && langUnparsed != null && langUnparsed != undefined) {
        langSelected = JSON.parse(langUnparsed)
    } else {
        AsyncStorage.setItem("lang", JSON.stringify(langSelected));
    }

    const langPack = lang[langSelected];

    return {
        type: LANG,
        resp: langPack
    }
}

export function changeLanguage(data) {

    AsyncStorage.setItem("lang", JSON.stringify(data));
    const langPack = lang[data];

    return {
        type: LANG,
        resp: langPack
    }
}
