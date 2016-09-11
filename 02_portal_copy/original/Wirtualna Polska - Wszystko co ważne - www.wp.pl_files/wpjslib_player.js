/*===Copyright 2015-2016 Wirtualna Polska http://www.wp.pl - Build date: 2016-09-08T21:56:56.505Z===*/
(function( $, undef )
{
	if ( $.fn.dotdotdot )
	{
		return;
	}

	$.fn.dotdotdot = function( o )
	{
		if ( this.length == 0 )
		{
			$.fn.dotdotdot.debug( 'No element found for "' + this.selector + '".' );
			return this;
		}
		if ( this.length > 1 )
		{
			return this.each(
				function()
				{
					$(this).dotdotdot( o );
				}
			);
		}


		var $dot = this;
		var orgContent	= $dot.contents();

		if ( $dot.data( 'dotdotdot' ) )
		{
			$dot.trigger( 'destroy.dot' );
		}

		$dot.data( 'dotdotdot-style', $dot.attr( 'style' ) || '' );
		$dot.css( 'word-wrap', 'break-word' );
		if ($dot.css( 'white-space' ) === 'nowrap')
		{
			$dot.css( 'white-space', 'normal' );
		}

		$dot.bind_events = function()
		{
			$dot.bind(
				'update.dot',
				function( e, c )
				{
					$dot.removeClass("is-truncated");
					e.preventDefault();
					e.stopPropagation();

					switch( typeof opts.height )
					{
						case 'number':
							opts.maxHeight = opts.height;
							break;

						case 'function':
							opts.maxHeight = opts.height.call( $dot[ 0 ] );
							break;

						default:
							opts.maxHeight = getTrueInnerHeight( $dot );
							break;
					}

					opts.maxHeight += opts.tolerance;

					if ( typeof c != 'undefined' )
					{
						if ( typeof c == 'string' || ('nodeType' in c && c.nodeType === 1) )
						{
					 		c = $('<div />').append( c ).contents();
						}
						if ( c instanceof $ )
						{
							orgContent = c;
						}
					}

					$inr = $dot.wrapInner( '<div class="dotdotdot" />' ).children();
					$inr.contents()
						.detach()
						.end()
						.append( orgContent.clone( true ) )
						.find( 'br' )
						.replaceWith( '  <br />  ' )
						.end()
						.css({
							'height'	: 'auto',
							'width'		: 'auto',
							'border'	: 'none',
							'padding'	: 0,
							'margin'	: 0
						});

					var after = false,
						trunc = false;

					if ( conf.afterElement )
					{
						after = conf.afterElement.clone( true );
						after.show();
						conf.afterElement.detach();
					}

					if ( test( $inr, opts ) )
					{
						if ( opts.wrap == 'children' )
						{
							trunc = children( $inr, opts, after );
						}
						else
						{
							trunc = ellipsis( $inr, $dot, $inr, opts, after );
						}
					}
					$inr.replaceWith( $inr.contents() );
					$inr = null;

					if ( $.isFunction( opts.callback ) )
					{
						opts.callback.call( $dot[ 0 ], trunc, orgContent );
					}

					conf.isTruncated = trunc;
					return trunc;
				}

			).bind(
				'isTruncated.dot',
				function( e, fn )
				{
					e.preventDefault();
					e.stopPropagation();

					if ( typeof fn == 'function' )
					{
						fn.call( $dot[ 0 ], conf.isTruncated );
					}
					return conf.isTruncated;
				}

			).bind(
				'originalContent.dot',
				function( e, fn )
				{
					e.preventDefault();
					e.stopPropagation();

					if ( typeof fn == 'function' )
					{
						fn.call( $dot[ 0 ], orgContent );
					}
					return orgContent;
				}

			).bind(
				'destroy.dot',
				function( e )
				{
					e.preventDefault();
					e.stopPropagation();

					$dot.unwatch()
						.unbind_events()
						.contents()
						.detach()
						.end()
						.append( orgContent )
						.attr( 'style', $dot.data( 'dotdotdot-style' ) || '' )
						.data( 'dotdotdot', false );
				}
			);
			return $dot;
		};	//	/bind_events

		$dot.unbind_events = function()
		{
			$dot.unbind('.dot');
			return $dot;
		};	//	/unbind_events

		$dot.watch = function()
		{
			$dot.unwatch();
			if ( opts.watch == 'window' )
			{
				var $window = $(window),
					_wWidth = $window.width(),
					_wHeight = $window.height();

				$window.bind(
					'resize.dot' + conf.dotId,
					function()
					{
						if ( _wWidth != $window.width() || _wHeight != $window.height() || !opts.windowResizeFix )
						{
							_wWidth = $window.width();
							_wHeight = $window.height();

							if ( watchInt )
							{
								clearInterval( watchInt );
							}
							watchInt = setTimeout(
								function()
								{
									$dot.trigger( 'update.dot' );
								}, 100
							);
						}
					}
				);
			}
			else
			{
				watchOrg = getSizes( $dot );
				watchInt = setInterval(
					function()
					{
						if ( $dot.is( ':visible' ) )
						{
							var watchNew = getSizes( $dot );
							if ( watchOrg.width  != watchNew.width ||
								 watchOrg.height != watchNew.height )
							{
								$dot.trigger( 'update.dot' );
								watchOrg = watchNew;
							}
						}
					}, 500
				);
			}
			return $dot;
		};
		$dot.unwatch = function()
		{
			$(window).unbind( 'resize.dot' + conf.dotId );
			if ( watchInt )
			{
				clearInterval( watchInt );
			}
			return $dot;
		};

		var	opts 		= $.extend( true, {}, $.fn.dotdotdot.defaults, o ),
			conf		= {},
			watchOrg	= {},
			watchInt	= null,
			$inr		= null;


		if ( !( opts.lastCharacter.remove instanceof Array ) )
		{
			opts.lastCharacter.remove = $.fn.dotdotdot.defaultArrays.lastCharacter.remove;
		}
		if ( !( opts.lastCharacter.noEllipsis instanceof Array ) )
		{
			opts.lastCharacter.noEllipsis = $.fn.dotdotdot.defaultArrays.lastCharacter.noEllipsis;
		}


		conf.afterElement	= getElement( opts.after, $dot );
		conf.isTruncated	= false;
		conf.dotId			= dotId++;


		$dot.data( 'dotdotdot', true )
			.bind_events()
			.trigger( 'update.dot' );

		if ( opts.watch )
		{
			$dot.watch();
		}

		return $dot;
	};


	//	public
	$.fn.dotdotdot.defaults = {
		'ellipsis'			: '... ',
		'wrap'				: 'word',
		'fallbackToLetter'	: true,
		'lastCharacter'		: {},
		'tolerance'			: 0,
		'callback'			: null,
		'after'				: null,
		'height'			: null,
		'watch'				: false,
		'windowResizeFix'	: true
	};
	$.fn.dotdotdot.defaultArrays = {
		'lastCharacter'		: {
			'remove'			: [ ' ', '\u3000', ',', ';', '.', '!', '?' ],
			'noEllipsis'		: []
		}
	};
	$.fn.dotdotdot.debug = function( msg ) {};


	//	private
	var dotId = 1;

	function children( $elem, o, after )
	{
		var $elements 	= $elem.children(),
			isTruncated	= false;

		$elem.empty();

		for ( var a = 0, l = $elements.length; a < l; a++ )
		{
			var $e = $elements.eq( a );
			$elem.append( $e );
			if ( after )
			{
				$elem.append( after );
			}
			if ( test( $elem, o ) )
			{
				$e.remove();
				isTruncated = true;
				break;
			}
			else
			{
				if ( after )
				{
					after.detach();
				}
			}
		}
		return isTruncated;
	}
	function ellipsis( $elem, $d, $i, o, after )
	{
		var isTruncated	= false;

		//	Don't put the ellipsis directly inside these elements
		var notx = 'a, table, thead, tbody, tfoot, tr, col, colgroup, object, embed, param, ol, ul, dl, blockquote, select, optgroup, option, textarea, script, style';

		//	Don't remove these elements even if they are after the ellipsis
		var noty = 'script, .dotdotdot-keep';

		$elem
			.contents()
			.detach()
			.each(
				function()
				{

					var e	= this,
						$e	= $(e);

					if ( typeof e == 'undefined' )
					{
						return true;
					}
					else if ( $e.is( noty ) )
					{
						$elem.append( $e );
					}
					else if ( isTruncated )
					{
						return true;
					}
					else
					{
						$elem.append( $e );
						if ( after && !$e.is( o.after ) && !$e.find( o.after ).length  )
						{
							$elem[ $elem.is( notx ) ? 'after' : 'append' ]( after );
						}
						if ( test( $i, o ) )
						{
							if ( e.nodeType == 3 ) // node is TEXT
							{
								isTruncated = ellipsisElement( $e, $d, $i, o, after );
							}
							else
							{
								isTruncated = ellipsis( $e, $d, $i, o, after );
							}
						}

						if ( !isTruncated )
						{
							if ( after )
							{
								after.detach();
							}
						}
					}
				}
			);
		$d.addClass("is-truncated");
		return isTruncated;
	}
	function ellipsisElement( $e, $d, $i, o, after )
	{
		var e = $e[ 0 ];

		if ( !e )
		{
			return false;
		}

		var txt			= getTextContent( e ),
			space		= ( txt.indexOf(' ') !== -1 ) ? ' ' : '\u3000',
			separator	= ( o.wrap == 'letter' ) ? '' : space,
			textArr		= txt.split( separator ),
			position 	= -1,
			midPos		= -1,
			startPos	= 0,
			endPos		= textArr.length - 1;


		//	Only one word
		if ( o.fallbackToLetter && startPos == 0 && endPos == 0 )
		{
			separator	= '';
			textArr		= txt.split( separator );
			endPos		= textArr.length - 1;
		}

		while ( startPos <= endPos && !( startPos == 0 && endPos == 0 ) )
		{
			var m = Math.floor( ( startPos + endPos ) / 2 );
			if ( m == midPos )
			{
				break;
			}
			midPos = m;

			setTextContent( e, textArr.slice( 0, midPos + 1 ).join( separator ) + o.ellipsis );
			$i.children()
				.each(
					function()
					{
						$(this).toggle().toggle();
					}
				);

			if ( !test( $i, o ) )
			{
				position = midPos;
				startPos = midPos;
			}
			else
			{
				endPos = midPos;

				//	Fallback to letter
				if (o.fallbackToLetter && startPos == 0 && endPos == 0 )
				{
					separator	= '';
					textArr		= textArr[ 0 ].split( separator );
					position	= -1;
					midPos		= -1;
					startPos	= 0;
					endPos		= textArr.length - 1;
				}
			}
		}

		if ( position != -1 && !( textArr.length == 1 && textArr[ 0 ].length == 0 ) )
		{
			txt = addEllipsis( textArr.slice( 0, position + 1 ).join( separator ), o );
			setTextContent( e, txt );
		}
		else
		{
			var $w = $e.parent();
			$e.detach();

			var afterLength = ( after && after.closest($w).length ) ? after.length : 0;

			if ( $w.contents().length > afterLength )
			{
				e = findLastTextNode( $w.contents().eq( -1 - afterLength ), $d );
			}
			else
			{
				e = findLastTextNode( $w, $d, true );
				if ( !afterLength )
				{
					$w.detach();
				}
			}
			if ( e )
			{
				txt = addEllipsis( getTextContent( e ), o );
				setTextContent( e, txt );
				if ( afterLength && after )
				{
					$(e).parent().append( after );
				}
			}
		}

		return true;
	}
	function test( $i, o )
	{
		return $i.innerHeight() > o.maxHeight;
	}
	function addEllipsis( txt, o )
	{
		while( $.inArray( txt.slice( -1 ), o.lastCharacter.remove ) > -1 )
		{
			txt = txt.slice( 0, -1 );
		}
		if ( $.inArray( txt.slice( -1 ), o.lastCharacter.noEllipsis ) < 0 )
		{
			txt += o.ellipsis;
		}
		return txt;
	}
	function getSizes( $d )
	{
		return {
			'width'	: $d.innerWidth(),
			'height': $d.innerHeight()
		};
	}
	function setTextContent( e, content )
	{
		if ( e.innerText )
		{
			e.innerText = content;
		}
		else if ( e.nodeValue )
		{
			e.nodeValue = content;
		}
		else if (e.textContent)
		{
			e.textContent = content;
		}

	}
	function getTextContent( e )
	{
		if ( e.innerText )
		{
			return e.innerText;
		}
		else if ( e.nodeValue )
		{
			return e.nodeValue;
		}
		else if ( e.textContent )
		{
			return e.textContent;
		}
		else
		{
			return "";
		}
	}
	function getPrevNode( n )
	{
		do
		{
			n = n.previousSibling;
		}
		while ( n && n.nodeType !== 1 && n.nodeType !== 3 );

		return n;
	}
	function findLastTextNode( $el, $top, excludeCurrent )
	{
		var e = $el && $el[ 0 ], p;
		if ( e )
		{
			if ( !excludeCurrent )
			{
				if ( e.nodeType === 3 )
				{
					return e;
				}
				if ( $.trim( $el.text() ) )
				{
					return findLastTextNode( $el.contents().last(), $top );
				}
			}
			p = getPrevNode( e );
			while ( !p )
			{
				$el = $el.parent();
				if ( $el.is( $top ) || !$el.length )
				{
					return false;
				}
				p = getPrevNode( $el[0] );
			}
			if ( p )
			{
				return findLastTextNode( $(p), $top );
			}
		}
		return false;
	}
	function getElement( e, $i )
	{
		if ( !e )
		{
			return false;
		}
		if ( typeof e === 'string' )
		{
			e = $(e, $i);
			return ( e.length )
				? e
				: false;
		}
		return !e.jquery
			? false
			: e;
	}
	function getTrueInnerHeight( $el )
	{
		var h = $el.innerHeight(),
			a = [ 'paddingTop', 'paddingBottom' ];

		for ( var z = 0, l = a.length; z < l; z++ )
		{
			var m = parseInt( $el.css( a[ z ] ), 10 );
			if ( isNaN( m ) )
			{
				m = 0;
			}
			h -= m;
		}
		return h;
	}


	//	override jQuery.html
	var _orgHtml = $.fn.html;
	$.fn.html = function( str )
	{
		if ( str != undef && !$.isFunction( str ) && this.data( 'dotdotdot' ) )
		{
			return this.trigger( 'update', [ str ] );
		}
		return _orgHtml.apply( this, arguments );
	};


	//	override jQuery.text
	var _orgText = $.fn.text;
	$.fn.text = function( str )
	{
		if ( str != undef && !$.isFunction( str ) && this.data( 'dotdotdot' ) )
		{
			str = $( '<div />' ).text( str ).html();
			return this.trigger( 'update', [ str ] );
		}
		return _orgText.apply( this, arguments );
	};


})( jQuery );

/*jslint browser: true*/
/*global window, document, Player, PlayerManager, Utils, Config, WP */

