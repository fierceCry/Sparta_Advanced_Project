import { ResumesService } from "../services/resume.service.js";
export class ResumesController {
  resumesService = new ResumesService();
  /** 이력서 목록 조회 API **/
  resumeGet = async (req, res, next) => {
    try {
      const { id, role } = req.user
      const resume = await this.resumesService.findAllResume(id, role, req.query);

      return res.status(200).json({ data: resume });
    } catch (error) {
      next(error);
    }
  };

  resumePost = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { title, content } = req.body;
      // 이력서 생성
      const result = await this.resumesService.createResume(
        id, title, content
      );
      return res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  };
}
