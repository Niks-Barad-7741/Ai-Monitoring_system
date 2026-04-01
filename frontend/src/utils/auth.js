// check if logged in
export const isLoggedIn = () => {
  return sessionStorage.getItem("token") !== null;
};

// get user role
export const getUserRole = () => {
  return sessionStorage.getItem("role");
};

// logout
export const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("email");
  window.location.href = "/";
};