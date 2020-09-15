import { LANG } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case LANG:
      return action.resp;
    default:
      return state;
  }
}
