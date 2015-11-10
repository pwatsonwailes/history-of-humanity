import React from 'react';
import ReactDOMServer from 'react-dom/server';
import TimelineData from '../data/timeline.json';
import axios from 'axios';
import HoH from '../js/dispatcher.js';

// React.renderToString takes your component and generates rendered markup. SEO friendliness all the way
module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index.ejs', {
			reactTitle: '',
			reactOutput: ReactDOMServer.renderToString(React.createElement(HoH, {
				timeline: TimelineData,
				initparams: { pointer: 0 }
			}))
		});
	});

	app.get('/p/:n', function(req, res) {
		if (req.params.n > 0) {
			res.render('index.ejs', {
				reactTitle: 'Page ' + req.params.n + ' | ',
				reactOutput: ReactDOMServer.renderToString(React.createElement(HoH, {
					timeline: TimelineData,
					initparams: { pointer: req.params.n - 1 }
				}))
			});
		}
		else
			res.redirect(301, 'https://labs.builtvisible.com/history-of-humanity/')
	});

	app.get('/:year/:position/:name', function(req, res) {
		var initData = {
			itemDetail: TimelineData[req.params.year][req.params.position],
			wikiData: false,
			wikiImages: []
		};

		var wikiApiLink = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|images&exintro=&explaintext=&titles=' + req.params.name;

		axios.get('https://apis.builtvisible.com/history_of_humanity/?url=' + encodeURIComponent(wikiApiLink.replace(/&amp;/g, "&"))).then(function (output) {
			if (typeof output.data.query.pages !== 'undefined') {
				var pageId = Object.keys(output.data.query.pages);
				initData.wikiData = output.data.query.pages[pageId];

				res.render('index.ejs', {
					reactTitle: initData.itemDetail.text + ' | ',
					reactOutput: ReactDOMServer.renderToString(React.createElement(HoH, {
						timeline: TimelineData,
						initparams: req.params,
						initwikidata: initData
					}))
				});
			}
		})
		.catch(function (e) {
			console.log('error in xhr');
			console.log(e);
		})
	})
}