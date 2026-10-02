const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// MATCHES DOCUMENTATION: Raw JSON Schema structure instead of Zod
const interviewReportSchema = {
    type: "OBJECT",
    properties: {
        title: {
            type: "STRING",
            description: "The title of the job for which the interview report is generated"
        },
        matchScore: {
            type: "INTEGER",
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        },
        technicalQuestions: {
            type: "ARRAY",
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The technical question that can be asked in the interview" },
                    intention: { type: "STRING", description: "The intention of the interviewer behind asking this question" },
                    answer: { type: "STRING", description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "ARRAY",
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The behavioral question that can be asked in the interview" },
                    intention: { type: "STRING", description: "The intention of the interviewer behind asking this question" },
                    answer: { type: "STRING", description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "ARRAY",
            description: "List of skill gaps in the candidate's profile along with their severity",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING", description: "The skill which the candidate is lacking" },
                    severity: { 
                        type: "STRING", 
                        enum: ["low", "medium", "high"],
                        description: "The severity of this skill gap, i.e. how important is this skill for the job" 
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "ARRAY",
            description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER", description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: "STRING", description: "The main focus of this day in the preparation plan" },
                    tasks: { 
                        type: "ARRAY", 
                        items: { type: "STRING" },
                        description: "List of tasks to be done on this day" 
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}`

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite", // Replaced your preview model with the recommended stable flash model
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema // Passing the clean JSON schema object directly
        }
    })




//const jsonContent = JSON.parse(response.text)
//const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
//return pdfBuffer

const reportData = JSON.parse(response.text);

    console.log("AI REPORT DATA:");
    console.log(JSON.stringify(reportData, null, 2));

    return reportData;

}

module.exports = generateInterviewReport

