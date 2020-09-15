// This file should be created at the following path: "src/reducers/"

import { ACTION_REPLACE, ACTION_ADD, ACTION_DELETE, /* ... */ } from "../actions";

// Each reducer treats the data from a single key of the redux store.
export default function(state = {}, action) {

  switch (action.type) {

    case ACTION_REPLACE:
      return action.resp; // Replaces value of the redux key for the action payload

    case ACTION_ADD:
        return {...state, ...action.resp}; // Adds new entries in the redux key

    case ACTION_DELETE:
        return {}; // Deletes de contents of this redux key

    default:
      return state; // Never return a new object to replace <state> if no type matched
  }
}
