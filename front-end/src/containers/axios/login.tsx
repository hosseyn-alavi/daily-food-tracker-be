import axios from "./ApiAxios";
import { Inputs } from "../pages/LoginForm";

export const login = async (arg: Inputs) => {
  try {
    const response = await axios.post("/login", {
      username: arg.username.toLowerCase(),
      password: arg.password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    return error;
  }
};
