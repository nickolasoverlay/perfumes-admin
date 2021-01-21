import * as actions from "./../actions";

const initialState = {
  hasFetchedSession: false,
  isLoggedIn: false,
  name: "",
  login: "",
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOG_IN:
      console.log("LOG_IN", action.payload);
      return {
        ...state,
        isLoggedIn: true,
        hasFetchedSession: true,
        name: action.payload.name,
        login: action.payload.login,
      };

    case actions.FAIL_TO_LOG_IN:
      return {
        ...state,
        hasFetchedSession: true,
      };

    case actions.LOG_OUT:
      return {
        ...state,
        ...initialState,
        isLoggedIn: false,
        hasFetchedSession: true,
      };
    default:
      return state;
  }
};
