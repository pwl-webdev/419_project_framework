/*===Copyright 2015-2016 Wirtualna Polska http://www.wp.pl - Build date: 2016-09-08T21:29:18.515Z===*/
/*jslint browser: true*/
/*global document, $*/

(function(document, $) {
	'use strict';
	var $ = WP && WP.$,
	//=%%DICTIONARY%%,
	SKIN_STYLES = (function(){ return '@charset "UTF-8";@font-face{font-family:Roboto;src:url(//a.wpimg.pl/a/i/stg/player/fonts/roboto-regular-webfont.eot);src:url(//a.wpimg.pl/a/i/stg/player/fonts/roboto-regular-webfont.eot?#iefix) format("embedded-opentype"),url(//a.wpimg.pl/a/i/stg/player/fonts/roboto-regular-webfont.woff) format("woff"),url(//a.wpimg.pl/a/i/stg/player/fonts/roboto-regular-webfont.ttf) format("truetype"),url(//a.wpimg.pl/a/i/stg/player/fonts/roboto-regular-webfont.svg#roboto_condensedbold) format("svg");font-weight:400;font-style:normal}.wp-player .npp-container .dynamicClassName:hover,.wp-player .npp-container.skinDefault:hover+.wp-player .npp-container .dynamicClassName{display:block}.wp-player.extendedfullsize,.wp-player.fullscreen{top:0;left:0;right:0;bottom:0;position:fixed;z-index:100000}.wp-player .npp-container *{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;margin:0;padding:0;border:0;outline:0;font-size:100%;vertical-align:baseline;background:0 0;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:rgba(255,255,255,0)}.wp-player .npp-container ol,.wp-player .npp-container ul{list-style:none}.wp-player .npp-container :after,.wp-player .npp-container :before{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}.wp-player .npp-container div{line-height:1.25}.wp-player .npp-container{position:relative;overflow:hidden;font-family:Roboto,Ubuntu,Tahoma,Arial;font-weight:400;font-size:10px;line-height:1.25;color:#000;background:#000;text-align:left;box-sizing:content-box;z-index:1}.wp-player .npp-container .player-wplive{width:78px;height:68px;top:10px;right:10px;position:absolute;background:url(http://i.wp.pl/a/i/stg/player/wplive.png) no-repeat}.wp-player .npp-container .player-loader{position:absolute;box-shadow:0 0 10px rgba(0,0,0,.5);width:12px;height:12px;top:46%;top:-webkit-calc(50% - 6px);top:calc(50% - 6px);left:46%;left:-webkit-calc(50% - 6px);left:calc(50% - 6px);border-radius:12px;background-color:#fff;-webkit-transform-origin:50% 50%;transform-origin:50% 50%;-webkit-animation:loader6 1s ease-in-out infinite;animation:loader6 .7s ease-in-out infinite}.wp-player .npp-container .player-loader:after,.wp-player .npp-container .player-loader:before{content:"";box-shadow:0 0 10px rgba(0,0,0,.5);background-color:rgba(255,255,255,.5);height:12px;width:12px;border-radius:12px;position:absolute;top:0}.wp-player .npp-container .player-loader:before{left:-25px}.wp-player .npp-container .player-loader:after{left:25px}@-webkit-keyframes loader6{0%{-webkit-transform:rotate(0)}100%,50%{-webkit-transform:rotate(180deg)}}@keyframes loader6{0%{transform:rotate(0)}100%,50%{transform:rotate(180deg)}}.wp-player .npp-container .dynamicClassName{position:absolute;display:block;text-shadow:none;left:0;right:0;top:0;bottom:0;text-align:center;overflow:hidden;z-index:1;background-color:#000}.wp-player .npp-container .dynamicClassName .img{width:100%;height:100%;background:center no-repeat #000;background-size:contain}.wp-player .npp-container .dynamicClassName .close,.wp-player .npp-container .dynamicClassName .skip,.wp-player .npp-container .dynamicClassName.skip{position:absolute;background-color:#fff;color:#000;right:10px;padding:6px 10px;border-radius:2px;text-align:center;box-shadow:0 0 4px 0 #000;cursor:pointer}.wp-player .npp-container .dynamicClassName .close{top:10px;font-size:1.3em;text-shadow:none}.wp-player .npp-container .dynamicClassName .close .close-x{font:500 28px/18px Roboto,Arial,Ubuntu,"Lucida Console",Helvetica,sans-serif;margin:-2px 0 0 6px;display:block;float:right}.wp-player .npp-container .dynamicClassName .skip,.wp-player .npp-container .dynamicClassName.skip{top:initial;left:initial;bottom:40px;font-size:1.3em}.wp-player .npp-container .dynamicClassName.bola{position:relative;height:1px;overflow:visible;left:initial;right:initial;top:initial;bottom:initial;text-align:initial;background-color:initial}.wp-player .npp-container .dynamicClassName.bola a{bottom:40px;left:0;right:0;position:absolute;margin-left:auto;margin-right:auto;max-width:100%}.wp-player .npp-container .dynamicClassName.bola .close{top:-40px}.wp-player .npp-container .dynamicClassName.bola img{max-width:100%;display:block;margin-left:auto;margin-right:auto}.wp-player .npp-container.skinDefault{text-shadow:0 0 2px rgba(0,0,0,.5)}.wp-player.fullscreen .npp-container.skinDefault{font-size:15px}.wp-player .npp-container.skinDefault .top{backface-visibility:hidden;margin-top:0;position:absolute;width:100%;top:0;z-index:2}.wp-player .npp-container.skinDefault .top .topcont,.wp-player .npp-container.skinDefault.nohover:hover .top .topcont{position:absolute;width:100%;top:-8em;transition:top .1s ease-in 50ms;transition-delay:.1s}.wp-player .npp-container.skinDefault:hover .top .topcont{top:0;transition-delay:.1s}.wp-player .npp-container.skinDefault .top .topcont .titlecont{position:absolute;width:100%;top:0;left:0}.wp-player .npp-container.skinDefault .top .topcont .titlecont .bg{position:absolute;top:0;left:0;width:100%;height:4em;background:linear-gradient(to bottom,rgba(0,0,0,.75) 0,transparent 100%)}.wp-player .npp-container.skinDefault .top .topcont .titlecont .title{display:block;text-decoration:none;position:absolute;top:0;left:0;right:2em;margin-top:.5em;margin-left:1em;color:#fff!important;font-size:1.6em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:margin .35s ease-out}.wp-player .npp-container.skinDefault .top .topcont .titlecont .title:hover{text-decoration:underline}.wp-player .npp-container.skinDefault .top .topcont .titlecont .title.ikon{margin-left:2em}.wp-player .npp-container.skinDefault.automute .top .topcont .titlecont .title,.wp-player .npp-container.skinDefault.automute .top .topcont .titlecont .title.ikon{margin-left:4em}.wp-player .npp-container.skinDefault.special .top .topcont{position:absolute;width:100%;top:0}.wp-player .npp-container.skinDefault.special:hover .top .topcont{top:0}.wp-player .npp-container.skinDefault.special .top .topcont .titlecont .title{font-size:1.6em;text-shadow:0 1px #000}.wp-player .npp-container.skinDefault .top .topcont .titlecont .btninfo{position:absolute;top:1em;right:1em;width:1.6em;height:1.6em;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCI+PGRlZnM+PGZpbHRlciBpZD0iYSI+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjUgMCIvPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuNSIgcmVzdWx0PSJjb2xvcmVkQmx1ciIvPjxmZU1lcmdlPjxmZU1lcmdlTm9kZSBpbj0iY29sb3JlZEJsdXIiLz48ZmVNZXJnZU5vZGUgaW49IlNvdXJjZUdyYXBoaWMiLz48L2ZlTWVyZ2U+PC9maWx0ZXI+PC9kZWZzPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIxLjQ1OCIgc3Ryb2tlLW9wYWNpdHk9Ii42IiBkPSJNOC45IDE2LjhjMS45IDAgMy42LS43IDUtMS44IDEuOC0xLjUgMy0zLjcgMy02LjJDMTYuOSA0LjQgMTMuNC45IDkgLjlzLTggMy42LTggOCAzLjUgNy45IDcuOSA3Ljl6IiBmaWx0ZXI9InVybCgjYSkiLz48Y2lyY2xlIG9wYWNpdHk9Ii42IiBmaWxsPSIjRkZGIiBjeD0iOC45IiBjeT0iNS41IiByPSIxLjEiIGZpbHRlcj0idXJsKCNhKSIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjYiIGQ9Ik04LjkgNy44Yy42IDAgMS4xIDEuMyAxLjEgMi44IDAgMS42LS41IDIuOC0xLjEgMi44LS42IDAtMS4xLTEuMy0xLjEtMi44IDAtMS41LjUtMi44IDEuMS0yLjh6IiBmaWx0ZXI9InVybCgjYSkiLz48L3N2Zz4=) center center no-repeat;cursor:pointer;opacity:.7;transition:opacity 220ms}.wp-player .npp-container.skinDefault .top .topcont .titlecont .btninfo:hover{opacity:1}.wp-player .npp-container.skinDefault .automuteBtn{position:absolute;width:6em;height:6em;top:2em;left:1em;cursor:pointer;z-index:2}.wp-player .npp-container.skinDefault .automuteBtn.minAge{top:3em}.wp-player .npp-container.skinDefault .bottom,.wp-player .npp-container.skinDefault.nohover:hover .bottom{backface-visibility:hidden;position:absolute;width:100%;height:3.6em;bottom:-3.3em;background:-moz-linear-gradient(top,transparent 0,transparent 3px,rgba(0,0,0,.5) 100%);background:-webkit-linear-gradient(top,transparent 0,transparent 3px,rgba(0,0,0,.5) 100%);background:linear-gradient(to bottom,transparent 0,transparent 3px,rgba(0,0,0,.5) 100%);filter:progid:DXImageTransform.Microsoft.gradient( startColorstr="#00000000", endColorstr="#80000000", GradientType=0 );transition:bottom 110ms ease-in 50ms;transition-delay:.1s;z-index:2}.wp-player .npp-container.skinDefault.exthover .bottom,.wp-player .npp-container.skinDefault:hover .bottom{bottom:0;transition-delay:.1s}.wp-player .npp-container.skinDefault.live .bottom .bottombg,.wp-player .npp-container.skinDefault.live .bottom .bottomgradients,.wp-player .npp-container.skinDefault.live .bottom .seek,.wp-player .npp-container.skinDefault.special .bottom .bottombg,.wp-player .npp-container.skinDefault.special .bottom .bottomgradients,.wp-player .npp-container.skinDefault.special .bottom .seek,.wp-player .npp-container.skinDefault.special .bottom .time{display:none}.wp-player .npp-container.skinDefault .bottom .bottomgradients{position:absolute;display:table;top:0;left:0;width:100%}.wp-player .npp-container.skinDefault .bottom .bottombg,.wp-player .npp-container.skinDefault.nohover:hover .bottom .bottombg{display:table-cell;position:relative;top:0;width:auto;height:4em;background:rgba(0,0,0,.49);background:-moz-linear-gradient(top,transparent 0,rgba(0,0,0,.5) 100%);background:-webkit-linear-gradient(top,transparent 0,rgba(0,0,0,.5) 100%);background:linear-gradient(to bottom,transparent 0,rgba(0,0,0,.5) 100%);filter:progid:DXImageTransform.Microsoft.gradient( startColorstr="#00000000", endColorstr="#80000000", GradientType=0 );transition:top 110ms ease-in 50ms;transition-delay:.1s}.wp-player .npp-container.skinDefault .bottom .bottombgprogress,.wp-player .npp-container.skinDefault.nohover:hover .bottom .bottombgprogress{display:table-cell;position:relative;top:0;height:4em;background:rgba(255,0,0,.49);background:-moz-linear-gradient(top,rgba(237,28,36,0) 0,rgba(237,28,36,.25) 100%);background:-webkit-linear-gradient(top,rgba(237,28,36,0) 0,rgba(237,28,36,.25) 100%);background:linear-gradient(to bottom,rgba(237,28,36,0) 0,rgba(237,28,36,.25) 100%);filter:progid:DXImageTransform.Microsoft.gradient( startColorstr="#ed1c24", endColorstr="#33ed1c24", GradientType=0 );transition:top 110ms ease-in 50ms;transition-delay:.1s}.wp-player .npp-container.skinDefault:hover .bottom .bottombg,.wp-player .npp-container.skinDefault:hover .bottom .bottombgprogress{top:0;transition-delay:.1s}.wp-player .npp-container.skinDefault .bottom .seek{position:absolute;top:0;left:0;width:100%;transition:left 110ms ease-in 50ms,width 110ms ease-in 50ms;transition-delay:.1s}.wp-player .npp-container.skinDefault:hover .bottom .seek{left:1em;width:calc(100% - 2em);transition-delay:.1s}.wp-player .npp-container.skinDefault .bottom .seek .seekcont{width:100%;height:.3em;top:0;position:relative;cursor:pointer;overflow:hidden;background-color:rgba(255,255,255,.3);transition:height .1s;-webkit-box-shadow:0 0 1px 0 rgba(0,0,0,.3);-moz-box-shadow:0 0 1px 0 rgba(0,0,0,.3);box-shadow:0 0 1px 0 rgba(0,0,0,.3)}.wp-player .npp-container.skinDefault:hover .bottom .seek .seekcont{transition-delay:.1s}.wp-player .npp-container.skinDefault .bottom .seek.visible .seekcont,.wp-player .npp-container.skinDefault .bottom .seek:hover .seekcont{height:.6em}.wp-player .npp-container.skinDefault .identifier{width:5px;height:5px;display:block;position:absolute;right:0;bottom:0;color:#fff;font-size:12px;padding:0;z-index:2}.wp-player .npp-container.skinDefault .identifier.identifierVisible{width:auto;height:auto;background-color:#000;z-index:10001;-o-user-select:text;-moz-user-select:text;-webkit-user-select:text;user-select:text}.wp-player .npp-container.skinDefault .bottom .seek .handler{position:relative;display:block;width:1.6em;height:1.6em;transform:translate(-50%,-1.2em);-webkit-transform:translate(-50%,-1.2em);background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9IjAgMCAyNCAyNCI+CjxkZWZzPgogICAgICAgIDxmaWx0ZXIgaWQ9Imdsb3ciPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0KICAgICAgICAgICAgICAgICAgICAgICAgIjAgMCAwIDAgICAwCiAgICAgICAgICAgICAgICAgICAgICAgICAwIDAgMCAwICAgMAogICAgICAgICAgICAgICAgICAgICAgICAgMCAwIDAgMCAgIDAKICAgICAgICAgICAgICAgICAgICAgICAgIDAgMCAwIDAuNzUgMCIvPgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxLjg1IiByZXN1bHQ9ImNvbG9yZWRCbHVyIi8+CiAgICAgICAgICAgIDxmZU1lcmdlPgogICAgICAgICAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJjb2xvcmVkQmx1ciIvPgogICAgICAgICAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJTb3VyY2VHcmFwaGljIi8+CiAgICAgICAgICAgIDwvZmVNZXJnZT4KICAgICAgICA8L2ZpbHRlcj4KICAgIDwvZGVmcz4KPGNpcmNsZSBzdHlsZT0iZmlsdGVyOnVybCgjZ2xvdykiIGN4PScxMicgY3k9JzEzJyByPSc5JyBmaWxsPScjZWQxYzI0JyAvPjwvc3ZnPg==) center center no-repeat;transition:opacity .1s ease-in 10ms;transition-delay:.1s;opacity:0;cursor:pointer}.wp-player .npp-container.skinDefault .bottom .seek.visible .handler{opacity:1}.wp-player .npp-container.skinDefault .bottom .seek:hover .handler{opacity:1;transition-delay:.1s}.wp-player .npp-container.skinDefault .bottom .seek .seekcont .buffer{width:50%;height:100%;position:absolute;background:rgba(255,255,255,.7)}.wp-player .npp-container.skinDefault .bottom .seek .seekcont .progress{height:100%;position:absolute;background:#ed1c24}.wp-player .npp-container.skinDefault .bottom .bcontrols{position:absolute;width:100%;top:.9em}.wp-player .npp-container.skinDefault .bottom .bcontrols .btnplay{position:relative;float:left;left:0;top:0;width:1.6em;height:1.3em;margin:.3em 0 .3em .75em;cursor:pointer;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMSAxMyI+PGRlZnM+PGZpbHRlciBpZD0iYSI+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjUgMCIvPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuNSIgcmVzdWx0PSJjb2xvcmVkQmx1ciIvPjxmZU1lcmdlPjxmZU1lcmdlTm9kZSBpbj0iY29sb3JlZEJsdXIiLz48ZmVNZXJnZU5vZGUgaW49IlNvdXJjZUdyYXBoaWMiLz48L2ZlTWVyZ2U+PC9maWx0ZXI+PC9kZWZzPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik04LjcgNi41TDAgMTNWMGw4LjcgNi41eiIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+) center center no-repeat;background-size:contain;opacity:.7;transition:opacity 110ms}.wp-player .npp-container.skinDefault .bottom .bcontrols .btnplay:hover{opacity:1}.wp-player .npp-container.skinDefault.playing .bottom .bcontrols .btnplay{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMSAxMyI+PGRlZnM+PGZpbHRlciBpZD0iYSI+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjUgMCIvPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuNSIgcmVzdWx0PSJjb2xvcmVkQmx1ciIvPjxmZU1lcmdlPjxmZU1lcmdlTm9kZSBpbj0iY29sb3JlZEJsdXIiLz48ZmVNZXJnZU5vZGUgaW49IlNvdXJjZUdyYXBoaWMiLz48L2ZlTWVyZ2U+PC9maWx0ZXI+PC9kZWZzPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0wIDBoNHYxM0gwem03IDBoNHYxM0g3eiIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+) center center no-repeat;background-size:contain}.wp-player .npp-container.skinDefault.paused .bottom .bcontrols .btnplay{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMSAxMyI+PGRlZnM+PGZpbHRlciBpZD0iYSI+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjUgMCIvPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuNSIgcmVzdWx0PSJjb2xvcmVkQmx1ciIvPjxmZU1lcmdlPjxmZU1lcmdlTm9kZSBpbj0iY29sb3JlZEJsdXIiLz48ZmVNZXJnZU5vZGUgaW49IlNvdXJjZUdyYXBoaWMiLz48L2ZlTWVyZ2U+PC9maWx0ZXI+PC9kZWZzPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik04LjcgNi41TDAgMTNWMGw4LjcgNi41eiIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+) center center no-repeat;background-size:contain}.wp-player .npp-container.skinDefault .bottom .bcontrols .time{position:relative;float:left;font-size:1.2em;font-weight:500;line-height:1.25;margin:.16em 0 .2em 1.6em;letter-spacing:0;color:#fff;text-shadow:none}.wp-player .npp-container.skinDefault .bottom .bcontrols span{display:inline;font-size:1em;font-weight:500;color:#fff;text-shadow:none}.wp-player .npp-container.skinDefault .bottom .bcontrols .ainfo{float:left;padding-top:.2em;max-width:70%;overflow:hidden;white-space:nowrap}.wp-player .npp-container.skinDefault .bottom .bcontrols .ainfo .adesc,.wp-player .npp-container.skinDefault .bottom .bcontrols .ainfo .atime{font-size:1.2em;position:relative;display:inline;color:rgba(255,255,255,.8);text-shadow:0 1px rgba(0,0,0,.5)}.wp-player .npp-container.skinDefault .bottom .bcontrols .ainfo .atime{font-size:1.2em;margin:.2em 0 .2em .6em;font-weight:500;line-height:1.25;color:#fff;text-shadow:none}.wp-player .npp-container.skinDefault .bottom .bcontrols .ainfo .adesc{margin-left:.6em}.wp-player .npp-container.skinDefault .bottom .bcontrols .btnfullscreen{position:relative;float:right;width:1.3em;height:1.3em;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMyAxMyI+CjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0yLDExVjhIMHY1aDV2LTJIMnogTTIsMmgzVjBIMHY1aDJWMnogTTExLDExSDh2Mmg1VjhoLTJWMTF6IE0xMSwydjNoMlYwSDh2MkgxMXoiLz4KPC9zdmc+) center center no-repeat;background-size:contain;margin-top:.4em;margin-right:1em;cursor:pointer;opacity:.7;transition:opacity 220ms}.wp-player .npp-container.skinDefault .bottom .bcontrols .btnfullscreen:hover{opacity:1}.wp-player.fullscreen .npp-container.skinDefault .bottom .bcontrols .btnfullscreen{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMyAxMyI+PGRlZnM+PGZpbHRlciBpZD0iYSI+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjUgMCIvPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuNSIgcmVzdWx0PSJjb2xvcmVkQmx1ciIvPjxmZU1lcmdlPjxmZU1lcmdlTm9kZSBpbj0iY29sb3JlZEJsdXIiLz48ZmVNZXJnZU5vZGUgaW49IlNvdXJjZUdyYXBoaWMiLz48L2ZlTWVyZ2U+PC9maWx0ZXI+PC9kZWZzPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xMCAzVjBIOHY1aDVWM20tMyA3aDNWOEg4djVoMk0zIDNIMHYyaDVWMEgzbTAgMTB2M2gyVjhIMHYyIiBmaWx0ZXI9InVybCgjYSkiLz48L3N2Zz4=) center center no-repeat;background-size:contain}.wp-player .npp-container.skinDefault .bottom .bcontrols .btnquality{position:relative;float:right;width:2.7em;height:2em;margin-top:0;margin-right:1.7em;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMyAxNiI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEwLjQgMTIuOEg4LjhWOC42SDQuNXY0LjNIMi44VjMuMmgxLjd2NGg0LjN2LTRoMS43djkuNnptMiAwVjMuMmgyLjhjLjggMCAxLjYuMiAyLjIuNi43LjQgMS4yLjkgMS41IDEuNi40LjcuNSAxLjUuNSAyLjR2LjVjMCAuOS0uMiAxLjctLjUgMi40LS40LjctLjkgMS4yLTEuNSAxLjYtLjcuNC0xLjQuNi0yLjMuNmgtMi43ek0xNCA0LjZ2Ni45aDEuMWMuOSAwIDEuNS0uMyAyLS44cy43LTEuMy43LTIuNHYtLjVjMC0xLS4yLTEuOC0uNy0yLjQtLjUtLjYtMS4xLS44LTItLjhIMTR6Ii8+PC9zdmc+) center center no-repeat;background-size:contain;cursor:pointer;opacity:.7;transition:opacity 220ms}.wp-player .npp-container.skinDefault .bottom .bcontrols .btnquality:hover{opacity:1}.wp-player .npp-container.skinDefault .bottom .bcontrols .btnquality.bhd{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMyAxNiI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE1LjEgNC42SDE0djdoMS4xYy45IDAgMS41LS4zIDItLjhzLjctMS4zLjctMi4zdi0uNmMwLTEtLjItMS44LS43LTIuNC0uNS0uNi0xLjEtLjktMi0uOXoiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMjEuOSAwSC40Qy4yIDAgMCAuMiAwIC40djE1LjJjMCAuMi4yLjQuNC40aDIxLjVjLjIgMCAuNC0uMi40LS40Vi40YzAtLjItLjItLjQtLjQtLjR6TTEwLjMgMTIuOUg4LjdWOC42SDQuNXY0LjNIMi44VjMuMmgxLjZ2NC4xaDQuM1YzLjJoMS42djkuN3ptOS4xLTQuNmMwIC45LS4yIDEuNy0uNSAyLjRzLS45IDEuMi0xLjUgMS42Yy0uNy41LTEuNC43LTIuMy43aC0yLjdWMy4zaDIuOGMuOCAwIDEuNi4yIDIuMi42LjYuNCAxLjEuOSAxLjUgMS42cy41IDEuNS41IDIuNHYuNHoiLz48L3N2Zz4=) center center no-repeat;background-size:contain;margin-top:.3em;height:1.5em}.wp-player .npp-container.skinDefault .btnquality.tooltip span.tooltipcloud{position:absolute;min-width:7em;color:#FFF;background:#212627;line-height:2em;text-align:center;visibility:hidden}.wp-player .npp-container.skinDefault .btnquality:hover.tooltip span.tooltipcloud{visibility:visible;opacity:.8;bottom:3em;left:50%;font-size:1.2em;transform:translateX(-50%);-webkit-transform:translateX(-50%)}.wp-player .npp-container.skinDefault .btnquality.tooltip span.tooltipcloud:after{content:"";position:absolute;top:100%;left:50%;width:0;height:0;border-top:4px solid #212627;border-right:5px solid transparent;border-left:5px solid transparent;transform:translateX(-50%);-webkit-transform:translateX(-50%)}.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol{position:relative;float:left;top:.1em}.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol .btnmute{position:relative;float:left;width:1.8em;height:1.3em;margin:.2em 0 .2em 2em;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxMyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTggMTMiPjxzdHlsZT4uc3Qwe2ZpbGw6I0ZGRkZGRjt9IC5zdDF7ZmlsdGVyOnVybCgjZ2xvdyk7fTwvc3R5bGU+PGZpbHRlciBpZD0iZ2xvdyI+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjUgMCIvPjxmZUdhdXNzaWFuQmx1ciByZXN1bHQ9ImNvbG9yZWRCbHVyIiBzdGREZXZpYXRpb249Ii44NSIvPjxmZU1lcmdlPjxmZU1lcmdlTm9kZSBpbj0iY29sb3JlZEJsdXIiLz48ZmVNZXJnZU5vZGUgaW49IlNvdXJjZUdyYXBoaWMiLz48L2ZlTWVyZ2U+PC9maWx0ZXI+PHBhdGggY2xhc3M9InN0MCIgZD0iTTExLjMgMTIuNmMtLjUgMC0uOC0uMy0uOC0uOHMuNS0uOC44LS44YzIuNyAwIDUtMi4xIDUtNC42cy0yLjItNC42LTUtNC42Yy0uNSAwLS44LS4zLS44LS44IDAtLjQuNS0uOC44LS44QzE0LjkuMiAxOCAyLjkgMTggNi4zcy0zIDYuMy02LjcgNi4zTTAgMy40aDQuNEw4IDB2MTNMNC40IDkuNkgwVjMuNCIvPjxwYXRoIGNsYXNzPSJzdDEgc3QwIiBkPSJNMTMuMSA2LjVjMCAuOC0uNyAxLjUtMS42IDEuNS0uOSAwLTEuNi0uNy0xLjYtMS41UzEwLjUgNSAxMS40IDVzMS43LjcgMS43IDEuNSIvPjwvc3ZnPg==) center center no-repeat;background-size:contain;cursor:pointer;opacity:.7;transition:opacity 220ms}.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol .btnmute:hover{opacity:1}.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol .btnmute.half{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxMyI+PHN0eWxlPi5zdDB7ZmlsbDojRkZGRkZGO30gLnN0MXtmaWx0ZXI6dXJsKCNnbG93KTt9PC9zdHlsZT48ZmlsdGVyIGlkPSJnbG93Ij48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuNSAwIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iY29sb3JlZEJsdXIiIHN0ZERldmlhdGlvbj0iLjg1Ii8+PGZlTWVyZ2U+PGZlTWVyZ2VOb2RlIGluPSJjb2xvcmVkQmx1ciIvPjxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyIvPjwvZmVNZXJnZT48L2ZpbHRlcj48cGF0aCBjbGFzcz0ic3QxIHN0MCIgZD0iTTAgMy40aDQuNEw4IDB2MTNMNC40IDkuNkgwVjMuNE0xMy4xIDYuNWMwIC44LS43IDEuNS0xLjYgMS41cy0xLjYtLjctMS42LTEuNS42LTEuNSAxLjUtMS41IDEuNy43IDEuNyAxLjUiLz48L3N2Zz4=) center center no-repeat;background-size:contain}.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol .btnmute.x{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxMyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTggMTMiPjxzdHlsZT4uc3Qwe2ZpbHRlcjp1cmwoI2dsb3cpO30gLnN0MXtmaWxsOiNGRkZGRkY7fSAuc3Qye2ZpbGw6I0VEMUMyNDt9PC9zdHlsZT48ZmlsdGVyIGlkPSJnbG93Ij48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuNSAwIi8+PGZlR2F1c3NpYW5CbHVyIHJlc3VsdD0iY29sb3JlZEJsdXIiIHN0ZERldmlhdGlvbj0iLjg1Ii8+PGZlTWVyZ2U+PGZlTWVyZ2VOb2RlIGluPSJjb2xvcmVkQmx1ciIvPjxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyIvPjwvZmVNZXJnZT48L2ZpbHRlcj48cGF0aCBjbGFzcz0ic3QwIHN0MSIgZD0iTTAgMy40aDQuNUw4LjIgMHYxM0w0LjUgOS42SDBWMy40Ii8+PHBhdGggY2xhc3M9InN0MCBzdDIiIGQ9Ik0xNS43IDYuNWwyLTEuOWMuNC0uMy40LTEgMC0xLjMtLjQtLjQtMS0uNC0xLjMtLjFsLTIgMi0yLTJjLS40LS4zLTEtLjMtMS40IDBzLS40IDEgMCAxLjNsMiAyLTIgMS45Yy0uNC40LS40IDEgMCAxLjQuMi4xLjUuMi43LjJzLjQtLjEuNy0uMmwxLjktMiAyIDJjLjIuMS40LjIuNy4ycy40LS4xLjctLjJjLjQtLjMuNC0xIDAtMS4zbC0yLTJ6Ii8+PC9zdmc+) center center no-repeat;background-size:contain}.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol .volslider{width:0;float:left;margin-top:.6em;margin-left:.9em;height:.5em;position:relative;cursor:pointer;opacity:0;transition:opacity,width 220ms ease-in .1s;transition-delay:.5s}.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol .volslider.visible,.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol:hover .volslider{width:8em;opacity:1;transition-delay:.1s}.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol .volslider .volsliderset{position:absolute;width:50%;height:100%;background:#fff}.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol .volslider .volsliderbg{position:absolute;width:100%;height:100%;background:rgba(255,255,255,.5);-webkit-box-shadow:0 0 2px 0 rgba(0,0,0,.2);-moz-box-shadow:0 0 2px 0 rgba(0,0,0,.2);box-shadow:0 0 2px 0 rgba(0,0,0,.2)}.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol .volslider .volsliderbg.x{opacity:.35}.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol .volslider .volSliderHandler{position:relative;width:1.4em;height:1.4em;top:-.5em;transform:translate(-.75em,0);-webkit-transform:translate(-.75em,0);background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGRlZnM+PGZpbHRlciBpZD0iYSI+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAiLz48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIuODUiIHJlc3VsdD0iY29sb3JlZEJsdXIiLz48ZmVNZXJnZT48ZmVNZXJnZU5vZGUgaW49ImNvbG9yZWRCbHVyIi8+PGZlTWVyZ2VOb2RlIGluPSJTb3VyY2VHcmFwaGljIi8+PC9mZU1lcmdlPjwvZmlsdGVyPjwvZGVmcz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEzIiByPSI5IiBmaWxsPSIjZmZmIiBmaWx0ZXI9InVybCgjYSkiLz48L3N2Zz4=) center center no-repeat;background-size:contain}.wp-player .npp-container.skinDefault .bottom .bcontrols .volcontrol .volslider .volSliderHandler.x{left:0;opacity:0}.wp-player .npp-container.skinDefault .btnplaybig{position:absolute;visibility:visible;width:10em;height:10em;top:50%;left:50%;transform:translate(-5em,-5em);-webkit-transform:translate(-5em,-5em);cursor:pointer;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDEgMTAxIj48cGF0aCBmaWxsLW9wYWNpdHk9Ii4zIiBkPSJNNTAuMiAxMDAuM2MyNy43IDAgNTAuMi0yMi41IDUwLjItNTAuMkMxMDAuMyAyMi41IDc3LjkgMCA1MC4yIDAgMjIuNSAwIDAgMjIuNSAwIDUwLjJjMCAyNy43IDIyLjUgNTAuMSA1MC4yIDUwLjF6Ii8+PHBhdGggb3BhY2l0eT0iLjgiIGZpbGw9IiNGRkYiIGQ9Ik03MS40IDQ5LjlMMzguMiA3NC43bC4xLTQ5LjUgMzMuMSAyNC43eiIvPjwvc3ZnPg==) center center no-repeat;z-index:1;transition:visibility 220ms,opacity 220ms;opacity:.7}.wp-player .npp-container.skinDefault.playing .btnplaybig{opacity:0;visibility:hidden}.wp-player .npp-container.skinDefault.paused .btnplaybig{opacity:.7}.wp-player .npp-container.skinDefault.paused .btnplaybig:hover{opacity:1}.wp-player .npp-container.skinDefault .btnspeakerdown,.wp-player .npp-container.skinDefault .btnspeakerup{display:none;pointer-events:none;position:absolute;width:10em;height:10em;top:50%;left:50%;transform:translate(-5em,-5em);-webkit-transform:translate(-5em,-5em);z-index:2;transition:opacity 0s}.wp-player .npp-container.skinDefault .btnspeakerdown.fadein,.wp-player .npp-container.skinDefault .btnspeakerup.fadein{display:block;transition:opacity 0s;opacity:1}.wp-player .npp-container.skinDefault .btnspeakerdown.fadeout,.wp-player .npp-container.skinDefault .btnspeakerup.fadeout{display:block;transition:opacity 220ms;opacity:0}.wp-player .npp-container.skinDefault.paused .btnspeakerdown.fadein,.wp-player .npp-container.skinDefault.paused .btnspeakerdown.fadeout,.wp-player .npp-container.skinDefault.paused .btnspeakerup.fadein,.wp-player .npp-container.skinDefault.paused .btnspeakerup.fadeout{display:none}.wp-player .npp-container.skinDefault .btnspeakerup{background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAxIiBoZWlnaHQ9IjEwMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLW9wYWNpdHk9IjAuMyIgZD0ibTUwLjIsMTAwLjNjMjcuNywwIDUwLjIsLTIyLjUgNTAuMiwtNTAuMmMtMC4xLC0yNy42IC0yMi41LC01MC4xIC01MC4yLC01MC4xYy0yNy43LDAgLTUwLjIsMjIuNSAtNTAuMiw1MC4yYzAsMjcuNyAyMi41LDUwLjEgNTAuMiw1MC4xeiIvPjxnIGlkPSJzdmdfMiIgb3BhY2l0eT0iMC44IiBmaWxsPSIjRkZGIj48cGF0aCBkPSJtMjAsMzkuNWwwLDIybDEyLjUsMGwxOC41LDE1LjVsMCwtNTNsLTE4LjUsMTUuNWwtMTIuNSwwbDAsMHoiLz48cmVjdCBoZWlnaHQ9IjUiIHdpZHRoPSIyNSIgeT0iNDgiIHg9IjU2Ii8+PHJlY3QgaGVpZ2h0PSIyNSIgd2lkdGg9IjUiIHk9IjM4IiB4PSI2NiIvPjwvZz48L3N2Zz4=) center center no-repeat}.wp-player .npp-container.skinDefault .btnspeakerdown{background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAxIiBoZWlnaHQ9IjEwMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCQk8cGF0aCBmaWxsLW9wYWNpdHk9IjAuMyIgZD0ibTUwLjIsMTAwLjNjMjcuNywwIDUwLjIsLTIyLjUgNTAuMiwtNTAuMmMtMC4xLC0yNy42IC0yMi41LC01MC4xIC01MC4yLC01MC4xYy0yNy43LDAgLTUwLjIsMjIuNSAtNTAuMiw1MC4yYzAsMjcuNyAyMi41LDUwLjEgNTAuMiw1MC4xeiIvPgoJCTxyZWN0IG9wYWNpdHk9Ii44IiBmaWxsPSIjRkZGIiBoZWlnaHQ9IjUiIHdpZHRoPSIyNSIgeT0iNDgiIHg9IjU2Ii8+CgkJPHBhdGggb3BhY2l0eT0iLjgiIGZpbGw9IiNGRkYiIGQ9Im0yMCwzOS41bDAsMjJsMTIuNSwwbDE4LjUsMTUuNWwwLC01M2wtMTguNSwxNS41bC0xMi41LDBsMCwweiIvPgoJPC9zdmc+) center center no-repeat}.wp-player .npp-container.skinDefault .age{position:relative;left:.5em;top:11px;width:1.8em;height:1.8em}.wp-player .npp-container.skinDefault .age.age7{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBmaWxsPSIjNEM4RkI5IiBkPSJNMjYuNSAwQzExLjkgMCAwIDExLjkgMCAyNi41djE0N0MwIDE4OC4xIDExLjkgMjAwIDI2LjUgMjAwaDE0N2MxNC42IDAgMjYuNS0xMS45IDI2LjUtMjYuNXYtMTQ3QzIwMCAxMS45IDE4OC4xIDAgMTczLjUgMGgtMTQ3eiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik02MC44IDU0LjVIMTEwdi40TDY1LjcgMTc3LjNoMjkuMWw0NC40LTEzMHYtMjJINjAuOHYyOS4yeiIvPjwvc3ZnPg==) center center no-repeat;background-size:contain}.wp-player .npp-container.skinDefault .age.age12{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBmaWxsPSIjRDBEMTU0IiBkPSJNMjYuNSAwQzExLjkgMCAwIDExLjkgMCAyNi41djE0N0MwIDE4OC4xIDExLjkgMjAwIDI2LjUgMjAwaDE0N2MxNC42IDAgMjYuNS0xMS45IDI2LjUtMjYuNXYtMTQ3QzIwMCAxMS45IDE4OC4xIDAgMTczLjUgMGgtMTQ3eiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik03OS4xIDE3Ny4zdi0xNTJINTQuOUwyMy4zIDQ0LjVsNi4zIDI1LjQgMjEuMi0xMy40aC4zdjEyMC44aDI4em05Ny42LTI5LjRIMTM1di0uNGwxMC40LTEyLjJjNy44LTkuMSAxNC42LTE5LjEgMjAuMy0yOS44IDUuNy0xMC44IDguNy0yMi43IDktMzYgLjEtMTMtMy4yLTI0LTkuNy0zMi43LTYuNS04LjgtMTYuNy0xMy4zLTMwLjUtMTMuNy03LjIuMS0xMy44IDEuNC0yMCAzLjktNi4yIDIuNS0xMS4yIDUuNS0xNS4xIDlsNy40IDI1LjZjMi45LTIuNiA2LjItNC45IDEwLTcgMy44LTIgNy44LTMuMSAxMi0zLjIgNS45LjIgMTAuMyAyLjIgMTMuMiA2LjMgMi45IDQgNC4zIDkgNC4zIDE0LjktLjEgOS0zLjEgMTguNS05IDI4LjQtNS45IDEwLTE0LjMgMjEuNy0yNSAzNS4ybC0xNC4zIDE5djIyaDc4LjV2LTI5LjN6Ii8+PC9zdmc+) center center no-repeat;background-size:contain}.wp-player .npp-container.skinDefault .age.age16{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBmaWxsPSIjRUE5QzMwIiBkPSJNMjYuNSAwQzExLjkgMCAwIDExLjkgMCAyNi41djE0N0MwIDE4OC4xIDExLjkgMjAwIDI2LjUgMjAwaDE0N2MxNC42IDAgMjYuNS0xMS45IDI2LjUtMjYuNXYtMTQ3QzIwMCAxMS45IDE4OC4xIDAgMTczLjUgMGgtMTQ3eiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik03Ni42IDE3Ny4zdi0xNTJINTIuNUwyMC45IDQ0LjVsNi4zIDI1LjQgMjEuMi0xMy40aC4zdjEyMC44aDI3Ljl6bTQ2LjEtODljMS41LTkgNS0xNi45IDEwLjQtMjMuOXMxMy4zLTExLjMgMjMuNi0xMy4xYzItLjMgMy45LS41IDUuNS0uNyAxLjctLjIgMy4zLS4zIDQuOC0uM1YyMy41Yy0yLjUgMC00LjYgMC02LjIuMS0xLjYuMS0zLjUuMy01LjYuNy0xOC42IDItMzMuNCAxMS00NC4zIDI3LTEwLjkgMTYtMTYuNSAzNy4xLTE2LjcgNjMuNCAwIDE4LjggMy43IDM0LjIgMTEuMSA0Ni4yIDcuNCAxMiAxOC4zIDE4LjIgMzIuOCAxOC42IDEyLjktLjUgMjIuOS02IDMwLjEtMTYuNnMxMC44LTIzLjIgMTAuOS0zOGMtLjItMTUuNC0zLjUtMjcuMi05LjctMzUuNVMxNTUuMyA3NyAxNDUuOSA3Ni45Yy00LjggMC05LjEgMS4xLTEyLjkgMy4xLTMuOCAyLTcgNC44LTkuNiA4LjNoLS43em0xNS4xIDY2LjJjLTQuOS0uMy04LjctMy4zLTExLjItOS4yLTIuNS01LjktMy45LTEyLjktNC0yMS4yIDAtMi44LjEtNS4yLjQtNy4yLjMtMiAuNi0zLjQuOS00LjQgMS4yLTMuNCAzLTYuMSA1LjItOC4zIDIuMi0yLjEgNC43LTMuMyA3LjUtMy4zIDQuOS4zIDguNSAzIDEwLjggOCAyLjMgNSAzLjQgMTAuNyAzLjQgMTcgMCA3LjQtLjkgMTMuOS0zIDE5LjYtMiA1LjctNS40IDguNy0xMCA5eiIvPjwvc3ZnPg==) center center no-repeat;background-size:contain}.wp-player .npp-container.skinDefault .age.age18{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBmaWxsPSIjRDU0RTREIiBkPSJNMjYuNSAwQzExLjkgMCAwIDExLjkgMCAyNi41djE0N0MwIDE4OC4xIDExLjkgMjAwIDI2LjUgMjAwaDE0N2MxNC42IDAgMjYuNS0xMS45IDI2LjUtMjYuNXYtMTQ3QzIwMCAxMS45IDE4OC4xIDAgMTczLjUgMGgtMTQ3eiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xNDUuOCA1Ny4zYy0xOC44LjUtMzQuNiAxMy43LTM5LjUgMzEuMkgxNi45djU0LjJoMjAuOXYtMzEuMmgxOHYzMS4yaDIwLjl2LTMxLjJoMjkuNGM1IDE3LjkgMjEuMyAzMS4yIDQwLjYgMzEuMiAyMy4zIDAgNDIuMi0xOS40IDQyLjItNDIuNyAwLTIzLjMtMTguOS00Mi43LTQyLjItNDIuN2gtLjl6bTEuMSAyMi41YzEwLjkgMCAxOS43IDguOCAxOS43IDIwLjJzLTguOCAyMC4yLTE5LjcgMjAuMi0xOS43LTguOC0xOS43LTIwLjIgOC44LTIwLjIgMTkuNy0yMC4yeiIvPjwvc3ZnPg==) center center no-repeat;background-size:contain}.wp-player .npp-container.skinDefault .age.age0{background:0 0}.wp-player .npp-container.skinDefault .windowcont{position:absolute;color:#fff;width:100%;height:100%;font-size:1.2em;left:0;top:0;right:0;bottom:0;z-index:5}.wp-player .npp-container.skinDefault .windowcont .infocont{line-height:1.8em;text-align:left;min-width:90%;min-height:14em;max-height:30em;padding:1em;background:rgba(0,0,0,.75);position:relative;top:0;z-index:5}.wp-player .npp-container.skinDefault .windowcont .infocont .age{display:inline-block;top:0;left:0;width:1.8em;height:1.8em;margin-right:1em}.wp-player .npp-container.skinDefault .windowcont .infocont .age.age0{display:none;width:0;height:0;margin:0}.wp-player .npp-container.skinDefault .windowcont .infocont .title{display:inline-block;position:relative;max-width:90%;color:#fff;font-size:1.4em;text-shadow:0 1px #000}.wp-player .npp-container.skinDefault .windowcont .infocont .duration{position:relative;color:#8c8c8c;font-size:.8em;margin-top:.5em}.wp-player .npp-container.skinDefault .windowcont .infocont .description{position:relative;overflow:hidden;max-height:80%;color:#c4c2c2;font-size:1.1em}.wp-player .npp-container.skinDefault .windowcont .infocont .source{position:relative;color:#fff;font-size:.9em;margin-top:1.5em;text-align:left}.wp-player .npp-container.skinDefault .windowcont .close{position:absolute;width:1.5em;height:1.5em;right:1em;top:1em;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNSAxNSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTguOSA3bDQuNy00LjdjLjUtLjUuNS0xLjQgMC0xLjlzLTEuNC0uNS0xLjkgMEw3IDUuMSAyLjMuNEMxLjgtLjEuOS0uMS40LjRzLS41IDEuNCAwIDEuOUw1LjEgNyAuNCAxMS43Yy0uNS41LS41IDEuNCAwIDEuOS4zLjMuNi40LjkuNHMuNy0uMS45LS40TDcgOC45bDQuNyA0LjdjLjMuMy42LjQuOS40LjMgMCAuNy0uMS45LS40LjUtLjUuNS0xLjQgMC0xLjlMOC45IDd6Ii8+PC9zdmc+) center center no-repeat;background-size:contain;cursor:pointer;opacity:.7;transition:opacity 220ms}.wp-player .npp-container.skinDefault .windowcont .close:hover{opacity:1}.wp-player .npp-container.skinDefault .windowErrCont{position:absolute;width:100%;height:100%;background-color:rgba(0,0,0,.75);left:0;top:0;right:0;bottom:0;z-index:5}.wp-player .npp-container.skinDefault .windowErrCont .errCont{position:relative;color:#fff;text-align:left;max-width:310px;min-height:60px;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PHBhdGggZmlsbD0iI2YzZDkwMCIgZD0iTTUyLjEgNTdIOGMtMi44IDAtNS41LTEuNS02LjktNC0xLjQtMi41LTEuNC01LjUgMC04bDIyLTM4LjJjMS40LTIuNSA0LjEtNCA2LjktNCAyLjggMCA1LjUgMS41IDYuOSA0bDIyIDM4LjJjMS40IDIuNSAxLjQgNS41IDAgOHMtNCA0LTYuOCA0ek0zMCA2LjNjLTEuNiAwLTMuMS45LTMuOSAyLjNsLTIyIDM4LjJjLS44IDEuNC0uOCAzLjEgMCA0LjVzMi4zIDIuMyAzLjkgMi4zaDQ0LjFjMS42IDAgMy4xLS45IDMuOS0yLjMuOC0xLjQuOC0zLjEgMC00LjVMMzQgOC42Yy0uOS0xLjQtMi40LTIuMy00LTIuM3ptMi43IDMxLjNjMCAuOC0uNyAxLjMtMS40IDEuM2gtMi41Yy0uOCAwLTEuNC0uNi0xLjQtMS4zbC0xLTE5YzAtLjQuMS0uOC40LTEuMS4zLS4zLjYtLjQgMS0uNGg0LjZjLjQgMCAuOC4yIDEgLjQuMy4zLjQuNy40IDEuMWwtMS4xIDE5ek0zMCA0MS4xYy0xLjcgMC0zLjEgMS40LTMuMSAzLjEgMCAxLjcgMS40IDMuMSAzLjEgMy4xczMuMS0xLjQgMy4xLTMuMWMuMS0xLjctMS4zLTMuMS0zLjEtMy4xeiIvPjwvc3ZnPg==) 10px 10px no-repeat;background-size:48px 48px;margin-left:auto;margin-right:auto;top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%)}.wp-player .npp-container.skinDefault .windowErrCont .errCont .errDesc1{position:relative;color:#fff;font-size:2em;margin-bottom:.8em;padding-left:4em;padding-top:.4em}.wp-player .npp-container.skinDefault .windowErrCont .errCont .errDesc2{position:relative;color:#999;font-size:1.4em;padding-left:.6em}.wp-player .npp-container.skinDefault .endscreen{padding:0;background-position:center;background-repeat:no-repeat;background-size:cover}.wp-player .npp-container.skinDefault .endscreen .relBg{position:absolute;top:0;left:0;width:100%;height:100%;padding:0;background-color:rgba(0,0,0,.5)}.wp-player .npp-container.skinDefault .endscreen .relHeader{width:100%;height:1.8em;margin-top:1em;color:rgba(255,255,255,.5)}.wp-player .npp-container.skinDefault .endscreen .relHeader .btnBackToFirst,.wp-player .npp-container.skinDefault .endscreen .relHeader .currentClipHeader{position:relative;display:inline-block;width:12em;font-size:1.6em;height:100%;margin-left:.1em;cursor:pointer}.wp-player .npp-container.skinDefault .endscreen .relHeader.x0 .btnBackToFirst,.wp-player .npp-container.skinDefault .endscreen .relHeader.x0 .currentClipHeader{display:none}.wp-player .npp-container.skinDefault .endscreen .relHeader.x1 .btnBackToFirst,.wp-player .npp-container.skinDefault .endscreen .relHeader.x1 .currentClipHeader{width:50%;font-size:1.4em;margin-left:0}.wp-player.fullscreen .npp-container.skinDefault .endscreen .relHeader.x1 .btnBackToFirst,.wp-player.fullscreen .npp-container.skinDefault .endscreen .relHeader.x1 .currentClipHeader{width:16em}.wp-player .npp-container.skinDefault .endscreen .relHeader .btnBackToFirst{float:left}.wp-player .npp-container.skinDefault .endscreen .relHeader .btnBackToFirst .btnBackToFirstIkon,.wp-player .npp-container.skinDefault .endscreen .relHeader .currentClipHeader .btnCurrentClipReplay{display:inline-block;width:2em;height:100%;margin:.1em}.wp-player .npp-container.skinDefault .endscreen .relHeader .btnBackToFirst .btnBackToFirstIkon{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNyAxMyI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTIgNi41TDEwLjcgMHYxM0wyIDYuNXoiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNOCA2LjVMMTYuNyAwdjEzTDggNi41ek0wIDBoM3YxM0gweiIvPjwvc3ZnPg==) center center no-repeat;background-size:contain;height:85%}.wp-player .npp-container.skinDefault .endscreen .relHeader .btnBackToFirst .btnBackToFirstLabel,.wp-player .npp-container.skinDefault .endscreen .relHeader .currentClipHeader .currentClipLabel{display:inline-block;transform:translateY(-10%);-webkit-transform:translateY(-10%);padding-top:8px}.wp-player .npp-container.skinDefault .endscreen .relHeader .currentClipHeader .btnCurrentClipReplay{background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTguMSAwQzUuNyAwIDMuNCAxLjIgMiAzLjFsLS4yLS43Yy0uMi0uNC0uNy0uNy0xLjItLjVDLjEgMi0uMSAyLjUgMCAzbDEgMi43Yy4xLjQuNS42LjkuNmguM2wyLjctLjljLjUtLjIuNy0uNy42LTEuMS0uMy0uNS0uOC0uOC0xLjMtLjZsLS41LjFjMS4xLTEuMyAyLjctMiA0LjUtMiAzLjIgMCA1LjkgMi42IDUuOSA1LjlzLTIuNiA1LjktNS45IDUuOWMtMi41IDAtNC43LTEuNS01LjUtMy45bC0xLjcuNmMxLjEgMyA0IDUgNy4yIDUgNC4yIDAgNy43LTMuNCA3LjctNy43QzE1LjggMy40IDEyLjQgMCA4LjEgMCIvPjwvc3ZnPg==) center center no-repeat;background-size:contain}.wp-player .npp-container.skinDefault .endscreen .nextClipCont{position:absolute;max-width:70%;height:75px;max-height:75px;margin-left:50%;top:calc((65% + 1.8em)/ 2);transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);color:#fff;overflow:hidden;cursor:pointer}.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x2{top:calc((53% + 1.8em)/ 2);height:70px;max-height:70px}.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x1{top:calc((100% + 2.8em)/ 2);height:48px;max-height:48px;width:80%;max-width:80%}.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x0{top:50%}.wp-player.fullscreen .npp-container.skinDefault .endscreen .nextClipCont.x0,.wp-player.fullscreen .npp-container.skinDefault .endscreen .nextClipCont.x1{top:calc((65% + 1.8em)/ 2);max-width:70%;height:75px;max-height:75px;margin-left:50%}.wp-player .npp-container.skinDefault .endscreen .nextClipCont .nextClipLabel{font-size:.9em}.wp-player .npp-container.skinDefault .endscreen .nextClipCont .nextClipTitle{font-size:1.2em}.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x0 .nextCounter,.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x0 .nextCounter .nextCounterGr,.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x1 .nextCounter,.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x1 .nextCounter .nextCounterGr{width:40px;height:40px}.wp-player .npp-container.skinDefault .endscreen .nextClipCont .nextCounter,.wp-player .npp-container.skinDefault .endscreen .nextClipCont .nextCounter .nextCounterGr,.wp-player.fullscreen .npp-container.skinDefault .endscreen .nextClipCont .nextCounter,.wp-player.fullscreen .npp-container.skinDefault .endscreen .nextClipCont .nextCounter .nextCounterGr{position:absolute;top:0;left:0;width:68px;height:68px}.wp-player .npp-container.skinDefault .endscreen .nextClipCont .nextCounter .nextCounterLabel{position:absolute;top:12px;left:0;width:100%;font-size:3.5em;text-align:center;text-shadow:0 2px 2px rgba(0,0,0,.5)}.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x0 .nextCounter .nextCounterLabel,.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x1 .nextCounter .nextCounterLabel{top:6px;font-size:2.2em}.wp-player.fullscreen .npp-container.skinDefault .endscreen .nextClipCont .nextCounter .nextCounterLabel{top:.3em;font-size:2.4em}.wp-player .npp-container.skinDefault .endscreen .nextClipCont .nextTitle,.wp-player .npp-container.skinDefault .endscreen .nextClipCont .nextTitleHeader{margin-left:80px;font-size:1.3em;color:rgba(255,255,255,.5)}.wp-player .npp-container.skinDefault .endscreen .nextClipCont .nextTitleHeader{font-weight:700}.wp-player .npp-container.skinDefault .endscreen .nextClipCont .nextTitle{font-size:2.3em;color:#fff;max-height:2.6em}.wp-player.fullscreen .npp-container.skinDefault .endscreen .nextClipCont .nextTitle{max-height:1.3em}.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x0 .nextTitle,.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x0 .nextTitleHeader,.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x1 .nextTitle,.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x1 .nextTitleHeader{margin-left:50px;font-size:1em}.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x0 .nextTitle,.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x1 .nextTitle{font-size:1.5em;overflow:hidden}.wp-player.fullscreen .npp-container.skinDefault .endscreen .nextClipCont.x0 .nextTitle,.wp-player.fullscreen .npp-container.skinDefault .endscreen .nextClipCont.x0 .nextTitleHeader,.wp-player.fullscreen .npp-container.skinDefault .endscreen .nextClipCont.x1 .nextTitle,.wp-player.fullscreen .npp-container.skinDefault .endscreen .nextClipCont.x1 .nextTitleHeader{margin-left:80px;font-size:1.3em}.wp-player .npp-container.skinDefault .endscreen .nextClipCont.x2 .nextTitle{font-size:2em}.wp-player .npp-container.skinDefault .endscreen .thumbCont{position:absolute;width:100%;bottom:6px}.wp-player.ExtendedRelated.show .npp-container.skinDefault .endscreen .thumbCont{display:none}.wp-player.ExtendedRelated.show .npp-container.skinDefault .endscreen .nextClipCont{top:50%}.wp-player .npp-container.skinDefault .endscreen .thumbCont .relThumb{box-sizing:border-box;position:relative;width:calc(100% / 3 - 8px);height:100%;float:left;background:0 0;margin-left:6px;margin-top:5px;transition:border .1s ease-in .1s}.wp-player .npp-container.skinDefault .endscreen .thumbCont .relThumb.x2{width:calc(50% - 12px)}.wp-player .npp-container.skinDefault .endscreen.loading .thumbCont .relThumb{cursor:auto;background:rgba(200,200,200,.35)}.wp-player .npp-container.skinDefault .endscreen.loaded .thumbCont .relThumb{cursor:pointer}.wp-player .npp-container.skinDefault .endscreen .thumbCont .relThumb img{display:block;width:100%;height:auto}.wp-player .npp-container.skinDefault .endscreen .thumbCont .relThumb .relThumbDuration{position:absolute;right:0;top:0;padding:4px;margin:0;color:#fff;font-size:1.1em;text-align:center;background:rgba(0,0,0,.7);transition:margin .1s ease-out}.wp-player .npp-container.skinDefault .endscreen .thumbCont .relThumb:first-child .relThumbDuration,.wp-player .npp-container.skinDefault .endscreen .thumbCont .relThumb:hover .relThumbDuration{margin:3px}.wp-player .npp-container.skinDefault .endscreen .thumbCont .relThumb .relThumbTitleBg{position:absolute;bottom:0;width:100%;height:7em;background:-moz-linear-gradient(top,transparent 0,rgba(0,0,0,.6) 100%);background:-webkit-linear-gradient(top,transparent 0,rgba(0,0,0,.6) 100%);background:linear-gradient(to bottom,transparent 0,rgba(0,0,0,.6) 100%);filter:progid:DXImageTransform.Microsoft.gradient( startColorstr="#00000000", endColorstr="#99000000", GradientType=0 )}.wp-player .npp-container.skinDefault .endscreen .thumbCont .relThumb .relThumbTitle{position:absolute;color:#fff;font-weight:400;font-size:1.4em;bottom:8px;padding:0 10px;max-height:2.5em;overflow:hidden}.wp-player .npp-container.skinDefault .endscreen .thumbCont .relThumb .relThumbIkon{position:absolute;width:6.2em;height:6.2em;top:50%;left:50%;transform:translate(-3.2em,-4.4em);-webkit-transform:translate(-3.2em,-4.4em);opacity:.8;cursor:pointer;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDEgMTAxIj48cGF0aCBmaWxsLW9wYWNpdHk9Ii4zIiBkPSJNNTAuMiAxMDAuM2MyNy43IDAgNTAuMi0yMi41IDUwLjItNTAuMkMxMDAuMyAyMi41IDc3LjkgMCA1MC4yIDAgMjIuNSAwIDAgMjIuNSAwIDUwLjJjMCAyNy43IDIyLjUgNTAuMSA1MC4yIDUwLjF6Ii8+PHBhdGggb3BhY2l0eT0iLjgiIGZpbGw9IiNGRkYiIGQ9Ik03MS40IDQ5LjlMMzguMiA3NC43bC4xLTQ5LjUgMzMuMSAyNC43eiIvPjwvc3ZnPg==) center center no-repeat;transition:opacity .2s ease-out;z-index:2}.wp-player .npp-container.skinDefault .endscreen.loaded .thumbCont .relThumb:hover .relThumbIkon{opacity:1}.wp-player .npp-container.skinDefault .endscreen .thumbCont .relThumb .relThumbTitleBorder{position:absolute;width:calc(100% - 6px);height:calc(100% - 6px);top:0;left:0;border:3px solid #ED1C24;opacity:0;transition:opacity .1s ease-out}.wp-player .npp-container.skinDefault .endscreen.loaded .thumbCont .relThumb:first-child .relThumbTitleBorder,.wp-player .npp-container.skinDefault .endscreen.loaded .thumbCont .relThumb:hover .relThumbTitleBorder{opacity:1}.wp-player .npp-container.skinDefault .endscreen,.wp-player .npp-container.skinDefault .endscreen .endScreenBg{position:absolute;top:0;left:0;width:100%;height:100%}.wp-player .npp-container.skinDefault .endscreen .endScreenBg{position:relative}.wp-player .npp-container.skinDefault .endscreen .btnEnd{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);cursor:pointer}.wp-player .npp-container.skinDefault .endscreen .btnEnd .btnEndScrReplay{width:28px;height:28px;margin:0 auto;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTguMSAwQzUuNyAwIDMuNCAxLjIgMiAzLjFsLS4yLS43Yy0uMi0uNC0uNy0uNy0xLjItLjVDLjEgMi0uMSAyLjUgMCAzbDEgMi43Yy4xLjQuNS42LjkuNmguM2wyLjctLjljLjUtLjIuNy0uNy42LTEuMS0uMy0uNS0uOC0uOC0xLjMtLjZsLS41LjFjMS4xLTEuMyAyLjctMiA0LjUtMiAzLjIgMCA1LjkgMi42IDUuOSA1LjlzLTIuNiA1LjktNS45IDUuOWMtMi41IDAtNC43LTEuNS01LjUtMy45bC0xLjcuNmMxLjEgMyA0IDUgNy4yIDUgNC4yIDAgNy43LTMuNCA3LjctNy43QzE1LjggMy40IDEyLjQgMCA4LjEgMCIvPjwvc3ZnPg==) center center no-repeat;background-size:contain}.wp-player .npp-container.skinDefault .endscreen .btnEnd .infoEndScr{color:#fff;width:auto;font-size:1.5em;text-align:center;padding-top:10px}';})(),
		skinName = 'skinDefault',
		Skin = function(conf, options) {
			var pub, uiconfig, stack = {},
				relApi,
				$style, $rootNode = options.target,
				$parentTarget = options.parentTarget,
				$hub = options.hub,
				advClass = options.advClass,
				skinStates = ['playing', 'paused'],
				/* nody do wyrenderowania skina (UWAGA! stosować unikalne klucze bo są odkładane na stos jako identyfikatory)*/
				nodes = {
					top: {
						class: 'top',
						children: {
							topcont: {
								class: 'topcont',
								children: {
									titlecont: {
										class: 'titlecont',
										children: {
											bg: {
												class: 'bg'
											},
											title: {
												tag:'a',
												class: 'title'
											},
											btninfo: {
												class: 'btninfo',
												action: {
													event: 'click',
													trigger: 'clickBtnInfo',
													localTrigger: 'showInfo'}
											}
										}
									}
								}
							},
							topikonage: {
								class: 'age'
							}
						}
					},
					bottom: {
						class: 'bottom',
						children: {
							bottomgradients: {
								class: 'bottomgradients',
								children: {
									bottombgprogress: {
										class: 'bottombgprogress'
									},
									bottombg: {
										class: 'bottombg'
									}
								}
							},
							seek: {
								class: 'seek',
								action: {
									event: 'click',
									trigger: 'sliderSeek'
								},
								children: {
									seekcont: {
										class: 'seekcont',
										children: {
											buffer: {
												class: 'buffer'
											},
											progress: {
												class: 'progress'
											}
										},
										action: {
											event:'mouseup',
											localTrigger: 'onSeekUp'
										}
									},
									handler: {
										class: 'handler',
										action: {
											event:'mousedown',
											localTrigger: 'onSeekHandlerDown'
										}
									}
								}
							},/*
							qualityOptions: {
								class: 'qualityoptions'
							},*/
							controls: {
								class: 'bcontrols',
								children: {
									btnplay: {
										class: 'btnplay',
										action: {
											event: 'click',
											trigger: 'clickControlBtnPlay'
										}
									},
									time: {
										class: 'time'
									},
									/*ainfo: {
										class: 'ainfo'
									},*/
									btnfullscreen: {
										class: 'btnfullscreen',
										action: {
											event: 'click',
											trigger: 'clickBtnFullScreen'
										}
									},
									btnquality: {
										class: 'btnquality tooltip',
										exclude: 1,
										action: {
											event: 'click',
											trigger: 'setQuality'
											/*trigger: 'clickBtnQuality',
											localTrigger: 'showQualityOptions',
											localData: ''*/
										},
										children: {
											btnqualitytooltip: {
												tag:'span',
												class:'tooltipcloud',
												content:'Wy\u0142\u0105cz HD'
											}
										}
									},
									volcontrol: {
										class: 'volcontrol',
										children: {
											btnmute: {
												class: 'btnmute',
												action: {
													event: 'click',
													trigger: 'clickBtnMute'
												}
											},
											volslider: {
												class: 'volslider',
												action: {
													event: 'click',
													trigger: 'sliderVolume'/*,
													sliderEvents: {
														mouseDown:'onVolumeMouseDown',
														mouseMove:'onVolumeMouseMove',
														mouseUp:'onVolumeMouseMove'
													}*/
												},
												children: {
													volsliderCont: {
														class: 'volSliderCont',
														children: {
															volsliderbg: {
																class: 'volsliderbg'
															},
															volsliderset: {
																class: 'volsliderset'
															}
														},
														action: {
															event:'mousedown',
															localTrigger: 'onVolHandlerDown'
														}
													},
													volSliderHandler: {
														class: 'volSliderHandler',
														action: {
															event:'mousedown',
															localTrigger: 'onVolHandlerDown'
														}
													}
												}
											}
										}
									},
									ainfocont: {
										class: 'ainfo',
										children: {
											ainfoTime: {
												class: 'atime'/*,
												content: 'Reklama 23s'*/
											},
											ainfo: {
												class: 'adesc'/*,
												content: 'Dzi\u0119ki reklamie ogl\u0105dasz wszystko za darmo!'*/
											}
										}
									}
								}
							}
						}
					},
					identifier: {
						class: 'identifier',
						action: {
							event: 'contextmenu',
							localTrigger: 'getClipIdentifier'
						}
					},
					btnplaybig: {
						class: 'btnplaybig',
						action: {
							event: 'click',
							trigger: 'clickBtnPlay'
						}
					},
					btnspeakerup: {
						class: 'btnspeakerup'
					},
					btnspeakerdown: {
						class: 'btnspeakerdown'
					}
					/*,
					windowcont: {
						class: 'windowcont'
					}*/
				},
				style = {
					rootClassName: skinName,
					content:String(SKIN_STYLES)
					//content:String(SKIN_STYLES).replace(/dynamicClassName/gim, advClass)
				},

				init = function() {
					if (!$rootNode) {
						//console.log('error skin, brak elementu $rootNode - nie wiadomo gdzie wyrenderować skina', name);
						return;
					}

					// dodanie identyfikacji css dla tego skina
					$rootNode.addClass(skinName);
					// wciskamy css do dokumentu
					insertStyle();
				},

				insertStyle = function() {
					if (style && style.content) {
						style.content = style.content.replace(/dynamicClassName/gim, advClass);
						$style = document.createElement('style');
						$($style).text(style.content);
						document.body.appendChild($style);
					}
				},

				setUiConfig = function(newconf) {
					//console.log('skin.setUiConfig', newconf);
					uiconfig = extend(uiconfig, newconf);
					render();
				},
				getUIConfig = function(k) {
					if (uiconfig[k] !== null && typeof uiconfig[k] !== 'undefined') {
						return uiconfig[k];
					}
					return null;
				},

				uistates = ['normal', 'live', 'special'],

				render = function() {
					if (typeof uiconfig.mode === 'string' && !$rootNode.hasClass( uiconfig.mode )) {
						var i;
						for (i = 0; i < uistates.length; i++) {
							$rootNode.removeClass(uistates[i]);
							$parentTarget.removeClass(uistates[i]);
						}
						$rootNode.addClass( uiconfig.mode );
						$parentTarget.addClass( uiconfig.mode );
					}
					/*if (uiconfig.special) {
						$rootNode.addClass('special');
					} else {
						$rootNode.removeClass('special');
					}*/
					for (var n in nodes) {
						renderNode($rootNode, nodes[n], n);
					}
				},
				renderNode = function($root, node, nodeName) {
					var n, $el, display, nodeAction = node.action;

					if (!getSkinEl(nodeName)) {
						$el = $(document.createElement(node.tag || 'div'));
						// dodanie nowego elementu do stosu
						stackAdd(nodeName, $el);
						// append nowego elementu do DOM-u
						$root.append($el);
						// setup
						if (node.class) {
							$el.addClass(node.class);
						}
						if (node.content) {
							$el.html(node.content);
						}
						if (node.style) {
							$el.css(node.style);
						}
						if (node.exclude) {
							$el.data('exclude', node.exclude);
						}
					}
					if (!$el) {
						// tylko update z configu na istniejącym elemencie
						$el = getSkinEl(nodeName);
					}

					// action
					if (nodeAction) {
						if (nodeAction.trigger) {
							// dispatch do core playera
							$el.data('trigger', nodeAction.trigger);
							$el.unbind(nodeAction.event, dispatchSkinEvent);
							$el.bind(nodeAction.event, dispatchSkinEvent);
						}
						if (nodeAction.localTrigger) {
							// dispatch w obrębie skina
							$el.data('localTrigger', nodeAction.localTrigger);
							$el.data('localData', nodeAction.localData);
							$el.unbind(nodeAction.event, dispatchLocalSkinEvent);
							$el.bind(nodeAction.event, dispatchLocalSkinEvent);
						}
					}
					// update parametrów z uiconfig
					if (typeof getUIConfig(nodeName) !== 'undefined') {
						// widoczność elementu z uiconfig
						if (typeof getUIConfig(nodeName) === 'boolean') {
							if (!$el.data('exclude')) {
								// tylko elementy nie wyłączone z render flow - pozostałe sterowane niezależnie
								display = (getUIConfig(nodeName) === true) ? 'block' : 'none';
								$el.css({
									display: display
								});
							}
						} else if (typeof getUIConfig(nodeName) === 'string') {
							// content elementu z uiconfig - tylko statyczne teksty np: adTekst: "Dzięki reklamie oglądasz" || false || ""
							//if (nodeName === 'ainfo') {
							//	$el.html(getUIConfig(nodeName));
							//}
							if (nodeName === 'ainfo') {
								if ( $rootNode.width() > 400 ) {
									$el.html(getUIConfig(nodeName));
								}
								else {
									$el.html('');
								}
							}
						}
					}

					// render next child
					if (node.children) {
						for (n in node.children) {
							renderNode($el, node.children[n], n);
						}
					}
				},
				stackAdd = function(name, $el) {
					stack[name] = $el;
				},
				// zwraca element skina po nazwie z definicji nodes
				getSkinEl = function(name) {
					return stack[name];
				},
				removeSkinEl = function(name) {
					if (stack[name]) {
						stack[name].remove();
						delete stack[name];
					}
				},
				// TODO: do przerobienia, aby el potomne były usuwane zawsze z metody removeSkinEl na podstawie rodzica
				removeNestedElements = function(list) {
					var l = list.split(' '),
						name = l.pop();
					while (name) {
						removeSkinEl(name);
						name = l.pop();
					}
				},

				// ustawienie danych na skinie (np title, minimalAge, lista jakości, dane czasowe)
				setData = function(d) {
					if (!d) {
						return;
					}
					setState(d.state);
					setTitle(d.data || null);
					setAgeIkon(d.data || null);
					setDescription(d.data || null);
					setQualityOptions(d);
					setQuality(d);
					setIdentifier(d);

					relApi.setConfig('currentClip', d.data || null);

					if (automute && getSkinEl('automuteBtn')) {
						// ustawienie stanu automute po endscreen
						$rootNode.removeClass('automute');
						$rootNode.addClass('automute');
						getSkinEl('automuteBtn').removeClass('minAge');
						if (d.data.minimalAge) {
							getSkinEl('automuteBtn').addClass('minAge');
						}
						getSkinEl('automuteBtn').show();
					}
				},

				// zmiany na ui skina
				// zmiana stylu globalnego dla skina - dodanie klasy css do głównego noda
				setState = function(state) {
					//console.log('Skin.setState', state);
					if (skinStates.indexOf(state) === -1) {
						return;
					}
					// czyszczenie poprzednich klas
					for (var i = 0; i < skinStates.length; i++) {
						$rootNode.removeClass(skinStates[i]);
					}
					// dodanie klasy wynikającej z aktualnego stanu playera (playing, paused, ...)
					$rootNode.addClass(state);

					// po play z api czyszczenie related oraz pokazanie ukrytego ui
					if (state === 'playing') {
						relApi.destroy();
						setUiConfig(uiconfig);
					}
				},
				toggleShortcutIcons = function(icon) {
					var icon = getSkinEl(icon);

					icon.addClass('fadein');
					icon.removeClass('fadeout');
					setTimeout(function(){
						icon.removeClass('fadein');
						icon.addClass('fadeout');
					}, 100);

				},
				messages = {
					content:{
						adblock:{
							info1:'Dzi\u0119ki reklamom mo\u017cesz ogl\u0105da\u0107 filmy za darmo!',
							info2:'Masz w\u0142\u0105czone blokowanie reklam, co uniemo\u017cliwia odtworzenie filmu. Wy\u0142\u0105cz blokowanie (np. Adblock lub inne), aby zobaczy\u0107 film. (kod b\u0142\u0119du:<[[CODE]]>)'
						},
						videoError:{
							info1:'b\u0142\u0105d odtwarzania materia\u0142u wideo',
							info2:''
						},
						networkError:{
							info1:'Problem z sieci\u0105',
							info2:''
						},
						noclip:{
							info1:'Brak klipu',
							info2:''
						}
					},
					codemap:{
						'10':'adblock',
						'11':'adblock',
						'12':'adblock',
						'13':'adblock',
						'15':'adblock',
						'16':'adblock',
						'20':'videoError',
						'21':'videoError',
						'50':'networkError',
						'51':'noclip',
						'52':'networkError'
					}
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
					*/
				},

				showMessage = function(code) {
					// sprawdzenie czy istnieje komunikat dla podanego code
					if (typeof messages.codemap[code] === 'undefined') {
						//console.log( 'SkinDefault -> showMessage - brak komunikatu dla kodu:', code);
						return;
					}
					//console.log( 'SkinDefault -> showMessage', code);


					removeSkinEl('windowErrCont');
					// tymczasowo tu - TODO: - zrobić usuwanie potomków na metodzie removeSkinEl
					removeNestedElements('errcont errdesc1 errdesc2');

					var desc1 = messages.content[messages.codemap[code]].info1, //'Dzięki reklamom możesz oglądać filmy za darmo!',
						desc2 = messages.content[messages.codemap[code]].info2.replace('[[CODE]]', code), //'Masz włączone blokowanie reklam, co uniemożliwia odtworzenie filmu. Wyłącz blokowanie (np. Adblock lub inne), aby zobaczyć film. (kod błędu:<' + code + '>)',
						toRender = {
							class: 'windowErrCont',
							children: {
								errcont: {
									class: 'errCont',
									children: {
										errdesc1: {
											class: 'errDesc1',
											content: desc1
										},
										errdesc2: {
											class: 'errDesc2',
											content: desc2
										}
									}
								}
							}
						};
						renderNode($rootNode, toRender, 'windowErrCont');
						getSkinEl('windowErrCont').show();
				},

				hideMessage = function() {
					removeSkinEl('windowErrCont');
					removeNestedElements('errcont errdesc1 errdesc2');
				},

				setIdentifier = function(d) {
					var div = getSkinEl('identifier');

					div.data('id', d.data.mid || d.data.lid || d.data.url);
				},

				setTitle = function(d) {
					var t = getSkinEl('title');
					if (d && typeof d.title === 'string') {
						t.removeAttr('href');
						if (typeof d.titleUrl === 'string' && d.titleUrl.length > 0) {
							t.attr({
								href: d.titleUrl,
								target: "_blank"
							});
						}
						t.html(d.title);
					}
				},
				setDescription = function(d) {
					//console.log('setDescription', d);
					var description, minimalAge, title, source, durationDesc, b = getSkinEl('btninfo');
					if (d && d.description && d.description.length) {
						description = d.description;
						minimalAge = d.minimalAge;
						title = d.title;
						source = d.source;
						durationDesc = d.durationDesc;
						b.data('description', description);
						if (typeof minimalAge !== 'undefined') {
							b.data('minimalAge', minimalAge);
						}
						if (typeof title !== 'undefined') {
							b.data('title', title);
						}
						if (typeof durationDesc !== 'undefined') {
							b.data('durationDesc', durationDesc);
						}
						if (typeof source !== 'undefined') {
							b.data('source', source);
						}
						$(b).show();
					} else {
						$(b).hide();
						b.data('localData', '');
					}
				},
				setAgeIkon = function(d) {
					var a = [0,7,12,16,18],
						ikon = getSkinEl('topikonage'),
						t = getSkinEl('title'),
						i;
					if (d && typeof d.minimalAge !== 'undefined') {
						for (i=0; i<a.length; i++) {
							ikon.removeClass('age' + a[i]);
						}
						ikon.addClass('age' + d.minimalAge);
					}

					// update pozycji tytułu
					if (d && d.minimalAge) {
						t.addClass('ikon');
					}
					else {
						t.removeClass('ikon');
					}
				},
				// ustawienie listy dostepnych jakości
				setQualityOptions = function(data) {
					var d = data.qualityOptions;
					/*var i, toRender = {
						class: 'qualityoptions',
						children: {}
					};
					// czyszczenie istniejącego elementu
					clearQualityOptions();
					*/
					// spr ilosci - tworzymy liste dla przynajmniej dwóch opcji
					if (d && d.length > 1) {
						/*for (i = 0; i < d.length; i++) {
							toRender.children['qualityitem' + i] = {
								class: 'qualityitem',
								content: d[i],
								action: {
									event: 'click',
									localTrigger: 'setQuality',
									trigger: 'setQuality',
									localData: '{"id":"' + i + '","label":"' + d[i] + '"}'
								}
							};
						}
						renderNode(getSkinEl('bottom'), toRender, 'qualityOptions');*/
						getSkinEl('btnquality').show();
					} else {
						// ukrywamy button jakości
						getSkinEl('btnquality').hide();
					}
				},
				// czyszczenie listy jakosci
				clearQualityOptions = function() {
					var i = 0,
						itemName = 'qualityitem' + i;
					while (getSkinEl(itemName)) {
						removeSkinEl(itemName);
						itemName = 'qualityitem' + (++i);
					}
					getSkinEl('qualityOptions').empty();
					getSkinEl('qualityOptions').hide();
				},
				// zmiana jakości
				setQuality = function(data) {
					var q = data.quality;
					if (typeof q === 'undefined') {
						return;
					}
					var b = getSkinEl('btnquality'),
						c = getSkinEl('btnqualitytooltip');
					if (typeof parseInt(q) === 'number') {
						// ustawienie labelki buttona:
						b.removeClass('bhd');
						c.html('Włącz HD');
						if (!q) {
							b.addClass('bhd');
							c.html('Wyłącz HD');
						}
					}
					/*
					if (typeof q === 'undefined') {
						return;
					}
					var i = 0,
						c = 'active',
						itemName = 'qualityitem' + i;
					while (getSkinEl(itemName)) {
						getSkinEl(itemName).removeClass(c);
						itemName = 'qualityitem' + (++i);
					}
					if (typeof parseInt(q) === 'number') {
						if (typeof getSkinEl('qualityitem' + q) !== 'undefined') {
							getSkinEl('qualityitem' + q).addClass(c);
							// ustawienie labelki buttona:
							//getSkinEl('btnquality').html( getSkinEl('qualityitem' + q).data('localData') );
							getSkinEl('btnquality').html(getSkinEl('qualityitem' + q).html());
						} else {
							// ustawienie domyślnej przy błędzie indeksu
							getSkinEl('btnquality').html('auto');
							//console.log('niepoprawny indeks elementu listy poza zakresem', 'qualityitem' + q);
						}
					}
					*/
				},
				showQualityButton = function() {
					getSkinEl('btnquality').show();
				},
				hideQualityButton = function() {
					getSkinEl('btnquality').hide();
				},
				// aktualizacja danych czasowych na skinie
				setTimeData = function(data) {
					if (data) {
						if (typeof data.position === 'number') {
							setPosition(data.position);
						}
						setBuffer(data.buffer || 0);
						if (typeof data.currentTime === 'number') {
							setTime(data.currentTime, data.duration);
						}
					}
				},
				setPosition = function(v) {
					if (seekslideractive) {
						return;
					}
					var p = v * 100 + '%';
					getSkinEl('progress').width(p);
					getSkinEl('handler').css('left', p);
					getSkinEl('bottombgprogress').width( (parseFloat(getSkinEl('progress').width()) + parseFloat( getSkinEl('seek').css('left') )) || 1);
				},
				setBuffer = function(v) {
					$(getSkinEl('buffer')).width(v * 100 + '%');
				},
				setTime = function(cur, dur) {
					// $(getSkinEl('time')).html(getTimeFormat(cur, dur));
					// aktualizacja czasu w nowym elemencie ainfoTime ( tylko dla reklamy )
					if (getUIConfig('timeMode') === 'reverse') {
						$(getSkinEl('time')).html('');
						$(getSkinEl('ainfoTime')).html(getTimeFormat(cur, dur));
					}
					else {
						// wyświetlaenie czasu normalnie w elemencie time
						$(getSkinEl('time')).html(getTimeFormat(cur, dur));
						$(getSkinEl('ainfoTime')).html('');
					}
				},
				getTimeFormat = function(cur, tot) {
					var timeStr = '';
					cur = isNaN(cur) ? 0 : cur;
					tot = isNaN(tot) ? 0 : Number(tot);

					if (getUIConfig('timeMode') === 'onlyCurrentTime') {
						timeStr = getNPPModelTime(cur);
					} else {
						timeStr = getNPPModelTime(cur) + '<span> / ' + getNPPModelTime(tot) + '</span>';
					}

					if (getUIConfig('timeMode') === 'reverse') {
						timeStr = '<span>Reklama ' + parseInt(tot - cur, 10) + 's</span>';

					}
					return timeStr;
				},
				getNPPModelTime = function(ctime) {
					ctime = Math.max(ctime, 0);
					var sr = Math.floor(ctime % 60),
						s = sr < 10 ? '0' + sr : sr,
						mr = Math.floor(ctime / 60),
						m = mr < 10 ? '0' + mr : mr;
					return m + ':' + s;
				},

				automute = false,

				setVolume = function(data) {
					var vol = Number(data.volume),
						b = getSkinEl('btnmute'),
						h = $(getSkinEl('volSliderHandler')),
						bg = getSkinEl('volsliderbg'),
						ch = 'half',
						c = 'x',
						proc = vol * 100 + '%',
						toRender,
						automuteBtn = 'automuteBtn',
						$automuteBtn;

					automute = data.automute;

					$(getSkinEl('volsliderset')).width(proc);
					h.css({left:proc});
					// update mute btn
					b.removeClass(ch);
					if (vol > 0) {
						b.removeClass(c);
						if (vol < 0.5) {
							b.addClass(ch);
						}
						bg.removeClass(c);
						h.removeClass(c);

					} else {
						b.addClass(c);
						bg.addClass(c);
						h.addClass(c);
					}

					// btn automute - autosundoff
					removeAutomute();
					if (typeof automute === 'boolean' && automute) {
						if (!$automuteBtn) {
							toRender = {
								class: automuteBtn,
								/*action: {
									event: 'click',
									trigger: 'clickBtnAutomute'
								},*/
								content: '<svg x="0px" y="0px" viewBox="0 0 60 60""><style type="text/css">.st0{fill-opacity:0.5;}.st1{fill:#FFFFFF;}</style><g><g><path class="st0" d="M30,60c16.6,0,30-13.4,30-30S46.6,0,30,0S0,13.4,0,30S13.4,60,30,60z"/><circle cx="-30" cy="30" fill-opacity="0" r="27" stroke="#ED1C24" stroke-width="2" stroke-dasharray="620" stroke-dashoffset="620" transform="rotate(-90)"></circle><g transform="translate(15.000000, 19.000000)"><g id="Fill-2"><g><polygon class="st1" points="7.1,5.7 13.1,0 13.1,21.7 7.1,15.9 0,15.9 0,5.7"/></g></g><path id="Fill-2_1_" class="st1" d="M26.1,10.8l3.1-3.2c0.6-0.6,0.6-1.6,0-2.2c-0.6-0.6-1.5-0.6-2.1,0L24,8.6l-3.1-3.2c-0.6-0.6-1.5-0.6-2.1,0c-0.6,0.6-0.6,1.6,0,2.2l3.1,3.2L18.8,14c-0.6,0.6-0.6,1.6,0,2.2c0.3,0.3,0.7,0.5,1.1,0.5c0.4,0,0.8-0.2,1.1-0.5L24,13l3.1,3.2c0.3,0.3,0.7,0.5,1.1,0.5c0.4,0,0.8-0.2,1.1-0.5c0.6-0.6,0.6-1.6,0-2.2L26.1,10.8z"/></g></g></g></svg>'
							};
							renderNode(getSkinEl('top'), toRender, automuteBtn );
							//renderNode($rootNode, toRender, automuteBtn );
							// aktualizacja elementów ikony play w pasku bottom (ma być play zamiast pauzy podczas cichego odtwarzania)
							$rootNode.addClass('automute');
							$automuteBtn = getSkinEl(automuteBtn);
							// zbindowanie mouseenter mouseleave na ikonce
							$rootNode.bind('mouseenter', automuteHover);
							$rootNode.bind('mouseleave', automuteOut);
							$automuteBtn.bind('click', onautoMuteTimerComplete);
							//
							autoMuteCounter.clear();
							autoMuteCounter.setCallback('onCompleteCallback', onautoMuteTimerComplete);
							autoMuteCounter.setCallback('onTime', onautoMuteTimerCount);
						}
						// gdy zbudowane - robimy tylko show
						$automuteBtn.show();
					}
				},

				automuteHover = function(e) {
					if (!autoMuteCounter.running){
						autoMuteCounter.clear();
						autoMuteCounter.reset();
						autoMuteCounter.start();
					}
					autoMuteCounter.running += 1;
				},

				automuteOut = function(e) {
					autoMuteCounter.running -= 1;
					if (!autoMuteCounter.running){
						//if ( e.target.nodeName.toLowerCase() !== 'iframe' ) {
						// wykluczenie iframe -imasdk na mouseleave
						autoMuteCounter.clear();
						autoMuteCounter.reset();
						automuteIkonClearProgress();
					}
				},

				onautoMuteTimerComplete = function(e) {
					automuteIkonClearProgress();
					destroyAutomute();
					//removeAutomute();

					dispatchSkinEvent(null, {eventName:'clickBtnAutomute', clicked: e.type === 'click'});
				},

				automuteIkonClearProgress = function() {
					var $autoBtn = getSkinEl('automuteBtn'),
						$animEl;

					if($autoBtn){
						$animEl = $autoBtn.find('svg circle').eq(0);
					}

					if ($autoBtn || $animEl) {
						$animEl.attr('stroke-dasharray', 620 );
					}
				},

				onautoMuteTimerCount = function(dt) {
					// automuteBtn
					if ( getSkinEl('automuteBtn') ) {
						var $animEl = getSkinEl('automuteBtn').find('svg circle').eq(0);
						var from = 620,
							to = 790,
							delta = 40,
							dist = to - from;

						// animka po okręgu
						if ($animEl) {
							$animEl.attr('stroke-dasharray', (from + (dist/delta * (delta-dt+1))) );
						}
					}
				},

				// usunięcie ikony automute
				removeAutomute = function() {
					autoMuteCounter.clear();
					autoMuteCounter.reset();
					var $automuteBtn = getSkinEl('automuteBtn');
					if ($automuteBtn) {
						$automuteBtn.hide();
					}
					//removeSkinEl('automuteBtn');
					$rootNode.removeClass('automute');
				},

				destroyAutomute = function() {
					autoMuteCounter.clear();
					autoMuteCounter.reset();
					var $automuteBtn = getSkinEl('automuteBtn');
					if ($automuteBtn) {
						$rootNode.unbind('mouseenter', automuteHover);
						$rootNode.unbind('mouseleave', automuteOut);
						$automuteBtn.unbind('click', onautoMuteTimerComplete);
					}
					removeSkinEl('automuteBtn');
					$rootNode.removeClass('automute');
					automute = false;
				},

				// dispatch eventa lokalnie w obrębie skina
				dispatchLocalSkinEvent = function(e) {
					if ($(e.currentTarget).data('localTrigger')) {
						fireLocalAction(e);
					}
				},
				fireLocalAction = function(e) {
					var $el = $(e.currentTarget),
						localAction = $el.data('localTrigger'),
						data = {
							e: e,
							$el: $el,
							data: $el.data('localData') || null
						};

					if (typeof local[localAction] === 'function') {
						local[localAction](data);
					} else {
						//console.log('brak lokalnej metody :', localAction);
					}
				},

				volslideractive = false,
				seekslideractive = false,
				// akcje ui wykonywane na skinie lokalnie
				local = {
					oldVolume:-1,
					onSeekUp: function(d) {
						// zmiana warunku na potrzeby plywajacego playera
						// przy dragu na scrollu robila sie przyklejka
						if (d.e.preventDefault && !$parentTarget.hasClass('floating')) {
							d.e.preventDefault();
							d.e.stopPropagation();
						}
						var $seekcont = getSkinEl('seekcont'),
							x = pointerEventToXY(d.e).x,
							p = Math.max(Math.min(( x - $seekcont.offset().left) / $seekcont.width(), 1), 0);

						if (p < .0001) p = 0;
						if (p <= 1) {
							if (p >= 0) {
								local.setPosition(p);
								//dispatchSkinEvent(null, {eventName:'sliderSeek', pos:p });
							}
						}
						//setHidden(true);
					},
					// mousedown na handlerze seek-a
					onSeekHandlerDown: function(d) {
						if (d.e.preventDefault) {
							d.e.preventDefault();
							d.e.stopPropagation();
						}
						var w = $(window);
						w.unbind('mousemove', local.onSeekHandlerMove);
						w.unbind('mouseup', local.onSeekHandlerUp);

						w.bind('mousemove', local.onSeekHandlerMove);
						w.bind('mouseup', local.onSeekHandlerUp);

						seekslideractive = true;
					},
					onSeekHandlerMove: function(e) {
						local.updatePos(e);
						// show/hide skin ui - aby zapobiec ukryciu ui poodczas dragowania
						var cl = 'visible',
							$seek = getSkinEl('seek');
						if ( !$seek.hasClass(cl) ) {
							$seek.addClass(cl);
						}
					},
					onSeekHandlerUp: function(e) {
						var w = $(window),
							p = local.updatePos(e),
							cl = 'visible',
							$seek = getSkinEl('seek');

						if (e.preventDefault) {
							e.preventDefault();
							e.stopPropagation();
						}

						//dispatchSkinEvent(null, {eventName:'sliderSeek', pos:p });
						w.unbind('mousemove', local.onSeekHandlerMove);
						w.unbind('mouseup', local.onSeekHandlerUp);

						seekslideractive = false;
						if ( $seek.hasClass(cl) ) {
							$seek.removeClass(cl);
						}
					},
					updatePos: function(e) {
						var $slider = getSkinEl('seek'),
							x = pointerEventToXY(e).x,
							p = 0;

						if (seekslideractive) {
							p = Math.max(Math.min(( x - $slider.offset().left) / $slider.width(), 1), 0);
							if (p < .0001) p = 0;
							if (p <= 1) {
								if (p >= 0) {
									local.setPosition(p);
								}
							}
						}
						return p;
					},
					setPosition: function(v) {
						var p = v * 100 + '%';
						getSkinEl('progress').width(p);
						getSkinEl('handler').css('left', p);
						getSkinEl('bottombgprogress').width( parseFloat(getSkinEl('progress').width()) + parseFloat( getSkinEl('seek').css('left') ) );
					},

					sendVolume:function(end){
						var $handler = getSkinEl('volSliderHandler'),
							$slider = getSkinEl('volslider'),
							vol = parseInt($handler.css('left'))/parseInt($slider.width());
						/*if (local.oldVolume !== vol){
							local.oldVolume = vol;*/
							dispatchSkinEvent(null, {eventName:'sliderVolume', pos:vol, end:end });
						//}
					},

					// mousedown na handlerze kontrolki volume
					onVolHandlerDown: function(d) {
						if (d.e.preventDefault) {
							d.e.preventDefault();
							d.e.stopPropagation();
						}
						$(document).unbind('mousemove', local.onVolHandlerMove);
						$(document).bind('mousemove', local.onVolHandlerMove);

						$(document).unbind('mouseup', local.onVolHandlerUp);
						$(document).bind('mouseup', local.onVolHandlerUp);
						volslideractive = true;
					},
					onVolHandlerMove: function(e) {
						//var $handler = getSkinEl('volSliderHandler'),
						var $slider = getSkinEl('volslider'),
							p = 0;

						if (e.preventDefault) {
							e.preventDefault();
						}
						if (volslideractive) {
							//console.log('move', e.currentTarget);
							p = Math.max(Math.min((e.pageX - $slider.offset().left) / $slider.width(), 1), 0);
							if (p < .05) p = 0;
							if (p <= 1) {
								if (p >= 0) {
									setVolume({volume:p});
								}
							}
							// zabezpieczenie aby kontrolka nie znikała po dragowaniu poza obszarem hover
							var cl = 'visible',
								$volslider = getSkinEl('volslider');
							if ( !$volslider.hasClass(cl) ) {
								$volslider.addClass(cl);
							}
						}
						local.sendVolume();
					},
					onVolHandlerUp: function(e) {
						volslideractive = false;
						$(document).unbind('mousemove', local.onVolHandlerMove);
						$(document).unbind('mouseup', local.onVolHandlerUp);

						local.sendVolume(true);
						// zabezpieczenie aby kontrolka nie znikała po dragowaniu poza obszarem hover
							var cl = 'visible',
								$volslider = getSkinEl('volslider');
							if ( $volslider.hasClass(cl) ) {
								$volslider.removeClass(cl);
							}
					},
					getClipIdentifier: function(d) {
						d.e.preventDefault();
						d.e.stopPropagation();

						var div = getSkinEl('identifier');

						if (div.text().length > 0) {
							div.text("");
							div.removeClass('identifierVisible');

							return;
						}

						div.text(div.data('id'));
						div.addClass('identifierVisible');
					},

					// pokazanie dostepnych opcji jakości
					showQualityOptions: function() {
						getSkinEl('qualityOptions').toggle();
					},
					setQuality: function(data) {
						getSkinEl('qualityOptions').hide();
					},
					// pokazanie  okna z info
					showInfo: function(d) {
						//console.log('showInfo', d);
						//showMessage(16);
						//return;

						removeSkinEl('windowcont');
						// tymczasowo tu - TODO: - zrobić usuwanie potomków na metodzie removeSkinElw sens
						removeNestedElements('infocont winage wintitle winduration windescription winsource winbtnclose');
						var description = d.$el.data('description'),
							minimalAge = d.$el.data('minimalAge') || '0',
							title = d.$el.data('title'),
							durationDesc = d.$el.data('durationDesc'),
							source = d.$el.data('source') || '',
							toRender = {
								class: 'windowcont',
								children: {
									infocont: {
										class: 'infocont',
										children: {
											winbtnclose: {
												class: 'close',
												action: {
													event: 'click',
													trigger: 'clickBtnCloseInfoWindow',
													localTrigger: 'closeInfoWindow',
													localData: ''
												}
											},
											winage: {
												class: 'age age' + minimalAge
											},
											wintitle: {
												class: 'title',
												content: title
											},
											winduration: {
												class: 'duration',
												content: durationDesc
											},
											windescription: {
												class: 'description',
												content: description
											},
											winsource: {
												class: 'source',
												content: source
											}
										}
									}
								}
							};
						renderNode($rootNode, toRender, 'windowcont');
						getSkinEl('windowcont').show();

						// dodanie klasy wyłączejącej hovera na skinie pod oknem
						$rootNode.removeClass('nohover');
						$rootNode.addClass('nohover');
					},
					closeInfoWindow: function() {
						$rootNode.removeClass('nohover');
						removeSkinEl('windowcont');
					},
					clickRelatedItem: function() {
						relApi.destroy();
					},
					clickReplayBtn: function() {
						relApi.destroy();
					},
					clickFirstBtn: function() {
						relApi.destroy();
					}
				},


				// wyswietlenie ekranu końcowego
				endScreen = function(d) {
					// symulacja nieotrzymanych danych
					//d = null;
					if (!d){
						// przy braku danych
						d = {
							isRelated: false,
							isFirst: false
						};
					}

					// !!! do sprawdzenia - przeniesione z Core.end()
					// zmiana widoczności elementów ui bez zapamiętywania w skin.configui


					getSkinEl('top').hide();
					getSkinEl('bottom').hide();
					getSkinEl('btnplaybig').hide();

					/*
					setUiConfig({
						top: false,
						bottom: false,
						btnplaybig: false
					});
					*/
					relApi.renderEndScreen(d);
					removeAutomute();
				},

				setRelated = function(d) {
					//d = null;
					if (!d) {
						relApi.destroy();
						return;
					}
					//setTimeout( function() {
						relApi.setData(d);
					//},5000);
				},

				showRelated = function(d){

				},

				// wydzielona logika related
				RelApi = function() {
					var data = {},
					// licznik
					ct,
					$animEl,
					config = {
						currentClip:{},
						maxDataCount:0,
						isRelated:false,
						isFirst:false
					},
					ui = {
						root:'endscreen',
						toRenderRelated: {
							class: 'endscreen',
							children: {
								relBg: {
									class: 'relBg'
								},
								relHeader: {
									class:'relHeader',
									children: {
										btnBackToFirst: {
											class: 'btnBackToFirst'
										},
										currentClipHeader: {
											class: 'currentClipHeader'
										}
									}
								},
								nextClipCont: {
									class: 'nextClipCont',
									children: {}
								},
								thumbCont: {
									class: 'thumbCont',
									children:{}
								}
							}
						},
						toRenderEndScreen: {
							class: 'endscreen',
							children: {
								endscreenbg: {
									class: 'endScreenBg'
								},
								btnend:{
									class: 'btnEnd',
									action: {
										event: 'click',
										trigger: 'clickReplayBtn',
										localTrigger: 'clickReplayBtn'
									},
									children: {
										btnendscrreplay: {
											class: 'btnEndScrReplay'
										},
										infoendscrreplay: {
											class: 'infoEndScr',
											content: 'OBEJRZYJ JESZCZE RAZ'
										}
									}
								}
							}
						},
						rendered: []
					},
					getConfig = function(n) {
						return config[n];
					},
					setConfig = function(n, value) {
						config[n] = value;
					},
					setData = function(d) {
						// ograniczenie danych do niezbędnej ilości
						//console.log('relApi.setData',d.length);
						if (d) {
							data = trimData(d, getConfig('maxDataCount') );
							if (getConfig('isRelated')) {
								// usuwamy loaderki i render miniatur related
								destroy();
								render();
							}
						}
						else {
							//console.log( 'related setData -> brak danych dla konfigu', d);
							destroy();
						}
					},
					getData = function(idx) {
						return data[idx];
					},
					trimData = function(d, count) {
						var trimmed = [], i;
						for (i=0; i<count; i++) {
							trimmed.push( d[i] );
						}
						return trimmed;
					},
					resizeRelated = function() {
						if ($parentTarget.hasClass('endScreen')) {
							destroy();
							$parentTarget.addClass('endScreen');
							render();
						}
					},
					render = function() {
						var d = data,
							thumbCount = getConfig('maxDataCount'),
							toRender = extend({}, ui.toRenderRelated ),
							el, i, name,
							isFloating = $parentTarget.hasClass('floating');

						if (d.length) {
							// renderowanie z danymi

							// kontener na topheader
							if (getConfig('isFirst') === false) {
								// czy aktualny klip nie jest pierwszym - wtedy wyswietlamy opcje powrotu do pierwszego
								toRender.children.relHeader.children.btnBackToFirst = {
									class: 'btnBackToFirst',
									action: {
										event: 'click',
										trigger: 'clickFirstBtn',
										localTrigger: 'clickFirstBtn'
									},
									children: {
										btnBackToFirstIkon: {
											class: 'btnBackToFirstIkon'
										},
										btnBackToFirstLabel: {
											class: 'btnBackToFirstLabel',
											content: 'wr\u00f3\u0107 do pierwszego'
										}
									}
								};
							}
							else{
								// usuniecie elementu
								toRender.children.relHeader.children.btnBackToFirst = null;
								delete toRender.children.relHeader.children.btnBackToFirst;
							}
							toRender.children.relHeader.children.currentClipHeader = {
								class: 'currentClipHeader',
								action: {
									event: 'click',
									trigger: 'clickReplayBtn',
									localTrigger: 'clickReplayBtn'
								},
								children: {
									btnCurrentClipReplay: {
										class: 'btnCurrentClipReplay'
									},
									currentClipLabel: {
										class: 'currentClipLabel',
										content: 'odtwórz ponownie'
									}
								}
							};

							if (d.length > 1 && !isFloating ) {
								// kontener next klip info
								// nadpisanie klasy nextClipCont w zalezności od ilości miniatur (korekta położenia pionowego)
								//
								// FIX - czyszczenie z poprzednio dodanych klas x0, x1, x2
								// - nie wiem dlaczego dodawane sa do oryginalu ui.toRenderRelated, skoro operuje na extendowanym toRender ???
								//
								var clName = ui.toRenderRelated.children.nextClipCont.class.split(' ');
								ui.toRenderRelated.children.nextClipCont.class = clName[0];
								clName = ui.toRenderRelated.children.relHeader.class.split(' ');
								ui.toRenderRelated.children.relHeader.class = clName[0];

								toRender.children.nextClipCont.class = (d.length === 2) ? ui.toRenderRelated.children.nextClipCont.class + ' x2' : ui.toRenderRelated.children.nextClipCont.class;
								toRender.children.nextClipCont.children = {
									nextCounter: {
										class:'nextCounter',
										children: {
											nextCounterGr: {
												class: 'nextCounterGr',
												content:'<svg viewBox="0 0 98 98"><circle cx="49" cy="49" fill="#000" fill-opacity="0.5" r="48"></circle><circle cx="-49" cy="49" fill-opacity="0" r="46.5" stroke="#ED1C24" stroke-dasharray="293" stroke-dashoffset="91" stroke-width="3" transform="rotate(-90)"></circle></svg>'
											},
											nextCounterLabel: {
												class: 'nextCounterLabel'
											}
										},
										action: {
											event: 'click',
											trigger: 'clickRelatedItem',
											localTrigger: 'clickRelatedItem',
											localData: '{"relatedId":"0"}' }
									},
									nextTitleHeader: {
										class: 'nextTitleHeader',
										content: 'ZA CHWIL\u0118:'
									},
									nextTitle: {
										class: 'nextTitle',
										content: getData(0).title,
										action: {
											event: 'click',
											trigger: 'clickRelatedItem',
											localTrigger: 'clickRelatedItem',
											localData: '{"relatedId":"0"}' }
									}
								};

								// miniaturki
								for (i = 0; i < thumbCount; i++ ) {
									el = d[i];
									if (el) {
										name = 'relThumb'+i;
										ui.rendered.push(name);
										toRender.children.thumbCont.children[name] = {
											class: (d.length === 2) ? 'relThumb x2' : 'relThumb',
											content: '<img src="' + el.screenshot + '"><div class="relThumbDuration">'+formatTime(el.duration)+'</div><div class="relThumbTitleBg"></div><div class="relThumbTitle">'+el.title+'</div><div class="relThumbIkon"></div><div class="relThumbTitleBorder"></div>',
											action: {
												event: 'click',
												trigger: 'clickRelatedItem',
												localTrigger: 'clickRelatedItem',
												localData: '{"relatedId":"' + i + '"}' }
										};
									}
								}
							}
							else {
								// widok bez miniatury, tylko blok next
								el = d[0];
								toRender.children.thumbCont.children = {};
								//delete toRender.children.thumbCont;

								// osobny styl dla ekranu koncowego w trybie floating player
								var cssClassSwitch = !isFloating ? ' x1' : ' x0';

								// FIX - czyszczenie z poprzednio dodanych klas x0, x1, x2
								// - nie wiem dlaczego dodawane sa do oryginalu ui.toRenderRelated, skoro operuje na extendowanym toRender ???
								var clName = ui.toRenderRelated.children.relHeader.class.split(' ');
								ui.toRenderRelated.children.relHeader.class = clName[0];
								clName = ui.toRenderRelated.children.nextClipCont.class.split(' ');
								ui.toRenderRelated.children.nextClipCont.class = clName[0];

								// odmienne stylowanie dla rozmiaru 320 px klasa x1
								toRender.children.relHeader.class = ui.toRenderRelated.children.relHeader.class + cssClassSwitch;
								toRender.children.nextClipCont.class = ui.toRenderRelated.children.nextClipCont.class + cssClassSwitch;
								toRender.children.nextClipCont.children = {
									nextCounter: {
										class:'nextCounter',
										children: {
											nextCounterGr: {
												class: 'nextCounterGr',
												content:'<svg viewBox="0 0 40 40"><circle cx="20" cy="20" fill="#000" fill-opacity="0.8" r="20"></circle><circle cx="-20" cy="20" fill-opacity="0" r="19" stroke="#ED1C24" stroke-dasharray="293" stroke-dashoffset="293" stroke-width="2" transform="rotate(-90)"></circle></svg>'
											},
											nextCounterLabel: {
												class: 'nextCounterLabel'
											}
										}
									},
									nextTitleHeader: {
										class: 'nextTitleHeader',
										content: 'ZA CHWIL\u0118:'
									},
									nextTitle: {
										class: 'nextTitle',
										content: getData(0).title,
										action: {
												event: 'click',
												trigger: 'clickRelatedItem',
												localTrigger: 'clickRelatedItem',
												localData: '{"relatedId":"0"}' }
									}
								};

								ui.rendered.push('nextCounterGr');
								ui.rendered.push('nextCounterLabel');
								ui.rendered.push('nextCounter');
							}


							renderNode($rootNode, toRender, ui.root );

							getSkinEl(ui.root).removeClass('loading');
							getSkinEl(ui.root).addClass('loaded');

							getSkinEl(ui.root).css({'background-image': 'url("' + d[0].screenshot + '")' });

							if ( getSkinEl('nextCounterGr') ) {
								$animEl = getSkinEl('nextCounterGr').find('svg circle').eq(1);
							}

							if (getSkinEl('nextTitle')) {
								try {
									$(getSkinEl('nextTitle')).dotdotdot();
									$('.relThumbTitle').dotdotdot();
								}catch(e){}
							}

							initCounter();
						}
						else {
							// renderowanie pustych kontenerków
							for (i = 0; i < thumbCount; i++ ) {
								el = d[i];
								name = 'relThumb'+i;
								ui.rendered.push(name);
								toRender.children.thumbCont.children[name] = {
									class:'relThumb',
									content: 'loading...'
								};
							}
							renderNode($rootNode, toRender, ui.root );

							getSkinEl(ui.root).addClass('loading');
						}
						// elementy related do utylizacji - tymczasowo tutaj
						ui.rendered.push('relHeader');
						ui.rendered.push('btnBackToFirst');
						ui.rendered.push('btnBackToFirstIkon');
						ui.rendered.push('btnBackToFirstLabel');
						ui.rendered.push('currentClipHeader');
						ui.rendered.push('btnCurrentClipReplay');
						ui.rendered.push('currentClipLabel');

						ui.rendered.push('nextCounterGr');
						ui.rendered.push('nextCounterLabel');
						ui.rendered.push('nextCounter');
						ui.rendered.push('nextTitle');
						ui.rendered.push('nextTitleHeader');
						ui.rendered.push('nextClipCont');
						ui.rendered.push('thumbCont');
						ui.rendered.push('relcont');
						ui.rendered.push('relBg');


					},
					renderEndScreen = function(d) {
						var toRender;
						// zapamiętanie flag related i first
						setConfig('isRelated', d.isRelated);
						setConfig('isFirst', d.isFirst);

						if (d && d.isRelated) {
							// renderowanie related, jesli są dane related,
							// lub tylko kontenerków z loaderami w oczekiwaniu na dane related
							destroy();
							render();
						}
						else {
							// wyświetlenie ekranu z przyciskiem replay
							relApi.destroy();
							toRender = extend({}, ui.toRenderEndScreen );
							renderNode($rootNode, toRender, ui.root );
						}
						$parentTarget.addClass('endScreen');
					},
					calcRelatedCount = function() {
						var w = $rootNode.width(),
							count = 3;
						if (w <= 600) {
							count = 2;
						}
						if (w <= 320) {
							count = 1;
						}
						return count;
					},
					initCounter = function() {
						ct.setCallback('onCompleteCallback', onCountComplete);
						ct.setCallback('onTime', onCount);
						ct.start();
					},
					onCount = function(dt) {
						if ( getSkinEl('nextCounterLabel') ) {


							// ustawienie wartości na labelce
							getSkinEl('nextCounterLabel').html(dt);
							// animka po okręgu
							var subCount = 10, // ilość update-ów pomiędzy kolejnymi sekundowymi onCount
								isFloating = $parentTarget.hasClass('floating'),
								baseCounter = (getConfig('maxDataCount') > 1 && !isFloating) ? 0 : 175,
								deltaStroke = (getConfig('maxDataCount') > 1 && !isFloating) ? 58.2 : 23.2,
								currStroke = baseCounter + (deltaStroke * (dt-1)),
								subDeltaStroke = deltaStroke / subCount,
								currentSubCount = subCount,
								tim,
								onSubCount = function() {
									if (currentSubCount > 0) {
										// redraw circle
										if ($animEl) {
											$animEl.attr('stroke-dashoffset', (currStroke + (subDeltaStroke * currentSubCount)) );
										}

										tim = setTimeout( onSubCount, 1000/subCount );
										currentSubCount --;
									}
									else {
										// koniec
										clearTimeout(tim);
										if ($animEl) {
											$animEl.attr('stroke-dashoffset', currStroke);
										}
									}
								};

							// start subcounta
							if (dt > 0) {
								onSubCount();
							}

							//console.log( 'onCount dt:', dt, 'isFloating:', isFloating );
							//if ($animEl) {
							//	$animEl.attr('stroke-dashoffset', currStroke);
							//}
						}
					},
					onCountComplete = function(dt) {
						if ( getSkinEl('nextCounterLabel') ) {
							onCount(dt);
							getSkinEl('nextCounterLabel').html('');
						}
						dispatchSkinEvent(null, {eventName:'autoRelatedItem', relatedId:0, relatedData:relApi.getData(0) });
						relApi.destroy();
					},
					show = function() {
						getSkinEl(ui.root).show();
					},
					hide = function() {
						getSkinEl(ui.root).hide();
					},
					destroy = function() {
						// zawsze usuwac wszystkie elementy potomne !!!
						$parentTarget.removeClass('endScreen');
						var name = ui.rendered.pop();
						while (name) {
							removeSkinEl(name);
							name = ui.rendered.pop();
						}
						removeSkinEl(ui.root);

						// czyszczenie pozostałości endscreen
						removeNestedElements('endscreenbg btnendscrreplay infoendscrreplay btnend');
						// czyszczenie countera
						ct.stop();
					},



					// Counter ... moved

					// init instancji countera
					ct = new Counter(5, 1000);


					setConfig('maxDataCount', calcRelatedCount() );

					// public
					return {
						setData:setData,
						getData:getData,
						destroy:destroy,
						render:render,
						renderEndScreen:renderEndScreen,
						getConfig:getConfig,
						setConfig:setConfig,
						pause:ct.pause,
						resume:ct.resume,
						resizeRelated:resizeRelated
					};
				},

				Counter = function(countingFrom, timeDelay) {
						var timer,
							paused = false,
							started = false,
							running = 0,
							cc = countingFrom, c, d = timeDelay,
							onCompleteCallback, onTimeCallback,

						start = function() {
							started = true;
							reset();
							count();
						},
						stop = function (){
							started = false;
							reset();
							clear();
						},
						pause = function() {
							paused = true;
							clearTimeout(timer);
						},
						resume = function() {
							paused = false;
							if (!started){
								return;
							}
							count();
						},
						reset = function() {
							c = cc;
						},
						clear = function() {
							clearTimeout(timer);
							timer = null;
						},
						count = function() {
							if (paused || !started){
								return;
							}
							if (c > 0) {
								onTime();
								timer = setTimeout( count, d );
								c--;
							}
							else {
								stop();
								onComplete();
							}
						},
						onTime = function() {
							if (typeof onTimeCallback === 'function') {
								onTimeCallback(c);
							}
						},
						onComplete = function() {
							if (typeof onCompleteCallback === 'function') {
								onCompleteCallback(c);
							}
						},
						setCallback = function(name, callback) {
							if (typeof callback === 'function') {
								switch (name) {
									case 'onCompleteCallback' :
										onCompleteCallback = callback;
										break;
									case 'onTime' :
										onTimeCallback = callback;
										break;
								}
							}
						};

						return {
							running:running,
							start:start,
							stop:stop,
							pause:pause,
							resume:resume,
							reset:reset,
							clear:clear,
							setCallback:setCallback
						};
					},

				pointerEventToXY = function(e) {
					var out = {
						x: 0,
						y: 0
					};
					if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
						var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						out.x = touch.pageX;
						out.y = touch.pageY;
					} else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
						out.x = e.pageX;
						out.y = e.pageY;
					}
					return out;
				},

				// formatuje sekundy na min:sec
				formatTime = function(s) {
					var tmin = Math.floor(s / 60),
						tsec = s - (tmin * 60);
					tsec = (tsec > 9) ? tsec : ('0' + tsec);
					return tmin + ':' + tsec;
				},

				// dispatch eventa do core playera
				dispatchSkinEvent = function(e, extData) {
					var $el, d = {};
					if (e && $(e.currentTarget).data('trigger')) {
						$el = $(e.currentTarget);
						d.action = $el.data('trigger');
						if ( (d.action.indexOf('slider') > -1 ) && typeof $el.offset === 'function') {
							d.pos = Math.max(Math.min((e.pageX - $el.offset().left) / $el.width(), 1), 0);
						}
						if (d.action === 'setQuality') {
							d.quality = {};
							d.quality.id = (getSkinEl('btnquality').hasClass('bhd')) ? 1 : 0;
						}
						if (d.action === 'clickRelatedItem') {
							d.relatedId = JSON.parse($el.data('localData'))['relatedId'];
							d.relatedData = relApi.getData( d.relatedId );
						}
						$($hub).trigger($.Event($el.data('trigger'), {
							edata: d
						}));
					}
					else {
						if (extData && extData.eventName) {
							$($hub).trigger($.Event(extData.eventName, {
								edata: extData
							}));
						}
					}
				},

				destroy = function() {
					var n;
					for (n in stack) {
						removeSkinEl(n);
					}
					if ($style) {
						$($style).remove();
					}
					// czyszczenie identyfikacji css dla tego skina
					$rootNode.removeClass(skinName);
					// niszczenie elementów related
					relApi.destroy();
				},

				relApi = new RelApi(),
				// licznik czasu po hoverze na ikonie automute ( podczas wyciszenia reklamy lub materiału )
				autoMuteCounter = new Counter(40, 50),

				// metody zależne:
				extend = WP.player.utils.extend,
				clone = WP.player.utils.clone,

				pub = {
					setUiConfig: setUiConfig,
					destroy: destroy,
					setVolume: setVolume,
					setScreenMode: function() {},
					setPosition: setPosition,
					setState: setState,
					setTimeData: setTimeData,
					setQuality: setQuality,
					showQualityButton: showQualityButton,
					hideQualityButton: hideQualityButton,
					setData: setData,
					setRelated: setRelated,
					showRelated: showRelated,
					endScreen:endScreen,
					pauseRelatedCounter:relApi.pause,
					resumeRelatedCounter:relApi.resume,
					showMessage: showMessage,
					hideMessage: hideMessage,
					toggleShortcutIcons: toggleShortcutIcons,
					setSize: function(){},
					resizeRelated:relApi.resizeRelated
				};

			init();

			return pub;
		};

	// zwrócenie informacji do rejestracji, że skin jest gotowy
	// trigger na dokumencie bo nie mamy w skinie referencji do playera w momencie wczytania
	$(document).trigger('SKIN_READY', {
		name: skinName,
		skinContructor: Skin
	});

})(document, $);
