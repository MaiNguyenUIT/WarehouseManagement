class SupplierFilterStrategy {
    filter(data, { search, subfilter }) {
        return data.filter(
            (row) =>
                row.productName.toLowerCase().includes(search.toLowerCase()) &&
                (!subfilter || row.supplierName === subfilter)
        );
    }
}

export default SupplierFilterStrategy;
