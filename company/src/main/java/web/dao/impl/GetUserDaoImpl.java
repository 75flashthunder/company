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
package web.dao.impl;

import org.springframework.stereotype.Component;

import web.dao.GetUserDao;
import web.vo.User;
@Component
public class GetUserDaoImpl extends BaseDAOImpl<String, Long> implements GetUserDao {

	public GetUserDaoImpl() {
		super(GetUserDao.class);
		// TODO Auto-generated constructor stub
	}
	
	@Override
	public User getUser() throws Exception {
		User a = getSqlSession().selectOne("getuser");
		return a;
	}	
}