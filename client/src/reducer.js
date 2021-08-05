function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESSFUL':
      return {
        ...state,
        ...action.payload.userData,
      };

    default:
      return state;
  }
}

export default reducer;
