var React = require('react/addons'),
	InputSlider = require('./react-inputslider.js');

var Controls = React.createClass({
	displayName: "Controls",
	tags: [
		{ value: '', title: 'All' },
		{ value: 'art', title: 'Art' },
		{ value: 'cold war', title: 'Cold War' },
		{ value: 'conflict', title: 'Conflict' },
		{ value: 'crime', title: 'Crime' },
		{ value: 'death', title: 'Death' },
		{ value: 'disaster', title: 'Disaster' },
		{ value: 'ecology', title: 'Ecology' },
		{ value: 'economy', title: 'Economy' },
		{ value: 'equality', title: 'Equality' },
		{ value: 'exploration', title: 'Exploration' },
		{ value: 'government', title: 'Government' },
		{ value: 'history', title: 'History' },
		{ value: 'internal conflict', title:  'Internal Conflict' },
		{ value: 'natural disaster', title: 'Natural Disaster' },
		{ value: 'person', title: 'Person' },
		{ value: 'religion', title: 'Religion' },
		{ value: 'science', title: 'Science' },
		{ value: 'social', title: 'Social' },
		{ value: 'space', title: 'Space' },
		{ value: 'sport', title: 'Sport' },
		{ value: 'technology', title: 'Technology' },
		 {wevalue: 'terrorism', title: 'Terrorism' },
		{ value: 'toys', title: 'Toys' },
		{ value: 'transport', title: 'Transport' },
		{ value: 'treaty', title: 'Treaty' },
		{ value: 'world population', title: 'World Population' },
		{ value: 'ww1', title: 'WW1' },
		{ value: 'ww2', title: 'WW2' }
	],

	getInitialState: function () { return { showTags: false } },

	toggleTags: function () { this.setState({ showTags: !this.state.showTags }) },
	hideTags: function () { this.setState({ showTags: false }) },

	tagHandler: function (e) {
		this.hideTags();
		this.props.tagHandler(e);
	},

	setTag: function (tag) {
		return React.createElement("li", { key: tag.value, 'data-value': tag.value, onClick: this.tagHandler }, tag.title)
	},

	render: function () {
		var tags = [];
		var currentTag = 'All';

		for (var i = this.tags.length - 1; i >= 0; i--) {
			if (this.state.showTags)
				tags[i] = this.setTag(this.tags[i]);

			if (this.props.tag === this.tags[i].value)
				currentTag = this.tags[i].title;
		}

		var listClass = 'dropdown';

		if (this.state.showTags)
			listClass += ' active';

		return (
			React.createElement("div", { id: "controls" },
				React.createElement("div", { className: "panel" },
					React.createElement("label", { htmlFor: 'startDate' }, 'Start Date'),
					React.createElement("div", { className: 'yearPanel' }, this.props.startDate),
					React.createElement(InputSlider, { axis: 'x', x: this.props.startDate, xMin: 1750, xMax: 2014, name: 'startDate', onChange: this.props.inputHandler })
				),
				React.createElement("div", { className: "panel" },
					React.createElement("label", { htmlFor: 'endDate' }, 'End Date'),
					React.createElement("div", { className: 'yearPanel' }, this.props.endDate),
					React.createElement(InputSlider, { axis: 'x', x: this.props.endDate, xMin: 1751, xMax: 2015, name: 'endDate', onChange: this.props.inputHandler })
				),
				React.createElement("div", { className: "panel" },
					React.createElement("label", null, 'Tag'),
					React.createElement("p", { id: 'tagHandler', onClick: this.toggleTags }, currentTag),
					React.createElement("ul", { id: 'tags', className: listClass }, tags)
				),
				React.createElement("span", { className: 'fa_button', id: 'backButton', 'data-pointer': 0, onClick: this.props.buttonHandler },
					React.createElement("i", { className: 'fa fa-angle-double-left' })
				),
				React.createElement("span", { className: 'fa_button', id: 'forwardButton', 'data-pointer': 1,  onClick: this.props.buttonHandler },
					React.createElement("i", { className: 'fa fa-angle-double-right' })
				)
			)
		)
	}
});

module.exports = Controls;