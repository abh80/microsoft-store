import axios from "axios";
export const get = async (url: string):Promise<any> => {
  const { data: res } = await axios.get(url);
  return res;
};
