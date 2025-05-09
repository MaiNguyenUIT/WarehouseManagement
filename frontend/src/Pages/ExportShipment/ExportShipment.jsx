
  import React, { useState, useEffect } from "react";
import {
  Container, Stack, Button, Typography, IconButton, Box, Table, TableBody,
  TableCell, TableHead, TableRow, Paper, TableContainer, TextField, TablePagination,
  Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { Add, Edit, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import ModalExport from "../../Hooks/ModalExport/ModalExport.jsx";
import ExportManagerFacade from "../../Service/ExportManagerFacade"; // Adjust the import path
import PrimarySearchAppBar from "../../Component/AppBar/AppBar.jsx";

const ExportShipment = () => {
  const [openModal, setOpenModal] = useState(false);
  const [exportShipments, setExportShipments] = useState([]);
  const [filteredExportShipments, setFilteredExportShipments] = useState([]);
  const [expandedShipmentId, setExpandedShipmentId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [expandedShipmentOrders, setExpandedShipmentOrders] = useState({});
  const [editingShipment, setEditingShipment] = useState(null);
  const [editingOrders, setEditingOrders] = useState([]);
  const [notification, setNotification] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchExportShipments = async () => {
    try {
      const shipments = await ExportManagerFacade.fetchShipments();
      setExportShipments(shipments);
      setFilteredExportShipments(shipments);
    } catch (error) {
      console.error("Error fetching shipments:", error.message);
      setExportShipments([]);
      setFilteredExportShipments([]);
      setNotification({ type: "error", message: "Failed to fetch shipments" });
    }
  };

  useEffect(() => {
    fetchExportShipments();
  }, []);

  const handleFilter = () => {
    if (!selectedDate) {
      setFilteredExportShipments(exportShipments);
      return;
    }

    const filtered = exportShipments.filter((shipment) => {
      const shipmentDate = new Date(shipment.createdAt).toLocaleDateString();
      const selectedDateFormatted = new Date(selectedDate).toLocaleDateString();
      return shipmentDate === selectedDateFormatted;
    });

    setFilteredExportShipments(filtered);
  };

  const handleOpenModal = (shipment = null) => {
    if (shipment) {
      setEditingShipment({ ...shipment });
      setEditingOrders(shipment.orders || []);
    } else {
      setEditingShipment(null);
      setEditingOrders([]);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingShipment(null);
    setEditingOrders([]);
  };

  const handleModalSubmit = async (shipmentData, isEditing) => {
    try {
      let result;
      if (isEditing) {
        result = await ExportManagerFacade.updateAndRefresh(editingShipment.id, shipmentData);
      } else {
        result = await ExportManagerFacade.addAndRefresh(shipmentData);
      }
      setExportShipments(result.updatedShipments);
      setFilteredExportShipments(result.updatedShipments);
      setNotification({ type: "success", message: isEditing ? "Shipment updated successfully!" : "Shipment added successfully!" });
      setOpenModal(false);
    } catch (error) {
      console.error("Error submitting shipment:", error.message);
      setNotification({ type: "error", message: `Failed to ${isEditing ? "update" : "add"} shipment` });
    }
  };

  const fetchOrderDetails = async (orderCode) => {
    try {
      const orderDetails = await ExportManagerFacade.fetchOrderDetails(orderCode);
      setExpandedShipmentOrders((prev) => ({
        ...prev,
        [orderCode]: orderDetails,
      }));
    } catch (error) {
      console.error("Error fetching order details:", error.message);
      setNotification({ type: "error", message: `Failed to fetch order details for ${orderCode}` });
    }
  };

  const handleDeleteShipment = (shipmentId) => {
    setShipmentToDelete(shipmentId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!shipmentToDelete) return;
    try {
      const { updatedShipments } = await ExportManagerFacade.deleteAndRefresh(shipmentToDelete);
      setExportShipments(updatedShipments);
      setFilteredExportShipments(updatedShipments);
      setNotification({ type: "success", message: "Shipment deleted successfully!" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting shipment:", error.message);
      setNotification({ type: "error", message: "Failed to delete shipment" });
      setOpenDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg">
      <PrimarySearchAppBar />
      <Stack
        className="order-bar"
        sx={{
          backgroundColor: "#E2F1E7",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginTop: 0,
        }}
      >
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Typography sx={{ fontWeight: "bold", fontSize: "20px", paddingLeft: "20px", flex: "1" }} variant="p">
            Quản lý Xuất Hàng
          </Typography>
          <Stack direction={"row"} alignItems={"center"} spacing={2} sx={{ flex: "2", justifyContent: "flex-end" }}>
            <TextField
              label="Chọn ngày"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
            />
            <Button
              onClick={handleFilter}
              sx={{ backgroundColor: "#243642", color: "white", textTransform: "none" }}
              variant="contained"
            >
              Lọc
            </Button>
            <Button
              onClick={() => handleOpenModal()}
              sx={{
                color: "white",
                height: "50px",
                backgroundColor: "#243642",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexShrink: 0,
              }}
              variant="contained"
            >
              <Add sx={{ color: "white" }} />
              Thêm Xuất Hàng
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>STT</TableCell>
              <TableCell sx={{ display: "none" }}>ID</TableCell>
              <TableCell>Địa chỉ xuất hàng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày cập nhật</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExportShipments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length > 0 ? (
              filteredExportShipments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((shipment, index) => (
                <React.Fragment key={shipment.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton onClick={() => setExpandedShipmentId(expandedShipmentId === shipment.id ? null : shipment.id)}>
                        {expandedShipmentId === shipment.id ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell sx={{ display: "none" }}>{shipment.id}</TableCell>
                    <TableCell>{shipment.export_address || "Chưa có địa chỉ"}</TableCell>
                    <TableCell>
                      {shipment.exportState === "PENDING" ? "Đang chờ" :
                       shipment.exportState === "ON_GOING" ? "Đang giao" :
                       shipment.exportState === "CONFIRMED" ? "Đã xác nhận" :
                       shipment.exportState || "Chưa có trạng thái"}
                    </TableCell>
                    <TableCell>{new Date(shipment.createdAt).toLocaleDateString("en-GB") || "Chưa có ngày tạo"}</TableCell>
                    <TableCell>
                      {shipment.updatedAt ? new Date(shipment.updatedAt).toLocaleDateString('en-GB') : "Chưa có ngày cập nhật"}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(shipment)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteShipment(shipment.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {expandedShipmentId === shipment.id && (
                    <TableRow key={`details-${shipment.id}`}>
                      <TableCell colSpan={8}>
                        <Box sx={{ padding: "1rem" }}>
                          <Typography sx={{ fontWeight: "bold", marginBottom: "1rem" }}>Đơn hàng liên quan:</Typography>
                          <TableContainer component={Paper} sx={{ marginBottom: "1rem" }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Order Code</TableCell>
                                  <TableCell>Địa chỉ</TableCell>
                                  <TableCell>Ngày tạo</TableCell>
                                  <TableCell>Tổng giá</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {shipment.orderCode?.length > 0 ? (
                                  shipment.orderCode.map((orderCode, index) => {
                                    if (!expandedShipmentOrders[orderCode]) {
                                      fetchOrderDetails(orderCode); // Fetch details if not already fetched
                                    }
                                    return (
                                      <TableRow key={index}>
                                        <TableCell>{orderCode}</TableCell>
                                        {expandedShipmentOrders[orderCode] ? (
                                          <>
                                            <TableCell>{expandedShipmentOrders[orderCode].delivery_Address}</TableCell>
                                            <TableCell>{new Date(expandedShipmentOrders[orderCode].created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                              {expandedShipmentOrders[orderCode].orderPrice || "Chưa có giá đơn hàng"}
                                            </TableCell>
                                          </>
                                        ) : (
                                          <TableCell colSpan={3}>Đang tải thông tin đơn hàng...</TableCell>
                                        )}
                                      </TableRow>
                                    );
                                  })
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={4} align="center">Không có đơn hàng liên quan</TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">Không có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn chắc chắn muốn xóa xuất hàng này?"}
        </DialogTitle>
        <DialogContent />
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredExportShipments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ModalExport
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        setNotification={setNotification}
        shipment={editingShipment}
        orders={editingOrders}
      />

      {notification && (
        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setNotification(null)} severity={notification.type}>
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default ExportShipment;