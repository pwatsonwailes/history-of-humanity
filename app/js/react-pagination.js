var React = require('react/addons');

Pagination = React.createClass({
	displayName: "Pagination",

	clickHandler: function (e) {
		e.preventDefault();
		this.props.clickHandler(parseInt(e.target.dataset.pointer));
	},

	updateArr: function () {
		var arr = [];

		if (this.props.maxBlocks - this.props.nPages < 2) {
			maxPivotPages = Math.round((this.props.maxBlocks - 5) / 2);
			minPage = Math.max(0, this.props.pointer - maxPivotPages);
			maxPage = Math.min(this.props.nPages - 1, this.props.pointer + maxPivotPages * 2 - (this.props.pointer - minPage));
			minPage = Math.max(0, minPage - (maxPivotPages * 2 - (maxPage - minPage)));

			var elipses = true;
		}
		else {
			minPage = 0;
			maxPage = this.props.nPages - 1;

			var elipses = false;
		}

		if (elipses && minPage !== 0) {
			arr[0] = 'prev';
			arr[1] = 'hellip1';
		}

		for (var i = minPage; i <= maxPage; i++) {
			arr.push(i);
		}

		if (elipses && this.props.nPages !== maxPage + 1) {
			arr.push('hellip2');
			arr.push('next');
		}

		return arr;
	},

	renderPaginationItems: function (i) {
		var selectedClass = (this.props.pointer === i) ? "selected clickable" : "clickable";

		if (i === 'prev') {
			return (
				React.createElement("li", { key: i, className: selectedClass },
					React.createElement("a", { href: '/history-of-humanity/', 'data-pointer': 0, onClick: this.clickHandler }, '1')
				)
			)
		}
		else if (i === 'next') {
			return (
				React.createElement("li", { key: i, className: selectedClass },
					React.createElement("a", { href: '/history-of-humanity/p/' + this.props.nPages, 'data-pointer': this.props.nPages - 1, onClick: this.clickHandler }, this.props.nPages)
				)
			)
		}
		else if (i === 'hellip1' || i === 'hellip2')
			return React.createElement("li", { key: i, className: "more" }, "...")
		else {
			var n =  i + 1;
			return React.createElement("li", { key: i, className: selectedClass },
				React.createElement("a", { href: '/history-of-humanity/p/' + n, 'data-pointer': i, onClick: this.clickHandler }, n)
			);
		}
	},

	renderNoPagination: function () { return  React.createElement("li", { className: 'no_more' }, "No other pages") },

	render: function () {
		var className = 'paginator on';

		if (this.props.nPages > 1) {
			var arr = this.updateArr();
			var pagination = arr.map(this.renderPaginationItems)
		}
		else if (this.props.nPages = 0)
			var pagination = this.renderNoPagination();
		else {
			var pagination = [];
			className = 'paginator';
		}

		return React.createElement("ul", { className: className }, pagination)
	}
});

module.exports = Pagination;