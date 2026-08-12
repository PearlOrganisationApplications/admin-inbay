import axios from "axios";

const api = axios.create({
  baseURL: "https://test.pearl-developer.com/Inbay_Innovations/public/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired / unauthorized
        localStorage.removeItem("token");

        // Optional: redirect to login
        window.location.href = "/login";
      }

      if (error.response.status === 403) {
        console.error("Access denied");
      }

      if (error.response.status === 500) {
        console.error("Server error");
      }
    } else if (error.request) {
      console.error("No response received from server");
    } else {
      console.error("Axios error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;