/**
 *  Copyright(C) 2013 Suntec Software(Shanghai) Co., Ltd.
 *  All Right Reserved.
 */
package web.dao;

import java.io.Serializable;
import java.util.List;


/**
 * Descriptions
 *
 * @version 2013-9-24
 * @author SUNTEC
 * @since JDK1.6
 *
 */
public interface BaseDAO<T, ID extends Serializable> {
	ID generateID() throws Exception;
	T create(T entity) throws Exception;
	T update(T entity) throws Exception;
	T findOne(ID id) throws Exception;
	List<T> findAll() throws Exception;
	List<T> findList(T entity) throws Exception;
	long count(T entity) throws Exception;
	int delete(T entity) throws Exception;
	boolean exists(ID id) throws Exception;
	int deleteAll() throws Exception;
	void clearCache() throws Exception;
}
