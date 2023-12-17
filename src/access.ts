export default (initialState: InitialState) => {
  const canUser = !!initialState.loginUser;
  const canAdmin = initialState.loginUser && initialState.group && (initialState.group.permission === '*' || initialState.group.permission === 'group.account');
  return {
    canUser,
    canAdmin,
  };
};
