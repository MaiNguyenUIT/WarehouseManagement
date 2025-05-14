import ReportDTO from "../dto/ReportDTO";

export default class ReportTransfer {
    static toDTO(report) {
        return new ReportDTO({
            id: report.id,
            title: report.title,
            description: report.description,
            createdAt: report.createdAt,
            status: report.status,
            reportPriority: report.reportPriority,
            userName: report.userName,
        });
    }

    static toEntity(reportDTO) {
        return {
            id: reportDTO.id,
            title: reportDTO.title,
            description: reportDTO.description,
            createdAt: reportDTO.createdAt,
            status: reportDTO.status,
        };
    }
}
