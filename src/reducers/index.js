import { combineReducers } from "redux";
import reducer_token from "./reducer_token";
import reducer_code from "./reducer_code";
import reducer_code_error from "./reducer_code_error";
import reducer_has_connexion from './reducer_has_connexion';
import reducer_avisos from './reducer_avisos';
import reducer_horari from './reducer_horari';
import reducer_horari_modificat from './reducer_horari_modificat';
import reducer_assig from './reducer_assig';
import reducer_noticies from './reducer_noticies';
import reducer_imglabs from "./reducer_imglabs";
import reducer_storage_avisos from "./reducer_storage_avisos";
import reducer_examens from './reducer_examens';
import reducer_events from './reducer_events';
import reducer_practiques from './reducer_practiques';
import reducer_settings from './reducer_settings';
import reducer_notes from './reducer_notes';
import reducer_lang from "./reducer_lang";

const rootReducer = combineReducers({
  token: reducer_token,
  code: reducer_code, //No siempre está. Solo tiene valor si entra por primera vez. Para conseguir codigo -> SyncStorage
  code_error: reducer_code_error,
  hasConnexion: reducer_has_connexion,
  settings: reducer_settings,

  avisos: reducer_avisos,
  storageAvisos: reducer_storage_avisos,
  horari: reducer_horari,
  horari_modificat: reducer_horari_modificat,
  assig: reducer_assig,
  noticies: reducer_noticies,
  imglabs: reducer_imglabs,

  examens: reducer_examens,
  events: reducer_events,
  practiques: reducer_practiques,

  notes: reducer_notes,

  lang: reducer_lang,
  
});

export default rootReducer;

