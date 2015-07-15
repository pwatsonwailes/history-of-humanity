var Controls = React.createClass({
	displayName: "Controls",

	componentDidMount: function(props) {},

	componentDidUpdate: function () {},

	render: function () {
		return (
			React.createElement("div", { className: "controls" },
				React.createElement("label", { htmlFor: 'startDate' }, 'Start Date'),
				React.createElement("input", { type: 'text', name: 'startDate', defaultValue: '1901', onBlur: this.props.inputHandler }),
				React.createElement("label", { htmlFor: 'endDate' }, 'End Date'),
				React.createElement("input", { type: 'text', name: 'endDate', defaultValue: '2015', onBlur: this.props.inputHandler }),
				React.createElement("label", { htmlFor: 'tagHandler' }, 'Tag'),
				React.createElement("select", { name: 'tag', onChange: this.props.tagHandler },
					React.createElement("option", { value: '' }, 'All'),
					React.createElement("option", { value: 'art' }, 'Art'),
					React.createElement("option", { value: 'terrorism' }, 'Terrorism'),
					React.createElement("option", { value: 'cold war' }, 'Cold War'),
					React.createElement("option", { value: 'conflict' }, 'Conflict'),
					React.createElement("option", { value: 'crime' }, 'Crime'),
					React.createElement("option", { value: 'death' }, 'Death'),
					React.createElement("option", { value: 'disaster' }, 'Disaster'),
					React.createElement("option", { value: 'ecology' }, 'Ecology'),
					React.createElement("option", { value: 'economy' }, 'Economy'),
					React.createElement("option", { value: 'equality' }, 'Equality'),
					React.createElement("option", { value: 'exploration' }, 'Exploration'),
					React.createElement("option", { value: 'government' }, 'Government'),
					React.createElement("option", { value: 'history' }, 'History'),
					React.createElement("option", { value: 'internal conflict' }, 'Internal Conflict'),
					React.createElement("option", { value: 'natural disaster' }, 'Natural Disaster'),
					React.createElement("option", { value: 'person' }, 'Person'),
					React.createElement("option", { value: 'religion' }, 'Religion'),
					React.createElement("option", { value: 'science' }, 'Science'),
					React.createElement("option", { value: 'social' }, 'Social'),
					React.createElement("option", { value: 'space' }, 'Space'),
					React.createElement("option", { value: 'sport' }, 'Sport'),
					React.createElement("option", { value: 'technology' }, 'Technology'),
					React.createElement("option", { value: 'toys' }, 'Toys'),
					React.createElement("option", { value: 'transport' }, 'Transport'),
					React.createElement("option", { value: 'treaty' }, 'Treaty'),
					React.createElement("option", { value: 'world population' }, 'World Population'),
					React.createElement("option", { value: 'ww1' }, 'Ww1'),
					React.createElement("option", { value: 'ww2' }, 'Ww2')
				),
				React.createElement("button", { 'data-pointer': 0, onClick: this.props.buttonHandler }, '<<'),
				React.createElement("button", { 'data-pointer': 1, onClick: this.props.buttonHandler }, '>>')
			)
		)
	}
});