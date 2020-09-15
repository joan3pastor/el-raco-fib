import { EVENTS } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case EVENTS:
      return action.resp;
    default:
      return state;
  }
}
