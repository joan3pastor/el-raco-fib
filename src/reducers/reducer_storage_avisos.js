import { STORAGEAVISOS } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case STORAGEAVISOS:
      return action.payload;
    default:
      return state;
  }
}
