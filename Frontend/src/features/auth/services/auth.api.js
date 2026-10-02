import axios from "axios";

// Unified Axios Instance (Fixes whitespace URL bug and duplicate declarations)
const api = axios.create({
    baseURL: (import.meta.env.VITE_API_BASE_URL || "https://genai-backend-api.onrender.com").trim(),
    withCredentials: true,
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// REGISTER USER
export async function register({ username, email, password }) {
    const response = await api.post("/api/auth/register", {
        username,
        email,
        password,
    });
    return response.data;
}

// LOGIN USER
export async function login({ email, password }) {
    const response = await api.post("/api/auth/login", {
        email,
        password,
    });
    return response.data;
}

// LOGOUT USER
export async function logout() {
    const response = await api.post("/api/auth/logout");
    return response.data;
}

// GET LOGGED-IN USER
export async function getMe() {
    const response = await api.get("/api/auth/get-me");
    return response.data;
}

// ==========================================
// INTERVIEW & GENERATIVE AI ENDPOINTS
// ==========================================

// GENERATE INTERVIEW REPORT
export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile
}) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const response = await api.post("/api/interview", formData);
    return response.data;
};

// GET INTERVIEW REPORT BY ID
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
};

// GET ALL INTERVIEW REPORTS
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/");
    return response.data;
};

// GENERATE TAILORED RESUME (PDF BLOB)
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

    // Create a blob URL and trigger file download
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