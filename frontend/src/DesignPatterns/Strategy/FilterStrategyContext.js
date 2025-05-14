class FilterStrategyContext {
    constructor(strategy) {
        this.strategy = strategy;
    }

    filter(data, options) {
        if (!this.strategy) return data;
        return this.strategy.filter(data, options);
    }
}

export default FilterStrategyContext;
