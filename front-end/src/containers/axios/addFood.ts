
import axios from "./ApiAxios";
import { FoodDetails } from "./getFoodsList";


export const addFood = async (arg: FoodDetails) => {
  try {
    await axios.post("/foods", {
      name: arg.name,
      caloriesPer100g: arg.caloriesPer100g,
      defaultWeight: arg.defaultWeight 
    });
    return null
  } catch (error: any) {
 
    return error
  }
};
