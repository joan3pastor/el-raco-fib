import { GET_TOKEN, LOAD_TOKEN, DELETE_TOKEN } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {

    case GET_TOKEN:
      return action.resp;

    case LOAD_TOKEN:
      return action.resp;

    case DELETE_TOKEN:
      return action.resp;

    default:
      return state;
  }
}


// action.payload.response.data
// action.payload.response.status