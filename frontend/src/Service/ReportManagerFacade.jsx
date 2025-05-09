// ReportManagerFacade.js
import ApiService from "./ApiService"; // Adjust the import path as needed

class ReportManagerFacade {
  // Fetch reports based on user role
  static async fetchReportsByRole(role) {
    try {
      const reports = role === "ROLE_ADMIN"
        ? await ApiService.getAllReport()
        : await ApiService.getAllReportOrStaff();
      return reports;
    } catch (error) {
      throw new Error(`Failed to fetch reports: ${error.message}`);
    }
  }

  // Add a report and fetch updated reports
  static async addAndListReports(reportData, role) {
    try {
      const addResponse = await ApiService.addReport(reportData);
      const updatedReports = await this.fetchReportsByRole(role);
      return { addResponse, updatedReports };
    } catch (error) {
      throw new Error(`Failed to add and list reports: ${error.message}`);
    }
  }
}

export default ReportManagerFacade;