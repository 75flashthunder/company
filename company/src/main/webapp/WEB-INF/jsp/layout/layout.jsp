<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>企业管理</title>

<link rel="stylesheet" type="text/css" href="<c:url value='/js/lib/jquery/w2ui/css/w2ui.css'/>" />
<link rel="stylesheet" type="text/css" href="<c:url value='/js/lib/jquery/jquery-ui/jquery-ui.css'/>" />
<link rel="stylesheet" type="text/css" href="<c:url value='/js/lib/bootstrap/css/bootstrap.css'/>" />
<link rel="stylesheet" type="text/css" href="<c:url value='/css/common.css'/>" />

<script type="text/javascript" src="<c:url value='/js/lib/jquery/jquery.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/lib/jquery/jquery-ui/jquery-ui.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/lib/jquery/w2ui/w2ui.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/lib/bootstrap/js/bootstrap.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/common/util.js'/>"></script>


<script type="text/javascript">
$(document).ready(function() {
    $('#layout').w2layout({
        padding : 0,
        name : 'layout',
        panels : [ {
            type : 'top',
            size : 70,
            overflow: 'hidden',
            content : $("#layout-header")
        }, {
            type : 'main',
            overflow: 'hidden',
            content : $("#layout-main")
        } ]
    });
});

</script>
<tiles:insertAttribute name="head" ignore="true" />
</head>
<body>
	<div id="layout" style="width: 100%; height: 100%;"></div>
	<div id="layout-header" class="layout-content">
		<tiles:insertAttribute name="header" />
	</div>
	<div id="layout-main" class="layout-content">
		<tiles:insertAttribute name="main" />
	</div>
</body>
</html>