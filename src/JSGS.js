export default class JSGS {
    constructor(options) {
        this.devices = options.devices;
        this.os = options.os;
        this.autoUpdate = options.autoUpdate;

        this.os.sendEvent('boot', this).sendEvent('cartridgeMount', this);

        if (this.autoUpdate) {
            this.updateLoop(() => {
                this.os.update();
                this.devices.screens.forEach(
                    screen => screen.update(this.devices.ram)
                );
            });
        }

        this.then = Date.now();
    }

    updateLoop(fn, fps) {
        fn();

        let then = Date.now();
        fps = fps || 30;
        const interval = 1000 / fps;

        return (function loop(time) {
            requestAnimationFrame(loop);

            const now = Date.now();
            const delta = now - then;

            if (delta > interval) {
                then = now - (delta % interval);
                fn();
            }
        }(0));
    }

    update() {
        const fps = 30;
        const interval = 1000 / fps;

        const now = Date.now();
        const delta = now - this.then;

        if (delta > interval) {
            this.os.update();

            if (this.autoUpdate) {
                this.devices.screens.forEach(screen => screen.update(this.devices.ram));
            }

            this.then = now - (delta % interval);

            return true;
        }

        return false;
    }
}
