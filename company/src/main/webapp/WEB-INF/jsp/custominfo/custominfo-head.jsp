<%@ page import="web.common.Urls"%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/lib/bootstrap/bootstrap-table/bootstrap-table.min.css" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/custominfo/custominfo.css" />

<script src="${pageContext.request.contextPath}/js/lib/bootstrap/bootstrap-table/bootstrap-table.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/custominfo/custominfo.js"></script>

<script>
	var ContextPath = '<%=request.getContextPath()%>';
	var urls = {								
			top:{
				getuser:'<%=Urls.TOPVIEW.GET_USER%>',
			}			
		};
</script>

