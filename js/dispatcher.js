React.initializeTouchEvents(true);

var hoh = React.createClass({
	displayName: "hoh",
	data: false,

	getInitialState: function (props) {
		return {
			startDate: 0,
			endDate: 0,
			pointer: 0,
			show: 25,
			tag: false,
			selectedItems: [],
			highlightLatLong: false,
			itemDetail: false,
			itemDetailActive: false,
			wikiData: false,
			wikiImages: false
		}
	},

	componentDidMount: function () {
		var self = this;
		var timelineUrl = 'https://apis.builtvisible.com/history_of_humanity/timeline.json';

		qwest.get(timelineUrl, null, { timeout: 3000, attempts: 2, responseType: 'json' })
		.then(function(response) {
			self.data = response;
			self.updateItems(false, false, false);
		})
		.catch(function(e, response) {
			console.log(e);
		});
	},

	updateItems: function (dateType, newDate, newTag) {
		if (this.data !== false) {
			var newState = {};
			var items = [];
			var update = false;
			var n = 0;

			if (this.data !== false) {
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
					var loopEnd = (isset(this.data[i])) ? this.data[i].length : 0;

					for (var j = 0; j < loopEnd; j++) {
						if ((newTag !== false && this.data[i][j].tags.indexOf(newTag) > -1) || newTag === false) {
							items[n] = this.data[i][j];
							items[n].year = i;
							items[n].position = j;
							n++;
						}
					}
				}
			}

			if (this.state.pointer >= Math.floor(items.length / this.state.show))
				newState.pointer = Math.floor(items.length / this.state.show);

			newState.tag = newTag;

			newState.selectedItems = items;
			update = true;

			if (dateType !== false)
			{
				newState[dateType] = newDate;
				update = true;
			}

			if (update)
				this.setState(newState);
		}
	},

	setItemDetail: function (e) {
		if (isset(e.target.parentNode.dataset.year))
			var year = e.target.parentNode.dataset.year;
		else if (isset(e.target.dataset.year))
			var year = e.target.dataset.year;

		if (isset(e.target.parentNode.dataset.position))
			var position = e.target.parentNode.dataset.position;
		else if (isset(e.target.dataset.position))
			var position = e.target.dataset.position;

		var itemData = this.data[year][position];

		if (isset(itemData.links.main))
		{
			var wikiTitle = itemData.links.main.link.replace('//en.wikipedia.org/wiki/', '');
			this.setWikiData(wikiTitle);
		}
		else {
			this.setState({ wikiData: false, wikiImages: false })
		}

		this.setState({
			itemDetail: itemData,
			itemDetailActive: true
		});
	},

	hideItemDetail: function (e) {
		if (e.target.id === 'hohContainer' || e.target.id === 'hideItemDetail' || e.target.parentNode.id === 'hideItemDetail')
			this.setState({ itemDetailActive: false });
	},

	setWikiData: function (wikiTitle) {
		var self = this;
		var wikiApiLink = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|images&exintro=&explaintext=&titles=' + wikiTitle;

		qwest.post('https://apis.builtvisible.com/history_of_humanity/', { url: wikiApiLink }, { responseType: 'json' })
		.then(function(pageResponse) {
			if (isset(pageResponse.query.pages)) {
				var pageId = Object.keys(pageResponse.query.pages);
				var newState = { wikiData: pageResponse.query.pages[pageId], wikiImages: [] };

				if (isset(newState.wikiData.images)) {
					for (var i = newState.wikiData.images.length - 1; i >= 0; i--) {
						var title = newState.wikiData.images[i].title.replace('File:', '').replace(/\s+/g,"_");

						if (title.indexOf('.jpg') === -1 && title.indexOf('.png') === -1 && i === 0) {
							newState.wikiData.images.splice(i, 1);
							self.setState(newState);
						}
						else if (title.indexOf('.jpg') === -1 && title.indexOf('.png') === -1) {
							newState.wikiData.images.splice(i, 1);
							continue;
						}

						var imgLink = 'https://en.wikipedia.org/w/api.php?action=query&titles=Image:' + title + '&prop=imageinfo&iiprop=url&format=json';

						if (i === 0) {
							qwest.post('https://apis.builtvisible.com/history_of_humanity/', { url: imgLink }, { responseType: 'json' })
							.then(function(imgResponse) {
								if (isset(imgResponse.query.pages['-1']) && isset(imgResponse.query.pages['-1'].imageinfo))
									newState.wikiImages.push(imgResponse.query.pages['-1'].imageinfo[0].url);
								self.setState(newState);
							})
							.catch(function(e, imgResponse) {
								console.log(e);
								self.setState(newState);
							});
						}
						else {
							qwest.post('https://apis.builtvisible.com/history_of_humanity/', { url: imgLink }, { responseType: 'json' })
							.then(function(imgResponse) {
								if (isset(imgResponse.query.pages['-1']) && isset(imgResponse.query.pages['-1'].imageinfo))
									newState.wikiImages.push(imgResponse.query.pages['-1'].imageinfo[0].url);
							})
							.catch(function(e, imgResponse) {
								console.log(e);
							});
						}
					}
				}
				else
					self.setState(newState);
			}
			else
				self.setState({ wikiData: false, wikiImages: false });
		})
		.catch(function(e, pageResponse) {
			self.setState({ wikiData: false, wikiImages: false });
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

		if (pointer === '1' && (this.state.pointer + 1 < Math.floor(this.state.selectedItems.length / this.state.show)))
			var newPointer = this.state.pointer + 1
		else if (pointer === '1' && (this.state.pointer + 1 >= Math.floor(this.state.selectedItems.length / this.state.show)))
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
		var newVal = e.target.dataset.value;

		if (newVal === '')
			newVal = false;

		this.updateItems('endDate', this.state.endDate, newVal);
		window.tagToggler._closeMenu();
	},

	render: function () {
		var className = (this.state.itemDetailActive) ? 'active' : '';
		var highchartKey = this.state.startDate.toString() + this.state.endDate.toString();
		var mapsKey = this.state.startDate.toString() + this.state.endDate.toString() + this.state.tag + this.state.pointer;

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
						show: this.state.show
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
					show: this.state.show,
					itemHander: this.setItemDetail
				}),
				React.createElement("span", { id: 'hideItemDetail', className: className, onClick: this.hideItemDetail },
					React.createElement("i", { className: 'fa fa-times' })
				),
				React.createElement(ItemDetail, {
					active: this.state.itemDetailActive,
					itemDetail: this.state.itemDetail,
					wikiData: this.state.wikiData,
					wikiImages: this.state.wikiImages
				})
			)
		);
	}
});

React.render(
	React.createElement(hoh),
	$('hoh')
);