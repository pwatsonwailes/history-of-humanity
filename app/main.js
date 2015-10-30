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

	if (String(window.location.pathname).match(/\/history-of-humanity\/\d+\/\d+\/.+/i) !== null) {
		var parts = window.location.pathname.replace('/history-of-humanity/', '').split('/');
		var params = { pointer: 0, year: parts[0], position: parts[1], name: parts[2] };

    var initData = {
      itemDetail: timelineJsonData[params.year][params.position],
      wikiData: false,
      wikiImages: []
    };

		var wikiApiLink = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|images&exintro=&explaintext=&titles=' + params.name;

		axios.get('https://apis.builtvisible.com/history_of_humanity/?url=' + encodeURIComponent(wikiApiLink.replace(/&amp;/g, "&"))).then(function (output) {
			if (isset(output.data.query.pages)) {
				var pageId = Object.keys(output.data.query.pages);
				initData.wikiData = output.data.query.pages[pageId];

				// React.renderToString takes your component and generates rendered markup. SEO friendliness all the way
				return React.render(React.createElement(HoH, { timeline: timelineJsonData, initparams: params, initwikidata: initData }), document.getElementById('hoh'));
			}
		})
		.catch(function (e) {
			console.log('error in xhr');
			console.log(e);
		});
	}
	else if (String(window.location.pathname).match(/\/history-of-humanity\/p\/\d+/i) !== null) {
		var parts = window.location.pathname.replace('/history-of-humanity/', '').split('/');

		return React.render(React.createElement(HoH, { timeline: timelineJsonData, initparams: { pointer: parts[1], year: false, position: false, name: false } }), document.getElementById('hoh'));
	}
	else {
		return React.render(React.createElement(HoH, { timeline: timelineJsonData, initparams: { pointer: 0, year: false, position: false, name: false } }), document.getElementById('hoh'));
	}

})();