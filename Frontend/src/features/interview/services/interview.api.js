import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || " https://genai-backend-api.onrender.com",
    withCredentials: true,
})

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

  // Create a blob URL and trigger download
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
