import { PRACTIQUES } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case PRACTIQUES:
      return action.resp;
    default:
      return state;
  }
}
