import ReportRepository from "../repositories/ReportRepository";
import ReportDTO from "../dto/ReportDTO";

export default class ReportService {
    static async getAllReports() {
        const reports = await ReportRepository.fetchAllReports();
        return reports.map((report) => new ReportDTO(report));
    }
}
