class FilterStrategyContext {
    constructor(strategy) {
        this.strategy = strategy;
    }

    filter(data, options) {
        if (!this.strategy) return data; // No strategy, return unfiltered data
        return this.strategy.filter(data, options);
    }
}

export default FilterStrategyContext;
