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

import java.util.List;

import web.vo.Custom;

public interface GetCustomDao extends BaseDAO<String, Long>{
	public List<Custom> getCustom()throws Exception;
}
