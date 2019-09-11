var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export default {
  rnd(x) {
    x = x || 1;
    return random() * x;
  },

  sgn(x) {
    return (x < 0) ? -1 : 1;
  },

  max: Math.max,

  min: Math.min,

  mid(x, y, z) {
    return Math.max(x, Math.min(y, z));
  },

  flr: Math.floor,

  cos(x) { // x = 0 - 1
    return Math.cos((x * 2 * 3.1415));
  },

  sin(x) {
    return Math.sin((-x * 2 * 3.1415));
  },

  atan2: Math.atan2,

  sqrt: Math.sqrt,

  abs: Math.abs,

  srand(x) {
    x = x || 0;
    seed = 0;
  },

  band(x, y) {
    return x & y;
  },

  bor(x, y) {
    return x | y;
  },

  bxor(x, y) {
    return x ^ y;
  },

  bnot(x) {
    return ~x;
  },

  shl(x, y) {},

  shr(x, y) {},
}
