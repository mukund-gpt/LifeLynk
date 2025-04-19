import axios from "axios";

//login user
export const loginUser = async (email, password) => {
  const response = await axios.post("/api/v1/users/login", {
    email,
    password,
  });
  return response.data;
};

//registr user
export const registerUser = async (formData, role) => {
  const cleanData = { ...formData, role };
  if (role === "hospital") delete cleanData.bloodGroup;

  const response = await axios.post("/api/v1/users/signup", cleanData);
  return response.data;
};

//fetch current user 
export const fetchCurrentUser = async () => {
  const res = await axios.get("/api/v1/users/");
  return res.data;
};

export const updateUser = async (formData) => {
  console.log(formData);
    const response = await axios.patch("/api/v1/users/updateUser", formData);
    return response.data;
}





