import pdfParse from "pdf-parse/lib/pdf-parse.js";
import generateInterviewReport from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";
import { generateResumePDF } from "../services/resume.service.js";



// async function generateInterviewReportController(req, res) {
//     try {
//         const resumeContent = await (
//             new pdfParse.PDFParse(
//                 Uint8Array.from(req.file.buffer)
//             )
//         ).getText();

//         const { selfDescription, jobDescription } = req.body;

//         const interviewReportByAi = await generateInterviewReport({
//             resume: resumeContent.text,
//             selfDescription,
//             jobDescription,
//         });

//         console.log("AI RESPONSE:");
//         console.log(interviewReportByAi);

//         const interviewReport = await interviewReportModel.create({
//             user: req.user.id,
//             resume: resumeContent.text,
//             selfDescription,
//             jobDescription,
//             ...interviewReportByAi,
//         });

//         return res.status(201).json({
//             message: "Interview report generated successfully",
//             interviewReport,
//         });
//     } catch (error) {
//         console.error("INTERVIEW REPORT ERROR:", error);

//         if (error.status === 429) {
//             return res.status(429).json({
//                 message: "Gemini API quota exceeded. Please try again later.",
//             });
//         }

//         return res.status(500).json({
//             message: "Failed to generate interview report",
//             error: error.message,
//         });
//     }
// }


async function generateInterviewReportController(req, res) {
    try {
        console.log("---- /api/interview hit ----");
        console.log("file:", req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
        } : undefined);
        console.log("body:", req.body);
        console.log("user:", req.user);

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription?.trim()) {
            return res.status(400).json({ message: "Job description is required" });
        }

        if (!req.file || !selfDescription?.trim()) {
            return res.status(400).json({
                message: "A resume and a self description are required",
            });
        }

        let resumeText = "";
        if (req.file) {
            const resumeContent = await pdfParse(req.file.buffer);
            resumeText = resumeContent.text;
            console.log("Resume text length:", resumeText.length);
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription,
        });

        console.log("AI RESPONSE:", interviewReportByAi);

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interviewReportByAi,
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport,
        });
    } catch (error) {
        console.error("INTERVIEW REPORT ERROR:", error);

        if (error.status === 429) {
            return res.status(429).json({
                message: "Gemini API quota exceeded. Please try again later.",
            });
        }

        return res.status(500).json({
            message: "Failed to generate interview report",
            error: error.message,
        });
    }
}

async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id,
    });

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found.",
        });
    }

    return res.status(200).json({
        message: "Interview report found successfully",
        interviewReport,
    });
}

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select(
            "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
        );

    return res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports,
    });
}

async function generateResumePDFController(req, res) {
    try {
        const { jobDescription, selfDescription, userName } = req.body;

        if (
            typeof jobDescription !== "string" ||
            typeof selfDescription !== "string" ||
            !jobDescription.trim() ||
            !selfDescription.trim()
        ) {
            return res.status(400).json({
                message: "Job description and self description are required",
            });
        }

        const pdfBuffer = await generateResumePDF(
            jobDescription.trim(),
            selfDescription.trim(),
            userName || req.user.username
        );

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="tailored-resume-${Date.now()}.pdf"`
        );

        return res.status(200).send(pdfBuffer);
    } catch (error) {
        console.error("RESUME PDF GENERATION ERROR:", error);

        return res.status(500).json({
            message: "Failed to generate resume PDF",
            error: error.message,
        });
    }
}

export {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePDFController,
};
