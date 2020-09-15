import { NOTICIES } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case NOTICIES:
      return action.resp.data;
    default:
      return state;
  }
}
