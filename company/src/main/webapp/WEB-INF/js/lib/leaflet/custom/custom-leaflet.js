
L.DomUtil.setTransform = function (el, offset, scale) {
	var pos = offset || new L.Point(0, 0);

	var strTransform = el.style[L.DomUtil.TRANSFORM];
	if(strTransform.indexOf("rotate") == -1){
		el.style[L.DomUtil.TRANSFORM] =
			(L.Browser.ie3d ?
				'translate(' + pos.x + 'px,' + pos.y + 'px)' :
				'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
			(scale ? ' scale(' + scale + ')' : '');
	} else {
		var strRotate = strTransform.substr(strTransform.indexOf("rotate"));
		el.style[L.DomUtil.TRANSFORM] =
			(L.Browser.ie3d ?
				'translate(' + pos.x + 'px,' + pos.y + 'px)' :
				'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
			(scale ? ' scale(' + scale + ')' : '') + 
			' ' + strRotate;
	}
}

L.Control.PlatoonStatusArea = L.Control.extend({
	options: {
		position: 'topright',
		
		//隊列code
		leafletPlatoonCode: '--',
		//隊列状態
		leafletPlatoonStatus: '--',
		//隊列速度情報
		leafletPlatoonSpeed: '0.0',
	},
	
	onAdd: function (map) {
		this._map = map;
		var className = 'leaflet-platoon-status-area';
		var container = L.DomUtil.create('div', className);
		var html = '';
		
			html += '<div class="leaflet-platoon-status-back">';
			
			html += 	'<div id="leaflet-platoon-code" style="width: 100%; text-align: center; padding-top: 2px;">';
			html += 		this.options.leafletPlatoonCode;
			html += 	'</div>';
			
			html += 	'<div id="leaflet-platoon-speedValue" style="width: 100%; text-align: center; padding-top: 35px; font-size: 25px;">';
			html += 		this.options.leafletPlatoonSpeed;
			html += 	'</div>';
			
			html += 	'<div id="leaflet-platoon-status" style="width: 100%; text-align: center; padding-top: 19px;">';
			html += 		this.options.leafletPlatoonStatus;
			html += 	'</div>';
			
			html += '</div>';
			
 		container.innerHTML= html; 
 		
		return container;
	},
	setPlatoonCode: function(platoonCode){
		//隊列code
		this.options.leafletPlatoonCode = platoonCode;
		$("#leaflet-platoon-code").html(platoonCode);
	},
	setPlatoonStatus: function(platoonStatus, level){
		//隊列状態
		this.options.leafletPlatoonStatus = platoonStatus;
		$("#leaflet-platoon-status").html(platoonStatus);
		
		if(level){
			$("#leaflet-platoon-status").css("color", "rgb(246, 96, 96)");
		} else {
			$("#leaflet-platoon-status").css("color", "#fff");
		}
	},
	setPlatoonSpeed: function(platoonSpeed){
		//隊列速度情報
		this.options.leafletPlatoonSpeed = platoonSpeed
		$("#leaflet-platoon-speedValue").html(platoonSpeed);
	},
});

L.control.platoonStatusArea = function (options) {
	return new L.Control.PlatoonStatusArea(options);
};

L.Control.PlatoonInfoArea = L.Control.extend({
	options: {
		position: 'bottomleft',
		
		//出発地名称
		startPoiName: '--',
		//隊列出発時刻
		startTime: '--',
		
		//目的地名称
		endPoiName: '--',
		//到着予定時刻
		endTime: '--',
		
		//出発地天気情報
		startPoiWeather: '',			//value: sun, rain, overcast, snow, wind
		//出発地天気温度
		startPoiTemperature: '',
		//目的地天気情報
		endPoiWeather: '',			//value: sun, rain, overcast, snow, wind
		//目的地天気温度
		endPoiTemperature: '',
		
		//全距離
		totalDistance: 0,
		//走行距離
		passDistance: 0,
		//残り距離
		remainDistance: 0,
		//全行程時間
		totalTime: 0,
		//走行時間
		passTime: 0,
		//残り時間
		remainTime: 0,
		//回放/监视区分flag
		type:0,
	},
	
	onAdd: function (map) {
		this._map = map;
		var className = 'leaflet-platoon-info-area';
		var container = L.DomUtil.create('div', className);
		
		var percentage = 0;
		if(this.options.totalTime > 0){
			percentage = 100 * (this.options.passTime / this.options.totalTime);
		}
		
		var html = '<div class="leaflet-platoon-info">';
			html += 	'<table><tr>';
			//播放按钮start回放画面才有
			if(this.options.type==0){
				html += 	'<td style="width:100px; height: 77px; color:#FFF;line-height: 80px;text-align:center;background-color:rgba(0,0,0,0.9);">';
				html += 	'<img width="20" height="20" src="'+ContextPath+'/js/lib/leaflet/custom/image/play_btn.png" id="palybtn" onclick="replayFrame.replay()">';
				html += 	'</td>';
			}			
			
			//播放按钮end
			
			html += 	'<td style="width: 1022px; color:#FFF;background: url('+ContextPath+'/js/lib/leaflet/custom/image/test_play.png) no-repeat !important;">';
			html += 	'<div style="width: 120px; height: 77px; float: left;">';
			
			html += 	'<div style="float: left; width: 115px;height:23px;line-height: 17px;background-color: white;margin-top: 7px;margin-left: 7px;">';
			html += 		'<div style="padding: 4px 5px;color: black;float:left;">出発</div>';
			html += 		'<div style="float: left;padding: 3px 3px;background-color: rgb(34,155,2);width: 80px; height: 21px; word-spacing: 4px;margin-top: 1px; text-align: center;" id="leaflet-start-time">'+ this.options.startTime +'</div>';
			html += 	'</div>';						
			
			//出发地天气
			if(this.options.type==1){
				html += 	'<div style="font-size: 14px;height:50px;line-height: 17px;">';
				html += 		'<div style="height:20px; margin-left: 30px; text-align: center;">';
				html += 			'<span id="leaflet-start-poi-name" style="line-height: 29px;">'+ this.options.startPoiName +'</span>';
				html += 		'</div>';
				html += 	'</div>';
				
				
				html += 	'<div style="width: 120px; height: 17px; color:#FFF;">';
				html += 	'<img width="30" height="30" style="float: left;margin-left: 7px;margin-top: 6px;top: -16px;position: relative;" id="leaflet-start-poi-weather" src="'+ContextPath+'/js/lib/leaflet/custom/image/weather-'+ this.options.startPoiWeather +'.png">';
				html += 		'<div style="margin-top: 5px;margin-right: 30px;float: right;">';
				html += 			'<span id="leaflet-start-poi-temperature">'+ this.options.startPoiTemperature +'</span>';
				html += 			'<span>℃</span>';
				html += 		'</div>';
				html += 	'</div>';
			}else{
				html += 	'<div style="font-size: 14px;height:37px;line-height: 37px;">';
				html += 		'<div style="text-align: center;">';
				html += 			'<span id="leaflet-start-poi-name" style="line-height: 49px;">'+ this.options.startPoiName +'</span>';
				html += 		'</div>';
				html += 	'</div>';
			}						
			html += 	'</div>';
			html += 	'</div>';
			
			html += 	'<div style="margin-top: 4px;width: 636px; height: 100%; float: left;">';
			html += 		'<div style="margin-top: 5px;">';
			html += 		'	<div style="width:30px;height:20px;float:left;line-height: 32px;font-size: 16px;">';
			html += 		'		<div style="float:right;width: 26px; margin: 0 auto;margin-right: -15px;line-height:6px;">';
			html += 					'<img style="margin-top:-5px;" width="20.8" height="25.6" src="'+ContextPath+'/js/lib/leaflet/custom/image/start.png" alt="">';
			html += 		'		</div>';
			html += 		'	</div>';			
			html += 	    	'<div class="leaflet-progressBar" style="margin-top: 24px;width:574px;float: left">';
			html += 		'   	<div style="width: '+ percentage +'%" class="leaflet-timeBar">';
			html += 		'			<img src="'+ContextPath+'/js/lib/leaflet/custom/image/truck_icon.png" class="leaflet-timeIcon" alt="">';
			html += 		'		</div>';
			html += 		'	</div>';
			html += 		'	<div style="width:30px;height:20px;float:right;line-height: 32px;font-size: 16px;line-height:6px;">';
			html += 		'		<div style="float: left;width: 24px; margin: 0 auto;">';
			html += 					'<img style="margin-top:-5px;margin-left:-5px;" width="19.2" height="24" src="'+ContextPath+'/js/lib/leaflet/custom/image/goal.png" alt="">';
			html += 		'		</div>';
			html += 		'	</div>';
			html += 		'</div>';
			
			html += 		'<div id="father" style="height:30px;font-size:18px;line-height: 41px;">';
			html += 		'<div id="son1" style="margin-left:44px;">';
			html += 		'<div style="float: left;">';
			html += 			'<div>';
			html += 				'<div style="width:50px;float:left;font-size: 14px;">'
			html += 					'<span>走行:</span>';
			html += 				'</div>';
			html += 				'<div style="width:215px;float:left;">'
			html += 					'<span style="color:#23eb23;height:24px;text-align:right;" id="leaflet-passDistance">'+this.options.passDistance+'</span>';	
			html += 					' <span style="color:#23eb23;height:24px;">km</span> /';
			html += 					' <span style="color:#23eb23;text-align:left;height:24px;" id="leaflet-passTime">'+util.timeFormat(this.options.passTime)+'</span>';

			html += 				'</div>';	
			html += 			'</div>';
			html += 		'</div>';
			html += 		'</div>';
			
			html += 		'<div style="height:100%;width:10px;float:left;">';
			html += 		'</div>';
			
			html += 		'<div id="son2" style="">';
			html += 			'<div style="width:50px;float:left;font-size: 14px;">'
			html += 				'<span >行程:</span>';
			html += 			'</div>';
			html += 			'<div style="width:215px;float:left;">'
			html += 				'<span id="leaflet-totalDistance">'+ this.options.totalDistance +'</span>';
			html += 				' <span>km</span> /';
			html += 				' <span id="leaflet-totalTime">'+ this.options.totalTime +'分</span>';
			html += 			'</div>';
			html += 		'</div>';						
			html += 		'</div>';
			html += 	'</div>';
			html += 	'</div>';			
			
			html += 	'<div style="width: 117px; height: 77px; float: left;">';							
			html += 	'<div style="float: left; width: 115px;height:23px;line-height: 17px;background-color: white;margin-top: 7px;">';
			html += 		'<div style="padding: 4px 5px;color: black; float:left;">到着</div>';
			html += 		'<div style="float: left;padding: 3px 3px;word-spacing: 4px;background-color: rgb(2,155,146);width: 80px; height: 21px; margin-top: 1px; text-align: center;" id="leaflet-end-time" style="margin-left: 5px;">'+ this.options.endTime +'</div>';
			html += 	'</div>';
			

			//目的地天气
			if(this.options.type==1){
				html += 	'<div style="font-size: 14px;height:50px;line-height: 17px;">';
				html += 		'<div style="height:20px;margin-left: 30px; text-align: center;">';
				html += 			'<span id="leaflet-end-poi-name" style="line-height: 29px;">'+ this.options.endPoiName +'</span>';
				html += 		'</div>';
				html += 	'</div>';
				
				html += 	'<div style="color:#FFF;top: -10px;position: relative;">';
				html += 	'<img width="30" height="30" style="float: left;margin-left: 8px;" id="leaflet-end-poi-weather" src="'+ContextPath+'/js/lib/leaflet/custom/image/weather-'+ this.options.endPoiWeather +'.png">';
				html += 	'<div style="margin-top: 17px;margin-left: 21px;float: left;">';
				html += 		'<span id="leaflet-end-poi-temperature">'+ this.options.endPoiTemperature +'</span>';
				html += 		'<span>℃</span>';
				html += 	'</div>';
			}else{
				html += 	'<div style="font-size: 14px;height:37px;line-height: 37px;margin-left: 11px;">';
				html += 		'<div style="float: left;height:20px;width:73px;text-align: center;">';
				html += 			'<span id="leaflet-end-poi-name" style="line-height: 49px;">'+ this.options.endPoiName +'</span>';
				html += 		'</div>';
				html += 	'</div>';
			}		
			
			html += 	'</div>';
			html += 	'</td>';
			
			html += 	'</tr></table>';
			html += '</div>';
        
		container.innerHTML= html; 
		
//		map.on('resize', this._update, this);
//		$(".leaflet-platoon-info-area").ready(function(){
//			$(".leaflet-platoon-info-area").css("left", ($("#map").width() - 789) / 2);
//		});
		
		return container;
	},
	
	setStartPoiName: function(startPoiName){
		//出発地名称
		this.options.startPoiName = startPoiName;
		$("#leaflet-start-poi-name").html(startPoiName);
	},
	setStartPoiWeather: function(startPoiWeather){
		//出発地天気情報 (value: sun, rain, overcast, snow, wind)
		this.options.startPoiWeather = startPoiWeather;
		$("#leaflet-start-poi-weather").src=ContextPath+"/js/lib/leaflet/custom/image/weather-"+startPoiWeather+'.png';
	},
	setStartPoiTemperature: function(startPoiTemperature){
		//出発地天気温度
		this.options.startPoiTemperature = startPoiTemperature;
		$("#leaflet-start-poi-temperature").html(startPoiTemperature);
	},
	setStartTime: function(startTime){
		//隊列出発時刻
		this.options.startTime = startTime;
		if(startTime == "--"){
			$("#leaflet-start-time").html(startTime);
		} else {
			$("#leaflet-start-time").html(startTime.substring(5,16));
		}
	},
	setEndPoiName: function(endPoiName){
		//目的地名称
		this.options.endPoiName = endPoiName;
		$("#leaflet-end-poi-name").html(endPoiName);
	},
	setEndPoiWeather: function(endPoiWeather){
		//目的地天気情報(value: sun, rain, overcast, snow, wind)
		this.options.endPoiWeather = endPoiWeather;
		$("#leaflet-end-poi-weather").src=ContextPath+"/js/lib/leaflet/custom/image/weather-"+endPoiWeather+'.png';
	},
	setEndPoiTemperature: function(endPoiTemperature){
		//目的地天気温度
		this.options.endPoiTemperature = endPoiTemperature;
		$("#leaflet-end-poi-temperature").html(endPoiTemperature);
	},
	setEndTime: function(endTime){
		//到着予定時刻
		this.options.endTime = endTime;
		if(endTime == "--"){
			$("#leaflet-end-time").html(endTime);
		} else {
			$("#leaflet-end-time").html(endTime.substring(5,16));
		}
	},
	setTotalDistance: function(totalDistance){
		//全距離
		this.options.totalDistance = totalDistance;
		$("#leaflet-totalDistance").html(totalDistance);
	},
	setPassDistance: function(passDistance){
		//走行距離
		this.options.passDistance = passDistance;
		$("#leaflet-passDistance").html(passDistance);
	},
	setTotalTime: function(totalTime){
		//全行程時間
		
		this.options.totalTime = totalTime;
		if(!totalTime || totalTime == 0){
			$("#leaflet-totalTime").html("0分");
		} else {
			$("#leaflet-totalTime").html(util.timeFormat2(totalTime));
		}
	},
	setPassTime: function(passTime){
		//走行時間
		this.options.passTime = passTime;
		$("#leaflet-passTime").html(util.timeFormat(passTime));
		
	},
	setTimeBar: function(){
		if(this.options.totalTime == 0){
			$('.leaflet-timeBar').css('width', '0');
		} else {
			//设置初始位置
			var percentage = 100 * (this.options.passTime / (this.options.totalTime * 60));
			$('.leaflet-timeBar').css('width', percentage+'%');
		}
	},
	
	_update: function () {
//		$(".leaflet-platoon-info-area").css("left", ($("#map").width() - 789) / 2);
	}
});

L.control.platoonInfoArea = function (options) {
	return new L.Control.PlatoonInfoArea(options);
};

var platoonVehicleInfo = {
	object: null,
	
	//前方障害物Twinkle
	obstacleInterval: null,
	
	//車輌1Twinkle
	truck1Interval: null,
	//横間隔異常Twinkle
	transverse1Interval: null,
	//速度異常Twinkle
	speed1Interval: null,
	//加速度異常Twinkle
	acceleration1Interval: null,
//	//v2v Twinkle
//	v2v1Interval: null,
//	//gnss Twinkle
//	gnss1Interval: null,
//	//v2i Twinkle
//	v2i1Interval: null,
//	//camera1 Twinkle
//	camera1_1Interval: null,
//	//camera2 Twinkle
//	camera1_2Interval: null,
//	//fuel Twinkle
//	fuel1Interval: null,
	
	//CutIn車両1 Twinkle
	cutinCarInterval_1_1: null,
	//CutIn車両2 Twinkle
	cutinCarInterval_1_2: null,
	//CutIn車両3 のTwinkle
	cutinCarInterval_1_3: null,
	//車両1-車両2 距離のTwinkle
	truckDistanceInterval_1: null,
	
	//車輌2Twinkle
	truck2Interval: null,
	//横間隔異常Twinkle
	transverse2Interval: null,
	//速度異常Twinkle
	speed2Interval: null,
	//加速度異常Twinkle
	acceleration2Interval: null,
	//v2v Twinkle
//	v2v2Interval: null,
//	//gnss Twinkle
//	gnss2Interval: null,
//	//v2i Twinkle
//	v2i2Interval: null,
//	//camera1 Twinkle
//	camera2_1Interval: null,
//	//camera2 Twinkle
//	camera2_2Interval: null,
//	//fuel Twinkle
//	fuel2Interval: null,
	
	//CutIn車両1 Twinkle
	cutinCarInterval_2_1: null,
	//CutIn車両2 Twinkle
	cutinCarInterval_2_2: null,
	//CutIn車両3 のTwinkle
	cutinCarInterval_2_3: null,
	//車両1-車両2 距離のTwinkle
	truckDistanceInterval_2: null,
	
	//車輌3Twinkle
	truck3Interval: null,
	//横間隔異常Twinkle
	transverse3Interval: null,
	//速度異常Twinkle
	speed3Interval: null,
	//加速度異常Twinkle
	acceleration3Interval: null,
};
L.Control.PlatoonVehicleArea = L.Control.extend({
	options: {
		position: 'topleft',
		
		//loop time Interval 
		intervalTime_show_H: 500,
		intervalTime_hide_H: 500,
		intervalTime_show_M: 1500,
		intervalTime_hide_M: 500,
		
		truckSelect: 0,
		
		truckNumber: 3,
		
		//value: running, stop
		type: 'stop',
		
		/* 隊列状態表示 */
		//value: stop, forward, brake, accup2, accdown2, goleft, goright, sharpturn2, turnleft, turnright, uturn
		status: 'stop',
		
		/* 前方障害物 */
		//value: none, inline
		obstacleFalg: 'none',
		//前方障害物の距離
		obstacleDistance: '',
		//前方障害物の危険等級 (value: L, M, H)
		obstacleDistanceLevel: 'L',
		
		/* 車輌1 (value: L, L-selected, M, M-selected, H, H-selected) */
		truck1Level: 'L',
		
		/* 車両コントロールモード (value: CACC, ACC, Manual)   */
		truck1Model: 'Manual',
		
		/* 横間隔異常 */
		//value: none, inline
		transverse1Flag: 'none',
		//横間隔異常の距離
		transverse1Value: '', 
		//横間隔異常の危険等級 (value: L, M, H)
		transverse1Level: 'L',
		
		/* 速度異常 */
		//value: none, inline
		speed1Flag: 'none',
		//速度異常の値
		speed1Value: '',
		//速度異常の危険等級 (value: L, M, H)
		speed1Level: 'L',
		
		/* 加速度異常 */
		//value: none, inline
		acceleration1Flag: 'none',
		//加速度異常 の値
		acceleration1Value: "",
		//加速度異常 の危険等級 (value: L, M, H)
		acceleration1Level: 'L',
		
		//v2v (value: 168, 169, 170, 171)
		v2v1Level: '168',
		//gnss (164, 165, 166, 167)
		gnss1Level: '164',
		//v2i (value: 119, 120, 121, 122)
		v2i1Level: '119',
		//camera1 (value: '', _error, _selected)
		camera1_1Level: '',
		//camera2 (value: '', _error, _selected)
		camera1_2Level: '',
		
		//value: none, inline
		fuel1Flag: 'none',
		//fuel (value: L, M, H)
		fuel1Level: 'L',

		/* CutIn車両 */
		//value: none, inline
		cutinCarFlag_1_1: 'none',
		//CutIn車両1 の危険等級 (value: L, M, H)
		cutinCarLevel_1_1: 'L',
		//CutIn車両1 のX値
		cutinCarValueX_1_1: '',
		//CutIn車両1 のY値
		cutinCarValueY_1_1: '',
		
		//value: none, inline
		cutinCarFlag_1_2: 'none',
		//CutIn車両2 の危険等級 (value: L, M, H)
		cutinCarLevel_1_2: 'L',
		//CutIn車両2 のY値
		cutinCarValueY_1_2: '',
		
		//value: none, inline
		cutinCarFlag_1_3: 'none',
		//CutIn車両3 の危険等級 (value: L, M, H)
		cutinCarLevel_1_3: 'L',
		//CutIn車両3 のX値
		cutinCarValueX_1_3: '',
		//CutIn車両3 のY値
		cutinCarValueY_1_3: '',
		
		//value: none, inline
		truckDistanceFlag_1: 'none',
		//車両1-車両2 距離の危険等級 (value: L, M, H)
		truckDistanceLevel_1: 'L',
		//車両1-車両2 距離の値
		truckDistanceValue_1: '',
		
		
		/* 車輌2 (value: L, L-selected, M, M-selected, H, H-selected) */
		truck2Level: 'L',
		
		/* 車両コントロールモード (value: CACC, ACC, Manual)   */
		truck2Model: 'CACC',
		
		/* 横間隔異常 */
		//value: none, inline
		transverse2Flag: 'none',
		//横間隔異常の距離
		transverse2Value: '', 
		//横間隔異常の危険等級 (value: L, M, H)
		transverse2Level: 'L',
		
		/* 速度異常 */
		//value: none, inline
		speed2Flag: 'none',
		//速度異常の値
		speed2Value: '',
		//速度異常の危険等級 (value: L, M, H)
		speed2Level: 'L',
		
		/* 加速度異常 */
		//value: none, inline
		acceleration2Flag: 'none',
		//加速度異常 の値
		acceleration2Value: "",
		//加速度異常 の危険等級 (value: L, M, H)
		acceleration2Level: 'L',
		
		//v2v (value: 168, 169, 170, 171)
		v2v2Level: '168',
		//gnss (164, 165, 166, 167)
		gnss2Level: '164',
		//v2i (value: 119, 120, 121, 122)
		v2i2Level: '119',
		//camera1 (value: '', _error, _selected)
		camera2_1Level: '',
		//camera2 (value: '', _error, _selected)
		camera2_2Level: '',
		
		//value: none, inline
		fuel2Flag: 'none',
		//fuel (value: L, M, H)
		fuel2Level: 'L',

		/* CutIn車両 */
		//value: none, inline
		cutinCarFlag_2_1: 'none',
		//CutIn車両1 の危険等級 (value: L, M, H)
		cutinCarLevel_2_1: 'L',
		//CutIn車両1 のX値
		cutinCarValueX_2_1: '',
		//CutIn車両1 のY値
		cutinCarValueY_2_1: '',
		
		//value: none, inline
		cutinCarFlag_2_2: 'none',
		//CutIn車両2 の危険等級 (value: L, M, H)
		cutinCarLevel_2_2: 'L',
		//CutIn車両2 のY値
		cutinCarValueY_2_2: '',
		
		//value: none, inline
		cutinCarFlag_2_3: 'none',
		//CutIn車両3 の危険等級 (value: L, M, H)
		cutinCarLevel_2_3: 'L',
		//CutIn車両3 のX値
		cutinCarValueX_2_3: '',
		//CutIn車両3 のY値
		cutinCarValueY_2_3: '',
		
		//value: none, inline
		truckDistanceFlag_2: 'none',
		//車両2-車両3 距離の危険等級 (value: L, M, H)
		truckDistanceLevel_2: 'L',
		//車両2-車両3 距離の値
		truckDistanceValue_2: '',
		
		
		/* 車輌3 (value: L, L-selected, M, M-selected, H, H-selected) */
		truck3Level: 'L',
		
		/* 車両コントロールモード (value: CACC, ACC, Manual)   */
		truck3Model: 'CACC',
		
		/* 横間隔異常 */
		//value: none, inline
		transverse3Flag: 'none',
		//横間隔異常の距離
		transverse3Value: '', 
		//横間隔異常の危険等級 (value: L, M, H)
		transverse3Level: 'L',
		
		/* 速度異常 */
		//value: none, inline
		speed3Flag: 'none',
		//速度異常の値
		speed3Value: '',
		//速度異常の危険等級 (value: L, M, H)
		speed3Level: 'L',
		
		/* 加速度異常 */
		//value: none, inline
		acceleration3Flag: 'none',
		//加速度異常 の値
		acceleration3Value: "",
		//加速度異常 の危険等級 (value: L, M, H)
		acceleration3Level: 'L',
		
		//v2v (value: 168, 169, 170, 171)
		v2v3Level: '168',
		//gnss (164, 165, 166, 167)
		gnss3Level: '164',
		//v2i (value: 119, 120, 121, 122)
		v2i3Level: '119',
		//camera1 (value: '', _error, _selected)
		camera3_1Level: '',
		//camera2 (value: '', _error, _selected)
		camera3_2Level: '',
		
		//value: none, inline
		fuel3Flag: 'none',
		//fuel (value: L, M, H)
		fuel3Level: 'L',
		
		//beep音(value: M, H, L)
		beepLevel: 'L',
	},
	
	onAdd: function (map) {
		this._map = map;
		var className = 'leaflet-platoon-vehicle-area';
		var container = L.DomUtil.create('div', className);
		var html = '';
			html += this.create();
			
 		container.innerHTML= html; 
 		
 		map.on('resize', this._update, this);
 		
		$(".leaflet-platoon-vehicle-area").ready(function(){
			
		});
		
		return container;
	},
	
	create: function(){
		var strHtml = '<div id="leaflet-platoon-vehicle-type" style="float: left; height: 600px;" class="leaflet-platoon-vehicle-'+ this.options.type +'-back">';
		
			strHtml += 		'<table style="width: 100%; color: #FFAE00; font-size: 15px;" class="leaflet-platoon-vehicle-box">';
			
			strHtml += 		'<tr style="height: 80px;"><td>';
			strHtml += 			'<div style="width: 266px; height: 80px;"><table><tr>';
			strHtml += 			'<td style="width: 170px;">';
			strHtml += 			'<div>';
			strHtml += 				'<div class="leaflet-platoon-vehicle-obstacle" style="display: '+ this.options.obstacleFalg +'">';
			strHtml += 					'<img id="leaflet-obstacle-icon" style="margin-top: 6px; width: 27px; height: 50px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/obstacle-'+ this.options.obstacleDistanceLevel +'.png" alt="">';
			strHtml += 					'<div id="leaflet-platoon-vehicle-obstacle-style" style="width: 50px; height: 22px;" class="leaflet-platoon-vehicle-color-'+ this.options.obstacleDistanceLevel +'">';
			strHtml += 						'<div id="leaflet-platoon-vehicle-obstacle-value"><span class="leaflet-platoon-vehicle-obstacle-distance">'+ this.options.obstacleDistance +'</span><span>m</span></div>';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 			'</div>';
			strHtml += 			'</td>';
			strHtml += 			'<td style="width: 96px;">';
			strHtml += 				'<div>';
			strHtml += 					'<img id="leaflet-platoon-vehicle-status" style="width: 75px; height: 75px; margin-left: 20px;" style="" src="" alt="">';
			strHtml += 				'</div>';
			strHtml += 			'</td>';
			strHtml += 			'</tr></table></div>';
			strHtml += 		'</td></tr>';
			
			strHtml += 		'<tr style="height: 102px;"><td>';
			strHtml += 			'<div id="leaflet-platoon-vehicle-1" class="leaflet-platoon-vehicle-truck-'+ this.options.truck1Level +'">';
			strHtml += 				'<div class="leaflet-platoon-vehicle-truck-left">';
			strHtml += 					'<div style="width:100%; height: 33px;">';
			strHtml += 						'<div class="leaflet-platoon-vehicle-transverse1" style="display: '+ this.options.transverse1Flag +'">';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<img id="leaflet-platoon-vehicle-transverse1-icon" style="margin-top: 10px; margin-left: 10px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/error_'+ this.options.transverse1Level +'_hensa_mark.png" alt="">';
			strHtml += 						'</div>';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<div id="leaflet-platoon-vehicle-transverse1-value-style" class="leaflet-platoon-vehicle-error-value-box-'+ this.options.transverse1Level +'">';
			strHtml += 								'<span id="leaflet-platoon-vehicle-transverse1-value" style="margin-left:3px;">'+ this.options.transverse1Value +'</span>';
			strHtml += 								'<span>m</span>';
			strHtml += 							'</div>';
			strHtml += 						'</div>';
			strHtml += 						'</div>';
			strHtml += 					'</div>';
			strHtml += 					'<div style="width:100%; height: 33px;">';
			strHtml += 						'<div class="leaflet-platoon-vehicle-speed1" style="display: '+ this.options.speed1Flag +'">';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<img id="leaflet-platoon-vehicle-speed1-icon" style="margin-top: 10px; margin-left: 2px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/error_'+ this.options.speed1Level +'_speed_mark.png" alt="">';
			strHtml += 						'</div>';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<div id="leaflet-platoon-vehicle-speed1-value-style" class="leaflet-platoon-vehicle-error-value-box-'+ this.options.speed1Level +'">';
			strHtml += 								'<span id="leaflet-platoon-vehicle-speed1-value" style="margin-left:3px;">'+ this.options.speed1Value +'</span><span>km/h</span>';
			strHtml += 							'</div>';
			strHtml += 						'</div>';
			strHtml += 						'</div>';
			strHtml += 					'</div>';
			strHtml += 					'<div style="width:100%; height: 33px;">';
			strHtml += 						'<div class="leaflet-platoon-vehicle-acceleration1" style="display: '+ this.options.acceleration1Flag +'">';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<img id="leaflet-platoon-vehicle-acceleration1-icon" style="margin-top: 10px; margin-left: 10px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/error_'+ this.options.acceleration1Level +'_acc_speed_mark.png" alt="">';
			strHtml += 						'</div>';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<div id="leaflet-platoon-vehicle-acceleration1-value-style" class="leaflet-platoon-vehicle-error-value-box-'+ this.options.acceleration1Level +'">';
			strHtml += 								'<span id="leaflet-platoon-vehicle-acceleration1-value" style="margin-left:3px;">'+ this.options.acceleration1Value +'</span><span>g</span>';
			strHtml += 							'</div>';
			strHtml += 						'</div>';
			strHtml += 						'</div>';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 				'<div id="leaflet-platoon-vehicle-truck-no1" class="leaflet-platoon-vehicle-truck-center">';
			strHtml += 					'<img class="leaflet-platoon-vehicle-truck-no" src="'+ContextPath+'/js/lib/leaflet/custom/image/no1.png" alt="">';
			strHtml += 					'<br/><img id="leaflet-platoon-vehicle-truck-model-1" class="leaflet-platoon-vehicle-model" src="'+ContextPath+'/js/lib/leaflet/custom/image/model_Manual.png" alt="">';
			strHtml += 				'</div>';
			strHtml += 				'<div class="leaflet-platoon-vehicle-truck-right">';
			strHtml += 					'<div>';
			strHtml += 					'<img id="leaflet-vehicle1-v2v" class="leaflet-v2v-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/M3_TRUCK_'+ this.options.v2v1Level +'.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle1-gnss" class="leaflet-gnss-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/M3_TRUCK_'+ this.options.gnss1Level +'.png" alt="">';
			strHtml += 					'</div>';
			strHtml += 					'<div style="margin-top: 8px;">';
			strHtml += 					'<img id="leaflet-vehicle1-camera1" class="leaflet-camera-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/camera'+ this.options.camera1_1Level +'.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle1-camera1-select" style="display:none" class="leaflet-camera-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/camera_selected.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle1-v2i" class="leaflet-v2i-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/M3_TRUCK_'+ this.options.v2i1Level +'.png" alt="">';
			strHtml += 					'</div>';
			strHtml += 					'<div style="margin-top: 8px;">';
			strHtml += 					'<img id="leaflet-vehicle1-camera2" class="leaflet-camera-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/camera'+ this.options.camera1_2Level +'.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle1-camera2-select" style="display:none" class="leaflet-camera-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/camera_selected.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle1-fuel" style="display: '+ this.options.fuel1Flag +'" class="leaflet-fuel-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/error_'+ this.options.fuel1Level +'_fuel.png" alt="">';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 			'</div>';
			strHtml += 		'</td></tr>';
			
			strHtml += 		'<tr class="leaflet-platoon-vehicle-box-2" style="height: 80px;"><td>';
			strHtml += 			'<div style="width: 100%; height: 80px;">';
			strHtml += 				'<div class="leaflet-platoon-vehicle-cutincar-left">';
			strHtml += 					'<div class="leaflet-cutincar1-left" style="display:'+ this.options.cutinCarFlag_1_1 +'">';
			strHtml += 						'<div id="leaflet-platoon-vehicle-cutinCar_1_1-style" class="leaflet-platoon-vehicle-color-'+ this.options.cutinCarLevel_1_1 +'">';
			strHtml += 						'<img id="leaflet-platoon-vehicle-cutinCar_1_1-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/cutin_car_'+ this.options.cutinCarLevel_1_1 +'.png?1.1" alt="">';
			strHtml += 						'<span class="leaflet-platoon-vehicle-cutinCarValueX_1_1-content"><span id="leaflet-platoon-vehicle-cutinCarValueX_1_1" style="margin-left: 5px;">'+ this.options.cutinCarValueX_1_1 +'</span><span>m</span>';
			strHtml += 						'<br/><span id="leaflet-platoon-vehicle-cutinCarValueY_1_1">'+ this.options.cutinCarValueY_1_1 +'</span><span>m</span></span>';
			strHtml += 						'</div>';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 				'<div class="leaflet-platoon-vehicle-cutincar-center">';
			strHtml += 					'<div class="leaflet-cutincar1-center" style="display:'+ this.options.cutinCarFlag_1_2 +'">';
			strHtml += 					'<div id="leaflet-center1-cutincar" style="padding-top: 5px; padding-left: 18px;">';
			strHtml += 						'<img id="leaflet-platoon-vehicle-cutinCar_1_2-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/cutin_car_'+ this.options.cutinCarLevel_1_2 +'.png?1.1" alt="">';
			strHtml += 						'<br/><div id="leaflet-platoon-vehicle-cutinCar_1_2-style" class="leaflet-platoon-vehicle-color-'+ this.options.cutinCarLevel_1_2 +'"><span id="leaflet-platoon-vehicle-cutinCarValueY_1_2">'+ this.options.cutinCarValueY_1_2 +'</span><span>m</span></div>';
			strHtml += 					'</div>';
			strHtml += 					'</div>';
			strHtml += 					'<div class="leaflet-center1-distance" style="display:'+ this.options.truckDistanceFlag_1 +'">';
			strHtml += 					'<div style="float: left;padding-top: 1px;">';
			strHtml += 						'<img id="leaflet-platoon-vehicle-truckDistance-icon-up-1" style="margin-left:27px; margin-top: 1px; width:15px; heighr: 28px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/arrow_up_'+ this.options.truckDistanceLevel_1 +'.png" alt="">';
			strHtml += 						'<div style="height: 20px; width: 70px;"><div id="leaflet-platoon-vehicle-truckDistanceValue_1-style" class="leaflet-platoon-vehicle-color-'+ this.options.truckDistanceLevel_1 +'"><span id="leaflet-platoon-vehicle-truckDistanceValue_1" style="margin-left:20px;">'+ this.options.truckDistanceValue_1 +'</span><span>m</span></div></div>';
			strHtml += 						'<img id="leaflet-platoon-vehicle-truckDistance-icon-down-1" style="margin-left:27px; width:15px; heighr: 28px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/arrow_down_'+ this.options.truckDistanceLevel_1 +'.png" alt="">';
			strHtml += 					'</div>';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 				'<div class="leaflet-platoon-vehicle-cutincar-right">';
			strHtml += 					'<div class="leaflet-cutincar1-right" style="display:'+ this.options.cutinCarFlag_1_3 +'">';
			strHtml += 					'<div id="leaflet-platoon-vehicle-cutinCar_1_3-style" class="leaflet-platoon-vehicle-color-'+ this.options.cutinCarLevel_1_3 +'">';
			strHtml += 					'<span class="leaflet-platoon-vehicle-cutinCarValueX_1_3-content"><span id="leaflet-platoon-vehicle-cutinCarValueX_1_3">'+ this.options.cutinCarValueX_1_3 +'</span><span>m</span></span>';
			strHtml += 					'<img id="leaflet-platoon-vehicle-cutinCar_1_3-icon" style="margin-left: 5px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/cutin_car_'+ this.options.cutinCarLevel_1_3 +'.png?1.1" alt="">';
			strHtml += 					'<br/><span class="leaflet-platoon-vehicle-cutinCarValueX_1_3-content"><span id="leaflet-platoon-vehicle-cutinCarValueY_1_3" style="margin-left: 35px;">'+ this.options.cutinCarValueY_1_3 +'</span><span>m</span></span>';
			strHtml += 					'</div>';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 			'</div>';
			strHtml += 		'</td></tr>';
			
			strHtml += 		'<tr class="leaflet-platoon-vehicle-box-2" style="height: 102px;"><td>';
			strHtml += 			'<div id="leaflet-platoon-vehicle-2" class="leaflet-platoon-vehicle-truck-'+ this.options.truck2Level +'">';
			strHtml += 				'<div class="leaflet-platoon-vehicle-truck-left">';
			strHtml += 					'<div style="width:100%; height: 33px;">';
			strHtml += 						'<div class="leaflet-platoon-vehicle-transverse2" style="display: '+ this.options.transverse2Flag +'">';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<img id="leaflet-platoon-vehicle-transverse2-icon" style="margin-top: 10px; margin-left: 10px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/error_'+ this.options.transverse2Level +'_hensa_mark.png" alt="">';
			strHtml += 						'</div>';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<div id="leaflet-platoon-vehicle-transverse2-value-style" class="leaflet-platoon-vehicle-error-value-box-'+ this.options.transverse2Level +'">';
			strHtml += 								'<span id="leaflet-platoon-vehicle-transverse2-value" style="margin-left:3px;">'+ this.options.transverse2Value +'</span>';
			strHtml += 								'<span>m</span>';
			strHtml += 							'</div>';
			strHtml += 						'</div>';
			strHtml += 						'</div>';
			strHtml += 					'</div>';
			strHtml += 					'<div style="width:100%; height: 33px;">';
			strHtml += 						'<div class="leaflet-platoon-vehicle-speed2" style="display: '+ this.options.speed2Flag +'">';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<img id="leaflet-platoon-vehicle-speed2-icon" style="margin-top: 10px; margin-left: 2px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/error_'+ this.options.speed2Level +'_speed_mark.png" alt="">';
			strHtml += 						'</div>';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<div id="leaflet-platoon-vehicle-speed2-value-style" class="leaflet-platoon-vehicle-error-value-box-'+ this.options.speed2Level +'">';
			strHtml += 								'<span id="leaflet-platoon-vehicle-speed2-value" style="margin-left:3px;">'+ this.options.speed2Value +'</span><span>km/h</span>';
			strHtml += 							'</div>';
			strHtml += 						'</div>';
			strHtml += 						'</div>';
			strHtml += 					'</div>';
			strHtml += 					'<div style="width:100%; height: 33px;">';
			strHtml += 						'<div class="leaflet-platoon-vehicle-acceleration2" style="display: '+ this.options.acceleration2Flag +'">';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<img id="leaflet-platoon-vehicle-acceleration2-icon" style="margin-top: 10px; margin-left: 10px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/error_'+ this.options.acceleration2Level +'_acc_speed_mark.png" alt="">';
			strHtml += 						'</div>';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<div id="leaflet-platoon-vehicle-acceleration2-value-style" class="leaflet-platoon-vehicle-error-value-box-'+ this.options.acceleration2Level +'">';
			strHtml += 								'<span id="leaflet-platoon-vehicle-acceleration2-value" style="margin-left:3px;">'+ this.options.acceleration2Value +'</span><span>g</span>';
			strHtml += 							'</div>';
			strHtml += 						'</div>';
			strHtml += 						'</div>';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 				'<div  id="leaflet-platoon-vehicle-truck-no2" class="leaflet-platoon-vehicle-truck-center">';
			strHtml += 					'<img class="leaflet-platoon-vehicle-truck-no" src="'+ContextPath+'/js/lib/leaflet/custom/image/no2.png" alt="">';
			strHtml += 					'<br/><img id="leaflet-platoon-vehicle-truck-model-2" class="leaflet-platoon-vehicle-model" src="'+ContextPath+'/js/lib/leaflet/custom/image/model_CACC.png" alt="">';
			strHtml += 				'</div>';
			strHtml += 				'<div class="leaflet-platoon-vehicle-truck-right">';
			strHtml += 					'<div>';
			strHtml += 					'<img id="leaflet-vehicle2-v2v" class="leaflet-v2v-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/M3_TRUCK_'+ this.options.v2v2Level +'.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle2-gnss" class="leaflet-gnss-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/M3_TRUCK_'+ this.options.gnss2Level +'.png" alt="">';
			strHtml += 					'</div>';
			strHtml += 					'<div style="margin-top: 8px;">';
			strHtml += 					'<img id="leaflet-vehicle2-camera1" class="leaflet-camera-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/camera'+ this.options.camera2_1Level +'.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle2-camera1-select" style="display:none" class="leaflet-camera-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/camera_selected.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle2-v2i" class="leaflet-v2i-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/M3_TRUCK_'+ this.options.v2i2Level +'.png" alt="">';
			strHtml += 					'</div>';
			strHtml += 					'<div style="margin-top: 8px;">';
			strHtml += 					'<img id="leaflet-vehicle2-camera2" class="leaflet-camera-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/camera'+ this.options.camera2_2Level +'.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle2-camera2-select" style="display:none" class="leaflet-camera-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/camera_selected.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle2-fuel" style="display: '+ this.options.fuel2Flag +'" class="leaflet-fuel-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/error_'+ this.options.fuel2Level +'_fuel.png" alt="">';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 			'</div>';
			strHtml += 		'</td></tr>';
			
			strHtml +=	 	'<tr class="leaflet-platoon-vehicle-box-3" style="height: 80px;"><td>';
			strHtml += 			'<div style="width: 100%; height: 80px;">';
			strHtml += 				'<div class="leaflet-platoon-vehicle-cutincar-left">';
			strHtml += 					'<div class="leaflet-cutincar2-left" style="display:'+ this.options.cutinCarFlag_2_1 +'">';
			strHtml += 						'<div id="leaflet-platoon-vehicle-cutinCar_2_1-style" class="leaflet-platoon-vehicle-color-'+ this.options.cutinCarLevel_2_1 +'">';
			strHtml += 						'<img id="leaflet-platoon-vehicle-cutinCar_2_1-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/cutin_car_'+ this.options.cutinCarLevel_2_1 +'.png?1.1" alt="">';
			strHtml += 						'<span class="leaflet-platoon-vehicle-cutinCarValueX_2_1-content"><span id="leaflet-platoon-vehicle-cutinCarValueX_2_1" style="margin-left: 5px;">'+ this.options.cutinCarValueX_2_1 +'</span><span>m</span>';
			strHtml += 						'<br/><span id="leaflet-platoon-vehicle-cutinCarValueY_2_1">'+ this.options.cutinCarValueY_2_1 +'</span><span>m</span></span>';
			strHtml += 						'</div>';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 				'<div class="leaflet-platoon-vehicle-cutincar-center">';
			strHtml += 					'<div class="leaflet-cutincar2-center" style="display:'+ this.options.cutinCarFlag_2_2 +'">';
			strHtml += 					'<div id="leaflet-center2-cutincar" style="padding-top: 5px; padding-left: 18px;">';
			strHtml += 						'<img id="leaflet-platoon-vehicle-cutinCar_2_2-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/cutin_car_'+ this.options.cutinCarLevel_2_2 +'.png?1.1" alt="">';
			strHtml += 						'<br/><div id="leaflet-platoon-vehicle-cutinCar_2_2-style" class="leaflet-platoon-vehicle-color-'+ this.options.cutinCarLevel_2_2 +'"><span id="leaflet-platoon-vehicle-cutinCarValueY_2_2">'+ this.options.cutinCarValueY_2_2 +'</span><span>m</span></div>';
			strHtml += 					'</div>';
			strHtml += 					'</div>';
			strHtml += 					'<div class="leaflet-center2-distance" style="display:'+ this.options.truckDistanceFlag_2 +'">';
			strHtml += 					'<div style="float: left;padding-top: 1px;">';
			strHtml += 						'<img id="leaflet-platoon-vehicle-truckDistance-icon-up-2" style="margin-left:27px; margin-top: 1px; width:15px; heighr: 28px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/arrow_up_'+ this.options.truckDistanceLevel_2 +'.png" alt="">';
			strHtml += 						'<div style="height: 20px; width: 70px;"><div id="leaflet-platoon-vehicle-truckDistanceValue_2-style" class="leaflet-platoon-vehicle-color-'+ this.options.truckDistanceLevel_2 +'"><span id="leaflet-platoon-vehicle-truckDistanceValue_2" style="margin-left:20px;">'+ this.options.truckDistanceValue_2 +'</span><span>m</span></div></div>';
			strHtml += 						'<img id="leaflet-platoon-vehicle-truckDistance-icon-down-2" style="margin-left:27px; width:15px; heighr: 28px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/arrow_down_'+ this.options.truckDistanceLevel_2 +'.png" alt="">';
			strHtml += 					'</div>';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 				'<div class="leaflet-platoon-vehicle-cutincar-right">';
			strHtml += 					'<div class="leaflet-cutincar2-right" style="display:'+ this.options.cutinCarFlag_2_3 +'">';
			strHtml += 					'<div id="leaflet-platoon-vehicle-cutinCar_2_3-style" class="leaflet-platoon-vehicle-color-'+ this.options.cutinCarLevel_2_3 +'">';
			strHtml += 					'<span class="leaflet-platoon-vehicle-cutinCarValueX_2_3-content"><span id="leaflet-platoon-vehicle-cutinCarValueX_2_3">'+ this.options.cutinCarValueX_2_3 +'</span><span>m</span></span>';
			strHtml += 					'<img id="leaflet-platoon-vehicle-cutinCar_2_3-icon" style="margin-left: 5px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/cutin_car_'+ this.options.cutinCarLevel_2_3 +'.png?1.1" alt="">';
			strHtml += 					'<br/><span class="leaflet-platoon-vehicle-cutinCarValueX_2_3-content"><span id="leaflet-platoon-vehicle-cutinCarValueY_2_3" style="margin-left: 35px;">'+ this.options.cutinCarValueY_2_3 +'</span><span>m</span></span>';
			strHtml += 					'</div>';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 			'</div>';
			strHtml += 		'</td></tr>';
			
			strHtml +=	 	'<tr class="leaflet-platoon-vehicle-box-3" style="height: 102px;"><td>';
			strHtml += 			'<div id="leaflet-platoon-vehicle-3" class="leaflet-platoon-vehicle-truck-'+ this.options.truck3Level +'">';
			strHtml += 				'<div class="leaflet-platoon-vehicle-truck-left">';
			strHtml += 					'<div style="width:100%; height: 33px;">';
			strHtml += 						'<div class="leaflet-platoon-vehicle-transverse3" style="display: '+ this.options.transverse3Flag +'">';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<img id="leaflet-platoon-vehicle-transverse3-icon" style="margin-top: 10px; margin-left: 10px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/error_'+ this.options.transverse3Level +'_hensa_mark.png" alt="">';
			strHtml += 						'</div>';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<div id="leaflet-platoon-vehicle-transverse3-value-style" class="leaflet-platoon-vehicle-error-value-box-'+ this.options.transverse3Level +'">';
			strHtml += 								'<span id="leaflet-platoon-vehicle-transverse3-value" style="margin-left:3px;">'+ this.options.transverse3Value +'</span>';
			strHtml += 								'<span>m</span>';
			strHtml += 							'</div>';
			strHtml += 						'</div>';
			strHtml += 						'</div>';
			strHtml += 					'</div>';
			strHtml += 					'<div style="width:100%; height: 33px;">';
			strHtml += 						'<div class="leaflet-platoon-vehicle-speed3" style="display: '+ this.options.speed3Flag +'">';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<img id="leaflet-platoon-vehicle-speed3-icon" style="margin-top: 10px; margin-left: 2px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/error_'+ this.options.speed3Level +'_speed_mark.png" alt="">';
			strHtml += 						'</div>';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<div id="leaflet-platoon-vehicle-speed3-value-style" class="leaflet-platoon-vehicle-error-value-box-'+ this.options.speed3Level +'">';
			strHtml += 								'<span id="leaflet-platoon-vehicle-speed3-value" style="margin-left:3px;">'+ this.options.speed3Value +'</span><span>km/h</span>';
			strHtml += 							'</div>';
			strHtml += 						'</div>';
			strHtml += 						'</div>';
			strHtml += 					'</div>';
			strHtml += 					'<div style="width:100%; height: 33px;">';
			strHtml += 						'<div class="leaflet-platoon-vehicle-acceleration3" style="display: '+ this.options.acceleration3Flag +'">';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<img id="leaflet-platoon-vehicle-acceleration3-icon" style="margin-top: 10px; margin-left: 10px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/error_'+ this.options.acceleration3Level +'_acc_speed_mark.png" alt="">';
			strHtml += 						'</div>';
			strHtml += 						'<div style="float: left;">';
			strHtml += 							'<div id="leaflet-platoon-vehicle-acceleration3-value-style" class="leaflet-platoon-vehicle-error-value-box-'+ this.options.acceleration3Level +'">';
			strHtml += 								'<span id="leaflet-platoon-vehicle-acceleration3-value" style="margin-left:3px;">'+ this.options.acceleration3Value +'</span><span>g</span>';
			strHtml += 							'</div>';
			strHtml += 						'</div>';
			strHtml += 						'</div>';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 				'<div  id="leaflet-platoon-vehicle-truck-no3" class="leaflet-platoon-vehicle-truck-center">';
			strHtml += 					'<img class="leaflet-platoon-vehicle-truck-no" src="'+ContextPath+'/js/lib/leaflet/custom/image/no3.png" alt="">';
			strHtml += 					'<br/><img id="leaflet-platoon-vehicle-truck-model-3" class="leaflet-platoon-vehicle-model" src="'+ContextPath+'/js/lib/leaflet/custom/image/model_CACC.png" alt="">';
			strHtml += 				'</div>';
			strHtml += 				'<div class="leaflet-platoon-vehicle-truck-right">';
			strHtml += 					'<div>';
			strHtml += 					'<img id="leaflet-vehicle3-v2v" class="leaflet-v2v-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/M3_TRUCK_'+ this.options.v2v3Level +'.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle3-gnss" class="leaflet-gnss-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/M3_TRUCK_'+ this.options.gnss3Level +'.png" alt="">';
			strHtml += 					'</div>';
			strHtml += 					'<div style="margin-top: 8px;">';
			strHtml += 					'<img id="leaflet-vehicle3-camera1" class="leaflet-camera-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/camera'+ this.options.camera3_1Level +'.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle3-camera1-select" style="display:none" class="leaflet-camera-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/camera_selected.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle3-v2i" class="leaflet-v2i-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/M3_TRUCK_'+ this.options.v2i3Level +'.png" alt="">';
			strHtml += 					'</div>';
			strHtml += 					'<div style="margin-top: 8px;">';
			strHtml += 					'<img id="leaflet-vehicle3-camera2" class="leaflet-camera-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/camera'+ this.options.camera3_2Level +'.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle3-camera2-select" style="display:none" class="leaflet-camera-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/camera_selected.png" alt="">';
			strHtml += 					'<img id="leaflet-vehicle3-fuel" style="display: '+ this.options.fuel3Flag +'" class="leaflet-fuel-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/error_'+ this.options.fuel3Level +'_fuel.png" alt="">';
			strHtml += 					'</div>';
			strHtml += 				'</div>';
			strHtml += 			'</div>';
			strHtml += 		'</td></tr>';
			strHtml += 		'</table>';
			
			strHtml += 		'<div style="display: none;">';
			
			strHtml += 			'<audio id="leaflet-platoon-vehicle-beep-H" loop>';
			strHtml += 				'<source src="'+ContextPath+'/js/lib/leaflet/custom/image/beep_H.mp3" type="audio/mpeg">';
			strHtml += 			'</audio>';
			
			strHtml += 			'<audio id="leaflet-platoon-vehicle-beep-M" loop>';
			strHtml += 				'<source src="'+ContextPath+'/js/lib/leaflet/custom/image/beep_M.mp3" type="audio/mpeg">';
			strHtml += 			'</audio>';
			
			strHtml += 		'</div>';
		
			strHtml += '</div>';
			
			strHtml += '<div style="float: left; cursor: pointer;">';
			strHtml += 		'<img id="leaflet-platoon-vehicle-close" style="width: 20px; height: 20px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/close_icon.png" alt="">';
			strHtml += '</div>';
			
		return strHtml;
	},
	
	show: function(){
		$(".leaflet-platoon-vehicle-area").show();
		//beep音
		this.setBeepVolume(1);
	},
	
	hide: function(){
		$(".leaflet-platoon-vehicle-area").hide();
		//beep音
		this.setBeepVolume(0);
	},
	
	setBeep: function(){
		this.setBeepLevel();
		this.setBeepPlay();
	},
	setBeepPlay: function(){
		this.setBeepSotp();
		
		//beep音: H
		if(this.options.beepLevel == "H"){
			$("#leaflet-platoon-vehicle-beep-H")[0].play();
		} 
		//beep音: M
		else if(this.options.beepLevel == "M"){
			$("#leaflet-platoon-vehicle-beep-M")[0].play();
		} 
		//beep音: L
		else {
			
		}
	},
	setBeepSotp: function(){
		$("#leaflet-platoon-vehicle-beep-H")[0].pause();
		$("#leaflet-platoon-vehicle-beep-M")[0].pause();
	},
	resetBeep: function(beepLevel_last){
		//reset beep音
		if(this.options.beepLevel != beepLevel_last){
			this.setBeepLevel();
			this.setBeepPlay();
		}
	},
	setBeepVolume: function(value){
		if(0 <= value && value <= 1){
			$("#leaflet-platoon-vehicle-beep-H")[0].volume = value;
			$("#leaflet-platoon-vehicle-beep-M")[0].volume = value;
		}
	},
	setBeepLevel: function(){
		//高等級
		if( this.options.obstacleDistanceLevel == "H" || 
			this.options.truck1Level == "H" || 
			this.options.truck1Level == "H-selected" || 
			this.options.transverse1Level == "H" || 
			this.options.speed1Level == "H" || 
			this.options.acceleration1Level == "H" || 
			this.options.v2v1Level == "171" || 
			this.options.gnss1Level == "167" || 
			this.options.v2i1Level == "122" || 
			this.options.camera1_1Level == "_error" || 
			this.options.camera1_2Level == "_error" || 
			this.options.fuel1Level == "H" || 
			this.options.cutinCarLevel_1_1 == "H" || 
			this.options.cutinCarLevel_1_2 == "H" || 
			this.options.cutinCarLevel_1_3 == "H" || 
			this.options.truckDistanceLevel_1 == "H" || 
			
			this.options.truck2Level == "H" || 
			this.options.truck2Level == "H-selected" || 
			this.options.transverse2Level == "H" || 
			this.options.speed2Level == "H" || 
			this.options.acceleration2Level == "H" || 
			this.options.v2v2Level == "171" || 
			this.options.gnss2Level == "167" || 
			this.options.v2i2Level == "122" || 
			this.options.camera2_1Level == "_error" || 
			this.options.camera2_2Level == "_error" || 
			this.options.fuel2Level == "H" || 
			this.options.cutinCarLevel_2_1 == "H" || 
			this.options.cutinCarLevel_2_2 == "H" || 
			this.options.cutinCarLevel_2_3 == "H" || 
			this.options.truckDistanceLevel_2 == "H" || 
			
			this.options.truck3Level == "H" || 
			this.options.truck3Level == "H-selected" || 
			this.options.transverse3Level == "H" || 
			this.options.speed3Level == "H" || 
			this.options.acceleration3Level == "H" || 
			this.options.v2v3Level == "171" || 
			this.options.gnss3Level == "167" || 
			this.options.v2i3Level == "122" || 
			this.options.camera3_1Level == "_error" || 
			this.options.camera3_2Level == "_error" || 
			this.options.fuel3Level == "H" || 
			this.options.cutinCarLevel_3_1 == "H" || 
			this.options.cutinCarLevel_3_2 == "H" || 
			this.options.cutinCarLevel_3_3 == "H" || 
			this.options.truckDistanceLevel_3 == "H"
		){
			this.options.beepLevel = "H";
		}
		//中等級
		else if(this.options.obstacleDistanceLevel == "M" || 
				this.options.truck1Level == "M" || 
				this.options.truck1Level == "M-selected" || 
				this.options.transverse1Level == "M" || 
				this.options.speed1Level == "M" || 
				this.options.acceleration1Level == "M" || 
//				this.options.v2v1Level == "M" || 
//				this.options.gnss1Level == "M" || 
//				this.options.v2i1Level == "M" || 
				this.options.fuel1Level == "M" || 
				this.options.cutinCarLevel_1_1 == "M" || 
				this.options.cutinCarLevel_1_2 == "M" || 
				this.options.cutinCarLevel_1_3 == "M" || 
				this.options.truckDistanceLevel_1 == "M" || 
				
				this.options.truck2Level == "M" || 
				this.options.truck2Level == "M-selected" || 
				this.options.transverse2Level == "M" || 
				this.options.speed2Level == "M" || 
				this.options.acceleration2Level == "M" || 
//				this.options.v2v2Level == "M" || 
//				this.options.gnss2Level == "M" || 
//				this.options.v2i2Level == "M" || 
				this.options.fuel2Level == "M" || 
				this.options.cutinCarLevel_2_1 == "M" || 
				this.options.cutinCarLevel_2_2 == "M" || 
				this.options.cutinCarLevel_2_3 == "M" || 
				this.options.truckDistanceLevel_2 == "M" || 
				
				this.options.truck3Level == "M" || 
				this.options.truck3Level == "M-selected" || 
				this.options.transverse3Level == "M" || 
				this.options.speed3Level == "M" || 
				this.options.acceleration3Level == "M" || 
//				this.options.v2v3Level == "M" || 
//				this.options.gnss3Level == "M" || 
//				this.options.v2i3Level == "M" || 
				this.options.fuel3Level == "M" || 
				this.options.cutinCarLevel_3_1 == "M" || 
				this.options.cutinCarLevel_3_2 == "M" || 
				this.options.cutinCarLevel_3_3 == "M" || 
				this.options.truckDistanceLevel_3 == "M"
		){
			this.options.beepLevel = "M";
		} 
		//低等級
		else {
			this.options.beepLevel = "L";
		}
	},
	
	_update: function () {

	},
	
	setType: function(type){
		//value: running, stop
		this.options.type = type;	
		if(type == 'running'){
			$("#leaflet-platoon-vehicle-type").removeClass();
			$("#leaflet-platoon-vehicle-type").addClass("leaflet-platoon-vehicle-running-back");
		} else {
			$("#leaflet-platoon-vehicle-type").removeClass();
			$("#leaflet-platoon-vehicle-type").addClass("leaflet-platoon-vehicle-stop-back");
		}
	},
	setStatus: function(status){
		/* 隊列状態表示 */
		//value: stop, forward, brake, accup2, accdown2, goleft, goright, sharpturn2, turnleft, turnright, uturn
		this.options.status = status;
		if(!status || status == "stop"){
			$("#leaflet-platoon-vehicle-status").attr("src", "");
		} else {
			$("#leaflet-platoon-vehicle-status").attr("src", ContextPath+"/js/lib/leaflet/custom/image/status_"+ status +".png");
		}
	},
	
	setObstacle: function(obstacleFalg, obstacleDistanceLevel, obstacleDistance){
		var obstacleDistanceLevel_old = this.options.obstacleDistanceLevel;
		/* 前方障害物 */
		if(obstacleFalg){
			//value: none, inline
			this.options.obstacleFalg = obstacleFalg;
			$(".leaflet-platoon-vehicle-obstacle").css("display", obstacleFalg);
		}
		//前方障害物の危険等級 (value: L, M, H)
		if(obstacleDistanceLevel){
			//value: L, M, H
			this.options.obstacleDistanceLevel = obstacleDistanceLevel;
			$("#leaflet-obstacle-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/obstacle-"+ obstacleDistanceLevel +".png");
			$("#leaflet-platoon-vehicle-obstacle-style").removeClass();
			$("#leaflet-platoon-vehicle-obstacle-style").addClass("leaflet-platoon-vehicle-color-"+ obstacleDistanceLevel);
		}
		//前方障害物の距離
		if(obstacleDistance || obstacleDistance == 0){
			this.options.obstacleDistance = obstacleDistance;
			$(".leaflet-platoon-vehicle-obstacle-distance").html(obstacleDistance);
		}	
		//前方障害物Twinkle
		if(obstacleDistanceLevel_old != obstacleDistanceLevel){
			this.setObstacleInterval();
		}
	},
	setObstacleInterval: function(){
		if(this.options.obstacleDistanceLevel == "H"){
			this.showOrHideObstacleInterval($("#leaflet-platoon-vehicle-obstacle-value"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.obstacleDistanceLevel == "M"){
			this.showOrHideObstacleInterval($("#leaflet-platoon-vehicle-obstacle-value"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.obstacleInterval != null){
				clearInterval(platoonVehicleInfo.obstacleInterval);
			}
			
			$("#leaflet-platoon-vehicle-obstacle-value").show();
		}
	},
	showOrHideObstacleInterval: function(object, showTime, hideTime){
		if(platoonVehicleInfo.obstacleInterval != null){
			clearInterval(platoonVehicleInfo.obstacleInterval);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.obstacleInterval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideObstacleInterval(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	/* 車輌1 (value: L, L-selected, M, M-selected, H, H-selected) */
	setTruck1Level: function(truckLevel){
		var truckLevel_old = this.options.truck1Level;
		if(truckLevel){
			this.options.truck1Level = truckLevel;
			
			if(this.options.truckSelect == 1){
				$("#leaflet-platoon-vehicle-1").removeClass();
				$("#leaflet-platoon-vehicle-1").addClass("leaflet-platoon-vehicle-truck-"+ truckLevel + "-selected");
			} else {
				$("#leaflet-platoon-vehicle-1").removeClass();
				$("#leaflet-platoon-vehicle-1").addClass("leaflet-platoon-vehicle-truck-"+ truckLevel);
			}
		}
		
		if(truckLevel_old != truckLevel){
			this.setTruck1Interval();
		}
	},
	setTruck1Interval: function(){
		if(this.options.truck1Level == "H" || this.options.truck1Level == "H-select"){
			this.showOrHideTruck1Interval($("#leaflet-platoon-vehicle-1"), this.options.truck1Level, this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.truck1Level == "M" || this.options.truck1Level == "M-select"){
			this.showOrHideTruck1Interval($("#leaflet-platoon-vehicle-1"), this.options.truck1Level, this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.truck1Interval != null){
				clearInterval(platoonVehicleInfo.truck1Interval);
			}
			
			if(this.options.truckSelect == 1){
				$("#leaflet-platoon-vehicle-1").removeClass();
				$("#leaflet-platoon-vehicle-1").addClass("leaflet-platoon-vehicle-truck-"+ this.options.truck1Level + "-selected");
			} else {
				$("#leaflet-platoon-vehicle-1").removeClass();
				$("#leaflet-platoon-vehicle-1").addClass("leaflet-platoon-vehicle-truck-"+ this.options.truck1Level);
			}
		}
	},
	showOrHideTruck1Interval: function(object, truck1Level, showTime, hideTime){
		if(platoonVehicleInfo.truck1Interval != null){
			clearInterval(platoonVehicleInfo.truck1Interval);
		}
		
		var timeTemp = showTime;
		if(object.hasClass("leaflet-platoon-vehicle-truck-"+ truck1Level) || 
			object.hasClass("leaflet-platoon-vehicle-truck-"+ truck1Level + "-selected")		
		){
			object.removeClass();
			timeTemp = hideTime;
		} else {
			if(this.options.truckSelect == 1){
				object.addClass("leaflet-platoon-vehicle-truck-"+ truck1Level + "-selected");
			} else {
				object.addClass("leaflet-platoon-vehicle-truck-"+ truck1Level);
			}
			
			timeTemp = showTime;
		}
		
		platoonVehicleInfo.truck1Interval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideTruck1Interval(object, truck1Level, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setTruck1Model: function(truck1Model){
		/* 車両コントロールモード (value: CACC, ACC, Manual)   */
		if(truck1Model){
			this.options.truck1Model = truck1Model;
			$("#leaflet-platoon-vehicle-truck-model-1").attr("src", ContextPath+"/js/lib/leaflet/custom/image/model_"+ truck1Model +".png");
			$("#leaflet-platoon-vehicle-truck-model-1").show();
		} else {
			$("#leaflet-platoon-vehicle-truck-model-1").hide();
		}
	},
	
	setTransverse1: function(transverse1Flag, transverse1Level, transverse1Value){
		var transverse1Level_old = this.options.transverse1Level;
		/* 横間隔異常 */
		if(transverse1Flag){
			//value: none, inline
			this.options.transverse1Flag = transverse1Flag;
			$(".leaflet-platoon-vehicle-transverse1").css("display", transverse1Flag);
		}
		//横間隔異常の危険等級 (value: L, M, H)
		if(transverse1Level){
			this.options.transverse1Level = transverse1Level;
			$("#leaflet-platoon-vehicle-transverse1-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/error_"+ transverse1Level +"_hensa_mark.png");
			$("#leaflet-platoon-vehicle-transverse1-value-style").removeClass();
			$("#leaflet-platoon-vehicle-transverse1-value-style").addClass("leaflet-platoon-vehicle-error-value-box-"+ transverse1Level);
		}
		//横間隔異常の距離
		if(transverse1Value || transverse1Value == 0){
			this.options.transverse1Value = transverse1Value;
			$("#leaflet-platoon-vehicle-transverse1-value").html(transverse1Value);
		}
		if(transverse1Level_old != transverse1Level){
			this.setTransverse1Interval();
		}
	},
	setTransverse1Interval: function(){
		if(this.options.transverse1Level == "H"){
			this.showOrHideTransverse1Interval($("#leaflet-platoon-vehicle-transverse1-value-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.transverse1Level == "M"){
			this.showOrHideTransverse1Interval($("#leaflet-platoon-vehicle-transverse1-value-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.transverse1Interval != null){
				clearInterval(platoonVehicleInfo.transverse1Interval);
			}
			
			$("#leaflet-platoon-vehicle-transverse1-value-style").show();
		}
	},
	showOrHideTransverse1Interval: function(object, showTime, hideTime){
		if(platoonVehicleInfo.transverse1Interval != null){
			clearInterval(platoonVehicleInfo.transverse1Interval);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.transverse1Interval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideTransverse1Interval(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setSpeed1: function(speed1Flag, speed1Level, speed1Value){
		var speed1Level_old = this.options.speed1Level;
		/* 速度異常 */
		if(speed1Flag){
			//value: none, inline
			this.options.speed1Flag = speed1Flag;
			$(".leaflet-platoon-vehicle-speed1").css("display", speed1Flag);
		}
		//速度異常の危険等級 (value: L, M, H)
		if(speed1Level){
			this.options.speed1Level = speed1Level;
			$("#leaflet-platoon-vehicle-speed1-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/error_"+ speed1Level +"_speed_mark.png");
			$("#leaflet-platoon-vehicle-speed1-value-style").removeClass();
			$("#leaflet-platoon-vehicle-speed1-value-style").addClass("leaflet-platoon-vehicle-error-value-box-"+ speed1Level);
		}
		//速度異常の値
		if(speed1Value || speed1Value == 0){
			this.options.speed1Value = speed1Value;
			$("#leaflet-platoon-vehicle-speed1-value").html(speed1Value);
		}
		
		if(speed1Level_old != speed1Level){
			this.setSpeed1Interval();
		}
	},
	setSpeed1Interval: function(){
		if(this.options.speed1Level == "H"){
			this.showOrHideSpeed1Interval($("#leaflet-platoon-vehicle-speed1-value-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.speed1Level == "M"){
			this.showOrHideSpeed1Interval($("#leaflet-platoon-vehicle-speed1-value-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.speed1Interval != null){
				clearInterval(platoonVehicleInfo.speed1Interval);
			}
			
			$("#leaflet-platoon-vehicle-speed1-value-style").show();
		}
	},
	showOrHideSpeed1Interval: function(object, showTime, hideTime){
		if(platoonVehicleInfo.speed1Interval != null){
			clearInterval(platoonVehicleInfo.speed1Interval);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.speed1Interval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideSpeed1Interval(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setAcceleration1: function(acceleration1Flag, acceleration1Level, acceleration1Value){
		var acceleration1Level_old = this.options.acceleration1Level;
		/* 加速度異常 */
		if(acceleration1Flag){
			//value: none, inline
			this.options.acceleration1Flag = acceleration1Flag;
			$(".leaflet-platoon-vehicle-acceleration1").css("display", acceleration1Flag);
		}
		//加速度異常 の危険等級 (value: L, M, H)
		if(acceleration1Level){
			this.options.acceleration1Level = acceleration1Level;
			$("#leaflet-platoon-vehicle-acceleration1-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/error_"+ acceleration1Level +"_acc_speed_mark.png");
			$("#leaflet-platoon-vehicle-acceleration1-value-style").removeClass();
			$("#leaflet-platoon-vehicle-acceleration1-value-style").addClass("leaflet-platoon-vehicle-error-value-box-"+ acceleration1Level);
		}
		//加速度異常 の値
		if(acceleration1Value || acceleration1Value == 0){
			this.options.acceleration1Value = acceleration1Value;
			$("#leaflet-platoon-vehicle-acceleration1-value").html(acceleration1Value);
		}
		
		if(acceleration1Level_old != acceleration1Level){
			this.setAcceleration1Interval();
		}
	},
	setAcceleration1Interval: function(){
		if(this.options.acceleration1Level == "H"){
			this.showOrHideAcceleration1Interval($("#leaflet-platoon-vehicle-acceleration1-value-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.acceleration1Level == "M"){
			this.showOrHideAcceleration1Interval($("#leaflet-platoon-vehicle-acceleration1-value-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.acceleration1Interval != null){
				clearInterval(platoonVehicleInfo.acceleration1Interval);
			}
			
			$("#leaflet-platoon-vehicle-acceleration1-value-style").show();
		}
	},
	showOrHideAcceleration1Interval: function(object, showTime, hideTime){
		if(platoonVehicleInfo.acceleration1Interval != null){
			clearInterval(platoonVehicleInfo.acceleration1Interval);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.acceleration1Interval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideAcceleration1Interval(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setV2v_1: function(v2v1Level){
		if(v2v1Level){
			//value: 168, 169, 170, 171
			this.options.v2v1Level = v2v1Level;
			$("#leaflet-vehicle1-v2v").attr("src", ContextPath+"/js/lib/leaflet/custom/image/M3_TRUCK_"+ v2v1Level +".png");
		}
	},
	setGnss_1: function(gnss1Level){
		if(gnss1Level){
			//value: 164, 165, 166, 167
			this.options.gnss1Level = gnss1Level;
			$("#leaflet-vehicle1-gnss").attr("src", ContextPath+"/js/lib/leaflet/custom/image/M3_TRUCK_"+ gnss1Level +".png");
		}
	},
	setV2i_1: function(v2i1Level){
		if(v2i1Level){
			//value: 119, 120, 121, 123
			this.options.v2i1Level = v2i1Level;
			$("#leaflet-vehicle1-v2i").attr("src", ContextPath+"/js/lib/leaflet/custom/image/M3_TRUCK_"+ v2i1Level +".png");
		}
	},
	setCamera_1_1: function(camera1_1Level){
		//value: '', _error, _selected
		if(camera1_1Level){
			this.options.camera1_1Level = camera1_1Level;
			$("#leaflet-vehicle1-camera1").attr("src", ContextPath+"/js/lib/leaflet/custom/image/camera"+ camera1_1Level +".png");
		} else {
			this.options.camera1_1Level = "";
			$("#leaflet-vehicle1-camera1").attr("src", ContextPath+"/js/lib/leaflet/custom/image/camera.png");
		}
	},
	setCamera_1_2: function(camera1_2Level){
		//value: '', _error, _selected
		if(camera1_2Level){
			this.options.camera1_2Level = camera1_2Level;
			$("#leaflet-vehicle1-camera2").attr("src", ContextPath+"/js/lib/leaflet/custom/image/camera"+ camera1_2Level +".png");
		} else {
			this.options.camera1_2Level = "";
			$("#leaflet-vehicle1-camera2").attr("src", ContextPath+"/js/lib/leaflet/custom/image/camera.png");
		}
	},
	setFuel_1: function(fuel1Flag, fuel1Level){
		//value: none, inline
		if(fuel1Flag){
			this.options.fuel1Flag = fuel1Flag;
			$("#leaflet-vehicle1-fuel").css("display", fuel1Flag);
		}
		//fuel (value: M, H)
		if(fuel1Level){
			this.options.fuel1Level = fuel1Level;
			$("#leaflet-vehicle1-fuel").attr("src", ContextPath+"/js/lib/leaflet/custom/image/error_"+ fuel1Level +"_fuel.png");
		}
	},
	
	setCutinCar_1_1: function(cutinCarFlag_1_1, cutinCarLevel_1_1, cutinCarValueX_1_1, cutinCarValueY_1_1){
		var cutinCarLevel_1_1_old = this.options.cutinCarLevel_1_1;
		
		/* CutIn車両1 */
		if(cutinCarFlag_1_1){
			//value: none, inline
			this.options.cutinCarFlag_1_1 = cutinCarFlag_1_1;
			$(".leaflet-cutincar1-left").css("display", cutinCarFlag_1_1);
		}
		//CutIn車両1 の危険等級 (value: L, M, H)
		if(cutinCarLevel_1_1){
			this.options.cutinCarLevel_1_1 = cutinCarLevel_1_1;
			$("#leaflet-platoon-vehicle-cutinCar_1_1-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/cutin_car_"+ cutinCarLevel_1_1 +".png?1.1");
			$("#leaflet-platoon-vehicle-cutinCar_1_1-style").removeClass();
			$("#leaflet-platoon-vehicle-cutinCar_1_1-style").addClass("leaflet-platoon-vehicle-color-"+ cutinCarLevel_1_1);
		}
		//CutIn車両1 のX値
		if(cutinCarValueX_1_1 || cutinCarValueX_1_1 === 0){
			this.options.cutinCarValueX_1_1 = cutinCarValueX_1_1;
			$("#leaflet-platoon-vehicle-cutinCarValueX_1_1").html(cutinCarValueX_1_1.toFixed(1));
		}
		//CutIn車両1 のY値
		if(cutinCarValueY_1_1 || cutinCarValueY_1_1 === 0){
			this.options.cutinCarValueY_1_1 = cutinCarValueY_1_1;
			$("#leaflet-platoon-vehicle-cutinCarValueY_1_1").html(cutinCarValueY_1_1.toFixed(1));
		}
		
		if(cutinCarLevel_1_1_old != cutinCarLevel_1_1){
			this.setCutinCarInterval_1_1();
		}
	},
	setCutinCarInterval_1_1: function(){
		if(this.options.cutinCarLevel_1_1 == "H"){
			this.showOrHideCutinCarInterval_1_1($(".leaflet-platoon-vehicle-cutinCarValueX_1_1-content"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.cutinCarLevel_1_1 == "M"){
			this.showOrHideCutinCarInterval_1_1($(".leaflet-platoon-vehicle-cutinCarValueX_1_1-content"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.cutinCarInterval_1_1 != null){
				clearInterval(platoonVehicleInfo.cutinCarInterval_1_1);
			}
			
			$(".leaflet-platoon-vehicle-cutinCarValueX_1_1-content").show();
		}
	},
	showOrHideCutinCarInterval_1_1: function(object, showTime, hideTime){
		if(platoonVehicleInfo.cutinCarInterval_1_1 != null){
			clearInterval(platoonVehicleInfo.cutinCarInterval_1_1);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.cutinCarInterval_1_1 = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideCutinCarInterval_1_1(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setCutinCar_1_2: function(cutinCarFlag_1_2, cutinCarLevel_1_2, cutinCarValueY_1_2){
		var cutinCarLevel_1_2_old = this.options.cutinCarLevel_1_2;
		
		/* CutIn車両2 */
		if(cutinCarFlag_1_2){
			//value: none, inline
			this.options.cutinCarFlag_1_2 = cutinCarFlag_1_2;
			$(".leaflet-cutincar1-center").css("display", cutinCarFlag_1_2);
			
			if(cutinCarFlag_1_2 == "inline"){
				$(".leaflet-center1-distance").hide();
			}
		}
		//CutIn車両2 の危険等級 (value: L, M, H)
		if(cutinCarLevel_1_2){
			this.options.cutinCarLevel_1_2 = cutinCarLevel_1_2;
			$("#leaflet-platoon-vehicle-cutinCar_1_2-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/cutin_car_"+ cutinCarLevel_1_2 +".png?1.1");
			$("#leaflet-platoon-vehicle-cutinCar_1_2-style").removeClass();
			$("#leaflet-platoon-vehicle-cutinCar_1_2-style").addClass("leaflet-platoon-vehicle-color-"+ cutinCarLevel_1_2);
		}
		//CutIn車両2 のY値
		if(cutinCarValueY_1_2 || cutinCarValueY_1_2 === 0){
			this.options.cutinCarValueY_1_2 = cutinCarValueY_1_2;
			$("#leaflet-platoon-vehicle-cutinCarValueY_1_2").html(cutinCarValueY_1_2.toFixed(1));
		}
		
		if(cutinCarLevel_1_2_old != cutinCarLevel_1_2){
			this.setCutinCarInterval_1_2();
		}
	},
	setCutinCarInterval_1_2: function(){
		if(this.options.cutinCarLevel_1_2 == "H"){
			this.showOrHideCutinCarInterval_1_2($("#leaflet-platoon-vehicle-cutinCar_1_2-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.cutinCarLevel_1_2 == "M"){
			this.showOrHideCutinCarInterval_1_2($("#leaflet-platoon-vehicle-cutinCar_1_2-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.cutinCarInterval_1_2 != null){
				clearInterval(platoonVehicleInfo.cutinCarInterval_1_2);
			}
			
			$("#leaflet-platoon-vehicle-cutinCar_1_2-style").css("opacity", 1);
		}
	},
	showOrHideCutinCarInterval_1_2: function(object, showTime, hideTime){
		if(platoonVehicleInfo.cutinCarInterval_1_2 != null){
			clearInterval(platoonVehicleInfo.cutinCarInterval_1_2);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.cutinCarInterval_1_2 = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideCutinCarInterval_1_2(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setCutinCar_1_3: function(cutinCarFlag_1_3, cutinCarLevel_1_3, cutinCarValueX_1_3, cutinCarValueY_1_3){
		var cutinCarLevel_1_3_old = this.options.cutinCarLevel_1_3;
		
		/* CutIn車両3 */
		if(cutinCarFlag_1_3){
			//value: none, inline
			this.options.cutinCarFlag_1_3 = cutinCarFlag_1_3;
			$(".leaflet-cutincar1-right").css("display", cutinCarFlag_1_3);
		}
		//CutIn車両3 の危険等級 (value: L, M, H)
		if(cutinCarLevel_1_3){
			this.options.cutinCarLevel_1_3 = cutinCarLevel_1_3;
			$("#leaflet-platoon-vehicle-cutinCar_1_3-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/cutin_car_"+ cutinCarLevel_1_3 +".png?1.1");
			$("#leaflet-platoon-vehicle-cutinCar_1_3-style").removeClass();
			$("#leaflet-platoon-vehicle-cutinCar_1_3-style").addClass("leaflet-platoon-vehicle-color-"+ cutinCarLevel_1_3);
		}
		//CutIn車両3 のX値
		if(cutinCarValueX_1_3 || cutinCarValueX_1_3 === 0){
			this.options.cutinCarValueX_1_3 = cutinCarValueX_1_3;
			$("#leaflet-platoon-vehicle-cutinCarValueX_1_3").html(cutinCarValueX_1_3.toFixed(1));
		}
		//CutIn車両3 のY値
		if(cutinCarValueY_1_3 || cutinCarValueY_1_3 === 0){
			this.options.cutinCarValueY_1_3 = cutinCarValueY_1_3;
			$("#leaflet-platoon-vehicle-cutinCarValueY_1_3").html(cutinCarValueY_1_3.toFixed(1));
		}
		
		if(cutinCarLevel_1_3_old != cutinCarLevel_1_3){
			this.setCutinCarInterval_1_3();
		}
	},
	setCutinCarInterval_1_3: function(){
		if(this.options.cutinCarLevel_1_3 == "H"){
			this.showOrHideCutinCarInterval_1_3($(".leaflet-platoon-vehicle-cutinCarValueX_1_3-content"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.cutinCarLevel_1_3 == "M"){
			this.showOrHideCutinCarInterval_1_3($(".leaflet-platoon-vehicle-cutinCarValueX_1_3-content"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.cutinCarInterval_1_3 != null){
				clearInterval(platoonVehicleInfo.cutinCarInterval_1_3);
			}
			
			$(".leaflet-platoon-vehicle-cutinCarValueX_1_3-content").css("opacity", 1)
		}
	},
	showOrHideCutinCarInterval_1_3: function(object, showTime, hideTime){
		if(platoonVehicleInfo.cutinCarInterval_1_3 != null){
			clearInterval(platoonVehicleInfo.cutinCarInterval_1_3);
		}
		
		var timeTemp = showTime;
		if(object.css("opacity") == "0"){
			object.css("opacity", 1);
			timeTemp = showTime;
		} else {
			object.css("opacity", 0);
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.cutinCarInterval_1_3 = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideCutinCarInterval_1_3(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setTruckDistance_1: function(truckDistanceFlag_1, truckDistanceLevel_1, truckDistanceValue_1){
		var truckDistanceLevel_1_old = this.options.truckDistanceLevel_1;
		
		//車両1-車両2 距離
		if(truckDistanceFlag_1){
			//value: none, inline
			this.options.truckDistanceFlag_1 = truckDistanceFlag_1;
			$(".leaflet-center1-distance").css("display", truckDistanceFlag_1);
			
			if(truckDistanceFlag_1 == "inline"){
				$(".leaflet-cutincar1-center").hide();
			}
		}
		//車両1-車両2 距離の危険等級 (value: L, M, H)
		if(truckDistanceLevel_1){
			this.options.truckDistanceLevel_1 = truckDistanceLevel_1;
			$("#leaflet-platoon-vehicle-truckDistance-icon-up-1").attr("src", ContextPath+"/js/lib/leaflet/custom/image/arrow_up_"+ truckDistanceLevel_1 +".png");
			$("#leaflet-platoon-vehicle-truckDistance-icon-down-1").attr("src", ContextPath+"/js/lib/leaflet/custom/image/arrow_down_"+ truckDistanceLevel_1 +".png");
			$("#leaflet-platoon-vehicle-truckDistanceValue_1-style").removeClass();
			$("#leaflet-platoon-vehicle-truckDistanceValue_1-style").addClass("leaflet-platoon-vehicle-color-"+ truckDistanceLevel_1);
		}
		//車両1-車両2 距離の値
		if(truckDistanceValue_1 || truckDistanceValue_1 == 0){
			this.options.truckDistanceValue_1 = truckDistanceValue_1;
			$("#leaflet-platoon-vehicle-truckDistanceValue_1").html(truckDistanceValue_1);
		}
		
		if(truckDistanceLevel_1_old != truckDistanceLevel_1){
			this.setTruckDistanceInterval_1();
		}
	},
	setTruckDistanceInterval_1: function(){
		if(this.options.truckDistanceLevel_1 == "H"){
			this.showOrHideTruckDistanceInterval_1($("#leaflet-platoon-vehicle-truckDistanceValue_1-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.truckDistanceLevel_1 == "M"){
			this.showOrHideTruckDistanceInterval_1($("#leaflet-platoon-vehicle-truckDistanceValue_1-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.truckDistanceInterval_1 != null){
				clearInterval(platoonVehicleInfo.truckDistanceInterval_1);
			}
			
			$("#leaflet-platoon-vehicle-truckDistanceValue_1-style").show();
		}
	},
	showOrHideTruckDistanceInterval_1: function(object, showTime, hideTime){
		if(platoonVehicleInfo.truckDistanceInterval_1 != null){
			clearInterval(platoonVehicleInfo.truckDistanceInterval_1);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.truckDistanceInterval_1 = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideTruckDistanceInterval_1(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	/* 車輌2 (value: L, L-selected, M, M-selected, H, H-selected) */
	setTruck2Level: function(truckLevel){
		var truckLevel_old = this.options.truck2Level;
		
		if(truckLevel){
			this.options.truck2Level = truckLevel;
			
			if(this.options.truckSelect == 2){
				$("#leaflet-platoon-vehicle-2").removeClass();
				$("#leaflet-platoon-vehicle-2").addClass("leaflet-platoon-vehicle-truck-"+ truckLevel + "-selected");
			} else {
				$("#leaflet-platoon-vehicle-2").removeClass();
				$("#leaflet-platoon-vehicle-2").addClass("leaflet-platoon-vehicle-truck-"+ truckLevel);
			}
		}
		
		if(truckLevel_old != truckLevel){
			this.setTruck2Interval();
		}
	},
	setTruck2Interval: function(){
		if(this.options.truck2Level == "H" || this.options.truck2Level == "H-selected"){
			this.showOrHideTruck2Interval($("#leaflet-platoon-vehicle-2"), this.options.truck2Level, this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.truck2Level == "M" || this.options.truck2Level == "M-selected"){
			this.showOrHideTruck2Interval($("#leaflet-platoon-vehicle-2"), this.options.truck2Level, this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.truck2Interval != null){
				clearInterval(platoonVehicleInfo.truck2Interval);
			}
			
			if(this.options.truckSelect == 2){
				$("#leaflet-platoon-vehicle-2").removeClass();
				$("#leaflet-platoon-vehicle-2").addClass("leaflet-platoon-vehicle-truck-"+ this.options.truck2Level + "-selected");
			} else {
				$("#leaflet-platoon-vehicle-2").removeClass();
				$("#leaflet-platoon-vehicle-2").addClass("leaflet-platoon-vehicle-truck-"+ this.options.truck2Level);
			}
		}
	},
	showOrHideTruck2Interval: function(object, truck2Level, showTime, hideTime){
		if(platoonVehicleInfo.truck2Interval != null){
			clearInterval(platoonVehicleInfo.truck2Interval);
		}
		
		var timeTemp = showTime;
		if(object.hasClass("leaflet-platoon-vehicle-truck-"+ truck2Level) || 
			object.hasClass("leaflet-platoon-vehicle-truck-"+ truck2Level + "-selected")		
		){
			object.removeClass();
			timeTemp = hideTime;
		} else {
			if(this.options.truckSelect == 2){
				object.addClass("leaflet-platoon-vehicle-truck-"+ truck2Level + "-selected");
			} else {
				object.addClass("leaflet-platoon-vehicle-truck-"+ truck2Level);
			}
			
			timeTemp = showTime;
		}
		
		platoonVehicleInfo.truck2Interval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideTruck2Interval(object, truck2Level, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setTruck2Model: function(truck2Model){
		/* 車両コントロールモード (value: CACC, ACC, Manual)   */
		if(truck2Model){
			this.options.truck2Model = truck2Model;
			$("#leaflet-platoon-vehicle-truck-model-2").attr("src", ContextPath+"/js/lib/leaflet/custom/image/model_"+ truck2Model +".png");
			$("#leaflet-platoon-vehicle-truck-model-2").show();
		} else {
			$("#leaflet-platoon-vehicle-truck-model-2").hide();
		}
	},
	
	setTransverse2: function(transverse2Flag, transverse2Level, transverse2Value){
		var transverse2Level_old = this.options.transverse2Level;
		
		/* 横間隔異常 */
		if(transverse2Flag){
			//value: none, inline
			this.options.transverse2Flag = transverse2Flag;
			$(".leaflet-platoon-vehicle-transverse2").css("display", transverse2Flag);
		}
		//横間隔異常の危険等級 (value: L, M, H)
		if(transverse2Level){
			this.options.transverse2Level = transverse2Level;
			$("#leaflet-platoon-vehicle-transverse2-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/error_"+ transverse2Level +"_hensa_mark.png");
			$("#leaflet-platoon-vehicle-transverse2-value-style").removeClass();
			$("#leaflet-platoon-vehicle-transverse2-value-style").addClass("leaflet-platoon-vehicle-error-value-box-"+ transverse2Level);
		}
		//横間隔異常の距離
		if(transverse2Value || transverse2Value == 0){
			this.options.transverse2Value = transverse2Value;
			$("#leaflet-platoon-vehicle-transverse2-value").html(transverse2Value);
		}
		
		if(transverse2Level_old != transverse2Level){
			this.setTransverse2Interval();
		}
	},
	setTransverse2Interval: function(){
		if(this.options.transverse2Level == "H"){
			this.showOrHideTransverse2Interval($("#leaflet-platoon-vehicle-transverse2-value-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.transverse2Level == "M"){
			this.showOrHideTransverse2Interval($("#leaflet-platoon-vehicle-transverse2-value-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.transverse2Interval != null){
				clearInterval(platoonVehicleInfo.transverse2Interval);
			}
			
			$("#leaflet-platoon-vehicle-transverse2-value-style").show();
		}
	},
	showOrHideTransverse2Interval: function(object, showTime, hideTime){
		if(platoonVehicleInfo.transverse2Interval != null){
			clearInterval(platoonVehicleInfo.transverse2Interval);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.transverse2Interval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideTransverse2Interval(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setSpeed2: function(speed2Flag, speed2Level, speed2Value){
		var speed2Level_old = this.options.speed2Level;
			
		/* 速度異常 */
		if(speed2Flag){
			//value: none, inline
			this.options.speed2Flag = speed2Flag;
			$(".leaflet-platoon-vehicle-speed2").css("display", speed2Flag);
		}
		//速度異常の危険等級 (value: L, M, H)
		if(speed2Level){
			this.options.speed2Level = speed2Level;
			$("#leaflet-platoon-vehicle-speed2-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/error_"+ speed2Level +"_speed_mark.png");
			$("#leaflet-platoon-vehicle-speed2-value-style").removeClass();
			$("#leaflet-platoon-vehicle-speed2-value-style").addClass("leaflet-platoon-vehicle-error-value-box-"+ speed2Level);
		}
		//速度異常の値
		if(speed2Value || speed2Value == 0){
			//value: L, M, H
			this.options.speed2Value = speed2Value;
			$("#leaflet-platoon-vehicle-speed2-value").html(speed2Value);
		}
		
		if(speed2Level_old != speed2Level){
			this.setSpeed2Interval();
		}
	},
	setSpeed2Interval: function(){
		if(this.options.speed2Level == "H"){
			this.showOrHideSpeed2Interval($("#leaflet-platoon-vehicle-speed2-value-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.speed2Level == "M"){
			this.showOrHideSpeed2Interval($("#leaflet-platoon-vehicle-speed2-value-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.speed2Interval != null){
				clearInterval(platoonVehicleInfo.speed2Interval);
			}
			
			$("#leaflet-platoon-vehicle-speed2-value-style").show();
		}
	},
	showOrHideSpeed2Interval: function(object, showTime, hideTime){
		if(platoonVehicleInfo.speed2Interval != null){
			clearInterval(platoonVehicleInfo.speed2Interval);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.speed2Interval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideSpeed2Interval(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setAcceleration2: function(acceleration2Flag, acceleration2Level, acceleration2Value){
		var acceleration2Level_old = this.options.acceleration2Level;
			
		/* 加速度異常 */
		if(acceleration2Flag){
			//value: none, inline
			this.options.acceleration2Flag = acceleration2Flag;
			$(".leaflet-platoon-vehicle-acceleration2").css("display", acceleration2Flag);
		}
		//加速度異常 の危険等級 (value: L, M, H)
		if(acceleration2Level){
			this.options.acceleration2Level = acceleration2Level;
			$("#leaflet-platoon-vehicle-acceleration2-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/error_"+ acceleration2Level +"_acc_speed_mark.png");
			$("#leaflet-platoon-vehicle-acceleration2-value-style").removeClass();
			$("#leaflet-platoon-vehicle-acceleration2-value-style").addClass("leaflet-platoon-vehicle-error-value-box-"+ acceleration2Level);
		}
		//加速度異常 の値
		if(acceleration2Value || acceleration2Value == 0){
			this.options.acceleration2Value = acceleration2Value;
			$("#leaflet-platoon-vehicle-acceleration2-value").html(acceleration2Value);
		}
		
		if(acceleration2Level_old != acceleration2Level){
			this.setAcceleration2Interval();
		}
	},
	setAcceleration2Interval: function(){
		if(this.options.acceleration2Level == "H"){
			this.showOrHideAcceleration2Interval($("#leaflet-platoon-vehicle-acceleration2-value-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.acceleration2Level == "M"){
			this.showOrHideAcceleration2Interval($("#leaflet-platoon-vehicle-acceleration2-value-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.acceleration2Interval != null){
				clearInterval(platoonVehicleInfo.acceleration2Interval);
			}
			
			$("#leaflet-platoon-vehicle-acceleration2-value-style").show();
		}
	},
	showOrHideAcceleration2Interval: function(object, showTime, hideTime){
		if(platoonVehicleInfo.acceleration2Interval != null){
			clearInterval(platoonVehicleInfo.acceleration2Interval);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.acceleration2Interval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideAcceleration2Interval(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setV2v_2: function(v2v2Level){
		if(v2v2Level){
			//value: 168, 169, 170, 171
			this.options.v2v2Level = v2v2Level;
			$("#leaflet-vehicle2-v2v").attr("src", ContextPath+"/js/lib/leaflet/custom/image/M3_TRUCK_"+ v2v2Level +".png");
		}
	},
	setGnss_2: function(gnss2Level){
		if(gnss2Level){
			//value: 164, 165, 166, 167
			this.options.gnss2Level = gnss2Level;
			$("#leaflet-vehicle2-gnss").attr("src", ContextPath+"/js/lib/leaflet/custom/image/M3_TRUCK_"+ gnss2Level +".png");
		}
	},
	setV2i_2: function(v2i2Level){
		if(v2i2Level){
			//value: 119, 120, 121, 123
			this.options.v2i2Level = v2i2Level;
			$("#leaflet-vehicle2-v2i").attr("src", ContextPath+"/js/lib/leaflet/custom/image/M3_TRUCK_"+ v2i2Level +".png");
		}
	},
	setCamera_2_1: function(camera2_1Level){
		//camera1 (value: '', _error, _selected)
		if(camera2_1Level){
			this.options.camera2_1Level = camera2_1Level;
			$("#leaflet-vehicle2-camera1").attr("src", ContextPath+"/js/lib/leaflet/custom/image/camera"+ camera2_1Level +".png");
		} else {
			this.options.camera2_1Level = "";
			$("#leaflet-vehicle2-camera1").attr("src", ContextPath+"/js/lib/leaflet/custom/image/camera.png");
		}
	},
	setCamera_2_2: function(camera2_2Level){
		//camera2 (value: '', _error, _selected)
		if(camera2_2Level){
			this.options.camera2_2Level = camera2_2Level;
			$("#leaflet-vehicle2-camera2").attr("src", ContextPath+"/js/lib/leaflet/custom/image/camera"+ camera2_2Level +".png");
		} else {
			this.options.camera2_2Level = "";
			$("#leaflet-vehicle2-camera2").attr("src", ContextPath+"/js/lib/leaflet/custom/image/camera.png");
		}
	},
	setFuel_2: function(fuel2Flag, fuel2Level){
		//value: none, inline
		if(fuel2Flag){
			this.options.fuel2Flag = fuel2Flag;
			$("#leaflet-vehicle2-fuel").css("display", fuel2Flag);
		}
		//fuel (value: M, H)
		if(fuel2Level){
			this.options.fuel2Level = fuel2Level;
			$("#leaflet-vehicle2-fuel").attr("src", ContextPath+"/js/lib/leaflet/custom/image/error_"+ fuel2Level +"_fuel.png");
		}
	},
	
	setCutinCar_2_1: function(cutinCarFlag_2_1, cutinCarLevel_2_1, cutinCarValueX_2_1, cutinCarValueY_2_1){
		var cutinCarLevel_2_1_old = this.options.cutinCarLevel_2_1;
		
		/* CutIn車両1 */
		if(cutinCarFlag_2_1){
			//value: none, inline
			this.options.cutinCarFlag_2_1 = cutinCarFlag_2_1;
			$(".leaflet-cutincar2-left").css("display", cutinCarFlag_2_1);
		}
		//CutIn車両1 の危険等級 (value: L, M, H)
		if(cutinCarLevel_2_1){
			this.options.cutinCarLevel_2_1 = cutinCarLevel_2_1;
			$("#leaflet-platoon-vehicle-cutinCar_2_1-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/cutin_car_"+ cutinCarLevel_2_1 +".png?1.1");
			$("#leaflet-platoon-vehicle-cutinCar_2_1-style").removeClass();
			$("#leaflet-platoon-vehicle-cutinCar_2_1-style").addClass("leaflet-platoon-vehicle-color-"+ cutinCarLevel_2_1);
		}
		//CutIn車両1 のX値
		if(cutinCarValueX_2_1 || cutinCarValueX_2_1 === 0){
			this.options.cutinCarValueX_2_1 = cutinCarValueX_2_1;
			$("#leaflet-platoon-vehicle-cutinCarValueX_2_1").html(cutinCarValueX_2_1.toFixed(1));
		}
		//CutIn車両1 のY値
		if(cutinCarValueY_2_1 || cutinCarValueY_2_1 === 0){
			this.options.cutinCarValueY_2_1 = cutinCarValueY_2_1;
			$("#leaflet-platoon-vehicle-cutinCarValueY_2_1").html(cutinCarValueY_2_1.toFixed(1));
		}
		
		if(cutinCarLevel_2_1_old != cutinCarLevel_2_1){
			this.setCutinCarInterval_2_1();
		}
	},
	setCutinCarInterval_2_1: function(){
		if(this.options.cutinCarLevel_2_1 == "H"){
			this.showOrHideCutinCarInterval_2_1($(".leaflet-platoon-vehicle-cutinCarValueX_2_1-content"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.cutinCarLevel_2_1 == "M"){
			this.showOrHideCutinCarInterval_2_1($(".leaflet-platoon-vehicle-cutinCarValueX_2_1-content"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.cutinCarInterval_2_1 != null){
				clearInterval(platoonVehicleInfo.cutinCarInterval_2_1);
			}
			
			$(".leaflet-platoon-vehicle-cutinCarValueX_2_1-content").show();
		}
	},
	showOrHideCutinCarInterval_2_1: function(object, showTime, hideTime){
		if(platoonVehicleInfo.cutinCarInterval_2_1 != null){
			clearInterval(platoonVehicleInfo.cutinCarInterval_2_1);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.cutinCarInterval_2_1 = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideCutinCarInterval_2_1(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setCutinCar_2_2: function(cutinCarFlag_2_2, cutinCarLevel_2_2, cutinCarValueY_2_2){
		var cutinCarLevel_2_2_old = this.options.cutinCarLevel_2_2;
			
		/* CutIn車両 2*/
		if(cutinCarFlag_2_2){
			//value: none, inline
			this.options.cutinCarFlag_2_2 = cutinCarFlag_2_2;
			$(".leaflet-cutincar2-center").css("display", cutinCarFlag_2_2);
			
			if(cutinCarFlag_2_2 == "inline"){
				$(".leaflet-center2-distance").hide();
			}
		}
		//CutIn車両2 の危険等級 (value: L, M, H)
		if(cutinCarLevel_2_2){
			this.options.cutinCarLevel_2_2 = cutinCarLevel_2_2;
			$("#leaflet-platoon-vehicle-cutinCar_2_2-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/cutin_car_"+ cutinCarLevel_2_2 +".png?1.1");
			$("#leaflet-platoon-vehicle-cutinCar_2_2-style").removeClass();
			$("#leaflet-platoon-vehicle-cutinCar_2_2-style").addClass("leaflet-platoon-vehicle-color-"+ cutinCarLevel_2_2);
		}
		//CutIn車両2 のY値
		if(cutinCarValueY_2_2 || cutinCarValueY_2_2 === 0){
			this.options.cutinCarValueY_2_2 = cutinCarValueY_2_2;
			$("#leaflet-platoon-vehicle-cutinCarValueY_2_2").html(cutinCarValueY_2_2.toFixed(1));
		}
		
		if(cutinCarLevel_2_2_old != cutinCarLevel_2_2){
			this.setCutinCarInterval_2_2();
		}
	},
	setCutinCarInterval_2_2: function(){
		if(this.options.cutinCarLevel_2_2 == "H"){
			this.showOrHideCutinCarInterval_2_2($("#leaflet-platoon-vehicle-cutinCar_2_2-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.cutinCarLevel_2_2 == "M"){
			this.showOrHideCutinCarInterval_2_2($("#leaflet-platoon-vehicle-cutinCar_2_2-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.cutinCarInterval_2_2 != null){
				clearInterval(platoonVehicleInfo.cutinCarInterval_2_2);
			}
			
			$("#leaflet-platoon-vehicle-cutinCar_2_2-style").show();
		}
	},
	showOrHideCutinCarInterval_2_2: function(object, showTime, hideTime){
		if(platoonVehicleInfo.cutinCarInterval_2_2 != null){
			clearInterval(platoonVehicleInfo.cutinCarInterval_2_2);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.cutinCarInterval_2_2 = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideCutinCarInterval_2_2(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setCutinCar_2_3: function(cutinCarFlag_2_3, cutinCarLevel_2_3, cutinCarValueX_2_3, cutinCarValueY_2_3){
		var cutinCarLevel_2_3_old = this.options.cutinCarLevel_2_3;
		
		/* CutIn車両3 */
		if(cutinCarFlag_2_3){
			//value: none, inline
			this.options.cutinCarFlag_2_3 = cutinCarFlag_2_3;
			$(".leaflet-cutincar2-right").css("display", cutinCarFlag_2_3);
		}
		//CutIn車両3 の危険等級 (value: L, M, H)
		if(cutinCarLevel_2_3){
			this.options.cutinCarLevel_2_3 = cutinCarLevel_2_3;
			$("#leaflet-platoon-vehicle-cutinCar_2_3-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/cutin_car_"+ cutinCarLevel_2_3 +".png?1.1");
			$("#leaflet-platoon-vehicle-cutinCar_2_3-style").removeClass();
			$("#leaflet-platoon-vehicle-cutinCar_2_3-style").addClass("leaflet-platoon-vehicle-color-"+ cutinCarLevel_2_3);
		}
		//CutIn車両3 のX値
		if(cutinCarValueX_2_3 || cutinCarValueX_2_3 === 0){
			this.options.cutinCarValueX_2_3 = cutinCarValueX_2_3;
			$("#leaflet-platoon-vehicle-cutinCarValueX_2_3").html(cutinCarValueX_2_3.toFixed(1));
		}
		//CutIn車両3 のY値
		if(cutinCarValueY_2_3 || cutinCarValueY_2_3 === 0){
			this.options.cutinCarValueY_2_3 = cutinCarValueY_2_3;
			$("#leaflet-platoon-vehicle-cutinCarValueY_2_3").html(cutinCarValueY_2_3.toFixed(1));
		}
		
		if(cutinCarLevel_2_3_old != cutinCarLevel_2_3){
			this.setCutinCarInterval_2_3();
		}
	},
	setCutinCarInterval_2_3: function(){
		if(this.options.cutinCarLevel_2_3 == "H"){
			this.showOrHideCutinCarInterval_2_3($(".leaflet-platoon-vehicle-cutinCarValueX_2_3-content"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.cutinCarLevel_2_3 == "M"){
			this.showOrHideCutinCarInterval_2_3($(".leaflet-platoon-vehicle-cutinCarValueX_2_3-content"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.cutinCarInterval_2_3 != null){
				clearInterval(platoonVehicleInfo.cutinCarInterval_2_3);
			}
			
			$(".leaflet-platoon-vehicle-cutinCarValueX_2_3-content").css("opacity", 1);
		}
	},
	showOrHideCutinCarInterval_2_3: function(object, showTime, hideTime){
		if(platoonVehicleInfo.cutinCarInterval_2_3 != null){
			clearInterval(platoonVehicleInfo.cutinCarInterval_2_3);
		}
		
		var timeTemp = showTime;
		if(object.css("opacity") == "0"){
			object.css("opacity", 1);
			timeTemp = showTime;
		} else {
			object.css("opacity", 0);
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.cutinCarInterval_2_3 = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideCutinCarInterval_2_3(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setTruckDistance_2: function(truckDistanceFlag_2, truckDistanceLevel_2, truckDistanceValue_2){
		var truckDistanceLevel_2_old = this.options.truckDistanceLevel_2;
		
		//車両2-車両3 距離
		if(truckDistanceFlag_2){
			//value: none, inline
			this.options.truckDistanceFlag_2 = truckDistanceFlag_2;
			$(".leaflet-center2-distance").css("display", truckDistanceFlag_2);
			
			if(truckDistanceFlag_2 == "inline"){
				$(".leaflet-cutincar2-center").hide();
			}
		}
		//車両2-車両3 距離の危険等級 (value: L, M, H)
		if(truckDistanceLevel_2){
			this.options.truckDistanceLevel_2 = truckDistanceLevel_2;
			$("#leaflet-platoon-vehicle-truckDistance-icon-up-2").attr("src", ContextPath+"/js/lib/leaflet/custom/image/arrow_up_"+ truckDistanceLevel_2 +".png");
			$("#leaflet-platoon-vehicle-truckDistance-icon-down-2").attr("src", ContextPath+"/js/lib/leaflet/custom/image/arrow_down_"+ truckDistanceLevel_2 +".png");
			$("#leaflet-platoon-vehicle-truckDistanceValue_2-style").removeClass();
			$("#leaflet-platoon-vehicle-truckDistanceValue_2-style").addClass("leaflet-platoon-vehicle-color-"+ truckDistanceLevel_2);
		}
		//車両2-車両3 距離の値
		if(truckDistanceValue_2 || truckDistanceValue_2 == 0){
			this.options.truckDistanceValue_2 = truckDistanceValue_2;
			$("#leaflet-platoon-vehicle-truckDistanceValue_2").html(truckDistanceValue_2);
		}
		
		if(truckDistanceLevel_2_old != truckDistanceLevel_2){
			this.setTruckDistanceInterval_2();
		}
	},
	setTruckDistanceInterval_2: function(){
		if(this.options.truckDistanceLevel_2 == "H"){
			this.showOrHideTruckDistanceInterval_2($("#leaflet-platoon-vehicle-truckDistanceValue_2-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.truckDistanceLevel_2 == "M"){
			this.showOrHideTruckDistanceInterval_2($("#leaflet-platoon-vehicle-truckDistanceValue_2-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.truckDistanceInterval_2 != null){
				clearInterval(platoonVehicleInfo.truckDistanceInterval_2);
			}
			
			$("#leaflet-platoon-vehicle-truckDistanceValue_2-style").show();
		}
	},
	showOrHideTruckDistanceInterval_2: function(object, showTime, hideTime){
		if(platoonVehicleInfo.truckDistanceInterval_2 != null){
			clearInterval(platoonVehicleInfo.truckDistanceInterval_2);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.truckDistanceInterval_2 = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideTruckDistanceInterval_2(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	

	/* 車輌3 (value: L, L-selected, M, M-selected, H, H-selected) */
	setTruck3Level: function(truckLevel){
		var truckLevel_old = this.options.truck3Level;
			
		if(truckLevel){
			// value: L, L-selected, M, M-selected, H, H-selected
			this.options.truck3Level = truckLevel;
			
			if(this.options.truckSelect == 3){
				$("#leaflet-platoon-vehicle-3").removeClass();
				$("#leaflet-platoon-vehicle-3").addClass("leaflet-platoon-vehicle-truck-"+ truckLevel + "-selected");
			} else {
				$("#leaflet-platoon-vehicle-3").removeClass();
				$("#leaflet-platoon-vehicle-3").addClass("leaflet-platoon-vehicle-truck-"+ truckLevel);
			}
		}
		
		if(truckLevel_old != truckLevel){
			this.setTruck3Interval();
		}
	},
	setTruck3Interval: function(){
		if(this.options.truck3Level == "H" || this.options.truck3Level == "H-selected"){
			this.showOrHideTruck3Interval($("#leaflet-platoon-vehicle-3"), this.options.truck3Level, this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.truck3Level == "M" || this.options.truck3Level == "M-selected"){
			this.showOrHideTruck3Interval($("#leaflet-platoon-vehicle-3"), this.options.truck3Level, this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.truck3Interval != null){
				clearInterval(platoonVehicleInfo.truck3Interval);
			}
			
			if(this.options.truckSelect == 3){
				$("#leaflet-platoon-vehicle-3").removeClass();
				$("#leaflet-platoon-vehicle-3").addClass("leaflet-platoon-vehicle-truck-"+ this.options.truck3Level + "-selected");
			} else {
				$("#leaflet-platoon-vehicle-3").removeClass();
				$("#leaflet-platoon-vehicle-3").addClass("leaflet-platoon-vehicle-truck-"+ this.options.truck3Level);
			}
		}
	},
	showOrHideTruck3Interval: function(object, truck3Level, showTime, hideTime){
		if(platoonVehicleInfo.truck3Interval != null){
			clearInterval(platoonVehicleInfo.truck3Interval);
		}
		
		var timeTemp = showTime;
		if(object.hasClass("leaflet-platoon-vehicle-truck-"+ truck3Level) || 
			object.hasClass("leaflet-platoon-vehicle-truck-"+ truck3Level + "-selected")		
		){
			object.removeClass();
			timeTemp = hideTime;
		} else {
			if(this.options.truckSelect == 3){
				object.addClass("leaflet-platoon-vehicle-truck-"+ truck3Level + "-selected");
			} else {
				object.addClass("leaflet-platoon-vehicle-truck-"+ truck3Level);
			}
			
			timeTemp = showTime;
		}
		
		platoonVehicleInfo.truck3Interval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideTruck3Interval(object, truck3Level, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setTruck3Model: function(truck3Model){
		/* 車両コントロールモード (value: CACC, ACC, Manual)   */
		if(truck3Model){
			this.options.truck3Model = truck3Model;
			$("#leaflet-platoon-vehicle-truck-model-3").attr("src", ContextPath+"/js/lib/leaflet/custom/image/model_"+ truck3Model +".png");
			$("#leaflet-platoon-vehicle-truck-model-3").show();
		} else {
			$("#leaflet-platoon-vehicle-truck-model-3").hide();
		}
	},
	
	setTransverse3: function(transverse3Flag, transverse3Level, transverse3Value){
		var transverse3Level_old = this.options.transverse3Level;
			
		/* 横間隔異常 */
		if(transverse3Flag){
			//value: none, inline
			this.options.transverse3Flag = transverse3Flag;
			$(".leaflet-platoon-vehicle-transverse3").css("display", transverse3Flag);
		}
		//横間隔異常の危険等級 (value: L, M, H)
		if(transverse3Level){
			this.options.transverse3Level = transverse3Level;
			$("#leaflet-platoon-vehicle-transverse3-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/error_"+ transverse3Level +"_hensa_mark.png");
			$("#leaflet-platoon-vehicle-transverse3-value-style").removeClass();
			$("#leaflet-platoon-vehicle-transverse3-value-style").addClass("leaflet-platoon-vehicle-error-value-box-"+ transverse3Level);
		}
		//横間隔異常の距離
		if(transverse3Value || transverse3Value == 0){
			this.options.transverse3Value = transverse3Value;
			$("#leaflet-platoon-vehicle-transverse3-value").html(transverse3Value);
		}
		
		if(transverse3Level_old != transverse3Level){
			this.setTransverse3Interval();
		}
	},
	setTransverse3Interval: function(){
		if(this.options.transverse3Level == "H"){
			this.showOrHideTransverse3Interval($("#leaflet-platoon-vehicle-transverse3-value-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.transverse3Level == "M"){
			this.showOrHideTransverse3Interval($("#leaflet-platoon-vehicle-transverse3-value-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.transverse3Interval != null){
				clearInterval(platoonVehicleInfo.transverse3Interval);
			}
			
			$("#leaflet-platoon-vehicle-transverse3-value-style").show();
		}
	},
	showOrHideTransverse3Interval: function(object, showTime, hideTime){
		if(platoonVehicleInfo.transverse3Interval != null){
			clearInterval(platoonVehicleInfo.transverse3Interval);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.transverse3Interval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideTransverse3Interval(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setSpeed3: function(speed3Flag, speed3Level, speed3Value){
		var speed3Level_old = this.options.speed3Level;
		/* 速度異常 */
		if(speed3Flag){
			//value: none, inline
			this.options.speed3Flag = speed3Flag;
			$(".leaflet-platoon-vehicle-speed3").css("display", speed3Flag);
		}
		//速度異常の危険等級 (value: L, M, H)
		if(speed3Level){
			this.options.speed3Level = speed3Level;
			$("#leaflet-platoon-vehicle-speed3-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/error_"+ speed3Level +"_speed_mark.png");
			$("#leaflet-platoon-vehicle-speed3-value-style").removeClass();
			$("#leaflet-platoon-vehicle-speed3-value-style").addClass("leaflet-platoon-vehicle-error-value-box-"+ speed3Level);
		}
		//速度異常の値
		if(speed3Value || speed3Value == 0){
			this.options.speed3Value = speed3Value;
			$("#leaflet-platoon-vehicle-speed3-value").html(speed3Value);
		}
		
		if(speed3Level_old != speed3Level){
			this.setSpeed3Interval();
		}
	},
	setSpeed3Interval: function(){
		if(this.options.speed3Level == "H"){
			this.showOrHideSpeed3Interval($("#leaflet-platoon-vehicle-speed3-value-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.speed3Level == "M"){
			this.showOrHideSpeed3Interval($("#leaflet-platoon-vehicle-speed3-value-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.speed3Interval != null){
				clearInterval(platoonVehicleInfo.speed3Interval);
			}
			
			$("#leaflet-platoon-vehicle-speed3-value-style").show();
		}
	},
	showOrHideSpeed3Interval: function(object, showTime, hideTime){
		if(platoonVehicleInfo.speed3Interval != null){
			clearInterval(platoonVehicleInfo.speed3Interval);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.speed3Interval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideSpeed3Interval(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setAcceleration3: function(acceleration3Flag, acceleration3Level, acceleration3Value){
		var acceleration3Level_old = this.options.acceleration3Level;
			
		/* 加速度異常 */
		if(acceleration3Flag){
			//value: none, inline
			this.options.acceleration3Flag = acceleration3Flag;
			$(".leaflet-platoon-vehicle-acceleration3").css("display", acceleration3Flag);
		}
		//加速度異常 の危険等級 (value: L, M, H)
		if(acceleration3Level){
			this.options.acceleration3Level = acceleration3Level;
			$("#leaflet-platoon-vehicle-acceleration3-icon").attr("src", ContextPath+"/js/lib/leaflet/custom/image/error_"+ acceleration3Level +"_acc_speed_mark.png");
			$("#leaflet-platoon-vehicle-acceleration3-value-style").removeClass();
			$("#leaflet-platoon-vehicle-acceleration3-value-style").addClass("leaflet-platoon-vehicle-error-value-box-"+ acceleration3Level);
		}
		//加速度異常 の値
		if(acceleration3Value || acceleration3Value == 0){
			this.options.acceleration3Value = acceleration3Value;
			$("#leaflet-platoon-vehicle-acceleration3-value").html(acceleration3Value);
		}
		
		if(acceleration3Level_old != acceleration3Level){
			this.setAcceleration3Interval();
		}
	},
	setAcceleration3Interval: function(){
		if(this.options.acceleration3Level == "H"){
			this.showOrHideAcceleration3Interval($("#leaflet-platoon-vehicle-acceleration3-value-style"), this.options.intervalTime_show_H, this.options.intervalTime_hide_H);
		} else if(this.options.acceleration3Level == "M"){
			this.showOrHideAcceleration3Interval($("#leaflet-platoon-vehicle-acceleration3-value-style"), this.options.intervalTime_show_M, this.options.intervalTime_hide_M);
		} else {
			if(platoonVehicleInfo.acceleration3Interval != null){
				clearInterval(platoonVehicleInfo.acceleration3Interval);
			}
			
			$("#leaflet-platoon-vehicle-acceleration3-value-style").show();
		}
	},
	showOrHideAcceleration3Interval: function(object, showTime, hideTime){
		if(platoonVehicleInfo.acceleration3Interval != null){
			clearInterval(platoonVehicleInfo.acceleration3Interval);
		}
		
		var timeTemp = showTime;
		if(object.is(":hidden")){
			object.show();
			timeTemp = showTime;
		} else {
			object.hide();
			timeTemp = hideTime;
		}
		
		platoonVehicleInfo.acceleration3Interval = setInterval(
				function(){
					platoonVehicleInfo.object.showOrHideAcceleration3Interval(object, showTime, hideTime);
				}, 
				timeTemp);
	},
	
	setV2v_3: function(v2v3Level){
		if(v2v3Level){
			//value: 168, 169, 170, 171
			this.options.v2v3Level = v2v3Level;
			$("#leaflet-vehicle3-v2v").attr("src", ContextPath+"/js/lib/leaflet/custom/image/M3_TRUCK_"+ v2v3Level +".png");
		}
	},
	setGnss_3: function(gnss3Level){
		if(gnss3Level){
			//value: 164, 165, 166, 167
			this.options.gnss3Level = gnss3Level;
			$("#leaflet-vehicle3-gnss").attr("src", ContextPath+"/js/lib/leaflet/custom/image/M3_TRUCK_"+ gnss3Level +".png");
		}
	},
	setV2i_3: function(v2i3Level){
		if(v2i3Level){
			//value: 119, 120, 121, 123
			this.options.v2i3Level = v2i3Level;
			$("#leaflet-vehicle3-v2i").attr("src", ContextPath+"/js/lib/leaflet/custom/image/M3_TRUCK_"+ v2i3Level +".png");
		}
	},
	setCamera_3_1: function(camera3_1Level){
		//camera1 (value: '', _error, _selected)
		if(camera3_1Level){
			this.options.camera3_1Level = camera3_1Level;
			$("#leaflet-vehicle3-camera1").attr("src", ContextPath+"/js/lib/leaflet/custom/image/camera"+ camera3_1Level +".png");
		} else {
			this.options.camera3_1Level = "";
			$("#leaflet-vehicle3-camera1").attr("src", ContextPath+"/js/lib/leaflet/custom/image/camera.png");
		}
	},
	setCamera_3_2: function(camera3_2Level){
		//camera2 (value: '', _error, _selected)
		if(camera3_2Level){
			this.options.camera3_2Level = camera3_2Level;
			$("#leaflet-vehicle3-camera2").attr("src", ContextPath+"/js/lib/leaflet/custom/image/camera"+ camera3_2Level +".png");
		} else {
			this.options.camera3_2Level = "";
			$("#leaflet-vehicle3-camera2").attr("src", ContextPath+"/js/lib/leaflet/custom/image/camera.png");
		}
	},
	setFuel_3: function(fuel3Flag, fuel3Level){
		//value: none, inline
		if(fuel3Flag){
			this.options.fuel3Flag = fuel3Flag;
			$("#leaflet-vehicle3-fuel").css("display", fuel3Flag);
		}
		//fuel (value: M, H)
		if(fuel3Level){
			this.options.fuel3Level = fuel3Level;
			$("#leaflet-vehicle3-fuel").attr("src", ContextPath+"/js/lib/leaflet/custom/image/error_"+ fuel3Level +"_fuel.png");
		}
	},
	
	reset: function(
//			//value: running, stop
//			type,
			/* 隊列状態表示 */
			//value: stop, forward, brake, accup2, accdown2, goleft, goright, sharpturn2, turnleft, turnright, uturn
			status,
			/* 前方障害物 */
			//value: none, inline
			obstacleFalg,
			//前方障害物の距離
			obstacleDistance,
			//前方障害物の危険等級 (value: L, M, H)
			obstacleDistanceLevel,
			
			/* 車輌1 (value: L, L-selected, M, M-selected, H, H-selected) */
			truck1Level,
			/* 車両コントロールモード (value: CACC, ACC, Manual)   */
			truck1Model,
			
			/* 横間隔異常 */
			//value: none, inline
			transverse1Flag,
			//横間隔異常の距離
			transverse1Value, 
			//横間隔異常の危険等級 (value: L, M, H)
			transverse1Level,
			
			/* 速度異常 */
			//value: none, inline
			speed1Flag,
			//速度異常の値
			speed1Value,
			//速度異常の危険等級 (value: L, M, H)
			speed1Level,
			
			/* 加速度異常 */
			//value: none, inline
			acceleration1Flag,
			//加速度異常 の値
			acceleration1Value,
			//加速度異常 の危険等級 (value: L, M, H)
			acceleration1Level,
			
			//v2v (value: 168, 169, 170, 171)
			v2v1Level,
			//gnss (164, 165, 166, 167)
			gnss1Level,
			//v2i (value: 119, 120, 121, 122)
			v2i1Level,
			//camera1 (value: '', _error, _selected)
			camera1_1Level,
			//camera2 (value: '', _error, _selected)
			camera1_2Level,
			
			//value: none, inline
			fuel1Flag,
			//fuel (value: M, H)
			fuel1Level,

			/* CutIn車両 */
			//value: none, inline
			cutinCarFlag_1_1,
			//CutIn車両1 の危険等級 (value: L, M, H)
			cutinCarLevel_1_1,
			//CutIn車両1 のX値
			cutinCarValueX_1_1,
			//CutIn車両1 のY値
			cutinCarValueY_1_1,
			
			//value: none, inline
			cutinCarFlag_1_2,
			//CutIn車両2 の危険等級 (value: L, M, H)
			cutinCarLevel_1_2,
			//CutIn車両2 のY値
			cutinCarValueY_1_2,
			
			//value: none, inline
			cutinCarFlag_1_3,
			//CutIn車両3 の危険等級 (value: L, M, H)
			cutinCarLevel_1_3,
			//CutIn車両3 のX値
			cutinCarValueX_1_3,
			//CutIn車両3 のY値
			cutinCarValueY_1_3,
			
			//value: none, inline
			truckDistanceFlag_1,
			//車両1-車両2 距離の危険等級 (value: L, M, H)
			truckDistanceLevel_1,
			//車両1-車両2 距離の値
			truckDistanceValue_1,
			
			
			/* 車輌2 (value: L, L-selected, M, M-selected, H, H-selected) */
			truck2Level,
			/* 車両コントロールモード (value: CACC, ACC, Manual)   */
			truck2Model,
			
			/* 横間隔異常 */
			//value: none, inline
			transverse2Flag,
			//横間隔異常の距離
			transverse2Value, 
			//横間隔異常の危険等級 (value: L, M, H)
			transverse2Level,
			
			/* 速度異常 */
			//value: none, inline
			speed2Flag,
			//速度異常の値
			speed2Value,
			//速度異常の危険等級 (value: L, M, H)
			speed2Level,
			
			/* 加速度異常 */
			//value: none, inline
			acceleration2Flag,
			//加速度異常 の値
			acceleration2Value,
			//加速度異常 の危険等級 (value: L, M, H)
			acceleration2Level,
			
			//v2v (value: 168, 169, 170, 171)
			v2v2Level,
			//gnss (164, 165, 166, 167)
			gnss2Level,
			//v2i (value: 119, 120, 121, 122)
			v2i2Level,
			//camera1 (value: '', _error, _selected)
			camera2_1Level,
			//camera2 (value: '', _error, _selected)
			camera2_2Level,
			
			//value: none, inline
			fuel2Flag,
			//fuel (value: M, H)
			fuel2Level,

			/* CutIn車両 */
			//value: none, inline
			cutinCarFlag_2_1,
			//CutIn車両1 の危険等級 (value: L, M, H)
			cutinCarLevel_2_1,
			//CutIn車両1 のX値
			cutinCarValueX_2_1,
			//CutIn車両1 のY値
			cutinCarValueY_2_1,
			
			//value: none, inline
			cutinCarFlag_2_2,
			//CutIn車両2 の危険等級 (value: L, M, H)
			cutinCarLevel_2_2,
			//CutIn車両2 のY値
			cutinCarValueY_2_2,
			
			//value: none, inline
			cutinCarFlag_2_3,
			//CutIn車両3 の危険等級 (value: L, M, H)
			cutinCarLevel_2_3,
			//CutIn車両3 のX値
			cutinCarValueX_2_3,
			//CutIn車両3 のY値
			cutinCarValueY_2_3,
			
			//value: none, inline
			truckDistanceFlag_2,
			//車両2-車両3 距離の危険等級 (value: L, M, H)
			truckDistanceLevel_2,
			//車両2-車両3 距離の値
			truckDistanceValue_2,
			
			
			/* 車輌3 (value: L, L-selected, M, M-selected, H, H-selected) */
			truck3Level,
			/* 車両コントロールモード (value: CACC, ACC, Manual)   */
			truck3Model,
			
			/* 横間隔異常 */
			//value: none, inline
			transverse3Flag,
			//横間隔異常の距離
			transverse3Value, 
			//横間隔異常の危険等級 (value: L, M, H)
			transverse3Level,
			
			/* 速度異常 */
			//value: none, inline
			speed3Flag,
			//速度異常の値
			speed3Value,
			//速度異常の危険等級 (value: L, M, H)
			speed3Level,
			
			/* 加速度異常 */
			//value: none, inline
			acceleration3Flag,
			//加速度異常 の値
			acceleration3Value,
			//加速度異常 の危険等級 (value: L, M, H)
			acceleration3Level,
			
			//v2v (value: 168, 169, 170, 171)
			v2v3Level,
			//gnss (164, 165, 166, 167)
			gnss3Level,
			//v2i (value: 119, 120, 121, 122)
			v2i3Level,
			//camera1 (value: '', _error, _selected)
			camera3_1Level,
			//camera2 (value: '', _error, _selected)
			camera3_2Level,
			
			//value: none, inline
			fuel3Flag,
			//fuel (value: M, H)
			fuel3Level,
			
			//beep音(value: M, H, L)
			beepLevel
	){
		//value: running, stop
//		this.setType(this.getValue(type, "status"));
		/* 隊列状態表示 */
		this.setStatus(this.getValue(status, "status"));
		/* 前方障害物 */
		this.setObstacle(this.getValue(obstacleFalg, "flag"), this.getValue(obstacleDistanceLevel, "level"), this.getValue(obstacleDistance, "value"));
		/* 車輌1 (value: L, L-selected, M, M-selected, H, H-selected) */
		this.setTruck1Level(this.getValue(truck1Level, "level"));
		/* 車両コントロールモード (value: CACC, ACC, Manual)   */
		this.setTruck1Model(truck1Model);
		/* 横間隔異常 */
		this.setTransverse1(this.getValue(transverse1Flag, "flag"), this.getValue(transverse1Level, "level"), this.getValue(transverse1Value, "value"));
		/* 速度異常 */
		this.setSpeed1(this.getValue(speed1Flag, "flag"), this.getValue(speed1Level, "level"), this.getValue(speed1Value, "value"));
		/* 加速度異常 */
		this.setAcceleration1(this.getValue(acceleration1Flag, "flag"), this.getValue(acceleration1Level, "level"), this.getValue(acceleration1Value, "value"));
		this.setV2v_1(this.getValue(v2v1Level, "v2v"));
		this.setGnss_1(this.getValue(gnss1Level, "gnss"));
		this.setV2i_1(this.getValue(v2i1Level, "v2i"));
		this.setCamera_1_1(this.getValue(camera1_1Level, "value"));
		this.setCamera_1_2(this.getValue(camera1_2Level, "value"));
		this.setFuel_1(this.getValue(fuel1Flag, "flag"), this.getValue(fuel1Level, "level"));
		/* CutIn車両1 */
		this.setCutinCar_1_1(this.getValue(cutinCarFlag_1_1, "flag"), this.getValue(cutinCarLevel_1_1, "level"), this.getValue(cutinCarValueX_1_1, "value"), this.getValue(cutinCarValueY_1_1, "value"));
		/* CutIn車両2 */
		this.setCutinCar_1_2(this.getValue(cutinCarFlag_1_2, "flag"), this.getValue(cutinCarLevel_1_2, "level"), this.getValue(cutinCarValueY_1_2, "value"));
		/* CutIn車両3 */
		this.setCutinCar_1_3(this.getValue(cutinCarFlag_1_3, "flag"), this.getValue(cutinCarLevel_1_3, "level"), this.getValue(cutinCarValueX_1_3, "value"), this.getValue(cutinCarValueY_1_3, "value"));
		//車両1-車両2 距離
		this.setTruckDistance_1(this.getValue(truckDistanceFlag_1, "flag"), this.getValue(truckDistanceLevel_1, "level"), this.getValue(truckDistanceValue_1, "value"));
		
		/* 車輌1 (value: L, L-selected, M, M-selected, H, H-selected) */
		this.setTruck2Level(this.getValue(truck2Level, "level"));
		/* 車両コントロールモード (value: CACC, ACC, Manual)   */
		this.setTruck2Model(truck2Model);
		/* 横間隔異常 */
		this.setTransverse2(this.getValue(transverse2Flag, "flag"), this.getValue(transverse2Level, "level"), this.getValue(transverse2Value, "value"));
		/* 速度異常 */
		this.setSpeed2(this.getValue(speed2Flag, "flag"), this.getValue(speed2Level, "level"), this.getValue(speed2Value, "value"));
		/* 加速度異常 */
		this.setAcceleration2(this.getValue(acceleration2Flag, "flag"), this.getValue(acceleration2Level, "level"), this.getValue(acceleration2Value, "value"));
		this.setV2v_2(this.getValue(v2v2Level, "v2v"));
		this.setGnss_2(this.getValue(gnss2Level, "gnss"));
		this.setV2i_2(this.getValue(v2i2Level, "v2i"));
		this.setCamera_2_1(this.getValue(camera2_1Level, "value"));
		this.setCamera_2_2(this.getValue(camera2_2Level, "value"));
		this.setFuel_2(this.getValue(fuel2Flag, "flag"), this.getValue(fuel2Level, "level"));
		/* CutIn車両1 */
		this.setCutinCar_2_1(this.getValue(cutinCarFlag_2_1, "flag"), this.getValue(cutinCarLevel_2_1, "level"), this.getValue(cutinCarValueX_2_1, "value"), this.getValue(cutinCarValueY_2_1, "value"));
		/* CutIn車両2 */
		this.setCutinCar_2_2(this.getValue(cutinCarFlag_2_2, "flag"), this.getValue(cutinCarLevel_2_2, "level"), this.getValue(cutinCarValueY_2_2, "value"));
		/* CutIn車両3 */
		this.setCutinCar_2_3(this.getValue(cutinCarFlag_2_3, "flag"), this.getValue(cutinCarLevel_2_3, "level"), this.getValue(cutinCarValueX_2_3, "value"), this.getValue(cutinCarValueY_2_3, "value"));
		//車両1-車両2 距離
		this.setTruckDistance_2(this.getValue(truckDistanceFlag_2, "flag"), this.getValue(truckDistanceLevel_2, "level"), this.getValue(truckDistanceValue_2, "value"));
		
		/* 車輌1 (value: L, L-selected, M, M-selected, H, H-selected) */
		this.setTruck3Level(this.getValue(truck3Level, "level"));
		/* 車両コントロールモード (value: CACC, ACC, Manual)   */
		this.setTruck3Model(truck3Model);
		/* 横間隔異常 */
		this.setTransverse3(this.getValue(transverse3Flag, "flag"), this.getValue(transverse3Level, "level"), this.getValue(transverse3Value, "value"));
		/* 速度異常 */
		this.setSpeed3(this.getValue(speed3Flag, "flag"), this.getValue(speed3Level, "level"), this.getValue(speed3Value, "value"));
		/* 加速度異常 */
		this.setAcceleration3(this.getValue(acceleration3Flag, "flag"), this.getValue(acceleration3Level, "level"), this.getValue(acceleration3Value, "value"));
		this.setV2v_3(this.getValue(v2v3Level, "v2v"));
		this.setGnss_3(this.getValue(gnss3Level, "gnss"));
		this.setV2i_3(this.getValue(v2i3Level, "v2i"));
		this.setCamera_3_1(this.getValue(camera3_1Level, "value"));
		this.setCamera_3_2(this.getValue(camera3_2Level, "value"));
		this.setFuel_3(this.getValue(fuel3Flag, "flag"), this.getValue(fuel3Level, "level"));
		
		//beep
		this.setBeep();
	},
	
	getValue: function(value, type){
		if(value){
			return value;
		} else {
			if(type == "value"){
				return "";
			} else if(type == "flag"){
				return "none";
			} else if(type == "level"){
				return "L";
			} else if(type == "status"){
				return "stop";
			} else if(type == "v2v"){
				return "168";
			} else if(type == "gnss"){
				return "164";
			} else if(type == "v2i"){
				return "119";
			}
		}
	},
	
	setObject: function(object){
		platoonVehicleInfo.object = object;
	},
	
	addInterval: function(){
		//異常Twinkle
		this.setObstacleInterval();
		
		this.setTruck1Interval();
		
		this.setTruck2Interval();
		
		this.setTruck3Interval();
		
		this.setTransverse1Interval();
		
		this.setSpeed1Interval();
		
		this.setAcceleration1Interval();
		
		this.setAcceleration1Interval();
		
		this.setCutinCarInterval_1_1();
		
		this.setCutinCarInterval_1_2();
		
		this.setCutinCarInterval_1_3();
		
		this.setTruckDistanceInterval_1();
		
		this.setTransverse2Interval();
		
		this.setSpeed2Interval();
		
		this.setAcceleration2Interval();
		
		this.setCutinCarInterval_2_1();
		
		this.setCutinCarInterval_2_2();
		
		this.setCutinCarInterval_2_3();
		
		this.setTruckDistanceInterval_2();
		
		this.setTransverse3Interval();
		
		this.setSpeed3Interval();
		
		this.setAcceleration3Interval();
	},
	setCameraIcon : function(id, type){
		$("#leaflet-vehicle1-camera1").show();
		$("#leaflet-vehicle1-camera1-select").hide();
		
		$("#leaflet-vehicle1-camera2").show();
		$("#leaflet-vehicle1-camera2-select").hide();
		
		$("#leaflet-vehicle2-camera1").show();
		$("#leaflet-vehicle2-camera1-select").hide();
		
		$("#leaflet-vehicle2-camera2").show();
		$("#leaflet-vehicle2-camera2-select").hide();
		
		$("#leaflet-vehicle3-camera1").show();
		$("#leaflet-vehicle3-camera1-select").hide();
		
		$("#leaflet-vehicle3-camera2").show();
		$("#leaflet-vehicle3-camera2-select").hide();
		
		if(type == 1){
			$("#"+ id).hide();
			$("#" + id + "-select").show();
		} else {
			$("#" + id).show();
			$("#" + id + "-select").hide();
		}
	},
	setTruckIcon: function(order){
		this.options.truckSelect = order;
		
		if(this.options.truck1Level){
			$("#leaflet-platoon-vehicle-1").removeClass();
			$("#leaflet-platoon-vehicle-1").addClass("leaflet-platoon-vehicle-truck-"+ this.options.truck1Level);
		}
		if(this.options.truck2Level){
			$("#leaflet-platoon-vehicle-2").removeClass();
			$("#leaflet-platoon-vehicle-2").addClass("leaflet-platoon-vehicle-truck-"+ this.options.truck2Level);
		}
		if(this.options.truck3Level){
			$("#leaflet-platoon-vehicle-3").removeClass();
			$("#leaflet-platoon-vehicle-3").addClass("leaflet-platoon-vehicle-truck-"+ this.options.truck3Level);
		}
		
		if(order == 1 && this.options.truck1Level){
			$("#leaflet-platoon-vehicle-1").removeClass();
			$("#leaflet-platoon-vehicle-1").addClass("leaflet-platoon-vehicle-truck-"+ this.options.truck1Level + "-selected");
		} else if(order == 2 && this.options.truck2Level){
			$("#leaflet-platoon-vehicle-2").removeClass();
			$("#leaflet-platoon-vehicle-2").addClass("leaflet-platoon-vehicle-truck-"+ this.options.truck2Level + "-selected");
		} else if(order == 3 && this.options.truck3Level){
			$("#leaflet-platoon-vehicle-3").removeClass();
			$("#leaflet-platoon-vehicle-3").addClass("leaflet-platoon-vehicle-truck-"+ this.options.truck3Level + "-selected");
		}
	},
	getTruckSelect: function(){
		return this.options.truckSelect;
	},
	setTruckNumber : function(truckNumber){
		this.options.truckNumber = truckNumber;
		if(truckNumber == 1){
			$(".leaflet-platoon-vehicle-box-2").hide();
			$(".leaflet-platoon-vehicle-box-3").hide();
		} else if(truckNumber == 2){
			$(".leaflet-platoon-vehicle-box-3").hide();
		}
		
	},
	
});

L.control.platoonVehicleArea = function (options) {
	return new L.Control.PlatoonVehicleArea(options);
};



L.Map.ScrollWheelZoom = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.on(this._map._container, 'mousewheel', this._onWheelScroll, this);
		L.DomEvent.on(this._map._container, 'MozMousePixelScroll', L.DomEvent.preventDefault);
		this._delta = 0;
	},

	removeHooks: function () {
		L.DomEvent.off(this._map._container, 'mousewheel', this._onWheelScroll);
		L.DomEvent.off(this._map._container, 'MozMousePixelScroll', L.DomEvent.preventDefault);
	},

	_onWheelScroll: function (e) {
		var delta = L.DomEvent.getWheelDelta(e);

		this._delta += delta;
		this._lastMousePos = this._map.mouseEventToContainerPoint(e);

		if (!this._startTime) {
			this._startTime = +new Date();
		}

		var left = Math.max(40 - (+new Date() - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(L.bind(this._performZoom, this), left);

		L.DomEvent.preventDefault(e);
		L.DomEvent.stopPropagation(e);
	},

	_performZoom: function () {
		var map = this._map,
		    delta = this._delta,
		    zoom = map.getZoom();

		delta = delta > 0 ? Math.ceil(delta) : Math.floor(delta);
		delta = Math.max(Math.min(delta, 4), -4);
		delta = map._limitZoom(zoom + delta) - zoom;

		this._delta = 0;
		this._startTime = null;

		if (!delta) { return; }

		//scroll always zoom in/out from center
		map.zoomControl._setZoom(zoom + delta);
	},

});



//######################## Zoom #######################
L.Control.Zoom = L.Control.extend({
	// @section
	// @aka Control.Zoom options
	options: {
		position: 'bottomright',

		// @option zoomInText: String = '+'
		// The text set on the 'zoom in' button.
		zoomInText: '+',

		// @option zoomInTitle: String = 'Zoom in'
		// The title set on the 'zoom in' button.
		zoomInTitle: '詳細',

		// @option zoomOutText: String = '-'
		// The text set on the 'zoom out' button.
		zoomOutText: '-',

		// @option zoomOutTitle: String = 'Zoom out'
		// The title set on the 'zoom out' button.
		zoomOutTitle: '広域'
	},

	onAdd: function (map) {
		var container = L.DomUtil.create('div', '');
		container.setAttribute("class","leftControlDiv");
		var controlMapCenter = L.DomUtil.create('div', 'controlMapCenter', container);
		var controlAbnormalHistory = L.DomUtil.create('div', 'controlAbnormalHistory', container);
//		var controlTraffic = L.DomUtil.create('div', 'controlTraffic', container);
		var controlArea = L.DomUtil.create('div', 'controlArea', container);
		var controlNavi = L.DomUtil.create('div', 'controlNavi', container);
		
		
		//map center
		var strMapCenter = "";
		strMapCenter += '<div class="leaflet-control-back" title="車両現在地">';
		strMapCenter += 	'<img id="leaflet-map-center-icon" style="width:30px; height: 30px; margin: 5px;" src="'+ContextPath+'/js/lib/leaflet/custom/image/center-line.png" alt="">';
		strMapCenter += '</div>';
		controlMapCenter.innerHTML = strMapCenter;
		
		//警告情報履歴
		controlAbnormalHistory.innerHTML =	
			'<div id="leaflet-platoon-vehicle-abnormal-history" style="margin-top: 10px;"><a href="javascript:void(0);"><img src="'+ContextPath+'/js/lib/leaflet/custom/image/warn_off.png" alt=""></a></div>';
//		
//		//traffic
//		controlTraffic.innerHTML =	
//			'<div id="leaflet-traffic" style="margin-top: 10px;"><a href="javascript:void(0);"><img src="'+ContextPath+'/js/lib/leaflet/custom/image/traffic_off.png" alt=""></a></div>';
		
		// setting
		controlArea.innerHTML =	
			'<div id="leaflet-setting" style="margin-top: 10px;"><a href="javascript:void(0);"><img id="leaflet-setting-icon" src="'+ContextPath+'/js/lib/leaflet/custom/image/map_icon_setting_off.png" alt=""></a></div>';
		
		this._map = map;
		var container_minus = L.DomUtil.create('div', 'control_minus', controlNavi);
		container_minus.setAttribute("style","margin-top: 10px;");
		this._zoomInButton  = this._createButton(
				'<img src="'+ ContextPath +'/js/lib/leaflet/custom/image/zoom-in-off.png">', 
				this.options.zoomInTitle,
		        '',  
		        container_minus, 
		        this._zoomIn);
		
		var slider_zoom = L.DomUtil.create('div', "slider_zoom", controlNavi);
		slider_zoom.setAttribute("id","slider");
		
		var container_plus = L.DomUtil.create('div', 'control_plus', controlNavi);
		container_plus.setAttribute("style","margin-top: 10px;");
		this._zoomOutButton = this._createButton(
				'<img src="'+ ContextPath +'/js/lib/leaflet/custom/image/zoom-out-off.png">',
				this.options.zoomOutTitle, 
				'', 
				container_plus, 
				this._zoomOut);

		return container;
	},

	onRemove: function (map) {
		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
	},

	disable: function () {
		this._disabled = true;
		this._updateDisabled();
		return this;
	},

	enable: function () {
		this._disabled = false;
		this._updateDisabled();
		return this;
	},
	
	_mapResize: function(e) {
		//map has changed then update center
		this._center = this._map.getCenter();
	},
	
	_mapMove: function(e) {
		//not in zooming, map has changed then update center
		if(!this._zooming) {
			this._center = this._map.getCenter();
		}
	},
	_setZoom: function(zm) {
		this._zooming = true;
		if(!this._center){
			this._center = this._map.getCenter();
		}
		this._map.setView(this._center, zm,{pan:{animate:false}});
	},
	_zoomEnd: function(e) {
		this._zooming = false;
	},

	_zoomIn: function (e) {
		if (!this._disabled && this._map._zoom < this._map.getMaxZoom()) {
			this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
		}
	},

	_zoomOut: function (e) {
		if (!this._disabled && this._map._zoom > this._map.getMinZoom()) {
			this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
		}
	},

	_createButton: function (html, title, className, container, fn) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		/*
		 * Will force screen readers like VoiceOver to read this as "Zoom in - button"
		 */
		link.setAttribute('role', 'button');
		link.setAttribute('aria-label', title);

		L.DomEvent
		    .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
		    .on(link, 'click', L.DomEvent.stop)
		    .on(link, 'click', fn, this)
		    .on(link, 'click', this._refocusOnMap, this);

		return link;
	},

	_updateDisabled: function () {
		var map = this._map,
		    className = 'leaflet-disabled';

		L.DomUtil.removeClass(this._zoomInButton, className);
		L.DomUtil.removeClass(this._zoomOutButton, className);

		if (this._disabled || map._zoom === map.getMinZoom()) {
			L.DomUtil.addClass(this._zoomOutButton, className);
		}
		if (this._disabled || map._zoom === map.getMaxZoom()) {
			L.DomUtil.addClass(this._zoomInButton, className);
		}
	},
	
	bindCircleEvent:function() {
		//画像のロールオーバー
		$(function() {
			$('.controlNavi img').hover(function() {
				$(this).attr('src', $(this).attr('src').replace('-off', '-on'));
			}, function() {
				$(this).attr('src', $(this).attr('src').replace('-on', '-off'));
			});
			
			$('#leaflet-setting img').hover(function() {
				$(this).attr('src', $(this).attr('src').replace('_off', '_on'));
			}, function() {
				$(this).attr('src', $(this).attr('src').replace('_on', '_off'));
			});
			
			$('#leaflet-platoon-vehicle-abnormal-history img').hover(function() {
				$(this).attr('src', $(this).attr('src').replace('_off', '_on'));
			}, function() {
				$(this).attr('src', $(this).attr('src').replace('_on', '_off'));
			});
			
//			$('#leaflet-traffic img').hover(function() {
//				$(this).attr('src', $(this).attr('src').replace('_off', '_on'));
//			}, function() {
//				$(this).attr('src', $(this).attr('src').replace('_on', '_off'));
//			});
			
		});
	},
});

L.control.zoom = function (options) {
	return new L.Control.Zoom(options);
};


L.Map.ScrollWheelZoom = L.Handler.extend({
	addHooks: function () {
		L.DomEvent.on(this._map._container, 'mousewheel', this._onWheelScroll, this);

		this._delta = 0;
	},

	removeHooks: function () {
		L.DomEvent.off(this._map._container, 'mousewheel', this._onWheelScroll, this);
	},

	_onWheelScroll: function (e) {
		var delta = L.DomEvent.getWheelDelta(e);

		var debounce = this._map.options.wheelDebounceTime;

		this._delta += delta;
		this._lastMousePos = this._map.mouseEventToContainerPoint(e);

		if (!this._startTime) {
			this._startTime = +new Date();
		}

		var left = Math.max(debounce - (+new Date() - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(L.bind(this._performZoom, this), left);

		L.DomEvent.stop(e);
	},

	_performZoom: function () {
		var map = this._map,
		    zoom = map.getZoom(),
		    snap = this._map.options.zoomSnap || 0;

		map._stop(); // stop panning and fly animations if any

		// map the delta with a sigmoid function to -4..4 range leaning on -1..1
		var d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4),
		    d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2,
		    d4 = snap ? Math.ceil(d3 / snap) * snap : d3,
		    delta = map._limitZoom(zoom + (this._delta > 0 ? d4 : -d4)) - zoom;

		this._delta = 0;
		this._startTime = null;

		if (!delta) { return; }

		map.setZoom(zoom + delta);
	}
});
