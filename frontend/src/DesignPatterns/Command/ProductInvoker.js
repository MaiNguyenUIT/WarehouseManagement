class ProductInvoker {
  constructor() {
    this.command = null;
    this.history = []; // Lịch sử các command đã thực thi
    this.currentIndex = -1; // Index hiện tại trong lịch sử
  }

  setCommand(command) {
    this.command = command;
    return this; // Cho phép chain
  }

  async executeCommand() {
    if (this.command) {
      await this.command.execute();
      
      // Thêm command vào lịch sử nếu có thể undo
      if (this.command.canUndo && this.command.canUndo()) {
        // Xóa các command sau currentIndex (nếu user đã undo rồi execute command mới)
        this.history = this.history.slice(0, this.currentIndex + 1);
        this.history.push(this.command);
        this.currentIndex++;
        
        // Giới hạn số lượng command trong lịch sử (tránh memory leak)
        const maxHistorySize = 50;
        if (this.history.length > maxHistorySize) {
          this.history.shift();
          this.currentIndex--;
        }
      }
    } else {
      console.error("No command set to execute.");
    }
  }

  async undo() {
    if (this.canUndo()) {
      const command = this.history[this.currentIndex];
      if (command && command.undo) {
        await command.undo();
        this.currentIndex--;
        return true;
      }
    }
    return false;
  }

  async redo() {
    if (this.canRedo()) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      if (command && command.execute) {
        await command.execute();
        return true;
      }
    }
    return false;
  }

  canUndo() {
    return this.currentIndex >= 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  clearHistory() {
    this.history = [];
    this.currentIndex = -1;
  }

  getHistorySize() {
    return this.history.length;
  }
}

export default ProductInvoker;