import React, { useEffect, useState } from "react";
import './Report.css';
import PrimarySearchAppBar from "../../Component/AppBar/AppBar";
import {
  Container, FormControl, InputLabel, Stack, Typography, TextField, Button,
  Modal, Fade, Box, Snackbar, Alert, Select, MenuItem
} from "@mui/material";
import TableReport from "../../Hooks/TableReport.jsx/TableReport";
import ReportManagerFacade from "../../Service/ReportManagerFacade"; // Adjust the import path

const style = {
  position: "absolute",
  top: "47%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Report = () => {
  const [reports, setReports] = useState([]);
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [newReportData, setNewReportData] = useState({
    title: "",
    description: "",
    reportPriority: "",
    createdAt: "",
  });

  // Fetch reports based on role
  const fetchReports = async () => {
    try {
      const response = await ReportManagerFacade.fetchReportsByRole(role);
      setReports(response);
    } catch (error) {
      console.error("Error fetching reports:", error.message);
      setSnackbarMessage("Error fetching reports");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Handle adding a new report
  const handleAddNewReport = async () => {
    try {
      const { addResponse, updatedReports } = await ReportManagerFacade.addAndListReports(newReportData, role);
      setReports(updatedReports);
      setSnackbarMessage("Report added successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseAddModal();
    } catch (error) {
      setSnackbarMessage(`Error adding report: ${error.message}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Open and close modal
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewReportData({
      title: "",
      description: "",
      reportPriority: "",
      createdAt: "",
    });
  };

  // Fetch reports on mount or when role changes
  useEffect(() => {
    if (role) {
      fetchReports();
    }
  }, [role]);

  return (
    <Container maxWidth="xl" className="Report">
      <PrimarySearchAppBar />
      <Stack
        className="shelf-bar"
        sx={{ backgroundColor: "#E2F1E7", padding: "1rem", borderRadius: "0.5rem" }}
      >
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography
            sx={{ fontWeight: "bold", fontSize: "20px", paddingLeft: "20px", width: "200px" }}
            variant="p"
          >
            Quản lý báo cáo
          </Typography>
          <Stack direction="row" spacing={2} sx={{ marginBottom: "10px"}}>
            <TextField
              placeholder="Tìm kiếm"
              variant="outlined"
              sx={{ width: "100%" }}
            />
            <Button
              sx={{
                backgroundColor: "#243642",
                width: "200px",
                color: "white",
                ":hover": { backgroundColor: "#1A2B36" },
              }}
              variant="contained"
              onClick={handleOpenAddModal}
            >
              Tạo báo cáo
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <TableReport valueReport={reports} />

      <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
        <Fade in={isAddModalOpen}>
          <Box sx={style}>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "20px", marginBottom: "1rem" }}
            >
              Tạo báo cáo mới
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Tên báo cáo"
                value={newReportData.title}
                onChange={(e) =>
                  setNewReportData({ ...newReportData, title: e.target.value })
                }
              />
              <TextField
                label="Nội dung"
                value={newReportData.description}
                onChange={(e) =>
                  setNewReportData({ ...newReportData, description: e.target.value })
                }
              />
              <FormControl fullWidth>
                <InputLabel id="report-priority-label">Mức ưu tiên</InputLabel>
                <Select
                  labelId="report-priority-label"
                  id="report-priority"
                  value={newReportData.reportPriority}
                  onChange={(e) =>
                    setNewReportData({ ...newReportData, reportPriority: e.target.value })
                  }
                >
                  <MenuItem value="LOW">LOW</MenuItem>
                  <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                  <MenuItem value="HIGH">HIGH</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Ngày tạo"
                value={newReportData.createdAt}
                onChange={(e) =>
                  setNewReportData({ ...newReportData, createdAt: e.target.value })
                }
              />
              <Button
                sx={{ backgroundColor: "#243642" }}
                variant="contained"
                onClick={handleAddNewReport}
              >
                Lưu
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Report;