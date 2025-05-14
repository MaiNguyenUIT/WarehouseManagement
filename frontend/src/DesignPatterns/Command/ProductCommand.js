class ProductCommand {
  constructor(receiver) {
    this.receiver = receiver;
  }

  async execute() {
    throw new Error("Execute method must be implemented");
  }
}

export default ProductCommand;