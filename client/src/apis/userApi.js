import axios from "axios";

//login user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post("/api/v1/users/login", {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error("Error logging in:", err.response?.data || err.message);
    throw err;
  }
};
//registr user
export const registerUser = async (formData, role) => {
  try {
    const cleanData = { ...formData, role };
    if (role === "hospital") delete cleanData.bloodGroup;

    const res = await axios.post("/api/v1/users/signup", cleanData);
    return res.data; // contains .status === "success"
  } catch (err) {
    throw err; // Let handleSubmit deal with it
  }
};

// fetch current user
export const fetchCurrentUser = async () => {
  try {
    const res = await axios.get("/api/v1/users/");
    return res.data;
  } catch (err) {
    console.error("Error fetching current user:", err.message);
  }
};

// update user
export const updateUser = async (formData) => {
  try {
    console.log(formData);
    const response = await axios.patch("/api/v1/users/updateUser", formData);
    return response.data;
  } catch (err) {
    console.error("Error updating user:", err.message);
  }
};

// logout user
export const logoutUser = async () => {
  try {
    const response = await axios.get("/api/v1/users/logout");
    return response.data;
  } catch (err) {
    console.error("Error logging out:", err.message);
  }
};
