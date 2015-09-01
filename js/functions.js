/*
---
name: qwest 1.7.0
description: does what it says on the tin
//github.com/pyrsmk/qwest
MIT license
...
*/

!function(e,t,s){"undefined"!=typeof module&&module.exports?module.exports=s:"function"==typeof define&&define.amd?define(s):e[t]=s}(this,"qwest",function(){var win=window,doc=document,before,defaultXdrResponseType="json",limit=null,requests=0,request_stack=[],getXHR=function(){return win.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP")},xhr2=""===getXHR().responseType,qwest=function(method,url,data,options,before){method=method.toUpperCase(),data=data||null,options=options||{};var nativeResponseParsing=!1,crossOrigin,xhr,xdr=!1,timeoutInterval,aborted=!1,attempts=0,headers={},mimeTypes={text:"*/*",xml:"text/xml",json:"application/json",post:"application/x-www-form-urlencoded"},accept={text:"*/*",xml:"application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1",json:"application/json; q=1.0, text/*; q=0.8, */*; q=0.1"},contentType="Content-Type",vars="",i,j,serialized,then_stack=[],catch_stack=[],complete_stack=[],response,success,error,func,promises={then:function(e){return options.async?then_stack.push(e):success&&e.call(xhr,response),promises},"catch":function(e){return options.async?catch_stack.push(e):error&&e.call(xhr,response),promises},complete:function(e){return options.async?complete_stack.push(e):e.call(xhr),promises}},promises_limit={then:function(e){return request_stack[request_stack.length-1].then.push(e),promises_limit},"catch":function(e){return request_stack[request_stack.length-1]["catch"].push(e),promises_limit},complete:function(e){return request_stack[request_stack.length-1].complete.push(e),promises_limit}},handleResponse=function(){if(!aborted){var i,req,p,responseType;if(--requests,clearInterval(timeoutInterval),request_stack.length){for(req=request_stack.shift(),p=qwest(req.method,req.url,req.data,req.options,req.before),i=0;func=req.then[i];++i)p.then(func);for(i=0;func=req["catch"][i];++i)p["catch"](func);for(i=0;func=req.complete[i];++i)p.complete(func)}try{var responseText="responseText",responseXML="responseXML",parseError="parseError";if(nativeResponseParsing&&"response"in xhr&&null!==xhr.response)response=xhr.response;else if("document"==options.responseType){var frame=doc.createElement("iframe");frame.style.display="none",doc.body.appendChild(frame),frame.contentDocument.open(),frame.contentDocument.write(xhr.response),frame.contentDocument.close(),response=frame.contentDocument,doc.body.removeChild(frame)}else{if(responseType=options.responseType,"auto"==responseType)if(xdr)responseType=defaultXdrResponseType;else{var ct=xhr.getResponseHeader(contentType)||"";responseType=ct.indexOf(mimeTypes.json)>-1?"json":ct.indexOf(mimeTypes.xml)>-1?"xml":"text"}switch(responseType){case"json":try{response="JSON"in win?JSON.parse(xhr[responseText]):eval("("+xhr[responseText]+")")}catch(e){throw"Error while parsing JSON body : "+e}break;case"xml":try{win.DOMParser?response=(new DOMParser).parseFromString(xhr[responseText],"text/xml"):(response=new ActiveXObject("Microsoft.XMLDOM"),response.async="false",response.loadXML(xhr[responseText]))}catch(e){response=void 0}if(!response||!response.documentElement||response.getElementsByTagName("parsererror").length)throw"Invalid XML";break;default:response=xhr[responseText]}}if("status"in xhr&&!/^2|1223/.test(xhr.status))throw xhr.status+" ("+xhr.statusText+")";if(success=!0,p=response,options.async)for(i=0;func=then_stack[i];++i)p=func.call(xhr,p)}catch(e){if(error=!0,options.async)for(i=0;func=catch_stack[i];++i)func.call(xhr,e,response)}if(options.async)for(i=0;func=complete_stack[i];++i)func.call(xhr,response)}},handleError=function(e){if(error=!0,--requests,clearInterval(timeoutInterval),options.async)for(i=0;func=catch_stack[i];++i)func.call(xhr,e,null)},buildData=function(e,t){var s,o=[],n=encodeURIComponent;if("object"==typeof e&&null!=e){for(s in e)if(e.hasOwnProperty(s)){var r=buildData(e[s],t?t+"["+s+"]":s);""!==r&&(o=o.concat(r))}}else null!=e&&null!=t&&o.push(n(t)+"="+n(e));return o.join("&")};switch(++requests,"retries"in options&&(win.console&&console.warn&&console.warn('[Qwest] The retries option is deprecated. It indicates total number of requests to attempt. Please use the "attempts" option.'),options.attempts=options.retries),options.async="async"in options?!!options.async:!0,options.cache="cache"in options?!!options.cache:"GET"!=method,options.dataType="dataType"in options?options.dataType.toLowerCase():"post",options.responseType="responseType"in options?options.responseType.toLowerCase():"auto",options.user=options.user||"",options.password=options.password||"",options.withCredentials=!!options.withCredentials,options.timeout="timeout"in options?parseInt(options.timeout,10):3e4,options.attempts="attempts"in options?parseInt(options.attempts,10):1,i=url.match(/\/\/(.+?)\//),crossOrigin=i&&i[1]?i[1]!=location.host:!1,"ArrayBuffer"in win&&data instanceof ArrayBuffer?options.dataType="arraybuffer":"Blob"in win&&data instanceof Blob?options.dataType="blob":"Document"in win&&data instanceof Document?options.dataType="document":"FormData"in win&&data instanceof FormData&&(options.dataType="formdata"),options.dataType){case"json":data=JSON.stringify(data);break;case"post":data=buildData(data)}if(options.headers){var format=function(e,t,s){return t+s.toUpperCase()};for(i in options.headers)headers[i.replace(/(^|-)([^-])/g,format)]=options.headers[i]}if(headers[contentType]||"GET"==method||options.dataType in mimeTypes&&mimeTypes[options.dataType]&&(headers[contentType]=mimeTypes[options.dataType]),headers.Accept||(headers.Accept=options.responseType in accept?accept[options.responseType]:"*/*"),crossOrigin||headers["X-Requested-With"]||(headers["X-Requested-With"]="XMLHttpRequest"),"GET"==method&&data&&(vars+=data),options.cache||(vars&&(vars+="&"),vars+="__t="+ +new Date),vars&&(url+=(/\?/.test(url)?"&":"?")+vars),limit&&requests==limit)return request_stack.push({method:method,url:url,data:data,options:options,before:before,then:[],"catch":[],complete:[]}),promises_limit;var send=function(){if(xhr=getXHR(),crossOrigin&&("withCredentials"in xhr||!win.XDomainRequest||(xhr=new XDomainRequest,xdr=!0,"GET"!=method&&"POST"!=method&&(method="POST"))),xdr?xhr.open(method,url):(xhr.open(method,url,options.async,options.user,options.password),xhr2&&options.async&&(xhr.withCredentials=options.withCredentials)),!xdr)for(var e in headers)xhr.setRequestHeader(e,headers[e]);if(xhr2&&"document"!=options.responseType&&"auto"!=options.responseType)try{xhr.responseType=options.responseType,nativeResponseParsing=xhr.responseType==options.responseType}catch(t){}xhr2||xdr?(xhr.onload=handleResponse,xhr.onerror=handleError):xhr.onreadystatechange=function(){4==xhr.readyState&&handleResponse()},"auto"!=options.responseType&&"overrideMimeType"in xhr&&xhr.overrideMimeType(mimeTypes[options.responseType]),before&&before.call(xhr),xdr?setTimeout(function(){xhr.send("GET"!=method?data:null)},0):xhr.send("GET"!=method?data:null)},timeout=function(){timeoutInterval=setTimeout(function(){if(aborted=!0,xhr.abort(),options.attempts&&++attempts==options.attempts){if(aborted=!1,error=!0,response="Timeout ("+url+")",options.async)for(i=0;func=catch_stack[i];++i)func.call(xhr,response)}else aborted=!1,timeout(),send()},options.timeout)};return timeout(),send(),promises},create=function(e){return function(t,s,o){var n=before;return before=null,qwest(e,this.base+t,s,o,n)}},obj={base:"",before:function(e){return before=e,obj},get:create("GET"),post:create("POST"),put:create("PUT"),"delete":create("DELETE"),xhr2:xhr2,limit:function(e){limit=e},setDefaultXdrResponseType:function(e){defaultXdrResponseType=e.toLowerCase()}};return obj}());

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
name: toggleMode
description: simple class toggle for a trigger and target using Classie
Inspired by //tympanus.net/codrops/2013/07/30/google-nexus-website-menu/
provides: toggleMode
...
*/

;(function(window) {
	'use strict';

	function toggleMode (trigger, target, options) {
		if (typeof options === 'undefined')
			this.options = {};
		else
			this.options = options;

		var mobile = mobileCheck();

		this.activeTriggerClass = (isset(this.options.activeTriggerClass))
			? this.options.activeTriggerClass
			: 'active_trigger';

		this.activeTargetClass = (isset(this.options.activeTargetClass))
			? this.options.activeTargetClass
			: 'active_target';

		this.autoTrigger = (!isset(this.options.autoTrigger) || this.options.autoTrigger)
			? true
			: false;

		this.passThrough = (isset(this.options.passThrough))
			? this.options.passThrough
			: mobile;

		this.isMenuOpen = (!isset(this.options.autoTrigger) || !this.options.startOpen)
			? false
			: true;

		this.trigger = trigger;
		this.target = target;
		this._init();
	}

	toggleMode.prototype = {
		_init : function() {
			this.eventType = mobileCheck() ? 'touchstart' : 'click';
			this._initEvents();

			var self = this;

			this.bodyClickFn = function() {
				self._closeMenu();
				this.removeEventListener(self.eventType, self.bodyClickFn);
			};
		},

		_initEvents : function() {
			var self = this;

			this.trigger.addEventListener(this.eventType, function(e) {
				e.stopPropagation();
				e.preventDefault();

				if (self.isMenuOpen) {
					self._closeMenu();

					if (self.autoTrigger)
						document.removeEventListener(self.eventType, self.bodyClickFn);
				}
				else {
					self._openMenu();

					if (self.autoTrigger)
						document.addEventListener(self.eventType, self.bodyClickFn);
				}
			});

			if (self.autoTrigger && self.passThrough)
				this.target.addEventListener(this.eventType, function(e) { e.stopPropagation(); });
		},

		_openMenu : function() {
			if (this.isMenuOpen)
				return;

			this.isMenuOpen = true;

			classie.add(this.trigger, this.activeTriggerClass);
			classie.add(this.target, this.activeTargetClass);
		},

		_closeMenu : function() {
			if (!this.isMenuOpen)
				return;

			this.isMenuOpen = false;

			classie.remove(this.trigger, this.options.activeTriggerClass);
			classie.remove(this.target, this.options.activeTargetClass);
		}
	}

	// add to global namespace
	window.toggleMode = toggleMode;

})(window);


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
  
	smokeTexture = THREE.ImageUtils.loadTexture('./imgs/Smoke-Element.png');
	smokeMaterial = new THREE.MeshLambertMaterial({color: 0x93887d, map: smokeTexture, transparent: true});
	smokeGeo = new THREE.PlaneGeometry(300,300);
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
	onWindowResize();
}

function onWindowResize () {
	var dims = getViewportSize();
	console.log(dims);

	var cWidth = dims.width;
	var cHeight = 670;

	if (!mobileCheck())
		cWidth = cWidth - 17;

	if (cHeight < dims.height)
		cHeight = dims.height;
	else if (cHeight > 1200)
		cHeight = 1200;

	camera.aspect = cWidth / cHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(cWidth, cHeight);
}