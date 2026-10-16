import axios from "axios";

// Unified Axios Instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://genai-backend-api.onrender.com",
    withCredentials: true,
});

// Interceptor to attach Bearer token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

export async function register({ username, email, password }) {
    const response = await api.post("/api/auth/register", {
        username,
        email,
        password,
    });
    return response.data;
}

export async function login({ email, password }) {
    const response = await api.post("/api/auth/login", {
        email,
        password,
    });
    // Save token if returning token in payload
    if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
}

export async function logout() {
    localStorage.removeItem("token");
    const response = await api.post("/api/auth/logout");
    return response.data;
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me");
    return response.data;
}

// ==========================================
// INTERVIEW & GENERATIVE AI ENDPOINTS
// ==========================================

export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile
}) => {
    const formData = new FormData();
    if (jobDescription) formData.append("jobDescription", jobDescription);
    if (selfDescription) formData.append("selfDescription", selfDescription);
    if (resumeFile) formData.append("resume", resumeFile);

    const response = await api.post("/api/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
};

export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/");
    return response.data;
};

export const generateTailoredResume = async (jobDescription, selfDescription, userName) => {
    const response = await api.post(
        "/api/interview/generate-resume",
        {
            jobDescription,
            selfDescription,
            userName
        },
        {
            responseType: 'blob'
        }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tailored-resume-${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return response.data;
};

export default api;
