class ProductInvoker {
  constructor() {
    this.command = null;
  }

  setCommand(command) {
    this.command = command;
    return this; // Cho phép chain
  }

  async executeCommand() {
    if (this.command) {
      await this.command.execute();
    } else {
      console.error("No command set to execute.");
    }
  }
}

export default ProductInvoker;