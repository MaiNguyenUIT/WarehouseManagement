class FilterStrategy {
    filter(data, options) { // eslint-disable-line no-unused-vars
        throw new Error("Filter method must be implemented by subclasses");
    }
}

export default FilterStrategy;