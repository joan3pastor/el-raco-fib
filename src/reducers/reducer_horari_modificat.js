import { HORARI_MODIFICAT } from "../actions";

export default function(state = {}, action) {
  switch (action.type) {
    case HORARI_MODIFICAT:
      return action.resp;
    default:
      return state;
  }
}
