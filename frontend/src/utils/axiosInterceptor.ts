import axios from 'axios';

export const setupAxiosInterceptors = (logoutFn: () => void) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logoutFn();
        window.location.href = '/sign-in';
      }
      return Promise.reject(error);
    }
  );
};