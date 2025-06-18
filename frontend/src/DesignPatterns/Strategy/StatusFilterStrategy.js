import FilterStrategy from "./FilterStrategy";

class StatusFilterStrategy extends FilterStrategy {
    filter(data, { search, subfilter }) {
        return data.filter((row) => {
            const matchesSearch = row.productName.toLowerCase().includes(search.toLowerCase());
            
            if (!subfilter) {
                return matchesSearch;
            }

            return matchesSearch && row.productStatus === subfilter;
        });
    }
}

export default StatusFilterStrategy;
