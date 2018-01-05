package web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import web.common.Urls;
import web.service.GetCustomService;
import web.service.GetUserService;
import web.vo.Custom;
import web.vo.User;

@Controller
public class GetListController {
	
	@Autowired
	private GetUserService getUserService;
	@Autowired
	private GetCustomService getCustomService;
	
	@RequestMapping(value=Urls.TOPVIEW.TOPWIN)
	public ModelAndView getTop() {
		return new ModelAndView("/top/top");
	}
	
	@RequestMapping(value="getuser")	
	public @ResponseBody User getUser()throws Exception{
		User a= new User();
		a=getUserService.getUser();
		return a;
	}
	
	@RequestMapping(value=Urls.CUSTOM.CUSTOMVIEW)
	public ModelAndView custom() {
		return new ModelAndView("/custom/custom");
	}
	
	@RequestMapping(value=Urls.CUSTOM.GET_CUSTOMVIEW)
	public @ResponseBody List<Custom> getCustom() throws Exception {
		return getCustomService.getCustom();		
	}
	
	@RequestMapping(value=Urls.CUSTOM.CUSTOMINFO)
	public ModelAndView customInfo() {
		return new ModelAndView("/custominfo/custominfo");
	}
//	@RequestMapping(value = Urls.VIEW.PLATOON_LIST_VIEW)
//	public ModelAndView platoonListPage(ParamPlatoonDTOEntity paramPlatoonDTOEntity) throws Exception {
//		ModelAndView mav = new ModelAndView("/platoon/platoonlisting");
//		if(!CheckUtil.isNull(paramPlatoonDTOEntity.getStatusList())){
//			mav.addObject("status", paramPlatoonDTOEntity.getStatusList().get(0));
//		}									
//		return mav;
//	}
}
