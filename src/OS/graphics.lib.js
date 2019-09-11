import font from './font.lib';

export default function getGraphicsFunctions(ram) {
  function memoize(fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments),
            hash = "",
            i = args.length;
        let currentArg = null;
        while (i--) {
            currentArg = args[i];
            hash += (currentArg === Object(currentArg)) ?
            JSON.stringify(currentArg) : currentArg;
            fn.memoize || (fn.memoize = {});
        }
        return (hash in fn.memoize) ? fn.memoize[hash] :
        fn.memoize[hash] = fn.apply(this, args);
    };
  }

  function _color8toHexStr(color8) {
    return (
      (str => '00'.substring(0, 2 - str.length) + str)
      (color8.toString(16))
    );
  }

  const flags = [0x1, 0x2, 0x4, 0x8, 0x10, 0x20, 0x40, 0x80];
  const initialColors = [
    0x00, 0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70,
    0x80, 0x90, 0xA0, 0xB0, 0xC0, 0xD0, 0xE0, 0xF0,
  ];

  const color8toHexStr = memoize(_color8toHexStr);

  function pget(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);

    if (
      x < 0 || x > 127 ||
      y < 0 || y > 127
    ) {
      return 0;
    }

    const addr = 0x6000 + (64 * y) + Math.floor(x / 2);
    const side = x % 2 === 0 ? 'left' : 'right';

    if (side === 'left') {
      return parseInt(color8toHexStr(ram.peek(addr))[0], 16);
    } else if (side === 'right') {
      return parseInt(color8toHexStr(ram.peek(addr))[0], 16);
    }
  }

  function pset(x, y, colorIndex, color8) {
    const xSign = ram.arr[0x5f28] === 1 ? -1 : 1;
    const ySign = ram.arr[0x5f2a] === 1 ? -1 : 1;
    const camX = ram.arr[0x5f29] * xSign;
    const camY = ram.arr[0x5f2b] * ySign;
    const cx1 = ram.arr[0x5f20];
    const cy1 = ram.arr[0x5f21];
    const cx2 = ram.arr[0x5f22];
    const cy2 = ram.arr[0x5f23];

    x = Math.floor(x + camX);
    y = Math.floor(y + camY);

    if (
      x < cx1 || x > cx2 ||
      y < cy1 || y > cy2
    ) {
      return false;
    }

    if (colorIndex === undefined) {
      colorIndex = ram.arr[0x5f25]; // default color: color()
    }

    if (!color8) {
      color8 = ram.arr[0x5000 + colorIndex % 16];
    } else {
      color8 = ram.arr[0x5000 + initialColors.indexOf(color8)];
    }

    const addr = 0x6000 + (64 * y) + Math.floor(x / 2);
    const before = ram.arr[addr];
    const left_side = x % 2 === 0 ? true : false;

    if (left_side) {
      ram.arr[addr] = (color8 & 0b11110000) | (before & 0b1111);
    } else {
      ram.arr[addr] = (before & 0b11110000) | ((color8 & 0b11110000) >> 4);
    }
  }

  function cls() {
    ram.memset(0x6000, 0x00, 0x8000 - 0x6000);
  }

  function line(x0, y0, x1, y1, colorIndex){
    x0 = Math.floor(x0);
    y0 = Math.floor(y0);
    x1 = Math.floor(x1);
    y1 = Math.floor(y1);

    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    } else {
      colorIndex = Math.floor(colorIndex);
    }

    let dx = Math.abs(x1-x0);
    let dy = Math.abs(y1-y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx-dy;

    while(true){
      pset(x0, y0, colorIndex);

      if ((x0 === x1) && (y0 === y1)) break;
      const e2 = 2 * err;
      if (e2 >- dy){ err -= dy; x0 += sx; }
      if (e2 < dx){ err += dx; y0 += sy; }
    }
  }

  function rect(x1, y1, x2, y2, colorIndex) {
    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    }

    line(x1, y1, x2, y1, colorIndex);
    line(x1, y1, x1, y2, colorIndex);
    line(x2, y1, x2, y2, colorIndex);
    line(x1, y2, x2, y2, colorIndex);
  }

  function rectfill(x1, y1, x2, y2, colorIndex) {
    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    }

    for (let i = y1; i < y2; i++) {
      for (let j = x1; j < x2 ; j++) {
        pset(j, i, colorIndex);
      }
    }
  }

  function circ(x0, y0, r, colorIndex) {
    x0 = Math.floor(x0);
    y0 = Math.floor(y0);
    r = Math.floor(r);

    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    }

    let x = r - 1;
    let y = 0;
    let rError = 1 - x;

    while (x >= y) {
      pset(x + x0, y + y0, colorIndex);
      pset(y + x0, x + y0, colorIndex);
      pset(-x + x0, y + y0, colorIndex);
      pset(-y + x0, x + y0, colorIndex);
      pset(-x + x0, -y + y0, colorIndex);
      pset(-y + x0, -x + y0, colorIndex);
      pset(x + x0, -y + y0, colorIndex);
      pset(y + x0, -x + y0, colorIndex);
      y++;

      if (rError < 0) {
        rError += 2 * y + 1;
      } else {
        x--;
        rError+= 2 * (y - x + 1);
      }
    }
  }

  function circfill(x0, y0, radius, colorIndex) {
    let x = radius - 1;
    let y = 0;
    let radiusError = 1 - x;

    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    }

    while (x >= y) {
      line(-x + x0, y + y0, x + x0, y + y0, colorIndex);
      line(-y + x0, x + y0, y + x0, x + y0, colorIndex);
      line(-x + x0, -y + y0, x + x0, -y + y0, colorIndex);
      line(-y + x0, -x + y0, y + x0, -x + y0, colorIndex);
      y++;

      if (radiusError < 0) {
        radiusError += 2 * y + 1;
      } else {
        x--;
        radiusError+= 2 * (y - x + 1);
      }
    }
  }

  function mset(celX, celY, sNum) {
    let mapStartAddr = 0x2000; // Map (rows 0-31)

    if (celY >= 32) {
      mapStartAddr = 0x1000;
    }

    const tile = (celY * 128) + celX;
    ram.arr[mapStartAddr + tile] = sNum;
  }

  function mget(celX, celY) {
    celX = Math.floor(celX);
    celY = Math.floor(celY);

    let mapStartAddr = 0x2000; // Map (rows 0-31)

    if (celY >= 32) {
      mapStartAddr = 0x1000;
    }

    const tile = (celY * 128) + celX;
    return ram.arr[mapStartAddr + tile];
  }

  function map(celX, celY, sx, sy, celW, celH, layer) {
    for (let x = celX; x < celX + celW; x++) {
      for (let y = celY; y < celY + celH; y++) {
        const sprNum = mget(x, y);

        if (layer !== undefined && !fget(sprNum, layer)) {
          continue;
        }

        if (sprNum !== 0) {
          spr(sprNum, sx + ((x - celX) * 8), sy + ((y - celY) * 8));
        }
      }
    }
  }

  function spr(n, x, y, w, h, flip_x, flip_y) {
    x = Math.floor(x);
    y = Math.floor(y);

    const sx = (n % 16) * 4;
    const sy = Math.floor(n / 16) * 8;
    const startAddr = 0x0000 + sx + (sy * 64);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j=j+2) {
        const val = ram.arr[startAddr + (64 * i) + j / 2];

        let x1 = flip_x ? x - j + 7 : x + j;
        let x2 = flip_x ? x - j + 6 : x + j + 1;

        let y1 = flip_y ? y - i + 7 : y + i;
        let y2 = y1;

        const val_a = (val >> 4) & 15;
        const val_b = (val) & 15;

        if ((ram.arr[0x5000 + val_a] & 15) == 0) {
          pset(
            x1,
            y1,
            null,
            val_a << 4
          );
        }

        if ((ram.arr[0x5000 + val_b] & 15) == 0) {
          pset(
            x2,
            y2,
            null,
            val_b << 4
          );
        }
      }
    }
  }

  function sget(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);

    const addr = 0x0000 + (64 * y) + Math.floor(x / 2);
    const side = x % 2 === 0 ? 'left' : 'right';

    if (side === 'left') {
      return parseInt(color8toHexStr(ram.peek(addr))[0], 16);
    } else if (side === 'right') {
      return parseInt(color8toHexStr(ram.peek(addr))[0], 16);
    }
  }

  function sset(x, y, colorIndex) {
    x = Math.floor(x);
    y = Math.floor(y);

    const drawPalette = ram.memread(0x5000, 16);

    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    }

    let colorStr;

    const color8 = drawPalette[colorIndex % 16];
    const addr = 0x0000 + (64 * y) + Math.floor(x / 2);
    const beforePoke = color8toHexStr(ram.peek(addr));
    const side = x % 2 === 0 ? 'left' : 'right';

    if (side === 'left') {
      colorStr = color8toHexStr(color8)[0] + beforePoke[1];
    } else if (side === 'right') {
      colorStr = beforePoke[0] + color8toHexStr(color8)[0];
    }

    ram.poke(addr, parseInt(colorStr, 16));
  }

  function print(text, x = 0, y = 0, colorIndex) {
    x = Math.floor(x);
    y = Math.floor(y);
    text = String(text);

    if (colorIndex === undefined) {
      colorIndex = ram.peek(0x5f25);
    }

    text = text.toLowerCase();
    for (let i = 0; i < text.length; i++) {
      const letter = font[text[i]];

      if (!letter) continue;

      for (let j = 0; j < 15; j++) {
        const lx = j % 3;
        const ly = Math.floor(j / 3);

        if (letter[j]) {
          pset(
            lx + x + (i * 4),
            ly + y,
            colorIndex
          );
        }
      }
    }
  }

  function pal(c1, c2, p = 0) {
    if (c1 === undefined && c2 === undefined) {
      ram.memwrite(0x5000, initialColors); // load initial draw palette to ram
      ram.memwrite(0x5f10, initialColors); // load initial screen palette to ram
      return;
    }

    let startAddr = 0x5000; // draw palette

    if (p === 1) {
      startAddr = 0x5f10;
    }

    if(c2 >= 128){
      c2 -= 128;
    }

    const drawPalette = ram.memread(startAddr, 16);
    drawPalette[c1] = initialColors[c2];
    ram.memwrite(startAddr, drawPalette);
  }

  function palt(c, t) {
    if (c === undefined && t === undefined) {
      ram.memwrite(0x5000, initialColors); // load initial draw palette to ram
      palt(0, true);
      return;
    }

    const current = ram.peek(0x5000 + c);
    let str = color8toHexStr(current);

    if (t) {
      str = str[0] + "1";
    } else {
      str = str[0] + "0";
    }

    ram.poke(0x5000 + c, parseInt(str, 16));
  }

  function _getCamera() {
    const xSign = ram.arr[0x5f28] === 1 ? -1 : 1;
    const ySign = ram.arr[0x5f2a] === 1 ? -1 : 1;

    const x = ram.arr[0x5f29];
    const y = ram.arr[0x5f2b];

    return [
      x * xSign,
      y * ySign,
    ];
  }

  function camera(x = 0, y = 0) {
    x = Math.floor(x);
    y = Math.floor(y);

    if (x < 0) { ram.poke(0x5f28, 1) } else { ram.poke(0x5f28, 0) }
    if (y < 0) { ram.poke(0x5f2a, 1) } else { ram.poke(0x5f2a, 0) }

    ram.poke(0x5f29, Math.abs(x));
    ram.poke(0x5f2b, Math.abs(y));
  }

  function _getClip() {
    return [
      ram.arr[0x5f20],
      ram.arr[0x5f21],
      ram.arr[0x5f22],
      ram.arr[0x5f23],
    ];
  }

  function clip(x = 0, y = 0, w = 127, h = 127) {
    x = Math.floor(x);
    y = Math.floor(y);
    w = Math.floor(w);
    h = Math.floor(h);

    ram.poke(0x5f20, x);
    ram.poke(0x5f21, y);
    ram.poke(0x5f22, x + w);
    ram.poke(0x5f23, y + h);
  }

  function color(colorIndex = 0) {
    ram.poke(0x5f25, colorIndex);
  }

  function _getCursor() {
    // TODO: Implement usage of this to print
    return [
      ram.peek(0x5f26),
      ram.peek(0x5f27),
    ];
  }

  function cursor(x, y) {
    // TODO: Implement usage of this to print

    x = Math.floor(x);
    y = Math.floor(y);

    ram.poke(0x5f26, x);
    ram.poke(0x5f27, y);
  }

  function fget(n, f) {
    const addr = 0x3000 + n;

    if (f === undefined) {
      return ram.arr[addr];
    }

    return (ram.arr[addr] & flags[f]) === flags[f];
  }

  function fset(n, f, v) {
    const addr = 0x3000 + n;

    if (arguments.length === 2) {
      return ram.poke(addr, f);
    }

    if (fget(n, f) && v) {
      return;
    }

    if (fget(n, f) && !v) {
      ram.poke(addr, fget(n) - flags[f]);
    }

    if (!fget(n, f) && v) {
      ram.poke(addr, fget(n) + flags[f]);
    }
  }

  function stat() {
    return '';
  }

  ram.memwrite(0x5000, initialColors); // load initial draw palette to ram
  ram.memwrite(0x5f10, initialColors); // load initial screen palette to ram
  palt(0, true);

  return {
    camera,
    clip,
    cls,
    color,
    cursor,
    fget,
    fset,
    pget,
    pset,
    line,
    rect,
    rectfill,
    circ,
    circfill,
    spr,
    sget,
    sset,
    print,
    pal,
    palt,
    map,
    mget,
    mset,
    stat,
  };
}
