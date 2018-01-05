<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
	<div>
		<h4>客户一览</h4>
		<div id="contentbox" class="table-left">
			<table id="conditionTable" class="table table-bordered">
				<thead>
					<tr>
						<th class="center">客户账号</th>
						<td><input type="text" name="optionsRadios"
							id="platoonsearchcode" class="input-width"></td>
						<th class="center">客户姓名</th>
						<td><input type="text" name="optionsRadios"
							id="vehiclesearchcode"></td>
						<th class="center">开始时间</th>
						<td colspan="3">
							<input type="text" id="startDate" />  <input type="text" id="startTime" /> ~ 
							<input type="text" id="endDate" />  <input type="text" id="endTime" />
						</td>
					</tr>
					<tr>
						<th class="center2">公司</th>
						<td><select class="form-control input-width" id="startpoilist">
								<option value=""></option>
							</select>
						</td>
						<th class="center2">电话号</th>
						<td><select class="form-control" id="endpoilist">
								<option value=""></option>								
							</select>
						</td>
						<th class="center2">邮箱</th>
						<td colspan="1">							
							<select class="form-control" id="driverlist">
								<option value=""></option>							
							</select>
						</td>						
					</tr>
				</thead>
			</table>
		</div>
	</div>
	<div id="searchbut" class="table-right">
		<button id="search" type="button" class="btn btn-primary search"
			onclick="">查找</button>
	</div>

<div id="usermessage"></div>