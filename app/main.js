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
		var params = { year: parts[0], position: parts[1], name: parts[2] };

    var initData = {
      itemDetail: timelineJsonData[req.params.year][req.params.position],
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
	else {
		return React.render(React.createElement(HoH, { timeline: timelineJsonData, initparams: { year: false, position: false, name: false } }), document.getElementById('hoh'));
	}

})();