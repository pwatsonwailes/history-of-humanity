/*
---
name: Selectors
description: Deals with selecting of things
details: inspired by //product.voxmedia.com/til/2015/2/16/8047537/easy-selector-engine-with-vanilla-javascript
provides: $, $$
...
*/

var $ = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

/*
---
name: IsSet
description: a tidy function so you don't have to check undefined all the bloody time
provides: isset
...
*/

function isset (obj) { return typeof obj !== 'undefined'; }

/*
---
name: classie 1.0.1
description: makes number formatting not awful
//github.com/ded/bonzo
MIT license
...
*/

!function(s){"use strict";function e(s){return new RegExp("(^|\\s+)"+s+"(\\s+|$)")}function n(s,e){var n=t(s,e)?c:a;n(s,e)}var t,a,c;"classList"in document.documentElement?(t=function(s,e){return s.classList.contains(e)},a=function(s,e){s.classList.add(e)},c=function(s,e){s.classList.remove(e)}):(t=function(s,n){return e(n).test(s.className)},a=function(s,e){t(s,e)||(s.className=s.className+" "+e)},c=function(s,n){s.className=s.className.replace(e(n)," ")});var o={hasClass:t,addClass:a,removeClass:c,toggleClass:n,has:t,add:a,remove:c,toggle:n};"function"==typeof define&&define.amd?define(o):"object"==typeof exports?module.exports=o:s.classie=o}(window);

/*
---
name: mobileCheck
description: Checks if we're on a mobile device
details: inspired by //stackoverflow.com/a/11381730/989439
provides: mobileCheck
...
*/

function mobileCheck () {
	var check = false;
	(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}

/*
---
name: getViewportSize
description: Gets the dimensions of the viewport
...
*/

function getViewportSize() {
	var dims = {};
	dims.width = 0;
	dims.height = 0;

	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		dims.width = window.innerWidth;
		dims.height = window.innerHeight;
	}
	else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		dims.width = document.documentElement.clientWidth;
		dims.height = document.documentElement.clientHeight;
	}
	else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		//IE 4 compatible
		dims.width = document.body.clientWidth;
		dims.height = document.body.clientHeight;
	}

	return dims;
}

/*
---
name: escapeRegExp
description: escapes regex
...
*/

function escapeRegExp (string) {
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}


/*
---
Clouds
---
*/

var camera, scene, renderer,
	geometry, material, mesh;
 
function init () {
	clock = new THREE.Clock();

	renderer = new THREE.WebGLRenderer();

	scene = new THREE.Scene();
 
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;
	scene.add( camera );
 
	geometry = new THREE.BoxGeometry( 200, 200, 200 );
	material = new THREE.MeshLambertMaterial( { color: 0x93887d, wireframe: false } );
	mesh = new THREE.Mesh( geometry, material );
	//scene.add( mesh );
	cubeSineDriver = 0;
 
 	light = new THREE.DirectionalLight(0xfffadd, 1.5);
	light.position.set(-1,0,1);
	scene.add(light);
	
	smokeTexture = THREE.ImageUtils.loadTexture('/imgs/Smoke-Element.png');
	smokeMaterial = new THREE.MeshLambertMaterial({
		color: 0x93887d,
		map: smokeTexture,
		transparent: true
	});
	smokeMaterial.map.minFilter = THREE.LinearFilter;
	
	smokeGeo = new THREE.PlaneBufferGeometry(300,300);
	smokeParticles = [];

	for (p = 0; p < 200; p++) {
		var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
		particle.position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 1000 - 30);
		particle.rotation.z = Math.random() * 360;
		scene.add(particle);
		smokeParticles.push(particle);
	}
 
	$('bg').appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
}
 
function animate () {
	// note: three.js includes requestAnimationFrame shim
	delta = clock.getDelta();
	requestAnimationFrame( animate );
	evolveSmoke();
	render();
	onWindowResize();
}

function evolveSmoke () {
	var sp = smokeParticles.length;
	while(sp--) {
		smokeParticles[sp].rotation.z += (delta * 0.1);
	}
}

function updateLightPosition () {
	var time = Date.now() * 0.0002;

	light.position.x = Math.sin(time * 5);
	light.position.y = Math.cos(1/time);
}

function render () {
	mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.01;
	cubeSineDriver += .01;
	mesh.position.z = 100 + (Math.sin(cubeSineDriver) * 500);
	updateLightPosition();
	renderer.render( scene, camera );
}

function onWindowResize () {
	var dims = getViewportSize();

	var cWidth = dims.width;
	var cHeight = 670;

	if (!mobileCheck())
		cWidth = cWidth - 17;

	if (cHeight < dims.height)
		cHeight = dims.height;
	else if (cHeight > 1200)
		cHeight = 1200;

	camera.aspect = dims.width / dims.height;
	camera.updateProjectionMatrix();

	renderer.setSize(cWidth, cHeight);
}