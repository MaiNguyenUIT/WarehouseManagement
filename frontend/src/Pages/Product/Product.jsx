import React, { useEffect, useRef, useState } from "react";
import './Product.css'
import { Alert, alpha, Box, Button, Container, Fade, FormControl, IconButton, InputAdornment, InputBase, InputLabel, MenuItem, Modal, Select, Snackbar, Stack, styled, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MyTable from "../../Component/MyTable";
import ProductManagerFacade from "../../Service/ProductManagerFacade"; // Adjust the import path
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from "react-router-dom";

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
  { id: 'stt', label: 'STT', minWidth: 50, align: 'center'},
  { id: 'productName', label: 'Tên sản phẩm', minWidth: 100, align: 'left' },
  { id: 'categoryName', label: 'Loại', align: 'center' },
  { id: 'supplierName', label: 'Nhà cung cấp', align: 'center' },
  { id: 'inventory_quantity', label: 'Số lượng', align: 'center'},
  { id: 'unit', label: 'Đơn vị', align: 'center'},
  { id: 'price', label: 'Giá', minWidth: 100, align: 'center', format: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) },
  { id: 'production_date', label: 'Ngày sản xuất', minWidth: 100, align: 'center', format: (value) => Intl.DateTimeFormat('vi-VN').format(new Date(value)) },
  { id: 'expiration_date', label: 'Ngày hết hạn', minWidth: 100, align: 'center', format: (value) => value ? Intl.DateTimeFormat('vi-VN').format(new Date(value)) : '' },
  { id: 'productStatus', label: 'Trạng thái', align: 'center' },
  { id: 'action', label: '', align: 'center' },
];

const productStatus = [
    "IN_STOCK",
    "OUT_STOCK"
];

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

