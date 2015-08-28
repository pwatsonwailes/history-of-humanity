var ItemList = React.createClass({
	displayName: "ItemList",

	componentDidMount: function(props) {},

	componentDidUpdate: function () {},

	renderYear: function (x, y, year) {
		return React.createElement("li", { key: 'year' + x + y + year, className: 'yearTitle' }, year)
	},

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

		return (
			React.createElement("li", { key: key, 'data-year': item.year, 'data-position': item.position, className: 'itemPanel', onClick: this.props.itemHander },
				itemThumbnail,
				React.createElement("p", null, item.text)
			)
		)
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