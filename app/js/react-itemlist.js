function isset (obj) { return typeof obj !== 'undefined'; }

var React = require('react/addons');

var ItemList = React.createClass({
	displayName: "ItemList",
	jumping: false,

	getInitialState: function () { return { jumpTo: false } },

	componentWillReceiveProps: function (nextProps) {
		if (this.props.highlightLatLong === false && nextProps.highlightLatLong !== false || this.props.highlightLatLong.lat !== nextProps.highlightLatLong.lat)
			this.setState({ jumpTo: false });
	},

	//gist.github.com/dezinezync/5487119
	scrollAnimate: function (Y, duration) {
		var start = Date.now(),
			elem = document.documentElement.scrollTop ? document.documentElement : document.body,
			from = elem.scrollTop;

		if (from === Y)
			return; // Prevent scrolling to the Y point if already there

		function min (a,b) { return a < b ? a : b; }

		function scroll(timestamp) {
			var currentTime = Date.now(),
				t = min(1, ((currentTime - start) / duration)),
				easedT = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

			elem.scrollTop = (easedT * (Y - from)) + from;

			if (t < 1)
				requestAnimationFrame(scroll);
		}

		requestAnimationFrame(scroll)
	},

	renderYear: function (x, y, year) { return React.createElement("li", { key: 'year' + x + y + year, className: 'yearTitle' }, year) },

	renderItemThumbnail: function (item, key) {
		var picKey = 'thumb' + key;

		return (isset(item.thumbnail) && item.thumbnail !== '')
			? React.createElement("img", { key: picKey, className: 'thumbnail', src: item.thumbnail })
			: [];
	},

	renderItem: function (item, i) {
		var key = 0, i, chr, len;

		for (i = 0, len = item.text.length; i < len; i++) {
			chr	 = item.text.charCodeAt(i);
			key	= ((key << 5) - key) + chr;
			key |= 0; // Convert to 32bit integer
		}

		var itemThumbnail = this.renderItemThumbnail(item, key);
		var className = 'itemPanel';

		var testPropLatLongSet = isset(this.props.highlightLatLong) && isset(this.props.highlightLatLong.lat) && isset(this.props.highlightLatLong.long);
		var testItemLatLongSet = isset(item.latlong) && isset(item.latlong[0]) && isset(item.latlong[0][0]);

		if (testPropLatLongSet && testItemLatLongSet) {
			var latFixed = item.latlong[0][0].toFixed(1);
			var longFixed = item.latlong[0][1].toFixed(1);

			if (latFixed === this.props.highlightLatLong.lat && longFixed === this.props.highlightLatLong.long) {
				className += ' highlightMap';

				if (this.state.jumpTo === false && this.jumping === false) {
					this.jumping = true;
					this.scrollAnimate($(key).offsetTop, 1000);
				}
			}
		}

		if (parseInt(this.state.jumpTo) === parseInt(key))
			className += ' highlightClick';

		var title = item.links.main.link.replace('//en.wikipedia.org/wiki/', '');

		return (
			React.createElement("li", { key: key, id: key, 'data-year': item.year, 'data-position': item.position, className: className, onClick: this.itemHandler },
				itemThumbnail,
				React.createElement("p", null,
					React.createElement("a", { href: '/history-of-humanity/' + item.year + '/' + item.position + '/' + title }, item.text)
				),
				React.createElement("div", { className: 'readmore' },
					React.createElement("span", { 'data-year': item.year, 'data-position': item.position }, 'Read more...')
				)
			)
		)
	},

	itemHandler: function (e) {
		if (isset(e.target.id) && e.target.id !== '')
			var newJumpTo = e.target.id;
		else if (isset(e.target.parentNode.id) && e.target.parentNode.id !== '')
			var newJumpTo = e.target.parentNode.id;
		else if (isset(e.target.parentNode.parentNode.id) && e.target.parentNode.parentNode.id !== '')
			var newJumpTo = e.target.parentNode.parentNode.id;

		if (this.state.jumpTo === false || parseInt(this.state.jumpTo) !== parseInt(newJumpTo)) {
			this.scrollAnimate($(newJumpTo).offsetTop, 1000);
			this.setState({ jumpTo: newJumpTo });
		}

		this.props.itemHandler(e);
	},

	renderItems: function (item) {
		var relevantItems = [];

		if (this.props.items.length > 0)
		{
			var x = this.props.pointer * this.props.show;
			var y = this.props.pointer * this.props.show + this.props.show;
			var year = this.props.items[x].year;

			relevantItems.push(this.renderYear(x, y, this.props.items[x].year));

			for (var i = x; i < y; i++) {
				if (isset(this.props.items[i])) {
					if (this.props.items[i].year !== year) {
						relevantItems.push(this.renderYear(i, y, this.props.items[i].year));
						year = this.props.items[i].year;
					}

					relevantItems.push(this.renderItem(this.props.items[i], i));
				}
			}
		}
		this.jumping = false;

		return relevantItems;
	},

	loadingItems: function () {
		return React.createElement("li", { className: 'yearTitle' }, 'Loading data')
	},

	noItems: function () {
		return React.createElement("li", { className: 'yearTitle' }, 'No data for your selection')
	},

	render: function () {
		if (this.props.items === false)
			var itemsList = this.loadingItems()
		else if (this.props.items.length > 0)
			var itemsList = this.renderItems();
		else
			var itemsList = this.noItems();

		return (
			React.createElement("div", { id: "items" },
				React.createElement("ul", null,
					itemsList
				)
			)
		)
	}
});

module.exports = ItemList;