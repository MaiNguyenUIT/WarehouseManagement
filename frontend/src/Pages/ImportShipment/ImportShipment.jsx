import React, { Fragment, useEffect, useRef, useState } from "react";
import './ImportShipment.css'
import { alpha, Alert , Box, Button, Collapse, Container, Fade, FormControl, IconButton, InputAdornment, InputBase, InputLabel, MenuItem, Modal, Paper, Select, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, Snackbar } from "@mui/material";
import PrimarySearchAppBar from "../../Component/AppBar/AppBar";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MyTable from "../../Component/MyTable";
import { Delete, Edit, ExpandLess, ExpandMore } from "@mui/icons-material";
import ApiService from "../../Service/ApiService";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'black',
    width: '100%',
    backgroundColor: 'white',
    '& .MuiInputBase-input': {
      padding: '10px',
      // vertical padding + font size from searchIcon
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12vw',
        '&:focus': {
          width: '20vw',
        },
      },
    },
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    margin: 5,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const columns = [
    { id: 'collapseAction', label: '', align: 'center'},
    { id: 'stt', label: 'STT', minWidth: 50, align: 'center'},
    // { id: 'id', label: 'ID đơn nhập hàng', minWidth: 80, align: 'center' },
    { id: 'suppiler', label: 'Nhà cung cấp', align: 'center' },
    { id: 'product_quantity', label: 'Số lượng mặt hàng', align: 'center' },
    { id: 'totalPrice', label: 'Tổng giá trị', align: 'center', format: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) },
    { id: 'createdAt', label: 'Ngày tạo đơn', align: 'center', format: (value) => Intl.DateTimeFormat('vi-VN').format(new Date(value))},
    { id: 'action', label: '', align: 'center' },
];

const expandColumns = [
    { id: 'productName', label: 'Tên sản phẩm'},
    { id: 'quantity', label: 'Số lượng', align: 'center'},
    { id: 'totalPrice', label: 'Tổng giá trị', align: 'center', format: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) },
]

// function createExpandRows(id, importshipmentId, productName, quantity, totalPrice) {
//     return {id, importshipmentId, productName, quantity, totalPrice};
// }

