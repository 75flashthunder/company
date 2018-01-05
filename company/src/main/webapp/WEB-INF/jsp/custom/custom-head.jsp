<%@ page import="web.common.Urls"%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/lib/bootstrap/bootstrap-table/bootstrap-table.min.css" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/lib/jquery/timepicker/jquery.timepicker.css" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/custom/custom.css" />

<script src="${pageContext.request.contextPath}/js/lib/bootstrap/bootstrap-table/bootstrap-table.js"></script>
<script src="${pageContext.request.contextPath}/js/lib/jquery/timepicker/jquery.timepicker.js"></script>
<script src="${pageContext.request.contextPath}/js/lib/jquery/datepicker/datepicker-ja.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/custom/custom.js"></script>

<script>
	var ContextPath = '<%=request.getContextPath()%>';
	var urls = {								
			custom:{
				getcustom:'<%=Urls.CUSTOM.GET_CUSTOMVIEW%>',
				customifo:'<%=Urls.CUSTOM.CUSTOMINFO%>',
			}			
		};
</script>

