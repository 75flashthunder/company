/**
 *  Copyright(C) 2015 Suntec Software(Shanghai) Co., Ltd.
 *  All Right Reserved.
 */
/**
 * Descriptions
 *
 * @version 2017年12月22日
 * @author SUNTEC
 * @since JDK1.7
 *
 */
package web.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import web.dao.GetUserDao;
import web.service.GetUserService;
import web.vo.User;

@Service("GetUserService")
public class GetUserServiceImpl implements GetUserService {
	
	@Autowired
	private GetUserDao userdao;
	
	@Override
	public User getUser()throws Exception {
		User a=userdao.getUser();
		return a;
	}
}
