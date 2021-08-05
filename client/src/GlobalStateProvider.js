import React, {useReducer} from 'react';
import reudcer from './reducer';

export const GlobalState = React.createContext();

const initState = {
  profileData: {},
  selectedBusinessUnit: {},

  isAuthenticate: false,
  isTSM: false,
  isSo: false,
};

const GlobalStateProvider = (props) => {
  const [state, dispatch] = useReducer(reudcer, initState);

  // Methods
  const saveUserData = (userData) =>
    dispatch({type: 'LOGIN_SUCCESSFUL', payload: {userData}});

  const value = {
    ...state,
    saveUserData,
  };
  return (
    <GlobalState.Provider value={value}>{props.children}</GlobalState.Provider>
  );
};

export default GlobalStateProvider;
