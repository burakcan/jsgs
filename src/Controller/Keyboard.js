export default class KeyboardController {
  constructor() {
    this.keys = [
      37, 39, 38, 40, 90, 88, // Player 1 (left, right, up, down, z, x)
    ];

    this.status = [
      false, false, false, false, false, false, // player 1
      false, false, false, false, false, false, // player 2
    ];

    this.btnpWait = {};

    document.addEventListener('keydown', event => {
      const index = this.keys.indexOf(event.keyCode);
      if (index < 0) return false;

      this.status[index] = true;
    });

    document.addEventListener('keyup', event => {
      const index = this.keys.indexOf(event.keyCode);
      if (index < 0) return false;

      this.status[index] = false;
    });

    this.api = {
      btn: this.btn.bind(this),
      btnp: this.btnp.bind(this),
    };
  }

  btn(which, player = 0) {
    return this.status[which];
  }

  btnp(which, player = 0) {
    const pressed = this.btn(which, player);

    if (!pressed) {
      this.btnpWait[`${which}${player}`] = false;
      return pressed;
    }

    if (this.btnpWait[`${which}${player}`]) return false;

    this.btnpWait[`${which}${player}`] = true;

    setTimeout(() => {
      this.btnpWait[`${which}${player}`] = false;
    }, 120);

    return pressed;
  }
}
