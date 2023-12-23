export default (initialState: InitialState) => {
  const canUser = !!initialState.loginUser;
  // 有登录用户，且有权限*或group.admin
  const canAdmin = canUser && (initialState.loginUser?.group?.permission === 'group.admin' || initialState.loginUser?.group?.permission === '*');
  return {
    canUser,
    canAdmin,
  };
};