const Product = () => {
    const [filter, setFilter] = useState("");
    const [subfilter, setSubFilter] = useState("");
    const [subFilterVisible, setSubFilterVisible] = useState(false);
    const [search, setSearch] = useState('');
    const refInput = useRef({});
    const [listCategory, setListCategory] = useState([]);
    const [listSupplier, setListSupplier] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const nav = useNavigate();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const [images, setImages] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchRows();
    }, []);

    const handleFilterChange = async (e) => {
        const value = e.target.value;
        setFilter(value);
        setSubFilter("");
        setSubFilterVisible(value !== '');
        try {
            const categories = await ProductManagerFacade.fetchCategories();
            const suppliers = await ProductManagerFacade.fetchSuppliers();
            setListCategory(categories);
            setListSupplier(suppliers);
        } catch (error) {
            console.error("Error fetching filters:", error.message);
            setSnackbarMessage("Failed to load filters");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleSubFilterChange = ({target}) => {
        const value = target.value;
        setSubFilter(value);
    };

    const handleChange = ({target}) => {
        refInput.current[target.name] = target.value;
    };

    const handleChangeProductionDate = (value) => {
        refInput.current['production_date'] = `${value.$y}-${(value.$M + 1).toString().padStart(2, '0')}-${value.$D.toString().padStart(2, '0')}`;
    };

    const handleChangeExpirationDate = (value) => {
        refInput.current['expiration_date'] = `${value.$y}-${(value.$M + 1).toString().padStart(2, '0')}-${value.$D.toString().padStart(2, '0')}`;
    };

    const handleAddProduct = async () => {
        if (refInput.current['productName'] &&
            refInput.current['categoryId'] &&
            refInput.current['supplierId'] &&
            refInput.current['price']) {
            try {
                const response = await ProductManagerFacade.addProductWithImage(refInput.current, images);
                if (response.status === 201) {
                    setOpen(false);
                    setRows(await ProductManagerFacade.fetchProducts());
                    setSnackbarMessage("Thêm sản phẩm thành công!");
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                }
            } catch (error) {
                console.error("Error adding product:", error.message);
                setSnackbarMessage("Lỗi khi thêm sản phẩm. Vui lòng thử lại.");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } else {
            setSnackbarMessage("Vui lòng điền đầy đủ thông tin bắt buộc.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            const response = await ProductManagerFacade.updateProductWithImage(selectedRow.id, refInput.current, images);
            if (response.status === 200) {
                setOpenEdit(false);
                setRows(await ProductManagerFacade.fetchProducts());
                setSnackbarMessage("Cập nhật sản phẩm thành công!");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error("Error updating product:", error.message);
            setSnackbarMessage("Lỗi khi cập nhật sản phẩm. Vui lòng thử lại.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleDeleteButton = async (id) => {
        try {
            const { updatedProducts } = await ProductManagerFacade.deleteAndRefresh(id);
            setRows(updatedProducts);
            setSnackbarMessage("Xóa sản phẩm thành công!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error deleting product:", error.message);
            setSnackbarMessage("Lỗi khi xóa sản phẩm.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleEditButton = async (row) => {
        setSelectedRow(row);
        refInput.current = { ...row };
        setImages(null);
        setPreviewUrl(row.image || null);
        try {
            const categories = await ProductManagerFacade.fetchCategories();
            const suppliers = await ProductManagerFacade.fetchSuppliers();
            setListCategory(categories);
            setListSupplier(suppliers);
            setOpenEdit(true);
        } catch (error) {
            console.error("Error loading edit modal:", error.message);
            setSnackbarMessage("Lỗi khi tải dữ liệu chỉnh sửa.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleClickRow = (row) => {
        nav('/app/product/detail/' + row.id);
    };

    const handleOpen = async () => {
        setOpen(true);
        setImages(null);
        setPreviewUrl(null);
        refInput.current = {};
        try {
            const categories = await ProductManagerFacade.fetchCategories();
            const suppliers = await ProductManagerFacade.fetchSuppliers();
            setListCategory(categories);
            setListSupplier(suppliers);
        } catch (error) {
            console.error("Error opening modal:", error.message);
            setSnackbarMessage("Lỗi khi mở modal thêm sản phẩm.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
        fetchRows();
    };

    const fetchRows = async () => {
        try {
            const products = await ProductManagerFacade.fetchProducts();
            setRows(products);
        } catch (error) {
            console.error("Error fetching products:", error.message);
            setSnackbarMessage("Lỗi khi tải danh sách sản phẩm.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImages(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const filteredRows = rows.filter(row => 
        row.productName.toLowerCase().includes(search.toLowerCase()) &&
        ((filter !== "" && subfilter !== "") ? (filter === 'Loại' ? row.categoryName === subfilter : row.supplierName === subfilter) : true)
    );

    return (
        <Container maxWidth="xl" className="Product" sx={{ width: "100%", height: "auto", display: "flex", flexDirection: "column"}}>
            <Stack className="product-bar" sx={{backgroundColor: "#ffffff", padding:"1rem", borderRadius:"0.5rem"}}>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography 
                        sx={{fontWeight: 'bold', fontSize:"25px", paddingLeft:"10px", width:"auto"}} 
                        variant="p">
                            Quản lý sản phẩm
                    </Typography>
                    <Stack direction={"row"} alignItems={"center"}>
                        <Stack className="search-bar" direction={"row"} alignItems={"center"}>
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

                        <Stack className="filter-bar" direction={"row"} alignItems={"center"}> 
                            <FormControl sx={{width:"200px", marginLeft:"0.5rem", marginRight: "0.5rem"}}>
                                <InputLabel sx={{
                                    "&.Mui-focused": { 
                                        color: "#297342" 
                                    }}} 
                                    id="demo-simple-select-label">
                                        Lọc theo
                                </InputLabel>
                                <Select
                                    sx={{
                                        backgroundColor:"white", 
                                        border:"none",
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#297342',
                                        },
                                    }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={filter}
                                    label="Lọc theo"
                                    onChange={handleFilterChange}
                                >
                                    <MenuItem value="">
                                        <em>Không chọn</em>
                                    </MenuItem>
                                    <MenuItem value={"Loại"}>Loại</MenuItem>
                                    <MenuItem value={"Nhà cung cấp"}>Nhà cung cấp</MenuItem>
                                </Select>
                            </FormControl>

                            {subFilterVisible && (
                                <FormControl sx={{ width: "200px", marginRight: "0.5rem" }}>
                                    <InputLabel id="sub-filter-label">
                                        {filter === 'Loại' ? 'Chọn loại' : 'Chọn nhà cung cấp'}
                                    </InputLabel>
                                    <Select
                                        labelId="sub-filter-label"
                                        id="sub-filter"
                                        value={subfilter}
                                        label={filter === 'Loại' ? 'Chọn loại' : 'Chọn nhà cung cấp'}
                                        onChange={handleSubFilterChange}
                                    >
                                        <MenuItem value="">
                                            <em>Không chọn</em>
                                        </MenuItem>
                                        {filter === 'Loại' ? (
                                            listCategory.map((category) => (
                                                <MenuItem key={category.id} value={category.categoryName}>{category.categoryName}</MenuItem>
                                            ))
                                        ) : (
                                            listSupplier.map((supplier) => (
                                                <MenuItem key={supplier.id} value={supplier.nameSupplier}>{supplier.nameSupplier}</MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            )}
                        </Stack>
                        <Stack className="btn-add-inventory-bar" direction={"row"} alignItems={"center"}> 
                            <Button 
                                onClick={handleOpen} 
                                className="btn-setting" 
                                sx={{color: "white", height:"55px", backgroundColor: "#243642"}} 
                                variant="contained">
                                <AddIcon sx={{color: "white"}}/>
                                Thêm sản phẩm
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
                <MyTable 
                    tableColumns={columns} 
                    tableRows={filteredRows} 
                    handleDeleteButton={handleDeleteButton} 
                    handleEditButton={handleEditButton} 
                    handleClickRow={handleClickRow}
                />
            </Stack>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Stack className="template-add-iventory" direction={"column"} alignItems={"center"}>
                            <Typography 
                                sx={{textAlign: 'center', fontWeight: 'bold', fontSize:"20px", width:"100%"}} 
                                variant="p">
                                    Thêm sản phẩm
                            </Typography>
                            <Stack sx={{ marginTop:"1rem", marginBottom:"1rem"}} className="body-infor" flexWrap="wrap" direction={"row"} alignItems={"center"}>
                                <TextField sx={{margin:"1%", width:"100%"}} onChange={handleChange} name="productName" label="Tên sản phẩm" variant="outlined" />
                                <FormControl sx={{margin:"1%", width:"48%" }}>
                                    <InputLabel id="demo-simple-select-helper-label">Loại</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        name="categoryId"
                                        label="Loại"
                                        onChange={handleChange}
                                    >
                                        {listCategory.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>{category.categoryName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{margin:"1%", width:"48%" }}>
                                    <InputLabel id="demo-simple-select-helper-label">Nhà cung cấp</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        name="supplierId"
                                        label="Nhà cung cấp"
                                        onChange={handleChange}
                                    >
                                        {listSupplier.map((supplier) => (
                                            <MenuItem key={supplier.id} value={supplier.id}>{supplier.nameSupplier}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField sx={{margin:"1%", width:"31%" }} onChange={handleChange} name="unit" label="Đơn vị" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"31%" }} onChange={handleChange} name="inventory_quantity" label="Số lượng" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"32%" }} onChange={handleChange} name="price" label="Giá" variant="outlined" />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker 
                                        views={['year', 'month', 'day']} 
                                        sx={{margin:"1%", width:"48%" }} 
                                        onChange={handleChangeProductionDate}
                                        label="Ngày sản xuất" 
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker 
                                        views={['year', 'month', 'day']} 
                                        sx={{margin:"1%", width:"48%" }} 
                                        onChange={handleChangeExpirationDate}
                                        label="Ngày hết hạn" 
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>
                                <TextField sx={{margin:"1%", width:"100%"}} onChange={handleChange} multiline name="description" label="Mô tả sản phẩm" variant="outlined" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{margin: '1%', width: "100%"}}
                                />
                                {previewUrl && (
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 120,
                                            height: 100,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            boxShadow: 1,
                                        }}
                                    >
                                        <img
                                            src={previewUrl}
                                            alt="preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Box>
                                )}
                            </Stack>
                            <Button 
                                className="btn-setting"
                                onClick={handleAddProduct}
                                sx={{color: "white", height:"50px", backgroundColor: "#243642"}} 
                                variant="contained">
                                Thêm sản phẩm
                            </Button>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openEdit}
                onClose={() => {
                    setOpenEdit(false);
                    fetchRows();
                }}
                closeAfterTransition
            >
                <Fade in={openEdit}>
                    <Box sx={style}>
                        <Stack className="template-add-iventory" direction={"column"} alignItems={"center"}>
                            <Typography 
                                sx={{textAlign: 'center', fontWeight: 'bold', fontSize:"20px", width:"100%"}} 
                                variant="p">
                                    Cập nhật sản phẩm
                            </Typography>
                            <Stack sx={{ marginTop:"1rem", marginBottom:"1rem"}} className="body-infor" flexWrap="wrap" direction={"row"} alignItems={"center"}>
                                <TextField sx={{margin:"1%", width:"100%"}} onChange={handleChange} defaultValue={selectedRow?.productName || ''} name="productName" label="Tên sản phẩm" variant="outlined" />
                                <FormControl sx={{margin:"1%", width:"48%" }}>
                                    <InputLabel id="demo-simple-select-helper-label">Loại</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        name="categoryId"
                                        defaultValue={selectedRow?.categoryId ?? ''}
                                        label="Loại"
                                        onChange={handleChange}
                                    >
                                        {listCategory.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>{category.categoryName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{margin:"1%", width:"48%" }}>
                                    <InputLabel id="demo-simple-select-helper-label">Nhà cung cấp</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        name="supplierId"
                                        defaultValue={selectedRow?.supplierId ?? ''}
                                        label="Nhà cung cấp"
                                        onChange={handleChange}
                                    >
                                        {listSupplier.map((supplier) => (
                                            <MenuItem key={supplier.id} value={supplier.id}>{supplier.nameSupplier}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField sx={{margin:"1%", width:"31%" }} onChange={handleChange} defaultValue={selectedRow?.unit || ''} name="unit" label="Đơn vị" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"31%" }} onChange={handleChange} defaultValue={selectedRow?.inventory_quantity || 0} name="inventory_quantity" label="Số lượng" variant="outlined" />
                                <TextField sx={{margin:"1%", width:"32%" }} onChange={handleChange} defaultValue={selectedRow?.price || 0} name="price" label="Giá" variant="outlined" />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker 
                                        views={['year', 'month', 'day']} 
                                        sx={{margin:"1%", width:"48%" }} 
                                        onChange={handleChangeProductionDate}
                                        defaultValue={selectedRow?.production_date ? dayjs(selectedRow.production_date) : null}
                                        label="Ngày sản xuất" 
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker 
                                        views={['year', 'month', 'day']} 
                                        sx={{margin:"1%", width:"48%" }}
                                        onChange={handleChangeExpirationDate}
                                        defaultValue={selectedRow?.expiration_date ? dayjs(selectedRow.expiration_date) : null}
                                        label="Ngày hết hạn" 
                                        format="DD/MM/YYYY"
                                    />
                                </LocalizationProvider>
                                <TextField sx={{margin:"1%", width:"100%"}} onChange={handleChange} defaultValue={selectedRow?.description || ''} multiline name="description" label="Mô tả sản phẩm" variant="outlined" />
                                <FormControl sx={{margin:"1%", width:"48%" }}>
                                    <InputLabel id="demo-simple-select-helper-label">Trạng thái</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        name="productStatus"
                                        defaultValue={selectedRow?.productStatus ?? ''}
                                        label="Trạng thái"
                                        onChange={handleChange}
                                    >
                                        {productStatus.map((status, index) => (
                                            <MenuItem key={index} value={status}>{status}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{margin: '1%', width: "48%"}}
                                />
                                {previewUrl && (
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 120,
                                            height: 100,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            boxShadow: 1,
                                        }}
                                    >
                                        <img
                                            src={previewUrl}
                                            alt="preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Box>
                                )}
                            </Stack>
                            <Button 
                                className="btn-setting"
                                onClick={handleUpdateProduct}
                                sx={{color: "white", height:"50px", backgroundColor: "#243642"}} 
                                variant="contained">
                                Cập nhật
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

export default Product;