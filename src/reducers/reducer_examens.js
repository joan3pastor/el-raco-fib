import { EXAMENS } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case EXAMENS:
      return action.resp;
    default:
      return state;
  }
}
