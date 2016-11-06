export default class JSGS {
  constructor(options) {
    this.devices = options.devices;
    this.os = options.os;

    this.os
      .sendEvent('boot', this)
      .sendEvent('cartridgeMount', this);

    this.updateLoop(() => {
      this.os.update();
      this.devices.screens.forEach(
        screen => screen.update(this.devices.ram)
      );
    });
  }

  updateLoop(fn, fps) {
    fn();

    let then = Date.now();
    fps = fps || 30;
    const interval = 1000 / fps;

    return (function loop(time){
      requestAnimationFrame(loop);

      const now = Date.now();
      const delta = now - then;

      if (delta > interval) {
        then = now - (delta % interval);
        fn();
      }
    }(0));
  }
}
