import { HTTP_STATUS } from "../constants/http-status.constant.js";
export class ResumesController {
  constructor(resumesService) {
    this.resumesService = resumesService;
  }

  createResume = async (req, res, next) => {
    try {
      const { id } = req.user;
      const resumerData = req.body;
      const result = await this.resumesService.createResume(id, resumerData);
      return res.status(HTTP_STATUS.OK).json({ data: result });
    } catch (error) {
      next(error);
    }
  };

  getResumes = async (req, res, next) => {
    try {
      const { id, role } = req.user;
      const query = req.query;
      const resumes = await this.resumesService.getResumes(id, role, query);
      return res.status(HTTP_STATUS.OK).json({ data: resumes });
    } catch (error) {
      next(error);
    }
  };

  getResumeById = async (req, res, next) => {
    try {
      const { id, role } = req.user;
      const { resumeId } = req.params;
      const resume = await this.resumesService.getResumeById(id, role, resumeId);
      return res.status(HTTP_STATUS.OK).json({ data: resume });
    } catch (error) {
      next(error);
    }
  };

  updateResume = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { title, content } = req.body;
      const { resumeId } = req.params;
      const updatedResume = await this.resumesService.updateResume(id, resumeId, title, content);
      return res.status(HTTP_STATUS.OK).json({ data: updatedResume });
    } catch (error) {
      next(error);
    }
  };

  deleteResume = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { resumeId } = req.params;
      const deletedResumeId = await this.resumesService.deleteResume(id, resumeId);
      return res.status(HTTP_STATUS.OK).json({ data: deletedResumeId });
    } catch (error) {
      next(error);
    }
  };

  createResumeLog = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const data = req.body;
      const { resumeId } = req.params;
      const result = await this.resumesService.createResumeLog(userId, resumeId, data);
      return res.status(HTTP_STATUS.OK).json({ data: result });
    } catch (error) {
      next(error);
    }
  };

  getResumeLogs = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      const logs = await this.resumesService.getResumeLogs(resumeId);
      return res.status(HTTP_STATUS.OK).json({ data: logs });
    } catch (error) {
      next(error);
    }
  };
}
