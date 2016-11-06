export default (function() {
  const input$keys = [
    37, 39, 38, 40, 90, 88, // Player 1 (left, right, up, down, z, x)
  ];

  const input$status = [
    false, false, false, false, false, false, // player 1
    false, false, false, false, false, false, // player 2
  ]

  document.addEventListener('keydown', function(event) {
    const index = input$keys.indexOf(event.keyCode);
    if (index < 0) return false;

    input$status[index] = true;
  });

  document.addEventListener('keyup', function(event) {
    const index = input$keys.indexOf(event.keyCode);
    if (index < 0) return false;

    input$status[index] = false;
  });

  function throttle (callback, limit) {
    var wait = false;                 // Initially, we're not waiting
    return function () {              // We return a throttled function
      if (!wait) {                  // If we're not waiting
        callback.call();          // Execute users function
        wait = true;              // Prevent future invocations
        setTimeout(function () {  // After a period of time
          wait = false;         // And allow future invocations
        }, limit);
      }
    }
  }

  function btn(which, player = 0) {
    return input$status[which];
  }

  function btnp(which, player = 0) {
    const pressed = btn(which, player);

    if (!pressed) {
      btnp.wait[`${which}${player}`] = false;
      return pressed;
    }

    if (btnp.wait[`${which}${player}`]) return false;

    btnp.wait[`${which}${player}`] = true;

    setTimeout(() => {
      btnp.wait[`${which}${player}`] = false;
    }, 120);

    return pressed;
  }

  btnp.wait = {};

  return {
    btn,
    btnp,
  };
})();
