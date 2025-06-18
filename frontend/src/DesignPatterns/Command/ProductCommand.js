class ProductCommand {
  constructor(receiver) {
    this.receiver = receiver;
  }

  async execute() {
    throw new Error("Execute method must be implemented");
  }

  async undo() {
    throw new Error("Undo method must be implemented if command supports undo");
  }

  canUndo() {
    return false; // Mặc định không hỗ trợ undo
  }
}

export default ProductCommand;