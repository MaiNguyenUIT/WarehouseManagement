import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Snackbar,
  Alert
} from '@mui/material'
import { ExpandMore, ExpandLess, Edit, Delete } from '@mui/icons-material'
import ApiService from '../../Service/ApiService.jsx'
import OrderUpdateModal from '../ModalUpdateOrder/ModalUpdateOrder.jsx'

const OrderTable = ({
  orders,
  searchQuery,
  statusFilter,
  fetchOrders,
  handleOpenUpdateModal
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [orderItems, setOrderItems] = useState({})
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)
  const [productNames, setProductNames] = useState({})
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  // Expand/Collapse Row
  const handleExpandRow = async (orderId, orderItemCodes) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null) // Collapse if already expanded
      return
    }

    setExpandedOrderId(orderId) // Expand new row

    if (orderItemCodes && orderItemCodes.length > 0) {
      try {
        const fetchedItems = []
        for (let code of orderItemCodes) {
          console.log('Đang xử lý mã đơn hàng:', code)

          const item = await ApiService.getOrderItemByCode([code])
          fetchedItems.push(item)

          console.log('Dữ liệu item nhận được từ API:', item)
          console.log('Đang gửi productId đến API:', item.product_id)

          // Fetch product details by productId
          const product = await ApiService.getProductById(item.product_id)

          console.log('Dữ liệu sản phẩm nhận được từ API:', product)

          if (product && product.productName) {
            setProductNames(prevNames => ({
              ...prevNames,
              [item.orderItemCode]: product.productName
            }))
          } else {
            setProductNames(prevNames => ({
              ...prevNames,
              [item.orderItemCode]: 'Không tìm thấy tên sản phẩm'
            }))
          }
        }
        setOrderItems(prevItems => ({ ...prevItems, [orderId]: fetchedItems }))
      } catch (error) {
        console.error('Error fetching order items for orderId:', orderId, error)
      }
    }
  }

  // Confirm Delete Handler
  const handleDeleteClick = orderId => {
    setOrderToDelete(orderId)
    setOpenConfirmDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      try {
        await ApiService.deleteOrder(orderToDelete)
        setSnackbarMessage('Xóa đơn hàng thành công!')
        setSnackbarSeverity('success')
        setSnackbarOpen(true)

        setOrderToDelete(null)
        setOpenConfirmDialog(false)

        // Fetch lại danh sách đơn hàng
        await fetchOrders()
      } catch (error) {
        console.error(`Error deleting order with ID ${orderToDelete}:`, error)
        setSnackbarMessage('Có lỗi xảy ra khi xóa đơn hàng!')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    }
  }

  const handleCancelDelete = () => {
    setOrderToDelete(null)
    setOpenConfirmDialog(false)
  }

  const handleEdit = async orderId => {
    console.log(`Open update modal for order with ID: ${orderId}`)
    try {
      // Fetch the full order details from API
      const orderFromAPI = await ApiService.getOrderById(orderId)
      console.log('Fetched order from API:', orderFromAPI)

      // Format order data to match what ModalUpdateOrder expects
      const formattedOrder = {
        id: orderFromAPI.id,
        orderCode: orderFromAPI.orderCode,
        address: orderFromAPI.delivery_Address,
        orderItemCodes: orderFromAPI.orderItem_code || [],
        state: orderFromAPI.orderState,
        value: orderFromAPI.orderPrice,
        created_at: orderFromAPI.created_at,
        update_at: orderFromAPI.update_at
      }

      console.log('Formatted order for modal:', formattedOrder)

      // Call handleOpenUpdateModal from Order.jsx with formatted data
      handleOpenUpdateModal(formattedOrder)
    } catch (error) {
      console.error('Error fetching order details:', error)
    }
  }

  // Filter orders
  const filteredOrders = orders.filter(
    order =>
      (order.orderCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.state?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter ? order.state === statusFilter : true)
  )

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0) // Reset to first page when changing rows per page
  }

  // Slice the filtered orders to show only the current page
  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Ngày đặt hàng</TableCell>
              <TableCell>Giá trị</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map(order => (
              <React.Fragment key={order.id}>
                <TableRow hover>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        handleExpandRow(order.id, order.orderItemCodes)
                      }
                    >
                      {expandedOrderId === order.id ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{order.orderCode}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.value} VND</TableCell>
                  <TableCell>
                    {order.state === 'PENDING'
                      ? 'Đang chờ'
                      : order.state === 'DELIVERED'
                      ? 'Đã giao'
                      : order.state === 'ON_GOING'
                      ? 'Đang giao'
                      : order.state === 'CONFIRMED'
                      ? 'Đã xác nhận'
                      : order.state === 'CANCELLED'
                      ? 'Đã hủy'
                      : order.state || 'Chưa có trạng thái'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(order.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(order.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                  >
                    <Collapse
                      in={expandedOrderId === order.id}
                      timeout='auto'
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Typography variant='h6' gutterBottom>
                          Chi tiết gói hàng
                        </Typography>
                        <Table size='small'>
                          <TableHead>
                            <TableRow>
                              <TableCell>Mã gói hàng</TableCell>
                              <TableCell>Tên sản phẩm</TableCell>
                              <TableCell>Số lượng</TableCell>
                              <TableCell>Tổng giá</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {orderItems[order.id]?.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.orderItemCode}</TableCell>
                                <TableCell>
                                  {productNames[item.orderItemCode] ||
                                    'Đang tải...'}
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.totalPrice} VND</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Confirm Delete Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>
            Bạn có chắc chắn muốn xóa đơn hàng này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color='default'>
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color='primary'>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OrderTable
