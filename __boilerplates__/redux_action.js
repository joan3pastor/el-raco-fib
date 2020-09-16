// Those lines should be added inside "src/actions/index.js"

export const ACTION_NAME = 'ACTION_NAME';

export function actionToRedux(arg1, arg2) {

    // Perform action middleweres if needed
    // Examples: 
    //   - Parse data
    //   - Save to AsyncStorage
    //   - Request a resource

    let data = {atr1: "data"};

    // Feeding data to reducers
    return {
        type: ACTION_NAME, // Reducers with type <ACTION_NAME> will collect the new data
        resp: data, // <data> will be fetched into selected reducers
    }
}