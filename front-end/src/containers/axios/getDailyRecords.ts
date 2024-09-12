import { getCurrentDate } from "../../utils/dateFormat";
import { FoodDetailsRecord } from "../pages/MainForm";
import axios from "./ApiAxios";

export interface GetRecordResponse{
  records:FoodDetailsRecord[],
  dailyGoal?:number
}


export const getDailyRecords = async (date?:Date) => {
  try {
    const response = await axios.get<GetRecordResponse>(`/records/${getCurrentDate(date)}`);

    return response.data ?? {records:[] , dailyGoal: 0};
  } catch (error) {
    return {records:[] , dailyGoal: 0};
  }
};
