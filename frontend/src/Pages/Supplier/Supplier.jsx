import React, { useEffect, useState } from 'react'
import './Supplier.css'
import {
  alpha,
  Box,
  Button,
  Container,
  Fade,
  InputAdornment,
  InputBase,
  Modal,
  Stack,
  styled,
  TextField,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import MyTable from '../../Component/MyTable'
import ApiService from '../../Service/ApiService'

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  width: '100%',
  backgroundColor: 'white',
  '& .MuiInputBase-input': {
    padding: '10px',
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12vw',
      '&:focus': {
        width: '20vw'
      }
    }
  }
}))

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  margin: 5,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const columns = [
  { id: 'stt', label: 'STT', minWidth: 50, align: 'center' },
  {
    id: 'nameSupplier',
    label: 'Tên nhà cung cấp',
    minWidth: 100,
    align: 'left'
  },
  { id: 'address', label: 'Địa chỉ', minWidth: 100, align: 'left' },
  { id: 'phoneNumber', label: 'Số điện thoại', minWidth: 100, align: 'center' },
  { id: 'email', label: 'Email', minWidth: 100, align: 'center' },
  { id: 'action', label: '', align: 'center' }
]

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 5
}

// --- Prototype (Trạng thái mặc định) cho form thêm nhà cung cấp ---
const defaultSupplierState = {
  nameSupplier: '',
  address: '',
  phoneNumber: '',
  email: ''
}

