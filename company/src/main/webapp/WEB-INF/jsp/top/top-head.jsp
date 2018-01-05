<%@ page import="web.common.Urls"%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/lib/bootstrap/bootstrap-table/bootstrap-table.min.css" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/top/top.css" />

<script src="${pageContext.request.contextPath}/js/lib/bootstrap/bootstrap-table/bootstrap-table.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/top/top.js"></script>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.3"></script>

<script>
	var ContextPath = '<%=request.getContextPath()%>';
	var urls = {								
			top:{
				getuser:'<%=Urls.TOPVIEW.GET_USER%>',
				getcustom:'<%=Urls.CUSTOM.CUSTOMVIEW%>',
			}			
		};
</script>

