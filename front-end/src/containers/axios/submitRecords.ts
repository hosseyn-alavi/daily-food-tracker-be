import axios from "./ApiAxios";
import { FoodDetailsRecord } from "../pages/MainForm";
import { getCurrentDate } from "../../utils/dateFormat";

export const submitRecords = async (arg: FoodDetailsRecord) => {
  try {
    const response = await axios.post(`/records/${getCurrentDate()}`, arg);
    return response;
  } catch (error) {
    return null;
  }
};
