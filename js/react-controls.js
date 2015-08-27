// based on https://raw.githubusercontent.com/wangzuo/react-input-slider/gh-pages/dist/input-slider.js
var InputSlider = React.createClass({
	displayName: 'InputSlider',

	getDefaultProps: function getDefaultProps() {
		return {
			axis: 'x',
			xMin: 0,
			yMin: 0
		}
	},

	getPosition: function () {
		var top = (this.props.y - this.props.yMin) / (this.props.yMax - this.props.yMin) * 100;
		var left = (this.props.x - this.props.xMin) / (this.props.xMax - this.props.xMin) * 100;

		if (top > 100) top = 100;
		if (top < 0) top = 0;
		if (this.props.axis === 'x') top = 0;
		top += '%';

		if (left > 100) left = 100;
		if (left < 0) left = 0;
		if (this.props.axis === 'y') left = 0;
		left += '%';

		return { top: top, left: left };
	},

	handleMouseDown: function (e) {
		e.preventDefault();
		var dom = this.refs.handle.getDOMNode();

		this.start = {
			x: dom.offsetLeft,
			y: dom.offsetTop
		};

		this.offset = {
			x: e.clientX,
			y: e.clientY
		};

		document.addEventListener('mousemove', this.handleDrag);
		document.addEventListener('mouseup', this.handleDragEnd);
	},

	handleSliderClick: function (e) {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
	},

	handleDrag: function (e) {
		e.preventDefault();
		this.changeValue(this.getPos(e));
	},

	handleDragEnd: function (e) {
		e.preventDefault();
		document.removeEventListener('mousemove', this.handleDrag);
		document.removeEventListener('mouseup', this.handleDragEnd);

		if (this.props.onDragEnd) this.changeValue(this.getPos(e), true);
	},

	handleClick: function (e) {
		var rect = this.getDOMNode().getBoundingClientRect();

		this.changeValue({
			left: e.clientX - rect.left,
			top: e.clientY - rect.top
		}, true);
	},

	getPos: function (e) {
		var rect = this.getDOMNode().getBoundingClientRect();
		var posX = e.clientX + this.start.x - this.offset.x;
		var posY = e.clientY + this.start.y - this.offset.y;

		return {
			left: posX,
			top: posY
		};
	},

	changeValue: function (pos, dragEnd) {
		if (!this.props.onChange) return;

		var rect = this.getDOMNode().getBoundingClientRect();
		var width = rect.width;
		var height = rect.height;
		var left = pos.left;
		var top = pos.top;
		var axis = this.props.axis;

		if (left < 0) left = 0;
		if (left > width) left = width;
		if (top < 0) top = 0;
		if (top > height) top = height;

		var x = 0;
		var y = 0;
		if (axis === 'x' || axis === 'xy') {
			x = left / width * (this.props.xMax - this.props.xMin) + this.props.xMin;
		}
		if (axis === 'y' || axis === 'xy') {
			y = top / height * (this.props.yMax - this.props.yMin) + this.props.yMin;
		}

		this.props.onChange({ x: x, y: y, name: this.props.name });

		if (this.props.onDragEnd && dragEnd) this.props.onDragEnd({ x: x, y: y, name: this.props.name });
	},

	render: function () {
		var pos = this.getPosition();
		var axis = this.props.axis;
		var valueStyle = {};

		if (axis === 'x') valueStyle.width = pos.left;
		if (axis === 'y') valueStyle.height = pos.top;

		return React.createElement("div", { className: 'slider slider_' + axis, id: this.props.name, onClick: this.handleClick },
			React.createElement('div', { className: 'value', style: valueStyle }),
			React.createElement('div', { className: 'handle', ref: 'handle', onMouseDown: this.handleMouseDown, onClick: this.handleSliderClick, style: pos })
		);
	}
});

var Controls = React.createClass({
	displayName: "Controls",
	tags: [
		{ value: '', title: 'All' },
		{ value: 'art', title: 'Art' },
		{ value: 'terrorism', title: 'Terrorism' },
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
		{ value: 'toys', title: 'Toys' },
		{ value: 'transport', title: 'Transport' },
		{ value: 'treaty', title: 'Treaty' },
		{ value: 'world population', title: 'World Population' },
		{ value: 'ww1', title: 'WW1' },
		{ value: 'ww2', title: 'WW2' }
	],

	componentDidMount: function(props) {
		new toggleMode(
			$('tagHandler'),
			$('tags'),
			{ activeTargetClass: 'active', passThrough: false }
		);
	},

	componentDidUpdate: function () {},

	setTag: function (tag) {
		return (
			React.createElement("li", { key: tag.value },
				React.createElement("span", { 'data-value': tag.value, onClick: this.props.tagHandler }, tag.title)
			)
		)
	},

	render: function () {
		var tags = [];

		for (var i = this.tags.length - 1; i >= 0; i--) {
			tags[i] = this.setTag(this.tags[i]);
		};

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
					React.createElement("p", { id: 'tagHandler' }, (this.props.tag !== '' && this.props.tag !== false) ? this.props.tag : 'All'),
					React.createElement("ul", { id: 'tags', className: 'dropdown' }, tags)
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