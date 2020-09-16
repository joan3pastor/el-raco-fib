import { HAS_CONNEXION } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case HAS_CONNEXION:
      return action.payload;
    default:
      return state;
  }
}
