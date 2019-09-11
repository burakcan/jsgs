import getGraphicsFunctions from './graphics.lib';
import getSoundFunctions from './sound.lib';
import mathLib from './math.lib';
import coreLib from './core.lib';
import readCartridge from './readCartridge.lib';
import lua2js from 'lua2js';
import escodegen from 'escodegen';
import estraverse from 'estraverse';

export default class OS {
  constructor(machine) {
    this.$ = {};
    this.bootTime = 0;
  }

  sendEvent(type, machine, payload) {
    switch (type) {
      case 'boot':
        this.boot(machine);
        break;

      case 'cartridgeMount':
        this.boot(machine).then(
          () => this.cartridgeMount(machine)
        );
        break;

      case 'cartridgeEject':
        this.boot(machine).then(
          () => this.cartridgeEject(machine)
        );
        break;
    }

    return this;
  }

  boot(machine) {
    if (this.bootProgress) return this.bootProgress;
    this.bootProgress = new Promise(resolve => {
      this.$ = Object.assign(
        this.$,
        lua2js.stdlib,
        machine.devices.ram.api,
        coreLib,
        mathLib,
        getGraphicsFunctions(machine.devices.ram),
        getSoundFunctions(machine.devices.ram),
        machine.devices.controller.api,
        {
          time: this.getUptime.bind(this),
          t:this.getUptime.bind(this)
        }
      );

      // flush defaults to ram
      this.$.clip();
      this.$.color(6);

      // return resolve(this); // DEVELOPMENT

      let i = 1;

      const loadingAnim = setInterval(() => {
        this.$.cls();
        if (i >= 98) {
          this.bootTime = Date.now();
          clearInterval(loadingAnim);
          resolve(this);
        } else {
          this.$.print("javascript gaming system", 4, 4, 8);
          if (i >= 20) this.$.print("checking devices", 4, 12, 7);

          if (i >= 40) {
            this.$.print('booting' + '.'.repeat(Math.floor((i-40) / 15)), 4, 20, 7);
          }

          i += parseInt(Math.random() * 2);
        }
      }, 1);
    });

    return this.bootProgress;
  }

  cartridgeMount(machine) {
    const { code, cartridge } = machine.devices;

    if(code != null) {
      this.$.print("running code", 4, 4, 7);
      let obj = {code:code};
      setTimeout(() => this.runCartridge(obj), 500)
    } else {

      this.$.print("reading cartridge", 4, 4, 7);

      this
        .loadCartridge(cartridge, machine)
        .then(cartridgeData =>
          setTimeout(() => this.runCartridge(cartridgeData), 500)
        );
    }
  }

  cartridgeEject(machine) {
    console.log('ejected', machine);
  }

  loadCartridge(url, machine) {
    const png = new PngToy();

    return (
      png
        .fetch(url)
        .then(() => png.decode().then(readCartridge))
        .then(cartridgeData => {
          let gfxi = 0;
          const gfxData = cartridgeData.gfx + cartridgeData.map + cartridgeData.gff;
          for (let x = 0x0000; x <= 0x30ff; x++) {
            machine.devices.ram.poke(x,
              parseInt(`${gfxData[gfxi]}${gfxData[gfxi+1]}`, 16)
            );
            gfxi = gfxi + 2;
          }

          let sfxi = 0;
          for (let x = 0x3200; x <= 0x42ff; x++) {
            machine.devices.ram.poke(x,
              parseInt(`${cartridgeData.sfx[sfxi]}${cartridgeData.sfx[sfxi+1]}`, 16)
            );
            sfxi = sfxi + 2;
          }

          return cartridgeData;
        })
    );
  }

  runCartridge(____cartridgeData____) {
    this.$.cls();
    const ____BLACKLIST____ =
      Object
        .keys(window)
        .join()
        .replace('console', '_');

    const ____self____ = this;
    const ____api____ = Object.keys(this.$).map(key => {
      if (typeof ____self____.$[key] === 'function') {
        return `
          function ${ key }() {
            return ____self____.$['${key}'].apply(null, arguments);
          }
        `;
      }
      return '';
    });

    ____api____.push(`var __lua = ____self____.$.__lua`);

    /*h*/eval(`
      (function(${____BLACKLIST____}) {
        ${ ____api____.join(';') }

        function _init() {}
        function _update() {}
        function _draw() {}

        function add(tbl, item) {
          console.log(tbl, item);
          tbl[Object.keys(tbl).length] = item;
        }

        function all() {
          return [() => {}, () => {}, () => {}];
        }

        function count(tbl) {
          return Object.keys(tbl).length;
        }

        function menuitem() {}

        ${ this.transpileLua(____cartridgeData____.code).replace('~=', '!=') }

        _init()
        _update();
        _draw();

        ____self____._draw = _draw;
        ____self____._update = _update;
      })();
     `);
  }

  _update() {}
  _draw() {}

  update() {
    this._update();
    this._draw();
  }

  transpileLua(code) {
    const ast = lua2js.parse(code, {
      decorateLuaObjects: false,
      encloseWithFunctions: false,
      forceVar: false,
      luaCalls: false,
      luaOperators: false,
      noSharedObjects: false,
      allowRegularFunctions: true,
    });

    const result = escodegen.generate(ast);
    const globalVars = [];

    estraverse.traverse(ast, {
      enter(node, parent) {
        if (node.type === "AssignmentExpression" &&
            node.left.name &&
            !globalVars.includes(node.left.name)
        ) {
          globalVars.push(node.left.name);
        }
      },
    });

    return `
      var ${globalVars.join()};
      ${result.substring(1, result.length - 1)}
    `;
  }

  getUptime() {
    return (Date.now() - this.bootTime) / 1000;
  }
}
