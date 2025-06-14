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
  MenuItem,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select
} from '@mui/material'
import ApiService from '../../Service/ApiService'

const OrderUpdateModal = ({
  openUpdateModal,
  handleCloseUpdateModal,
  selectedOrder,
  fetchOrders
}) => {
  const [orderDetails, setOrderDetails] = useState({
    orderCode: '',
    orderPrice: 0,
    orderState: 'PENDING',
    orderItem_code: [],
    orderItem_quantity: 0,
    delivery_Address: '',
    created_at: '',
    update_at: ''
  })

  const [orderItems, setOrderItems] = useState([])
  const [products, setProducts] = useState([])
  const [productShelves, setProductShelves] = useState({})
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!selectedOrder) {
        console.log('No order selected, skipping fetch.')
        return
      }

      try {
        console.log('1. Fetching data for order:', selectedOrder)

        // Set order details từ selectedOrder
        setOrderDetails({
          orderCode: selectedOrder.orderCode || '',
          orderPrice: selectedOrder.value || 0,
          orderState: selectedOrder.state || 'PENDING',
          orderItem_code: selectedOrder.orderItemCodes || [],
          delivery_Address: selectedOrder.address || '',
          created_at: selectedOrder.created_at || '',
          update_at: selectedOrder.update_at || ''
        })

        const orderItemCodes = selectedOrder.orderItemCodes || []
        console.log('2. Order item codes:', orderItemCodes)

        if (orderItemCodes.length === 0) {
          console.log('No order items found')
          setOrderItems([])
          setProductShelves({})
          return
        }

        const productDetails = []
        const shelvesData = {}

        for (const orderItemCode of orderItemCodes) {
          try {
            console.log(
              `3. Fetching details for order item code: ${orderItemCode}`
            )

            // Fetch order item details
            const fetchedOrderItem = await ApiService.getOrderItemByCode(
              orderItemCode
            )
            console.log(`4. Fetched order item:`, fetchedOrderItem)

            if (!fetchedOrderItem) {
              console.warn(`No order item found for code: ${orderItemCode}`)
              continue
            }

            // Fetch product details
            const fetchedProduct = await ApiService.getProductById(
              fetchedOrderItem.product_id
            )
            console.log(`5. Fetched product:`, fetchedProduct)

            if (!fetchedProduct) {
              console.warn(
                `No product found for ID: ${fetchedOrderItem.product_id}`
              )
              continue
            }

            // Fetch shelf information
            let shelfCodes = []
            let currentShelf = ''

            try {
              const shelvesResponse = await ApiService.getShelfByProductName(
                fetchedProduct.productName
              )
              console.log(
                `6. Shelves response for ${fetchedProduct.productName}:`,
                shelvesResponse
              )

              if (
                Array.isArray(shelvesResponse) &&
                shelvesResponse.length > 0
              ) {
                shelfCodes = shelvesResponse.map(
                  shelf => shelf || 'Unknown Shelf'
                )
              }

              // Get current selected shelf
              if (
                fetchedOrderItem.shelfCode &&
                Array.isArray(fetchedOrderItem.shelfCode) &&
                fetchedOrderItem.shelfCode.length > 0
              ) {
                currentShelf = fetchedOrderItem.shelfCode[0]
              }
            } catch (shelfError) {
              console.error(
                `Error fetching shelves for ${fetchedProduct.productName}:`,
                shelfError
              )
              shelfCodes = []
            }

            // Store shelves data
            shelvesData[orderItemCode] = shelfCodes

            // Create complete item object
            const completeItem = {
              orderItemCode: fetchedOrderItem.orderItemCode,
              orderItem_id: fetchedOrderItem.orderItem_id,
              productName: fetchedProduct.productName,
              productPrice: fetchedProduct.price,
              product_id: fetchedOrderItem.product_id,
              quantity: fetchedOrderItem.quantity || 1,
              totalPrice:
                fetchedOrderItem.totalPrice ||
                fetchedProduct.price * (fetchedOrderItem.quantity || 1),
              orderItemState: fetchedOrderItem.orderItemState || 'IN_ORDER',
              shelfCode: shelfCodes,
              selectedShelf: currentShelf
            }

            productDetails.push(completeItem)
          } catch (error) {
            console.error(
              `Error processing order item ${orderItemCode}:`,
              error
            )
          }
        }

        console.log('7. Final product details:', productDetails)
        console.log('8. Final shelves data:', shelvesData)

        setOrderItems(productDetails)
        setProductShelves(shelvesData)
      } catch (error) {
        console.error('Error fetching order data:', error)
        setSnackbarMessage('Có lỗi khi tải thông tin đơn hàng')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    }

    if (openUpdateModal && selectedOrder) {
      fetchOrderData()
    }
  }, [selectedOrder, openUpdateModal])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await ApiService.getAllProduct() // Sử dụng getAllProduct thay vì getProduct
        console.log('Available products:', products)
        setProducts(products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      }
    }

    if (openUpdateModal) {
      fetchProducts()
    }
  }, [openUpdateModal])

  const handleInputChange = (orderItemCode, field, value) => {
    setOrderItems(prevOrderItems =>
      prevOrderItems.map(item =>
        item.orderItemCode === orderItemCode
          ? { ...item, [field]: value }
          : item
      )
    )
  }

  const handleOrderItemChange = (itemCode, field, value) => {
    setOrderItems(prevItems =>
      prevItems.map(item => {
        if (item.orderItemCode === itemCode) {
          if (field === 'selectedShelf') {
            return { ...item, selectedShelf: value }
          } else if (field === 'quantity') {
            const newQuantity = parseInt(value) || 1
            const newTotalPrice = item.productPrice * newQuantity
            return { ...item, quantity: newQuantity, totalPrice: newTotalPrice }
          }
        }
        return item
      })
    )
  }

  const handleRemoveOrderItem = itemCode => {
    setOrderItems(orderItems.filter(item => item.orderItemCode !== itemCode))

    // Remove shelves data for deleted item
    setProductShelves(prev => {
      const updated = { ...prev }
      delete updated[itemCode]
      return updated
    })
  }

  const handleAddOrderItem = async productId => {
    const product = products.find(p => p.id === productId)
    if (!product) {
      console.error('Product not found for ID:', productId)
      return
    }

    try {
      // Fetch shelves for the product
      const shelvesResponse = await ApiService.getShelfByProductName(
        product.productName
      )

      let shelfCodes = []
      if (Array.isArray(shelvesResponse)) {
        shelfCodes = shelvesResponse.map(shelf => shelf || 'Unknown Shelf')
      }

      const orderItemCode = `OI-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`

      const newItem = {
        orderItemCode: orderItemCode,
        productName: product.productName,
        productPrice: product.price,
        product_id: product.id,
        quantity: 1,
        totalPrice: product.price,
        orderItemState: 'IN_ORDER',
        shelfCode: shelfCodes,
        selectedShelf: ''
      }

      setOrderItems(prevOrderItems => [...prevOrderItems, newItem])

      // Store shelves for new item
      setProductShelves(prev => ({
        ...prev,
        [orderItemCode]: shelfCodes
      }))
    } catch (error) {
      console.error('Error adding order item:', error)
      setSnackbarMessage('Có lỗi khi thêm sản phẩm')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleSubmitOrder = async () => {
    try {
      if (!orderItems || orderItems.length === 0) {
        setSnackbarMessage(
          'Đơn hàng không có sản phẩm. Vui lòng thêm sản phẩm trước khi cập nhật.'
        )
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        return
      }

      // Validate all items have selected shelf
      const missingShelf = orderItems.find(item => !item.selectedShelf)
      if (missingShelf) {
        setSnackbarMessage(
          `Vui lòng chọn kệ cho sản phẩm: ${missingShelf.productName}`
        )
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        return
      }

      // Process each order item
      for (const item of orderItems) {
        try {
          const itemData = {
            product_id: item.product_id,
            quantity: item.quantity || 1,
            totalPrice: item.totalPrice || item.productPrice * item.quantity,
            orderItemCode: item.orderItemCode,
            orderItemState: item.orderItemState || 'IN_ORDER',
            shelfCode: item.selectedShelf ? [item.selectedShelf] : []
          }

          if (item.orderItem_id) {
            // Update existing item
            itemData.orderItem_id = item.orderItem_id
            await ApiService.updateOrderItem(item.orderItem_id, itemData)
            console.log(`Updated order item: ${item.orderItemCode}`)
          } else {
            // Create new item
            await ApiService.addOrderItem(itemData)
            console.log(`Created new order item: ${item.orderItemCode}`)
          }
        } catch (error) {
          console.error(`Error processing item ${item.orderItemCode}:`, error)
        }
      }

      // Update order details
      const currentTime = new Date().toISOString()
      const orderData = {
        orderItem_code: orderItems
          .map(item => item.orderItemCode)
          .filter(Boolean),
        delivery_Address: orderDetails.delivery_Address || '',
        created_at: orderDetails.created_at || currentTime,
        update_at: currentTime,
        orderCode: orderDetails.orderCode || ''
      }

      console.log('Updating order with data:', orderData)

      if (selectedOrder.id) {
        await ApiService.updateOrder(selectedOrder.id, orderData)

        // Update order state if needed
        if (orderDetails.orderState) {
          const orderStatePayload = { state: orderDetails.orderState }
          await ApiService.updateOrderState(selectedOrder.id, orderStatePayload)
        }
      }

      setSnackbarSeverity('success')
      setSnackbarMessage('Cập nhật đơn hàng thành công')
      setSnackbarOpen(true)

      // Refresh orders list
      fetchOrders()

      setTimeout(() => {
        handleCloseUpdateModal()
      }, 2000)
    } catch (error) {
      console.error('Error updating order:', error)
      setSnackbarSeverity('error')
      setSnackbarMessage('Có lỗi xảy ra khi cập nhật đơn hàng')
      setSnackbarOpen(true)
    }
  }

  // Calculate total amount
  const totalAmount = orderItems.reduce((total, item) => {
    return total + (item.totalPrice || 0)
  }, 0)

  return (
    <Modal
      open={openUpdateModal}
      onClose={handleCloseUpdateModal}
      closeAfterTransition
    >
      <Fade in={openUpdateModal}>
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
            Cập nhật Đơn Hàng
          </Typography>

          <Stack direction='row' spacing={4} sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ width: '100%', md: '50%', marginBottom: 2 }}>
              <TextField
                fullWidth
                label='Mã đơn hàng'
                value={orderDetails.orderCode}
                onChange={e =>
                  setOrderDetails({
                    ...orderDetails,
                    orderCode: e.target.value
                  })
                }
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label='Địa chỉ'
                value={orderDetails.delivery_Address}
                onChange={e =>
                  setOrderDetails({
                    ...orderDetails,
                    delivery_Address: e.target.value
                  })
                }
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                select
                label='Trạng thái'
                value={orderDetails.orderState}
                onChange={e =>
                  setOrderDetails({
                    ...orderDetails,
                    orderState: e.target.value
                  })
                }
                sx={{ marginBottom: 2 }}
              >
                {[
                  { label: 'Đang chờ', value: 'PENDING' },
                  { label: 'Đang giao', value: 'ON_GOING' },
                  { label: 'Đã giao', value: 'DELIVERED' },
                  { label: 'Đã xác nhận', value: 'CONFIRMED' },
                  { label: 'Đã hủy', value: 'CANCELLED' }
                ].map(status => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>

              <Typography variant='h6' sx={{ marginBottom: 1 }}>
                Sản phẩm đã chọn ({orderItems.length})
              </Typography>

              {orderItems.length > 0 ? (
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  <TableContainer>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Mã Gói Hàng</TableCell>
                          <TableCell>Tên sản phẩm</TableCell>
                          <TableCell>Kệ</TableCell>
                          <TableCell>Số lượng</TableCell>
                          <TableCell>Tổng giá</TableCell>
                          <TableCell>Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item, index) => (
                          <TableRow key={item.orderItemCode || index}>
                            <TableCell>
                              <TextField
                                size='small'
                                value={item.orderItemCode || ''}
                                onChange={e =>
                                  handleInputChange(
                                    item.orderItemCode,
                                    'orderItemCode',
                                    e.target.value
                                  )
                                }
                                variant='outlined'
                                sx={{ width: '150px' }}
                              />
                            </TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>
                              <FormControl fullWidth size='small'>
                                <InputLabel>Chọn kệ</InputLabel>
                                <Select
                                  value={item.selectedShelf || ''}
                                  onChange={e =>
                                    handleOrderItemChange(
                                      item.orderItemCode,
                                      'selectedShelf',
                                      e.target.value
                                    )
                                  }
                                  label='Chọn kệ'
                                >
                                  <MenuItem value=''>
                                    <em>Chọn kệ</em>
                                  </MenuItem>
                                  {(
                                    productShelves[item.orderItemCode] || []
                                  ).map((shelfCode, index) => (
                                    <MenuItem key={index} value={shelfCode}>
                                      {shelfCode}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <TextField
                                type='number'
                                size='small'
                                value={item.quantity}
                                onChange={e =>
                                  handleOrderItemChange(
                                    item.orderItemCode,
                                    'quantity',
                                    e.target.value
                                  )
                                }
                                inputProps={{ min: 1 }}
                                sx={{ width: '80px' }}
                              />
                            </TableCell>
                            <TableCell>
                              {(item.totalPrice || 0).toLocaleString()} VND
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
                    Chưa có sản phẩm nào trong đơn hàng
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ width: '100%', md: '50%' }}>
              <Typography variant='h6'>Danh sách sản phẩm</Typography>
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
                        <TableCell>Số lượng trong kho</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Thêm vào đơn hàng</TableCell>
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
                              {product.inventory_quantity || 0}
                            </TableCell>
                            <TableCell>
                              {(product.price || 0).toLocaleString()} VND
                            </TableCell>
                            <TableCell>
                              <Button
                                variant='contained'
                                size='small'
                                onClick={() => handleAddOrderItem(product.id)}
                                sx={{
                                  backgroundColor: '#243642',
                                  '&:hover': { backgroundColor: '#1c2b35' }
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

          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2
            }}
          >
            <Typography variant='h6'>
              Tổng tiền: {totalAmount.toLocaleString()} VND
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant='contained'
                color='secondary'
                onClick={handleCloseUpdateModal}
                sx={{
                  backgroundColor: '#f44336',
                  '&:hover': { backgroundColor: '#d32f2f' }
                }}
              >
                Đóng
              </Button>
              <Button
                variant='contained'
                color='primary'
                onClick={handleSubmitOrder}
                sx={{
                  backgroundColor: '#243642',
                  '&:hover': { backgroundColor: '#1c2b35' }
                }}
              >
                Cập nhật đơn hàng
              </Button>
            </Box>
          </Box>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Modal>
  )
}

export default OrderUpdateModal