(function(window, document, undefined) {
	"use strict";
	var $ = WP && WP.$,

		stringAuto = "auto",
		string100 = "100%";
	
	window.WP = window.WP || {};
	var main, oldInstance = window.WP.player,
		isWPTV = function(url) {
			return /wp\.tv.*([ml]id)[=,]([0-9]+).*/.exec(url);
		};

	/*netbeans format UTF-8 ęóąśłżźćń*/

	/**

	*  Moduł fullscreen

	*/

	var Fullscreen = function (handler) {

		'use strict';

	

		var stringWebkit = "webkit",

			stringMoz = 'moz',

			stringElement = 'Element',

			stringEnabled = 'Enabled',

			stringRequest = 'Request',

			stringCancel = 'Cancel',

			stringchange = 'change',

			stringerror = 'error',

			stringfullscreen = 'fullscreen',

			stringFullscreen = 'Fullscreen',

			stringFullScreen = 'FullScreen',

			stringfullscreenElement = stringfullscreen+stringElement,

			keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element,

	

			fn = (function () {

				var fnMap = [

					[

						'request'+stringFullscreen,

						'exit'+stringFullscreen,

						stringfullscreenElement,

						stringfullscreen+stringEnabled,

						stringfullscreen+stringchange,

						stringfullscreen+'error'

					],

					// new WebKit

					[

						stringWebkit+stringRequest+stringFullscreen,

						stringWebkit+'Exit'+stringFullscreen,

						stringWebkit+stringFullscreen+stringElement,

						stringWebkit+stringFullscreen+stringEnabled,

						stringWebkit+stringfullscreen+stringchange,

						stringWebkit+stringfullscreen+stringerror

	

					],

					// old WebKit (Safari 5.1)

					[

						stringWebkit+stringRequest+stringFullScreen,

						stringWebkit+stringCancel+stringFullScreen,

						stringWebkit+'Current'+stringFullScreen+stringElement,

						stringWebkit+'Cancel'+stringFullScreen,

						stringWebkit+stringfullscreen+stringchange,

						stringWebkit+stringfullscreen+stringerror

	

					],

					[

						stringMoz+stringRequest+stringFullScreen,

						stringMoz+stringCancel+stringFullScreen,

						stringMoz+stringFullScreen+stringElement,

						stringMoz+stringFullScreen+stringEnabled,

						stringMoz+stringfullscreen+stringchange,

						stringMoz+stringfullscreen+stringerror

					],

					[

						'ms'+stringRequest+stringFullscreen,

						'msExit'+stringFullscreen,

						'ms'+stringFullscreen+stringElement,

						'ms'+stringFullscreen+stringEnabled,

						'MS'+stringFullscreen+'Change',

						'MS'+stringFullscreen+'Error'

					]],

					val, valLength,

					i = 0, l = fnMap.length, ret = {};

	

				for (; i < l; i++) {

					val = fnMap[i];

					if (val && val[1] in document) {

						for (i = 0, valLength = val.length; i < valLength; i++) {

							ret[fnMap[0][i]] = val[i];

						}

						return ret;

					}

				}

				return false;

			})(),

	

			screenfull = {

				handler:handler,

				initialized:false,

				on:function (event, callback) {

					if (screenfull.handler){

						screenfull.handler.on(event, callback);

					}

				},

				off:function (event, callback) {

					if (screenfull.handler){

						screenfull.handler.off(event, callback);

					}

				},

				trigger: function (event) {

					if (screenfull.handler){

						screenfull.handler.trigger(event);

					}

				},

				request: function (elem) {

					var request = fn.requestFullscreen;

					elem = elem || document.documentElement;

	

					// Work around Safari 5.1 bug: reports support for

					// keyboard in fullscreen even though it doesn't.

					// Browser sniffing, since the alternative with

					// setTimeout is even worse.

					if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {

						elem[request]();

					} else {

						elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);

					}

				},

				exit: function () {

					document[fn.exitFullscreen]();

				},

				toggle: function (elem) {

					if (this.isFullscreen) {

						this.exit();

					} else {

						this.request(elem);

					}

				},

				onchange: function () {

					screenfull.trigger(stringfullscreen+'change');

				},

				onerror: function () {

				},

				raw: fn

			};

	

		if (!fn) {

			return false;

		}

		Object.defineProperties(screenfull, {

			isFullscreen: {

				get: function () {

					return !!document[fn[stringfullscreenElement]];

				}

			},

			element: {

				enumerable: true,

				get: function () {

					return document[fn[stringfullscreenElement]];

				}

			},

			enabled: {

				enumerable: true,

				get: function () {

					// Coerce to boolean in case of old WebKit

					return !!document[fn.fullscreenEnabled];

				}

			}

		});

		

		document.addEventListener(fn.fullscreenchange, function (e) {

			screenfull.onchange.call(screenfull, e);

		});

	

		document.addEventListener(fn.fullscreenerror, function (e) {

			screenfull.onerror.call(screenfull, e);

		});

		return screenfull;

	};

	
	/**

	 * Created by mmarzecki on 09.08.16.

	 */

	

	//// CORS fix for IE9 ////

	(function(factory) {

		if (typeof define === 'function' && define.amd) {

			define(['jquery'], factory);

		} else if (typeof exports === 'object') {

			module.exports = factory(require('jquery'));

		} else {

			factory($);

		}

	}(function($) {

		// Only continue if we're on IE8/IE9 with jQuery 1.5+ (contains the ajaxTransport function)

		if ($.support.cors || !$.ajaxTransport || !window.XDomainRequest) {

			return;

		}

		var httpRegEx = /^https?:\/\//i,

			getOrPostRegEx = /^get|post$/i,

			sameSchemeRegEx = new RegExp('^'+location.protocol, 'i');

	

		// ajaxTransport exists in jQuery 1.5+

		$.ajaxTransport('* text html xml json', function(options, userOptions, jqXHR) {

			// Only continue if the request is: asynchronous, uses GET or POST method, has HTTP or HTTPS protocol, and has the same scheme as the calling page

			if (!options.crossDomain || !options.async || !getOrPostRegEx.test(options.type) || !httpRegEx.test(options.url) || !sameSchemeRegEx.test(options.url)) {

				return;

			}

	

			var xdr = null;

	

			return {

				send: function(headers, complete) {

					var postData = '';

					var userType = (userOptions.dataType || '').toLowerCase();

	

					xdr = new XDomainRequest();

					if (/^\d+$/.test(userOptions.timeout)) {

						xdr.timeout = userOptions.timeout;

					}

	

					xdr.ontimeout = function() {

						complete(500, 'timeout');

					};

	

					xdr.onload = function() {

						var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType,

							status = {

								code: 200,

								message: 'success'

							},

							responses = {

								text: xdr.responseText

							};

						try {

							if (userType === 'html' || /text\/html/i.test(xdr.contentType)) {

								responses.html = xdr.responseText;

							} else if (userType === 'json' || (userType !== 'text' && /\/json/i.test(xdr.contentType))) {

								try {

									responses.json = $.parseJSON(xdr.responseText);

								} catch(e) {

									status.code = 500;

									status.message = 'parseerror';

									//throw 'Invalid JSON: ' + xdr.responseText;

								}

							} else if (userType === 'xml' || (userType !== 'text' && /\/xml/i.test(xdr.contentType))) {

								var doc = new ActiveXObject('Microsoft.XMLDOM');

								doc.async = false;

								try {

									doc.loadXML(xdr.responseText);

								} catch(e) {

									doc = undefined;

								}

								if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {

									status.code = 500;

									status.message = 'parseerror';

									throw 'Invalid XML: ' + xdr.responseText;

								}

								responses.xml = doc;

							}

						} catch(parseMessage) {

							throw parseMessage;

						} finally {

							complete(status.code, status.message, responses, allResponseHeaders);

						}

					};

	

					// set an empty handler for 'onprogress' so requests don't get aborted

					xdr.onprogress = function(){};

					xdr.onerror = function() {

						complete(500, 'error', {

							text: xdr.responseText

						});

					};

	

					if (userOptions.data) {

						postData = ($.type(userOptions.data) === 'string') ? userOptions.data : $.param(userOptions.data);

					}

					xdr.open(options.type, options.url);

					xdr.send(postData);

				},

				abort: function() {

					if (xdr) {

						xdr.abort();

					}

				}

			};

		});

	}));

	
	/*jslint browser: true*/

	/*global Utils, document, PushStream*/

	 

	var PushMessage = window.PushMessage = function(host, port, channel, onResponse, onStatus, pid) {

		'use strict';

		var self = this,

			src = "//i.wp.pl/a/i/stg/player/pushstream.min.js",

			ssl = Utils.ssl,

			pushstream, id = -1,

			manageEvent = function(eventMessage) {

				onResponse(eventMessage, self);

			},

			statuschanged = function(state) {

				if(state === PushStream.OPEN) {

					onStatus('OPEN', self);

				} else {

					onStatus('CLOSE', self);

				}

			},

			connect = function(channel) {

				pushstream.removeAllChannels();

				try {

					pushstream.addChannel(channel);

					pushstream.connect();

				} catch(e) {

				};

			},

			init = function() {

				pushstream = new PushStream({

					host: host,

					port: ssl ? 443 : port,

					useSSL: ssl,

					modes: "websocket",

					timeout: 2000,

					reconnectOnTimeoutInterval: 1000,

					reconnectOnChannelUnavailableInterval: 1000 // proba podlaczenia do ws

				});

				id = pushstream.id;

				pushstream.onmessage = manageEvent;

				pushstream.onstatuschange = statuschanged;

				connect(channel);

			},

			sendData = function(obj) {

				try {

					pushstream.sendMessage(obj);

				} catch(e) {

				};

			},

			close = function() {

				try {

					pushstream.removeAllChannels();

					pushstream.disconnect();

				} catch(e) {

				};

			};

		if(PushMessage.l === -1) {

			PushMessage.l = 0;

			$.ajax({

				url: src,

				dataType: "script",

				timeout: 5000,

				cache: true,

				success: function() {

					PushMessage.l = 1;

					PushMessage.hub.trigger('INIT');

					init();

				},

				error: function(x, t, m) {

				}

			});

		} else if(PushMessage.l === 0) {

			PushMessage.hub.bind('INIT', init);

		} else if(PushMessage.l === 1) {

			init();

		}

		return {

			host: host,

			port: port,

			channel: channel,

			id: id,

			pid: pid,

			sendData: sendData,

			close: close

		};

	};

	PushMessage.l = -1;

	PushMessage.hub = $('<div>');

	
	/*jslint browser: true*/

	/*global WP, opera*/

	

	var __userAgent = navigator.userAgent.toLowerCase(),

		__browser = {

			// grupy przegladarek

			// OPERA

			isApp: /chameleonlauncher/.test(__userAgent),

			isOpera: typeof window.opera === 'object' || __userAgent.indexOf('opr/') > 0,

			isOperaMini: __userAgent.match(/Opera.Mini/i) !== null,

			OperaVer: typeof window.opera === 'object' ? window.opera.version() : 13,

			// INTERNET EXPLORER

			isEdge: /edge\/12\./i.test(__userAgent),

			isIE: __userAgent.indexOf('trident/') > 0 || /edge\/12\./i.test(__userAgent),

			isIEMobile: /wpdesktop|iemobile/i.test(__userAgent),

			IEVer: (function() {

				var version = /msie ([0-9]+)/.exec(__userAgent);

				if (version) {

					return version[1];

				}

	

				if (__userAgent.indexOf('trident/7.0') > 0) {

					return 11;

				}

				return 0;

			}()),

			// BLACKBERRY

			isBlackBerry: /blackberry/i.test(__userAgent),

			// SAFARI

			isSafari: /safari/.test(__userAgent) && !/chrome/.test(__userAgent),

			// GECKO

			isGecko: (__userAgent.indexOf('firefox/') > 0 && !/(compatible|webkit)/.test(__userAgent)),

			// CHROME + WEBKIT

			isChrome: /chrome/.test(__userAgent),

			isWebkit: /khtml/.test(__userAgent),

			// OS

			isWin: navigator.platform.indexOf('Win') > -1,

			isLinux: navigator.platform.indexOf('Linux') > -1,

			isMac: navigator.platform.indexOf('Mac') > -1,

			isIOS: /iphone|ipad|ipod/i.test(__userAgent),

			isIPhone: /iphone/i.test(__userAgent),

			isOldIPhone: /iphone.+os.[1-8]_/i.test(__userAgent),

			isAndroid: /android/i.test(__userAgent),

			// ADDITIONAL

			isAtLeastWin7: (function() {

				var system = /(windows.nt.\d+\.\d+)/ig.exec(__userAgent);

				return system !== null ? ['windows nt 6.1', 'windows nt 6.2', 'Windows nt 6.3', 'windows nt 6.4', 'windows nt 10.0'].indexOf(system[0].toLowerCase()) >= 0 : false;

			}())

		},

	

		Utils = {

			ssl: document.location.protocol === 'https:',

			ssl_pfix: document.location.protocol === 'https:' ? 's' : '',

			userAgent: __userAgent,

			browser: __browser,

			isSupported: !__browser.isOperaMini && !(WP.isOpera && __browser.OperaVer <= 12 ) && !(__browser.isIE && (__browser.IEVer < 9)),

			isMobile: __browser.isApp ? false : window.wp_mobile || __browser.isAndroid || __browser.isIOS || __browser.isBlackBerry || __browser.isIEMobile || __browser.isOperaMini,

	

			urlVariable: (function(a) {

				if (a === "") return {};

				var b = {};

				for (var i = 0; i < a.length; ++i) {

					var p = a[i].split('=');

					if (p.length !== 2) continue;

					b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));

				}

				return b;

			})(window.location.search.substr(1).split('&')),

	

			randomString: function(length, onlyletters, letterFirst) {

				var l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',

					d = '0123456789',

					s = (onlyletters) ? l : l+d,

					r = '',

					i;

				for (i = length; i > 0; --i) {

					r += s[Math.round(Math.random() * (s.length - 1))];

				}

				if (letterFirst) {

					r = r.replace(r[0], Utils.randomString(1,true) );

				}

				return r;

			},

	

			type: (function() {

				var exports = {},

					types = 'Array Object String Date RegExp Function Boolean Number Null Undefined'.split(' '),

					type = function() {

						return Object.prototype.toString.call(this).slice(8, -1);

					};

	

				for (var i = types.length; i--;) {

					exports['is' + types[i]] = (function(self) {

						return function(elem) {

							return type.call(elem) === self;

						};

					})(types[i]);

				}

				return exports;

			}()),

	

			clone: function(parent, child) {

				child = child || (Object.prototype.toString.call(parent) === "[object Array]" ? [] : {});

				for (var i in parent) {

					var el = parent[i];

					if (parent.hasOwnProperty(i)) {

						if (el && (Utils.type.isObject(el) || Utils.type.isArray(el))) {

							child[i] = Utils.clone(el, child[i]);

						} else {

							child[i] = el;

						}

					}

				}

				return child;

			},

	

			privateExtend: function(metods) {

				var API = {},

					prop;

				for (prop in metods) {

					if (metods.hasOwnProperty(prop)) {

						API[prop] = (function(prop, metods) {

							return function() {

								return metods[prop].apply(null, arguments);

							};

						}(prop, metods));

					}

				}

				return API;

			},

	

			extend: function() {

				var arg, prop, args = arguments, child = args[0] || {};

				for (arg = 1; arg < args.length; arg += 1) {

					for (prop in args[arg]) {

						if (args[arg].hasOwnProperty(prop)) {

							child[prop] = args[arg][prop];

						}

					}

				}

				return child;

			},

	

			addToHead: function(src, callback, inner) {

				var head = document.getElementsByTagName('head')[0];

				var element = document.createElement('script');

				element.type = 'text/javascript';

	

				if (inner) { element.innerHTML = inner; }

				if (callback) { element.onload = function () { callback(); }}

				if (src) { element.src = src; }

	

				head.appendChild(element);

			},

	

			flash: {

				isIE: __browser.isIE,

				version: (function(isIE) {

					var version = 0;

	

					//dla MSIE

					try {

						version = isIE ? new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7").GetVariable('$version').split(' ')[1].split(',')[0] : navigator.plugins['Shockwave Flash'].description.split(' ')[2].split('.')[0];

					} catch (ignore) {}

	

					return parseInt(version, 10);

				}(__browser.isIE)),

	

				embed: function(file, width, height, flashvars, o, id, zid) {

					var w, b, p, h, c, createElement = document.createElement,

						ssl = Utils.ssl_pfix;

					o = o || {};

	

					o.quality = 'autohigh';

					o.wmode = 'opaque';

					o.allowscriptaccess = 'always';

					o.allowfullscreen = 'true';

					o.base = '';

					c = zid;

	

					if (!this.isIE) {

						b = document.createElement('object');

						this.setAttribute(b, [

							['data', file],

							['type', 'application/x-shockwave-flash'],

							['width', width],

							['height', height],

							['id', id]

						]);

	

						this.createEl(b, 'param', [

							['name', 'pluginspage'],

							['value', 'http' + ssl + '://www.macromedia.com/go/getflashplayer']

						]);

	

						this.createEl(b, 'param', [

							['name', 'FlashVars'],

							['value', 'FlashID=' + id + '&' + flashvars]

						]);

	

						for (w in o) {

							this.createEl(b, 'param', [

								['name', w],

								['value', o[w]]

							]);

						}

						c.appendChild(b);

	

					} else {

						// IE, Safari..

						h = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http' + ssl + '://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,3,0,0" width="' + width + '" height="' + height + '" id="' + id + '">' + '<param name="movie" value="' + file + '" /><param name="flashvars" value="FlashID=' + id + '&' + flashvars + '" />';

						for (w in o) {

							h += '<param name="' + w + '" value="' + o[w] + '" />';

						}

						h += '<embed src="' + file + '" width="' + width + '" height="' + height + '" name="' + id + '" swliveconnect="true" flashvars="FlashID=' + id + '&' + flashvars + '" type="application/x-shockwave-flash" pluginspage="http' + ssl + '://www.macromedia.com/go/getflashplayer" ';

						for (w in o) {

							h += w + '="' + o[w] + '" ';

						}

						h += '>';

						h += '</object>';

						c.insertAdjacentHTML('beforeEnd', h);

						b = c.children[0];

					}

					return b;

				},

				setAttribute: function(el, attrs) {

					for (var i = 0, len = attrs.length; i < len; i += 1) {

						var par = attrs[i];

						el.setAttribute(par[0], par[1]);

					}

				},

				createEl: function(target, name, attr) {

					var p = document.createElement('param');

					this.setAttribute(p, attr);

					target.appendChild(p);

				}

			}

		};

	Utils.browser.isMobile = __browser.isAndroid || __browser.isIOS || __browser.isBlackBerry || __browser.isIEMobile || __browser.isOperaMini;

	
	/*jslint browser: true*/
	/*global $, Utils, Config, UserInterface, DataInterface, AdvManager, PlayerDispatcher, PlayerOutput, OutputEvents, SkinManager, SkinEvents, Core*/
	
	var Player = function(params, events) {
		'use strict';
		/*jslint browser: true*/
		/*global $, Utils, Config, fullscreen, UserInterface, DataInterface, $target, $loader, playerOutput, skinManager, advManager, materialData, privateDispatcherApi, privateData.advMode, params, privateData, timeouts*/
		var Core = {},
			startMidrollAudio = function(){
				Core.advActions.blockMidroll = true;
				Core.advActions.start('midroll-audio');
				setTimeout(function(){
					Core.advActions.blockMidroll = false;
				}, 45000);
			};
		
		Core.keyAction = {
			ready: function() {
				if (document.readyState === "complete") {
					Core.keyAction.playerLoaded();
				} else {
					$(window).on("load", Core.keyAction.playerLoaded);
					$(window).on("url_change", Core.keyAction.playerLoaded);
				}
		
				var player = PlayerManager.getPlayer(params.pid);
				if (window.CustomEvent) {
					var event = new CustomEvent('NEW_WPPLAYER', { detail: player } );
				} else {
					var event = document.createEvent('CustomEvent');
					event.initCustomEvent('NEW_WPPLAYER', true, true, player);
				}
				window.dispatchEvent(event);
		
				privateDispatcherApi.trigger(privateDispatcherApi.INIT);
		
				if (privateData.autoplay) {
					//PLAYER Z ODPALENIEM CZEKA NA POZWOLENIE MANAGERA!
					privateDispatcherApi.trigger(privateDispatcherApi.TRYTOPLAY, {
						pid: params.pid,
						forceautoplay: params.forceautoplay
					});
				}
		
				if (!Utils.isSupported) {
					Core.keyAction.errorKey(69);
					return;
				}
		
				skinManager.setUiConfig({
					top: false,
					bottom: false,
					btnplaybig: false
				});
		
				if (params.url) {
					DataInterface.setUrl(params.url);
				} else if (params.clip) {
					DataInterface.setClipData(params.clip);
				}
		
				UserInterface.setSize(params.width, params.height);
				UserInterface.setSkin(params.skin || Config.getSkin(privateData.isExternal));
		
				if (!privateData.isExternal){
					Utils.addToHead(Config.ima3);
				}
		
				if (params.floatingplayer && !Utils.isMobile) {
					floatingPlayerManager.init(params.floatingplayer);
				}
		
				this.ready = function() {};
			},
		
			dataLoaded: function(data) {
				clearTimeout(timeouts.clipError);
		
				var outputData = data.output,
					clipData = data.clip,
					live = outputData.isStream,
					preview = outputData.forcePreview,
					external = /external/.test(outputData.type);
		
				if (clipData.lid){
					outputData.screenshot = params.screenshot || Config.live.screenshot;
				}
		
				//clipData.pushstream parametr dla administracji LIVE
				if (live && !preview && clipData.pushstream !== false && clipData.lid){
					connectToPushStream(clipData.lid);
				//} else if (Core.advActions.isRadio()) {
				} else if (Core.advActions.isRadio()) {
					connectToPushStream(clipData.mediaOwner);
				}else {
					clearPushStream();
				}
		
				outputData.quality = privateData.quality = Math.min(outputData.qualityOptions.length, clipData.forceLQ ? outputData.qualityOptions.length - 1 : privateData.quality);
				outputData.offset = privateData.offset = 0;
				outputData.useHand = privateData.click;
				if (!outputData.urls.length){
					Core.keyAction.errorKey(51);
					return;
				}
				playerOutput.setMaterial(outputData);
		
				if (privateData.advType === "midroll-audio"){
					privateData.tvolume = privateData.volume;
					Core.keyAction.setVolume(0);
				}
		
				$loader.hide();
		
				if (!clipData.url) {
					privateData.videoUrl ='';
					return;
				}
		
				privateData.videoUrl = playerOutput.getUrl();
				privateData.isPreview = preview;
				privateData.pushstream = clipData.pushstream;
				privateData.adv = preview ? false : params.adv;
				privateData.isLive = live;
				privateData.isExternal = external;
				privateData.isFirst = firstClip && firstClip.mid === clipData.mid;
				privateData.hasData = true;
				privateData.blockActions = false;
				privateData.flashMode = outputData.isFlash;
				privateData.click = clipData.click || false;
		
				if (!external){
					skinManager.setUiConfig({
						bottom: !preview,
						top: !preview,
						topcont: true,
						btnplaybig: !preview,
						btnplay: true,
						mode: live ? 'live' : 'normal', /* [normal, live, special]*/
						timeMode: live ? 'onlyCurrentTime' : 'full',
						ainfo: ''
					});
		;
					skinManager.setTimeData({
						currentTime: 0,
						duration: clipData.duration || 0,
						position: 0,
						buffer: 0
					});
		
					skinManager.setData(Utils.extend({
						data: clipData
					}, outputData));
		
					if (params.floatingplayer) {
						Core.floatingPlayerActions.setData(clipData);
						Core.floatingPlayerActions.changeTitle(clipData.title);
					}
				}
		
				if (Utils.isMobile && !Core.advActions.state){
					Core.advActions.start('preroll');
					return;
				}
		
				if (firstClip === null && !external && !Core.advActions.isRadio()) {
					firstClip = clipData;
					if (!params.hiderelated && clipData.mid) {
						materialData.loadRelated(Utils.extend(params, {
							mid: clipData.mid
						}), function(related) {
							materialData.setRelated(related);
							skinManager.setRelated(related);
							var onSorted = function(){
								relatedSorted = true;
								if (params.extendedrelated && !Utils.isMobile && related.length ){
									extendedRelatedManager.init([firstClip].concat(Utils.clone(materialData.getRelated())));
								}
							}
							materialData.sortRelated(firstClip.mid, onSorted);
						});
					}
				}
		
				if (Core.relatedActions.isOpen()) {
					Core.relatedActions.setActiveClip(clipData);
				}
		
				if (privateData.canPlay && privateData.hasData) {
					this.play();
				}
			},
			autoplay: function() {
				if (!Utils.isMobile) {
					statsManager.wpPerformance('mark', 'PlayerAutoStarted');
					privateData.autoStarted = true;
				}
				privateData.mediaInit = 1;
				Core.keyAction.play();
			},
			userplay: function() {
				privateData.mediaInit = 0;
				this.play();
			},
			play: function() {
				if (privateData.blockActions) {
					return false;
				}
				privateData.started = true;
				privateData.canPlay = true;
				if (privateData.canPlay && privateData.hasData) {
					firstPlay('play');
					if (!privateData.forcesound) {
						privateData.forcesound = true;
						Core.keyAction.setVolume(0, true);
					}
				}
			},
			togglePause: function() {
				if (!Utils.isMobile && !privateData.playing && !privateData.userStarted && !privateData.autoStarted) {
					statsManager.wpPerformance('mark', 'PlayerUserStarted');
					privateData.userStarted = true;
					Core.floatingPlayerActions.destroyAnotherFloatingPlayer();
				}
				if (privateData.blockActions) {
					if (Utils.isMobile && privateData.advMode && !privateData.playing){
						firstPlay('togglePause');
					}
					return false;
				}
		
				privateData.mediaInit = 0;
				privateData.canPlay = true;
				firstPlay('togglePause');
			},
			pause: function() {
				if (privateData.blockActions) {
					return false;
				}
		
				privateData.started = false;
				playerOutput.pause();
			},
			setPosition:function(value){
				if (!privateData.advMode && !params.advmode) {
					playerOutput.setPosition(value);
				}
			},
			setVolume: function(value, automute, setUp) {
				if (Utils.isMobile){
					return;
				}
		
				value = Math.max(0, Math.min(1, value));
		
				privateData.volume = value;
				privateData.automute = automute;
				skinManager.setVolume({volume:value, automute:automute});
				if (playerOutput){
					playerOutput.setVolume(value);
				}
				privateDispatcherApi.trigger(setUp ? privateDispatcherApi.CHANGED_VOLUME : privateDispatcherApi.CHANGE_VOLUME, {ext: Utils.clone(privateData)});
			},
			volumeFadeIn:function(){
				var currentVolume = privateData.volume,
					endVolume = privateData.tvolume;
				if (currentVolume < endVolume){
					currentVolume += .1;
					setTimeout(Core.keyAction.volumeFadeIn, 200);
				}
				if (currentVolume >= endVolume){
					currentVolume = endVolume;
				}
				Core.keyAction.setVolume(currentVolume);
			},
			setQuality: function(id) {
				var outputData = materialData.getOutput();
				outputData.quality = privateData.quality = id;
				outputData.offset = privateData.offset = UserInterface.getPosition();
				outputData.useHand = privateData.click;
		
				skinManager.setQuality({quality:id});
				playerOutput.setMaterial(outputData);
				privateData.videoUrl = playerOutput.getUrl();
				playerOutput.play();
			},
		
			end: function() {
				if (!Utils.isMobile) {
					statsManager.wpPerformance('count', 'PlayerMaterialEnd');
				}
				privateData.started = false;
				if (privateData.isExternal){
					return;
				}
		
				var isRelated = false;
				/*skinManager.setUiConfig({
					top: false,
					bottom: false,
					btnplaybig: false
				});*/
				//playerOutput.hide();
		
				if (!params.hiderelated && materialData.getRelated().length) {
					skinManager.setRelated(materialData.getRelated());
					isRelated = true;
				}
		
				if (!params.hideendscreen) {
					privateData.started = true;
					privateData.isEndScreen = true;
					skinManager.endScreen({
						isRelated: isRelated,
						isFirst: privateData.isFirst
					});
				}
			},
			pushmessage: function(data) {
				var currentChannel = materialData.getData().clip.mediaChannel,
					dataChannel = data[currentChannel],
					dataTrackId = dataChannel && dataChannel['GGTrackId'] ? dataChannel['GGTrackId'] : -1,
					isCurrentChannelPlaysAdv = dataChannel && (dataChannel["Adv"]==1);
		
				//console.log(dataTrackId, currentChannel, data[currentChannel], data);
				if (dataTrackId > 0){
					Core.outputActions.wsTrackId({trackid:dataTrackId});
				}
		
				if (!privateData.advMode && privateData.playing && isCurrentChannelPlaysAdv && !Core.advActions.blockMidroll) {
					startMidrollAudio();
					return;
				}
		
				if (!privateData.advMode && privateData.playing && data.adv && data.adv.status) {
					Core.advActions.start('midroll');
					return;
				} else if (privateData.advMode && data.adv && !data.adv.status) {
					privateDispatcherApi.trigger(privateDispatcherApi.END_ADV_BREAK);
				}
		
				if (!data.clip) {
					return;
				}
		
				var outputData = materialData.prepareOutput(data.clip.url);
		
				privateData.flashMode = outputData.isFlash;
				if (!outputData.isStream && !privateData.advMode && !privateData.isPreview){
					//nadpisanie starych danych nowymi, archiwalnymi i przełączenie strumienia
					Utils.extend(materialData.getOutput(), outputData);
					Core.keyAction.dataLoaded(materialData.getData());
				}
			},
			errorKey: function(key){
				/* kody błędów
				  10 błąd zmiennej WPAD.conf.vad //ADBLOCK KOMUNIKAT
				  11 błąd zapytania AJAX o reklame //ADBLOCK KOMUNIKAT
				  12 przekroczony czas odpytania o reklamę  //ADBLOCK KOMUNIKAT
				  13 błąd odtwarzania materiału reklamowego  //ADBLOCK KOMUNIKAT
				  14 To jest to samo co ERROR 11, ale po jego wywołaniu następuje pojedyńcza próba odpytania o VASTa - brak komunikatu, tylko log do statystyk
				  15 Błąd ładowania obrazka dla formy TOPLAYER  //ADBLOCK KOMUNIKAT
				  16 Materiał reklamowy zablokowany przez adblocka  //ADBLOCK KOMUNIKAT
				  20 błąd odtwarzania materiału wideo
				  21 błąd przy próbie odnowienia połączenia z serwerem. (czyli błąd 20)
				  25
				  50 Problem z siecią
				  51 Brak klipu
				  52 Problem z siecią (related) - brak komunikatu, tylko log do statystyk
				  53 Brak powiązanych (related) - brak komunikatu, tylko log do statystyk
				  69 Player nie obsługiwany
				*/
				$loader.hide();
				skinManager.showMessage(key);
			},
			redirect: function(url){
				window.open(url, '_blank');
			},
			clear: function(all) {
				if (all) {
					privateDispatcherApi.trigger('CLEAR');
					DataInterface.setClipData({});
				}
		
				skinManager.setUiConfig({
					bottom: false,
					top: false,
					btnplaybig: false
				});
		
				privateData.playing = false;
				playerOutput.pause();
				playerOutput.clear();
			},
			playerLoaded:function(){
				$(window).off("load", Core.keyAction.playerLoaded);
				$(window).off("url_change", Core.keyAction.playerLoaded);
				privateDispatcherApi.trigger(privateDispatcherApi.PLAYER_LOADED);
				Core.keyAction.playerLoaded = null;
			},
			shortcuts: function(event) {
				event.preventDefault();
		
				var timeleap = Config.shortcuts.timeleap,
					volumeleap = Config.shortcuts.volumeleap;
		
				switch (event.keyCode) {
					// szczalka w lewo
					case 37:
						if ($parentTarget.hasClass('extendedfullsize')) {
							Core.relatedActions.changeRelated(event);
		
							return;
						}
		
						var duration = UserInterface.getDuration();
		
						if (duration > 0) {
							UserInterface.setPosition(UserInterface.getPosition() - (timeleap / duration));
						}
						break;
					// szczalka w gore
					case 38:
						skinManager.toggleShortcutIcons('btnspeakerup');
						UserInterface.setVolume(UserInterface.getVolume() + volumeleap);
						break;
					// szczala w prawo
					case 39:
						if ($parentTarget.hasClass('extendedfullsize')) {
							Core.relatedActions.changeRelated(event);
		
							return;
						}
		
						var duration = UserInterface.getDuration();
		
						if (duration > 0) {
							UserInterface.setPosition(UserInterface.getPosition() + (timeleap / duration));
						}
						break;
					// szczala w dol
					case 40:
						skinManager.toggleShortcutIcons('btnspeakerdown');
						UserInterface.setVolume(UserInterface.getVolume() - volumeleap);
						break;
					// spacja
					case 32:
						UserInterface.togglePause();
						break;
				}
			}
		};
		
		Core.advActions = {
			blockMidroll: false,
			state: 0,
			advDataLoaded: function(){
				Core.advActions.state = 1;
		
				if (!Utils.isMobile || privateData.autoplay){
					Core.advActions.state = 2;
					advManager.startAdv();
				}else {
					$loader.hide();
					skinManager.setUiConfig({
						btnplaybig: true
					});
					privateData.firstTime = true;
					privateData.blockActions = false;
				}
			},
		
			start: function(type) {
				var data = materialData.getData();
		
				privateData.started = true;
				privateData.firstTime = false;
				privateData.blockActions = true;
				privateData.advMode = true;
				privateData.advType = type;
		
				//fix polskastacja do usunięcia po migracji
				if (!privateData.adv || (data.clip.adv === false && type !== 'midroll-audio')){
					Core.advActions.end();
					return;
				}
		
				if (Core.advActions.state === 1 && Utils.isMobile){
					Core.advActions.state = 2;
					privateData.blockActions = true;
					advManager.startAdv();
					return;
				}
				if (!Utils.isMobile) {
					statsManager.wpPerformance('mark', 'PlayerAdvQueryStart');
					// rejestracja czasu od startu playera do momentu odpytania o adv
					if (privateData.autoStarted) {
						statsManager.wpPerformance('measure', 'PlayerInitAdvTime', 'PlayerAutoStarted', 'PlayerAdvQueryStart');
					}
					if (privateData.userStarted) {
						statsManager.wpPerformance('measure', 'PlayerInitAdvTime', 'PlayerUserStarted', 'PlayerAdvQueryStart');
					}
				}
				privateDispatcherApi.trigger('ADVQUERY');
				$loader.show();
		
				skinManager.setUiConfig({
					btnplaybig: false
				});
		
				Core.floatingPlayerActions.changeTitle('REKLAMA, dzi\u0119ki niej ogl\u0105dasz za darmo');
		
				advManager.getAdv({
					type: type,
					pid: params.pid,
					id: materialData.getId(),
					rekid: params.rekid || '',
					drastic: data.clip.drastic || 0,
					duration: data.clip.duration <= 0 ? 30 : data.clip.duration,
					minimalAge: data.clip.minimalAge || 0,
					mediaProgram: data.clip.media && data.clip.media.program || '',
					advTags: data.clip.advTags || data.clip.mediaTags || '',
					callback:this.advDataLoaded
				});
			},
			started: function(canPause) {
				privateData.isEndScreen = false;
		
				var data = materialData.getData();
				$loader.hide();
		
				privateData.blockActions = !canPause;
				skinManager.setUiConfig({
					ainfo: Config.uiConfig.adText
				});
		
				skinManager.setData({
					data: {
						title: 'ZA CHWIL\u0118: ' + data.clip.title,
						description: '',
						minimalAge: 0
					},
					quality: 0,
					qualityOptions: privateData.floating ? {} : ['HQ']
				});
		
				if (!Utils.isMobile) {
					statsManager.wpPerformance('mark', 'PlayerAdvQueryEnd');
					statsManager.wpPerformance('measure', 'AdvProcessingTime', 'PlayerVastQueryEnd', 'PlayerAdvQueryEnd');
					statsManager.wpPerformance('measure', 'PlayerAdvQueryTime', 'PlayerAdvQueryStart', 'PlayerAdvQueryEnd');
				}
		
				privateDispatcherApi.trigger(privateDispatcherApi.START_ADV_QUEUE, {
					ext: Utils.clone(privateData)
				});
			},
			end: function(segments) {
				privateData.autoplay = true;
				Core.advActions.state = 3;
				/* przeniesienie funkcjonalnosci również na reklamę
				 * if (!segments && !privateData.forcesound) {
					Core.keyAction.setVolume(0, true);
				}*/
				privateData.blockActions = false;
				privateData.advMode = false;
				this.extEvent('timeupdate', {
					currentTime: 0,
					duration: 0,
					position: 0
				});
				if (!segments && /midroll/.test(privateData.advType)){
					if (privateData.advType === "midroll-audio"){
						Core.keyAction.setVolume(privateData.volume);
					}
				}else {
					if (segments){
						privateDispatcherApi.trigger(privateDispatcherApi.END_ADV_QUEUE, {
							ext: Utils.clone(privateData)
						});
					}
					Core.keyAction.dataLoaded(materialData.getData());
				}
			},
			getVolume: function() {
				return UserInterface.getVolume();
			},
			setUiConfig: function(data) {
				skinManager.setUiConfig(data);
			},
		
			startPrerollVideo: function(data) {
				var outputData = materialData.prepareOutput(data.url),
					materialdata = materialData.getData();
		
				privateData.click = data.click || false;
				privateData.flashMode = outputData.isFlash;
		
				outputData.useHand = privateData.click;
				outputData.screenshot = materialdata.clip.screenshot;
		
				playerOutput.setMaterial(outputData);
				//Core.keyAction.setVolume(privateData.volume);
				playerOutput.play();
			},
		
			stopPrerollVideo: function(data) {
				Core.keyAction.clear();
				skinManager.setUiConfig({
					bottom: false,
					top: false,
					btnplaybig: false
				});
				playerOutput.pause();
				playerOutput.clear();
			},
			setState: function(state) {
				advManager.setState(state);
				if (advManager.getType() === 'preroll') {
					playerOutput.togglePause();
				}
			},
			extEvent: function(name, data) {
				var fn = Core.outputActions[name];
				if (fn) {
					fn(data);
				}
			},
			onAdBlock: function(key) {
				$loader.hide();
				//TODO KOMUNIKATY BŁĘDÓW ADBLOCK
				Core.keyAction.errorKey(key); //MESSAGE
			},
			canSkipAd: function(){
				return !window.hasSentinel() || Core.advActions.isRadio() || privateData.isLive;
			},
			isRadio: function() {
				var data = materialData.getData();
				return (data && data.clip && (data.clip.mediaOwner === "polskastacja" || data.clip.mediaOwner === "openfm" || data.clip.mediaOwner === "radiowp"));
			}
		};
		
		Core.outputActions = {
			externalCntClick:function(){
				Core.relatedActions.openExtendedFullSize();
			},
			loading: function() {
				$loader.show();
				skinManager.setUiConfig({
					btnplaybig: false
				});
			},
			skipped: function(data) {
				privateDispatcherApi.trigger(privateDispatcherApi.INTERRUPTION);
			},
			wsTrackId: function(data) {
				privateData.trackId = data.trackid;
				//console.log('TRACKID event', privateData.trackId);
				privateDispatcherApi.trigger(privateDispatcherApi.TRACKID, {
					data: data
				});
			},
			trackid: function(data) {
				if (data.trackid !== privateData.trackId && /REKLAMA.*REKLAMA/.test(data.tracktitle) && !Core.outputActions.blockMidroll){
					startMidrollAudio();
				}
				privateData.trackTitle = data.tracktitle;
				privateData.trackId = data.trackid;
				privateDispatcherApi.trigger(privateDispatcherApi.TRACKID, {
					data: data
				});
			},
			canplay: function(data) {
				$loader.hide();
				privateDispatcherApi.trigger(privateDispatcherApi.CANPLAY);
			},
			waiting: function(data) {
				if (privateData.playing){
					$loader.show();
					privateDispatcherApi.trigger(privateDispatcherApi.WAITING);
				}
			},
			error: function(data) {
				var isLive = privateData.isLive,
					reconnect = (privateData.reconnectTryNr < 4),
					code = '3.1';
		
				clearTimeout(timeouts.clipError);
				if (!privateData.advMode){
					if (reconnect){
						timeouts.clipError = setTimeout(function(){
							Core.keyAction.dataLoaded(materialData.getData());
						}, isLive ? 5000 : 2000);
						code = isLive ? '3.3' : '3.2.'+String(privateData.reconnectTryNr);
						if (!isLive){
							privateData.offset = UserInterface.getPosition();
						}
					}else {
						Core.keyAction.errorKey(code);
					}
				}
		
				if (!isLive){
					privateData.reconnectTryNr += 1;
				}
		
				statsManager.sendError(code);
				if (code != '3.3') {
					privateDispatcherApi.trigger(privateDispatcherApi.ERROR, {
						data: data,
						clip: materialData.getData(),
						ext: privateData,
						code: privateData.advMode ? -1 : code
					});
				}
		
			},
			overridebrowsersupport: function() {
				materialData.overrideFeatureDetection({dash:false});
				Core.keyAction.dataLoaded( materialData.setData( materialData.getData().clip ) );
			},
			playing: function(data) {
				skinManager.hideMessage();
				privateData.started = true;
				privateData.isEndScreen = false;
				if (!privateData.playing) {
					$loader.hide();
					privateData.playing = true;
		
					skinManager.setState('playing');
					playerOutput.show();
					privateDispatcherApi.trigger(privateDispatcherApi.CHANGE_STATE, {
						data: data,
						ext: privateData
					});
				}
			},
			pause: function(data) {
				privateData.started = false;
				if (Utils.isMobile && privateData.advMode){
					skinManager.setUiConfig({
						btnplaybig: true
					});
				}
				privateData.playing = false;
				skinManager.setState('paused');
				privateDispatcherApi.trigger(privateDispatcherApi.CHANGE_STATE, {
					data: data,
					ext: privateData
				});
			},
			seeking: function(data) {
				privateDispatcherApi.trigger(privateDispatcherApi.CHANGE_SEEK, {
					data: data,
					ext: privateData
				});
			},
			seeked: function(data) {
				privateDispatcherApi.trigger(privateDispatcherApi.CHANGED_SEEK, {
					data: data,
					ext: privateData
				});
			},
			timeupdate: function(data) {
				var event = privateData.advMode ? privateDispatcherApi.UPDATE_ADV_POSITION : privateDispatcherApi.UPDATE_POSITION;
				skinManager.setTimeData(data);
				privateDispatcherApi.trigger(event, {edata:data});
			},
			progress: function(data) {
				skinManager.setTimeData(data);
				privateDispatcherApi.trigger(privateDispatcherApi.UPDATE_BUFFER, {edata:data});
			},
			loadedmetadata: function(data) {
				// Adam, do przemyslenia - ustawienie skina na dvr (z paskiem przewijania) tutaj,
				// bo nie dostaję z flasha poniższego eventu loadeddata gdy jest live
				//
				var type = data.type; // VOD|LIVE|DVR
				//console.log( 'Core.loadedmetadata type', type );
				if (type === "DVR") {
					if (!privateData.advMode) {
						skinManager.setUiConfig({
							mode: 'normal',
							timeMode: 'full'
						});
					}
				}
			},
			loadeddata: function(data) {
				var type = data.type; // VOD|LIVE|DVR
				//console.log( 'Core.loadeddata', type);
				if (type === 'VOD') {
					// wyłączenie trybu live dla api playera
					privateData.isLive = false;
					clearPushStream();
				}
		
				if (type === "DVR" || type === 'VOD') {
					if (!privateData.advMode) {
						skinManager.setUiConfig({
							mode: 'normal',
							timeMode: 'full'
						});
					}
				}
		
				if (data.dash) {
					if (data.duration > 0 && !data.dashlive) {
						// sprawdzenie duration
						if (!privateData.advMode) {
							skinManager.setUiConfig({
								mode: 'normal',
								timeMode: 'full'
							});
						}
					}
				}
		
				if (!privateData.advMode && privateData.offset !== 0) {
					playerOutput.setPosition(privateData.offset);
				}
			},
			playdata: function(data) {
				var sdata = {
					data: data,
					clip: materialData.getData(),
					ext: privateData
				};
				if (!privateData.advMode) {
					skinManager.setState('playing');
		
					if (privateData.advType === "midroll-audio"){
						Core.keyAction.volumeFadeIn();
					}
					privateData.advType = false;
					if (!Utils.isMobile) {
						statsManager.wpPerformance('count', 'PlayerMaterialStart');
					}
					privateDispatcherApi.trigger(privateDispatcherApi.START_MOVIE, sdata);
				} else {
					privateDispatcherApi.trigger(privateDispatcherApi.FAKE_START_ADV_MOVIE, sdata);
				}
			},
			play: function(data) {
			},
			playAdv: function(data) {
				$loader.hide();
				skinManager.setState('playing');
				privateDispatcherApi.trigger(privateDispatcherApi.START_ADV_MOVIE, {
					data: data,
					ad: data.mediaAd,
					clip: materialData.getData(),
					ext: privateData
				});
			},
		
			ended: function(data) {
				var event = privateData.advMode ? privateDispatcherApi.END_ADV_MOVIE : privateDispatcherApi.END_MOVIE;
				skinManager.setState('paused');
				$loader.hide();
				if (!privateData.advMode) {
					if (Utils.browser.isIPhone){
						playerOutput.exitFS();
					}
					Core.keyAction.end();
				}
				privateDispatcherApi.trigger(event);
			},
		
			click: function(data) {
				if (privateData.click){
					var redirect = function (){
						Core.keyAction.redirect(privateData.click);
					};
					if(Utils.isMobile){
						playerOutput.pause();
					}
					if ($parentTarget.hasClass('fullscreen')) {
						fullscreen.exit();
						setTimeout(redirect, 500);
					}else {
						redirect();
					}
				}else {
					if (!Utils.isMobile || Core.advActions.state === 1){
						Core.skinActions.clickBtnPlay();
					}
				}
			},
		
			flashblocked: function(data) {
				skinManager.setUiConfig({
					btnplaybig: false
				});
				privateDispatcherApi.trigger(privateDispatcherApi.FLASHBLOCKED);
			},
			flashunblocked: function(data) {
				privateDispatcherApi.trigger(privateDispatcherApi.FLASHUNBLOCKED);
			},
			fullscreen: function(){
				var tsize = $parentTarget.hasClass('fullscreen') ? privateData.size : Config.fs;
				$parentTarget.toggleClass('fullscreen');
		
				if ($parentTarget.hasClass('extendedfullsize')) {
					Core.relatedActions.closeExtendedFullSize();
				}
		
				changeSize({
					edata: tsize
				});
				privateDispatcherApi.trigger(privateDispatcherApi.CHANGE_FULLSCREEN, {data:tsize});
			}
		};
		
		Core.skinActions = {
			// kliknięcie w duży lub mały btn play
			clickBtnPlay: function(data) {
				if (!Core.relatedActions.openExtendedFullSize() || !privateData.playing){
					Core.keyAction.togglePause();
				}//else if (!privateData.playing){
					//Core.keyAction.togglePause();
				//}
			},
			clickControlBtnPlay: function() {
				Core.keyAction.togglePause();
			},
			clickBtnFullScreen: function(data) {
				if (fullscreen && fullscreen.handler) {
					if (!fullscreen.initialized){
						fullscreen.initialized = true;
						fullscreen.on('fullscreenchange', Core.outputActions.fullscreen);
					}
					fullscreen.toggle(fullscreen.handler[0]);
				}else {
					Core.outputActions.fullscreen();
				}
			},
			sliderSeek: function(data) {
				Core.keyAction.setPosition(data.pos);
			},
			setQuality: function(data) {
				Core.keyAction.setQuality(data.quality.id);
			},
			sliderVolume: function(data) {
				privateData.forcesound = true;
				Core.keyAction.setVolume(data.pos, false, data.end);
			},
			clickBtnMute: function(data) {
				var volume = .75;
				privateData.forcesound = true;
				if (privateData.volume > 0) {
					volume = 0;
				}
				Core.keyAction.setVolume(volume, false, true);
			},
			clickReplayBtn: function(data) {
				privateData.mediaInit = 0;
				DataInterface.setClipData(materialData.getRawData());
			},
			clickFirstBtn: function(data) {
				privateData.mediaInit = 0;
				DataInterface.setClipData(firstClip);
			},
			clickRelatedItem: function(data) {
				if (!Utils.isMobile) {
					statsManager.wpPerformance('count', 'PlayerRelatedClickV1');
				}
				privateData.mediaInit = 0;
				DataInterface.setClipData(data.relatedData);
			},
			autoRelatedItem: function(data) {
				privateData.mediaInit = 2;
				DataInterface.setClipData(data.relatedData);
			},
			clickBtnAutomute: function(data) {
				if (data.clicked) {
					var hideTimeout,
						clearMe = function(){
							clearTimeout(hideTimeout);
						},
						hideOnLeave = function (e) {
							clearTimeout(hideTimeout);
							hideTimeout = setTimeout(function(){
								if (!Core.relatedActions.isChanged()) {
									Core.relatedActions.setOpen({open: false});
								}
								$parentTarget.off('mouseenter', clearMe);
								$parentTarget.off('mouseleave', hideOnLeave);
								privateDispatcherApi.off(privateDispatcherApi.FULLSIZE, hideOnLeave);
							}, 500);
						};
		
					privateDispatcherApi.on(privateDispatcherApi.FULLSIZE, function(){
						$parentTarget.off('mouseenter', clearMe);
						$parentTarget.off('mouseleave', hideOnLeave);
						privateDispatcherApi.off(privateDispatcherApi.FULLSIZE, hideOnLeave);
					});
					$parentTarget.on('mouseenter', clearMe);
					$parentTarget.on('mouseleave', hideOnLeave);
		
					Core.relatedActions.setOpen({open: true});
				}
		
				privateData.forcesound = true;
				Core.keyAction.setVolume(.75, false, true);
			}
		};
		
		Core.relatedActions = {
			setActiveClip: function(data) {
				extendedRelatedManager.setActiveClip(data);
			},
			setOpen: function(data) {
				extendedRelatedManager.setOpen(data);
			},
			clickRelatedItem: function(data) {
				if (!Utils.isMobile && $parentTarget.hasClass('ExtendedRelated')) {
					// tylko dal desktop
					if ($parentTarget.hasClass('extendedfullsize')) {
						// stan 3
						statsManager.wpPerformance('count', 'PlayerRelatedClickV2State3');
					}
					else {
						// stan 2
						statsManager.wpPerformance('count', 'PlayerRelatedClickV2State2');
					}
				}
				privateData.mediaInit = 0;
				DataInterface.setClipData(data.relatedData);
				Core.relatedActions.openExtendedFullSize();
			},
			showRelated: function(data) {
				changeSize({edata: privateData.size});
			},
			hideRelated: function(data) {
				changeSize({edata: privateData.size});
			},
			isChanged:function (){
				return extendedRelatedManager.isChanged();
			},
			isOpen: function(data) {
				return extendedRelatedManager.isOpen(data);
			},
			getPreviousOpen: function() {
				return extendedRelatedManager.getPreviousOpen();
			},
			setPreviousOpen: function(data) {
				extendedRelatedManager.setPreviousOpen(data);
			},
			closeExtendedFullSize: function() {
				if (!Utils.isMobile && $parentTarget.hasClass('extendedfullsize')) {
					$("body").css({overflow: 'auto'});
					$parentTarget.removeClass('extendedfullsize');
					Core.relatedActions.setOpen({open: Core.relatedActions.getPreviousOpen()});
				}
			},
			openExtendedFullSize: function() {
				if (!Utils.isMobile && !privateData.floating && relatedSorted && params.extendedrelated && materialData.getRelated().length && !$parentTarget.hasClass('fullscreen') && !$parentTarget.hasClass('extendedfullsize')) {
					$parentTarget.addClass('extendedfullsize');
					$("body").css({overflow: 'hidden'});
					privateDispatcherApi.trigger(privateDispatcherApi.FULLSIZE);
					Core.relatedActions.setPreviousOpen(Core.relatedActions.isOpen());
					Core.relatedActions.setOpen({open: true});
					if (privateData.automute) {
						privateData.forcesound = true;
						Core.keyAction.setVolume(0.75);
					}
					return true;
				}else {
					return false;
				}
			},
			changeRelated: function(d) {
				extendedRelatedManager.changeRelated(d);
			}
		};
		
		Core.floatingPlayerActions = {
			setData: function(d) {
				floatingPlayerManager.setData(d);
		
				if (privateData.floating) {
					skinManager.hideQualityButton();
				}
			},
			changeTitle: function(str) {
				floatingPlayerManager.changeTitle(str);
			},
			showQuality: function() {
				if (!privateData.advMode) {
					skinManager.showQualityButton();
				}
			},
			hideQuality: function() {
				skinManager.hideQualityButton();
			},
			openFloatingPlayer: function() {
				// pokazanie
				if (privateData.isFloatingModeActive !== 0) {
					privateData.isFloatingModeActive = 1;
					privateData.floating = true;
					floatingPlayerManager.openFloatingPlayer();
					skinManager.resizeRelated();
				}
			},
			closeFloatingPlayer: function() {
				// ukrycie
				privateData.floating = false;
				floatingPlayerManager.closeFloatingPlayer();
				skinManager.resizeRelated();
			},
			/**
			 * usuniecie instancji floatujacego playera po recznym kliknieciu w btn zamknij
			 */
			destroyFloatingPlayer: function() {
				floatingPlayerManager.destroy();
				Core.floatingPlayerActions.closeFloatingPlayer();
				privateData.isFloatingModeActive = 0; // flaga deaktywacji floatingu na stałe
		
				//reklama wyciszamy, materiał zatrzymujemy
				//if (privateData.advMode){
					Core.keyAction.setVolume(0);
				//}else {
				//	Core.outputActions.pause();
				//	// nadpisujemy autoplay - aby przywrocony player nie odtwarzal
				//	privateData.autoplay = privateData.canPlay = privateData.automute = false;
				//	DataInterface.setClipData(firstClip);
				//}
		
			},
			/**
			 * usuniecie floatujacego playera po recznym uruchomieniu innego playera
			 */
			destroyAnotherFloatingPlayer: function() {
				privateDispatcherApi.trigger(privateDispatcherApi.FLOATING_ANOTHER_PLAYER_DESTROY);
			}
		};
		
		/*jslint browser: true*/
		/*global Core, playerOutput, skinManager, $target, privateData*/
		
		//zbiór metod dla usera
		var UserInterface = {
			play: function() {
				Core.keyAction.userplay();
			},
			togglePause: function() {
				Core.keyAction.togglePause();
			},
			pause: function() {
				Core.keyAction.pause();
			},
		
			setPosition: function(value) {
				Core.keyAction.setPosition(value);
			},
			
			getPosition: function() {
				return playerOutput ? playerOutput.getPosition() : 0;
			},
		
			setVolume: function(value) {
				Core.keyAction.setVolume(value);
			},
			
			getVolume: function() {
				return privateData.volume;
			},
		
			mute: function(b) {
				Core.keyAction.setVolume(b === false ? .75 : 0);
			},
		
			setQuality: function(value) {
				
			},
			getQuality: function() {
				
			},
		
			setSize: function(width, height) {
				//bo nie pozwalamy na procentowe ustawianie!
				if (width === string100){
					width = stringAuto;
				}
				if (height === string100){
					height = stringAuto;
				}
				var size = privateData.size = {
					width: width,
					height: height
				};
				$parentTarget.css(size);
				if (width === stringAuto) {
					$(window).on('resize', function(e) {
						changeSize({
							edata: size
						});
					});
				}
				changeSize({
					edata: size
				});
			},
		
			getSize: function(){
				return { width:$target[0].offsetWidth, height:$target[0].offsetHeight };
			},
			
			setSkin: function(config) {
				skinManager.registerSkin(config);
			},
			
			/* tylko dla debugu
			setSkinData: function(data) {
				skinManager.setData(data);
			},
			setSkinUIConfig: function(config) {
				skinManager.setUiConfig(config);
			},
			*/
			/**************************/
			startMidroll: function() {
				Core.advActions.start('midroll-audio');
			},
			
			clear: function() {
				Core.keyAction.clear(true);
			},
			destroy: function() {
				var playing = privateData.playing;
				Core.keyAction.clear(true);
				playerOutput.destroy();
				skinManager.destroy();
				privateDispatcherApi.trigger(privateDispatcherApi.DESTROY, {
					pid: params.pid,
					playing: playing,
					target: params.target
				});
			},
		
			actionTest: function(s){
				Core.advActions.start(s);
			},
		
			enable: function(b) {},
		
			isRadio: function() {
				return Core.advActions.isRadio();
			},
		
			panelShow: function(p) {},
			blockRelated: function(p) {
				if (p)
					skinManager.pauseRelatedCounter();
				else{
					skinManager.resumeRelatedCounter();
				}
			},
		
			getTime: function() {
				return playerOutput.getTime();
			},
			getDuration: function(movieOnly) {
				var d = materialData.getData().clip && materialData.getData().clip.duration ? materialData.getData().clip.duration : 0;
				return playerOutput.getDuration() || d || 0;
			},
			
			getMinimalAge: function() {
				return materialData.getData().clip && materialData.getData().clip.minimalAge ? materialData.getData().clip.minimalAge : 0
			},
		
			isPlaying: function() { 
				return privateData.playing; 
			},
			isAdvPlaying: function() { 
				return privateData.advMode && privateData.playing;
			},
			isAdvMode: function() { 
				return privateData.advMode; 
			},
			getAdvType: function() { 
				return privateData.advType;
			},
		
			getFrame: function(scale) {
				return playerOutput.getFrame(scale);
			},
		
			replaceVideoTag: function(data) {
				playerOutput.replaceVideoTag(data);
			},
		
			isAdvEnabled: function() {},
			isStatEnabled: function() {},
		
			getId: function() {}
		};
		/*jslint browser: true*/
		/*global Utils, Core, DataInterface, materialData, params, privateData, privateDispatcherApi, $loader, playerOutput, wp_sn, pid, options*/
		var DataInterface = {
			setUrl: function(value) {
				UserInterface.clear();
				$loader.show();
				if (!value) {
					return;
				}
				materialData.setUrl(value, DataInterface.setClipData);
			},
		
			getUrl:function (){
				return privateData.videoUrl;
			},
		
			setClipData: function(o, CID) {
				if (o.url){
					Core.keyAction.clear();
				}
				if (o && !o.media){
					var media = {},
						clip = o;
		
					if (clip.mediaOwner){
						media.owner = clip.mediaOwner;
						media.PBICategory = clip.mediaPBICategory;
						media.channel = clip.mediaChannel;
						media.source = clip.mediaSource;
						media.playerSource = clip.mediaPlayerSource;
					}
					clip.media = media;
		
				}
				var data = materialData.setData(o);
				privateData.firstTime = true;
				privateData.advMode = false;
				privateData.isExternal = false;
		
				if (!CID){
					privateData.mediaContainerID = Utils.randomString(20);
				}
		
				privateData.reconnectTryNr = 0;
		
				materialData.sortRelated(o.mid);
				Core.keyAction.dataLoaded(data);
				if (o.url){
					privateDispatcherApi.trigger(privateDispatcherApi.CHANGE_CLIPDATA, Utils.extend(data, {ext:{mediaContainerID:privateData.mediaContainerID}}));
		
				}
			},
			getClipData: function() {
				return materialData.getData().clip;
			},
		
			setRelated: function(o) {
				materialData.setRelated(o);
			},
			getRelated: function() {
				return materialData.getRelated();
			},
		
			getTrackId: function() {
				return privateData.trackId;
			},
		 	/* typ chunked hls [LIVE|VOD]*/
		 	getHlsType: function() {
				return privateData.hlsType;
			},
			/* czy aktywny DVR */
			isDVR: function() {
				return privateData.isDVR;
		 	},
			initFlash: function() {
				playerOutput.onVideoEvent('initflash');
			},
		
			onVideoEvent: function(e, o) {
				playerOutput.onVideoEvent(e, o);
			},
			/*isFloating: function() {
				return Core.floatingPlayerActions.isFloating();
			},*/
			openFloatingPlayer: function() {
				Core.floatingPlayerActions.openFloatingPlayer();
			},
			closeFloatingPlayer: function() {
				Core.floatingPlayerActions.closeFloatingPlayer();
			},
			destroyFloatingPlayer: function() {
				Core.floatingPlayerActions.destroyFloatingPlayer();
			}
		};
		
		/*jslint browser: true*/
		/*global  */
		
		var PlayerDispatcher = function(params) {
				var hub = $('<div>'),
					$player = $(params.main),
					statEvents = {
						CLEAR: 'CLEAR',
						CHANGE_STATE: 'CHANGE_STATE',
						START_MOVIE: 'START_MOVIE',
						END_MOVIE: 'END_MOVIE',
						START_ADV_MOVIE: 'START_ADV_MOVIE',
						END_ADV_MOVIE: 'END_ADV_MOVIE',
		
						CHANGE_SEEK: 'CHANGE_SEEK',
						CHANGED_SEEK: 'CHANGED_SEEK',
						CHANGE_QUALITY: 'CHANGE_QUALITY',
						AFTER_CHANGE_CLIPDATA: 'AFTER_CHANGE_CLIPDATA',
						ERROR: 'ERROR',
						ERRORRECONNECT: 'ERRORRECONNECT'
					},
					playerEvents = {
						TRACKID: 'TRACKID',
						CANPLAY: 'CANPLAY',
						WAITING: 'WAITING',
						CHANGE_CLIPDATA: 'CHANGE_CLIPDATA',
						GET_RELATED: 'GET_RELATED',
		
						CHANGE_OPTIONS: 'CHANGE_OPTIONS',
						PLAYER_LOADED: 'PLAYER_LOADED',
		
						CHANGE_VOLUME: 'CHANGE_VOLUME',
						CHANGED_VOLUME: 'CHANGED_VOLUME',
						CHANGE_FULLSCREEN: 'CHANGE_FULLSCREEN',
						CHANGE_SIZE: 'CHANGE_SIZE',
		
						END_LIVESTREAM: 'END_LIVESTREAM',
						UPDATE_POSITION: 'UPDATE_POSITION',
		
						UPDATE_ADV_POSITION: 'UPDATE_ADV_POSITION',
		
						UPDATE_BUFFER: 'UPDATE_BUFFER',
		
						ADVONLY: 'ADVONLY',
						START_ADV_QUEUE: 'START_ADV_QUEUE',
						END_ADV_QUEUE: 'END_ADV_QUEUE',
						END_ADV_BREAK: 'END_ADV_BREAK',
		
						INIT: 'INIT',
						DATA_SET: 'DATA_SET',
						INIT_FLASH: 'INIT_FLASH',
						FLASHBLOCKED: 'FLASHBLOCKED',
						FLASHUNBLOCKED: 'FLASHUNBLOCKED',
		
						NOT_SUPPORTED: 'NOT_SUPPORTED',
						NEW_INSTANCE: 'NEW_INSTANCE',
		
						// eventy dla plywajacego playera
						FLOATING_PLAYER_ACTIVATE: 'FLOATING_PLAYER_ACTIVATE',
						FLOATING_PLAYER_DESTROY: 'FLOATING_PLAYER_DESTROY',
						FLOATING_ANOTHER_PLAYER_DESTROY: 'FLOATING_ANOTHER_PLAYER_DESTROY'
					},
		
					private_on = function(s, fn) {
						hub.on(s, fn);
					},
		
					private_off = function(s, fn) {
						hub.off(s, fn);
					},
		
					public_on = function(s, fn) {
						$player.on(s, fn);
						if (params.main.initialized && s === playerEvents.INIT){
							trigger(playerEvents.INIT);
						}
					},
		
					public_off = function(s, fn) {
						$player.off(s, fn);
					},
		
					trigger = function(type, data) {
						var prop,
							event = $.Event(type, {
							edata: data
						});
						for (prop in data){
							if (data.hasOwnProperty(prop)) {
								event[prop] = data[prop];
							}
						}
						hub.trigger(event, data);
						$player.trigger(event, data);
					},
		
					api = {
						public: {
							events: Utils.clone(Utils.extend(statEvents, playerEvents)),
							on: public_on,
							off: public_off,
							bind: public_on,
							unbind: public_off
						}
					};
		
				api.private = Utils.extend(api.public.events, {
					READY: 'READY',
					TRYTOPLAY: 'TRYTOPLAY',
					AUTOPLAY: 'AUTOPLAY',
					FAKE_START_ADV_MOVIE: 'FAKE_START_ADV_MOVIE',
					INTERRUPTION: 'INTERRUPTION',
					DESTROY: 'DESTROY',
					FULLSIZE: 'FULLSIZE'
				}, {
					hub: hub,
					on: private_on,
					off: private_off,
					trigger: trigger,
					statEvents: Utils.extend(statEvents, {
						INTERRUPTION: 'INTERRUPTION'
					})
				});
				return api;
			};
		/*jslint browser: true*/
		/*global $, Utils, DotMedia, StatData, gemiusStream, gSmConfig*/
		
		var StatsManager = function(config) {
				'use strict';
				var nsStart = "NetStream.Play.Start",
					nsStop = "NetStream.Play.Stop",
					nsError = "NetStream.Error",
					nsPause = "NetStream.pause(true)",
					nsResume = "NetStream.pause(false)",
					nsSeekStart = "NetStream.Seek.Notify",
					nsSeekEnd = "NetStream.Seek.End",
					nsVolumeEnd = "NetStream.Volume",
					nsInterruption = "NetStream.Interruption",
					nPlaying = "playing",
					nPaused = "paused",
					nComplete = "complete",
					nEnded = "ended",
					nNewStream = "newStream";
		
				var GemiusManager = function(config) {
		
					'use strict';
		
				
		
					var params = config.params,
		
						gemiusAccountId = 'dvXq74bKYxhwJyFHgdf_trd8XmDkyO8icPa3IqofGS3.T7',
		
						gemiusPlayerId = params.id,
		
						instance,
		
						materialData,
		
				
		
						actionStack = [],
		
						action = function(name, data) {
		
							if (!instance) {
		
								actionStack.push([name, data]);
		
							} else {
		
								var fn = instance[name];
		
								if (typeof fn === 'function') {
		
									instance[name].apply(instance, data);
		
								}
		
							}
		
						},
		
				
		
						init = function(){
		
							var priv = config.privateData,
		
								addPar = {
		
									volume: priv.automute ? -1 : priv.volume,
		
									resolution: priv.resolution
		
								},
		
								prop;
		
				
		
							instance = new window.GemiusPlayer(gemiusPlayerId, gemiusAccountId, addPar);
		
				
		
							while (Boolean(prop = actionStack.shift())) {
		
								action(prop[0], prop[1]);
		
							}
		
						},
		
						send = function(data) {
		
							var actionName,
		
								status = data.media.mediaAction,
		
								media = data.media,
		
								ad = data.ad,
		
								priv = data.private,
		
								adv = data.adv,
		
								par = [data.media.mediaOrigMid],
		
				
		
								addPar = {
		
									BRN: media.mediaBrand,
		
									KAF: media.mediaKaf,
		
									volume: priv.automute ? -1 : priv.volume,
		
									resolution: priv.resolution || '',
		
									quality: media.mediaQuality && media.mediaQuality.indexOf("HQ") ? "1024x576" : "512x288"
		
								},
		
				
		
								newStream = function() {
		
									actionName = adv ? "newAd" : "newProgram";
		
									par.push(addPar);
		
				
		
									if (!adv) {
		
										addPar.programName = media.mediaName;
		
										addPar.programDuration = media.mediaTimeTotal;
		
										addPar.programType = media.mediaStreamType === 'audio' ? 'Audio' : 'Video';
		
										addPar.series = media.mediaProgram || '';
		
										addPar.typology = media.mediaPBICategory || '';
		
										addPar.premiereDate = media.mediaCreateDate || '';
		
									}else {
		
										addPar.adID = ad.mediaCreation.crekey;
		
										//addPar.adName = ad.mediaData.campid;
		
										addPar.adDuration = media.mediaTimeTotal;
		
										addPar.adType = ad.mediaAdType;
		
									}
		
				
		
									action(actionName, par);
		
								},
		
								event = function(name) {
		
									actionName = adv ? "adEvent" : "programEvent";
		
									addPar.autoPlay = !priv.mediaInit;
		
				
		
									if (!adv) {
		
										addPar.partID = media.mediaStreamNumber;
		
				
		
									}else{
		
										par.push(ad.mediaCreation.crekey);
		
										//addPar.adName = ad.mediaData.campid;
		
										addPar.adPosition = media.mediaAdBlockStreamNumber;
		
										addPar.breakSize = media.mediaAdBlockCount;
		
									}
		
				
		
									par.push(media.mediaTime);
		
									par.push(name);
		
									par.push(addPar);
		
				
		
									action(actionName, par);
		
								};
		
				
		
							if (status === 'advBreak'){
		
								event("break");
		
							}else if (status === nsStart) {
		
								if (!adv){
		
									materialData = data;
		
								}else if (adv && media.mediaAdForm === 'midroll'){
		
									materialData.media.mediaAction = 'advBreak'
		
									send(materialData);
		
								}
		
								newStream();
		
							}else if (status === nsInterruption) {
		
								if (adv){
		
									event("skip");
		
								}else {
		
									event("stop");
		
								}
		
							}else if (status === nsPause) {
		
								event("pause");
		
							}else if (status === nsStop) {
		
								event("complete");
		
							}else if (status === nsSeekStart) {
		
								event("seek");
		
							}else if ((status === nsSeekEnd && priv.playing) || (status === nsResume)) {
		
								event("play");
		
							}
		
						};
		
				
		
						if (!window.GemiusPlayer){
		
							Utils.addToHead(Config.gemius, init);
		
						}else {
		
							init();
		
						}
		
				
		
					return {
		
						send:send
		
					}
		
				}
				var DotMedia = {
					o : {},
				
					//// ustawienie liczników ////
					_MCOUNTER: 0,	//dot Media Counter
					_MCTMP: 0,	//dot Media Counter tymczasowy
					_MT	 : null,	//dotMediaTimeoutId
					_MSP	: 0, //licznik NetStream.pause(true)
					//_mediaOnUnloadFlag: 1,
				
					d: function(o){
						return encodeURIComponent(o);
					},
					
					getPlayerStatus: function(o){
						if (typeof(o)!=='object') {
							return;
						}
						this.o = o;
						var t = this;
				
						if (o.mediaAction==="NetStream.Play.Start") {
							// t._dotMediaSend('e', t._MLURL, t._MLMID);
							t._dotMediaTimer('i', o.mediaUrl, o.mediaMid);
							t._MCOUNTER = 0;
							t._MCTMP = 0;
							t._MSP = 0;
				
							t._dotMediaSend('s');
						}
				
						if (o.mediaAction==="NetStream.Error") {
							t._dotMediaSend('r');
						}
				
						if (o.mediaAction==="NetStream.Play.Stop") {
							t._MSP--;
							t._dotMediaSend('e');
						}
				
						if (o.mediaAction==="NetStream.Volume") {
							t._dotMediaSend('v');
						}
				
						if (o.mediaAction==="NetStream.Interruption") {
								t._dotMediaSend('b');
						}
						if (o.mediaAction==="NetStream.pause(true)") {
							t._MSP++;
						}
				
						//rejestrujemy jednorazowo funkcje wywolywana po wyjsciu ze strony
						/*if (t._mediaOnUnloadFlag) {
						WP.event.set('onunload', t._dotMediaUnload);
							t._mediaOnUnloadFlag = 0;
						}*/
					},
					getPlayerHartbitStatus: function(o){
						var t = this;
						if (typeof(o)!=='object') return;
						t.o.mediaTime = o.mediaTime;
						t.o.mediaTimeTotal = o.mediaTimeTotal;
						t.o.mediaCounter = o.mediaCounter;
						t._dotMediaSend('m');
					},
					_dotMediaSend: function(dotType){
						var t = this,
							o = t.o,
							PG = new String(document.location),
							sourcePage = PG.substring(0, 250),
							u = "http"+Utils.ssl_pfix+"://dot.wp.pl/r"+Math.round(Math.random()*1E10)+"/media.gif?v=4&SN="+window.wp_sn
								+"&pg="+t.d(sourcePage)
								+'&vid='+o.mediaVisitId
								+"&dt="+t.d(dotType)
								+"&mu="+t.d(o.mediaUrl)
								+"&mt="+t.d(o.mediaTags)
								+"&mp="+t.d(o.mediaType)
								+"&mn="+t.d(o.mediaName)
								+"&mid="+t.d(o.mediaMid)
								+"&mh="+t.d(o.mediaChannel)
								+"&mtm="+t.d(o.mediaTime)
								+"&mtt="+t.d(o.mediaTimeTotal)
								+"&mc="+t.d(o.mediaCounter)
								+"&msp="+t.d(t._MSP)
								+"&mdc="+t.d(o.mediaCategory)
								+"&mdp="+t.d(o.mediaProgram)
								+"&mds="+t.d(o.mediaSource)
								+"&mdo="+t.d(o.mediaSourceOrigin)
								+"&mdm="+t.d(o.mediaPBICategory)
								+"&mdb="+t.d(o.mediaBroadcasting)
								+"&mdq="+t.d(o.mediaQuality)
								+"&mre="+t.d(o.mediaPlayerSource)
								+"&mag="+t.d(o.mediaAge)
								+"&mdr="+t.d(o.mediaDrastic)
								+"&mcd="+t.d(o.mediaCreateDate)
								+"&mgt="+t.d(o.mediaGemiusTreeId)
								+"&mpe="+t.d(o.mediaEmbed)
								+"&mno="+t.d(o.mediaNumber)
								+"&men="+t.d(o.mediaEngine)
								+"&mst="+t.d(o.mediaStreamType)
								+"&mow="+t.d(o.mediaOwner)
								+"&mco="+t.d(o.mediaContainerID)
								+"&min="+t.d(o.mediaInit)
								+"&mao="+t.d(o.mediaAdvOn)
								+"&mad="+t.d(o.mediaAdRequest)
								+"&mas="+t.d(o.mediaAdServer)
								+"&maf="+t.d(o.mediaAdForm)
								+"&man="+t.d(o.mediaAdBlockNumber)
								+"&mac="+t.d(o.mediaAdBlockCount)
								+"&mat="+t.d(o.mediaAdBlockStreamNumber)
								+"&maz="+t.d(o.mediaAdBlockSegmentCount)
								+"&max="+t.d(o.mediaAdBlockStreamSegment)
								+"&msn="+t.d(o.mediaStreamNumber)
								+"&gfk_m="+t.d(o.mediaGfkMediaId)
								+"&gfk_c="+t.d(o.mediaGfkContentId)
								+"&rf="+t.d(document.referrer.substring(0, 500))
								+"&ts="+t.d(new Date().getTime())
								+"&mfr="+t.d(o.mediaFrame)
								+'&mer='+t.d(o.mediaErrorCode)
								+"&par=" + t.d("orig_mid="+o.mediaOrigMid+"&orig_ver="+WP.player.ver+"&vol="+o.mediaVolume),
							dot = new Image(1,1);
						
						//console.log('dotType: ', dotType, o.mediaErrorCode, "mediaType:", o.mediaType, "mediaStreamNumber: ", o.mediaStreamNumber, "mediaUrl: ", o.mediaUrl);
						dot.src = u.replace(/undefined/gi, '');
						t._MCOUNTER = 0;
					},
					_dotMediaTimer: function(dotType){
							var t = this;
							if (t._MCOUNTER>0 && t._MCTMP !== t._MCOUNTER){
								t._dotMediaSend(dotType);
								t._MCTMP = t._MCOUNTER;
							}
							clearTimeout(t._MT);
							t._MT = setTimeout(function(){ t._dotMediaTimer('m'); }, 1E4);
					}
					/*,
					_dotMediaUnload: function(){
						if (this._MCOUNTER>0) {
							this._dotMediaSend('x');
						}
					}*/
				};
				
				var Store = function(callback) {
						var $this = this,
							stack = {},
							unloadFlag = 1,
							api = {
								// zwraca identyfikatory istniejących kolejek
								getKeys: function() {
									var keys = [],
										k;
									for (k in stack) {
										if (stack[k]) {
											keys.push(k);
										}
									}
									return keys;
								},
								// zwraca kolejkę o podanym id, jeśli nie istnieje, to jest tworzona nowa i zwracana
								get: function(id) {
									return stack[id] || [];
								},
								// dodaje statystykę do kolejki o podanym id
								add: function(id, stat) {
									api.get(id).push(stat);
								},
								// czyści kolejkę o podanym id
								clear: function(id) {
									stack[id] = null;
									delete stack[id];
								},
								// zwraca ostatniego statsa z kolejki o podanym id
								getLast: function(id) {
									var stack = api.get(id);
									return stack && stack.length ? stack[stack.length - 1] : null;
								},
								// zwraca ostatniego statsa z kolejki o podanym id i jednocześnie go usuwa
								pop: function(id) {
									return api.get(id).pop();
								},
								// usuwa wskazanego statsa
								remove: function(id, tsid) {
									var stack = api.get(id),
										i, di = -1;
									for (i = 0; i < stack.length; i++) {
										if (stack[i].tsid === tsid) {
											di = i;
										}
									}
									if (di > -1) {
										stack.splice(di, 1);
									}
								},
								// agreguje podanego statsa oraz ustawia setTimeout aby go wysłać z odpowiednim opóźnieniem
								// konstrukcja {stat:{wp:{dane stat dla wp}, gs{dane dla gemiusa}, timeoutId:Number, tsid:creation-timestamp}
								push: function(id, stat) {
									var prev = api.getLast(id),
										delay = stat.wp.isLive ? 5000 : 300;
				
									stat.tsid = new Date().getTime();
									//console.log( '# PUSH: ', 'stat.wp.mediaAction', stat.wp.mediaAction, 'stat.tsid', stat.tsid, 'prev', (prev) ? prev.tsid + ' ' + prev.wp.mediaAction : null );
									if (prev && (stat.wp.mediaAction === nsError) && (prev.wp.mediaAction === nsStart)) {
										// gdy poprzedni status jest startem
										// gdy obecny status jest errorem
										clearTimeout(prev.timeoutId);
										api.pop(id);
									} else {
										//console.log(id, '# PUSH -> ADD -> ', stat.wp.mediaAction, stat.tsid, ' AND DELAY');
										api.add(id, stat);
										stat.timeoutId = setTimeout(function() {
											callback(stat);
											api.remove(id, stat.tsid);
										}, delay);
									}
								},
								// wysłanie całej kolejki
								sendAll: function() {
									if (unloadFlag){
										unloadFlag = 0;
										var stat, time = new Date().getTime(),
											a = 1,
											id;
										for (id in stack) {
											if (stack[id]) {
												stat = api.pop(id);
												while (stat) {
													callback(stat);
													stat = api.pop(id);
												}
											}
										}
									}
								},
								isHeartbit: function(stat) {
									return stat.wp.mediaAction === 'NetStream.Heartbit';
								}
							};
						return api;
					};
		
				var self = this,
					params = config.params,
					dispatcher = config.dispatcher,
					events = dispatcher.statEvents,
					statInterval,
		
					alldata = {
						clip: {},
						output: {},
						video: {},
						private: {},
						ad: {},
						errorCode: -1
					},
		
					advMode = false,
					advOn = true,
		
					mediaCounter = 0,
					sendStats = false,
					sendGemius = false,
		
					mediaVisitId = Math.round(Math.random() * 1E10),
					mediaEmbed = params.mediaEmbed,
					mediaNumber = 0,
					mediaAdBlockStreamNumber = 0,
					mediaAdBlockNumber = 0,
					mediaStreamNumber = 0,
					mediaContainerID = '',
		
					/* GEMIUS DATA */
					gemiusManager = new GemiusManager(config),
		
					// kolejka zebranych statystyk
					store = new Store(function(stat) {
						if (store.isHeartbit(stat)) {
							DotMedia.getPlayerHartbitStatus(stat.wp);
						} else {
							DotMedia.getPlayerStatus(stat.wp);
						}
						if (stat.gs) {
							gemiusManager.send(stat.gs);
						}
					}),
		
					incraseViewCount = function(data) {
						if (data.mid && data.media.owner !== "polskastacja" && data.media.owner !== "openfm"){
							$.getJSON('//' + Config.api + '/incview.json', {
								id: data.mid,
								mobile: WP.isMobile ? 1 : 0,
								domain: document.location.hostname
							});
						}
					};
		
				function prepareData(status) {
					var clip = alldata.clip,
						output = alldata.output,
						video = alldata.video,
						priv = alldata.private,
						ad = alldata.ad,
						obj = {};
		
					obj.mediaAction = status;
					obj.mediaUrl = video.url;
					obj.mediaTime = Math.floor(video.currentTime);
					obj.mediaTimeTotal = !advMode && output.isStream ? -1 : Math.floor(video.duration);
		
					obj.mediaOrigMid = clip.lid ? clip.lid + 'live' : clip.mid;
					obj.mediaType = advMode || params.advtype ? 'reklama' : 'material';
		
					obj.mediaQuality = output.qualityOptions ? output.qualityOptions[output.quality] : "";
					obj.mediaEmbed = mediaEmbed;
					obj.mediaEngine = output.flashMode ? 'flash' : 'html';
					obj.mediaStreamType = output.isAudio ? 'audio' : 'wideo';
		
					obj.mediaOwner = clip.media.owner;
					obj.mediaBrand = clip.media.brand;
					obj.mediaKaf = clip.media.kaf;
					obj.mediaUserId = clip.mediaUserId;
		
					obj.mediaAdvOn = Number(advOn);
					obj.mediaAge = clip.minimalAge;
					obj.mediaDrastic = clip.drastic;
					obj.mediaVolume = priv.volume > 0 ? 1 : 0;
		
					obj.mediaCounter = mediaCounter;
					obj.mediaNumber = mediaNumber;
					obj.mediaVisitId = mediaVisitId;
					obj.mediaContainerID = mediaContainerID;
					obj.mediaInit = priv.mediaInit;
					obj.mediaErrorCode = alldata.errorCode;
					if (advMode) {
						obj.mediaAdRequest = ad.mediaAdRequest;
						obj.mediaAdServer = ad.mediaAdServer|| '';
						obj.mediaAdForm = params.advtype ? params.advtype : ad.mediaAdType;
						obj.mediaAdBlockCount = ad.mediaAdBlockCount;
						obj.mediaAdBlockStreamNumber = mediaAdBlockStreamNumber;
						obj.mediaAdBlockNumber = mediaAdBlockNumber;
						obj.mediaAdBlockSegmentCount = ad.mediaAdBlockSegmentCount;
						obj.mediaAdBlockStreamSegment = ad.mediaAdBlockStreamSegment;
						obj.mediaStreamNumber = 1;
					} else {
						obj.mediaAdForm = params.advtype ? params.advtype : output.forcePreview ? "preview" : "content";
						obj.mediaMid = obj.mediaOrigMid;
						obj.mediaName = clip.title;
						obj.mediaFrame = clip.screenshot;
						obj.mediaTags = clip.tags;
						obj.mediaCreateDate = clip.media.createDate;
						obj.mediaChannel = clip.mediaChannel;
						obj.mediaCategory = clip.media.category;
						obj.mediaProgram = clip.media.program;
						obj.mediaSource = clip.media.source;
						obj.mediaSourceOrigin = clip.media.sourceOrigin;
						obj.mediaPBICategory = clip.media.PBICategory;
						obj.mediaBroadcasting = clip.media.broadcasting;
						obj.mediaPlayerSource = clip.media.playerSource;
						obj.mediaGemiusTreeId = params.mediaTreeId || null;
						obj.mediaStreamNumber = mediaStreamNumber;
					}
					obj.mediaGfkMediaId = window.gfkSstConf ? window.gfkSstConf.media : "";
					obj.mediaGfkContentId = window.gfkSstConf ? window.gfkSstConf.content : "";
					return obj;
				};
		
				function getDataAndSendStatus(status) {
		
					if (alldata && alldata.private && alldata.private.isExternal){
						return;
					}
					var obj = prepareData(status),
						output = alldata.output;
		
					/* =============================================
					 * GEMIUS STREAM
					 * kolejkowanie statsów pod odpowiednim kluczem:
					 * dla materiału : obj.mediaMid
					 * dla reklamy : obj.mediaContainerID
					 */
					store.push((obj.mediaMid && !advMode) ? obj.mediaMid : obj.mediaContainerID, {
						wp: obj,
						gs: {
							adv: advMode,
							send: sendGemius && !((typeof params.advtype === 'string') || advMode || output.isAudio),
							media: obj,
							ad: alldata.ad,
							private: alldata.private,
							output: alldata.output
						}
					});
				}
		
				function startIntervalStatus() {
					clearTimeout(statInterval);
					intervalStatus();
				}
		
				function endIntervalStatus() {
					clearTimeout(statInterval);
				}
		
				function intervalStatus() {
					if (alldata && alldata.private && alldata.private.isExternal){
						return;
					}
					var currentTime = alldata.video.currentTime,
						duration = alldata.video.duration,
						clip = alldata.clip,
						mediaMid = clip.lid ? clip.lid + 'live' : clip.mid,
						obj = {};
		
					obj.mediaAction = "NetStream.Heartbit";
					obj.mediaTime = Math.floor(currentTime);
					obj.mediaTimeTotal = !advMode && alldata.output.isStream? -1 : Math.floor(duration);
		
					// kolejkowanie statsów pod odpowiednim kluczem:
					// dla materiału : obj.mediaMid
					// dla reklamy : obj.mediaContainerID
					if (mediaCounter === 10) {
						obj.mediaCounter = mediaCounter;
						store.push((obj.mediaMid && !advMode) ? obj.mediaMid : mediaContainerID, {
							wp: obj,
							gs: null
						});
						mediaCounter = 0;
					} else {
						mediaCounter += 1;
					}
		
					clearTimeout(statInterval);
					statInterval = setTimeout(intervalStatus, 1000);
				}
		
				function changeSendStats(value) {
					sendStats = value;
					sendGemius = value;
				}
		
				function videoEvent(event) {
					var edata = event.edata,
						etype = event.type;
					switch (etype) {
					case 'PLAYER_LOADED':
						sendPlayerLoadedStatus();
						break;
					case 'ERROR':
					case 'ERRORRECONNECT':
						alldata.clip = edata.clip.clip;
						alldata.output = edata.clip.output;
						alldata.video = edata.data;
						alldata.private = edata.ext;
						alldata.ad = edata.data.mediaAd || {};
						alldata.errorCode = edata.code;
		
						endIntervalStatus();
						getDataAndSendStatus(nsError);
						changeSendStats(false);
						break;
					case 'INTERRUPTION':
						getDataAndSendStatus(nsInterruption);
					case 'CLEAR':
					case 'AFTER_CHANGE_CLIPDATA':
						endIntervalStatus();
						changeSendStats(false);
						break;
					case 'CHANGE_CLIPDATA':
						alldata.clip = edata.clip;
						mediaStreamNumber = 0;
						mediaAdBlockNumber = 0;
						break;
					case 'START_MOVIE':
					case 'START_ADV_MOVIE':
						var tCID = edata.ext.mediaContainerID;
						alldata.clip = edata.clip.clip;
						alldata.output = edata.clip.output;
						alldata.video = edata.data;
						alldata.private = edata.ext;
						alldata.ad = edata.data.mediaAd;
						alldata.errorCode = -1;
						advMode = true;
						if (etype === 'START_MOVIE') {
							if (mediaContainerID !== tCID || mediaAdBlockNumber){
								mediaStreamNumber += 1;
							}
							mediaAdBlockStreamNumber = 0;
		
							if (mediaStreamNumber === 1){
								incraseViewCount(alldata.clip);
							}
							alldata.ad = {};
							advMode = false;
						} else {
							if (!mediaAdBlockStreamNumber) {
								mediaAdBlockNumber += 1;
							}
							mediaAdBlockStreamNumber += 1;
						}
		
						mediaContainerID = tCID;
		
						advOn = alldata.clip.adv && params.adv;
						mediaCounter = 0;
						mediaNumber++;
		
						if (etype === 'START_ADV_MOVIE'){
							mediaImp(alldata.video.adv);
						}
		
						changeSendStats(true);
						getDataAndSendStatus(nsStart);
						startIntervalStatus();
						break;
		
					case 'END_MOVIE':
						mediaAdBlockStreamNumber = 0;
						mediaAdBlockNumber = 0;
					case 'END_ADV_MOVIE':
						endIntervalStatus();
						getDataAndSendStatus(nsStop);
						changeSendStats(false);
						break;
					case 'CHANGE_POSITION':
						getDataAndSendStatus(nsSeekStart);
						break;
					case 'UPDATE_POSITION':
					case 'UPDATE_ADV_POSITION':
						alldata.video = edata;
						break;
					case 'CHANGE_SEEK':
						getDataAndSendStatus(nsSeekStart);
						break;
					case 'CHANGED_SEEK':
						alldata.video = Utils.extend(edata.data);
						getDataAndSendStatus(nsSeekEnd);
						break;
					case 'CHANGED_VOLUME':
						alldata.private = edata.ext;
						getDataAndSendStatus(nsVolumeEnd);
						break;
					case 'CHANGE_STATE':
						alldata.video = Utils.extend(edata.data);
						alldata.private = edata.ext;
						if (sendStats) {
							if (alldata.private.playing) {
								getDataAndSendStatus(nsResume);
								startIntervalStatus();
							} else {
								getDataAndSendStatus(nsPause);
								endIntervalStatus();
							}
						}
						break;
					}
				}
		
				function sendPlayerLoadedStatus() {
					if (alldata && alldata.clip && alldata.clip.mediaPlayerSource){
						WP.stat.show(null, {
							vid:mediaVisitId,
							mpe: mediaEmbed,
							mre:alldata.clip.mediaPlayerSource
						}, 'npploaded');
					}else {
						setTimeout(sendPlayerLoadedStatus, 200);
					}
				}
		
				// wysłanie statsów ze store po wyjsciu ze strony
				WP.event.set(window, 'onbeforeunload', store.sendAll);
				WP.event.set(window, 'onunload', store.sendAll);
		
				for (var prop in events) {
					dispatcher.on(events[prop], videoEvent);
				}
		
				function mediaImp(obj) {
					var clipData = alldata.clip,
						o = obj.data,
						c = obj.creation,
						k = {
							mre: clipData.mediaPlayerSource,
							vid: mediaVisitId,
							mid: $.trim(clipData.mid),
							adid: o.campid,
							mow: clipData.media.owner,
							muid: clipData.mediaUserId,
							mst: alldata.output.isAudio ? 'audio' : 'wideo',
							mco:mediaContainerID,
							mno:mediaNumber,
							campkey: c.campkey,
							crekey: c.crekey,
							rekid: c.rekid,
							vpos: c.position,
							vtype: c.adSystem + " " + c.adTitle
						},
						d = window.wp_dot_addparams ? Utils.extend(k, window.wp_dot_addparams) : k;
		
					WP.stat.show(null, d, 'mediaimp');
				};
		
				return {
		
					wpPerformance: function(action, key, p1, p2 ) {
						if (typeof WP.performance[action] === 'function') {
							switch (action) {
								case 'measure':
									WP.performance[action](key, p1, p2);
									//console.log( 'measure ->', action, key, p1, p2 );
									break;
								default :
									WP.performance[action](key);
									//console.log( 'default ->', action, key );
							}
						}
					},
		
					sendError: function(errorCode) {
						WP.performance.count('PlayerError_'+errorCode,1);
						/*
						alldata.errorCode = errorCode;
						var obj = prepareData(nsError);
						DotMedia.getPlayerStatus(obj);
						WP.stat.show(null, {
								code: String(errorCode),
								vid:obj.mediaVisitId
						}, 'npperror');
						*/
					},
		
					mediaAdv: function(o) {
						/*
						var q = '',
							mediaPlayerSource = alldata.clip.mediaPlayerSource,
							drastic = alldata.clip.drastic,
							adcount, adslotstr, i;
		
						if (typeof o === 'object') {
							adcount = o.mainQueue.preroll && o.mainQueue.preroll.length || o.mainQueue.midroll && o.mainQueue.midroll.length || 0;
							adslotstr = '';
							if (o.mainQueue.preroll && o.mainQueue.preroll.length > 0) {
								for (i = 0; i < o.mainQueue.preroll.length; i++) {
									adslotstr += 'preroll,';
								}
							}
							if (o.mainQueue.midroll && o.mainQueue.midroll.length > 0) {
								for (i = 0; i < o.mainQueue.midroll.length; i++) {
									adslotstr += 'midroll,';
								}
							}
							if (o.mainQueue.toplayer && o.mainQueue.toplayer.length > 0) {
								for (i = 0; i < o.mainQueue.toplayer.length; i++) {
									adslotstr += 'toplayer,';
								}
							}
							if (o.mainQueue.bottomLayer && o.mainQueue.bottomLayer.length > 0) {
								for (i = 0; i < o.mainQueue.bottomLayer.length; i++) {
									adslotstr += 'bottomLayer,';
								}
							}
		
							q = "srv=" + wp_sn + "&action=mediaadv&par=" + escape("mre=" + mediaPlayerSource + "&vid=" + mediaVisitId + "&drastic=" + (drastic || 0) + "&advcount=" + adcount + "&adslot=" + adslotstr + "&status=ok");
						} else {
							q = "srv=" + wp_sn + "&action=mediaadv&par=" + escape("mre=" + mediaPlayerSource + "&vid=" + mediaVisitId + "&advcount=0&adslot=&status=error");
						}
		
						WP.stat.eventShow(q);
						*/
					},
		
					mediaImp:mediaImp,
		
					sendClick: function(action) {
						/*====== NPP actions ======*/
						// playpause
						// screenplaypause
						// seek
						// mute
						// fullscreen
						// info
						// info_close
						// related
						// interruption
						// mobiletogglepanel
						// volume
						// quality
						/*====== NPP actions ======*/
		
						var nAction = 'npp_' + action;
						WP.stat.eventDot(wp_sn, nAction);
					}
				}
			};
		/*jslint browser: true*/
		/*global Utils, AdvManagerInterface*/
		
		var AdvManager = function(config) {
				'use strict';
				
				/*jslint browser: true*/
				
				/*global ADV, Utils, CONFIG, STAT, advData*/
				
				
				
				var AdvManagerInterface = {
				
					setState:function(playing){
				
						if (ADV){
				
							ADV.setState(playing);
				
						}
				
					},
				
					getType:function(){
				
						return currentType;
				
					},
				
					getAdv: function(data) {
				
						cookieErrorFix = false;
				
						
				
						config.sendError('1.1.0');
				
						if (!window.rekid && !data.rekid) {
				
							config.sendError('1.1.5.3');
				
							config.end(false);
				
							return;
				
						}
				
						var vastData = getBaseUrl(data),
				
							ajaxQuery = function() {
				
								if (!Utils.isMobile) {
				
									statsManager.wpPerformance('mark', 'PlayerVastQueryStart');
				
								}
				
								$.ajax({
				
									url: vastData.url,
				
									type: 'get',
				
									data: vastData.data,
				
									dataType: 'xml',
				
									timeout: 15000,
				
									crossDomain: true,
				
									xhrFields: {
				
										withCredentials: !vastData.oldBrowser
				
									},
				
									success: function(d) {
				
										statsManager.wpPerformance('mark', 'PlayerVastQueryEnd');
				
										statsManager.wpPerformance('measure', 'PlayerVastQueryTime', 'PlayerVastQueryStart', 'PlayerVastQueryEnd');
				
										initAdv({
				
											xml: d,
				
											pid: data.pid,
				
											type:data.type,
				
											callback:data.callback
				
										});
				
									},
				
									error: function(x, t, m) {
				
										config.mediaAdv('error');
				
										if (!cookieErrorFix) {
				
											// starym przeglądarkom przełączamy na tryb bez cookie (bcv)
				
											cookieErrorFix = !cookieErrorFix;
				
											config.sendError('1.1.1.'+(Number(window.hasSentinel())+1));
				
											config.sendError('14');
				
											vastData = getBaseUrl(data)
				
											ajaxQuery();
				
										} else {
				
											if (config.canSkipAd()){
				
												config.sendError('1.1.4');
				
												config.end(false);
				
												return;
				
											}
				
				
				
											if (t === 'timeout') {
				
												config.sendError('1.1.2');
				
												config.onAdBlock(12);
				
											} 
				
											config.sendError('1.1.3');
				
											config.onAdBlock(11);
				
										}
				
									}
				
								});
				
							};
				
							
				
						if (!vastData) {
				
							if (config.canSkipAd()) {
				
								config.sendError('1.1.5.1');
				
								config.end(false);
				
								return;
				
							}
				
							config.sendError('1.1.5.2');
				
							config.mediaAdv('error');
				
							//nie zwrócony vad
				
							config.adBlock(10);
				
							return;
				
						}else 
				
							ajaxQuery();
				
						}
				
					};
				
				
				/*jslint browser: true*/
				/*global $*/
				
				var AdvBase = function(adv, config) {
						'use strict';
				
						var $this = this,
							callback = config.callback,
							tracking = adv.data.tracking,
							privateDispatcherApi = config.dispatcher.private,
				
							api = {
								timeData: {
									currentTime: 0,
									duration: 30,
									position: 0,
									buffer: 0
								},
								canPause:false,
								sendTracking: function(s) {
									if (s === null || typeof s !== 'object') {
										return;
									}
									$(s).each(function() {
										var i = new Image(1, 1),
											url = this.toString();
										i.src = url + (url.indexOf('?') < 0 ? '?' : '&') + 't=' + Utils.randomString(20);
									});
								},
								destroy: function() {
									privateDispatcherApi.off('ADVQUERY', $this.destroy);
									privateDispatcherApi.off('CLEAR', $this.destroy);
									privateDispatcherApi.off('CHANGE_CLIPDATA', $this.destroy);
								},
				
								setState: function(playing) {
				
								},
				
								resume: function(segment) {
									$this.destroy();
									callback(segment);
								},
								init: function() {
									privateDispatcherApi.on('ADVQUERY', $this.destroy);
									privateDispatcherApi.on('CHANGE_CLIPDATA', $this.destroy);
									privateDispatcherApi.on('CLEAR', $this.destroy);
									if (typeof adv.data.tracking !== 'undefined') {
										$this.sendTracking(adv.data.tracking.impression);
									}
								},
								started: function() {
									config.setUiConfig({
										bottom: true,
										top: true,
										topcont:true,
										btnplaybig: false,
										btnplay: false,
										/*seek: false,*/
										/*special: true,*/
										mode: 'special',
										timeMode: "reverse"
									});
				
									config.started($this.canPause);
									if (typeof tracking !== 'undefined') {
										$this.sendTracking(tracking.load);
									}
									if (typeof tracking !== 'undefined') {
										$this.sendTracking(tracking.creativeView);
									}
								}
							};
						for (var i in api) {
							if (api.hasOwnProperty(i)) {
								this[i] = api[i];
							}
						}
						return this;
					};
						/*jslint browser: true*/
				/*global $, AdvBase, Utils*/
				
				var Bottomlayer = function(adv, config) {
						'use strict';
						AdvBase.apply(this, arguments);
				
						var $this = this,
							$target = config.target,
							containerName = config.name,
							advTimeout, $cnt, privateDispatcherApi = config.dispatcher.private,
							startVal = parseFloat(adv.data.start),
							_super = Utils.extend({}, $this),
				
							testBottom = function(data) {
								if (data.edata && data.edata.currentTime >= startVal) {
									showBottom();
								}
							},
				
							closeBottom = function(e) {
								e.preventDefault();
								if (typeof adv.data.tracking !== 'undefined') {
									$this.sendTracking(adv.data.tracking.close);
								}
								$this.destroy();
							},
				
							showBottom = function() {
								var $a, $x, $img, img;
								
								$cnt = $('<div>').addClass(containerName).addClass('bola');
				
								$a = $('<a>').attr({
									href: adv.data.click,
									target: '_blank'
								}).css({ width: parseInt(adv.data.width, 10) }).appendTo($cnt);
				
				
								$x = $('<div>').addClass('close').html('Zamknij <span class="close-x">&#215;</span>').click(function(e) {
									closeBottom(e);
								}).prependTo($a);
				
								$img = $('<img>').attr({
									src: adv.data.url
								}).css({
									width:parseInt(adv.data.width, 10)
								}).appendTo($a);
				
								img = new Image();
								img.onerror = function() {
									$this.destroy();
								};
								img.onload = function() {
									if (typeof adv.data.tracking !== 'undefined') {
										$this.sendTracking(adv.data.tracking.creativeView);
									}
								};
								img.src = adv.data.url;
				
								$cnt.appendTo($target);
								showBottom = function() {};
							};
				
						$this.destroy = function() {
							clearTimeout(advTimeout);
							privateDispatcherApi.off(privateDispatcherApi.END_MOVIE, $this.destroy);
							privateDispatcherApi.off(privateDispatcherApi.UPDATE_POSITION, testBottom);
				
							if (typeof($cnt) !== 'undefined') {
								$cnt.remove();
							}
							_super.destroy();
						};
				
						$cnt = $('<div>').addClass(containerName).append($('<div>').addClass('close').html('<span>Zamknij </span><span class="close-x">&#215;</span>').click(function(e) {
							$this.resume();
							e.preventDefault();
						})).append($('<a>').attr({
							href: adv.data.click,
							target: '_blank'
						}));
				
						privateDispatcherApi.on(privateDispatcherApi.UPDATE_POSITION, testBottom);
						privateDispatcherApi.on(privateDispatcherApi.END_MOVIE, $this.destroy);
				
						_super.init();
					};
						/*jslint browser: true*/
				/*global $, AdvBase, Config, Utils, google, unescape*/
				
				var Ima3 = function(adv, config) {
						'use strict';
						AdvBase.apply(this, arguments);
				
						var $this = this,
							startAd,
							stopAd,
							pid = config.pid,
							$target = config.target,
							containerName = config.name,
							$cnt = $('<div>').addClass(containerName).appendTo($target),
							tracking = adv.data.tracking,
							extEvent = config.extEvent,
							_super = Utils.extend({}, $this),
							privateDispatcherApi = config.dispatcher.private,
				
							googleima, googleimaAdEventType, jsloaded = 0,
							getWidth = function(){
								return $target[0].offsetWidth;
							},
							getHeight = function(){
								return ($target[0].offsetHeight);
							},
							width = getWidth(),
							height = getHeight(),
				
							videoContent = Utils.clone($this.timeData),
							timeData = $this.timeData,
							ad = null,
							//ze względu na currentTime - do wybadania
							uicallbacks, adDisplayContainer, adsManager, adsLoader, intervalTimer,
							cntClick = function(){
								extEvent('externalCntClick');
							},
							onAdsManagerLoaded = function(adsManagerLoadedEvent) {
								stopAd = new Date().getTime();
								//console.warn('wp.ima adManagerLoaded', stopAd - startAd);
								adsManager = adsManagerLoadedEvent.getAdsManager(videoContent); // should be set to the content video element
								// Add listeners to the required events.
								adsManager.addEventListener(googleima.AdErrorEvent.Type.AD_ERROR, onAdError);
								adsManager.addEventListener(googleimaAdEventType.ALL_ADS_COMPLETED, onAdEvent);
				
								// Listen to any additional events, if necessary.
								adsManager.addEventListener(googleimaAdEventType.PAUSED, onAdEvent);
								adsManager.addEventListener(googleimaAdEventType.RESUMED, onAdEvent);
								adsManager.addEventListener(googleimaAdEventType.LOADED, onAdEvent);
								adsManager.addEventListener(googleimaAdEventType.STARTED, onAdEvent);
								adsManager.addEventListener(googleimaAdEventType.COMPLETE, onAdEvent);
				
								try {
									// Initialize the ads manager. Ad rules playlist will start at this time.
									adsManager.init(width, height, googleima.ViewMode.NORMAL);
									// Call play to start showing the ad. Single video and overlay ads will
									// start at this time; the call will be ignored for ad rules.
									adsManager.start();
								} catch (adError) {
									// An error may be thrown if there was a problem with the VAST response.
									//videoContent.play();
									if (typeof tracking !== 'undefined') {
										$this.sendTracking(tracking.passback);
									}
									$this.resume();
								}
							},
				
							timeupdate = function() {
								timeData.currentTime = timeData.duration - adsManager.getRemainingTime();
								timeData.position = 1 - adsManager.getRemainingTime() / ad.getDuration();
								extEvent('timeupdate', timeData);
							},
				
							onAdEvent = function(adEvent) {
								//console.log('wp.ima', adEvent.type);
								ad = adEvent.getAd();
								switch (adEvent.type) {
								case googleimaAdEventType.PAUSED:
									extEvent('pause', timeData);
									break;
								case googleimaAdEventType.RESUMED:
									extEvent('playing', timeData);
									break;
								case googleimaAdEventType.LOADED:
				
									//PlayerConfig[pid].loaderShow(false);
									//console.log('LOADED', width, height);
									// This is the first event sent for an ad - it is possible to
									// determine whether the ad is a video ad or an overlay.
									onLoaded(ad);
									break;
								case googleimaAdEventType.STARTED:
									$cnt.off('click', cntClick);
									// This event indicates the ad has started - the video player
									// can adjust the UI, for example display a pause button and
									// remaining time.
									//console.log(adDisplayContainer, ad);
									if (ad.isLinear()) {
										$this.started();
										timeData.duration = adsManager.getRemainingTime();
										extEvent('playAdv', Utils.extend({mediaAd:config.mediaAd, adv:adv}, timeData));
										extEvent('playing', timeData);
				
										onResize();
										timeupdate();
										clearInterval(intervalTimer);
										intervalTimer = setInterval(timeupdate, 500);
									} else {
										//BottomLayer
										$this.resume();
									}
									break;
								case googleimaAdEventType.SKIPPED:
									extEvent('skipped');
									clearInterval(intervalTimer);
									break;
								case googleimaAdEventType.CLOSED:
									//console.log('CLOSED by the user');
									clearInterval(intervalTimer);
									//unbind();
									break;
								case googleimaAdEventType.COMPLETE:
									// This event indicates the ad has finished - the video player
									// can perform appropriate UI actions, such as removing the timer for
									// remaining time detection.
									if (ad.isLinear()) {
										extEvent('ended');
										clearInterval(intervalTimer);
									}
									break;
								case googleimaAdEventType.ALL_ADS_COMPLETED:
									$this.resume(adv.segment);
									break;
								}
							},
							
							onAdError = function() {
								stopAd = new Date().getTime();
								//console.warn('wp.ima adError', stopAd - startAd);
								// Handle the error logging.
								if (typeof tracking !== 'undefined') {
									$this.sendTracking(tracking.passback);
								}
								
								if (config.canSkipAd()){
									config.sendError('1.3.6');
									$this.resume();
									return;
								}
								config.sendError('1.3.5');
								config.onAdBlock(13);
				
								//$this.resume();
							},
							onAdError2 = function(e) {
								stopAd = new Date().getTime();
								//console.warn('wp.ima adError', stopAd - startAd, e.getError().getErrorCode());
								// Handle the error logging.
								if (typeof tracking !== 'undefined') {
									$this.sendTracking(tracking.passback);
								}
								
								config.sendError('1.3.7.'+e.getError().getErrorCode());
								$this.resume();
								//$this.resume();
							},
				
							initAd = function() {
								startAd = new Date().getTime();
								config.sendError('1.3.0');
								if (typeof google === 'undefined') {
									return false;
								}
				
								googleima = google.ima;
								googleimaAdEventType = google.ima.AdEvent.Type;
				
								googleima.settings.setLocale('pl');
				
								if (Utils.isMobile) {
									var vid = $target.find('video')[0];
									vid.load();
									extEvent('loading', timeData);
									adDisplayContainer = new googleima.AdDisplayContainer($cnt[0], vid); //jako parametr dajemy kontener do którego ma sie wrzucić reklama
								} else {
									adDisplayContainer = new googleima.AdDisplayContainer($cnt[0]); //jako parametr dajemy kontener do którego ma sie wrzucić reklama
								}
				;
								adDisplayContainer.initialize();
				
								adsLoader = new googleima.AdsLoader(adDisplayContainer);
								adsLoader.addEventListener(googleima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false);
								adsLoader.addEventListener(googleima.AdErrorEvent.Type.AD_ERROR, onAdError2, false);
				
								var adsRequest = new googleima.AdsRequest();
								adsRequest.adTagUrl = unescape(adv.data.url); //jako parametr przekazujemy tag który otrzymalismy w XMLU
								adsRequest.linearAdSlotWidth = width;
								adsRequest.linearAdSlotHeight = height;
								adsRequest.nonLinearAdSlotWidth = width;
								adsRequest.nonLinearAdSlotHeight = height / 2;
								try {
									adsLoader.requestAds(adsRequest);
								} catch (e) {
									if (typeof tracking !== 'undefined') {
										$this.sendTracking(tracking.passback);
									}
									$this.resume();
								}
							},
				
							onLoaded = function() {
								stopAd = new Date().getTime();
								//console.warn('wp.ima adLoaded', stopAd - startAd);
								onResize();
								onChangeVolume();
								privateDispatcherApi.on('CHANGE_VOLUME', onChangeVolume);
								privateDispatcherApi.on('CHANGED_VOLUME', onChangeVolume);
								privateDispatcherApi.on('CHANGE_SIZE', onResize);
								privateDispatcherApi.on('CHANGE_FULLSCREEN', onResize);
							},
				
							onResize = function() {
								if (!ad) {
									return;
								}
								width = getWidth();
								height = getHeight();
								
								var h = height;
								if (!ad.isLinear()) {
									h = ad.b.height + 10;
								}else {
									adsManager.resize(width, height, googleima.ViewMode.NORMAL);
								}
				
								if (config.parentTarget.hasClass('FloatingPlayer')) {
									$cnt.css({
										width: '100%',
										height: '100%'
									}).find('div:first-of-type').css({
										width: '100%',
										height: '100%'
									});
				
									var iframe = $cnt.find('iframe');
				
									iframe.css({
										width: '100%',
										height: '100%'
									});
				
									iframe.attr('width', '');
									iframe.attr('height', '');
								} else {
									$cnt.css({
										width: width,
										height: h,
										margin: '0 auto'
									}).find('div:first-of-type').css({
										width: width,
										height: h
									}).find('iframe').css({
										height: h
									});
								}
							},
				
							onChangeVolume = function() {
								if (adsManager) {
									adsManager.setVolume(config.getVolume());
								}
							},
				
							unbind = function() {
								// reset pozycji playera
								clearInterval(intervalTimer);
								privateDispatcherApi.off('CHANGE_FULLSCREEN', onResize);
								privateDispatcherApi.off('CHANGE_SIZE', onResize);
								privateDispatcherApi.off('CHANGE_VOLUME', onChangeVolume);
								privateDispatcherApi.off('CHANGED_VOLUME', onChangeVolume);
							};
				
						$target.on('mouseenter', function(){
							$target.addClass('exthover');
						});
						$target.on('mouseleave', function(){
							$target.removeClass('exthover');
						});
						$this.destroy = function() {
							$cnt.hide();
							$target.removeClass('exthover');
							setTimeout(function () {
								try {
									if (adsManager) {
										adsManager.destroy();
									}
								} catch (e) {}
								unbind();
								if (typeof($cnt) !== 'undefined') $cnt.remove();
								_super.destroy();
							}, 1000);
						};
				
						$this.setState = function(playing) {
							if (playing) {
								adsManager.pause();
							} else {
								adsManager.resume();
							}
						};
				
						$this.started = function() {
							$this.canPause = true;
							_super.started();
							
							config.setUiConfig({
								btnplay: true,
								top: true,
								topcont:false
							});
						};
				
						$cnt.css({
							background: 'none'
						});
				
						// comment
						if (window.google && window.google.ima) {
							initAd();
						} else {
							//patrze komentarz nizej
							if (Config.ima3) {
								$.ajax({
									url: Config.ima3,
									dataType: "script",
									timeout: 2000,
									crossDomain: true,
									success: function () {
										jsloaded += 1;
										initAd();
									},
									error: function () {
										if (typeof tracking !== 'undefined') {
											$this.sendTracking(tracking.passback);
										}
										//nie zamierzam tracić czasu na kolejne odpytania, kiedy jest adblok i 10 IM pod rząd!!
										Config.ima3 = '';
										if (config.canSkipAd()) {
											$this.resume();
											config.sendError('1.3.4');
											return;
										}
										config.sendError('1.3.3');
										config.onAdBlock(13);
				
										//$this.resume();
									}
								});
							}else {
								$this.resume();
							}
						};
				
						$cnt.on('click', cntClick);
						_super.init();
				
						return $this;
					};
				
						/*jslint browser: true*/
				/*global $, Utils, AdvBase*/
				
				var Jingiel = function(adv, config) {
						'use strict';
						AdvBase.apply(this, arguments);
						var $this = this,
							$target = config.target,
							extEvent = config.extEvent,
							advTimeout, events = [{
								key: 'FAKE_START_ADV_MOVIE',
								fn: onStart
							}, {
								key: 'END_ADV_MOVIE',
								fn: onEnd
							}, {
								key: 'ERROR',
								fn: onError
							}],
							privateDispatcherApi = config.dispatcher.private,
							_super = Utils.extend({}, $this);
				
						$this.destroy = function() {
							clearTimeout(advTimeout);
							for (var i = 0, max = events.length; i < max; i++) {
								privateDispatcherApi.off(events[i].key, events[i].fn);
							}
							_super.destroy();
						};
						
						function onStart(data) {
							$this.started();
							extEvent('playAdv', Utils.extend({mediaAd:config.mediaAd, adv:adv}, data.edata.data));
						}
				
						function onEnd() {
							$this.resume(adv.segment);
						}
						
						function onError() {
							config.mediaAdv('error');
							if (config.canSkipAd()){
								config.sendError('1.2.6');
								$this.resume(adv.segment);
								return;
							}
							config.sendError('1.2.5');
							config.onAdBlock(13);
						}
				
						for (var i = 0, max = events.length; i < max; i++) {
							privateDispatcherApi.on(events[i].key, events[i].fn);
						}
						config.sendError('1.2.0');
						_super.init();
						
						config.startPrerollVideo(adv.data);
					};
						/*jslint browser: true*/
				/*global $, Utils, AdvBase*/
				
				var Preroll = function(adv, config) {
						'use strict';
						AdvBase.apply(this, arguments);
				
						var $this = this,
							$target = config.target,
							extEvent = config.extEvent,
							containerName = config.name,
							tracking = adv.data.tracking,
							skip = adv.data.skipoffset,
							advimg = adv.data.advimg,
							initialSkipText = 'Mo\u017cesz pomin\u0105\u0107 reklam\u0119 za ',
							initialSkipImgText = 'Start wideo za ',
							skipText = 'Pomi\u0144 reklam\u0119 \u203a\u203a',
							$counter, advTimeout, $cnt, events = [{
								key: 'FAKE_START_ADV_MOVIE',
								fn: onStart
							}, {
								key: 'UPDATE_ADV_POSITION',
								fn: onUpdate
							}, {
								key: 'INTERRUPTION',
								fn: onInterruption
							}, {
								key: 'END_ADV_MOVIE',
								fn: onEnd
							}, {
								key: 'ERROR',
								fn: onError
							}],
							privateDispatcherApi = config.dispatcher.private,
							_super = Utils.extend({}, $this);
				
						$this.destroy = function() {
							clearTimeout(advTimeout);
							if (typeof($cnt) !== 'undefined') {
								$cnt.remove();
							}
							for (var i = 0, max = events.length; i < max; i++) {
								privateDispatcherApi.off(events[i].key, events[i].fn);
							}
							_super.destroy();
						};
						
						function onStart(data) {
							$this.started();
							if (skip) {
								$cnt = $('<div>').addClass(containerName).addClass('skip').appendTo($target);
								if (!advimg) {
									$counter = $cnt;
									count();
								} else {
									$cnt.html(skipText).on('click', onInterruption2);
								}
							}
							extEvent('playAdv', Utils.extend({mediaAd:config.mediaAd, adv:adv}, data.edata.data));
						}
				
						function onEnd() {
							if (typeof tracking !== 'undefined') {
								$this.sendTracking(tracking.complete);
							}
							$this.resume(adv.segment);
						}
						
						function onError() {
							config.mediaAdv('error');
							if (config.canSkipAd()){
								config.sendError('1.2.6');
								$this.resume(adv.segment);
								return;
							}
							config.sendError('1.2.5');
							config.onAdBlock(13);
						}
				
						function count() {
							$counter.html((advimg ? initialSkipImgText : initialSkipText) + skip);
							if (skip > 0) {
								advTimeout = setTimeout(count, 1000);
							} else {
								if (advimg) {
									extEvent('skipped');
								} else {
									$counter.html(skipText).on('click', function() {
										extEvent('skipped');
									});
								}
							}
							skip -= 1;
						}
				
						//CPV
						function onInterruption() {
							if (typeof tracking !== 'undefined') {
								$this.sendTracking(tracking.close);
							}
				
							config.stopPrerollVideo();
							$this.resume(adv.segment);
						}
				
						//SKIPAD
						function onInterruption2() {
							if (typeof tracking !== 'undefined') {
								$this.sendTracking(tracking.creativeView);
							}
							$cnt.html(skipText).off('click', onInterruption2);
							var $a = $('<a>').attr({
								href: adv.data.click,
								target: '_blank'
							}).appendTo($cnt.html('').removeClass('skip'));
							$counter = $('<span>').addClass('skip').appendTo($cnt);
							count();
							config.stopPrerollVideo();
							$('<div>').addClass('img').css('background-image', 'url("' + advimg + '")').appendTo($a);
						}
				
						function onUpdate(data) {
							var prc = data.edata.position * 100;
							if (typeof tracking !== 'undefined') {
								if (tracking.firstQuartile && prc >= 25) {
									$this.sendTracking(tracking.firstQuartile);
									tracking.firstQuartile = null;
								}
								if (tracking.midpoint && prc >= 50) {
									$this.sendTracking(tracking.midpoint);
									tracking.midpoint = null;
								}
								if (tracking.thirdQuartile && prc >= 75) {
									$this.sendTracking(tracking.thirdQuartile);
									tracking.thirdQuartile = null;
								}
							}
						}
				
						for (var i = 0, max = events.length; i < max; i++) {
							privateDispatcherApi.on(events[i].key, events[i].fn);
						}
						config.sendError('1.2.0');
						_super.init();
						
						config.startPrerollVideo(adv.data);
					};
						/*jslint browser: true*/
				/*global $, Config, Utils, AdvBase, APP*/
				
				var Timesyncad = function(adv, config) {
						'use strict';
						AdvBase.apply(this, arguments);
				
						var $this = this,
							pid = config.pid,
							$target = config.target,
							containerName = config.name,
							handler = Config.flash.handler.replace('[id]', pid),
							$cnt, tracking = adv.data.tracking,
							extEvent = config.extEvent,
							timeData = $this.timeData,
							_super = Utils.extend({}, $this),
				
				
							getQueryPar = function(uri, pname, decodeURI) {
								decodeURI = decodeURI || false;
								pname = pname.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
								var regex = new RegExp("[\\?&]" + pname + "=([^&#]*)"),
									results = regex.exec(uri);
								return results === null ? "" : decodeURI ? decodeURIComponent(results[1].replace(/\+/g, " ")) : results[1].replace(/\+/g, " ");
							},
				
							getSeparator = function(str) {
								str = unescape(str);
								return str.indexOf(';') > -1 ? ';' : '&';
							};
				
							$this.destroy = function() {
								if (typeof($cnt) !== 'undefined') {
									$cnt.remove();
								}
				
								_super.destroy();
							};
				
						$this.resume = function(segment) {
							if (typeof tracking !== 'undefined') {
								$this.sendTracking(tracking.close);
							}
							_super.resume(segment);
						};
				
						$this.started = function() {
							_super.started();
							config.setUiConfig({
								bottom: false
							});
						};
				
						/**
						 * Rozszerzenie handlera dla formy reklamowej videoAdControl
						 * @param {String} p event name [start|stop] dla formy videoAdControl [video_ad_control_1| ... |video_ad_control_n]
						 * @param {String} action [click|time] (tylko dla formy videoAdControl)
						 * @param {String} value wartość czasu dla akcji time (tylko dla formy videoAdControl)
						 * @returns {null}
						 */
						WP.player(pid).tsva = function(p, action, value) {
							//console.log(p, action, value);
							if (p === 'start') {
								$this.started();
								extEvent('playAdv', Utils.extend({mediaAd:config.mediaAd, adv:adv}, timeData));
							} else if (p === 'stop') {
								if (typeof tracking !== 'undefined') {
									$this.sendTracking(tracking.close);
								}
								if (typeof tracking !== 'undefined') {
									$this.sendTracking(tracking.complete);
								}
								extEvent('ended');
								$this.resume(adv.segment);
							} else if (p.indexOf('video_ad_control') > -1) {
								var eventIdx = p.replace(/^\D+/g, ''); // nr eventa video_ad_control [np 3 dla video_ad_control_click_3]
								if (action === 'click') {
									if (typeof tracking !== 'undefined') {
										$this.sendTracking([tracking['video_ad_control_click_' + eventIdx]]);
									}
								} else if (action === 'time') {
									if (typeof tracking !== 'undefined') {
										var query_par = getQueryPar(tracking['video_ad_control_time_' + eventIdx][0], "par"); // + "%26" + "time" + "%3D" + value;
										var separator = getSeparator(query_par); //';' || '&'; '%3b' || '%26
										query_par += separator + "time" + "%3D" + value;
										var updated_query = [updateQuery(tracking['video_ad_control_time_' + eventIdx][0], "par", query_par)]; //Array, "%3btime%3DTIME_VALUE"
										if (typeof(updated_query) !== 'undefined') {
											$this.sendTracking(updated_query);
										}
									}
								}
							}
						};
				
						$cnt = $('<div>').addClass(containerName);
						$cnt.appendTo($target);
				
						Utils.flash.embed(adv.data.url, string100, string100, 'handler=' + handler + '.tsva&click=' + adv.data.click + '&videoClick=' + adv.data.videoClick + adv.data.clickUrls + adv.data.imgUrls + '&videoUrl=' + adv.data.videoUrl, {
							bgcolor: '#000000',
							allowscriptaccess: 'always'
						}, containerName, $cnt[0]);
				
						_super.init();
					};
						/*jslint browser: true*/
				/*global $, Utils, AdvBase*/
				
				var Toplayer = function(adv, config) {
						'use strict';
						AdvBase.apply(this, arguments);
						
						var $this = this,
							$target = config.target,
							containerName = config.name,
							advTimeout, $cnt, $img, _super = Utils.extend({}, $this);
				
						$this.destroy = function() {
							clearTimeout(advTimeout);
							if (typeof($cnt) !== 'undefined') {
								$cnt.remove();
							}
							_super.destroy();
						};
				
						$this.resume = function() {
							if (typeof adv.data.tracking !== 'undefined') {
								$this.sendTracking(adv.data.tracking.close);
							}
							_super.resume();
						};
						
						$this.started = function() {
							_super.started();
							config.setUiConfig({
								bottom: false,
								top:false
							});
						};
				
						$cnt = $('<div>').addClass(containerName).append($('<div>').addClass('close').html('<span>Zamknij </span><span class="close-x">&#215;</span>').click(function(e) {
							$this.resume();
							e.preventDefault();
						})).append($('<a>').attr({
							href: adv.data.click,
							target: '_blank'
						}));
				
						$img = $('<div>').addClass('img').css('background-image', 'url("' + adv.data.url + '")').appendTo($cnt.find('a'));
				
						var img = new Image();
						img.onerror = function() {
							$this.destroy();
							/*==SEND ADV ERROR==*/
							config.mediaAdv('error');
							config.onAdBlock(15);
						};
						img.onload = function() {
							$this.started();
						};
						img.src = adv.data.url;
				
						$cnt.appendTo($target);
						clearTimeout(advTimeout);
						if (adv.data.duration > 0) advTimeout = setTimeout(function() {
							$this.resume();
						}, adv.data.duration * 1000);
				
						_super.init();
					};
						/*jslint browser: true*/
				/*global $, Utils, Config, AdvBase, APP, escape*/
				
				var Vpaid = function(adv, config) {
						'use strict';
						AdvBase.apply(this, arguments);
				
						var $this = this,
							pid = config.pid,
							$target = config.target,
							containerName = config.name,
							handler = Config.flash.handler.replace('[id]', pid),
							$cnt, tracking = adv.data.tracking,
							timeData = $this.timeData,
							extEvent = config.extEvent,
							privateDispatcherApi = config.dispatcher.private,
							_super = Utils.extend({}, $this),
							onChangeVolume = function() {
								if (typeof document[containerName] !== 'undefined') {
									document[containerName].setVolume(config.getVolume());
								}
							};
				
						$this.destroy = function() {
							privateDispatcherApi.on('CHANGE_VOLUME', onChangeVolume);
							if (typeof($cnt) !== 'undefined') {
								$cnt.remove();
							}
							_super.destroy();
						};
				
						$this.resume = function(segment) {
							if (typeof tracking !== 'undefined') {
								$this.sendTracking(tracking.close);
							}
							_super.resume(segment);
						};
				
						/**
						 * Rozszerzenie handlera dla formy reklamowej videoAdControl
						 * @param {String} p event name [start|stop] dla formy videoAdControl [video_ad_control_1| ... |video_ad_control_n]
						 * @param {String} action [click|time] (tylko dla formy videoAdControl)
						 * @param {String} value wartość czasu dla akcji time (tylko dla formy videoAdControl)
						 * @returns {null}
						 */
						WP.player(pid).tsva = function(p, action, value, value2) {
							switch (p) {
							case 'init':
								break;
							case 'start':
								$this.started();
								//WP.player(pid).stat.mediaImp(adv.data);
								extEvent('timeupdate', timeData);
								extEvent('playAdv', Utils.extend({mediaAd:config.mediaAd, adv:adv}, timeData));
								onChangeVolume();
								break;
							case 'complete':
								extEvent('ended');
								$this.resume(adv.segment);
								break;
							case 'ontimeupdate':
								if (value >= value2) {
									return;
								}
								extEvent('timeupdate', Utils.extend(timeData, {
									currentTime: value || 0,
									duration: value2 || 30,
									buffer:0
								}));
								break;
							case 'onprogressupdate':
								extEvent('timeupdate', Utils.extend(timeData, {
									position: value || 0,
									buffer:0
								}));
								break;
							case 'onerror':
								if (typeof adv.data.tracking !== 'undefined') {
									$this.sendTracking(adv.data.tracking.passback);
								}
								
								if (config.canSkipAd()){
									config.sendError('1.4.6');
									$this.resume();
									return;
								}
								
								config.sendError('1.4.5');
								config.onAdBlock(13);
								break;
							case 'onclickthru':
								//console.log(p, action, value);
								break;
							}
						};
				
						$cnt = $('<div>').addClass(containerName);
						$cnt.appendTo($target);
				
						privateDispatcherApi.on('CHANGE_VOLUME', onChangeVolume);
				
						Utils.flash.embed(Config.vpaid, string100, string100, 'handler=' + handler + '.tsva&url=' + escape(adv.data.url), {
							bgcolor: '#000000'
						}, containerName, $cnt[0]);
				
						_super.init();
					};
		
				var mainTypes = ['toplayer', 'preroll', 'midroll', 'postlayer', 'bottomlayer'],
					allAdvTypes = new RegExp('ima3|vpaid|timesyncad|audio|' + mainTypes.join('|')),
					ADV,
					advData = {},
					api = {},
					currentType = "",
					adBlockCount = 0,
					cookieErrorFix = false,
		
					modules = {
						jingiel: Jingiel,
						toplayer: Toplayer,
						postlayer: Toplayer,
						bottomlayer: Bottomlayer,
						preroll: Preroll,
						audio: Preroll,
						ima3: Ima3,
						vpaid: Vpaid,
						timesyncad: Timesyncad
					},
		
					getBaseUrl = function(data){
						var oldBrowser = cookieErrorFix || Utils.browser.isIE && Utils.browser.IEVer < 10,
							queryData = {
								handler: data.pid,
								//obejscie dla reklamy przy livestream
								duration: data.duration <= 0 ? 30 : data.duration,
								minage: data.minimalAge,
								drastic: data.drastic,
								bcv: oldBrowser ? 1 : 2,
								mid: data.id,
								pid: data.mediaProgram,
								tags: data.advTags || ''
								//TODO zlecenie do Falka
							},
							queryUrl = false,
							isAudio = /audio/.test(data.type),
							prefix = isAudio ? 'a' : 'v',
							oldSystem = window['PWA'+prefix+'ad'],
							newSystem = window.gafAPI,
							newSystemName = 'get'+prefix.toUpperCase()+'adURL',
							rekid = data.rekid || Utils.urlVariable.rekid || window.rekid;
						
						if (/midroll/.test(data.type)){
							var isAudio = /audio/.test(data.type),
								prefix = isAudio ? 'a' : 'v';
							queryData[prefix+'btype'] = data.type;
							queryData[prefix+'bduration'] = isAudio ? 30 : 675; //675 to maxymalna długosc bloku
						}
						
						if (oldSystem && typeof oldSystem === 'function'){
							queryUrl = oldSystem().replace(/rekid=\d*/, 'rekid=' + rekid);
						}
						if (!queryUrl && newSystem && typeof newSystem[newSystemName] === 'function'){
							queryUrl = newSystem[newSystemName](rekid, Utils.clone(queryData));
							queryData = {};
						}
						return {
							url:String(queryUrl).replace("#", "&#35;"),
							data:queryData,
							oldBrowser:oldBrowser
						};
					},
							
					checkOutQueue = function(segmentViewed) {
						var adv = false,
							type = '',
							queue = 'mainQueue',
							advConfig, advQueue, parameters = advData.parameters,
							canPlaySegment = parameters.segmentViewed < parameters.blockSegmentCount,
							jingiel = {
								segment:0,
								creation:{},
								data:{
									tracking:[],
									type: "audio/mp3",
									url:""
								}
							},
							jingielConfig = function(){
								return Utils.extend(config, {
									callback: continueAction,
									mediaAd: {
										mediaCreation: {
											crekey:"jingiel"
										},
										mediaAdServer: '',
										mediaAdRequest: 0,
										mediaAdType: 'jingiel',
										mediaAdBlockCount: adBlockCount,
										mediaAdBlockSegmentCount: parameters.blockSegmentCount,
										mediaAdBlockStreamSegment: 0
									}
								});
							},
							jingielPlay = function(src){
								parameters.jingiel += 1;
								jingiel.data.url = src;
								ADV = new modules.jingiel(jingiel, jingielConfig());
							},
							continueAction = function(){
								advConfig = Utils.extend(config, {
									callback: checkOutQueue,
									mediaAd: {
										mediaData: Utils.clone(adv.data),
										mediaCreation: Utils.clone(adv.creation),
										mediaAdServer: adv.type === 'ima3' || adv.type === 'vpaid' ? 'RTB' : 'OAS',
										mediaAdRequest: queue === 'passbackQueue' ? 1 : 0,
										mediaAdType: adv.form,
										mediaAdBlockCount: adBlockCount,
										mediaAdBlockSegmentCount: parameters.blockSegmentCount,
										mediaAdBlockStreamSegment: adv.segment
									}
								});
								currentType = adv.type;
								ADV = new modules[adv.type](adv, advConfig);
								if (adv.type === 'bottomlayer') config.end(parameters.segmentViewed);
							};
					
						if (segmentViewed) parameters.segmentViewed += segmentViewed;
		
						if (parameters.endBreak) {
							config.end(parameters.segmentViewed);
							return;
						}
						for (var prop in mainTypes) {
							type = mainTypes[prop];
							queue = 'mainQueue';
							advQueue = advData[queue][type];
							if (advQueue && advQueue.length > 0) {
								adv = advQueue.shift();
								adv.adform = parameters.form;
							}
							if (!adv && canPlaySegment) {
								queue = 'passbackQueue';
								advQueue = advData[queue][type];
								if (advQueue && advQueue.length > 0) {
									for (var i = 0, max = advQueue.length; i < max; i++) {
										if (parameters.maxBlockSegmentCount >= parameters.segmentViewed + advQueue[i].segment) {
											adv = advData[queue][type][i];
											adv.adform = parameters.form;
											advData[queue][type] = advQueue.slice(0, i).concat(advQueue.slice(i + 1));
											break;
										}
									}
								}
							}
							if (adv) break;
						}
		
						if (adv && canPlaySegment) {
							if (parameters.jingiel === 0){
								jingielPlay("http://a.wpimg.pl/a/i/openfm/jingle-start.mp3");
							}else {
								continueAction();
							}
						} else {
							continueAction = function(){
								currentType = "";
								config.end(parameters.segmentViewed);
							};
							
							if (parameters.segmentViewed > 0 && parameters.jingiel === 1){
								jingielPlay("http://a.wpimg.pl/a/i/openfm/jingle-stop.mp3");
							}else {
								continueAction();
							}
						}
					},
										
					initAdv = function(params) {
						/*jslint browser: true*/
						/*global Utils, $, mainTypes*/
						
						var parser = function($xml) {
								'use strict';
						
								var widthString = "width",
									heightString = "height",
									gwpParametersString = "GwpParameters",
									gwpCreationParametersString = "GwpCreationParameters",
									passbackString = "Passback",
									creativeString = "Creative",
									companionAdsString = "CompanionAds",
									linearString = "Linear",
									nonLinearString = "Non" + linearString,
									clickThroughString = "ClickThrough",
									nonLinearClickThroughString = nonLinearString + clickThroughString,
						
									creativeLinearString = creativeString + ' ' + linearString,
									staticResourceString = "StaticResource",
									mediaFileString = "MediaFile",
									durationString = "Duration",
						
									advData = {
										parameters: {
											maxBlockSegmentCount: parseInt($xml.find(gwpParametersString + ' MaxVideoBlockSegmentCount').text(), 10) || parseInt($xml.find(gwpParametersString + ' MaxAudioBlockSegmentCount').text(), 10),
											blockSegmentCount: parseInt($xml.find(gwpParametersString + ' VideoBlockSegmentCount').text(), 10) || parseInt($xml.find(gwpParametersString + ' AudioBlockSegmentCount').text(), 10),
											segmentViewed: 0,
											endBreak:0,
											jingiel:-1
										},
										mainQueue: {},
										passbackQueue: {}
									},
						
									getSec = function(t) {
										if (!t) {
											return 0;
										}
										var times = t.split(':');
										return parseInt(times[0], 10) * 3600 + parseInt(times[1], 10) * 60 + parseInt(times[2], 10);
									},
						
									addParParameter = function($xml, obj) {
										/*DODATKOWE PARAMETRY DLA AFLOFARM*/
										var par = $xml.find('ParParameter'),
											o = {},
											addParString = "",
											addPar = function (str, par) {
												if (!par) return '';
												var char = 'par=',
													index = str.indexOf(char),
													hasPar = index > 0,
													escpar = escape(par);
												if (hasPar) {
													str = str.replace(char, char + escpar);
												} else {
													char = '?';
													index = str.indexOf(char);
													str = str.replace(char, char + 'par=' + escpar + '&');
												}
												return str;
											};
						
										if (par && par[0] && par[0].attributes) {
											var attr = par[0].attributes,
												pos = /\d+/.exec(obj.creation.position),
												slot = pos ? pos[0] : 42;
						
											addParString = 'campaign_id=' + obj.data.campid + '&';
											addParString += 'flash_ver=' + Utils.flash.version + '&';
											addParString += 'slot=' + slot + '&';
						
											for (var i = 0; i < attr.length; i++) {
												o[attr[i].name] = attr[i].value;
												addParString += attr[i].name + '=' + attr[i].value + "&";
											}
						
											obj.data.click = addPar(obj.data.click, addParString);
											for (var prop in obj.data.tracking) {
												var el = obj.data.tracking[prop];
												for (var i = 0; i < el.length; i++) {
													el[i] = addPar(el[i], addParString);
												}
											}
										}
									},
						
									getStartData = function($xml, type) {
										var creation = $xml.find(gwpCreationParametersString + ' Creation'),
											adSystem = $xml.find('AdSystem').text(),
											adTitle = $xml.find('AdTitle').text(),
											formName = $xml.find(gwpCreationParametersString + ' Form').eq(0).text() || 'preroll',
											form = formName.replace(' ' + passbackString, '').replace(' Audio' , ''),
											obj = {
												type: type,
												passback: formName.indexOf(passbackString) >= 0,
												form: form.toLowerCase(),
												segment: parseInt($xml.find(gwpCreationParametersString + ' SegmentCount').eq(0).text() || 1, 10),
												id: $xml.find(gwpCreationParametersString + ' Id').eq(0).text() || 0,
												creation:{adTitle:adTitle, adSystem:adSystem}
											};
										if (creation && creation[0] && creation[0].attributes) {
											var attr = creation[0].attributes;
						
											for (var i = 0; i < attr.length; i++) {
												obj.creation[attr[i].name] = attr[i].value;
											}
										}
						
										return obj;
									},
						
									parseTracking = function($xml) {
										var tracking = {};
						
										$xml.find('Impression').each(function() {
											var impression = tracking.impression = tracking.impression || [];
											impression.push($.trim($(this).text()));
										});
						
										$xml.find('TrackingEvents Tracking').each(function() {
											var name = $(this).attr('event'),
												events = tracking[name] = tracking[name] || [];
											events.push($.trim($(this).text()));
										});
										return tracking;
									},
						
									parseCommon = function($xml) {
										var $id = $xml.attr('id');
										return {
											tracking: parseTracking($xml),
											campid: $id ? $.trim($id) : ''
										};
									},
						
									parseLayer = function($p) {
										return {
											width: $p.attr(widthString),
											height: $p.attr(heightString),
											click: $.trim($p.find(nonLinearClickThroughString).text()),
											url: $.trim($p.find(staticResourceString).text())
										};
									},
						
									parse = {
										toplayer: function($xml, type) {
											var obj = getStartData($xml, type),
												$p = $xml.find(nonLinearString),
												duration = getSec($p.attr('minSuggested' + durationString));
						
											obj.data = Utils.extend({
												duration: duration
											}, parseCommon($xml), parseLayer($p));
						
											addParParameter($xml, obj);
											return obj;
										},
						
										bottomlayer: function($xml, type) {
											var obj = getStartData($xml, type),
												$p = $xml.find(nonLinearString),
												startVal = '0',
												startS = 'BottomLayerStart=',
												adParam = $xml.find('NonLinearAds AdParameters').text();
						
											if (adParam.indexOf(startS) >= 0) {
												startVal = adParam.substr(adParam.indexOf(startS) + startS.length, 2);
											}
											obj.data = Utils.extend({
												start: startVal
											}, parseCommon($xml), parseLayer($p));
						
											addParParameter($xml, obj);
						
											return obj;
										},
										audio:function($xml, type, title){
											var obj = getStartData($xml, type),
												$p = $xml.find(linearString),
												$mediaFile = $p.find(mediaFileString),
												staticResource = $xml.find(nonLinearString).find('StaticResource').text(),
												mediaFile = [];
						
											
											$mediaFile.each(function() {
												if (/mp3/.test($(this).attr('type'))){
													mediaFile.push({
														url: $.trim($(this).text()),
														type: 'mp3@avc',
														quality:''
													});
												}
											});
						
											obj.data = Utils.extend({
												adtitle: title,
												duration: getSec($p.find(durationString).text()),
												click: $.trim($p.find(clickThroughString).text()),
												type: $mediaFile.attr('type'),
												url: mediaFile
											}, parseCommon($xml));
						
											addParParameter($xml, obj);
											return obj;
										},
										preroll: function($xml, type, title) {
											var obj = getStartData($xml, type),
												$p = $xml.find(linearString),
												$mediaFile = $p.find(mediaFileString),
												staticResource = $xml.find(nonLinearString).find('StaticResource').text(),
												mediaFile = [];
						
											
											$mediaFile.each(function() {
												if (/mp4/.test($(this).attr('type'))){
													mediaFile.push({
														url: $.trim($(this).text()),
														type: /mp4/.test($(this).attr('type')) ? 'mp4@avc' : 'webm@vp8',
														quality:''
													});
												}
											});
						
											obj.data = Utils.extend({
												adtitle: title,
												duration: getSec($p.find(durationString).text()),
												skipoffset: getSec($p.attr('skipoffset')),
												click: $.trim($p.find(clickThroughString).text()),
												type: $mediaFile.attr('type'),
												url: mediaFile
											}, parseCommon($xml));
						
											if (staticResource) obj.data.advimg = staticResource;
						
											addParParameter($xml, obj);
						
											/****************************************/
											return obj;
										},
						
										ima3: function($xml, type) {
											var obj = getStartData($xml, type),
												$linear = $xml.find(creativeLinearString);
						
											obj.data = Utils.extend({
												url: $.trim($linear.find('Tag').text()),
												duration: $linear.find(durationString).text()
											}, parseCommon($xml));
						
											addParParameter($xml, obj);
											return obj;
										},
						
										vpaid: function($xml, type) {
											var obj = getStartData($xml, type);
						
											obj.data = Utils.extend({
												url: $.trim($xml.find(mediaFileString).eq(0).text()),
												duration: $xml.find(creativeLinearString).find(durationString).text()
											}, parseCommon($xml));
						
											addParParameter($xml, obj);
											return obj;
										},
						
										timesyncad: function($xml, type) {
											var obj = getStartData($xml, type),
												$p = $xml.find(nonLinearString),
												$pp = $xml.find(companionAdsString),
												flashUrl = '',
												click = '',
												clickUrls = '',
												imgUrls = '';
						
											if ($p.length > 1) {
												// wiele elementów <NonLinear><StaticResource>
												$p.each(function() {
													var $nonLinear = $(this).find(nonLinearClickThroughString),
														$staticResource = $(this).find(staticResourceString),
														$id = String($(this).attr('id')),
														num = $id.replace(/^\D+/g, ''); // numer grafiki z <NonLinear id>
													if ($id === 'main') {
														// url do pliku swf <NonLinear id="main" width="720" height="405"><StaticResource>
														flashUrl = $staticResource.text();
														click = $.trim($nonLinear.text());
													} else if ($id.indexOf('click') > -1) {
														// urle dla klików (jeśli są)
														if ($nonLinear.length) {
															clickUrls += '&' + $id + '=' + $nonLinear.text();
														}
														// urle dla obrazków (jeśli są)
														if ($staticResource.length) {
															imgUrls += '&' + 'img' + num + '=' + $staticResource.text();
														}
													}
												});
											} else {
												// tylko jeden element <NonLinear><StaticResource>
												flashUrl = $.trim($p.find(staticResourceString).text());
												click = $.trim($p.find(nonLinearClickThroughString).text());
											}
						
											obj.data = Utils.extend({
												width: $p.attr(widthString),
												height: $p.attr(heightString),
												url: flashUrl,
												click: click,
												clickUrls: clickUrls,
												imgUrls: imgUrls,
												videoUrl: $.trim($pp.find(mediaFileString).eq(0).text()),
												videoClick: $.trim($pp.find(clickThroughString).text())
											}, parseCommon($xml));
						
											addParParameter($xml, obj);
											return obj;
										}
									};
						
								$xml.find('Ad').each(function() {
									var xmlNode = $(this),
										title = xmlNode.find('AdTitle').text(),
										form = allAdvTypes.exec(title.toLowerCase())[0],
										adv = parse[form](xmlNode, form, title);
						
									if (adv) {
										var queue = adv.passback ? 'passbackQueue' : 'mainQueue',
											tadv = advData[queue][adv.form] = advData[queue][adv.form] || [];
										tadv.push(adv);
									}
								});
								return advData;
							};
						var $xml = $(params.xml),
							data = parser($xml),
							mainQueue;
		
						//uruchamianie script z OASa
						if ($xml.find('VAST>Script').length) {
							Utils.addToHead(null, null, $xml.find('VAST>Script').text());
						}
		
						advData = data;
						mainQueue = advData.mainQueue;
						
						adBlockCount = mainQueue.preroll && mainQueue.preroll.length || mainQueue.midroll && mainQueue.midroll.length || 0;
						if (!advData.parameters.endBreak) {
							config.dispatcher.private.on('END_ADV_BREAK', function() {
								advData.parameters.endBreak = 1;
							});
						}
						
						if (params.type === "midroll-audio"){
							advData.parameters.jingiel = 0;
						}
						
						config.mediaAdv(advData);
						params.callback();
						
					};
		
				return Utils.extend(api, AdvManagerInterface, {startAdv:checkOutQueue});
			};
	
		var prop,
				$target = params.target,
				$parentTarget = params.parentTarget,
				$loader = $('<div>').addClass('player-loader'),
				timeouts = {
					clipError: null
				},
				firstClip = null,
				relatedSorted = false,
				autoplay = params.forceautoplay || (Utils.isMobile ? false : params.autoplay),
				privateData = {
					target: $target,
					parentTarget: $parentTarget,
					isFirst: true,
					isLive: false,
					isExternal: false,
					isPreview: false,
					reconnectTryNr: 0,
					started: false,
					autoStarted: false,
					userStarted: false,
					isEndScreen: false,
					playing: false,
					adv: params.adv,
					advMode: false,
					advType: false,
					firstTime: true,
					hasData: false,
					canPlay: false,
					click: false,
					autoplay: autoplay,
					automute:true,
					forcesound: autoplay ? (params.forcesound || params.autosound === false) : true,
					volume: 0.75,
					tvolume: 0.75,
					quality: 0,
					offset: 0,
					// sposób uruchomienia materiału (0 click, 1 autoplay, 2 relatedAutoplay)
					mediaInit: 1,
					mediaContainerID: null,
					flashMode: 0,
					trackId: -1,
					trackTitle: "",
					videoUrl: "",
					size: {
						width: stringAuto,
						height: stringAuto
					},
					// tymczasowo dla detekcji floatingplayer
					viewed: false,
					floating: false,
					isFloatingModeActive: -1 // -1 - nieaktywowany, 1 - aktywowany, 0 - ręcznie deaktywowany
				},
				dynamicContainerName = Utils.randomString(20, false, true),
		//Utils.randomString(10),
		/* ======= GŁÓWNE KLASY ======= */
	
	
		//kontener odpowiadający za komunikację z managerem oraz userem
				fullscreen = new Fullscreen($parentTarget),
				playerDispatcher = new PlayerDispatcher(params),
				publicDispatcherApi = playerDispatcher.public,
				privateDispatcherApi = playerDispatcher.private,
	
				statsManager = new StatsManager(Utils.extend({
					params: params,
					privateData:privateData,
					dispatcher: privateDispatcherApi
				}, {})),
	
		//kontener odpowiadający za prezentację reklamy
				advManager = new AdvManager(Utils.extend({
					pid: params.pid,
					target: $target,
					parentTarget: $parentTarget,
					name: dynamicContainerName,
					dispatcher: playerDispatcher
				}, Core.advActions, statsManager)),
	
		//służy do operacjach na dancyh klipu
				materialData = new MaterialData(Utils.extend(Core.keyAction, statsManager)),
	
		//kontener odpowiadający za odtwarzanie wideo
				playerOutput = new PlayerOutput(Utils.extend({
					dispatcher: playerDispatcher
				}, params)),
	
		//kontener odpowiadający za komunikacje ze skórką
				skinManager = new SkinManager({
					target: $target,
					parentTarget: $parentTarget,
					advClass: dynamicContainerName
				}),
	
				extendedRelatedManager = new ExtendedRelatedManager({
					pid: params.pid,
					target: $target,
					parentTarget: $parentTarget,
					videoContainer: playerOutput.container,
					utils: Utils,
					dispatcher: playerDispatcher
				}),
	
				floatingPlayerManager = new FloatingPlayerManager({
					pid: params.pid,
					target: $target,
					parentTarget: $parentTarget,
					videoContainer: playerOutput.container,
					utils: Utils,
					dispatcher: playerDispatcher
				}),
	
				firstPlay = function (action) {
					if (privateData.isExternal) {
						privateData.firstTime = false;
						privateData.forcesound = false;
						playerOutput[action]();
						return;
					}
					if (privateData.firstTime) {
						Core.advActions.start('preroll');
					} else {
						if (privateData.advMode) {
							Core.advActions.setState(privateData.playing);
						} else {
							playerOutput[action]();
						}
					}
				},
				changeSize = function (e) {
					var isFS = $parentTarget.hasClass('fullscreen') || $parentTarget.hasClass('extendedfullsize'),
							data = isFS ? Config.fs : e.edata,
							w = $parentTarget[0].offsetWidth,
							h = w * 9 / 16,
							cssh = h;
	
					if (data.width !== stringAuto && data.height !== stringAuto) {
						cssh = data.height;
					}
	
					// nie ustawiamy nowych parametrow wielkosci kiedy player plywa
					if (!$parentTarget.hasClass('floating')) {
						$parentTarget.css({
							width: data.width,
							height: cssh
						});
					}
	
					if (extendedRelatedManager.isOpen() && $parentTarget.hasClass('extendedfullsize')) {
						var offset = 80,
								sh = $parentTarget[0].offsetHeight - extendedRelatedManager.getHeight() - offset * 2,
								sw = sh * 16 / 9;
						$target.css({height: sh, width: sw, top: offset});
						extendedRelatedManager.setSize({
							width: w,
							height: h,
							isFullscreen: isFS,
							playerWidth: sw,
							playerHeight: sh,
							playerTop: offset
						});
					} else {
						$target.css({height: string100, width: string100, top: 0});
						extendedRelatedManager.setSize({
							width: w,
							height: h,
							isFullscreen: isFS,
							playerWidth: w,
							playerHeight: h,
							playerTop: 0
						});
					}
	
					if ($parentTarget.hasClass('fullscreen')) {
						Core.floatingPlayerActions.closeFloatingPlayer();
					}
	
					privateData.resolution = Math.floor(w)+'x'+Math.floor(h);
					floatingPlayerManager.setSize();
	
					skinManager.setSize({width: w, height: h, isFullscreen: isFS});
					privateDispatcherApi.trigger(privateDispatcherApi.CHANGE_SIZE);
				},
	
				pushMessage = null,
				clearPushStream = function () {
					if (pushMessage) {
						pushMessage.close();
						pushMessage = null;
					}
				},
	
				updateByWebSocket = function (data) {
					if (typeof data === 'string') {
						data = JSON.parse(data);
					}
					Core.keyAction.pushmessage(data);
				},
	
				connectToPushStream = function (id) {
					var ps = Utils.urlVariable,
							thost = ps.host || 'websocket.wp.pl',
							tchannel = ps.room || (String(id) + '.b1');
	
					if (pushMessage && thost === pushMessage.host && tchannel === pushMessage.channel) {
						return;
					}
	
					if (pushMessage) {
						clearPushStream();
					}
	
					pushMessage = new PushMessage(thost, ps.port || '80', tchannel, updateByWebSocket, function (data) {
					});
				};
	
		//WYKONANIE AKCJI ODBYWA SIE W CORE
		//OUTPUT & SKIN przekierowanie akcji do odpowiednich CORE
		$.each(({
			outputActions: {
				events: OutputEvents,
				manager: playerOutput,
				clickFix: ''
			},
			skinActions: {
				events: SkinEvents,
				manager: skinManager
			},
			relatedActions: {
				events: ExtendedRelatedEvents,
				manager: extendedRelatedManager
			},
			floatingPlayerActions: {
				events: FloatingPlayerEvents,
				manager: floatingPlayerManager
			}
		}), function (key, value) {
			var events = value.events,
					manager = value.manager,
					clickFix = value.clickFix;
			for (prop in events) {
				manager.hub.on(events[prop], (function () {
					return function (event) {
						var data = event.edata,
								action = Core[key][event.type],
								runAction = function () {
									if (typeof action === 'function') {
										action(data);
									}
								};
						//if (event.type !== 'timeupdate' && event.type !== 'progress') {
						//console.log( 'runAction', key, event.type );
						//}
						if (event.type === 'click') {
							//fix podwójny klik na firefox dla kontenera flash jak i html
							if (data) {
								clickFix = setTimeout(runAction, 10);
								return;
							}
							clearTimeout(clickFix);
							clickFix = '';
						}
						runAction();
					};
				}()));
			}
		});
	
		$target.append($loader);
	
		//ZAKŁADAMY NASŁUCHY NA EVENTY UŻYTKOWNIKA (DOPIERO)
		for (var key in events) {
			var value = events[key];
			for (var i = 0, len = value.length; i < len; i += 1) {
				prop = value[i];
				publicDispatcherApi[key](prop.key, prop.fn);
			}
		}
		;
		//PLAYER MANAGER ODPALA TRIGGER JESLI WSZYSTKO SIĘ ZAINICJOWAŁO
		privateDispatcherApi.on(privateDispatcherApi.READY, Core.keyAction.ready);
		privateDispatcherApi.on(privateDispatcherApi.AUTOPLAY, Core.keyAction.autoplay);
	
		var t = '',
				altDown = false,
				targetFocused = false,
				nppdebug = function (e) {
					t += String.fromCharCode(e.keyCode);
					t = t.slice(-8).toLowerCase();
					if (t === 'nppdebug') {
						Utils.addToHead('https://getfirebug.com/firebug-lite.js#startOpened');
						$('body').prepend($('<div>').html('debug'));
					}
				};
	
		document.body.onkeyup = function (e) {
			if (e.keyCode === 18) {
				altDown = false;
			}
		}
	
		$(document).on('keydown', function (e) {
			nppdebug(e);
			if (targetFocused) {
				Core.keyAction.shortcuts(e);
			}
	
			if (e.keyCode === 13 && altDown) {
				Core.skinActions.clickBtnFullScreen();
			}
			if (e.keyCode === 18) {
				altDown = true;
			}
	
			if (e.keyCode === 27) {
				Core.relatedActions.closeExtendedFullSize();
				if (fullscreen && !fullscreen.handler && $parentTarget.hasClass('fullscreen')) {
					Core.outputActions.fullscreen();
				}
			}
		});
	
		$(document).on('mousedown', function (e) {
			targetFocused = $target[0].contains(e.target);
		});
	
		if (Utils.urlVariable.newrelated == 1) {
			params.extendedrelated = true;
		}
	
		//
		// odpalanie plywaka z urla do debugu przed wdrozeniem
		//
		if (Utils.urlVariable.floatingplayer) {
			params.floatingplayer = Utils.urlVariable.floatingplayer;
		}
	
		//
		if (params.floatingplayer) {
			privateDispatcherApi.on(privateDispatcherApi.FLOATING_PLAYER_DESTROY, Core.floatingPlayerActions.destroyFloatingPlayer);
		}
	
			//specjalnie do testów reklamy audio w stacjach radiowych
			if (Utils.urlVariable.midrollaudio == 1){
				$('body').prepend($('<button>').html('WŁĄCZ MIDROLL AUDIO').css({position:'fixed', zIndex:1000, right:0}).on('click', function(){
					Core.advActions.start('midroll-audio');
				}));
			}
	
			return {
				public: Utils.extend(publicDispatcherApi, UserInterface, DataInterface),
				private: {
					dispatcher: privateDispatcherApi,
					data: privateData,
					params: params
				}
			};
		};
	
	/*jslint browser: true*/
	/*global Utils, window*/
	
	var Config = {
		api: (function(){
			var url = 'wp.tv/player',
				cookieurl = WP.cookie.get('WPPJSON');
			if ((typeof cookieurl === 'string') && (cookieurl)){
				url = cookieurl;
			}
			return url;
		}()),
		cookie: {
			related:'WPClipsShown'
		},
		filesdir:'//a.wpimg.pl/a/i/stg/player/',
		getRelatedUrl: function () {
			return Config.filesdir + 'extendedRelated.js';
		},
		getFloatingPlayerUrl: function() {
			return Config.filesdir + 'floatingPlayer.js';
		},
		getSkin: function(isExternal) {
			var url,
				name = (window.wp_mobile || Utils.isMobile) ? "skinMobile" : "skinDefault";
	
			name = isExternal ? "skinClean" : name;
			url = Config.filesdir+name+'.js';
			return {
				url:url,
				name:name
			};
		},
		fs: {
			width: string100,
			height: string100
		},
		flash: {
			//url: '//bilbo.wp-sa.pl/player/lib/player_v2-hls-dvr.swf',
			getUrl: function(){ return Config.filesdir + 'player_v4.swf' },
			url: '//a.wpimg.pl/a/i/stg/player/4,player_v2.swf',
			id: 'WPPflash',
			handler: 'WP.player([id])'
		},
		vpaid: '//i.wp.pl/a/i/stg/player/control_ext_mod.swf',
		dashLib: '//i.wp.pl/a/i/stg/player/shaka-player.compiled.js',
		//dashLib: '//cdnjs.cloudflare.com/ajax/libs/shaka-player/2.0.0-beta2/shaka-player.compiled.debug.js',
		//dashLib: '//cdnjs.cloudflare.com/ajax/libs/shaka-player/2.0.0-beta2/shaka-player.compiled.js',
		//dashLib: '//cdnjs.cloudflare.com/ajax/libs/shaka-player/1.6.5/shaka-player.compiled.debug.js',
		//dashLib: '//cdnjs.cloudflare.com/ajax/libs/shaka-player/1.6.5/shaka-player.compiled.js',
		//dashLib: '//bilbo.wp-sa.pl/npp/dash/shaka-player.compiled.1.6.5.js',
		ima3: '//imasdk.googleapis.com/js/sdkloader/ima3.js',
		gemius: '//wp.hit.gemius.pl/gplayer.js',
		uiConfig: {
			btnplay: true,
			btnplaybig: true,
			slider: false,
			adText: 'Dzi\u0119ki reklamie ogl\u0105dasz wszystko za darmo.',
			timeMode: 'full' /*'onlyCurrentTime', 'reverse' */
		},
		live: {
			screenshot: 'http://a.wpimg.pl/a/i/stg/player/npp_live_screenshot.png'
		},
		shortcuts: {
			timeleap: 5,
			volumeleap: 0.1
		},
		options: {
			pid: null,
			id: null,
			url: null,
			title: null,
			width: stringAuto,
			height: stringAuto,
			screenshot: null,
			forcesound:false,
			autoplay: true,
			forceautoplay:false,
			hiderelated: false,
			extendedrelated: true,
			hideendscreen: false,
			loop: false,
			target: null,
			watermark: false,
			clip: null,
			related: null,
			adv: true,
			mediaEmbed: 'portalowy',
			mediaTreeId: [41],
			mediaBrandId: 4,
			sendstats:true,
			floatingplayer: false
		}
	};
	
		/*jslint browser: true, unparam: true, nomen: true*/
	/*global $, Utils, document, location*/
	
	var FeatureDetection = function() {
		'use strict';
	
		var settings,
				sSettings = {
					urls: [{url:""}],
					type:'static', //static, stream
					quality: 0,
					useHand: false,
					qualityOptions: [],
					isAudio: false,
					isFlash: false,
					isStream:false
				},
				streamTypes = {
					dash:'stream@dash',
					hlsdvr:'stream@hlsdvr',
					hls:'stream@hls',
					rtmp:'stream@rtmp'
				},
				flashVer = Utils.flash.version,
				browser = Utils.browser,
				isSsl = Utils.ssl,
	
		//ponieważ się ładnie zoptymalizuje
				isChrome = browser.isChrome,
				isIE = browser.isIE,
				isGecko = browser.isGecko,
				isOpera = browser.isOpera,
				OperaVer = browser.OperaVer,
				isWebkit = browser.isWebkit,
				isSafari = browser.isSafari,
				isMobile = browser.isMobile,
				isMac = browser.isMac,
	
				canPlayHtml = (function() {
					var prop,
							canPlay = {
								hls:isMobile,
								hlsdvr:false,
								hlsnative:isMobile,
								dash:false,
								rtmp:false,
								fla:false
							},
							types = {
								webm: 'video/webm; codecs="vp9"',
								mp4: 'video/mp4',
								mov: 'video/mov',
								ogg: 'audio/ogg',
								mp3: 'audio/mpeg',
								aac: 'audio/mp4; codecs="mp4a.40.2"',
								aacp: 'audio/aacp'
							},
							$video = document.createElement('video');
	
					for (prop in types){
						canPlay[prop] = $video.canPlayType(types[prop]) !== '';
					}
					return canPlay;
				}()),
	
				fd = (function() {
					// Feature checked support (by video tag)
					var featured = canPlayHtml,
							raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./),
							chromeVer43 = raw && parseInt(raw[2], 10) > 43 && 'Chrome PDF Viewer' in navigator.plugins,
							ieVer9 = isIE && browser.IEVer > 8,
					// Browser support
							browserOptions = {
								webm: isChrome || isGecko || isOpera || (isWebkit && !isSafari),
								mp4: ieVer9 || isChrome || isSafari,
								aac: ieVer9 || (isGecko && browser.isAtLeastWin7) || isChrome || isSafari || (isOpera && OperaVer > 12),
								mov: isGecko || isChrome || isOpera,
								fla: !isMobile && flashVer >= 10
							},
					/*kolejnosc jest wazna, bo po niej bierze pierwszy materiał*/
						supported = {
							/*live*/
							dash: (!isIE || (isMac && isSafari)) && !isMobile && !isSsl,
							hls: featured.hls || (isMac && isSafari) || browserOptions.fla,
							hlsnative: featured.hlsnative || (isMac && isSafari),
							rtmp: browserOptions.fla && !isMobile,
							hlsdvr: (!isMobile || (!isMac && !isSafari)),
							/*static video*/
							webm: browserOptions.webm && featured.webm,
							mp4: browserOptions.mp4 && featured.mp4,
							mov: browserOptions.mov,
							fla: browserOptions.fla,
							/*audio*/
							mp3: ieVer9 || isGecko || (isChrome && chromeVer43) || isSafari || (isOpera && !(OperaVer > 0 && OperaVer < 12)),
							ogg: !isIE && !isSafari,
							aac: browserOptions.aac && featured.aac,
							aacp: featured.aacp || chromeVer43
						};
	
					return Utils.extend(isMobile ? featured : supported, {order:["dash", "hls", "rtmp", "webm", "mp4", "mov", "aac", "aacp", "mp3", "fla", "ogg", "hlsdvr"]});
				}()),
	
				getTypeCont = function(str) {
					var s = str.split('@');
					return {
						cont: s[0],
						codec: s[1]
					};
				},
	
				segregateTypes = function(urlsType, type, data) {
					var codec =	type.codec,
						cont = type.cont;
					if (!urlsType[cont]) {
						urlsType[cont] = [];
					}
	
					data.detected = cont;
	
					if (codec === 'mobile') {
						urlsType[codec] = data;
					} else {
						if(settings.forcePreview) {
							if (codec === 'preview') {
								urlsType[cont].push(data);
							}
						} else{
							if (codec !== 'preview') {
								urlsType[cont].push(data);
							}
						}
					}
				},
	
				prepareClip = function(n_clipUrl, n_options) {
					var clipUrl = [],
							urlsType = {},
							qualityOptions = [];
	
					n_options = n_options || {};
	
					settings = Utils.clone(sSettings);
					settings.forcePreview = !!n_options.forcePreview;
	
					if (!n_clipUrl){
						return settings;
					}
	
					// Check if clip is a string
					if (typeof n_clipUrl === 'string') {
						var type = 'mp4',
							typesRegExp = new RegExp('mp3|ogg|flv|mp4|webm|rtmp|\.m3u8\\?DVR|\.m3u8|\.mpd'),
							specialTypes = {
								flv: 'fla',
								oga: 'ogg',
								'\.mov': 'fla',
								'.m3u8?DVR': 'hlsdvr',
								'\.m3u8': 'hls',
								'\.mpd': 'dash'
							};
	//console.log( 'TEST', typesRegExp, '.exec(', n_clipUrl,' )',typesRegExp.exec( n_clipUrl ) );
						if (typesRegExp.test(n_clipUrl)) {
							type = typesRegExp.exec(n_clipUrl)[0];
							type = specialTypes[type] || type;
						}
	
						//playery zewnętrzne
						if (/tvp.pl\/shared/.test(n_clipUrl)){
							settings.type = 'external@tvp';
						}else if (/youtube.com|youtu.be/.test(n_clipUrl)){
							settings.type = 'external@yt';
						}else if (/vimeo.com/.test(n_clipUrl)){
							settings.type = 'external@vimeo';
						}else if (/dailymotion.com/.test(n_clipUrl)){
							settings.type = 'external@dailymotion';
						}else if (/liveleak.com/.test(n_clipUrl)){
							settings.type = 'external@liveleak';
						}
						//zamiana stringa na nasz standardowy obiekt
						n_clipUrl = [{ url: n_clipUrl, quality: 'HQ', type: type }];
						if (/external/.test(settings.type)){
							settings.urls = n_clipUrl;
							return settings;
						}
					}
	
					// Loop thru each clip url
					for (var key in n_clipUrl){
						var value = n_clipUrl[key];
						// Check if clip have type
						if (value.type !== undefined) {
							segregateTypes(urlsType, getTypeCont(value.type), value);
						}
					};
	
	
					//metoda bierze pierwszy obslugiwany adres. Kolejnosc wg. zmiennej supported z fd.
					// Loop thru all urls types
					//console.log( 'ARRAY urlsType = ', urlsType);
					for (var i=0; i< fd.order.length; i++){
						var key = fd.order[i],
								urls = urlsType[key];
						//console.log( 'FOR key = fd.order[i]', key, 'urls', urls);
						if (!clipUrl.length && fd[key] && urls && urls.length) {
							clipUrl = urls;
							//console.log( 'IF !clipUrl.length -> clipUrl', clipUrl);
							// Setup variables
							settings.isAudio = 'mp3,ogg,aacp'.indexOf(key) !== -1;
							settings.isFlash = 'mov,fla,rtmp'.indexOf(key) !== -1;
	
							if (streamTypes[key]){
								settings.type = streamTypes[key];
							}
						}
					}
	
					//vp9 nie działa dla przeglądarki natywnej "internet" dla mobile
					if (isMobile && urlsType.mp4){
						clipUrl = urlsType.mp4;
					}
	
					if (!clipUrl.length && urlsType.mp4 && !fd.mp4){
						settings.isFlash = true;
						clipUrl = urlsType.mp4;
					}
	
					if (clipUrl && clipUrl[0]) {
						if (fd.rtmp && clipUrl[0].detected == 'rtmp'){
							settings.type = streamTypes.rtmp;
							settings.isFlash = true;
						}
						if (fd.hls && !fd.hlsnative && clipUrl[0].detected == 'hls') {
							settings.type = streamTypes.hls;
							settings.isFlash = true;
						}
	
						if (fd.dash && clipUrl[0].detected == 'dash') {
							settings.type = streamTypes.dash;
							settings.isFlash = false;
						}
	
						if (fd.hlsdvr && clipUrl[0].detected === 'hlsdvr' ) {
							settings.type = streamTypes.hlsdvr;
							settings.isFlash = true;
							clipUrl = urlsType.hlsdvr;
						}
					}
	
					settings.isStream = /stream/.test(settings.type) && !urlsType.mp4;
					settings.urls = isMobile && urlsType.mobile && urlsType.mobile.url ? [urlsType.mobile] : clipUrl;
	
					for (var i = 0, len = settings.urls.length; i < len; i += 1) {
						qualityOptions.push(settings.urls[i].quality);
					}
	
					settings.qualityOptions = qualityOptions;
	
					return settings;
				},
	
				overrideFeatureDetection = function(d) {
					fd.dash = d.dash || false;
				};
		return {
			getData: prepareClip,
			overrideFeatureDetection: overrideFeatureDetection
		};
	};
	
		/*jslint browser: true*/
	/*global Utils, Config, MaterialDataInterface*/
	
	var MaterialData = function(config) {
			'use strict';
			/*jslint browser: true*/
			/*global $, Utils, featureDetection, data, params, $loader, playerOutput, wp_sn, pid, options*/
			
			var MaterialDataInterface = {
				setUrl: function(value, callback) {
					var arg = __isWPTV(value);
					if (arg) {
						__getWPTVData(arg, callback);
					} else if (value && value.indexOf('tvp.pl/shared') > -1) {
						callback({
							url: value,
							mediaPlayerSource: 'TVP'
						});
					}else {
						var mid = (window.wp_sn || 'wp') + value.substr(value.lastIndexOf("/") + 1);
						if (/wrzuta.pl/.test(value)) {
							config.errorKey(51);
							return;
						}
						callback({
							url: value,
							//screenshot: params.screenshot,
							mid: mid,
							mediaPBICategory: 78,
							mediaPlayerSource: 'ARCHIWALNY'
						});
					};
				},
				setData: function(o) {
					id = o.lid || o.mid ||  '';
					data.c = o;
					data.o = this.prepareOutput(data.c.url, {forcePreview:o.forcePreview});
					data.o.isExternal = data.o.externalType || false;
					data.o.id = id;
					data.o.screenshot = data.c.screenshot;
					return this.getData();
				},
				prepareOutput: function(url, options) {
					return featureDetection.getData(url, options);
				},
				overrideFeatureDetection: function(d) {
					featureDetection.overrideFeatureDetection(d);
				},
				getData: function() {
					return Utils.clone({
						clip: data.c,
						output: data.o
					});
				},
				getRawData: function() {
					return data.c;
				},
				getOutput: function() {
					return data.o;
				},
				getId: function() {
					return id;
				},
				loadRelated: function(params, callback) {
					__getRelated(params, callback);
				},
				setRelated: function(o) {
					data.r = o;
				},
				getRelated: function() {
					return data.r;
				},
				sortRelated: function(mid, callback) {
					if (mid) {
						__sortRelated(mid, callback);
					}
				}
			};
			var data = {
				c: {},
				r: [],
				o: {}
			},
				shownRelated = [],
				cookieRelatedName = Config.cookie.related,
				id = '',
				featureDetection = new FeatureDetection(),
				
				__jsonServer = Config.api,
				__isWPTV = function(url) {
					return isWPTV(url);
				},
				__getWPTVData = function(args, callback) {
					var url = args[0],
						idName = args[1],
						id = args[2],
						preview = url.indexOf('preview=1') > 1,
						live = idName === 'lid',
						mcode = String(live ? 2 : 1),
						jsonUrl = '//' + __jsonServer + '/[name],[id],[add][view].json',
						urlOptions = {
							mid: {
								name: 'mid',
								id: id,
								add: '',
								view: 'embed'
							},
							lid: {
								name: 'lid',
								id: id,
								add: 'format,full,ts,' + Date.now() + ',',
								view: 'livestream'
							}
						},
						prop, activeOptions = urlOptions[idName];
	
					for (prop in activeOptions) {
						if (activeOptions.hasOwnProperty(prop)) {
							jsonUrl = jsonUrl.replace('[' + prop + ']', activeOptions[prop]);
						}
					}
					//wersja dla live z wpimg
					if (live) {
						jsonUrl = 'https://a.wpimg.pl/a/i/wptv3admin/livestream/' + id + 'full.json';
					}
					
					if (id){
						$.ajax({
							type: 'get',
							url: jsonUrl,
							dataType: 'json',
							timeout: 15000,
							crossDomain: true,
							error: function(xhr, type) {
								console.log('DataInterface error');
								config.sendError('2.'+mcode+'.1.'+xhr.status);
								config.errorKey(50);
								//showMessage('Problem z siecią');
							},
							success: function(data) {
								var clip = data.clip;
	
								if (typeof clip !== 'object' || !Object.keys(clip).length) {
									config.sendError('2.' + mcode + '.2');
									config.errorKey(51);
	
									//showMessage('Brak klipu');
									return;
								}
								clip.forcePreview = preview;
								callback(clip);
							}
						});
					}else {
						config.sendError('2.0.0');
						config.errorKey(50);
					}
				},
				__getRelated = function(params, callback) {
					var url = '//' + __jsonServer + '/related.json',
						vhost = document.location.hostname;
					try {
						vhost = top.document.location.host;
					} catch (e) {}
					url += '?domain=' + (params.relatedhost || vhost);
					url += '&mid=' + params.mid;
					url += '&type=' + (params.isAudio ? 'audio' : 'video');
					url += (typeof params.cid !== 'undefined') ? '&cid=' + params.cid : '';
					url += (typeof params.forcerelated === 'string') ? '&forceMids=' + params.forcerelated : '';
	
					$.ajax({
						url: url,
						type: 'get',
						dataType: 'json',
						timeout: 15000,
						crossDomain: true,
						error: function(xhr, type) {
							config.sendError('2.3.1.'+xhr.status);
							config.errorKey(52);
							callback({});
						},
						success: function(d) {
							var r = d.related;
							if (typeof r === 'object') {
								callback(r);
							} else {
								config.sendError('2.3.2');
								config.errorKey(53);
								callback([]);
							}
						}
					});
				},
				sortRelatedDataByShow = function(shownData) {
					var i, clip, tempData = [], related = data.r;
	
					if (related && related.length) {
						for (i = 0; i < related.length; i++) {
							clip = related[i];
							if (shownData.indexOf(clip.mid) !== -1) {
								tempData.push(clip);
								related[i] = null;
							} else {
							}
						}
						while (related.indexOf(null) !== -1) {
							related.splice(related.indexOf(null), 1);
						}
	
						data.r = related.concat(tempData);
					}
				},
				setShownRelated = function(mid) {
					if (shownRelated.indexOf(mid) === -1) {
						shownRelated.push(mid);
						window.WPXDCookies.setCookie(cookieRelatedName, JSON.stringify(shownRelated));
					}
					sortRelatedDataByShow(shownRelated);
				},
				__sortRelated = function(mid, callback) {
					var errorSortRelated = false,
						timeoutRelated = setTimeout(function(){
							errorSortRelated = true;
							if (callback) {
								callback();
							}
						}, 2000);
					try {
						window.WPXDCookies.getCookie(cookieRelatedName, function(data) {
							clearTimeout(timeoutRelated);
							if (errorSortRelated){
								return;
							}
							shownRelated = data.value ? JSON.parse(data.value) : [];
							setShownRelated(mid);
							if (callback){
								callback();
							}
						});
					} catch (e) {
					}
				};
	
			return Utils.extend({}, MaterialDataInterface);
		};
		/*jslint browser: true*/
	/*global  WP, Utils, document, OutputEvents*/
	
	var BaseContainer = function(params) {
			var $ = WP.player.$,
				$target = params.target,
				$hub = params.hub,
				$this = this,
				video, initialized = false,
				startData = {
					url:'',
					currentTime: 0,
					duration: 0,
					position: 0,
					buffer: 0
				},
				containerData = Utils.clone(startData),
				checkInterval, actionStack = [],
	
				api = {
					instance: $this,
					playing: false,
					volume: 1,
					position:0,
					video: '',
					type:'VOD',
					action: function(name, data) {
						if (!video || !initialized) {
							actionStack.push([name, data]);
						} else {
							var fn = video[name];
							if (typeof fn === 'function') {
								if (typeof data !== 'undefined') {
									video[name](data);
								} else {
									video[name]();
								}
							}
						}
					},
					init: function(o) {
						video = o.video;
					},
					setPoster: function(url) {
						$this.action('setPoster', url || "");
					},
					setVideo: function(url) {
						containerData = Utils.clone(startData);
						containerData.url = url;
					},
					play: function() {
						$this.action('play');
						$this.playing = true;
					},
					pause: function() {
						$this.action('pause');
						$this.playing = false;
					},
					setPosition: function(value) {
						$this.position = value;
						$this.action('setPosition', value);
					},
					getPosition: function() {
						return $this.position;
					},
					setVolume: function(value) {
						$this.volume = value;
						$this.action('setVolume', value);
					},
					getVolume:function(){
						return $this.volume;
					},
					getTime:function(){
						return containerData.currentTime;
					},
					getDuration:function(){
						return containerData.duration;
					},
					onVideoEvent: function(e, o) {
						videoEvent(e, o);
					},
					setSize: function(width, height) {},
					clear: function() {
						$this.playing = false;
						containerData = Utils.clone(startData);
					},
					destroy: function() {
	
					},
	
					hide: function() {
						$target.hide();
					},
					show: function() {
						$target.show();
					},
					useHand: function(value){
						$target.css({cursor:value ? 'pointer' : 'default'});
					},
					exitFS:function(){
						if (video.webkitExitFullScreen){
							video.webkitExitFullScreen();
						}else if (video.exitFullscreen){
							video.exitFullscreen();	
						}
					},
	
					getFrame: function(scale){
						var canvas = document.createElement("canvas");
						canvas.width = video.videoWidth * scale;
						canvas.height = video.videoHeight * scale;
						canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
						return canvas;
					}
				},
	
				checkPosition = function() {
					clearTimeout(checkInterval);
					checkInterval = setTimeout(checkPosition, 1000);
					if ($this.playing && containerData.duration > 0) {
						if (containerData.currentTime >= containerData.duration - 0.2) {
							videoEvent(OutputEvents.ended);
						}
					}
				},
	
				checkIfFrozen = function (currentTime, checks) {
					if ($this.playing === false) {
						return;
					}
	
					checks--;
	
					if (containerData.currentTime !== currentTime && checks <= 4) {
						return dispatch(OutputEvents.canplay);
					}
	
					setTimeout(function() {
						checkIfFrozen(currentTime, checks);
					}, 250);
				},
	
				dispatch = function(event) {
					var event = $.Event(event, {
						edata: containerData
					});
					event.data = containerData;
					$hub.trigger(event, containerData);
				},
	
				videoEvent = function(type, optionalData) {
	
					if (type !== 'timeupdate' && type !== 'progress' && type !== 'suspend'){
						//console.log('BaseContainer -> videoevent -> type', type);
					}
				
					if (type === "click"){
						//wyłączenie clicka flashowego
					}
									
					if ((type === 'waiting' || type === 'stalled' || type === 'suspend') && video.readyState === 2){
						if (!params.isStream){
							videoEvent('error');
						}
					}
					
					// skipping unsupported adv video spot ( mobile firefox "Mozilla/5.0 (Android 4.1.2; Mobile; rv:45.0) Gecko/45.0 Firefox/45.0" )
					/*
					if (Utils.browser.isMobile && Utils.browser.isAndroid && Utils.browser.isGecko && (type === 'waiting' || type === 'stalled' || type === 'suspend') && video.readyState === 1) {
						console.log('### ff mobile cond:', type, video.readyState);
						if (!params.isStream){
							videoEvent('error');
						}
					}*/
					
					var prop, dtype = OutputEvents[type];
					for (prop in optionalData) {
						if (typeof optionalData[prop] !== 'undefined') {
							containerData[prop] = optionalData[prop];
						}
					}
					
					if (type === 'initflash') {
						initialized = true;
						video.debug('wszystko OK!');
						while (Boolean(prop = actionStack.shift())) {
							$this.action(prop[0], prop[1]);
						}
					}
	
					if (type === 'loadeddata') {
						if (!containerData.type) {
							if (video.duration !== Infinity && video.seekable && video.seekable.length > 0) {
								containerData.type = 'VOD';
							} else {
								containerData.type = 'LIVE';
							}
	
							if ($this instanceof DASHContainer) {
								// cos sie wywalilo ze nie ma dashplayer-a - domyślnie ustawiam LIVE - TODO: zrobić dodatkową detekcję dla tego przypadku
								containerData.type = $this.dashPlayer && !$this.dashPlayer.isLive() ? 'VOD' : 'LIVE';
	
							}
							
							/*if (!Utils.isMobile || (!Utils.isSafari && !Utils.isMac)) {
								if (video.duration == Infinity && video.seekable && video.seekable.length > 0) {
									containerData.type = 'DVR';
								}
							}*/
						}
						
						
						if (/*containerData.type === 'LIVE' &&*/ params.type === 'stream@hlsdvr') {
							containerData.type = 'DVR';
						}
						
						type = containerData.type;
					}
	
					if (type === 'loadedmetadata') {
						// dla dvr - bo dla live z flasha nie leci niestety event loadeddata
	
						if (params.type === 'stream@hlsdvr') {
							containerData.type = 'DVR';
						}
	
						type = containerData.type;
	
						$this.setVolume($this.volume);
						videoEvent('progress');
						dispatch(OutputEvents.playdata);
					}
	
					if (type === "loadstart") {
						checkInterval = setTimeout(checkPosition, 1000);
					}
	
					if (type === "timeupdate" || type === "seeked") {
						prop = containerData.duration;
						if (prop) {
							containerData.position = containerData.currentTime / prop;
							$this.position = containerData.position;
						}
					}
	
					if (type === "play") {
						$this.playing = true;
						containerData.playing = true;
					}
	
					if (type === "pause") {
						$this.playing = false;
						containerData.playing = false;
					}
	
					if (type === "ended") {
						clearTimeout(checkInterval);
						$this.playing = false;
						containerData.playing = false;
					}
	
					if (dtype) {
						dispatch(dtype);
					}
	
					/*ŁATKA NA COŚ, chyba safari*/
					if (type === "seeked") {
						dispatch(OutputEvents.stalled);
	
						/** fix na niewysylajacy sie event CANPLAY w IE **/
						var checks = 8;
						checkIfFrozen(containerData.currentTime, checks);
					}
				};
	
			for (var i in api) {
				this[i] = api[i];
			}
			
			return this;
		};
		/*jslint browser: true, unparam: true, nomen: true, white: true*/
	/*global Config, BaseContainer, Utils, $, console*/
	
	var FlashContainer = function(params) {
			'use strict';
			//FlashContainer
			BaseContainer.apply(this, arguments);
	
			// NODES
			var $this = this,
				$target = params.target,
				// DATA
				video, pid = params.pid,
				config = Config.flash,
				flashId = config.id + pid,
				handler = config.handler.replace('[id]', pid),
				newUrl = false,
				// SUPER
				_super = Utils.extend({}, $this);
	
			// -- PUBLIC FUNCTIONS
			this.init = function() {
				// Create embed for given url
				Utils.flash.embed(config.getUrl(), string100, string100, 'handler=' + handler, {}, flashId, $target[0]);
				video = document[flashId];
	
				_super.init({
					video: video
				});
			};
	
			$this.setVideo = function(url) {
				//url = url.replace("pl_", "");
				_super.setVideo(url);
				$this.action('setData', url);
				newUrl = true;
			};
	
			$this.play = function() {
				//_super.setVideo(url);
				if (newUrl){
					$this.action('play');
					newUrl = false;
				}else {
					$this.action('togglePause');
				}
			};
	
			$this.destroy = function(value) {
				$('#'+flashId).remove();
			};
	
			$this.init();
			$this.instance = this;
	
			return $this;
		};
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, BaseContainer, Utils, WP, $, console*/
	
	var HTMLContainer = function(params) {
		'use strict';
		//HTMLContainer
		BaseContainer.apply(this, arguments);
	
		// NODES
		var $this = this,
			$target = params.target,
			$video = (params.preVideo || $('<video>')).css({width:string100, height:string100}),
			video = $video[0],
			$img = $('<img>').css({width:string100, height:string100}),
			// DATA
			media_events = 'loadstart progress suspend abort error emptied stalled loadedmetadata loadeddata canplay log canplaythrough playing waiting seeking seeked ended durationchange timeupdate play pause ratechange volumechange'.split(' '), // -- jslint error, should we use [] instead of string?
			videoUrl = '',
			oldVideoUrl = '',
			_super = Utils.extend({}, $this);
			$this.video = video;
			video.preload = 'none';
	
		if (Utils.browser.isOldIPhone){
			$video.css({position:'absolute', left:-4000});
			$target.append($img);
		}
			
		// -- PRIVATE FUNCTIONS
		function eventFunction(event) {
			var e = event.type,
				length = 0,
				buffer;
			
			if (e === 'progress') {
				length = video.buffered.length - 1;
				if (length >= 0) {
					buffer = video.buffered.end(length) / video.duration;
				}
			}
			if (e !== 'progress' && e !== 'timeupdate'){
				//console.log( 'HTMLContainer -> eventFunction(',event,')');
			}
	
			$this.onVideoEvent(e, {
				currentTime: video.currentTime,
				duration: video.duration || 0,
				buffer: buffer
			});
		}
	
		// -- PUBLIC FUNCTIONS
		$this.init = function() {
			// Add video to target
			$target.append(video);
			// Use init from super
			_super.init({
				video: video
			});
		};
	
		$this.action = function(name, data) {
			var fn = video[name];
			if (typeof fn === 'function') {
				if (data) {
					video[name](data);
				} else {
					video[name]();
				}
			}
		};
	
		$this.setPoster = function(url) {
			if (url){
				video.setAttribute('poster', url);
			}else {
				video.removeAttribute('poster');
			}
			$img.attr({src:url});
		};
	
		$this.setVideo = function(url) {
			var i = 0,
				len = media_events.length;
		
			for (i; i < len; i += 1) {
				$video.off(media_events[i], eventFunction);
				$video.on(media_events[i], eventFunction);
			}
			
			_super.setVideo(url);
			if (/.mp4/.test(url)){
				video.setAttribute('type', 'video/mp4');
			}else if (/.webm/.test(url)){
				video.setAttribute('type', 'video/webm');
			}else {
				video.removeAttribute('type');
			}
			videoUrl = url;
		};
	
		$this.play = function(url) {
			if (videoUrl){
				if (!video.readyState || oldVideoUrl !== videoUrl){
					video.setAttribute('src', videoUrl);
					oldVideoUrl = videoUrl;
					video.load();
				}
			}
			video.play();
		};
		
		$this.playAndLoad = function(url) {
			if (videoUrl){
				video.setAttribute('src', videoUrl);
				video.load();
				video.play();
			}
		};
	
		$this.setPosition = function(value) {
			try {
			var duration = video.duration,
				len = Math.max(video.seekable.length - 1, 0),
				minPoz = video.seekable.start(len),
				maxPoz = video.seekable.end(len);
			}catch(e){};
			$this.position = value;
			if (video.seekable.length){
				video.currentTime = Math.max(Math.min(parseInt(Math.min(value * duration, duration), 10), maxPoz), minPoz);
			}
		};
		
		$this.setVolume = function(value) {
			_super.setVolume(value);
			video.volume = value;
		};
	
		$this.clear = function() {
			var i = 0,
				len = media_events.length;
	
			for (i; i < len; i += 1) {
				$video.off(media_events[i], eventFunction);
			}
	
			oldVideoUrl = '';
			video.pause();
			video.load('');
			_super.clear();
			video.removeAttribute('src');
		};
				
		$this.destroy = function() {
			var i = 0,
				len = media_events.length;
			for (i; i < len; i += 1) {
				$video.off(media_events[i]);
			}
			video.pause();
			video.removeAttribute('src');
			video.load();
			$video.remove();
		};
	
		$this.eventFunction = eventFunction;
		$this.init();
		$this.instance = $this;
	
		return $this;
	};
	
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, BaseContainer, Utils, WP, PushMessage, $, OutputEvents, document, console*/
	
	var BaseExternalContainer = function(params) {
			'use strict';
			
			BaseContainer.apply(this, arguments);
			
			var $this = this,
				$target = params.target,
				messanger,firstStart = true,
				initialized = false,
				waitingQueue = [],
				container = document.createElement("iframe"),
				_super = Utils.extend({}, $this),
			// NODES
			// -- PRIVATE FUNCTIONS
			
				events = function (event){
					switch(event){
						case "INITIALIZED":
							_super.onVideoEvent("canplay");
							break;
						case "PLAYING":
							if (firstStart){
								firstStart = false;
								_super.onVideoEvent("loadedmetadata");
							}
							_super.onVideoEvent("play");
							_super.onVideoEvent("playing");
							break;
						case "PAUSED":
							_super.onVideoEvent("pause");
							break;
						case "DONE":
							_super.onVideoEvent("ended");
							break;
					}
				},
						
				onLoaded = function () {
					var queue;
					messanger = this.contentWindow;
					for (var i = 0; i < waitingQueue.length; i++) {
						queue = waitingQueue[i];
						if (queue.source === true || queue.source == messanger){
							if (queue.data === "INITIALIZED"){
								events(queue.data);
							}else {
								setAction(queue.data);
							}
						}
					}
				},
						
				onMessage = function (name, source) {
					if (name === "INITIALIZED" && !messanger) {
						waitingQueue.push({
							data: name,
							source: source
						});
					}else if (messanger == source){
						events(name);
					}
				},
				
				setAction = function (action, source) {
					if (messanger) {
						messanger.postMessage(action, "*");
					} else {
						waitingQueue.push({
							data: action,
							source: source
						});
					}
				};
				
			// -- PUBLIC FUNCTIONS
			container.width = string100;
			container.height = string100;
			container.frameBorder = 0;
			container.scrolling = "no";
			container.horizontalscrolling = "no";
			container.verticalscrolling = "no";
	
			container.setAttribute('webkitallowfullscreen', '');
			container.setAttribute('mozallowfullscreen', '');
			container.setAttribute('allowfullscreen', '');
			
			$target.append(container);
			
			container.onload = onLoaded;
			
			$this.container = container;
			$this.events = events;
			$this.onMessage = onMessage;
			$this.setVideo = function(url) {
				container.src = url;
			};
			$this.play = function() {
				setAction('PLAY', true);
			};
			$this.pause = function() {
				setAction('PAUSE', true);
			};
				
			$this.destroy = function() {
				_super.destroy();
			};
			
			$this.clear = function() {
			};
			
			$this.instance = $this;
			return $this;
		};
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, BaseContainer, Utils, WP, PushMessage, $, OutputEvents, document, console*/
	
	var DailymotionContainer = function(params) {
			'use strict';
			
			BaseExternalContainer.apply(this, arguments);
			
			var $this = this,
				_super = Utils.extend({}, $this),
				baseUrl = "http://www.dailymotion.com/embed/video/",
			// NODES
	
			// -- PRIVATE FUNCTIONS
				onMessage = function (e) {
					_super.onMessage(e.data, e.source);
				};
			// -- PUBLIC FUNCTIONS
			
			window.addEventListener('message', onMessage, false);
	
			$this.setVideo = function(url) {
				var ex = /^.+dailymotion.com(\/embed|)?\/((video|hub)\/([^_]+))?[^#]*(#video=([^_&]+))?/.exec(url),
					id = ex && (ex[6] || ex[4]);
				_super.setVideo(baseUrl+id);
			};
			
			$this.instance = $this;
			return $this;
		};
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, BaseContainer, Utils, WP, PushMessage, $, OutputEvents, document, console*/
	
	var LiveleakContainer = function(params) {
			'use strict';
			
			BaseExternalContainer.apply(this, arguments);
			
			var $this = this,
				_super = Utils.extend({}, $this),
				baseUrl = "http://www.liveleak.com/ll_embed?f=",
			// NODES
	
			// -- PRIVATE FUNCTIONS
				onMessage = function (e) {
					_super.onMessage(e.data, e.source);
				};
			// -- PUBLIC FUNCTIONS
			
			window.addEventListener('message', onMessage, false);
	
			$this.setVideo = function(url) {
				var ex = /^.+liveleak.com\/.*(f|i)=([\w]+)/.exec(url),
					id = ex && ex[2];
				_super.setVideo(baseUrl+id);
			};
			
			$this.instance = $this;
			return $this;
		};
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, BaseContainer, Utils, WP, PushMessage, $, OutputEvents, document, console*/
	
	var TvpContainer = function(params) {
			'use strict';
			
			BaseExternalContainer.apply(this, arguments);
			
			var $this = this,
				$hub = params.hub,
				$target = params.target,
				is_muted = true,//params.is_muted || false,
				allowfullscreen = params.allowfullscreen === false ? false : true,
				_super = Utils.extend({}, $this),
			// NODES
	// 
			// -- PRIVATE FUNCTIONS
				onMessage = function (e) {
					_super.onMessage(e.data, e.source);
				};
			// -- PUBLIC FUNCTIONS
			
			window.addEventListener('message', onMessage, false);
			
			$this.setVideo = function(url) {
				_super.setVideo(url + '&autoplay=' + false + '&allowfullscreen=' + allowfullscreen + '&is_muted=' + is_muted);
			};
			$this.play = function() {
				_super.play();
			};
			$this.pause = function() {
				_super.pause();
			};
				
			$this.destroy = function() {
				_super.destroy();
			};
			
			$this.clear = function() {
			};
			
			$this.instance = $this;
			return $this;
		};
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, BaseContainer, Utils, WP, PushMessage, $, OutputEvents, document, console*/
	
	var VimeoContainer = function(params) {
			'use strict';
			
			BaseExternalContainer.apply(this, arguments);
			
			var $this = this,
				_super = Utils.extend({}, $this),
				baseUrl = "https://player.vimeo.com/video/",
			// NODES
	// 
			// -- PRIVATE FUNCTIONS
				onMessage = function (e) {
					_super.onMessage(e.data, e.source);
				};
			// -- PUBLIC FUNCTIONS
			
			window.addEventListener('message', onMessage, false);
	
			$this.setVideo = function(url) {
				var ex = /(videos|video|channels|\.com)\/([\d]+)/.exec(url),
					id = ex && ex[2];
				_super.setVideo(baseUrl+id);
			};
			
			$this.instance = $this;
			return $this;
		};
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, BaseContainer, Utils, WP, PushMessage, $, OutputEvents, document, console*/
	
	var YTContainer = function(params) {
			'use strict';
			
			BaseExternalContainer.apply(this, arguments);
			
			var $this = this,
				_super = Utils.extend({}, $this),
				baseUrl = "https://www.youtube.com/embed/",			player,
			// NODES
	
			// -- PRIVATE FUNCTIONS
				onPlayerReady = function (){
					_super.events('INITIALIZED');
				},
				onPlayerStateChange = function (event){
					if (event.data === YT.PlayerState.PLAYING){
						_super.events('PLAYING');
					}else if (event.data === YT.PlayerState.PAUSED) {
						_super.events('PAUSED');
					}else if (event.data === YT.PlayerState.ENDED) {
						_super.events('DONE');
					}
	
				};
			// -- PUBLIC FUNCTIONS
	
			_super.container.setAttribute('id', 'YT'+params.pid);
	
			window.onYouTubeIframeAPIReady = function() {
				player = new YT.Player('YT'+params.pid, {
					events: {
						'onReady': onPlayerReady,
						'onStateChange': onPlayerStateChange
					}
				});
			};
	
			$this.setVideo = function(url) {
				var ex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/.exec(url),
					id = ex && ex[1];
	
				_super.setVideo(baseUrl + id+'?enablejsapi=1&origin='+window.location.protocol+'//'+window.location.host);
	
				if (!window.YT || !window.YT.Player) {
					Utils.addToHead('https://www.youtube.com/iframe_api');
				}
			};
			
			$this.instance = $this;
			return $this;
		};
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, FlashContainer, VodContainer, Utils, WP, PushMessage, $, OutputEvents, console*/
	
	var ExternalContainer = function(params) {
		'use strict';
	
		var type = params.type.split('@')[1];
		if (type === 'tvp'){
			return TvpContainer
		}else if (type === 'yt'){
			return YTContainer;
		}else if (type === 'vimeo'){
			return VimeoContainer;
		}else if (type === 'dailymotion'){
			return DailymotionContainer;
		}else if (type === 'liveleak'){
			return LiveleakContainer;
		}
	};
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, FlashContainer, VodContainer, Utils, WP, PushMessage, $, OutputEvents, console*/
	
	var StaticContainer = function(params) {
		'use strict';
	
		if (params.isFlash){
			return FlashContainer;
		}else {
			return HTMLContainer;
		}
	};
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, FlashContainer, VodContainer, Utils, WP, PushMessage, $, OutputEvents, console*/
	
	var StreamContainer = function(params) {
		'use strict';
		if (params.type === 'stream@dash'){
			return DASHContainer;
		}else if (params.type === 'stream@hls' || params.type === 'stream@hlsdvr' ){
			return HLSContainer;
		}else if (params.type === 'stream@rtmp'){
			return RTMPContainer;
		}
	};
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, BaseContainer, Utils, WP, $, console*/
	
	var DASHContainer = function(params) {
	    'use strict';
	
	    HTMLContainer.apply(this, arguments);
	
		// NODES
	    var $this = this,
			tryToPlay = 0,
			dashApiLoadStatus,
			dashPlayer = null,
			videoUrl = '',
			oldVideoUrl = '',
			_super = Utils.extend({}, $this),
			video = _super.video;
			
		$this.checkBrowserSupport = function() {
			shaka.Player.support().then(function(support) {
				if (support.supported) {
					$this.init();
				} else {
					// This browser does not have the minimum set of APIs we need.
					//console.log('Browser not supported!');
					// nadpisanie fd z dash na false w featureDetection
					$this.onVideoEvent('overridebrowsersupport');
					// Core -> fallback -> reload kontenera na inny
					//$this.onDashError();
					// test
				}
			});
		};
		
		$this.init = function() {
			if (dashPlayer === null) {
				$this.dashPlayer = dashPlayer = new shaka.Player(video);
				dashPlayer.addEventListener('error', $this.onDashError);
			}
			if (tryToPlay === 1) {
				// była próba play przed załadowaniem liba dash - zerujemy flagę tryToPlay
				tryToPlay = 0;
				$this.play();
			}
		};
		
		$this.onDashError = function(e) {
	//console.log( 'Dash.onDashError', e);
			$this.onVideoEvent('error');
		};
		
		$this.setVideo = function(url) {
			_super.setVideo(url);
			videoUrl = url;
		};
	
		$this.play = function(url) {
			if (!window.shaka) {
				// próba uruchomienia bez wczytanego dash api - czekamy na onload
				tryToPlay = 1;
				return;
			}
			if (videoUrl && (videoUrl !== oldVideoUrl)) {
				// url video się zmienił
				oldVideoUrl = videoUrl;
				
				if (dashPlayer) {
					video.autoplay = true;
					$this.checkUrl( videoUrl );
					//dashPlayer.load( videoUrl );
				}
			}
			else {
				video.play();
			}
		};
	
		$this.checkUrl = function(url) {
			$.ajax({
				url: url,
				success: function() {
					if (dashPlayer) {
						dashPlayer.load( videoUrl );
					}
				},
				error: function() {
					videoUrl = oldVideoUrl = '';
					$this.onVideoEvent('error');
				}
			});
		};
	
		$this.pause = function() {
			if (dashPlayer) {
				video.pause();
				video.autoplay = false;
			}
		};
	
		$this.destroy = function() {
			if (dashPlayer) {
				dashPlayer.removeEventListener('error', $this.onDashError);
				dashPlayer.destroy();
				dashPlayer = null;
			}
			_super.destroy();
		};
	
		$this.clear = function(){
			oldVideoUrl = '';
			if (dashPlayer) {
				video.autoplay = true;
				dashPlayer.load('');
			}
			_super.clear();
		};
	
		$this.loadDashLib = function(url) {
			if (typeof dashApiLoadStatus !== 'undefined') {
				return;
			}
			var onLoad = function() {
				dashApiLoadStatus = 'loaded';
				$this.checkBrowserSupport();
			};
			Utils.addToHead(url, onLoad);
		};
		
		
		if (typeof window.shaka !== 'undefined') {
			// api dostępne
			$this.init();
		}
		else {
			// brak api
			// sprawdzenie czy skrypt jest w trakcie ładowania
			if (typeof dashApiLoadStatus === 'undefined') {
				// nie było próby ładowania - load
				$this.loadDashLib(Config.dashLib);
				dashApiLoadStatus = 'loading';
			}
		}
		
		$this.dashPlayer = null;
		$this.instance = $this;
		return $this;
	};
	
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, FlashContainer, VodContainer, Utils, WP, PushMessage, $, OutputEvents, console*/
	
	var HLSContainer = function(params) {
			'use strict';
			
			if (params.isFlash){
				FlashContainer.apply(this, arguments);
			}else {
				HTMLContainer.apply(this, arguments);
			}
			var $this = this,
				isPlayingTestTimeout,
				wrongTimeTestCount = 0,
				forcePreview = params.forcePreview,
				oldTime,
				$logo = $('<div>').addClass('player-wplive'),
				_super = Utils.extend({}, $this),
				video = _super.video;
	
			// NODES
			// -- PRIVATE FUNCTIONS
	
			// -- PUBLIC FUNCTIONS
			/* //dla FREEZZa na safari przy zwykłych relacjach
			function updateTime(){
				clearTimeout(isPlayingTestTimeout);
				isPlayingTestTimeout = setTimeout(updateTime, 1000);
				if (oldTime === _super.video.currentTime){
					wrongTimeTestCount += 1;
				}
				if (wrongTimeTestCount > 3){
					console.log('wrongTimeTestCount', wrongTimeTestCount);
					$this.play();
				}
				oldTime = _super.video.currentTime;
			}*/
	
			_super.eventFunction = function(event) {
				var e = event.type,
					length = 0,
					buffer,
					duration;// = (video.duration !== Infinity) ? video.duration : video.seekable.end( Math.max(video.seekable.length - 1, 0) );
	
				if (video.duration !== Infinity) {
					duration = video.duration;
				}
	
				else {
					if (video.seekable.length > 0) {
						duration = video.seekable.end( Math.max(video.seekable.length - 1));
					}
					else {
						duration = 0;
					}
				}
	
				if (e === 'progress') {
					length = video.buffered.length - 1;
					if (length >= 0) {
						buffer = video.buffered.end(length) / duration;
					}
				}
				if (e !== 'progress' && e !== 'timeupdate'){
					//console.log(e, video);
				}
				if (e === 'loadeddata') {
					//if (!containerData.type) {
						//console.log('HLSCONTAINER -> eventFunction $this.type', $this.type, e);
					//}
				}
				_super.onVideoEvent(e, {
					currentTime: video.currentTime,
					duration: duration || 0,
					buffer: buffer
				});
			}
	
			
			if (!params.isFlash){
				$this.play = function() {
					oldTime = 0;
					wrongTimeTestCount = 0;
					//updateTime();
					if ($this.type === "LIVE"){
						_super.playAndLoad();
					}else {
						_super.play();
					}
				};
	
				$this.pause = function() {
					clearTimeout(isPlayingTestTimeout);
					_super.pause();
				};
				
				$this.setPosition = function(value) {
					try {
					//var duration = video.duration,
					var len = Math.max(video.seekable.length - 1, 0),
						duration = (video.duration !== Infinity) ? video.duration : video.seekable.end(len),
						minPoz = video.seekable.start(len),
						maxPoz = (video.duration !== Infinity) ? video.seekable.end(len) : video.seekable.end(len) ;
					}catch(e){};
	
					$this.position = value;
	
					if (video.seekable.length){
						video.currentTime = Math.max(Math.min(parseInt(Math.min(value * duration, duration), 10), maxPoz), minPoz);
					}
				};
			}
			
	
			$this.destroy = function() {
				clearTimeout(isPlayingTestTimeout);
				$logo.remove();
				_super.destroy();
			};
			
			$this.clear = function() {
				clearTimeout(isPlayingTestTimeout);
				_super.clear();
			};
			
			$this.instance = $this;
	
			if (!forcePreview){
				$logo.appendTo(params.target);
			}
	
	
			return $this;
		};
		/*jslint browser: true, unparam: true, nomen: true, white: true, plusplus: true*/
	/*global Config, FlashContainer, VodContainer, Utils, WP, PushMessage, $, OutputEvents, console*/
	
	var RTMPContainer = function(params) {
		'use strict';
	
		HLSContainer.apply(this, arguments);
	
		var $this = this,
			_super = Utils.extend({}, $this);
	
		$this.instance = this;
	
		return $this;
	};
		var OutputEvents = {
		pause: 'pause',
		seeked: 'seeked',
		seeking: 'seeking',
		timeupdate: 'timeupdate',
		progress: 'progress',
		playdata: 'playdata',
		
		trackid: 'trackid',
		stalled: 'stalled',
		playing: 'playing',
		waiting: 'waiting',
		canplay: 'canplay',
		canplaythrough: 'canplay',
		error: 'error',
		loadedmetadata: 'loadedmetadata',
		loadeddata: 'loadeddata',
		overridebrowsersupport: 'overridebrowsersupport',
		play: 'play',
		ended: 'ended',
		clear: 'clear',
	
		click: 'click',
		flasherror: 'flasherror',
	
		flashblocked: 'flashblocked',
		flashunblocked: 'flashunblocked'
	};
		/*jslint browser: true*/
	/*global Utils, PlayerOutputInterface*/
	
	var PlayerOutput = function(params) {
			var pid = params.pid,
				$target = params.target,
				$container = $('<div>'),
				output,
				volume, 
				initParams = {
					pid: pid,
					width: params.width,
					height: params.height,
					muted: params.is_muted || params.muted,
					allowfullscreen: params.allowfullscreen,
					target: $container,
					hub: $container,
					dispatcher:params.dispatcher
				},
				setOutput = function(container, data) {
					var containerClass = container(data);
					if(output && !(output.instance instanceof containerClass)) {
						output.destroy();
						output = null;
					};
					if(!output) {
						initParams.id = data.id;
						initParams.type = data.type;
						initParams.isStream = data.isStream;
						initParams.isFlash = data.isFlash;
						initParams.forcePreview = data.forcePreview;
						initParams.preVideo = params.preVideo;
						output = new containerClass(initParams);
					}
				},
				getUrl = function(simpleData) {
					var simpleUrls = simpleData.urls,
						quality = simpleData.quality,
						testedUrl = simpleUrls[quality].url,
						testedBalance = String(simpleUrls[quality].balance),
						url, urls;
	
					//quality = Math.max(0, Math.min(quality, simpleData.length - 1));
					//służy do rozdzielania ruchu pomiędzy warszawa a gdańskiem, taki loadbalancer
					if(typeof testedUrl === 'object') {
						if(!testedBalance) {
							url = testedUrl[Math.floor(Math.random() * testedUrl.length)];
						} else {
							var tbalance = testedBalance.split('/'),
								mbalance = 0,
								random = Math.random(),
								i = 0,
								bsum = 0,
								max = testedUrl.length - 1;
	
							for(i = 0; i < tbalance.length; i++) {
								mbalance += Number(tbalance[i]);
							}
	
							for(i = 0; i < tbalance.length; i++) {
								bsum += Number(tbalance[i]);
								if(random * mbalance < bsum) break;
							}
							url = testedUrl[Math.min(i, max)];
						}
						urls = testedUrl;
						return url;
					}
					urls = testedUrl;
					return testedUrl;
				};
	
				$container.css({
					width: string100,
					height: string100
				});
			$target.append($container);
	
			/*jslint browser: true*/
	
			/*global featureDetection, TvpContainer, FlashContainer, LiveContainer, VodContainer, output*/
	
			
	
			var PlayerOutputInterface = {
	
				activeVideoUrl: '',
	
				width: stringAuto,
	
				height: stringAuto,
	
				container:$container,
	
				setMaterial: function(data) {
	
					var $this = this;
	
					$this.activeVideoUrl = getUrl(data);
	
					if (/external/.test(data.type)) {
	
						setOutput(ExternalContainer, data);
	
					} else if (/stream/.test(data.type)) {
	
						setOutput(StreamContainer, data);
	
					}else if (/static/.test(data.type)) {
	
						setOutput(StaticContainer, data);
	
					}
	
					
	
					output.useHand(Boolean(data.useHand));
	
					output.setSize($this.width, $this.height);
	
					output.setVideo($this.activeVideoUrl);
	
					output.setPoster(data.screenshot);
	
					if (volume !== undefined){
	
						output.setVolume(volume);
	
					}
	
				},
	
				setPosition: function(value) {
	
					output.setPosition(value);
	
				},
	
				getPosition: function() {
	
					return output.getPosition();
	
				},
	
			
	
				getTime:function(){
	
					return output ? output.getTime() : 0;
	
				},
	
			
	
				getDuration:function() {
	
					return output ? output.getDuration() : 0;
	
				},
	
			
	
				setVolume: function(value) {
	
					volume = value;
	
					if (output){
	
						output.setVolume(value);
	
					}
	
				},
	
				getVolume: function() {
	
					return output.getVolume();
	
				},
	
				
	
				play: function() {
	
					if (output){
	
						output.play();
	
					}
	
				},
	
				pause: function() {
	
					if (output){
	
						output.pause();
	
					}
	
				},
	
				togglePause: function() {
	
					if (output.playing) {
	
						output.pause();
	
					} else {
	
						output.play();
	
					}
	
				},
	
			
	
				hide:function(){
	
					output.hide();
	
				},
	
				show:function(){
	
					output.show();
	
				},
	
			
	
				getUrl:function (){
	
					return this.activeVideoUrl;
	
				},
	
				
	
				setSize: function(width, height) {
	
					PlayerOutputInterface.width = width;
	
					PlayerOutputInterface.height = height;
	
					if (output) {
	
						output.setSize(width, height);
	
					}
	
				},
	
			
	
				clear: function() {
	
					if (output){
	
						output.clear();
	
					}
	
				},
	
				destroy: function() {
	
					if (output){
	
						output.clear();
	
						output.destroy();
	
						output = null;
	
					}
	
				},
	
				
	
				exitFS:function(){
	
					if (output){
	
						output.exitFS();
	
					}
	
				},
	
			
	
				getFrame: function(scale) {
	
					if (output) {
	
						return output.getFrame(scale);
	
					}else {
	
						return false;
	
					}
	
				},
	
				onVideoEvent: function(e, o) {
	
					if (output){
	
						output.onVideoEvent(e, o);
	
					}
	
				}
	
			};
	
			
			var obj = Utils.extend({
				hub: $container
			}, PlayerOutputInterface);
			return obj;
		};
	
	/*jslint browser: true*/
	/*global $, Utils, PlayerManagerInterface */
	/*
	 * 
	 * Zarządza instancjami playera, obsługuje autoplay itp.
	 */
	
	var PlayerManager = (function PlayerManager() {
		if (this instanceof PlayerManager) {
			return new PlayerManager();
		}
		/*jslint browser: true*/
		/*global list, privateList*/
		var PlayerManagerInterface = {
			reset: function() {},
			clear: function() {},
			stopAll: function() {},
			registerPlayer: function(player, privateData) {
				var dispatcher = privateData.dispatcher;
				list.push(player);
				privateList.push(privateData);
		
				dispatcher.on(dispatcher.DESTROY, destroy);
				dispatcher.on(dispatcher.TRYTOPLAY, trytoplay);
				dispatcher.on(dispatcher.CHANGE_STATE, changeState);
				dispatcher.on(dispatcher.FLOATING_ANOTHER_PLAYER_DESTROY, destroyActiveFloatingInstance);
		
				if (privateData.data.autoplay && !privateData.params.forceautoplay){
					var onDChange = function (e){
						if (e.type === 'resize'){
							dispatcher.trigger(dispatcher.CHANGE_SIZE);
						}
						//ograniczenie ilosci resizów
						clearTimeout(scrollTimeout);
						scrollTimeout = setTimeout(onScrollUpdate, 10);
					}
		
					$(window).on('scroll resize', onDChange);
				}
			
				dispatcher.trigger(dispatcher.READY);
			},
			getPlayer: function(id) {
				return list[id] || false;
			}
		};
		var $this = this,
			list = [],
			privateList = [],
			scrollTimeout,
			$window = $(window),
			started = false,
			isEndScreen = false,
			//flagi dla playera plywajacego
			isAnyfloating = false, // flaga czy jakakolwiek instancja jest w trybie floating
	
			destroy = function(e){
				var data = e.edata,
					pid = data.pid;
	
				privateList[pid] = false;
				list[pid] = false;
	
				changeState();
				data.target.remove();
			},
	
			changeState = function(e) {
				var numberOfPlayingPlayers = 0;
				for (var i = 0, len = privateList.length; i < len; i += 1) {
					var player = list[i];
					if (player) {
						if (privateList[i].data.started){
							numberOfPlayingPlayers += 1;
						}
					}
				}
	
				started = !!numberOfPlayingPlayers;
			},
	
			trytoplay = function(e){
				changeState();
				var edata = e && e.edata,
					dispatcher;
	
				if (edata && edata.forceautoplay){
					started = true;
					dispatcher = privateList[edata.pid].dispatcher;
					dispatcher.trigger(dispatcher.AUTOPLAY);
				}
				onScrollUpdate();
				//checkPlay();
			},
	
			onScrollUpdate = function() {
				checkPlay();
				checkFloat();
			},
	
			checkPlay = function() {
				var isEndScreen = false,
					canplay = false,
					$target, dispatcher, privateData, scrollTop = $window.scrollTop(),
					scrollHeight = $window.height(),
					scrollMax,
					visible = false,
					height = -1,
					top = -1;
	
				scrollMax = scrollTop + scrollHeight;
				if (started) {
					return;
				};
	
				for (var i = 0, len = privateList.length; i < len; i += 1) {
					if (privateList[i]) {
						privateData = privateList[i].data;
						$target = privateData.target;
						dispatcher = privateList[i].dispatcher;
						//if (top === -1) {
							top = $target.offset().top;
							height = $target.height();
						//}
						visible = (top + height * .3 > scrollTop) && (top + height * .7 < scrollMax);
						if (privateData.isEndScreen) {
							isEndScreen = true;
						}
						if (privateData.autoplay && !privateData.started && !privateData.canPlay && visible) {
							canplay = true;
							break;
						}
					}
				}
	
				if (canplay && !isEndScreen) {
					started = true;
					dispatcher.trigger(dispatcher.AUTOPLAY);
				}
			},
	
			/**
			 * sprawdzenie kazdej instancji czy moze floatowac
			 */
			checkFloat = function() {
				var canFloat = false,
					isAnyfloating = false,
					$target, dispatcher, privateData, scrollTop = $window.scrollTop(),
					visible = false,
					height = -1,
					top = -1,
					prList;
	
				for (var i = 0, len = privateList.length; i < len; i += 1) {
					prList = privateList[i];
					if (prList) {
						// iteracja po instancjach playera
						privateData = prList.data;
						$target = privateData.parentTarget.parent();
						dispatcher = prList.dispatcher;
						top = $target.offset() && $target.offset().top || 0;
						height = $target.height();
						// playera floatujemy tylko gdy jest poniżej swojej oryginalnej pozycji kontenera
						visible = (top + height > scrollTop);
	
						if (privateData.floating) {
							isAnyfloating = true;
						}
						if (!visible) {
							// player niewidoczny -> floatujemy
							if (prList.params.mediaEmbed !== 'modliszka' && !privateData.isExternal && !isAnyfloating && privateData.isFloatingModeActive !== 0 && !privateData.floating && privateData.viewed && privateData.started ) {
								canFloat = true;
								break;
							}
						} else {
							// player widoczny -> wyl float
							if (!privateData.viewed) {
								privateData.viewed = true;
							}
							if (privateData.floating) {
								canFloat = false;
								dispatcher.trigger('closeFloatingPlayer');
							}
						}
						if (privateData.isFloatingModeActive !== 0 && canFloat) {
							dispatcher.trigger('openFloatingPlayer');
						}
					}
				}
			},
			/**
			 * zamkniecie floatujacego playera po recznym uruchomieniu innej instancji playera
			 * dispatchowane z Core.keyAction.togglepause lub przycisku zamknij z floatingPlayer.js
			 */
			destroyActiveFloatingInstance = function() {
				var privateData,
					dispatcher;
				for (var i = 0, len = privateList.length; i < len; i += 1) {
					//privateList[i].data.started = false;
					privateData = privateList[i].data;
					dispatcher = privateList[i].dispatcher;
					if (privateList[i] && privateData.floating) {
						dispatcher.trigger('destroyFloatingPlayer');
					}
				}
			};
	
		//zwrócenie metod dostępnych dla tego Interfejsu
		return Utils.extend({
			list: list
		}, PlayerManagerInterface);
	}());
	
	/*jslint browser: true*/
	/*global ExtendedRelatedManagerInterface*/
	/*
	 * Zarządza skórkami playera itp.
	 * options {object} options.node
	 */
	
	
	var ExtendedRelated,
		ExtendedRelatedEvents = {
			closeExtendedFullSize: 'closeExtendedFullSize',
			clickRelatedItem: 'clickRelatedItem',
			showRelated: 'showRelated',
			hideRelated: 'hideRelated'
		},
		ExtendedRelatedManager = function(options) {
	
			/*jslint browser: true*/
	
			/*global uiConfig, ExtendedRelatedManager */
	
			
	
			var ExtendedRelatedManagerInterface = {
	
				// settery na instancji skina
	
				/* data action */
	
				setData: function(data) {
	
					Utils.extend(dataState, data);
	
					Utils.extend(dataState.data, data.data);
	
					action('setData', dataState, true);
	
				},
	
				setSize: function(data) {
	
					action('setSize', data, true);
	
				},
	
				setOpen: function(data) {
	
					action('setOpen', data, true);
	
				},
	
				setActiveClip: function(data) {
	
					action('setActiveClip', data, true);
	
				},
	
				isOpen: function() {
	
					return instance ? instance.isOpen() : false;
	
				},
	
				isChanged: function() {
	
					return instance ? instance.isChanged() : false;
	
				},
	
				getHeight: function() {
	
					return instance ? instance.getHeight() : 0;
	
				},
	
				getPreviousOpen: function() {
	
					return instance ? instance.getPreviousOpen() : false;
	
				},
	
				setPreviousOpen: function(data) {
	
					action('setPreviousOpen', data, true);
	
				},
	
				changeRelated: function(data) {
	
					action('changeRelated', data, true);
	
				}
	
			};
	
			
			
			var api,
				instance,
				$target = options.target,
				$parentTarget = options.parentTarget,
				dataStack = {},
				actionStack = [],
				hub = $('<div>'),
				// obiekt info dla metody setSize wykonanej przed initem skina
				size = {
					width:0,
					height:0,
					isFullscreen:false
				},
	
				related = [],
	
				action = function(name, data, onlyonce) {
					if (!instance) {
						if (onlyonce){
							dataStack[name] = data;
						}else {
							actionStack.push([name, data]);
						}
					} else {
						var fn = instance[name];
						if (typeof fn === 'function') {
							if (typeof data !== 'undefined') {
								fn(data);
							} else {
								fn();
							}
						}
					}
				},
				
				newInstance = function (){
					instance = new ExtendedRelated(related, {
						hub:hub,
						target:$target,
						parentTarget:$parentTarget,
						videoContainer:options.videoContainer,
						utils: options.utils
					});
				},
				onLoaded = function(e){
					ExtendedRelated = e.econtructor;
					newInstance();
	
					while (Boolean(prop = actionStack.shift())) {
						action(prop[0], prop[1]);
					}
	
					for (var prop in dataStack){
						if (dataStack.hasOwnProperty(prop)) {
							action(prop, dataStack[prop]);
							delete dataStack[prop];
						}
					}
				},
				onLoad = function(){
				},
				init = function(data){
					$(document).on('EXTEND_RELATED_READY', onLoaded);
					if (data){
						related = data;
					}
					window.getScript(Config.getRelatedUrl(), onLoad, 'extendedRelated');
					if (ExtendedRelated){
						newInstance();
					}
				},
				// public
				api = {
					hub: hub,
					init: init
				};
				
			return Utils.extend(api, ExtendedRelatedManagerInterface);
		};
	
		/**
	 * Created by mmarzecki on 07.07.16.
	 */
	
	var FloatingPlayerConfig = {
		normal: {
	
		},
		floating: {
			size: {
				width: 272,
				height: 153
			}
		},
		adv: {
	
		},
		animation: false,
		related: false,
		limits: {
			drag: {
	
			},
			resize: {
				scaleMax: 2.5
			}
		},
		quality: {
	
		},
		position: {
			default: {
				left: 3,
				bottom: 30
			},
			leftTop: {
				left: 3,
				top: 3
			},
			leftBottom: {
				left: 3,
				bottom: 30
			},
			rightTop: {
				right: 3,
				top: 3
			},
			rightBottom: {
				right: 3,
				bottom: 30
			}
		}
	}
	
		/**
	 * Created by mmarzecki on 07.07.16.
	 */
	/*jslint browser: true*/
	/*global FloatingPlayerManager*/
	/*
	 * Plywajacy player
	 * options {object} options.node
	 */
	
	var FloatingPlayer,
		FloatingPlayerEvents = {
			showQuality: 'showQuality',
			hideQuality: 'hideQuality'
		},
		FloatingPlayerManager = function(options) {
			/**
			 * Created by mmarzecki on 07.07.16.
			 */
			/*jslint browser: true*/
			/*global uiConfig, FloatingPlayerManagerInterface */
			
			var FloatingPlayerManagerInterface = {
			    setSize: function(data) {
			        action('setSize', data, true);
			    },
			    setData: function(d) {
			        action('setData', d, true);
			    },
			    changeTitle: function(d) {
			        action('changeTitle', d);
			    },
			    openFloatingPlayer: function() {
			        action('openFloatingPlayer');
			    },
			    closeFloatingPlayer: function() {
			        action('closeFloatingPlayer');
			    },
			    destroy: function() {
			        action('destroy');
			    }
			};
			
			var api,
				hub = $('<div>'),
				config = FloatingPlayerConfig,
				instance,
				$target = options.target,
				$parentTarget = options.parentTarget,
				dataStack = {},
				actionStack = [],
				position,
				action = function(name, data, onlyonce) {
					if (!instance) {
						if (onlyonce){
							dataStack[name] = data;
						}else {
							actionStack.push([name, data]);
						}
					} else {
						var fn = instance[name];
						if (typeof fn === 'function') {
							if (typeof data !== 'undefined') {
								fn(data);
							} else {
								fn();
							}
						}
					}
				},
				newInstance = function (){
					instance = new FloatingPlayer(position, {
						hub:hub,
						target:$target,
						parentTarget:$parentTarget,
						videoContainer:options.videoContainer,
						utils: options.utils,
						config: config,
						skinManager: options.skinManager,
						privateDispatcher: options.dispatcher.private
					});
				},
				onLoaded = function(e){
					FloatingPlayer = e.econtructor;
					newInstance();
	
					while (Boolean(prop = actionStack.shift())) {
						action(prop[0], prop[1]);
					}
	
					for (var prop in dataStack){
						if (dataStack.hasOwnProperty(prop)) {
							action(prop, dataStack[prop]);
							delete dataStack[prop];
						}
					}
				},
				onLoad = function(){
				},
				init = function(_position) {
					$(document).on('FLOATING_PLAYER_READY', onLoaded);
	
					if (_position) {
						position = _position;
					}
	
					window.getScript(Config.getFloatingPlayerUrl(), onLoad, 'floatingPlayer');
					if (FloatingPlayer){
						newInstance();
					}
				},
			// public
				api = {
					hub: hub,
					init: init
				};
	
			return Utils.extend(api, FloatingPlayerManagerInterface);
		};
		/*jslint browser: true*/
	/*global SkinManagerInterface*/
	
	var SkinStorage = {},
		 SkinEvents = {
			clickBtnPlaybig: 'clickBtnPlay',
			clickControlBtnPlay: 'clickControlBtnPlay',
			sliderSeek: 'sliderSeek',
			clickBtnFullScreen: 'clickBtnFullScreen',
			setQuality: 'setQuality',
			sliderVolume: 'sliderVolume',
			clickBtnMute: 'clickBtnMute',
			clickReplayBtn: 'clickReplayBtn',
			clickFirstBtn: 'clickFirstBtn',
			clickRelatedItem: 'clickRelatedItem',
			autoRelatedItem: 'autoRelatedItem',
			clickBtnAutomute: 'clickBtnAutomute'
		 },
	/*
	 * Zarządza skórkami playera itp.
	 * options {object} options.node
	 */
		SkinManager = function(options) {
	
			/*jslint browser: true*/
	
			/*global uiConfig, skinInstance */
	
			
	
			var SkinManagerInterface = {
	
				unregisterSkin: function() {},
	
				registerSkin: function(conf) {
	
					currentConfig = conf;
	
					if (isSkinExists(conf.name)) {
	
						set(conf);
	
					} else {
	
						load();
	
					}
	
				},
	
				
	
				// settery na instancji skina
	
				setState: function(data) {
	
					action('setState', data);
	
				},
	
				/* data action */
	
				setData: function(data) {
	
					Utils.extend(dataState, data);
	
					Utils.extend(dataState.data, data.data);
	
					action('setData', dataState, true);
	
				},
	
				setTimeData: function(data) {
	
					action('setTimeData', Utils.extend(dataState.timeData, data), true);
	
				},
	
				setPosition: function(data) {
	
					action('setPosition', Utils.extend(dataState, data), true);
	
				},
	
				setQuality: function(data) {
	
					action('setQuality', Utils.extend(dataState, data), true);
	
				},
	
				showQualityButton: function() {
	
					action('showQualityButton');
	
				},
	
				hideQualityButton: function() {
	
					action('hideQualityButton');
	
				},
	
				setVolume: function(data) {
	
					action('setVolume', Utils.extend(dataState, data), true);
	
				},
	
				setUiConfig: function(data) {
	
					action('setUiConfig', Utils.extend(uiConfig, data), true);
	
				},
	
				setSize: function(data) {
	
					action('setSize', Utils.extend(size, data), true);
	
				},
	
			
	
				/* data action */
	
				setRelated: function(data){
	
					action('setRelated', data);
	
				},
	
			
	
				showRelated:function(value){
	
					action('showRelated', value, true);
	
				},
	
				endScreen:function(data){
	
					action('endScreen', data);
	
				},
	
				// pauza i resume countera na ekranie related
	
				pauseRelatedCounter: function() {
	
					action('pauseRelatedCounter');
	
				},
	
				resumeRelatedCounter: function() {
	
					action('resumeRelatedCounter');
	
				},
	
				resizeRelated: function() {
	
					action('resizeRelated');
	
				},
	
				showMessage: function(data) {
	
					action('showMessage', data);
	
				},
	
				hideMessage: function() {
	
					action('hideMessage');
	
				},
	
				toggleShortcutIcons: function(data) {
	
					action('toggleShortcutIcons', data);
	
				},
	
				destroy: function(){
	
					action('destroy');
	
				}
	
			};
	
			var api, $target = options.target,
				$parentTarget = options.parentTarget,
				advClass = options.advClass,
				hub = $('<div>'),
				// obiekt info dla metody setSize wykonanej przed initem skina
				size = {
					width:0,
					height:0,
					isFullscreen:false
				},
				//potrzebny klon, bo inaczej jest to obiekt wspólny dla wszystkich skórek, a tego nie chcemy
				// aktualny stan elementów ui skórki przechowywany jeszcze przed jej wczytaniem
				uiConfig = Utils.clone(Config.uiConfig),
				// aktualny stan danych dla skórki przechowywany jeszcze przed jej wczytaniem
				dataState = {
					state:'paused',
					data:{},
					timeData:{},
					volume: .75,
					automute: false,
					quality:0,
					qualityOptions:[]/*['HQ','LQ']*/
				},
				// ogólny setup skina z urlem - ustawiany w SkinManagerInterface w metodzie registerSkin
				currentConfig,
				skinInstance,
				// skinStorage - singleton do przechowywania skinów (konstruktorów) do wielokrotnego użycia
				skinStorage = SkinStorage,
				// aktualna głośność - nie wiem jeszcze czy tu będzie...
				// private
				actionStack = [],
				dataStack = {},
			/*getActiveSkin: function() {},
			setActiveSkin: function() {},*/
	
				action = function(name, data, onlyonce) {
					if (!skinInstance) {
						if (onlyonce){
							dataStack[name] = data;
						}else {
							actionStack.push([name, data]);
						}
					} else {
						var fn = skinInstance[name];
						if (typeof fn === 'function') {
							if (typeof data !== 'undefined') {
								fn(data);
							} else {
								fn();
							}
						}
					}
				},
	
				load = function() {
					if (Utils.type.isObject(currentConfig) && Utils.type.isString(currentConfig.url) && Utils.type.isString(currentConfig.name)) {
						addNewSkinToStorage(Utils.extend(currentConfig, {
							status: "loading"
						}));
	
						$(document).bind('SKIN_READY', onSkinInit);
	
						var s = document.createElement('script');
						s.type = 'text/javascript';
						s.charset = 'utf-8';
						s.onload = onLoad;
						s.onerror = onError;
						s.src = currentConfig.url+'?ts='+Date.now();
						document.body.appendChild(s);
					} else {
						console.log('Error - brak urla do skina');
					}
				},
				onLoad = function() {
	
				},
				onError = function() {
	
				},
				addNewSkinToStorage = function(conf) {
					skinStorage[conf.name] = conf;
				},
				set = function(conf) {
					var prop;
					if (skinInstance) {
						// czyszczenie poprzedniej skóry
						skinInstance.destroy();
					}
					skinInstance = new skinStorage[conf.name].skinApi(conf, {
						target: $target,
						parentTarget: $parentTarget,
						hub: hub,
						advClass: advClass
					});
	
					skinInstance.setUiConfig(uiConfig);
					skinInstance.setData(dataState);
					skinInstance.setSize(size);
					skinInstance.setTimeData(dataState.timeData);
					skinInstance.setVolume({volume: dataState.volume, automute:dataState.automute});
	
					while (Boolean(prop = actionStack.shift())) {
						action(prop[0], prop[1]);
					}
	
					for (var prop in dataStack){
						if (dataStack.hasOwnProperty(prop)) {
							action(prop, dataStack[prop]);
							delete dataStack[prop];
						}
					}
	
				},
				isSkinExists = function(name) {
					if (Utils.type.isObject(skinStorage[name])) {
						return (skinStorage[name].status === 'ready');
					}
					return false;
				},
				onSkinInit = function(e, data) {
					if (currentConfig.name === data.name) {
						$(document).unbind('SKIN_READY', onSkinInit);
						skinStorage[data.name].status = 'ready';
						skinStorage[data.name].skinApi = data.skinContructor;
						set(currentConfig);
					}
				},
				// public
				api = {
					hub: hub
				};
	
			return Utils.extend(api, SkinManagerInterface);
		};
	
	

	function notSupported(target){
		var message = {
				header: "Przykro nam, ale Twoja przegl\u0105darka uniemo\u017cliwia prawid\u0142owe odtwarzanie materia\u0142\u00f3w video.",
				content: "Zainstaluj inn\u0105 przegl\u0105dark\u0119, np. Chrome lub Safari, aby obejrze\u0107 film."
			},
			msgHeader = $("<strong>").text(message.header).css({
				display: "block",
				marginBottom: 5
			}),
			msg = message.content + " (kod bł&#281;du: 99)",
			content = $('<div>').addClass('infoAB').append(msgHeader, msg),
			cont = $('<div>').addClass('windowCont').css({
				color: '#fff',
				minWidth: 320,
				maxWidth: 550,
				width: 'auto',
				height: 'auto',
				background: '#000',
				padding: '15px 15px',
				zIndex: 1,
				fontSize: 12,
				textAlign: 'center'
			});

		content.css({
			color: '#FFF',
			fontSize: "13px",
			lineHeight: "18px",
			textAlign: 'left',
			margin: "20px 0px",
			paddingLeft: "105px",
			minHeight: "70px",
			backgroundPosition: '21px 5px',
			backgroundRepeat: 'no-repeat',
			backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAA5CAYAAACCsf3qAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAUzSURBVGiB5dtbaFxFHMfxT1qLRaMGS6GgaCsYFUUj9CE+qKjghYIg2gdFRUWFpLWa1qoV79V6a+sNDKgvguiDKKIoUkFTsJZq1WoVaRGEer8gXvKgKKwPc9YzZ7ObvZyzexr9Qsj/fzIzO/nt7H/m/P9n+yqVisndfUpkAebh07Im0D9YsU9ZLx5xHw7D6WVOYlaZL47FuASn4bwyJ1KmEH14LJrDBswtazJlCnEhhiN/EcZKmou+koLlftiNQ2quT+IofNPLyfQPVkpbETdJRfgCOxK7H+vKmFAZK+Iw7JLGg/PwC95K/IrwkXm3VxMqa0Wsl4qwHS9hAluSa314JPndM3otxClYGvlxcBzB34k9jIt7NSl6K8Rs4Z2usg5vR/5OLIv8e4WY0RN6KcTlGErsSYzXafOEEDwJwfTGHswLvRPiINndYDm+atD2usi+XjhfdJ1eCXEr5if2Ljw9TduXhSBKCKoPdHFe/9ILIY7Cishf1UKfuP0Fwr1IV+mFEBswJ7G34dUW+mzF2sjfKATbrtFtIc7Gkshf1qhhHcaFoEoIslcWNal6dFOIOXgo8m/B+230/1Y4W1RZi4EC5lWXbgoxiqMT+yf1t8tmPCMEV0Kwvb2AedWlW0LMxx2RP4qfOxxrZWQvk4pbKN0S4i7pMv4Ez+cY6zUhyBI+bhtzjNWQbghxAq6K/JWNGrbBaGSfIxuAC6EbQjwk3eq24o0CxvwAayI/3pILoWghzpc9/Iw0atgB4/gxsWsPabkpUoi5eDDyx/BRgeP/KnsOuUV6bM9NkUKskt4gfa35djkkJGTin6GGrQPPC8GXEIzvaXuWDSiqwHOIkIessgJ/NukzgFPrXGvGSmxK7CvwuDTn2TFFrYh10iTKDrxY0Lj1eEMIwkxN9nRMEUIMC9WqKtc1alggcRCuTf91RF4h+oTtsppo3YLNOcdshY9wbeQ/KGeVLK8Ql0qrVX8rdrtsxji+TOzDsTrPYHmE6JeN2iNCArZX/CX7MbzR1MpZy+QRYo1steqpNvtP1LnWbvR/ER8m9v5ypPU6FWKR7D1EUQHylw76xLWR2sJyy3QqRByctgsJ106IA2unp9DNslWyx3RQJetEiNOEe4oqRZ35O1kNVUbwR2IvFoJ4W7QrxGw8HPlrpYebTpiI7Dynw524JvLvwwHtDNCuEFfj+MT+TWfpt0bkWRGEYP15Yi/Aze10bkeIAdwZ+SNCgjUPE5Gd+35BNoCP4YhWO7YjxB2y1apn2+jbCnlXBLyC9xJ7XyGB0xKtPihyND6WZoWWCLnEvZFh2bh1Bt6crkP/YKVlIV7HWYm9TYd7dQ0LcVnNtQn1D1rtciduS+xPcKL02YsptPrA6RKpCGQTqXlYqH6dYqKAsceFbX0AxwlB/vHpOjSLEbXp8zVCInVv5zvZN+wuHDxdh2ZCrMBgYv+g2O2y2zyHzxJ7niZVsumEmC8811BluZBAnUnE2+kojm3UcLpg+aS0Ar1TepCaaWyVBvdNsvEO0z9eOCQkRqu08nDH3kqcLDoT59Zr1EiIR6O/vaOYalVZ7MANkb9eOGxlqCfEUpwc+b1Mv3WLcXyf2EfK3qBhqhBzBcWqXCucKGc6k7JVsluFG7N/qRVitfCsNOwxs7bLZrwgfVMPxN3xH2MhDpWtVo0JCdL/EnFa73IhiYOsEPcL36MgnB67Wa0qizeF4E/43zdK0nrVc8RJQt6v1K/7lcRF/YOV5/p+32WWcEe5uFmP/yh7cMwsoW75fxWBsDnc8A+TBPe9kb3E4AAAAABJRU5ErkJggg==)'

		}).appendTo(cont);

		target.append(cont);
		return false;
	}
		
	main = WP.player = function(params) {

		if ((Utils.isMobile && isWPTV(params.url) && params.forceliteembed !== false) || params.forceliteembed) {
			new WP.playerMini(params);
			return;
		}

		var $this = this,
			player, tempEvents = $this.events,
			extendParams = params,
			utils = WP.player.utils,
			isObject = utils.type.isObject(params),
			isNumber = utils.type.isNumber(params),
			isInstance = this instanceof WP.player,
			pid = main.list.length,
			id = 'Player' + pid,
			$player, $playerClassName = 'wp-player',
			body = 'body',
			newInstance = false;
		
		if (typeof params.target === "string" ){
			params.target = params.target.replace('#', '');
		}
		
		if (isObject && !isInstance && !(this instanceof oldInstance)) {
			return new WP.player(params);
		} else if ((typeof params === 'number') && !isInstance) {
			return main.list[params] || false;
		} else if ((typeof params === 'number') && isInstance) {
			throw new Error('Pobieranie instancji odbywa się "WP.player(id)"');
		}

		if (!params.target && document.readyState !== 'loading') {
			params.target = body;
		}
		
		if (!params.target) {
			document.write('<div id="' + id + '" class="' + $playerClassName + '"></div>');
			$player = $('#' + id);
		} else {
			$player = $('<div>').attr({
				id: id
			}).addClass($playerClassName);
			
			$(params.target === body ? body : (typeof params.target === "string" ) ? '#' + params.target : params.target).append($player);
		}
		
		

		if (!Utils.isSupported){
			notSupported($player);
			return false;
		}
		if (params.filesdir){
			Config.filesdir = params.filesdir;
		}
		
		var $target = $('<div>').addClass('npp-container').appendTo($player);
		player = (function() {
			if (isObject) {
				extendParams = utils.extend({}, Config.options, params, {
					id: id,
					pid: pid,
					target: $target,
					parentTarget:$player,
					main:$this
				});
				
				for (var prop in extendParams){
					extendParams[prop.toLowerCase()] = extendParams[prop];
				}
				newInstance = true;
				player = new Player(extendParams, tempEvents);
			} else if (isNumber) {
				player = PlayerManager.getPlayer(params);
			} else {
				throw new Error('PODAJ DANE WEJSCIOWE');
			}
			
			return player;
		}());

		//sklonowanie parametrów rozszerzonych o podstawowe dane
		$this.p = utils.clone(extendParams);
		$this.p.target = $player;
		$this.$ = $player;
		$this.target = $player;
		$this.initialized = true;
		$this.pid = pid;
		$this.id = id;
		$this.ver = 2;
		
		//rozszerzenie playera o metody API USER
		$this = utils.extend($this, utils.privateExtend(player.public));
		
		//tymczasowe obejscie różnic wersji playera
		$this.video = {
			isAdvMode: player.public.isAdvMode,
			addEventListener:player.public.on,
			removeEventListener:player.public.off,
			setSize:player.public.setSize
		};
		if (newInstance) {
			PlayerManager.registerPlayer($this, player.private);
		}
	
		return $this;
	};

	main.$ = $;
	main.T = main.list = PlayerManager.list;
	main.ver = main.version = '2016-09-08T21:56:56.505Z';
	main.utils = Utils;
	main.initialized = true;

}(window, document));