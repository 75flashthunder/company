<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div id="topcontent">
	<div id="poilogin" class="poilogin">
		<div class="poicontent">
			<div class="crostyle">
				<input type="text"></input><input type="button" onclick="top.poisearch();" value="检索" class="btn search">
			</div>
			<div class="poiresulttable">
				<table id="poiresult"></table>
			</div>
			<div class="crostyle">
				<input type="button" onclick="top.poiinput()" value="登录">
			</div>		
		</div>	
		<div>
			<input type="button" onclick="top.gocustom()" value="客户一览" class="btn search">
		</div>	
	</div>
	<!--百度地图容器-->
	<div class="mapstyle" id="map"></div>
</div>