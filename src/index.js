import 'normalize.css';
import './style.css';
import 'script!./vendor/pngtoy';
import 'script!./vendor/glfx';
import JSGS from './JSGS';
import OS from './OS';
import Ram from './Ram';
import Screen from './Screen';
import CRTScreen from './Screen/CRTScreen';
import KeyboardController from './Controller/Keyboard';
import OnScreenController from './Controller/OnScreen';
import exampleCartridge from './exampleCartridges/zengarden.p8.png';

const screen = new Screen({ size: 128 });
const ram = new Ram(0x8000);
const controller = new KeyboardController();
const os = new OS();

const machine = new JSGS({
  os: os,
  devices: {
    controller: controller,
    ram: ram,
    cartridge: exampleCartridge,
    screens: [screen],
  },
});

screen.mountCanvas(
  document.getElementById('screen')
);
