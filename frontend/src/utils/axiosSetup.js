import axios from "axios";

// ==============================================
// 🔄 AXIOS INTERCEPTOR — Auto Refresh Token
// ==============================================
// This interceptor catches 401 errors, silently
// refreshes the access token using the refresh
// token, and retries the original request.
// The user never notices anything!
// ==============================================

let isRefreshing = false;
let failedQueue = [];

// Process the queue of failed requests after refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// 🔁 Response Interceptor
axios.interceptors.response.use(
  // ✅ Success — pass through
  (response) => response,

  // ❌ Error — check if 401
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 (unauthorized / expired token)
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't try to refresh if the failing request IS the refresh or login endpoint
    if (
      originalRequest.url === "/auth/refresh" ||
      originalRequest.url === "/auth/login" ||
      originalRequest.url === "/auth/register"
    ) {
      return Promise.reject(error);
    }

    // Don't retry if we already tried once
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // If another request is already refreshing, queue this one
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(originalRequest);
      });
    }

    // 🔄 Start refreshing
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = sessionStorage.getItem("refreshToken");

    // No refresh token stored — can't refresh, go to login
    if (!refreshToken) {
      isRefreshing = false;
      sessionStorage.clear();
      window.location.href = "/";
      return Promise.reject(error);
    }

    try {
      // Call the refresh endpoint
      const res = await axios.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const newAccessToken = res.data.token;

      // ✅ Save new access token
      sessionStorage.setItem("token", newAccessToken);

      // Process queued requests with new token
      processQueue(null, newAccessToken);

      // Retry the original request with new token
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axios(originalRequest);

    } catch (refreshError) {
      // ❌ Refresh failed — token is revoked or expired
      processQueue(refreshError, null);
      sessionStorage.clear();
      window.location.href = "/";
      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);
