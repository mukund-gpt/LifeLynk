import axios from "axios";

export const fetchRequirements = async () => {
  const res = await axios.get("/api/v1/requests");
  console.log(res);
  return res.data;
}
export const createRequirement = async (formData) => {
  const response = await axios.post("/api/v1/requests", formData);
  return response.data;
}
export const getAllOpenRequests = async () => {
  const response = await axios.get("/api/v1/requests/open");
  return response.data;
}
// export const updateRequirement = async (formData) => {      
//   const response = await axios.patch("/api/v1/requirements", formData);
//   return response.data;
// }

//update requirement status
export const updateRequestStatus = async (payload) => {
  const response = await axios.patch("/api/v1/requests/status", payload);
  return response.data;
};