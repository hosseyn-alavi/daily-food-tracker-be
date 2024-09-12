
import axios from "./ApiAxios";

export interface FoodDetails {
  id?: number;
  name: string;
  caloriesPer100g?: number ;
  defaultWeight?: number ;
}


export const getFoodsList = async () => {
  try {
    const response = await axios.get<FoodDetails[]>("/foods");
    return response.data ?? [];
  } catch (error: any) {}
};
