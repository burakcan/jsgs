export default class Ram {
  constructor(size) {
    this.size = size;
    this.arr = new Uint8Array(size);

    this.api = {
      peek: this.peek.bind(this),
      poke: this.poke.bind(this),
      memset: this.memset.bind(this),
      memcpy: this.memcpy.bind(this),
      memread: this.memread.bind(this),
      memwrite: this.memwrite.bind(this),
      reload: this.reload.bind(this),
      cstore: this.cstore.bind(this),
    };
  }

  ifInRange(addr, fn) {
    if (addr >= 0x00 && addr < this.size) {
      return fn();
    }

    throw new Error(`BAD MEMORY ACCESS! 0x${addr.toString(16)}`);
  }

  peek(addr) {
    return this.ifInRange(addr, () => this.arr[addr]);
  }

  poke(addr, val) {
    return this.ifInRange(addr, () => this.arr[addr] = val);
  }

  memset(dest_addr, value, length) {
    this.arr.fill(value, dest_addr, dest_addr + length);
  }

  memread(dest_addr, length) {
    return this.arr.slice(dest_addr, dest_addr + length);
  }

  memwrite(dest_addr, data) {
    const length = data.length - 1;
    for (let i = 0; i <= length; i++) {
      this.arr[dest_addr + i] = data[i];
    }
  }

  memcpy(dest_addr, source_addr, length) {
    length = length - 1;
    for (let i = 0; i <= length; i++) {
      this.arr[dest_addr + i] = this.arr[source_addr + i];
    }
  }

  reload() {}

  cstore() {}
}
