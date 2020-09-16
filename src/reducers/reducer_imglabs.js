import { IMGLABS } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case IMGLABS:
      return action.resp.data;
    default:
      return state;
  }
}
