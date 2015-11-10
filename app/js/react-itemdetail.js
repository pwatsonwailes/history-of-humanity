function isset (obj) { return typeof obj !== 'undefined'; }

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class ItemDetail extends React.Component {
	constructor() {
		super();

		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
		this.renderRelatedLink = this.renderRelatedLink.bind(this);
		this.noRelatedLinks = this.noRelatedLinks.bind(this);
		this.renderItemLocation = this.renderItemLocation.bind(this);
		this.noLocations = this.noLocations.bind(this);
		this.renderGalleryImg = this.renderGalleryImg.bind(this);
		this.noImages = this.noImages.bind(this);
		this.renderMainLink = this.renderMainLink.bind(this);
		this.renderControls = this.renderControls.bind(this);
		this.buttonHandler = this.buttonHandler.bind(this);
		this.renderExtract = this.renderExtract.bind(this);

		this.state = {
			galleryPointer: 0,
			maxHeight: 600
		};
	}

	componentDidMount() {
		if (typeof window !== 'undefined')
			this.setState({ maxHeight: getViewportSize().height - 20 })
	}
	
	componentWillReceiveProps() { this.setState({ galleryPointer: 0 }); }

	renderRelatedLink(link) {
		return (
			React.createElement("li", { key: 'relatedLink' + link.link },
				React.createElement("a", { href: link.link, target: '_blank' }, link.title)
			)
		)
	}

	noRelatedLinks() { return React.createElement("li", { key: 'relatedLink' }, 'No related links') }

	renderItemLocation(location) { return React.createElement("li", { key: 'loc' + location }, location) }
	noLocations() { return React.createElement("li", { key: 'locations' }, 'No locations to show') }

	renderGalleryImg(imgUrl) { return React.createElement("img", { key: 'img' + imgUrl, className: 'galleryImg', src: imgUrl }) }
	noImages() { return React.createElement("p", { key: 'gallery' }, 'No images') }

	renderMainLink() {
		if (isset(this.props.itemDetail.links.main)) {
			return (
				React.createElement("p", { key: 'mainLink', id: 'mainLink' },
					React.createElement("span", null, 'Full article: '),
					React.createElement("a", { href: this.props.itemDetail.links.main.link, target: '_blank' }, this.props.itemDetail.links.main.title)
				)
			)
		}
		else
			return []
	}

	renderControls() {
		return (
			React.createElement("div", { key: 'galleryControls' },
				React.createElement("span", { className: 'fa_button', id: 'galleryBack', onClick: this.buttonHandler },
					React.createElement("i", { className: 'fa fa-angle-double-left' })
				),
				React.createElement("span", { className: 'fa_button', id: 'galleryForward',  onClick: this.buttonHandler },
					React.createElement("i", { className: 'fa fa-angle-double-right' })
				)
			)
		)
	}

	buttonHandler(e) {
		var id = (isset(e.target.id) &&(e.target.id === 'galleryBack' || e.target.id === 'galleryForward')) ? e.target.id : e.target.parentNode.id;

		if (id === 'galleryForward')
			var newPointerPosition =(this.state.galleryPointer + 3 < this.props.wikiImages.length) ? this.state.galleryPointer + 1 : false;
		else
			var newPointerPosition =(this.state.galleryPointer - 1 < 0) ? false : this.state.galleryPointer - 1;

		if (newPointerPosition)
			this.setState({ galleryPointer: newPointerPosition });
	}

	renderExtract(extract, i) { return React.createElement("p", { key: 'extracts_' + i }, extract) }

	render() {
		if (this.props.itemDetail !== false) {
			if (isset(this.props.itemDetail.links.related))
				var itemLinks = this.props.itemDetail.links.related.map(this.renderRelatedLink);
			else
				var itemLinks = this.noRelatedLinks();

			if (isset(this.props.itemDetail.locations[0]))
				var itemLocations = this.props.itemDetail.locations.map(this.renderItemLocation);
			else
				var itemLocations = this.noLocations();

			var mainLink = this.renderMainLink();

			if (this.props.wikiImages !== false && this.props.wikiImages.length > 0) {
				var gallery = [];
				var n =(this.state.galleryPointer + 3 <= this.props.wikiImages.length) ? this.state.galleryPointer + 3 : this.props.wikiImages.length;

				for (var i = this.state.galleryPointer; i < n; i++) {
					var img = this.renderGalleryImg(this.props.wikiImages[i]);
					gallery.push(img);
				}
			}
			else
				var gallery = this.noImages();

			if (this.props.wikiData !== false && this.props.wikiData.extract !== false && this.props.wikiData.extract !== '') {
				var paragraphs = this.props.wikiData.extract.split("\n");
				var extract = paragraphs.map(this.renderExtract);
			}
			else
				extract = [];

			var controls =(gallery.length > 0) ? this.renderControls() : [];

			return (
				React.createElement(ReactCSSTransitionGroup, { id: "itemDetail", transitionName: 'itemDetailTransition', transitionAppear: true, transitionAppearTimeout: 500, transitionEnterTimeout: 500, transitionLeaveTimeout: 500, style: { maxHeight: this.state.maxHeight } },
					React.createElement("h3", null, this.props.itemDetail.text),
					React.createElement("div", null,
						extract,
						mainLink
					),
					React.createElement("h4", null, 'Locations'),
					React.createElement("ul", null, itemLocations),
					React.createElement("h4", null, 'Related Links'),
					React.createElement("ul", null, itemLinks),
					React.createElement("div", { id: 'galleryTitle' },
						React.createElement("h4", null, 'Images'),
						controls
					),
					React.createElement("div", { id: 'gallery' }, gallery)
				)
			)
		}
	}
}