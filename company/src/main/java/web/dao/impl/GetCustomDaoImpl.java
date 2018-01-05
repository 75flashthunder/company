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

import java.util.List;

import org.springframework.stereotype.Component;

import web.dao.GetCustomDao;
import web.vo.Custom;
@Component
public class GetCustomDaoImpl extends BaseDAOImpl<String, Long> implements GetCustomDao {

	public GetCustomDaoImpl() {
		super(GetCustomDao.class);
		// TODO Auto-generated constructor stub
	}
	
	@Override
	public List<Custom> getCustom() throws Exception {
		return getSqlSession().selectList("getcustomlist");
	}	
}