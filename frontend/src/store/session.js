import { csrfFetch } from "./csrf";

const SET_CURRENT_USER = "session/SET_CURRENT_USER";
const REMOVE_CURRENT_USER = "session/REMOVE_CURRENT_USER";

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user,
  };
}

export function removeCurrentUser() {
  return {
    type: REMOVE_CURRENT_USER,
  };
}

const initialState = {
  user: JSON.parse(sessionStorage.getItem("currentUser")),
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        user: action.user,
      };
    case REMOVE_CURRENT_USER:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export const login =
  ({ credentials, password }) =>
  async (dispatch) => {
    const response = await csrfFetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credentials, password }),
    });

    if (response.ok) {
      const data = await response.json();
      storeCurrentUser(data.user);
      dispatch(setCurrentUser(data.user));
      return response;
    }
  };

export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  if (response.ok) {
    const data = await response.json();
    storeCurrentUser(null);
    dispatch(removeCurrentUser());
    return data;
  }
};

export const signup =
  ({ username, email, password }) =>
  async (dispatch) => {
    const response = await csrfFetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: `{"user": ${JSON.stringify({ username, email, password })}}`,
    });
    if (response.ok) {
      const data = await response.json();
      storeCurrentUser(data.user);
      dispatch(setCurrentUser(data.user));
      return response;
    }
  };

export const restoreSession = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  storeCSRFToken(response);
  const data = await response.json();
  storeCurrentUser(data.user);
  dispatch(setCurrentUser(data.user));
  return response;
};

const storeCSRFToken = (response) => {
  const csrfToken = response.headers.get("X-CSRF-Token");
  if (csrfToken) sessionStorage.setItem("X-CSRF-Token", csrfToken);
};

const storeCurrentUser = (user) => {
  if (user) sessionStorage.setItem("currentUser", JSON.stringify(user));
  else sessionStorage.removeItem("currentUser");
};

export default sessionReducer;
