import API from "./axios-client";

//Auth-apis;

export const loginMutationFn = async (data) => {
  const response = await API.post("/user/login", data);
  return response.data;
};

export const registerMutationFn = async (data) => {
  const response = await API.post("/user/register", data);
  return response.data;
};

export const logoutMutationFn = async () => {
  const response = await API.post("/user/logout");
  return response.data;
};

export const refreshTokenFn = async () => {
  const response = await API.post("/user/refresh-token");
  return response.data;
};

export const getCurrentUserQueryFn = async () => {
  const response = await API.get("/user/current-user");
  return response.data;
};

// Product APIs
export const getProductsQueryFn = async () => {
  const response = await API.get("/products");
  return response.data;
};

export const getProductByIdQueryFn = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const createProductMutationFn = async (data) => {
  const response = await API.post("/products", data);
  return response.data;
};

export const updateProductMutationFn = async ({ id, data }) => {
  const response = await API.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProductMutationFn = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};

export const syncProductsMutationFn = async () => {
  const response = await API.post("/products/sync");
  return response.data;
};

// Site APIs
export const sendEnquiryMutationFn = async (data) => {
  const response = await API.post("/enquiry", data);
  return response.data;
};