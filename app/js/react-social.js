import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios';

class Social extends React.Component {
	constructor() {
		super();

		this.state = {
			active: false,
			topPosition: 0
		};
	}

	componentDidMount() {
		var self = this;
		var reqUrl = 'https://zorg.builtvisible.com/tools/scrs/json';
		var api_key = '65b608cf38b638ea71cf4c9baad182ae';

		axios.get(reqUrl + '?api_key=' + api_key + '&url=' + window.location.href)
		.then(function(res) {
			self.updateCounts(res.data);
		});

		this.updateDimensions();

		window.addEventListener("resize", this.updateDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
	}

	shouldComponentUpdate(newProps, newState) {
		return newState.topPosition !== this.state.topPosition || newState.active !== this.state.active;
	}

	updateDimensions() {
		if (typeof window !== 'undefined') {
			var dims = getViewportSize();

			var topPosition = 600;

			if (topPosition > dims.height)
				topPosition = dims.height;

			topPosition -= 15;

			this.setState({ topPosition: topPosition });
		}
	}

	updateCounts(data) {
		this.setState({ counts: data });
	}

	formatShareValue(value) {
		value = parseInt(value);

		if (value > 1000000)
			formatted =(Math.ceil(value / 10000) / 100) + 'm';
		else if (value > 1000)
			formatted =(Math.ceil(value / 100) / 10) + 'k';
		else
			formatted = value;

		return formatted;
	}

	toggleButtons() {
		this.setState({ active: !this.state.active })
	}

	openWin(e) {
		var socialSites = {
			"facebook": {
				"url": 'http://www.facebook.com/sharer/sharer.php?u={encUrl}&t={encTitle}',
				"spec": 'toolbar=0, status=0, width=900, height=500',
			},
			"twitter": {
				"url": 'https://twitter.com/intent/tweet?text={encTitle}&url={encUrl}',
				"spec": 'toolbar=0, status=0, width=650, height=360',
			},
			"googleplus": {
				"url": 'https://plus.google.com/share?url={shareUrl}',
				"spec": 'toolbar=0, status=0, width=900, height=500',
			},
			"linkedin": {
				"url": 'https://www.linkedin.com/cws/share?url={shareUrl}&token=&isFramed=true',
				"spec": 'toolbar=no, width=550, height=550',
			},
			"stumbleupon": {
				"url": 'http://www.stumbleupon.com/submit?url={shareUrl}&title={shareTitle}',
				"spec": 'toolbar=no, width=700, height=300'
			}
		};

		var site =(typeof e.target.dataset.site !== 'undefined') ? e.target.dataset.site : e.target.parentNode.dataset.site;

		/* Feel free to add to these as you wish */
		var shareUrl = document.location.href;
		var shareTitle = document.title;
		var encUrl = encodeURIComponent(shareUrl);
		var encTitle = encodeURIComponent(shareTitle);

		if (this.props.atName !== false) {
			shareTitle = shareTitle + ' ' + '@' + this.props.atName;
		}

		var newWinUrl = socialSites[site]['url'].replace(new RegExp(escapeRegExp("{encUrl}"), 'g'), encUrl);
		newWinUrl = newWinUrl.replace(new RegExp(escapeRegExp("{encTitle}"), 'g'), encTitle);
		newWinUrl = newWinUrl.replace(new RegExp(escapeRegExp("{shareUrl}"), 'g'), shareUrl);
		newWinUrl = newWinUrl.replace(new RegExp(escapeRegExp("{shareTitle}"), 'g'), shareTitle);

		window.open(newWinUrl, "", socialSites[site]['spec']);
	}

	renderSocialIcons() {
		return (
			React.createElement(ReactCSSTransitionGroup, { key: 'socialIcons', id: 'socialIcons', transitionName: "socialTransition", transitionAppear: true, transitionAppearTimeout: 500, transitionEnterTimeout: 500, transitionLeaveTimeout: 500 },
				React.createElement("div", { id: 'facebook', className: 'socialBox' },
					React.createElement("span", { className: 'count' }, this.formatShareValue(this.state.counts.Facebook.total_count)),
					React.createElement("span", { className: 'share', 'data-site': 'facebook', onClick: this.openWin },
						React.createElement("i", { className: 'fa fa-facebook' })
					)
				),
				React.createElement("div", { id: 'twitter', className: 'socialBox' },
					React.createElement("span", { className: 'count' }, this.formatShareValue(this.state.counts.Twitter)),
					React.createElement("span", { className: 'share', 'data-site': 'twitter', onClick: this.openWin },
						React.createElement("i", { className: 'fa fa-twitter' })
					)
				),
				React.createElement("div", { id: 'googleplus', className: 'socialBox' },
					React.createElement("span", { className: 'count' }, this.formatShareValue(this.state.counts.GooglePlusOne)),
					React.createElement("span", { className: 'share', 'data-site': 'googleplus', onClick: this.openWin },
						React.createElement("i", { className: 'fa fa-google' })
					)
				),
				React.createElement("div", { id: 'linkedin', className: 'socialBox' },
					React.createElement("span", { className: 'count' }, this.formatShareValue(this.state.counts.LinkedIn)),
					React.createElement("span", { className: 'share', 'data-site': 'linkedin', onClick: this.openWin },
						React.createElement("i", { className: 'fa fa-linkedin' })
					)
				),
				React.createElement("div", { id: 'stumbleupon', className: 'socialBox' },
					React.createElement("span", { className: 'count' }, this.formatShareValue(this.state.counts.StumbleUpon)),
					React.createElement("span", { className: 'share', 'data-site': 'stumbleupon', onClick: this.openWin },
						React.createElement("i", { className: 'fa fa-stumbleupon' })
					)
				)
			)
		)
	}

	render() {
		var className =(this.state.active) ? 'active' : '';
		var socialIcons =(this.state.active) ? this.renderSocialIcons() : [];

		return (
			React.createElement("div", { className: className, id: 'socialButtons', style: { top: this.state.topPosition + 'px' } },
				React.createElement("span", { id: 'circleBg' },
					React.createElement("i", { className: 'fa fa-share-alt-square', onClick: this.toggleButtons })
				),
				socialIcons
			)
		)
	}
}

Social.defaultProps = {
	domain: '',
	img: '',
	share: { // the networks available
		Facebook: true,
		Twitter: true,
		GooglePlusOne: true,
		LinkedIn: true,
		StumbleUpon: true,
		Pinterest: true,
		BufferApp: true
	},
	counts: {}, // the data
	atName: false
};

export default Social;