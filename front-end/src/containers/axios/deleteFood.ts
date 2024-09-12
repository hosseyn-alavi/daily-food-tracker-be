
import axios from "./ApiAxios";



export const deleteFood = async (id:number) => {
  try {
    await axios.delete(`/foods/${id}`);
    return null
  } catch (error: any) {
  
    return error
  }
};
