export default {
  rnd(x) {
    return Math.random() * x;
  },

  max: Math.max,

  min: Math.min,

  mid(x, y, z) {
    return Math.max(x, Math.min(y, z));
  },

  flr: Math.floor,

  cos(x) { // x = 0 - 1
    return Math.cos((x * 360) * (3.1415/180));
  },

  sin(x) {
    return Math.sin((-x * 360) * (3.1415/180));
  },

  atan2: Math.atan2,

  sqrt: Math.sqrt,

  abs: Math.abs,

  srand(x) {},

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
