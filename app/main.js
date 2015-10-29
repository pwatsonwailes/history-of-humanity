var React = require("react/addons"),
  ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
  axios = require('axios'),
  timelineJsonData = require('./data/timeline.json'),
  HoH = require('./js/dispatcher.js');

window.app = (function() {
  var requiredFeatures = {
    "JSON decoding": window.JSON,
    "the selectors API": document.querySelector,
    "DOM level 2 events": window.addEventListener,
    "the HTML5 history API": window.history.pushState
  };

  for (var i = requiredFeatures.length - 1; i >= 0; i--) {
    if (!requiredFeatures[i])
      return alert("Sorry, but your browser does not support " + feature + " so this app won't work properly.");
  };

  if (window.location.pathname !== '/history-of-humanity/') {
    var parts = window.location.pathname.replace('/history-of-humanity/', '').split('/');
    var initData = { year: parts[0], position: parts[1], name: parts[2] }
  }
  else
    var initData = { year: false, position: false, name: false }

  return React.render(React.createElement(HoH, { timeline: timelineJsonData, initparams: initData }), document.getElementById('hoh'));
})();