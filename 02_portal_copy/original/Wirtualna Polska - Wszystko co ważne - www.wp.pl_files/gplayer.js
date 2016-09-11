// (c) by Gemius SA - gemius player tools
// ver. 1.1

function gemius_pending(i) { window[i] = window[i] || function() {var x = window[i+'_pdata'] = window[i+'_pdata'] || []; x[x.length]=arguments;};};
gemius_pending('gemius_hit'); gemius_pending('gemius_event'); gemius_pending('pp_gemius_hit'); gemius_pending('pp_gemius_event');

function GemiusPlayer(playerID, gemiusID, playerData) {
	this.interval = 5 * 60;
	this.instanceID = ((new Date()).getTime());
	this.playerID = playerID;
	this.gemiusID = gemiusID;
	this.playerData = (playerData || {});
	this.initialized = false;
	this.programs = {};
	this.ads = {};

	//public methods
	this.newProgram = function(programID, programData) {
		this._init();
		this.programs[programID] = {"state": "new", "started": false, "program_started": false, "last_action_time": null, "data": this._clone(programData), "extradata": {}};
		this._sendHit(programID, null, "data", "streamcontent", []);
	}

	this.newAd = function(adID, adData) {
		this._init();
		this.ads[adID] = {"state": "new", "started": false, "last_action_time": null, "currentProgramID": null, "currentAdPosition": null, "data": this._clone(adData), "extradata": {}};
		this._sendHit(null, adID, "data", "streamspot", []);
	}

	this.programEvent = function(programID, offset, eventType, eventData) {
		eventData = eventData || {};
		if (this.programs[programID]) {
			if (eventType == "play") {
				this._playProgram(programID, offset, eventData);
			} else if (eventType == "chngQual" || eventType == "chngRes" || eventType == "chngVol") {
				this._changeParam(programID, null, offset, eventType, eventData);
			} else {
				this._event(programID, null, offset, eventType, eventData);
			}
		}
	}

	this.adEvent = function(programID, adID, offset, eventType, eventData) {
		eventData = eventData || {};
		if (this.programs[programID] && this.ads[adID]) {
			if (eventType == "play") {
				this._playAd(programID, adID, offset, eventData);
			} else if (eventType == "chngQual" || eventType == "chngRes" || eventType == "chngVol") {
				this._changeParam(programID, adID, offset, eventType, eventData);
			} else {
				this._event(programID, adID, offset, eventType, eventData);
			}
		}
	}

	//private methods
	this._playProgram = function(programID, offset, eventData) {
		this._stopAll();
		var eventCategory = (this.programs[programID]['program_started']==false)?"programstart":(this.programs[programID]["started"]?"play":"start");
		var params = ["_SCO="+offset, "_SED="+this._updateActionTime(this.programs[programID])];
		if (typeof eventData['autoPlay'] != "undefined") params = params.concat(["_ECA=" + (eventData['autoPlay']?1:0)]);
		if (typeof eventData['partID'] != "undefined") this.programs[programID]["extradata"]["partID"] = eventData['partID'];
		else delete this.programs[programID]["extradata"]["partID"];
		if (typeof eventData['volume'] != "undefined") params = params.concat(["_SPVN=" + eventData['volume']]);
		if (typeof eventData['resolution'] != "undefined") params = params.concat(["_SPRN=" + eventData['resolution']]);
		this.programs[programID]["state"] = "play";
		this.programs[programID]["started"] = true;
		this.programs[programID]["program_started"] = true;
		this._sendHit(programID, null, "stream", eventCategory, params);

		if (typeof eventData['volume'] != "undefined") this.playerData['volume'] = eventData['volume'];
		if (typeof eventData['resolution'] != "undefined") this.playerData['resolution'] = eventData['resolution'];

		for (var adID in this.ads) {
			this.ads[adID]["started"] = false;
		}

		for (var pID in this.programs) {
			if (pID != programID) {
				this.programs[pID]["started"] = false;
				this.programs[pID]["program_started"] = false;
			}
		}
	}

	this._playAd = function(programID, adID, offset, eventData) {
		this._stopAll();
		var start = (!this.ads[adID]["started"] || this.ads[adID]["currentProgramID"]!=programID || this.ads[adID]["currentAdPosition"]!=eventData['adPosition']);
		var eventCategory = (start && this.programs[programID]['program_started']==false)?"programstart":(start?"start":"play");
		var breakType = this._getBreakType(programID, offset);
		var params = ["_SCO="+offset,"_SED="+this._updateActionTime(this.ads[adID])];
		if (typeof eventData['autoPlay'] != "undefined") params = params.concat(["_ECA=" + (eventData['autoPlay']?1:0)]);
		if (typeof eventData['adPosition'] != "undefined") this.ads[adID]["extradata"]["adPosition"] = eventData['adPosition'];
		else delete this.ads[adID]["extradata"]["adPosition"];
		if (typeof eventData['breakSize'] != "undefined") this.ads[adID]["extradata"]["breakSize"] = eventData['breakSize'];
		else delete this.ads[adID]["extradata"]["breakSize"];
		if (breakType) this.ads[adID]["extradata"]["breakType"] = breakType;
		else delete this.ads[adID]["extradata"]["breakType"];
		if (typeof eventData['volume'] != "undefined") params = params.concat(["_SPVN=" + eventData['volume']]);
		if (typeof eventData['resolution'] != "undefined") params = params.concat(["_SPRN=" + eventData['resolution']]);
		this.ads[adID]["state"] = "play";
		this.ads[adID]["started"] = true;
		this.ads[adID]["currentProgramID"] = programID;
		this.ads[adID]["currentAdPosition"] = eventData['adPosition'];
		this.programs[programID]["program_started"] = true;
		this._sendHit(programID, adID, "stream", eventCategory, params);

		if (typeof eventData['volume'] != "undefined") this.playerData['volume'] = eventData['volume'];
		if (typeof eventData['resolution'] != "undefined") this.playerData['resolution'] = eventData['resolution'];
	}

	this._event = function(programID, adID, offset, eventType, eventData) {
		var evtypes = {"pause":"pause", "stop":"stop", "close":"close", "buffer":"buffering", "break":"break", "seek":"seek", "complete":"complete", "skip":"skip", "next":"next", "prev":"prev"};
		var data = (adID?this.ads[adID]:this.programs[programID]);
		if (evtypes[eventType]) {
			var params = ["_SED="+this._updateActionTime(data)].concat(this._convertEventParams(eventData));
			if (typeof offset != "undefined") params = params.concat(["_SCO="+offset]);
			if (eventType == "stop" || eventType == "complete" || eventType == "close") {
				data["started"] = false;
				if (!adID) this.programs[programID]["program_started"] = false;
			}
			data["state"] = evtypes[eventType];
			this._sendHit(programID, adID, "stream", evtypes[eventType], params);
		}
	}

	this._changeParam = function(programID, adID, offset, eventType, eventData) {
		var data = (adID?this.ads[adID]:this.programs[programID]);
		var params = ["_SED="+this._updateActionTime(data)];
		if (typeof offset != "undefined") params = params.concat(["_SCO="+offset]);
		if (typeof eventData['volume'] != "undefined") params = params.concat(["_SPVN=" + eventData['volume']]);
		if (typeof eventData['resolution'] != "undefined") params = params.concat(["_SPRN=" + eventData['resolution']]);
		if (typeof eventData['quality'] != "undefined") params = params.concat([(adID?"_SAQN=":"_SCQN=") + eventData['quality']]);
		this._sendHit(programID, adID, "stream", "continue", params);

		if (eventData['quality']) data['data']['quality'] = eventData['quality'];
		if (eventData['resolution']) this.playerData['resolution'] = eventData['resolution'];
		if (eventData['volume']) this.playerData['volume'] = eventData['volume'];
	}

	this._getBreakType = function(programID, offset) {
		try {
			var duration = (this.programs[programID]['data']['programDuration'] || 0);
			if (typeof duration != "number") duration = parseInt(duration,10);
			if (typeof offset != "number") offset = parseInt(offset,10);
			if ((duration<=100 && offset<=0) || (duration>100 && offset<5)) return "pre";
			else if (duration>0 && ((duration<=100 && offset>=duration) || (duration>100 && offset>duration-5))) return "post";
			else return "mid";
		} catch (e) {
			return "";
		}
	}

	this._stopAll = function() {
		for (var programID in this.programs) {
			if (this.programs[programID]["state"] == "play") {
				this.programEvent(programID, undefined, "pause");
			}
		}

		for (var adID in this.ads) {
			if (this.ads[adID]["state"] == "play") {
				this.adEvent(this.ads[adID]["currentProgramID"], adID, undefined, "pause");
			}
		}
	}

	this._continue = function() {
		for (var programID in this.programs) {
			if (this.programs[programID]["state"] == "play") {
				var params = ["_SED="+this._updateActionTime(this.programs[programID])];
				this._sendHit(programID, null, "stream", "continue", params);
			}
		}

		for (var adID in this.ads) {
			if (this.ads[adID]["state"] == "play") {
				var params = ["_SED="+this._updateActionTime(this.ads[adID])];
				this._sendHit(this.ads[adID]["currentProgramID"], adID, "stream", "continue", params);
			}
		}
	}

	this._unload = function() {
		try {
			var delay = false;
			for (var programID in this.programs) {
				if (this.programs[programID]["state"] == "play") {
					var params = ["_SED="+this._updateActionTime(this.programs[programID])];
					this._sendHit(programID, null, "stream", "unload", params);
					delay = true;
				}
			}
			
			for (var adID in this.ads) {
				if (this.ads[adID]["state"] == "play") {
					var params = ["_SED="+this._updateActionTime(this.ads[adID])];
					this._sendHit(this.ads[adID]["currentProgramID"], adID, "stream", "unload", params);
					delay = true;
				}
			}

			if (delay) {
				var start = (new Date()).getTime();
				while (start+250>(new Date()).getTime());
			}
		} catch(e) {}
	}

	this._updateActionTime = function(streamData) {
		var duration = 0;
		try {
			if (streamData['state'] == 'play' && streamData['last_action_time']) {
				duration =  Math.round(((new Date()).getTime() - streamData['last_action_time']) / 1000);
				if (duration < 0 || duration > 2*this.interval) {
					duration = 0;
				}
			}
			streamData['last_action_time'] = (new Date()).getTime();
		} catch (e) {}
		return duration;
	}

	this._sendHit = function(programID, adID, eventType, eventCategory, params) {
		var extra = ["_EC="+eventCategory].concat(this._getPlayerParams()).concat(this._getProgramParams(programID)).concat(this._getAdParams(adID)).concat(params);
		gemius_event.apply(window, ['_' + eventType + '_', this.gemiusID].concat(extra));
	}

	this._getProgramParams = function(programID) {
		if (!this.programs[programID]) return [];
		var pkeys = {'programType':'_SCTE','programDuration':'_SCD','programName':'_SCT','series':'_SCS','typology':'_SCTY',
			'premiereDate':'_SCPD','externalPremiereDate':'_SCEPD','quality':'_SCQ', "resolution":"_SCR", "volume":"_SCV"};
		var epkeys = {'partID':'_SCP'};
		var params = ["_SC="+programID];
		params = params.concat(this._convertParams(this.programs[programID]["data"], pkeys, true));
		params = params.concat(this._convertParams(this.programs[programID]["extradata"], epkeys));
		return params;
	}

	this._getAdParams = function(adID) {
		if (!this.ads[adID]) return [];
		var akeys = {'adName':'_SAN','adDuration':'_SAD','adType':'_SAT','campaignClassification':'_SAC','quality':'_SAQ', "resolution":"_SAR", "volume":"_SAV"};
		var eakeys = {'adPosition':'_SAP', 'breakSize':'_SBS', 'breakType':'_SBT'};
		var params = ["_SA="+adID];
		params = params.concat(this._convertParams(this.ads[adID]["data"], akeys, true));
		params = params.concat(this._convertParams(this.ads[adID]["extradata"], eakeys));
		return params;
	}

	this._getPlayerParams = function() {
		var pkeys = {"currentDomain":"_SPD", "resolution":"_SPR", "volume":"_SPV"};
		return  ["_SPI="+this.instanceID,"_SP="+this.playerID].concat(this._convertParams(this.playerData,pkeys));
	}

	this._convertEventParams = function(eventData) {
		var ekeys = {'listID':'_SL'};
		return this._convertParams(eventData, ekeys);
	}

	this._convertParams = function(params, keyMap, allowCustomParams) {
		var res = [];
		if (typeof params != 'undefined') {
			for (var key in params) {
				if (keyMap[key] || allowCustomParams) {
					res[res.length] = (keyMap[key] || key) + "=" + params[key];
				}
			}
		}
		return res;
	}

	this._addEvent = function(obj,type,fn) {
		if (obj.addEventListener) {
			obj.addEventListener(type, fn, false);
		} else if (obj.attachEvent) {
			obj.attachEvent('on'+type, fn);
		}
	}

	this._init = function() {
		if (!this.initialized) {
			this.initialized = true;
			setInterval(this._wrapFun(this,"_continue"), this.interval * 1000);
			try {
				this._addEvent(window.top, 'unload', this._wrapFun(this,"_unload"));
			} catch (e) {
				this._addEvent(window, 'unload', this._wrapFun(this,"_unload"));
			}
		}
	}

	this._wrapFun = function(self, method) {
		return function() {
			self[method]();
		}
	}

	this._clone = function(obj) {
		var res = {};
		if (!obj) return res;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) res[key] = obj[key];
		}
		return res;
	}
}

if (typeof window['gemius_player_data'] != 'undefined') {
	for (var i=0; i<window['gemius_player_data'].length; i++) {
		var data = window['gemius_player_data'][i];
		var obj = data[0], fun = data[1], args = data[2];

		if (fun != "GemiusPlayer") obj[fun].apply(obj,args);
		else {
			var nobj = new function(){return GemiusPlayer.apply(this,args);};
			for (var attrname in nobj) {
				obj[attrname] = nobj[attrname];
			}
		}
	}
	window['gemius_player_data'] = [];
}

(function(d,t) {var ex; try {var gt=d.createElement(t),s=d.getElementsByTagName(t)[0],l='http'+((location.protocol=='https:')?'s':'');
gt.async='true'; gt.defer='true'; gt.src=l+'://wp.hit.gemius.pl/gemiuslib.js'; s.parentNode.insertBefore(gt,s);} catch (ex) {}}(document,'script'));
