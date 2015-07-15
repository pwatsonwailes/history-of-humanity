var ItemDetail = React.createClass({
	displayName: "ItemDetail",

	componentDidMount: function(props) {},

	componentDidUpdate: function () {},

	renderRelatedLinks: function (link) {
		return (
			React.createElement("li", { key: 'relatedLink' + link.link },
				React.createElement("a", { href: link.link }, link.title)
			)
		)
	},

	noRelatedLinks: function () {
		return React.createElement("li", { key: 'relatedLink' }, 'No related links')
	},

	renderMainLink: function () {
		if (isset(this.props.itemDetail.links.main)) {
			return (
				React.createElement("p", { key: 'mainLink' },
					React.createElement("span", null, 'Full article: '),
					React.createElement("a", { href: this.props.itemDetail.links.main.link }, this.props.itemDetail.links.main.title)
				)
			)
		}
		else
			return []
	},

	renderMainImage: function () {
		if (isset(this.props.wikiImages))
			return React.createElement("img", { key: 'mainImg', className: 'mainImg', src: this.props.wikiImages[0] })
		else
			return []
	},

	renderGalleryImg: function (imgUrl) {
		return React.createElement("img", { key: 'img' + imgUrl, className: 'galleryImg', src: imgUrl })
	},

	renderItemDetail: function () {
		if (isset(this.props.itemDetail.links.related))
			var itemLinks = this.props.itemDetail.links.related.map(this.renderRelatedLinks)
		else
			var itemLinks = this.noRelatedLinks();

		var mainLink = this.renderMainLink();
		var mainImage = this.renderMainImage();

		if (this.props.wikiImages !== false)
			var gallery = this.props.wikiImages.map(this.renderGalleryImg);
		else
			var gallery = [];

		return (
			React.createElement("div", { key: 'selectedItem' },
				React.createElement("h3", null, this.props.itemDetail.text),
				React.createElement("div", null,
					mainImage,
					React.createElement("p", null, this.props.wikiData.extract),
					mainLink
				),
				React.createElement("h4", null, 'Images'),
				React.createElement("div", null,
					gallery
				),
				React.createElement("h4", null, 'Related Links'),
				React.createElement("ul", null,
					itemLinks
				)
			)
		)
	},

	noSelectedItem: function () {
		return (
			React.createElement("div", { key: 'selectedItem' },
				React.createElement("p", null, 'No item selected')
			)
		)
	},

	render: function () {
		var itemDetail = (this.props.itemDetail === false) ? this.noSelectedItem() : this.renderItemDetail();

		return (
			React.createElement("div", { className: "item_detail" },
				itemDetail
			)
		)
	}
});