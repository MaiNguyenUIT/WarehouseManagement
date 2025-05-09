import ReportDTO from "../dto/ReportDTO";

export default class ReportTransfer {
    static toDTO(report) {
        return new ReportDTO(report);
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
