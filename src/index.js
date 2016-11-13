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

const machine = new JSGS({
  os: new OS(),
  devices: {
    controller: new OnScreenController(),
    ram: new Ram(0x8000),
    cartridge: exampleCartridge,
    screens: [
      new Screen({
        element: document.getElementById('screen'),
        size: 512,
      }),
    ],
  },
});
