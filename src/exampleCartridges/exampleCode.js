export default `
  let init, c, party, points;

  const cameralib = {
    new: function(_init) {
      init = _init || {}
      let self = {}
      self.z = init.z || -3
      self.focallength = init.focallength || 5
      self.fov = init.fov || 45
      self.theta = init.theta || 0
      self.width = init.width || 128
      self.height = init.height || 128

      self.line = cameralib.line
      self.point = cameralib.point

      self._perspective = cameralib._perspective
      self._tan = cameralib._tan
      self._coordstopx = cameralib._coordstopx
      self._map = cameralib._map

      return self;
    },

    line: function(self, p1, p2) {
      let px_1 = self._coordstopx(self, self._perspective(self, p1))
      let px_2 = self._coordstopx(self, self._perspective(self, p2))

      line(px_1[0], px_1[1], px_2[0], px_2[1])
    },

    point: function(self, p) {
      let px = self._coordstopx(self, self._perspective(self, p))
      pset(px[0],px[1])
    },

    _perspective: function(self, p) {
      let [x,y,z] = [p[0],p[1],p[2]]
      let x_rot = x * cos(self.theta) - z * sin(self.theta)
      let z_rot = x * sin(self.theta) + z * cos(self.theta)
      let dz = z_rot - self.z
      let out_z = self.z + self.focallength
      let m_xz = x_rot / dz
      let m_yz = y / dz
      let out_x = m_xz * out_z
      let out_y = m_yz * out_z
      return [ out_x, out_y ]
    },

    _map: function(v, a, b, c, d) {
      let partial = (v - a) / (b - a)
      return partial * (d - c) + c;
    },

    _tan: function(v) {
      return sin(v) / cos(v)
    },

    _coordstopx: function(self, coords) {
      let x = coords[0]
      let y = coords[1]
      let radius = self.focallength * self._tan(self.fov / 2 / 360)
      let pixel_x = self._map(x, -radius, radius, 0, self.width)
      let pixel_y = self._map(y, -radius, radius, 0, self.height)
      return [ pixel_x, pixel_y ]
    }
  };

  function _init() {
    cls();
    c = cameralib.new();
    party = 0;
    points = [];

    for (let i = 0; i < 100; i++) {
      points.push([rnd(4)-2,rnd(4)-2,rnd(4)-2]);
    }

  }

  function _draw() {
    cls();
    color(7);

    points.forEach(v => c.point(c, v));

    for (let  i = -2; i < 2; i+=0.3) {
      party += 1;
      color(party);

      c.line(c, [1, i, 1], [1, i, -1])
      c.line(c, [1,i,-1], [-1,i,-1])
      c.line(c, [-1,i,-1], [-1,i,1])
      c.line(c, [-1,i,1], [1,i,1])
    }
  }

  function _update() {
    if (btn(0)) c.theta += 0.01;
    if (btn(1)) c.theta -= 0.01;
    if (btn(2)) c.z += 0.01;
    if (btn(3)) c.z -= 0.01;
  }
`;
