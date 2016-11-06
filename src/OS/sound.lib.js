export default function getSoundFunctions(ram) {
  function music(n, fadeLen, channelMask) {}

  function sfx(n, channel, offset) {}

  return {
    music,
    sfx,
  };
}
