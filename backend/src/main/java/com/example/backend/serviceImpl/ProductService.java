package com.example.backend.serviceImpl;

import com.example.backend.model.Category;
import com.example.backend.model.Product;
import com.example.backend.model.Supplier;
import com.example.backend.respone.ProductRespone;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.SupplierRepository;
import com.example.backend.request.ProductRequest;
import com.example.backend.utils.factories.ProductFactoryManage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService implements com.example.backend.service.ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public List<ProductRespone> getAllProduct() {
        List<ProductRespone> productRespones = new ArrayList<>();
        List<Product> allProducts = productRepository.findAll();

        for (Product i : allProducts) {
            ProductRespone productRespone = new ProductRespone();

            Category category = null;
            String categoryName = "Không xác định";

            if (i.getCategoryId() != null && !i.getCategoryId().isBlank()) {
                category = categoryRepository.findById(i.getCategoryId()).orElse(null);

                if (category != null) {
                    categoryName = category.getCategoryName();
                } else {

                    System.err.println("WARN: Không tìm thấy Category với ID: " + i.getCategoryId()
                            + " cho Product ID: " + i.getId());
                }
            } else {
                System.err.println("WARN: Product ID: " + i.getId() + " có categoryId null hoặc rỗng.");
            }

            Supplier supplier = null;
            String supplierName = "Không xác định";

            if (i.getSupplierId() != null && !i.getSupplierId().isBlank()) {
                supplier = supplierRepository.findById(i.getSupplierId()).orElse(null);
                if (supplier != null) {
                    supplierName = supplier.getNameSupplier();
                } else {
                    System.err.println("WARN: Không tìm thấy Supplier với ID: " + i.getSupplierId()
                            + " cho Product ID: " + i.getId());
                }
            } else {
                System.err.println("WARN: Product ID: " + i.getId() + " có supplierId null hoặc rỗng.");
            }

            productRespone.setProduction_date(i.getProduction_date());
            productRespone.setProductName(i.getProductName());
            productRespone.setDescription(i.getDescription());
            productRespone.setImage(i.getImage());
            productRespone.setUnit(i.getUnit());
            productRespone.setPrice(i.getPrice());
            productRespone.setInventory_quantity(i.getInventory_quantity());
            productRespone.setExpiration_date(i.getExpiration_date());
            productRespone.setCategoryId(i.getCategoryId());
            productRespone.setSupplierId(i.getSupplierId());
            productRespone.setProductStatus(i.getProductStatus());
            productRespone.setId(i.getId());
            productRespone.setCreatedAt(i.getCreatedAt());
            productRespone.setUpdatedAt(i.getUpdatedAt());

            productRespone.setSupplierName(supplierName);
            productRespone.setCategoryName(categoryName);

            productRespones.add(productRespone);
        }

        return productRespones;
    }

    @Override
    public Product addProduct(ProductRequest product) {

        Product newProduct = ProductFactoryManage.getInstance().createProductFromRequest(product);
        // new Product();
        // newProduct.setProductName(product.getProductName());
        // newProduct.setProduction_date(product.getProduction_date());
        // newProduct.setUnit(product.getUnit());
        // newProduct.setSupplierId(product.getSupplierId());
        // newProduct.setCategoryId(product.getCategoryId());
        // newProduct.setExpiration_date(product.getExpiration_date());
        // newProduct.setImage(product.getImage());
        // newProduct.setDescription(product.getDescription());
        // newProduct.setInventory_quantity(product.getInventory_quantity());
        // newProduct.setPrice(product.getPrice());

        return productRepository.save(newProduct);
    }

    @Override
    public Product updateProduct(String productId, Product product) throws Exception {
        Product existingProduct = this.productRepository.findById(productId)
                .orElseThrow(() -> new Exception("Product not found with id: " + productId));

        existingProduct.setProductName(product.getProductName());
        existingProduct.setProduction_date(product.getProduction_date());
        existingProduct.setExpiration_date(product.getExpiration_date());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setInventory_quantity(product.getInventory_quantity());
        existingProduct.setImage(product.getImage());
        existingProduct.setCategoryId(product.getCategoryId());
        existingProduct.setUnit(product.getUnit());
        existingProduct.setSupplierId(product.getSupplierId());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setProductStatus(product.getProductStatus());
        existingProduct.setUpdatedAt(LocalDateTime.now());
        return this.productRepository.save(existingProduct);
    }

    @Override
    public List<Product> filterProductByCategory(String categoryName) throws Exception {

        Category category = categoryRepository.findBycategoryName(categoryName)
                .orElseThrow(() -> new Exception("Category not found with name: " + categoryName));
        List<Product> products = productRepository.findAll();
        List<Product> filterProduct = new ArrayList<>();
        for (Product product : products) {
            // Quan trọng: So sánh String dùng equals(), không dùng ==
            if (product.getCategoryId() != null && product.getCategoryId().equals(category.getId())) {
                filterProduct.add(product);
            }
        }
        return filterProduct;
    }

    @Override
    public List<Product> filterProductBySupplier(String supplierName) throws Exception {
        Supplier supplier = supplierRepository.findBynameSupplier(supplierName)
                .orElseThrow(() -> new Exception("Supplier not found with name: " + supplierName));

        List<Product> products = productRepository.findAll();
        List<Product> filterProduct = new ArrayList<>();
        for (Product product : products) {
            if (product.getSupplierId() != null && product.getSupplierId().equals(supplier.getId())) {
                filterProduct.add(product);
            }
        }
        return filterProduct;
    }

    @Override
    public Optional<Product> getProductById(String productId) {
        return productRepository.findById(productId);
    }

    @Override
    public List<Product> searchProductByName(String productName) {
        return this.productRepository.searchByProductName(productName);
    }

    @Override
    public void deleteProductById(String productId) {
        if (!productRepository.existsById(productId)) {
            System.err.println("WARN: Attempted to delete non-existent product with ID: " + productId);
            return;
        }
        productRepository.deleteById(productId);
    }
}
