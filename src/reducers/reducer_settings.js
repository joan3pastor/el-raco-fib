import { SETTINGS } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case SETTINGS:
      return action.resp;
    default:
      return state;
  }
}
