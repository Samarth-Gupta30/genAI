
import express from "express";
import * as authMiddleware from "../middlewares/auth.middleware.js";
import * as interviewController from "../controllers/interview.controller.js";
import upload from "../middlewares/file.middleware.js";

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description Generate a new interview report based on the user's
 * self-description, resume PDF, and job description.
 * @access Private
 */
interviewRouter.post(
    "/",
    authMiddleware.authUser,
    upload.single("resume"),
    interviewController.generateInterviewReportController
);

interviewRouter.post(
    "/generate-resume",
    authMiddleware.authUser,
    interviewController.generateResumePDFController
);

interviewRouter.get(
    "/report/:interviewId",
    authMiddleware.authUser,
    interviewController.getInterviewReportByIdController
);

interviewRouter.get(
    "/",
    authMiddleware.authUser,
    interviewController.getAllInterviewReportsController
);

export default interviewRouter;
