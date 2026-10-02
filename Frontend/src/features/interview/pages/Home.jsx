import {useState,useRef} from 'react'
import '../style/home.scss'
import {useInterview} from "../hooks/useInterview.js";
import { useAuth } from "../../auth/hooks/useAuth";
import Loader from '../../../components/Loader';
import {useNavigate} from "react-router";
import { generateTailoredResume } from '../services/interview.api';
const Home = () => {

const {loading,generateReport} = useInterview()
const { handleLogout } = useAuth()
const [jobDescription,setJobDescription] = useState("")
const [selfDescription,setSelfDescription] = useState("")
const resumeInputRef = useRef()
const [loggingOut, setLoggingOut] = useState(false);
const [isGenerating, setIsGenerating] = useState(false);
const [selectedFileName, setSelectedFileName] = useState("");
const [isDownloadingResume, setIsDownloadingResume] = useState(false);

const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
        setSelectedFileName(file.name);
    }
};

const navigate = useNavigate();

const handleGenerateReport = async () => {
        if (isGenerating) return;

        setIsGenerating(true);

        try { 
            const resumeFile = resumeInputRef.current?.files?.[0]
            const report = await generateReport({ jobDescription, selfDescription, resumeFile })

            const reportId = report?._id || report?.id

            if (reportId) {
                navigate(`/interview/${reportId}`)
            }
        } finally {
            setIsGenerating(false);
        }
    };

  const handleDownloadResumeOnly = async () => {
    if (!jobDescription || !selfDescription) {
      alert('Please fill in both Job Description and Self Description to download your tailored resume.');
      return;
    }

    try {
      setIsDownloadingResume(true);
      await generateTailoredResume(jobDescription, selfDescription, 'Candidate');
    } catch (error) {
      console.error('Failed to download resume:', error);
      alert('Failed to download resume. Please try again.');
    } finally {
      setIsDownloadingResume(false);
    }
  };

  const handleUserLogout = async () => {
    setLoggingOut(true);

    const success = await handleLogout();

    if (success) {
        navigate('/login');
    } else {
        setLoggingOut(false);
    }
};

if(loading) return (<main><Loader /></main>)


    return (
        <main className="home-page">
            <section className="interview-shell">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                  <button
    type="button"
    className={`button primary-button logout-button ${
        loggingOut ? "logging-out" : ""
    }`}
    onClick={handleUserLogout}
    disabled={loggingOut}
>
    <span className="logout-icon">→</span>
    <span>{loggingOut ? "Logging out..." : "Logout"}</span>
</button> 
                </div>

                <h1>
                    Create Your Custom <span>Interview Plan</span>
                </h1>

                <p className="subtitle">
                    Let AI analyze your target role, your profile, and your interview
                    strengths to build a personalized strategy.
                </p>

                <div className="interview-board">
                    <div className="job-card">
                        <div className="card-header">
                            <span className="card-title">Target Job Description</span>
                            <span className="ai-pill">AI</span>
                        </div>

                        <textarea
                            onChange={(e) => setJobDescription(e.target.value)}
                            id="jobDescription"
                            name="jobDescription"
                            placeholder="Paste the full job description here...\n\n e.g. 'Senior Frontend Engineer at Google requires\n proficiency in React, TypeScript, and large-scale system\n design.'"
                        />
                    </div>

                    <div className="profile-card">
                        <div className="card-header profile-header">
                            <span className="profile-dot" />
                            <span className="card-title">Your Profile</span>
                        </div>

                        <div className="profile-field">
                            <label className="field-label">Resume</label>
                            <div className="upload-box">
                                <input
                                    className="file-input"
                                    type="file"
                                    name="resume"
                                    id="resume"
                                    accept=".pdf,.doc,.docx"
                                    ref={resumeInputRef}
                                    onChange={handleFileSelect}
                                />
                                <label htmlFor="resume" className={`upload-label ${selectedFileName ? 'file-selected' : ''}`}>
                                    {selectedFileName ? (
                                        <>
                                            <div className="checkmark-icon">✓</div>
                                            <div className="upload-text selected-text">{selectedFileName}</div>
                                            <small>Click to change file</small>
                                        </>
                                    ) : (
                                        <>
                                            <div className="upload-icon" aria-hidden="true"></div>
                                            <div className="upload-text">
                                                Click to upload or drag &amp; drop
                                            </div>
                                            <small>PDF or DOCX (Max 5MB)</small>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="divider">OR</div>

                        <div className="profile-field">
                            <label className="field-label">Quick Self-Description</label>
                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id="selfDescription"
                                name="selfDescription"
                                placeholder="Briefly describe your experience, key skills, and years of experience you don't have a resume handy."
                            />
                        </div>

                        <div className="require-note">
                            <span className="note-icon">i</span>
                            Either a Resume or a Self Description is required to generate a personalized plan.
                        </div>

                        <button
                            onClick={handleGenerateReport}
                            type="button"
                            className={`primary-button generate-button ${isGenerating ? 'generate-button--active' : ''}`}
                            aria-busy={isGenerating}
                        >
                            <span className="sparkle">✦</span>
                            {isGenerating ? 'Generating...' : 'Generate My Interview Strategy'}
                        </button>

                        <button
                            onClick={handleDownloadResumeOnly}
                            type="button"
                            className={`secondary-button download-resume-button ${isDownloadingResume ? 'downloading' : ''}`}
                            disabled={isDownloadingResume}
                        >
                            <span className="download-icon">📄</span>
                            {isDownloadingResume ? 'Generating Resume...' : 'Download Tailored Resume'}
                        </button>
                    </div>
                </div>

                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Help Center</a>
                </div>
            </section>
        </main>
    )
}

export default Home
