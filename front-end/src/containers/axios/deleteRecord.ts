import axios from "./ApiAxios";



export const deleteRecord = async (id:number) => {
  try {
    await axios.delete(`/records/${id}`);
    return null
  } catch (error: any) {
  
    return error
  }
};
