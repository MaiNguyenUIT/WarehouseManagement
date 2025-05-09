import ExportRepository from "../repositories/ExportRepository";
import ExportDTO from "../dto/ExportDTO";

export default class ExportService {
    static async getAllExports() {
        const exports = await ExportRepository.fetchAllExports();
        return exports.map((exportData) => new ExportDTO(exportData));
    }
}
