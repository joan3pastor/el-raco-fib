import { ASSIG } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case ASSIG:
      return action.resp.data;
    default:
      return state;
  }
}
