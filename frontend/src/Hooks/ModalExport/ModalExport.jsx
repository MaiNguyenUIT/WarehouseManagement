import React, { useState, useEffect } from "react";
import {
  Modal,
  Fade,
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from "@mui/material";
import ExportManagerFacade from "../../Service/ExportManagerFacade"; // Adjust the import path

const ModalExport = ({ open, onClose, onSubmit, shipment, setNotification }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [exportAddress, setExportAddress] = useState("");
  const [exportState, setExportState] = useState("PENDING");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    // Fetch available orders
    const fetchOrders = async () => {
      try {
        const data = await ExportManagerFacade.fetchAvailableOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
        setSnackbarMessage("Failed to fetch orders");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    fetchOrders();

    if (shipment) {
      setExportAddress(shipment.export_address || "");
      setExportState(shipment.exportState || "PENDING");
      setSelectedOrderIds(shipment.orderCode || []);
    } else {
      setSelectedOrders([]);
      setExportAddress("");
      setExportState("PENDING");
    }
  }, [shipment]);

  useEffect(() => {
    // Fetch details for selected orders
    const fetchSelectedOrderDetails = async () => {
      if (selectedOrderIds.length === 0) {
        setSelectedOrders([]);
        return;
      }

      try {
        const orderDetails = await ExportManagerFacade.fetchOrderDetailsByCodes(selectedOrderIds);
        setSelectedOrders(orderDetails);
      } catch (error) {
        console.error("Error fetching order details:", error.message);
        setSnackbarMessage("Failed to fetch order details");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    fetchSelectedOrderDetails();
  }, [selectedOrderIds]);

  const handleAddOrder = (orderCode) => {
    if (!selectedOrderIds.includes(orderCode)) {
      setSelectedOrderIds((prev) => [...prev, orderCode]);
      const orderToAdd = orders.find((order) => order.orderCode === orderCode);
      if (orderToAdd) {
        setSelectedOrders((prev) => [...prev, orderToAdd]);
      }
      setOrders((prev) => prev.filter((order) => order.orderCode !== orderCode));
    }
  };

  const handleRemoveOrder = async (orderCode) => {
    try {
      const removedOrder = await ExportManagerFacade.removeOrderFromShipment(orderCode);
      setSelectedOrders((prev) => prev.filter((order) => order.orderCode !== orderCode));
      setSelectedOrderIds((prev) => prev.filter((code) => code !== orderCode));
      if (removedOrder) {
        setOrders((prev) => [...prev, removedOrder]);
      }
    } catch (error) {
      console.error("Error removing order:", error.message);
      setSnackbarMessage(`Failed to remove order ${orderCode}`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = async () => {
    if (selectedOrderIds.length === 0) {
      setSnackbarMessage("Please select at least one order");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      setNotification({ type: "warning", message: "Please select at least one order" });
      return;
    }

    const getDateOnly = (date) => date.toISOString().split("T")[0];

    const newExport = {
      orderCode: selectedOrderIds,
      exportState: exportState,
      export_address: exportAddress,
      created_at: shipment ? getDateOnly(new Date(shipment.createdAt)) : getDateOnly(new Date()),
      updated_at: getDateOnly(new Date()),
    };

    try {
      setLoading(true);
      if (shipment) {
        await ExportManagerFacade.updateExportShipment(shipment.id, newExport, exportState === "ON_GOING");
        setSnackbarMessage("Shipment updated successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setNotification({ type: "success", message: "Shipment updated successfully!" });
      } else {
        await ExportManagerFacade.createExportShipment(newExport);
        setSnackbarMessage("Shipment created successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setNotification({ type: "success", message: "Shipment created successfully!" });
      }

      setTimeout(() => {
        setLoading(false);
        onSubmit(newExport, !!shipment);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error submitting shipment:", error.message);
      setSnackbarMessage("Failed to save shipment");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setNotification({ type: "error", message: "Failed to save shipment" });
    }
  };

  const handleClose = () => {
    setSelectedOrderIds([]);
    setSelectedOrders([]);
    setExportAddress("");
    setExportState("PENDING");
    setOpenSnackbar(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box sx={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1000,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          overflow: "auto",
          maxHeight: "90vh",
        }}>
          <Typography sx={{ fontWeight: "bold", mb: 2 }}>
            {shipment ? "Chỉnh Sửa Xuất Hàng" : "Tạo Xuất Hàng"}
          </Typography>

          <TextField
            fullWidth
            label="Địa chỉ xuất hàng"
            value={exportAddress}
            onChange={(e) => setExportAddress(e.target.value)}
            sx={{ marginBottom: "1rem" }}
          />

          <Typography sx={{ fontWeight: "bold", mb: 2 }}>Đơn Hàng Đã Chọn</Typography>
          <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Mã Đơn Hàng</TableCell>
                  <TableCell>Địa Chỉ Giao Hàng</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{order.delivery_Address}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="error" onClick={() => handleRemoveOrder(order.orderCode)}>
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {shipment && (
            <FormControl fullWidth sx={{ marginTop: "1rem" }}>
              <InputLabel>Trạng Thái Xuất Hàng</InputLabel>
              <Select
                value={exportState}
                onChange={(e) => setExportState(e.target.value)}
              >
                <MenuItem value="PENDING">Chờ xử lý</MenuItem>
                <MenuItem value="ON_GOING">Đang giao</MenuItem>
                <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
              </Select>
            </FormControl>
          )}

          <Typography sx={{ fontWeight: "bold", mb: 2, marginTop: "2rem" }}>Chọn Đơn Hàng</Typography>
          <Paper sx={{ maxHeight: 400, overflow: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Mã Đơn Hàng</TableCell>
                  <TableCell>Địa Chỉ Giao Hàng</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{order.delivery_Address}</TableCell>
                    <TableCell>
                      {selectedOrderIds.includes(order.orderCode) ? (
                        <Button variant="outlined" color="error" onClick={() => handleRemoveOrder(order.orderCode)}>
                          Xóa
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#243642", color: "white", "&:hover": { backgroundColor: "#1a2a33" } }}
                          onClick={() => handleAddOrder(order.orderCode)}
                        >
                          Thêm
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={1500}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>

          <Box sx={{ marginTop: "2rem", textAlign: "right" }}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Đóng
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#243642", color: "white", "&:hover": { backgroundColor: "#1a2a33" }, marginLeft: "1rem" }}
              onClick={handleSubmit}
              disabled={loading}
            >
              Lưu
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalExport;