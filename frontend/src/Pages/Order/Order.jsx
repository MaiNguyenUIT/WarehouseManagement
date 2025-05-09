import React, { useState, useEffect } from 'react'
import {
  Container,
  Stack,
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  InputBase
} from '@mui/material'
import PrimarySearchAppBar from '../../Component/AppBar/AppBar.jsx'
import OrderTable from '../../Hooks/TableOrder/TableOrder.jsx'
import OrderModal from '../../Hooks/ModalOrder/ModalOrder.jsx'
import OrderUpdateModal from '../../Hooks/ModalUpdateOrder/ModalUpdateOrder.jsx'
import { styled, alpha } from '@mui/material/styles'
import Add from '@mui/icons-material/Add'
import ApiService from '../../Service/ApiService.jsx'

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  width: '100%',
  backgroundColor: 'white',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch'
      }
    }
  }
}))

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const OrderPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [newOrder, setNewOrder] = useState({
    customer: '',
    address: '',
    orderItems: []
  })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState([])

  // Fetch orders on page load
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const orderData = await ApiService.getAllOrders()

      const formattedOrders = orderData.map(order => {
        // Chuyển đổi định dạng ngày từ ISO string sang định dạng ngày giờ chuẩn của người dùng
        const formattedDate = new Date(order.created_at).toLocaleString(
          'vi-VN',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }
        )

        return {
          id: order.id,
          orderCode: order.orderCode,
          address: order.delivery_Address,
          orderItemCodes: order.orderItem_code || [],
          state: order.orderState,
          date: formattedDate, // Lưu lại ngày giờ đã định dạng
          value: order.orderPrice
        }
      })

      setOrders(formattedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleOpenModal = () => {
    setNewOrder({
      customer: '',
      address: '',
      orderItems: []
    })
    setOpenModal(true)
  }

  const handleCloseModal = () => setOpenModal(false)

  const handleChangeSearch = e => {
    setSearchQuery(e.target.value)
  }

  const handleChangeStatusFilter = e => {
    setStatusFilter(e.target.value)
  }

  const handleOpenUpdateModal = order => {
    setSelectedOrder(order) // set the selected order for updating
    setOpenUpdateModal(true) // open update modal
  }

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false)
    setSelectedOrder(null) // reset selected order when closing modal
  }

  return (
    <Container maxWidth='lg'>
      <PrimarySearchAppBar />
      <Stack
        className='order-bar'
        sx={{
          backgroundColor: '#E2F1E7',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginTop: 0
        }}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '20px',
              paddingLeft: '20px',
              flex: '1'
            }}
            variant='p'
          >
            Quản lý Đơn Hàng
          </Typography>

          <Stack
            direction={'row'}
            alignItems={'center'}
            spacing={2}
            sx={{ flex: '2', justifyContent: 'flex-end' }}
          >
            <Search>
              <StyledInputBase
                sx={{ height: '50px' }}
                placeholder='Tìm kiếm'
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={handleChangeSearch}
              />
            </Search>

            <FormControl sx={{ width: '170px', marginLeft: '0.5rem' }}>
              <InputLabel id='status-filter-label'>Lọc theo</InputLabel>
              <Select
                sx={{ backgroundColor: 'white' }}
                labelId='status-filter-label'
                id='status-filter'
                value={statusFilter}
                label='Lọc theo'
                onChange={handleChangeStatusFilter}
              >
                <MenuItem value=''>Tất cả</MenuItem>
                <MenuItem value='PENDING'>Chờ xử lý</MenuItem>
                <MenuItem value='DELIVERED'>Đã giao</MenuItem>
              </Select>
            </FormControl>

            <Button
              onClick={handleOpenModal}
              sx={{
                color: 'white',
                height: '50px',
                backgroundColor: '#243642',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexShrink: 0
              }}
              variant='contained'
            >
              <Add sx={{ color: 'white' }} />
              Thêm Đơn Hàng
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <OrderTable
        orders={orders}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        handleOpenUpdateModal={handleOpenUpdateModal}
        fetchOrders={fetchOrders}
      />

      <OrderModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        newOrder={newOrder}
        setOrders={setOrders}
        setNewOrder={setNewOrder}
        fetchOrders={fetchOrders}
      />

      <OrderUpdateModal
        openUpdateModal={openUpdateModal}
        handleCloseUpdateModal={handleCloseUpdateModal}
        selectedOrder={selectedOrder}
        setOrders={setOrders}
      />
    </Container>
  )
}

export default OrderPage
