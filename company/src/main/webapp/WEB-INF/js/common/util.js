
//name space
var util = {};

util.ajax = function(url, data, type, async, successCallback, errMsg, errCallback) {
	
	var options = url;
	if (typeof options == 'string') {
		options = {
			url : options,
			data : data,
			type : type,
			async : async,
			success : successCallback,
			error : errCallback,
			errMsg : errMsg
		};
	} 
	options = $.extend({type:"POST",dataType:"json",cache:false}, options);

	var successCallback = options['success'];
	var errCallback = options['error'];

	if(!$.isPlainObject(options.data)) {
		options.data = {};
	}
	
	//send token to server (defined at inc_header layout)
	if(typeof token !== 'undefined') {
		options.data['token'] = token;
	}
	

	options['success'] = undefined;
	options['error'] = undefined;
	options['errMsg'] = undefined;

	options['success'] = function(data, textStatus, jqXHR) {

		if (data && data.code) {
			if ("S00" == data.code||"S01" == data.code) {
				if (successCallback) {
					successCallback(data, textStatus, jqXHR);
				}
			}
			// error process use global AjaxSuccess
			else {
				if (errCallback) {
					errCallback(jqXHR, textStatus);
				}
			}

		} else { // not dyna rule's ajax call
			if (successCallback) {
				successCallback(data, textStatus, jqXHR);
			}
		}
	};

	options['error'] = function(jqXHR, textStatus, errorThrown) {

		if (errCallback) {
			errCallback(jqXHR, textStatus, errorThrown);
		}

	};

	$.ajax(options);
};

//check
util.check = function(obj, reg){
	if(reg.test(obj).val()){
		return true;
	}else{
		util.showTip(obj,'正しい数字で入力してください')
	}	
};

//tips show
util.showTip = function (obj, tip) {
	$(obj).w2tag(tip);
	$(obj).focus();
	setTimeout(function(obj){util.clearTips(obj);}, 5000, $(obj));
};

