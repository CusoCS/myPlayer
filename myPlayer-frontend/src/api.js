import axios from 'axios';

// Create a custom Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

/**
 * Request Interceptor
 * This runs before each request is sent. We'll use it to automatically
 * attach the JWT access token to the Authorization header, *unless* it's a public route.
 */
api.interceptors.request.use(
    (config) => {
        // List of URLs that don't require authentication
        const publicUrls = [
            '/api/auth/login/',
            '/api/auth/google/',
            '/api/auth/registration/',
            '/api/auth/token/refresh/',
            '/api/auth/logout/'
        ];

        const token = localStorage.getItem('access_token');

        // Only add the token if the URL is not a public one
        if (token && !publicUrls.includes(config.url)) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


/**
 * Response Interceptor
 * This runs after a response is received. We'll use it to check for
 * 401 Unauthorized errors, which indicate an expired access token.
 */
api.interceptors.response.use(
    // If the response is successful, just return it
    (response) => {
        return response;
    },
    // If there's an error, handle it
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is a 401 and if we haven't retried this request yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark this request as having been retried

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                // Make a request to your refresh token endpoint
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/token/refresh/`, {
                    refresh: refreshToken,
                });
                
                const newAccessToken = response.data.access;
                
                // Store the new access token
                localStorage.setItem('access_token', newAccessToken);
                
                // Update the Authorization header for subsequent requests using our custom 'api' instance
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                
                // Update the header on the original request that failed
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                // Retry the original request with the new token
                return api(originalRequest);

            } catch (refreshError) {
                // If the refresh token is also invalid, log the user out
                console.error("Refresh token is invalid, logging out.", refreshError);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user'); // Also remove user data
                
                // Redirect to login page
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // For any other errors, just pass them along
        return Promise.reject(error);
    }
);

export default api;