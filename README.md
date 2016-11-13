
[JSGS](https://postimg.org/image/tf2j5tudj/)

# JSGS [WIP]
JSGS is an experimental javascript implementation of the Pico-8 fantasy console.

#### Demos
- [http://hello-world-p8.bitballoon.com/](http://hello-world-p8.bitballoon.com/)
- [http://cast.bitballoon.com/](http://cast.bitballoon.com/)
- [http://3dcamera.bitballoon.com/](http://3dcamera.bitballoon.com/)
- [http://fireball.bitballoon.com/](http://fireball.bitballoon.com/)
- [http://otomat.bitballoon.com/](http://otomat.bitballoon.com/)

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
