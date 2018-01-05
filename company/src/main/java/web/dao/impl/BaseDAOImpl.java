/**
 *  Copyright(C) 2013 Suntec Software(Shanghai) Co., Ltd.
 *  All Right Reserved.
 */
package web.dao.impl;

import java.io.Serializable;
import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;

import web.dao.BaseDAO;

/**
 * Descriptions
 *
 * @version 2013-9-24
 * @author SUNTEC
 * @since JDK1.6
 *
 */
public abstract class BaseDAOImpl<T, ID extends Serializable> implements BaseDAO<T, ID> {
	private SqlSessionTemplate sqlSessionTempalte;
	private Class<?> daoType;
	
	public BaseDAOImpl( Class<?> daoType) {
		this.daoType = daoType;
	}
	
	protected SqlSession getSqlSession() {
		return sqlSessionTempalte;
	}
	
	protected SqlSessionFactory getSqlSessionFactory() {
		SqlSessionFactory sqlSessionFactory = null;
		if (sqlSessionTempalte != null) {
			sqlSessionFactory = sqlSessionTempalte.getSqlSessionFactory();
		}
		return sqlSessionFactory;
	}
	
	@Resource
	public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
		sqlSessionTempalte = new SqlSessionTemplate(sqlSessionFactory);
	}
	
	protected String getStatementId( String methodName ) {
		return daoType.getName() + "." + methodName;
	}
	
	@Override
	public ID generateID() throws Exception {
		return getSqlSession().selectOne( getStatementId( "generateID" ) );
	}
	
	@Override
	public boolean exists(ID id) throws Exception {
		T entity = findOne(id);
		
		if(entity == null) {
			return false;
		}
		
		return true;
	}

	@Override
	public T create(T entity) throws Exception {
		getSqlSession().insert( getStatementId( "create" ), entity );
		 
		return entity;
	}

	@Override
	public T update(T entity) throws Exception {
		getSqlSession().update( getStatementId( "update" ), entity );
		
		return entity;
	}

	@SuppressWarnings("unchecked")
	@Override
	public T findOne(ID id) throws Exception {
		return (T)getSqlSession().selectOne( getStatementId( "findOne" ), id );
	}

	@Override
	public List<T> findAll() throws Exception {
		return getSqlSession().selectList( getStatementId( "findAll" ));
	}
	
	@Override
	public List<T> findList(T entity) throws Exception {
		return getSqlSession().selectList( getStatementId( "findList" ), entity);
	}
	
	@Override
	public long count(T entity) throws Exception {
		return getSqlSession().selectOne( getStatementId( "count" ), entity );
	}

	@Override
	public int delete(T entity) throws Exception {
		return getSqlSession().delete( getStatementId( "delete" ), entity );
	}

	@Override
	public int deleteAll() throws Exception {
		return getSqlSession().delete( getStatementId( "deleteAll" ) );
	}
	
	@Override
	public void clearCache() throws Exception {
		SqlSession sqlSession = getSqlSession();
		if (sqlSession != null) {
			sqlSession.clearCache();
		}
	}

}
