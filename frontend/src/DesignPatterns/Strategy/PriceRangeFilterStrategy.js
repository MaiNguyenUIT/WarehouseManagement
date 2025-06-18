import FilterStrategy from "./FilterStrategy";

class PriceRangeFilterStrategy extends FilterStrategy {
    filter(data, { search, subfilter }) {
        return data.filter((row) => {
            const matchesSearch = row.productName.toLowerCase().includes(search.toLowerCase());
            
            if (!subfilter || !matchesSearch) {
                return matchesSearch;
            }

            // subfilter format: "min-max" (ví dụ: "10000-50000")
            const [minPrice, maxPrice] = subfilter.split('-').map(price => parseFloat(price));
            const productPrice = parseFloat(row.price);

            if (isNaN(minPrice) || isNaN(maxPrice)) {
                return matchesSearch;
            }

            return productPrice >= minPrice && productPrice <= maxPrice;
        });
    }
}

export default PriceRangeFilterStrategy;
