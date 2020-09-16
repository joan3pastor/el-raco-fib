import { GET_CODE } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case GET_CODE:
      return action.payload.code;
    default:
      return state;
  }
}
