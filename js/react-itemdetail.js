var ItemDetail = React.createClass({
	displayName: "ItemDetail",

	getInitialState: function (props) {
		return {
			galleryPointer: 0
		}
	},

	componentDidMount: function(props) {},

	componentWillReceiveProps: function () {
		this.setState({
			galleryPointer: 0
		});
	},

	componentDidUpdate: function () {},

	renderRelatedLinks: function (link) {
		return (
			React.createElement("li", { key: 'relatedLink' + link.link },
				React.createElement("a", { href: link.link, target: '_blank' }, link.title)
			)
		)
	},

	noRelatedLinks: function () {
		return React.createElement("li", { key: 'relatedLink' }, 'No related links')
	},

	noImages: function () {
		return React.createElement("p", { key: 'gallery' }, 'No images')
	},

	renderMainLink: function () {
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
	},

	renderGalleryImg: function (imgUrl) {
		return React.createElement("img", { key: 'img' + imgUrl, className: 'galleryImg', src: imgUrl })
	},

	renderControls: function () {
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
	},

	buttonHandler: function (e) {
		var id = (isset(e.target.id) && (e.target.id === 'galleryBack' || e.target.id === 'galleryForward')) ? e.target.id : e.target.parentNode.id;

		if (id === 'galleryForward')
			var newPointerPosition = (this.state.galleryPointer + 3 < this.props.wikiImages.length) ? this.state.galleryPointer + 1 : false;
		else
			var newPointerPosition = (this.state.galleryPointer - 1 < 0) ? false : this.state.galleryPointer - 1;

		if (newPointerPosition)
			this.setState({ galleryPointer: newPointerPosition });
	},

	extracts: function (extract, i) {
		return React.createElement("p", { key: 'extracts_' + i }, extract)
	},

	render: function () {
		var className = (this.props.active) ? 'active' : '';
		var windowDims = getViewportSize();

		if (this.props.itemDetail !== false) {
			if (isset(this.props.itemDetail.links.related))
				var itemLinks = this.props.itemDetail.links.related.map(this.renderRelatedLinks)
			else
				var itemLinks = this.noRelatedLinks();

			var mainLink = this.renderMainLink();


			if (this.props.wikiImages !== false && this.props.wikiImages.length > 0) {
				var gallery = [];
				var n = (this.state.galleryPointer + 3 <= this.props.wikiImages.length) ? this.state.galleryPointer + 3 : this.props.wikiImages.length;

				for (var i = this.state.galleryPointer; i < n; i++) {
					var img = this.renderGalleryImg(this.props.wikiImages[i]);
					gallery.push(img);
				}
			}
			else
				var gallery = this.noImages();

			if (this.props.wikiData !== false && this.props.wikiData.extract !== false && this.props.wikiData.extract !== '') {
				var paragraphs = this.props.wikiData.extract.split("\n");
				var extract = paragraphs.map(this.extracts);
			}
			else
				extract = [];

			var controls = (gallery.length > 0) ? this.renderControls() : [];

			return (
				React.createElement("div", { id: "itemDetail", className: className, style: { maxHeight: windowDims.height - 20 } },
					React.createElement("h3", null, this.props.itemDetail.text),
					React.createElement("div", null,
						extract,
						mainLink
					),
					React.createElement("h4", null, 'Related Links'),
					React.createElement("ul", null,
						itemLinks
					),
					React.createElement("div", { id: 'galleryTitle' },
						React.createElement("h4", null, 'Images'),
						controls
					),
					React.createElement("div", { id: 'gallery' }, gallery)
				)
			)
		}
		else {
			return React.createElement("div", { id: "itemDetail", style: { maxHeight: 0 } })
		}
	}
});