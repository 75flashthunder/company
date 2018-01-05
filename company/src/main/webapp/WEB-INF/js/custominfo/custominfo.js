/**
 * 
 */
var top={
		
};

$(document).ready(function() {	
	top.inittable();
})

top.getuser=function(){
	var url=ContextPath+urls.top.getuser;
	var data='';
	var async=true;
	var type='get';
	var errMsg='';
	util.ajax(url, data, type, async, top.getusersuccess, errMsg, top.errCallback);
}

top.getusersuccess=function(data){
	$("#usermessage").html(data.password);
}

top.errCallback=function(){
	
}

//队列一览数据
top.inittable=function(){	
	$('#usermessage').bootstrapTable({
	    url: ContextPath+urls.top.getuser,         //请求后台的URL（*）
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
		        field: 'platoonCode',
		        title: '',
		        valign: 'middle',		        
		        align: 'center',
		        width:108,
		        rowspan: 2,
		        sortable: true, // 开启排序功能
		        formatter:function (platoonCode,row){		        	
		        	return '<input type="button" onclick=\'platoonlistend.godetail("'+platoonCode+'","'+row.startTime.replace(/-/g,'/')+'","'+row.endTime.replace(/-/g,'/')+'")\' value="詳細"></input>'
		        }
		    },{
		        field: 'platoonCode',
		        title: '隊列番号',
		        align: 'center',
		        valign: 'middle',
		        titleTooltip:'1234',
		        width:132,
		        rowspan: 2,
		        sortable: true // 开启排序功能		        
		    }, {
		        field: 'platoonName',
		        title: '隊列名前',
		        align: 'center',
		        valign: 'middle',		        
		        width:94,
		        rowspan: 2,
		        sortable: true, // 开启排序功能	
		        formatter: function (value, row, index) {
	            	return '<div class="lengthhide" title="'+value+'">'+value+'</div>';
	            }
		    }, {
		        field: 'startTime',
		        title: '出発時間',
		        valign: 'middle',
		        align: 'center',
		        width:95,
		        
		        rowspan: 2,
		        sortable: true, // 开启排序功能
		        formatter:function (startTime){
		        	return startTime.replace(/-/g,'/')
		        }
		    }, {
		        field: 'startPoi',
		        title: '出発地',
		        valign: 'middle',
		        width:88,
		        
		        align: 'center',
		        rowspan: 2,
		        sortable: true ,// 开启排序功能
		        formatter: function (value, row, index) {
	            	return '<div class="lengthhide" title="'+value+'">'+value+'</div>';
	            }
		    }, {
		        field: 'endPoi',
		        title: '目的地',
		        valign: 'middle',
		        width:88,
		        
		        align: 'center',
		        rowspan: 2,
		        sortable: true ,// 开启排序功能
		        formatter: function (value, row, index) {
	            	return '<div class="lengthhide" title="'+value+'">'+value+'</div>';
	            }
		    },{
		        field: 'endTime',
		        title: '走行完了時間',
		        valign: 'middle',
		        
		        align: 'center',
		        width:130,
		        rowspan: 2,
		        formatter:function (endTime){
		        	var pos=endTime.replace(/-/g,'/').indexOf(" ");		        	
		        	return endTime.replace(/-/g,'/').substr(0, pos)+'</br>'+endTime.replace(/-/g,'/').substr(pos);
		        },
	            sortable: true // 开启排序功能  
		    }, {
		        field: 'driver',
		        title: 'ドライバー',
		        valign: 'middle',	        
		        align: 'center',
		        width:90,
		        rowspan: 2,
		        formatter:function (driver){		        	
		        	return '<div class="lengthhide" title="'+'ID：'+driver.driverCode+' スギール：'+driver.driverSkill+'">'+driver.driverName+'</div>';
		        }
		    },{
		        field: 'dangerAct',
		        title: '危険運転',
		        valign: 'middle',
		        align: 'left',
//		        class:'datastyle',
		        width:133,
		        rowspan: 2,
		        cellStyle:function cellStyle(value, row, index) {
		        	return {
		        		css : {
		        		"padding-left" : "5px !important"
		        		}
	        		};
        		},
		        formatter:function (dangerAct){		        	
		        	return '急加速：'+dangerAct.acc+'回'+'</br>'
		        			+'急減速：'+dangerAct.dec+'回'+'</br>'
		        			+'急ハンドル：'+dangerAct.handle+'回';
		        }
		    },{
		        field: 'warnCount',
		        title: '警告累計',
		        valign: 'middle',		        
		        align: 'left',
		        width:79,
//		        class:'datastyle',
		        rowspan: 2,
		        cellStyle:function cellStyle(value, row, index) {
		        	return {
		        		css : {
		        		"padding-left" : "5px !important"
		        		}
	        		};
        		},
		        formatter:function (warnCount){		        	
		        	return 'H：'+warnCount.high+'件'+'</br>'
		        			+'M：'+warnCount.middle+'件'+'</br>'
		        			+'L：'+warnCount.low+'件';
		        }
		    }, {
		        field: 'distance',
		        title: '走行距離',
		        valign: 'middle',
		        align: 'center',
		        
		        width:131,
		        colspan: 2
		    }, {
		        field: 'driveTime',
		        title: '走行時間',
		        valign: 'middle',		        
		        width:131,
		        colspan: 2,
		        align: 'center',		       
		    },{
		        field: 'vehicleCount',
		        title: '車数',
		        align: 'center',
		        valign: 'middle',
		        width:58,		        
		        rowspan: 2,
		        sortable: true // 开启排序功能
		    }],
		    [{
		    	field: 'driveDistance',
		        title: '実績',
		        valign: 'middle',		        
		        width:65,
		        align: 'center',
		        sortable: true, // 开启排序功能
		        formatter:function (distance){
        			return distance+'km';		        			        	
		        }
		    },
		    {
		    	field: 'totalDistance',
		        title: '計画',
		        width:65,
		        align: 'center',
		        valign: 'middle',
		        sortable: true ,// 开启排序功能
		        formatter:function (totalDistance){
        			return totalDistance+'km';		        			        	
		        }
		        	
		    },
		    {
		    	field: 'driveTime',
		        title: '実績',
		        width:65,
		        align: 'center',
		        valign: 'middle',
		        sortable: true ,// 开启排序功能
		        formatter:function (time){
		        	var hour=0;
		        	while(time>60){
		        		time-=60;
		        		hour+=1;
		        	}
        			return hour+'h'+time+'m';		        			        	
		        }
		    },
		    {
		    	field: 'totalTime',
		        title: '計画',
		        width:65,		        
		        valign: 'middle',
		        align: 'center',
		        sortable: true ,// 开启排序功能
		        formatter:function (time){
		        	var hour=0;
		        	while(time>60){
		        		time-=60;
		        		hour+=1;
		        	}
        			return hour+'h'+time+'m';		        			        	
		        }
		    }
		    ]

	    ],
	    responseHandler: function(res) {
	    	if(res.list==undefined){
	    		res.list={};
	    	}
            return {
                "total": res.count,//总页数
                "rows": res.list   //数据
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