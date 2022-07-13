![](https://s15.postimg.org/f8msaljij/Screen_Shot_2016_11_13_at_18_44_52.png)

JSGS is an experimental (WIP) javascript implementation of the Pico-8 fantasy console.

#### Demos
- [http://hello-world-p8.netlify.com/](http://hello-world-p8.netlify.com/)
- [http://cast.netlify.com/](http://cast.netlify.com/)
- [http://3dcamera.netlify.com/](http://3dcamera.netlify.com/)
- [http://fireball.netlify.com/](http://fireball.netlify.com/)

#### What's implemented?
- Graphics api, font
- Math api
- Ram / Ram api
- Reading cartridges, running lua code

#### What's missing / Quirks
- Sound (Help needed)
- sspr function
- Cursor
- stat function
- Not 100% compatible with Pico-8's Lua flavor.
  - No shorthand assignments
  - all() is not implemented (help needed)

#### Extra features
- Multiple screen (canvas) support
- CRT Filter (optional)
- On screen / Touch controller (very naìve now)
- Custom color palette

### How to use?
It's not yet packaged to be used by importing into your project. For now, the only way to run your cartridges
is manually editing the cartridge url in `src/index.js` file. For cloning/installing/running the project, see
"Development" section below.

#### Classes / Options
###### JSGS
The JSGS class is the class which we use for creating pico-8 machine instances. 
```javascript
const machine = new JSGS({
  os: new OS(), // an "OS" instance
  devices: {
    controller: new KeyboardController(), // a "Controller" instance
    ram: new Ram(0x8000), // a "Ram" instance
    cartridge: "http://example.com/cartridge.p8.png", // url to a p8.png cartridge
    screen: [new Screen({ size: 128 })], // An array of "Screen" instances
  },
});
```
  
###### Ram
```javascipt
// instantiate a 32kb ram
const ram = new Ram(0x8000);
```

###### Screen / CRTScreen
```javascript
const screen = new Screen({
  size: 128, // a px size (number)
  palette: Screen.greenPalette // And array of 16 hex colors. Defaults to pico-8 palette
});

// Screen with crt filter
const crtScreen = new CRTScreen({
  size: 128,
});

// Mount to dom
screen.mountCanvas(element);
crtScreen.mountCanvas(element);
```

## Development
### Requirements
For development, you will need [Node.js](http://nodejs.org/) >=6.0.0 and NPM(comes bundled with Node.js) installed on your environment.

### Install
Clone the project and install dependencies:

    $ git clone https://github.com/burakcan/jsgs.git
    $ cd jsgs
    $ npm install

### Start & watch

    $ npm run start-dev

Now you can browse the app at http://localhost:4000

### Build for production

    $ npm run build