export default function Supplier () {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false) // State cho Modal Add
  const [openEdit, setOpenEdit] = useState(false) // State cho Modal Edit
  const [rows, setRows] = useState([]) // State cho dữ liệu bảng
  const [selectedRowId, setSelectedRowId] = useState(null) // Chỉ lưu ID của dòng được chọn để sửa
  const [formData, setFormData] = useState(defaultSupplierState) // State chung cho dữ liệu form Add/Edit

  // Hàm xử lý chung cho việc thay đổi input trong form (controlled components)
  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))
  }

  // Hàm gọi API để lấy danh sách nhà cung cấp
  const fetchRows = async () => {
    try {
      const response = await ApiService.getAllSupplier()
      const rowsWithStt = Array.isArray(response)
        ? response.map((row, index) => ({
            ...row,
            stt: index + 1
          }))
        : []
      setRows(rowsWithStt)
    } catch (error) {
      console.error('Lỗi khi tải thông tin nhà cung cấp:', error.message)
      setRows([])
    }
  }

  // Xử lý mở Modal Add
  const handleOpen = () => {
    // Sử dụng Spread Syntax để tạo shallow copy, reset form về trạng thái mặc định
    setFormData({ ...defaultSupplierState })
    setOpen(true)
  }

  // Xử lý đóng Modal Add
  const handleClose = () => setOpen(false)

  // Xử lý mở Modal Edit
  const handleEditButton = row => {
    setSelectedRowId(row.id)
    // Sử dụng Spread Syntax để tạo shallow copy dữ liệu dòng vào form
    setFormData({ ...row })
    setOpenEdit(true)
  }

  // Xử lý đóng Modal Edit
  const handleCloseEdit = () => {
    setOpenEdit(false)
    setSelectedRowId(null)
  }

  // Xử lý submit form Add
  const handleAddSupplier = async () => {
    try {
      const dataToSend = {
        nameSupplier: formData.nameSupplier,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        email: formData.email
      }
      const respond = await ApiService.addSupplier(dataToSend)
      if (respond && (respond.status === 201 || respond.status === 200)) {
        handleClose()
        fetchRows()
      } else {
        console.error('Thêm nhà cung cấp thất bại:', respond)
      }
    } catch (error) {
      console.error('Lỗi khi thêm nhà cung cấp:', error)
    }
  }

  // Xử lý submit form Edit
  const handleUpdateSupplier = async () => {
    if (!selectedRowId) return
    try {
      const dataToSend = {
        nameSupplier: formData.nameSupplier,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        email: formData.email
      }
      const respond = await ApiService.updateSupplier(selectedRowId, dataToSend)
      if (respond && respond.status === 200) {
        handleCloseEdit()
        fetchRows()
      } else {
        console.error('Cập nhật nhà cung cấp thất bại:', respond)
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật nhà cung cấp:', error)
    }
  }

  // Xử lý nút Delete
  const handleDeleteButton = async id => {
    if (window.confirm(`Bạn có chắc muốn xóa nhà cung cấp này không?`)) {
      try {
        const response = await ApiService.deleteSupplier(id)
        if (response && (response.status === 200 || response.status === 204)) {
          setRows(prevRows => prevRows.filter(row => row.id !== id))
        } else {
          console.error('Xóa nhà cung cấp thất bại:', response)
        }
      } catch (error) {
        console.error('Lỗi khi xóa nhà cung cấp:', error)
      }
    }
  }

  // Lọc dữ liệu dựa trên thanh tìm kiếm (client-side)
  const filteredRows = rows.filter(
    row =>
      row.nameSupplier &&
      row.nameSupplier.toLowerCase().includes(search.toLowerCase())
  )

  // Fetch dữ liệu lần đầu khi component mount
  useEffect(() => {
    fetchRows()
  }, [])

  return (
    <Container
      maxWidth='xl'
      className='Supplier'
      sx={{
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Stack
        className='Supplier-bar'
        sx={{
          backgroundColor: '#ffffff',
          padding: '1rem',
          borderRadius: '0.5rem'
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
              fontSize: '25px',
              paddingLeft: '10px',
              width: 'auto'
            }}
            variant='p'
          >
            Quản lý nhà cung cấp
          </Typography>
          <Stack direction={'row'} alignItems={'center'}>
            <Stack
              className='search-bar'
              direction={'row'}
              alignItems={'center'}
              sx={{ marginRight: '0.5rem' }}
            >
              <Search>
                <StyledInputBase
                  sx={{ padding: '0rem' }}
                  placeholder='Tìm theo tên NCC...'
                  startAdornment={
                    <InputAdornment
                      className='input-adornment'
                      position='start'
                    >
                      <SearchIcon />
                    </InputAdornment>
                  }
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </Stack>
            <Stack
              className='btn-add-inventory-bar'
              direction={'row'}
              alignItems={'center'}
            >
              <Button
                onClick={handleOpen}
                className='btn-setting'
                sx={{
                  color: 'white',
                  height: '55px',
                  backgroundColor: '#243642',
                  '&:hover': { backgroundColor: '#1c2b35' }
                }}
                variant='contained'
              >
                <AddIcon sx={{ color: 'white' }} />
                Thêm nhà cung cấp
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <MyTable
          tableColumns={columns}
          tableRows={filteredRows}
          handleDeleteButton={handleDeleteButton}
          handleEditButton={handleEditButton}
        />
      </Stack>

      {/* --- Modal Add --- */}
      <Modal
        aria-labelledby='transition-modal-add-title'
        aria-describedby='transition-modal-add-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box
            sx={style}
            component='form'
            onSubmit={e => {
              e.preventDefault()
              handleAddSupplier()
            }}
          >
            {' '}
            <Stack
              className='template-add-iventory'
              direction={'column'}
              alignItems={'center'}
              spacing={2}
            >
              <Typography
                id='transition-modal-add-title'
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  width: '100%',
                  mb: 2
                }}
                variant='h6'
                component='h2'
              >
                Thêm nhà cung cấp
              </Typography>
              <TextField
                sx={{ width: '100%' }}
                value={formData.nameSupplier}
                onChange={handleChange}
                name='nameSupplier'
                label='Tên nhà cung cấp'
                variant='outlined'
                required
                autoFocus
              />
              <Stack direction='row' spacing={2} sx={{ width: '100%' }}>
                <TextField
                  sx={{ width: '50%' }}
                  value={formData.email}
                  onChange={handleChange}
                  name='email'
                  label='Email'
                  variant='outlined'
                  type='email'
                />
                <TextField
                  sx={{ width: '50%' }}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  name='phoneNumber'
                  label='Số điện thoại'
                  variant='outlined'
                />
              </Stack>
              <TextField
                sx={{ width: '100%' }}
                value={formData.address}
                onChange={handleChange}
                name='address'
                label='Địa chỉ'
                variant='outlined'
                multiline
                rows={3}
              />
              <Stack
                direction='row'
                spacing={2}
                justifyContent='flex-end'
                sx={{ width: '100%', mt: 2 }}
              >
                <Button onClick={handleClose}>Hủy</Button>
                <Button
                  type='submit'
                  className='btn-setting'
                  sx={{
                    color: 'white',
                    backgroundColor: '#243642',
                    '&:hover': { backgroundColor: '#1c2b35' }
                  }}
                  variant='contained'
                >
                  Thêm
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      {/* --- Modal Edit --- */}
      <Modal
        aria-labelledby='transition-modal-edit-title'
        aria-describedby='transition-modal-edit-description'
        open={openEdit}
        onClose={handleCloseEdit}
        closeAfterTransition
      >
        <Fade in={openEdit}>
          <Box
            sx={style}
            component='form'
            onSubmit={e => {
              e.preventDefault()
              handleUpdateSupplier()
            }}
          >
            {' '}
            <Stack
              className='template-add-iventory'
              direction={'column'}
              alignItems={'center'}
              spacing={2}
            >
              <Typography
                id='transition-modal-edit-title'
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  width: '100%',
                  mb: 2
                }}
                variant='h6'
                component='h2'
              >
                Cập nhật nhà cung cấp
              </Typography>
              <TextField
                sx={{ width: '100%' }}
                value={formData?.nameSupplier || ''}
                onChange={handleChange}
                name='nameSupplier'
                label='Tên nhà cung cấp'
                variant='outlined'
                required
                autoFocus
              />
              <Stack direction='row' spacing={2} sx={{ width: '100%' }}>
                <TextField
                  sx={{ width: '50%' }}
                  value={formData?.email || ''}
                  onChange={handleChange}
                  name='email'
                  label='Email'
                  variant='outlined'
                  type='email'
                />
                <TextField
                  sx={{ width: '50%' }}
                  value={formData?.phoneNumber || ''}
                  onChange={handleChange}
                  name='phoneNumber'
                  label='Số điện thoại'
                  variant='outlined'
                />
              </Stack>
              <TextField
                sx={{ width: '100%' }}
                value={formData?.address || ''}
                onChange={handleChange}
                name='address'
                label='Địa chỉ'
                variant='outlined'
                multiline
                rows={3}
              />
              <Stack
                direction='row'
                spacing={2}
                justifyContent='flex-end'
                sx={{ width: '100%', mt: 2 }}
              >
                <Button onClick={handleCloseEdit}>Hủy</Button>
                <Button
                  type='submit'
                  className='btn-setting'
                  sx={{
                    color: 'white',
                    backgroundColor: '#243642',
                    '&:hover': { backgroundColor: '#1c2b35' }
                  }}
                  variant='contained'
                >
                  Cập nhật
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Container>
  )
}
