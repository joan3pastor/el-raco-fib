import { AVISOS } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case AVISOS:
      return action.resp.data;
    default:
      return state;
  }
}
