import { ResumesService } from '../services/resume.service.js';

export class ResumesController {
  constructor() {
    this.resumesService = new ResumesService();
  }

  createResume = async (req, res, next) => {
    try {
      const { id } = req.user;
      const resumerData = req.body;
      const result = await this.resumesService.createResume(id, resumerData);
      return res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  };

  getResumes = async (req, res, next) => {
    try {
      const { id, role } = req.user;
      const query = req.query;
      const resumes = await this.resumesService.getResumes(id, role, query);
      return res.status(200).json({ data: resumes });
    } catch (error) {
      next(error);
    }
  };

  getResumeById = async (req, res, next) => {
    try {
      const { id, role } = req.user;
      const { resumeId } = req.params;
      const resume = await this.resumesService.getResumeById(id, role, resumeId);
      return res.status(200).json({ data: resume });
    } catch (error) {
      next(error);
    }
  };

  updateResume = async (req, res, next) => {
    try {
      const data = req.body;
      const { id } = req.user;
      const { resumeId } = req.params;
      const updatedResume = await this.resumesService.updateResume(id, resumeId, data);
      return res.status(200).json({ data: updatedResume });
    } catch (error) {
      next(error);
    }
  };

  deleteResume = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { resumeId } = req.params;
      const deletedResumeId = await this.resumesService.deleteResume(id, resumeId);
      return res.status(200).json({ data: deletedResumeId });
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
      return res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  };

  getResumeLogs = async (req, res, next) => {
    try {
      const { resumeId } = req.params;
      const logs = await this.resumesService.getResumeLogs(resumeId);
      return res.status(200).json({ data: logs });
    } catch (error) {
      next(error);
    }
  };
}