// const rows = [
//     createData('IM001', 150, 50000000, new Date(2024, 5, 10)),
//     createData('IM002', 200, 75000000, new Date(2024, 5, 11)),
//     createData('IM003', 120, 30000000, new Date(2024, 5, 12)),
//     createData('IM004', 80, 16000000, new Date(2024, 5, 13)),
//     createData('IM005', 300, 90000000, new Date(2024, 5, 14)),
//     createData('IM006', 50, 10000000, new Date(2024, 5, 15)),
//     createData('IM007', 400, 120000000, new Date(2024, 5, 16)),
//     createData('IM008', 75, 15000000, new Date(2024, 5, 17)),
//     createData('IM009', 220, 66000000, new Date(2024, 5, 18)),
//     createData('IM010', 130, 39000000, new Date(2024, 5, 19))
// ];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function ImportShipment() {
    const [filterDate, setFilterDate] = useState();
    const [search, setSearch] = useState('');
    const [rows, setRows] = React.useState([]);
    const [listSupplier, setListSupplier] = React.useState([]);
    const [listProduct, setListProduct] = React.useState([]);
    const [shipmentItemsFields, setShipmentItemFields] = useState([{ id: Date.now() }]);
    const [removeFilterVisible, setRemoveFilterVisible] = useState(false);
    const refInput = useRef({});
    const shipmentItemsFieldRefs = useRef({});

    useEffect(() => {
        fetchRows();
    }, []);

    useEffect(() => {
        console.log(filterDate);
    }, [filterDate]);

    const handleChangeSupplier = async ({target}) => {
        refInput.current[target.name] = target.value;
        updateProduct(target.value);
        console.log(target.value)
        console.log(refInput);
    }

    const handleChangeCreatedDate = (value) => {
        refInput.current['createdAt'] = `${value.$y}-${(value.$M + 1).toString().padStart(2, '0')}-${value.$D.toString().padStart(2, '0')}`;
        console.log(refInput);
    }

    const [openModalAdd, setOpenModalAdd] = useState(false);

    const handleOpenModalAdd = async () => {
        setOpenModalAdd(true);
        setListSupplier(await ApiService.getAllSupplier());
        refInput.current = {};
        shipmentItemsFieldRefs.current = {};
        setShipmentItemFields([{ id: Date.now() }]);
    };

    const handleCloseModalAdd = () => setOpenModalAdd(false);

    const updateProduct = async (supplierName) => {
        setListProduct(await ApiService.getProductBySupplierName(supplierName));
        console.log(listProduct);
    }

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const addFields = () => {
        setShipmentItemFields([...shipmentItemsFields, { id: Date.now() }]);
    };

    const removeField = (id) => {
        if (shipmentItemsFields.length === 1) {
            window.alert('Đơn hàng tối thiểu phải có 1 sản phẩm');
            return;
        }
        setShipmentItemFields(shipmentItemsFields.filter((field) => field.id !== id));
        delete shipmentItemsFieldRefs.current[`productName-${id}`];
        delete shipmentItemsFieldRefs.current[`quantity-${id}`];
    };

    const getValues = async (importshipmentId) => {
        const values = shipmentItemsFields.map((field) => ({
            productName: shipmentItemsFieldRefs.current[`productName-${field.id}`]?.value || '',
            quantity: shipmentItemsFieldRefs.current[`quantity-${field.id}`]?.value || 0,
        }));

        const updatedRows = await Promise.all(
            values.map(async (row) => {
                try {
                    const product = await ApiService.getProductById(row.productName);
                    return {
                        importshipmentId: importshipmentId,
                        productName: product?.productName || '',
                        quantity: row.quantity,
                        totalPrice: product?.price * row.quantity,
                    };
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu:', error);
                    return {
                        importshipmentId: '',
                        productName: '',
                        quantity: 0,
                        totalPrice: 0,
                    };
                }
            })
        );
        return updatedRows;// Array of objects with productName and quantity
    };

    const isValidImportShipmentItems = () => {
        return !shipmentItemsFields.some((field) => {
            return shipmentItemsFieldRefs.current[`productName-${field.id}`]?.value === "" 
            || shipmentItemsFieldRefs.current[`quantity-${field.id}`]?.value === "";
        });
    }

    const fetchRows = async () => {
      try {
        const response = await ApiService.getAllImportShipments();

        const updatedRows = await Promise.all(
            response.data.map(async (row) => {
                try {
                    let subTotalPrice = 0;
                    let subExpandRows = [];

                    await Promise.all(
                        row['items'].map(async (idItem) => {
                            const subResponse = await ApiService.getImportShipmentItemsById(idItem);
                            subTotalPrice += subResponse.data.totalPrice;
                            subExpandRows.push(subResponse.data);
                        })
                    )

                    return { 
                        ...row,
                        product_quantity: row['items'].length,
                        totalPrice: subTotalPrice,
                        expandRows: subExpandRows,
                    };
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu:', error);
                    return { 
                        ...row,
                        product_quantity: 0,
                        totalPrice: 0,
                        expandRows: '',
                    };
                }
            })
        );

        console.log(updatedRows);
        setRows(updatedRows);
      } catch (error) {
        console.error("Lỗi khi tải thông tin các Product", error.message);
      }
    };

    const filteredRows = rows.filter(row => {
        const createdAt = dayjs(row.createdAt);
        const selectedDate = filterDate ? dayjs(filterDate) : null;

        return (
            row.suppiler.toLowerCase().includes(search.toLowerCase()) &&
            (selectedDate ? 
               ( createdAt.isAfter(selectedDate, 'day') || createdAt.isSame(selectedDate, 'day') ): true
            ) &&
            createdAt.isBefore(dayjs(), 'day') || createdAt.isSame(dayjs(), 'day')
        );
    });

    const [expandedShipmentId, setExpandedShipmentId] = useState(null);

    const handleExpandRow = (shipmentId) => {
        setExpandedShipmentId((prev) => (prev === shipmentId ? null : shipmentId));
    };

    const handleAddImportShipment = async () => {
        if (refInput.current['createdAt'] !== undefined && refInput.current['supplierId'] !== undefined && isValidImportShipmentItems()) {
            const respond = await ApiService.addImportShipment({createdAt: refInput.current['createdAt'], suppiler: refInput.current['supplierId']});
            const importshipmentId = respond.data['id'];

            const dataImportShipmentItems = await getValues(importshipmentId);
            for (const item of dataImportShipmentItems) {
                console.log(item);
                try {
                    const respondItems = await ApiService.addImportShipmentItems(item);
                    console.log(respondItems.data.id);
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            fetchRows();
            window.alert('Tạo đơn hàng thành công');
            setOpenModalAdd(false);
        } else {
            window.alert('Bạn chưa nhập đủ thông tin');
        }
    }

    const handleDeleteButton = async (id) => {
        await ApiService.deleteImportShipment(id);
        fetchRows();
    }

    const handleEditButton = async (row) => {
        // setSelectedRow(row);
        // setOpenEdit(true);
        // refInput.current = row;
        // setListCategory(await ApiService.getAllCategories());
        // setListSupplier(await ApiService.getAllSupplier());
    };

    return(
        <Container maxWidth="xl" className="ImportShipment" sx={{ width: "100%", height: "auto", display: "flex", flexDirection: "column"}}>
            <Stack className="ImportShipment-bar" sx={{backgroundColor: "#ffffff",padding:"1rem", borderRadius:"0.5rem"}}>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography 
                        sx={{fontWeight: 'bold', fontSize:"25px", paddingLeft:"10px", width:"auto"}} 
                        variant="p">
                            Quản lý nhập hàng
                    </Typography>
                    <Stack direction={"row"} alignItems={"center"}>
                        <Stack className="search-bar" direction={"row"} alignItems={"center"} sx={{marginRight: "0.5rem"}}>
                            <Search>
                                <StyledInputBase sx={{padding:"0rem"}}
                                placeholder="Tìm kiếm"
                                startAdornment={
                                  <InputAdornment className="input-adornment" position="start">
                                    <SearchIcon />
                                  </InputAdornment>
                                }
                                onChange={(e) => setSearch(e.target.value)}
                                inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                        </Stack>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker 
                                views={['year', 'month', 'day']} 
                                sx={{width: "200px", marginRight: "0.5rem"}}
                                value={filterDate}
                                onChange={(v) => {
                                    setFilterDate(v);
                                    setRemoveFilterVisible(true);
                                }}
                                label="Lọc từ ngày" 
                                format="DD/MM/YYYY"
                            />
                        </LocalizationProvider>

                        {removeFilterVisible && (<Button 
                                onClick={() => {
                                    setFilterDate(null);
                                    setRemoveFilterVisible(false);
                                }} 
                                sx={{
                                    color: "white", 
                                    height: "55px", 
                                    backgroundColor: "#d32f2f", 
                                    marginRight: "0.5rem",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    '&:hover': { backgroundColor: "#b71c1c" }
                                }} 
                                variant="contained"
                            >
                                Bỏ lọc
                            </Button>
                        )}
                        
                        <Stack className="btn-add-inventory-bar" direction={"row"} alignItems={"center"}> 
                            <Button 
                                onClick={handleOpenModalAdd} 
                                className="btn-setting" 
                                sx={{color: "white", height:"55px", backgroundColor: "#243642"}} variant="contained">
                                <AddIcon sx={{color: "white"}}/>
                                Thêm đơn nhập hàng
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
                {/* table collapse */}
                <Paper className='my-table' sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: '100%' }}>
                        <Table className='table' stickyHeader aria-label="sticky table">
                        <TableHead className='table-head'>
                            <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    className='table-head-cell'
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                                >
                                {column.label}
                                </TableCell>
                            ))}
                            </TableRow>
                        </TableHead>
                        <TableBody className='table-body'>
                            {filteredRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <Fragment key={index}>
                                        <TableRow hover role="checkbox" tabIndex={-1}>
                                            {columns.map((column) => {
                                            let value = row[column.id];
                                            if (column.id === 'stt') {
                                                value = page * rowsPerPage + index + 1; // Calculate row number
                                            };
                                            if (column.id === 'collapseAction')
                                                return (
                                                    <TableCell key={column.id}>
                                                        <IconButton onClick={() => handleExpandRow(row['id'])}>
                                                        {expandedShipmentId === row['id'] ? <ExpandLess /> : <ExpandMore />}
                                                        </IconButton>
                                                    </TableCell>
                                            );
                                            if (column.id === 'action')
                                                return (
                                                <TableCell key={column.id}>
                                                    <IconButton
                                                    color="default"
                                                    onClick={() => {
                                                        handleEditButton(row)
                                                    }}>
                                                    <Edit />
                                                    </IconButton>
                                                    <IconButton 
                                                    color="default"
                                                    onClick={() => {handleDeleteButton(row.id) ?? '' }}>
                                                    <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            );
                                            return (
                                                <TableCell className='table-body-cell' key={column.id} align={column.align} type={column.type}>
                                                {column.render
                                                    ? column.render(value)
                                                    : column.format
                                                    ? column.format(value)
                                                    : value}
                                                </TableCell>
                                            );
                                            })}
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                                                <Collapse in={expandedShipmentId === row['id']} timeout="auto" unmountOnExit>
                                                    <Box margin={1}>
                                                        <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold'}}>
                                                            Chi Tiết Đơn Nhập Hàng
                                                        </Typography>
                                                        <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                            {expandColumns.map((column) => (
                                                                <TableCell
                                                                    className='table-head-cell'
                                                                key={column.id}
                                                                align={column.align}
                                                                style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: 'medium' }}
                                                                >
                                                                {column.label}
                                                                </TableCell>
                                                            ))}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {row.expandRows
                                                            .map((row, index) => {
                                                                return (
                                                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                                                        {expandColumns.map((column) => {
                                                                            let value = row[column.id];
                                                                            return (
                                                                                <TableCell className='table-body-cell' key={column.id} align={column.align} type={column.type}>
                                                                                {column.render
                                                                                    ? column.render(value)
                                                                                    : column.format
                                                                                    ? column.format(value)
                                                                                    : value}
                                                                                </TableCell>
                                                                            );
                                                                        })}
                                                                    </TableRow>
                                                                );
                                                            })
                                                            }
                                                        </TableBody>
                                                        </Table>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                );
                            })
                            }
                        </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                {/* end table collapse */}
            </Stack>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModalAdd}
                onClose={handleCloseModalAdd}
                closeAfterTransition
            >
                <Fade in={openModalAdd}>
                    <Box sx={style}>
                        <Stack className="template-add-iventory" direction={"column"} alignItems={"center"}>
                            <Typography 
                                sx={{textAlign: 'center', fontWeight: 'bold', fontSize:"20px", width:"100%"}} 
                                variant="p">
                                    Thêm đơn nhập hàng
                            </Typography>
                            <Stack sx={{ marginTop:"1rem", marginBottom:"1rem"}} className="body-infor" flexWrap="wrap" direction={"row"} alignItems={"center"}>
                                <FormControl sx={{margin:"1%", width:"48%" }}>
                                    <InputLabel id="demo-simple-select-helper-label">Nhà cung cấp</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    name="supplierId"
                                    label="Nhà cung cấp"
                                    onChange={handleChangeSupplier}
                                    >
                                        {listSupplier.map((supplier) => {
                                            return (
                                                <MenuItem value={supplier.nameSupplier}>{supplier.nameSupplier}</MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker 
                                        views={['year', 'month', 'day']} 
                                        sx={{margin:"1%", width:"48%" }} 
                                        onChange={(newValue) => {
                                            handleChangeCreatedDate(newValue);
                                        }}
                                        label="Ngày tạo đơn" 
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>
                                {shipmentItemsFields.map((field) => (
                                    <div key={field.id} style={{width: '100%', display: 'flex', alignItems: 'center',}}>
                                        <FormControl sx={{margin:"1%", width:"48%" }}>
                                            <InputLabel id="demo-simple-select-helper-label">Tên sản phẩm</InputLabel>
                                            <Select
                                            labelId="demo-simple-select-helper-label"
                                            id="demo-simple-select-helper"
                                            name="productName"
                                            inputRef={(v) => (shipmentItemsFieldRefs.current[`productName-${field.id}`] = v)}
                                            label="Tên sản phẩm"
                                            >
                                                {listProduct.map((product) => {
                                                    return (
                                                        <MenuItem value={product.id}>{product.productName}</MenuItem>
                                                    );
                                                })}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="Số lượng"
                                            sx={{margin:"1%", width:"42%" }}
                                            inputRef={(v) => (shipmentItemsFieldRefs.current[`quantity-${field.id}`] = v)}
                                            variant="outlined"
                                            type="number"
                                        />
                                        <IconButton 
                                            color="error" 
                                            onClick={() => removeField(field.id)}
                                            sx={{margin:"1%", width:"4%", height: "100%"}}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </div>
                                ))}
                                <Stack direction="row" justifyContent="flex-end" sx={{ width: "100%", marginTop: '1%'}}>
                                    <Button variant="contained" onClick={addFields} style={{ marginRight: '1%' }} sx={{backgroundColor: "#E2F1E7", color: "black", textTransform: 'none',}}>
                                        Thêm sản phẩm
                                    </Button>
                                </Stack>
                            </Stack>
                            <Button
                                className="btn-setting"
                                onClick={handleAddImportShipment}
                                sx={{color: "white", height:"50px", backgroundColor: "#243642"}} variant="contained">
                                Thêm đơn nhập hàng
                            </Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
        </Container>
    )
}
