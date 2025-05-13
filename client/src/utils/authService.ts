export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  console.log(localStorage.getItem("token"));
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};
