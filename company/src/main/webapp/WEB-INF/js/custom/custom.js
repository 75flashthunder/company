/**
 * 
 */
var custom={
		
};

$(document).ready(function() {	
	custom.inittable();
})

custom.getuser=function(){
	var url=ContextPath+urls.custom.getuser;
	var data='';
	var async=true;
	var type='get';
	var errMsg='';
	util.ajax(url, data, type, async, custom.getusersuccess, errMsg, custom.errCallback);
}

custom.getusersuccess=function(data){
	$("#usermessage").html(data.password);
}

custom.errCallback=function(){
	
}

//队列一览数据
custom.inittable=function(){	
	$('#usermessage').bootstrapTable({
	    url: ContextPath+urls.custom.getcustom,         //请求后台的URL（*）
	    method: 'post',                      //请求方式（*）
//	    toolbar: '#toolbar',                //工具按钮用哪个容器
//	    toolbarAlign:'center',
	    contentType:"application/x-www-form-urlencoded; charset=UTF-8",//没有此项可能后台接收不到传递参数
	    striped: true,                        //是否显示行间隔色                  
	    cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	    pagination: true,                   //是否显示分页（*）
//	    height:platoonlistend.getHeight(),
	    paginationHAlign:'left',			//下一页控件位置
//	    paginationDetailHAlign:'right',		//分页详细位置
	    sortable: true,                     //是否启用排序
	    sortOrder: "asc",                   //排序方式
//	    ajaxOptions:ajaxParams,				//传递参数（*）
	    queryParams: queryParams,           //传递参数（*）
	    sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
	    pageNumber:1,                       //初始化加载第一页，默认第一页
	    pageSize: 10,                       //每页的记录行数（*）
	    pageList: [10, 30, 50],        //可供选择的每页的行数（*）
//	    strictSearch: true,					//设置为 true启用 全匹配搜索，否则为模糊搜索
//	    clickToSelect: true,                //是否启用点击选中行
//	    height: 460,                        //行高，如果没有设置height属性，表格自动根据记录条数决定表格高度
//	    uniqueId: "platoonCode",            //每一行的唯一标识，一般为主键列
	    cardView: false,                    //是否显示详细视图
	    detailView: false,                   //是否显示父子表
//	    showPaginationSwitch:true,
	    formatLoadingMessage: function () {
            return w2utils.lang("wait");
        },
        formatRecordsPerPage: function (pageNumber) {
            return '1ページに:'+pageNumber+'  ';
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return '全部'+totalRows+'件';
        },
        formatDetailPagination: function (totalRows) {
            return '表示'+totalRows+'件';
        },
        formatNoMatches: function () {
            return w2utils.lang("nodata");
        },
	    columns: [
		    [{
		        field: 'customCode',
		        title: '',
		        valign: 'middle',		        
		        align: 'center',
		        width:108,		        
//		        sortable: true, // 开启排序功能
		        formatter:function (customCode){		        	
		        	return '<input type="button" onclick=\'custom.godetail("'+customCode+'")\' value="詳細"></input>'
		        }
		    },{
		        field: 'customCode',
		        title: '客户账号',
		        align: 'center',
		        valign: 'middle',
		        titleTooltip:'1234',
		        width:132,		        
		        sortable: true // 开启排序功能		        
		    }, {
		        field: 'customName',
		        title: '客户名称',
		        align: 'center',
		        valign: 'middle',		        
		        width:94,		        
		        sortable: true, // 开启排序功能	
		        formatter: function (value, row, index) {
	            	return '<div class="lengthhide" title="'+value+'">'+value+'</div>';
	            }
		    }, {
		        field: 'tradeDate',
		        title: '交易时间',
		        valign: 'middle',
		        align: 'center',
		        width:95,		        		        
		        sortable: true, // 开启排序功能
		        formatter:function (startTime){
		        	return startTime;
		        }
		    }, {
		        field: 'company',
		        title: '公司',
		        valign: 'middle',
		        width:88,	        
		        align: 'center',		        
		        sortable: true ,// 开启排序功能
		        formatter: function (value, row, index) {
	            	return '<div class="lengthhide" title="'+value+'">'+value+'</div>';
	            }
		    }, {
		        field: 'customEmail',
		        title: '邮箱',
		        valign: 'middle',
		        width:88,	        
		        align: 'center',	       
		        sortable: true ,// 开启排序功能
		        formatter: function (value, row, index) {
	            	return '<div class="lengthhide" title="'+value+'">'+value+'</div>';
	            }
		    },{
		        field: 'phoneNumber',
		        title: '联系方式',
		        valign: 'middle',	        
		        align: 'center',
		        width:130,		       
		        formatter:function (endTime){		        	
		        	return endTime;
		        },
	            sortable: true // 开启排序功能  
		    }],
		    [
		    ]

	    ],
	    responseHandler: function(res) {
	    	if(res==undefined){
	    		res={};
	    	}
            return {
//                "total": res.count,//总页数
                "rows": res   //数据
             };
        },
	    
	});	
}

function queryParams() {
	
	var startDate,endDate;
	
	if($("#startDate").val()!=''&&$("#startTime").val()!=''){
			startDate=$("#startDate").val()+" "+$("#startTime").val()+":00";			
	}		
	if($("#endDate").val()!=''&&$("#endTime").val()!=''){
		endDate=$("#endDate").val()+" "+$("#endTime").val()+":00";
	}
	
    var param = {       
			platoonCode : $("#platoonsearchcode").val(),
			vehicleCode : $("#vehiclesearchcode").val(),
			statusList : 9,
			startDate : startDate,
			endDate : endDate,
			startPoiCode:$('#startpoilist option:selected') .val(),
			endPoiCode:$('#endpoilist option:selected') .val(),
			driverCode:$('#driverlist option:selected') .val(),
			p : this.pageNumber,
			s : this.pageSize,
			sortName : this.sortName,
			sortOrder:this.sortOrder
    }
    return param;
} 

custom.godetail=function(customCode){
	var form = document.createElement('form');
    form.action = ContextPath + urls.custom.customifo;
    form.method = 'post';      
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'customCode';
    input.value = customCode;
    form.appendChild(input);   
    $(document.body).append(form);
    form.submit();
}