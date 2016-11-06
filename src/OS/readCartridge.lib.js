// http://www.lexaloffle.com/bbs/?tid=27845

export default function readCartridge($bmp) {
  function pad(byte) {
    "use strict";
    return byte.toString().replace(/^(.(..)*)$/, '0$1');
  }

  function stringy(byte) {
    "use strict";
    return pad(byte.toString(16));
  }

  function buildString(str, len) {
    "use strict";
    var reg = new RegExp('.{1,' + len + '}', 'g');

    str = str.match(reg);
    str.forEach(function (m, idx) {
      str[idx] += "\n";
    });

    return str.join('');
  }

  function decompress(code) {
    "use strict";
    var mode = 0, copy, i = 8, lua = '', codelen = (code.charCodeAt(4) << 8) | code.charCodeAt(5);
    var dict = "\n 0123456789abcdefghijklmnopqrstuvwxyz!#%(){}[]<>+=/*:;.,~_".split('');
    var byte, offset, length, buffer;

    while (lua.length < codelen) {
      byte = code.charCodeAt(i);

      if (mode === 1) {
        lua += code.charAt(i);
        mode = 0;
      } else if (mode === 2) {
        offset = lua.length - ((copy - 60) * 16 + (byte & 15));
        length = (byte >> 4) + 2;
        buffer = lua.substring(offset, offset + length);
        lua   += buffer;
        mode   = 0;
      } else if (byte === 0) {
        mode = 1;
      } else if (byte <= 59) {
        lua += dict[byte - 1];
      } else if (byte >= 60) {
        mode = 2;
        copy = byte;
      }

      i++;
    }

    return lua;
  }

  function getData(bmp) {
    "use strict";
    var gfx = '', map = '', gff = '', music = '', sfx = '', lua  = '', imgData = bmp.bitmap, dataLen = imgData.length, i = 0, n = 0, r, g, b, a, byte, compressed, loop, lastbyte, loops = [], mode, speed, start, end, notes = '', tmp_music = [], track, step, note, version;

    if (bmp.width !== 160 || bmp.height !== 205) {
      return alert('Image is the wrong size.');
    }

    while (i < dataLen) {
      // get the last 2 bytes of each value and shift left if necessary
      r = (imgData[i++] & 3) << 4;
      g = (imgData[i++] & 3) << 2;
      b = (imgData[i++] & 3);
      a = (imgData[i++] & 3) << 6;

      // compile new byte, convert to hex and pad left if needed
      byte = (r | g | b | a);

      if (n < 8192) {
        // change endianness and append to output string
        gfx += stringy(byte).split('').reverse().join('');
      } else if (n < 12288) {
        map += stringy(byte);
      } else if (n < 12544) {
        gff += stringy(byte);
      } else if (n < 12800) {
        track = Math.floor((n - 12544) / 4);
        note  = stringy(byte & 127);

        if (n % 4 === 0) {
          tmp_music.push([null, '']);
        }

        tmp_music[track][0] = stringy(((byte & 128) >> 7 - n % 4) | tmp_music[track][0]);
        tmp_music[track][1] += note;
      } else if (n < 17152) {
        step = (n - 12800) % 68;

        if (step < 64 && n % 2 === 1) {
          note = (byte << 8) + lastbyte;
          notes += (stringy(note & 63) + ((note & 448) >> 6).toString(16) + ((note & 3584) >> 9).toString(16) + ((note & 28672) >> 12).toString(16));
        } else if (step === 64) {
          mode = pad(byte);
        } else if (step === 65) {
          speed = byte;
        } else if (step === 66) {
          start = byte;
        } else if (step === 67) {
          end = byte;
          sfx += mode + stringy(speed) + stringy(start) + stringy(end) + notes + "\n";
          notes = '';
        }
      } else if (n < 32768) {
        if (n === 17152) {
          compressed = (byte === 58);
        }

        lua += String.fromCharCode(byte);
      } else if (n === 32768) {
        version = byte;
      }

      lastbyte = byte;
      n++;
    }

    if (compressed) lua = decompress(lua);
    gfx = buildString(gfx, 128);
    gff = buildString(gff, 256);
    map = buildString(map, 256);

    tmp_music.forEach(function (m) {
      music += m[0] + ' ' + m[1] + "\n";
    });

    const result = {
      version: version,
      code: lua,
      gfx: gfx.replace(/(\r\n|\n|\r)/gm,""),
      gff: gff.replace(/(\r\n|\n|\r)/gm,""),
      map: map.replace(/(\r\n|\n|\r)/gm,""),
      sfx: sfx.replace(/(\r\n|\n|\r)/gm,""),
      music: music.replace(/(\r\n|\n|\r)/gm,""),
    };

    return result;
  }

  return getData($bmp);
};
