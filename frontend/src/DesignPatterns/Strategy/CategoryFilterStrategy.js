import FilterStrategy from "./FilterStrategy";

class CategoryFilterStrategy extends FilterStrategy {
    filter(data, { search, subfilter }) {
        return data.filter(
            (row) =>
                row.productName.toLowerCase().includes(search.toLowerCase()) &&
                (!subfilter || row.categoryName === subfilter)
        );
    }
}

export default CategoryFilterStrategy;
