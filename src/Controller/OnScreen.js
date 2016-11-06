import KeyboardController from './Keyboard';

export default class OnSreenController extends KeyboardController {
  constructor(machine) {
    super(machine);
    this.buildButtons();
  }

  buildButtons() {
    const wrapper = document.getElementById('mobileButtons');

    this.keys.forEach((key, i) => {
      const button = document.createElement('button');
      button.innerHTML = i;
      button.classList.add(`b_${key}`);

      button.addEventListener('touchstart', () => {
        const index = this.keys.indexOf(key);
        if (index < 0) return false;

        this.status[index] = true;
      });

      button.addEventListener('touchend', () => {
        const index = this.keys.indexOf(key);
        if (index < 0) return false;

        this.status[index] = false;
      });

      wrapper.appendChild(button)
    });
  }
}
