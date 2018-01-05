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

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import web.dao.GetCustomDao;
import web.service.GetCustomService;
import web.vo.Custom;

@Service("GetCustomService")
public class GetCustomServiceImpl implements GetCustomService {
	
	@Autowired
	private GetCustomDao customDao;
	
	@Override
	public List<Custom> getCustom()throws Exception {
		return customDao.getCustom();		
	}
}
