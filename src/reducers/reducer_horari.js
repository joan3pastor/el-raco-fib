import { HORARI } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case HORARI:
      return action.resp.data;
    default:
      return state;
  }
}
