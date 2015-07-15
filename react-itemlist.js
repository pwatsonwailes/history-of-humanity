var ItemList = React.createClass({
	displayName: "ItemList",

	componentDidMount: function(props) {},

	componentDidUpdate: function () {},

	renderYear: function (x, y, year) {
		return React.createElement("li", { key: 'year' + x + y + year, className: 'yearTitle' }, year)
	},

	renderItems: function (item) {
		var relevantItems = [];

		if (this.props.items.length > 0)
		{
			var x = this.props.pointer * this.props.show;
			var y = this.props.pointer * this.props.show + 10;
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
			};
		}

		return relevantItems;
	},

	renderItem: function (item, i) {
		var key = 0, i, chr, len;

		for (i = 0, len = item.text.length; i < len; i++) {
			chr	 = item.text.charCodeAt(i);
			key	= ((key << 5) - key) + chr;
			key |= 0; // Convert to 32bit integer
		}

		return React.createElement("li", { key: key, 'data-year': item.year, 'data-position': item.position, onClick: this.props.itemHander }, item.text)
	},

	loadingItems: function () {
		return React.createElement("li", null, 'Loading data')
	},

	render: function () {
		var itemsList = (this.props.items === false) ? this.loadingItems() : this.renderItems();

		return (
			React.createElement("div", { className: "items" },
				React.createElement("ul", null,
					itemsList
				)
			)
		)
	}
});