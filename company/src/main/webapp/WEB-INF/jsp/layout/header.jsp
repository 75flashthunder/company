<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="web.common.Urls"%>

<script type="text/javascript" src="${pageContext.request.contextPath}/js/common/inc-header.js"></script>
<div class="headerbg">
    <img src="${pageContext.request.contextPath}/images/common/logo.png"/>
	<label class="headertitle">
		<b>企业管理</b>
	</label>

	<img src="${pageContext.request.contextPath}/images/common/user.png"/>
	<label class="headeruser">
		用户 
	</label>
	
	<label id="fullsc" onclick="changescreen()">
		全屏
	</label>	

	
	<a href="${pageContext.request.contextPath}<%=Urls.TOPVIEW.LOGIN %>"> 
		<label class="logouttext">退出</label>
		<img src="${pageContext.request.contextPath}/images/common/log_out.png"/>
	</a>
	
</div>
