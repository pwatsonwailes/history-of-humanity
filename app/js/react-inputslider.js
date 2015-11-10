// based on //raw.githubusercontent.com/wangzuo/react-input-slider/gh-pages/dist/input-slider.js
import React from 'react';

export default class InputSlider extends React.Component {
	constructor() {
		super();

		this.getPosition = this.getPosition.bind(this);
		this.handleSliderClick = this.handleSliderClick.bind(this);
		this.handleMoveStart = this.handleMoveStart.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.getPos = this.getPos.bind(this);
		this.changeValue = this.changeValue.bind(this);

		this.state = { mobile:(typeof window !== 'undefined') ? mobileCheck() : false };
	}

	getPosition() {
		if (this.props.axis !== 'x') {
			var top = (this.props.y - this.props.yMin) /(this.props.yMax - this.props.yMin) * 100;

			if (top > 100) top = 100;
			if (top < 0) top = 0;
		}
		else
			var top = 0;

		if (this.props.axis !== 'y') {
			var left = (this.props.x - this.props.xMin) /(this.props.xMax - this.props.xMin) * 100;

			if (left > 100) left = 100;
			if (left < 0) left = 0;
		}
		else
			var left = 0;

		return { top: top + '%', left: left + '%' };
	}

	handleSliderClick(e) {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
	}

	handleMoveStart(e) {
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

		if (!this.state.mobile) {
			document.addEventListener('mousemove', this.handleDrag);
			document.addEventListener('mouseup', this.handleDragEnd);
		}
		else {
			document.addEventListener('touchmove', this.handleDrag);
			document.addEventListener('touchend', this.handleDragEnd);
		}
	}

	handleDrag(e) {
		e.preventDefault();
		this.changeValue(this.getPos(e));
	}

	handleDragEnd(e) {
		e.preventDefault();
		
		if (!this.state.mobile) {
			document.removeEventListener('mousemove', this.handleDrag);
			document.removeEventListener('mouseup', this.handleDragEnd);
		}
		else {
			document.removeEventListener('touchmove', this.handleDrag);
			document.removeEventListener('touchend', this.handleDragEnd);
		}

		if (this.props.onDragEnd) this.changeValue(this.getPos(e), true);
	}

	handleClick(e) {
		var rect = this.getDOMNode().getBoundingClientRect();

		this.changeValue({
			left: e.clientX - rect.left,
			top: e.clientY - rect.top
		}, true);
	}

	getPos(e) {
		if (!this.state.mobile) {
			var posX = e.clientX + this.start.x - this.offset.x;
			var posY = e.clientY + this.start.y - this.offset.y;
		}
		else {
			var posX = e.changedTouches[0].screenX - e.changedTouches[0].radiusX;
			var posY = e.changedTouches[0].screenY - e.changedTouches[0].radiusY;
		}

		return {
			left: posX,
			top: posY
		};
	}

	changeValue(pos, dragEnd) {
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
			x = left / width *(this.props.xMax - this.props.xMin) + this.props.xMin;
		}
		if (axis === 'y' || axis === 'xy') {
			y = top / height *(this.props.yMax - this.props.yMin) + this.props.yMin;
		}

		this.props.onChange({ x: x, y: y, name: this.props.name });

		if (this.props.onDragEnd && dragEnd) this.props.onDragEnd({ x: x, y: y, name: this.props.name });
	}

	render() {
		var pos = this.getPosition();
		var axis = this.props.axis;
		var valueStyle = {};

		if (axis === 'x') valueStyle.width = pos.left;
		if (axis === 'y') valueStyle.height = pos.top;

		return (
			React.createElement("div", { className: 'slider slider_' + axis, id: this.props.name, onClick: this.handleClick, onTouchStart: this.handleClick },
				React.createElement('div', { className: 'value', style: valueStyle }),
				React.createElement('div', { className: 'handle', ref: 'handle', onMouseDown: this.handleMoveStart, onTouchStart: this.handleMoveStart, onClick: this.handleSliderClick, style: pos })
			)
		)
	}
}