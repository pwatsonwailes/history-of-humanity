function isset (obj) { return typeof obj !== 'undefined'; }

var React = require('react/addons'),
	ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
	axios = require('axios'),
	Social = require('./react-social.js'),
	Controls = require('./react-controls.js'),
	GMap = require('./react-gmaps.js'),
	ItemList = require('./react-itemlist.js'),
	ItemDetail = require('./react-itemdetail.js'),
	Pagination = require('./react-pagination.js');

React.initializeTouchEvents(true);

var HoH = React.createClass({
	displayName: "HoH",

	getInitialState: function (props) {
		props = props || this.props;

		var pointer = (isset(props.initparams.pointer)) ? props.initparams.pointer : 0;

		return {
			startDate: 0,
			endDate: 0,
			nRows: 25,
			nPages: 0,
			pointer: pointer,
			tag: false,
			selectedItems: [],
			highlightLatLong: false,
			itemDetail: false,
			wikiData: false,
			wikiImages: false
		}
	},

	componentWillMount: function () { this.updateItems(false, false, false) },

	componentDidMount: function () {
		var self = this;

		if (isset(this.props.initparams) && this.props.initparams.year !== false)
			this.setItemDetail({"target": {"dataset": { "year": this.props.initparams.year, position: this.props.initparams.position }}});
	
		History.Adapter.bind(window, 'statechange', function() { self.historyUpdate() })
	},

	handlePaginatorClicked: function(n) {
		this.setState({ pointer: n });
		History.pushState(null, 'History of Modern Humanity | Builtvisible', '/history-of-humanity/p/' + n++);
	},

	updateItems: function (dateType, newDate, newTag) {
		var newState = {};
		var items = [];
		var n = 0;

		if (dateType === false) {
			var sDate = 1750;
			var eDate = 2015;

			newState.startDate = sDate;
			newState.endDate = eDate;
		}
		else {
			var sDate = (dateType === 'startDate') ? parseInt(newDate) : parseInt(this.state.startDate);
			var eDate = (dateType === 'endDate') ? parseInt(newDate) : parseInt(this.state.endDate);
		}

		for (var i = sDate; i <= eDate; i++) {
			var loopEnd = (isset(this.props.timeline[i])) ? this.props.timeline[i].length : 0;

			for (var j = 0; j < loopEnd; j++) {
				if ((newTag !== false && this.props.timeline[i][j].tags.indexOf(newTag) > -1) || newTag === false) {
					items[n] = this.props.timeline[i][j];
					items[n].year = i;
					items[n].position = j;
					n++;
				}
			}
		}

		if (this.state.pointer >= Math.floor(items.length / this.state.nRows))
			newState.pointer = Math.floor(items.length / this.state.nRows);

		newState.tag = newTag;

		newState.selectedItems = items;
		newState.nPages = Math.ceil(items.length / this.state.nRows);

		if (dateType !== false)
			newState[dateType] = newDate;

		this.setState(newState);
	},

	historyUpdate: function () {
		var parts = window.location.pathname.replace('/history-of-humanity/', '').split('/');

    if (isset(parts[1]) && parts[1] !== '' && parts[1] !== false) {
			this.setItemDetail({"target": {"dataset": { "year": parts[0], "position": parts[1] }}}, false);
    }
    else {
    	this.hideItemDetail({"target": {"id": "hohContainer"}}, false);
    }
	},

	setItemDetail: function (e, updateHistory) {
		if (typeof e.preventDefault === 'function')
			e.preventDefault();

		if (isset(e.target.dataset.year))
			var year = e.target.dataset.year;
		else if (isset(e.target.parentNode.dataset.year))
			var year = e.target.parentNode.dataset.year;
		else if (isset(e.target.parentNode.parentNode.dataset.year))
			var year = e.target.parentNode.parentNode.dataset.year;

		if (isset(e.target.dataset.position))
			var position = e.target.dataset.position;
		else if (isset(e.target.parentNode.dataset.position))
			var position = e.target.parentNode.dataset.position;
		else if (isset(e.target.parentNode.parentNode.dataset.position))
			var position = e.target.parentNode.parentNode.dataset.position;

		var itemData = this.props.timeline[year][position];

		if (isset(itemData.links.main))
		{
			var wikiTitle = itemData.links.main.link.replace('//en.wikipedia.org/wiki/', '');
			this.setWikiData(wikiTitle);
		}
		else {
			this.setState({ wikiData: false, wikiImages: false })
		}

		this.setState({ itemDetail: itemData });

		if (!isset(updateHistory) || updateHistory !== false)
			History.pushState(null, itemData.text + ' | History of Modern Humanity | Builtvisible', '/history-of-humanity/' + year + '/' + position + '/' + wikiTitle);
	},

	hideItemDetail: function (e, updateHistory) {
		if (e.target.id === 'hohContainer' || e.target.id === 'hideItemDetail' || e.target.parentNode.id === 'hideItemDetail') {
			this.setState({ itemDetail: false });

			if (!isset(updateHistory) || updateHistory !== false)
				History.pushState(null, 'History of Modern Humanity | Builtvisible', '/history-of-humanity/');
		}
	},

	setWikiData: function (wikiTitle) {
		var self = this;
		var wikiApiLink = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|images&exintro=&explaintext=&titles=' + wikiTitle;
		var wikidata = axios.get('https://apis.builtvisible.com/history_of_humanity/?url=' + encodeURIComponent(wikiApiLink.replace(/&amp;/g, "&")))

		wikidata.then(function (res) {
			var newState = { wikiData: false, wikiImages: false };

			if (isset(res.data.query.pages)) {
				var pageId = Object.keys(res.data.query.pages);

				newState.wikiData = res.data.query.pages[pageId],
				newState.wikiImages = [];

				if (isset(newState.wikiData.images)) {
					for (var i = newState.wikiData.images.length - 1; i >= 0; i--) {
						var title = newState.wikiData.images[i].title.replace('File:', '').replace(/\s+/g,"_");

						if (title.indexOf('.jpg') === -1 && title.indexOf('.png') === -1 && i === 0)
							newState.wikiData.images.splice(i, 1);
						else if (title.indexOf('.jpg') === -1 && title.indexOf('.png') === -1) {
							newState.wikiData.images.splice(i, 1);
							continue;
						}

						var imgLink = 'https://en.wikipedia.org/w/api.php?action=query&titles=Image:' + title + '&prop=imageinfo&iiprop=url&format=json';
						var wikiImgs = axios.get('https://apis.builtvisible.com/history_of_humanity/?url=' + encodeURIComponent(imgLink.replace(/&amp;/g, "&")));

						if (i === 0) {
							wikiImgs.then(function (imgRes) {
								if (isset(imgRes.data.query.pages['-1']) && isset(imgRes.data.query.pages['-1'].imageinfo))
									newState.wikiImages.push(imgRes.data.query.pages['-1'].imageinfo[0].url);

								self.setState(newState);
							})
							.catch(function (e) {
								console.log('error in xhr 2');
								console.log(e);
							});
						}
						else {
							wikiImgs.then(function (imgRes) {
								if (isset(imgRes.data.query.pages['-1']) && isset(imgRes.data.query.pages['-1'].imageinfo))
									newState.wikiImages.push(imgRes.data.query.pages['-1'].imageinfo[0].url);
							})
							.catch(function (e) {
								console.log('error in xhr 3');
								console.log(e);
							});
						}
					}
				}
				else
					self.setState(newState);
			}
		})
		.catch(function (e) {
			console.log('error in xhr 1');
			console.log(e);
		});
	},

	updateDate: function (e) {
		if (!isNaN(e.x)) {
			var year = Math.floor(e.x);

			if (e.name === 'startDate' && year !== this.state.startDate)
				this.updateItems('startDate', year, this.state.tag);
			else if (e.name === 'endDate' && year !== this.state.endDate)
				this.updateItems('endDate', year, this.state.tag);
		}
	},

	updatePointer: function (e) {
		var update = true;

		if (isset(e.target.parentNode.dataset.pointer))
			var pointer = e.target.parentNode.dataset.pointer;
		else if (isset(e.target.dataset.pointer))
			var pointer = e.target.dataset.pointer;

		if (pointer === '1' && (this.state.pointer + 1 < Math.floor(this.state.selectedItems.length / this.state.nRows)))
			var newPointer = this.state.pointer + 1
		else if (pointer === '1' && (this.state.pointer + 1 >= Math.floor(this.state.selectedItems.length / this.state.nRows)))
			update = false;
		else if (pointer === '0' && this.state.pointer > 0)
			var newPointer = this.state.pointer - 1;
		else
			var newPointer = 0;

		if (update)
			this.setState({ pointer: newPointer });
	},

	handleMarkerClick: function (e) {
		this.setState({ highlightLatLong: e })
	},

	updateTag: function (e) {
		e.preventDefault();

		var newVal = e.target.dataset.value;

		if (newVal === '')
			newVal = false;

		this.updateItems('endDate', this.state.endDate, newVal);
		window.tagToggler._closeMenu();
	},

	renderItemDetail: function () {
		var parts = window.location.pathname.replace('/history-of-humanity/', '').split('/');
		
		var checkPropsAgainstUrl = (isset(this.props.initparams)
			&& this.props.initparams.year === parts[0]
			&& this.props.initparams.position === parts[1]
			&& this.props.initparams.name === parts[2]);

		var itemDetail = false,
			wikiData = false,
			wikiImages = false;

		if (this.state.itemDetail !== false)
			var itemDetail = this.state.itemDetail;
		else if (isset(this.props.initwikidata) && isset(this.props.initwikidata.itemDetail) && checkPropsAgainstUrl)
			var itemDetail = this.props.initwikidata.itemDetail;

		if (this.state.wikiData !== false)
			var wikiData = this.state.wikiData;
		else if (isset(this.props.initwikidata) && isset(this.props.initwikidata.wikiData) && checkPropsAgainstUrl)
			var wikiData = this.props.initwikidata.wikiData;

		if (this.state.wikiImages !== false)
			var wikiImages = this.state.wikiImages;
		else if (isset(this.props.initwikidata) && isset(this.props.initwikidata.wikiImages) && checkPropsAgainstUrl)
			var wikiImages = this.props.initwikidata.wikiImages;

		if (itemDetail !== false) {
			return (
				React.createElement("div", { key: "itemDetailContainer" },
					React.createElement(ReactCSSTransitionGroup, { id: 'hideItemDetail', transitionName: 'itemDetailTransition', transitionAppear: true, onClick: this.hideItemDetail },
						React.createElement("i", { className: 'fa fa-times' })
					),
					React.createElement(ItemDetail, {
						itemDetail: itemDetail,
						wikiData: wikiData,
						wikiImages: wikiImages
					})
				)
			)
		}
		else
			return [];
	},

	render: function () {
		var highchartKey = this.state.startDate.toString() + this.state.endDate.toString();
		var mapsKey = this.state.startDate.toString() + this.state.endDate.toString() + this.state.tag + this.state.pointer;

		var itemDetail = (this.state.itemDetail !== false || isset(this.props.initwikidata))
			? this.renderItemDetail()
			: [];

		return (
			React.createElement("div", { id: "hohContainer", onClick: this.hideItemDetail },
				React.createElement(Social, null),
				React.createElement("div", { id: "mapAndControls" },
					React.createElement(GMap, {
						initialZoom: 3,
						centerLat: 30,
						centerLng: 30,
						mapsKey: mapsKey,
						items: this.state.selectedItems,
						pointer: this.state.pointer,
						handleMarkerClick: this.handleMarkerClick,
						show: this.state.nRows
					}),
					React.createElement(Controls, {
						startDate: this.state.startDate,
						endDate: this.state.endDate,
						tag: this.state.tag,
						inputHandler: this.updateDate,
						tagHandler: this.updateTag,
						buttonHandler: this.updatePointer
					})
				),
				React.createElement(ItemList, {
					items: this.state.selectedItems,
					highlightLatLong: this.state.highlightLatLong,
					pointer: this.state.pointer,
					show: this.state.nRows,
					itemHandler: this.setItemDetail
				}),
				itemDetail,
				React.createElement(Pagination, {
					nPages: this.state.nPages,
					maxBlocks: "11",
					clickHandler: this.handlePaginatorClicked,
					pointer: this.state.pointer
				})
			)
		);
	}
});

module.exports = HoH;