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
package web.dao;

import web.vo.User;

public interface GetUserDao extends BaseDAO<String, Long>{
	public User getUser()throws Exception;
}
