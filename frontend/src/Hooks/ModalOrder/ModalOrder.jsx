import React, { useEffect, useState } from 'react'
import {
  Modal,
  Box,
  Fade,
  Typography,
  Stack,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Autocomplete
} from '@mui/material'
import ApiService from '../../Service/ApiService'

const OrderModal = ({ open, onClose, onSubmit, order }) => {
  const [newOrder, setNewOrder] = useState({
    orderCode: '',
    address: '',
    orderItems: []
  })
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [productShelves, setProductShelves] = useState({}) // Lưu kệ theo từng sản phẩm
  const [searchQuery, setSearchQuery] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  useEffect(() => {
    if (open) {
      fetchProducts()
      fetchCustomers()
      if (order) {
        setNewOrder({
          ...order,
          orderDate: order.orderDate
            ? order.orderDate.split('T')[0]
            : new Date().toISOString().split('T')[0]
        })
        // Load shelves cho các sản phẩm hiện có
        loadShelvesForExistingItems(order.orderItems || [])
      } else {
        const orderCode = `ORD-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`
        setNewOrder({
          orderCode: orderCode,
          address: '',
          orderItems: []
        })
        setProductShelves({})
      }
    }
  }, [open, order])

  const loadShelvesForExistingItems = async orderItems => {
    const shelvesData = {}
    for (const item of orderItems) {
      try {
        const shelvesResponse = await ApiService.getShelfByProductName(
          item.productName
        )
        if (Array.isArray(shelvesResponse) && shelvesResponse.length > 0) {
          const shelfCodes = shelvesResponse.map(
            shelf => shelf.shelfCode || shelf
          )
          shelvesData[item.orderItemCode] = shelfCodes
        }
      } catch (error) {
        console.error(`Error fetching shelves for ${item.productName}:`, error)
      }
    }
    setProductShelves(shelvesData)
  }

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...')
      const response = await ApiService.getAllProduct()
      console.log('Products response:', response)

      if (response && Array.isArray(response)) {
        setProducts(response)
        console.log('Products set successfully:', response.length, 'products')
      } else {
        console.log('No products found or invalid response format')
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setSnackbarMessage('Không thể tải danh sách sản phẩm')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      setProducts([])
    }
  }

  const fetchCustomers = async () => {
    try {
      // Nếu có API getAllCustomers, sử dụng nó
      // const response = await ApiService.getAllCustomers()
      // setCustomers(response || [])

      // Tạm thời để trống customers vì chưa có API
      setCustomers([])
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const handleAddOrderItem = async product => {
    try {
      // Fetch shelves for the specific product
      const shelvesResponse = await ApiService.getShelfByProductName(
        product.productName
      )
      let shelfCodes = []

      if (Array.isArray(shelvesResponse) && shelvesResponse.length > 0) {
        shelfCodes = shelvesResponse.map(shelf => shelf.shelfCode || shelf)
      }

      const orderItemCode = `OI-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`

      const newOrderItem = {
        orderItemCode: orderItemCode,
        productName: product.productName,
        product_id: product.id,
        price: product.price,
        quantity: 1,
        totalPrice: product.price,
        shelf: '', // Chưa chọn kệ
        orderItemState: 'IN_ORDER'
      }

      setNewOrder(prevOrder => ({
        ...prevOrder,
        orderItems: [...prevOrder.orderItems, newOrderItem]
      }))

      // Lưu kệ cho sản phẩm cụ thể này
      setProductShelves(prev => ({
        ...prev,
        [orderItemCode]: shelfCodes
      }))
    } catch (error) {
      console.error('Error adding order item:', error)
    }
  }

  const handleRemoveOrderItem = orderItemCode => {
    setNewOrder(prevOrder => ({
      ...prevOrder,
      orderItems: prevOrder.orderItems.filter(
        item => item.orderItemCode !== orderItemCode
      )
    }))

    // Xóa kệ của sản phẩm bị xóa
    setProductShelves(prev => {
      const updated = { ...prev }
      delete updated[orderItemCode]
      return updated
    })
  }

  const handleOrderItemChange = (orderItemCode, field, value) => {
    setNewOrder(prevOrder => ({
      ...prevOrder,
      orderItems: prevOrder.orderItems.map(item => {
        if (item.orderItemCode === orderItemCode) {
          const updatedItem = { ...item, [field]: value }
          if (field === 'quantity' || field === 'price') {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.price
          }
          return updatedItem
        }
        return item
      })
    }))
  }

  const handleSubmitOrder = async () => {
    try {
      if (newOrder.orderItems.length === 0) {
        setSnackbarMessage('Vui lòng thêm ít nhất một sản phẩm')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        return
      }

      // Kiểm tra tất cả sản phẩm đã chọn kệ
      const missingShelf = newOrder.orderItems.find(item => !item.shelf)
      if (missingShelf) {
        setSnackbarMessage(
          `Vui lòng chọn kệ cho sản phẩm: ${missingShelf.productName}`
        )
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        return
      }

      const orderItemResponses = await Promise.all(
        newOrder.orderItems.map(async item => {
          const orderItemData = {
            orderItemCode: item.orderItemCode,
            product_id: item.product_id,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            orderItemState: item.orderItemState,
            shelfCode: item.shelf ? [item.shelf] : []
          }

          console.log('Submitting order item:', orderItemData)
          const response = await ApiService.addOrderItem(orderItemData)
          return response.orderItemCode
        })
      )

      const orderData = {
        orderItem_code: orderItemResponses,
        delivery_Address: newOrder.address,
        orderCode: newOrder.orderCode,
        created_at: new Date().toISOString(),
        update_at: new Date().toISOString()
      }

      console.log('Submitting order data:', orderData)
      await ApiService.addOrder(orderData)

      setSnackbarMessage('Đơn hàng đã được thêm thành công!')
      setSnackbarSeverity('success')
      setSnackbarOpen(true)

      if (onSubmit) {
        onSubmit(newOrder)
      }

      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting order', error)
      setSnackbarMessage('Có lỗi xảy ra khi thêm đơn hàng!')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  const handleClose = () => {
    setNewOrder({
      orderCode: '',
      address: '',
      orderItems: []
    })
    setProductShelves({})
    setSearchQuery('')
    onClose()
  }

  const totalAmount = newOrder.orderItems.reduce(
    (total, item) => total + item.totalPrice,
    0
  )

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '1200px',
            height: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflow: 'auto'
          }}
        >
          <Typography variant='h6' sx={{ marginBottom: 2 }}>
            {order ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng mới'}
          </Typography>

          <Stack direction='row' spacing={4} sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ width: '100%', md: '50%', marginBottom: 2 }}>
              <TextField
                fullWidth
                label='Mã đơn hàng'
                value={newOrder.orderCode}
                onChange={e =>
                  setNewOrder({ ...newOrder, orderCode: e.target.value })
                }
                sx={{ marginBottom: 2 }}
                disabled={!!order}
              />
              <TextField
                fullWidth
                label='Địa chỉ giao hàng'
                value={newOrder.address}
                onChange={e =>
                  setNewOrder({ ...newOrder, address: e.target.value })
                }
                sx={{ marginBottom: 2 }}
              />

              <Typography variant='h6' sx={{ marginBottom: 1 }}>
                Sản phẩm đã chọn ({newOrder.orderItems.length})
              </Typography>

              {newOrder.orderItems.length > 0 ? (
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  <TableContainer>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Mã gói hàng</TableCell>
                          <TableCell>Sản phẩm</TableCell>
                          <TableCell>Số lượng</TableCell>
                          <TableCell>Tổng giá</TableCell>
                          <TableCell>Kệ</TableCell>
                          <TableCell>Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {newOrder.orderItems.map(item => (
                          <TableRow key={item.orderItemCode}>
                            <TableCell>
                              <TextField
                                size='small'
                                value={item.orderItemCode}
                                onChange={e =>
                                  handleOrderItemChange(
                                    item.orderItemCode,
                                    'orderItemCode',
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>
                              <TextField
                                type='number'
                                size='small'
                                value={item.quantity}
                                onChange={e =>
                                  handleOrderItemChange(
                                    item.orderItemCode,
                                    'quantity',
                                    parseInt(e.target.value, 10) || 1
                                  )
                                }
                                inputProps={{ min: 1 }}
                                sx={{ width: '80px' }}
                              />
                            </TableCell>
                            <TableCell>
                              {item.totalPrice.toLocaleString()} VND
                            </TableCell>
                            <TableCell>
                              <FormControl fullWidth size='small'>
                                <InputLabel>Chọn kệ</InputLabel>
                                <Select
                                  value={item.shelf}
                                  onChange={e => {
                                    handleOrderItemChange(
                                      item.orderItemCode,
                                      'shelf',
                                      e.target.value
                                    )
                                  }}
                                  label='Chọn kệ'
                                >
                                  {(
                                    productShelves[item.orderItemCode] || []
                                  ).map((shelf, index) => (
                                    <MenuItem key={index} value={shelf}>
                                      {shelf}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <Button
                                color='error'
                                size='small'
                                onClick={() =>
                                  handleRemoveOrderItem(item.orderItemCode)
                                }
                              >
                                Xóa
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <Box textAlign='center' py={3}>
                  <Typography variant='body2' color='textSecondary'>
                    Chưa có sản phẩm nào được thêm vào đơn hàng
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ width: '100%', md: '50%' }}>
              <Typography variant='h6' sx={{ marginBottom: 2 }}>
                Thêm sản phẩm
              </Typography>

              <Autocomplete
                options={products}
                getOptionLabel={option =>
                  `${option.productName} - ${option.price.toLocaleString()} VND`
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleAddOrderItem(newValue)
                  }
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Tìm và chọn sản phẩm'
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                )}
              />

              <Typography variant='subtitle1' sx={{ marginBottom: 1 }}>
                Hoặc chọn từ danh sách:
              </Typography>

              <TextField
                fullWidth
                placeholder='Tìm sản phẩm'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                sx={{ marginBottom: 2 }}
              />

              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                <TableContainer>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Thêm</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products
                        .filter(product =>
                          product.productName
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                        .map(product => (
                          <TableRow key={product.id}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>
                              {product.price.toLocaleString()} VND
                            </TableCell>
                            <TableCell>
                              {product.inventory_quantity || 0}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant='contained'
                                size='small'
                                onClick={() => handleAddOrderItem(product)}
                                sx={{
                                  backgroundColor: '#243642',
                                  '&:hover': {
                                    backgroundColor: '#1c2b35'
                                  }
                                }}
                              >
                                Thêm
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Stack>

          <Stack
            direction='row'
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 3
            }}
          >
            <Typography variant='h6'>
              Tổng cộng: {totalAmount.toLocaleString()} VND
            </Typography>

            <Stack direction='row' spacing={2}>
              <Button variant='outlined' onClick={handleClose}>
                Hủy
              </Button>
              <Button
                variant='contained'
                onClick={handleSubmitOrder}
                disabled={newOrder.orderItems.length === 0}
                sx={{
                  backgroundColor: '#243642',
                  '&:hover': {
                    backgroundColor: '#1c2b35'
                  }
                }}
              >
                {order ? 'Cập nhật' : 'Tạo đơn hàng'}
              </Button>
            </Stack>
          </Stack>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Modal>
  )
}

export default OrderModal
