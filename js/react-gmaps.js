var GMap = React.createClass({
	displayName: "GMap",

	map: null,
	markers: null,
	infoWindow: null,
	style: [{
		"featureType": "landscape",
		"elementType": "geometry.fill",
		"stylers": [{
			"visibility": "on"
		}, {
			"color": "#DDD4CB"
		}]
	}, {
		"featureType": "poi",
		"stylers": [{
			"visibility": "off"
		}]
	}, {
		"featureType": "road",
		"stylers": [{
			"visibility": "off"
		}]
	}, {
		"featureType": "transit",
		"stylers": [{
			"visibility": "off"
		}]
	}, {
		"featureType": "administrative",
		"elementType": "labels",
		"stylers": [{
			"color": "#808080"
		}, {
			"visibility": "on"
		}, {
			"weight": 0.2
		}]
	}, {
		"featureType": "administrative.locality",
		"stylers": [{
			"visibility": "off"
		}]
	}, {
		"featureType": "administrative.neighborhood",
		"stylers": [{
			"visibility": "off"
		}]
	}, {
		"featureType": "administrative.land_parcel",
		"stylers": [{
			"visibility": "off"
		}]
	}, {
		"featureType": "administrative.country",
		"elementType": "labels.text.fill",
		"stylers": [{
			"invert_lightness": true
		}, {
			"visibility": "simplified"
		}]
	}, {
		"featureType": "administrative.country",
		"elementType": "geometry.stroke",
		"stylers": [{
			"color": "#F7F5F2"
		}, {
			"visibility": "on"
		}, {
			"weight": 1.0
		}]
	}, {
		"featureType": "administrative.province",
		"stylers": [{
			"visibility": "off"
		}]
	}, {
		"featureType": "water",
		"elementType": "geometry.fill",
		"stylers": [{
			"color": "#F7F5F2"
		}, {
			"visibility": "on"
		}]
	}, {
		"featureType": "water",
		"elementType": "labels.text.fill",
		"stylers": [{
			"visibility": "simplified"
		}, {
			"invert_lightness": true
		}]
	}, {
		"elementType": "labels.text.fill",
		"stylers": [{
			"color": "#808080"
		}]
	}],

	componentWillMount: function() {
		this.updateDimensions();
	},

	componentDidMount: function(props) {
		var self = this;
		// load initial map
		this.map = this.createMap();
		this.markers = [];

		google.maps.event.addListener(this.map, 'center_changed', function() {
			self.checkBounds(self.map);
		});

		google.maps.event.addDomListener(window, "resize", function() {
			var center = self.map.getCenter();
			google.maps.event.trigger(self.map, "resize");
			self.map.setCenter(center);
		});

		window.addEventListener("resize", this.updateDimensions);
	},

	componentWillUnmount: function() {
		window.removeEventListener("resize", this.updateDimensions);
	},

	shouldComponentUpdate: function (newProps, newState) {
		return newProps.mapsKey !== this.props.mapsKey || newState.width !== this.state.width;
	},

	componentDidUpdate: function () {
		this.clearMarkers();

		if (this.props.items.length > 0)
		{
			var x = this.props.pointer * this.props.show;
			var y = this.props.pointer * this.props.show + this.props.show;
			var year = this.props.items[x].year;

			for (var i = x; i < y; i++) {
				var currentItem = this.props.items[i];

				if (isset(currentItem.latlong) && currentItem.latlong.length > 0)
				{
					for (var j = currentItem.latlong.length - 1; j >= 0; j--) {
						var marker = new MarkerWithLabel({
							icon: {
								path: google.maps.SymbolPath.CIRCLE,
								scale: 0,
							},
							labelAnchor: new google.maps.Point(10, 10),
							labelClass: "label",
							position: new google.maps.LatLng(currentItem.latlong[j][0], currentItem.latlong[j][1]),
							map: this.map
						});
						
						this.markers.push(marker);
					}
				}
			}

			this.setMapOnAll(this.map);
		}
	},

	updateDimensions: function (returnStyles) {
		var dims = getViewportSize();

		var styles = {
			height: '600px',
			width: '1300px'
		}

		if (dims.width < 640) {
			styles.height = '250px';
			styles.width = '285px';
		}
		else if (dims.width > 640 && dims.width < 800) {
			styles.height = '325px';
			styles.width = '425px';
		}
		else if (dims.width > 800 && dims.width < 1024) {
			styles.height = '455px';
			styles.width = '625px';
		}
		else if (dims.width > 1024 && dims.width < 1376) {
			styles.width = '900px';
		}
		else if (dims.width > 1376 && dims.width < 1840) {
			styles.width = '1200px';
		}

		this.setState(styles);
	},


	clearMarkers: function () {
		this.setMapOnAll(null);
		this.markers = [];
	},

	setMapOnAll: function (map) {
		for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(map);
		}
	},

	createMap: function() {
		var mapOptions = {
			//disableDefaultUI: true,
			maxZoom: 10,
			minZoom: 2,
			scrollwheel: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: this.style,
			streetViewControl: !1,
			mapTypeControl: !1,
			zoom: this.props.initialZoom,
			center: new google.maps.LatLng(this.props.centerLat, this.props.centerLng)
		};

		return new google.maps.Map(this.refs.mapCanvas.getDOMNode(), mapOptions);
	},

	// If the map position is out of range, move it back
	checkBounds: function (map) {
		var latNorth = map.getBounds().getNorthEast().lat();
		var latSouth = map.getBounds().getSouthWest().lat();
		var newLat;

		var pi = Math.PI;

		var t1 = Math.pow(Math.E, pi);
		var t2 = Math.pow(Math.E, 0 - pi);
		var sinh = (t1 - t2) / 2;

		var atan = Math.atan(sinh);

		var pos = atan * 180 / pi;
		var neg = 0 - pos;

		if (latNorth < pos && latSouth > neg) /* in both side -> it's ok */
			return;
		else {
			if (latNorth > pos && latSouth < neg) /* out both side -> it's ok */
				return;
			else {
				if (latNorth > pos)
					newLat = map.getCenter().lat() - (latNorth - pos); /* too north, centering */
				if (latSouth < neg)
					newLat = map.getCenter().lat() - (latSouth + 85); /* too south, centering */
			}
		}

		if (newLat) {
			var newCenter = new google.maps.LatLng(newLat, map.getCenter().lng());
			map.setCenter(newCenter);
		}
	},

	render: function () {
		return (
			React.createElement("div", { id: "gmap" },
				React.createElement("div", { ref: "mapCanvas", id: "mapCanvas" })
			)
		)
	}
});