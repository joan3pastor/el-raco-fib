import { NOTES } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case NOTES:
      return action.resp;
    default:
      return state;
  }
}
