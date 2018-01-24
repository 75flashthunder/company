# company
a simple ssm project
开发工具：eclipse

JDK：1.8

服务器：tomcat8.0

数据库：mysql

Round 1 Ready Go!!

首先我们需要在eclipse创建一个基于maven的动态的web工程。详情请参考：http://blog.csdn.net/qq_34309305/article/details/78674255

Round 2 Ready Go!!
接下来我们要进行配置，首先给大家看一下项目目录：


第一个pom.xml是maven的配置文件，在这里你需要配置你工程需要引入的jar包，比如springmvc的mysql的jar包等，接下来给大家看下我的配置：

[html] view plain copy
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">  
  <modelVersion>4.0.0</modelVersion>  
  <groupId>org.yongxing</groupId>  
  <artifactId>company</artifactId>  
  <packaging>war</packaging>  
  <version>0.0.1-SNAPSHOT</version>  
  <name>company Maven Webapp</name>  
  <url>http://maven.apache.org</url>  
  <dependencies>  
    <dependency>  
      <groupId>junit</groupId>  
      <artifactId>junit</artifactId>  
      <version>3.8.1</version>  
      <scope>test</scope>  
    </dependency>  
      
    <!-- 导入java ee jar 包 -->    
         <dependency>    
             <groupId>javax</groupId>    
             <artifactId>javaee-api</artifactId>    
             <version>8.0</version>    
         </dependency>  
        <dependency>  
            <groupId>javax.servlet</groupId>  
            <artifactId>javax.servlet-api</artifactId>  
            <version>3.1.0</version>  
        </dependency>  
        <dependency>  
            <groupId>javax.servlet.jsp</groupId>  
            <artifactId>jsp-api</artifactId>  
            <version>2.2</version>  
        </dependency>  
        <dependency>  
            <groupId>javax.servlet</groupId>  
            <artifactId>jstl</artifactId>  
            <version>1.2</version>  
        </dependency>  
       
     <!-- spring begin -->  
        <dependency>  
            <groupId>org.springframework</groupId>  
            <artifactId>spring-webmvc</artifactId>  
            <version>${spring.version}</version>  
        </dependency>  
  
        <dependency>  
            <groupId>org.springframework</groupId>  
            <artifactId>spring-jdbc</artifactId>  
            <version>${spring.version}</version>  
        </dependency>  
  
        <dependency>  
            <groupId>org.springframework</groupId>  
            <artifactId>spring-context</artifactId>  
            <version>${spring.version}</version>  
        </dependency>  
  
        <dependency>  
            <groupId>org.springframework</groupId>  
            <artifactId>spring-aop</artifactId>  
            <version>${spring.version}</version>  
        </dependency>  
  
        <dependency>  
            <groupId>org.springframework</groupId>  
            <artifactId>spring-core</artifactId>  
            <version>${spring.version}</version>  
        </dependency>  
  
        <dependency>  
            <groupId>org.springframework</groupId>  
            <artifactId>spring-test</artifactId>  
            <version>${spring.version}</version>  
        </dependency>  
        <!-- spring end -->  
       
     <!-- mybatis end -->  
     <dependency>  
            <groupId>org.mybatis</groupId>  
            <artifactId>mybatis</artifactId>  
            <version>3.2.8</version>  
        </dependency>  
        <dependency>  
            <groupId>org.mybatis</groupId>  
            <artifactId>mybatis-spring</artifactId>  
            <version>1.3.0</version>  
        </dependency>  
     <!-- mybatis end -->  
       
     <!-- mysql end -->  
     <dependency>  
        <groupId>mysql</groupId>  
        <artifactId>mysql-connector-java</artifactId>  
        <version>5.1.38</version>  
    </dependency>  
    <dependency>  
        <groupId>commons-dbcp</groupId>  
        <artifactId>commons-dbcp</artifactId>  
        <version>1.4</version>  
    </dependency>  
    <dependency>  
        <groupId>commons-pool</groupId>  
        <artifactId>commons-pool</artifactId>  
        <version>1.6</version>  
    </dependency>  
    <!-- mysql end -->  
      
    <!-- log4j end -->  
        <dependency>  
            <groupId>log4j</groupId>  
            <artifactId>log4j</artifactId>  
            <version>1.2.17</version>  
        </dependency>  
     <!-- log4j end -->  
       
  </dependencies>  
  <build>  
    <finalName>company</finalName>  
    <plugins>    
        <!-- define the project compile level -->    
        <plugin>    
            <groupId>org.apache.maven.plugins</groupId>    
            <artifactId>maven-compiler-plugin</artifactId>    
            <version>3.0</version>    
            <configuration>    
                <source>1.8</source>    
                <target>1.8</target>    
            </configuration>  
        </plugin>    
    </plugins>    
  </build>  
    
  <properties><spring.version>4.0.0.RELEASE</spring.version>  
  </properties>  
    
</project>  
接下来是web.xml，是动态工程的配置文件。接下来给大家看下我的配置：
[html] view plain copy
<?xml version="1.0" encoding="UTF-8"?>  
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xmlns="http://java.sun.com/xml/ns/javaee" xmlns:web="http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"  
    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"  
    id="WebApp_ID" version="3.0">  
    <display-name>company</display-name>  
    <context-param>    
        <param-name>contextConfigLocation</param-name>    
        <param-value>classpath:applicationContext.xml</param-value>    
    </context-param>   
      
    <context-param>  
    <param-name>log4jConfigLocation</param-name>  
    <param-value>classpath:log4j.properties</param-value>  
    </context-param>  
  
  
  
    <filter>  
        <description>字符集过滤器</description>  
        <filter-name>encodingFilter</filter-name>  
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>  
        <init-param>  
            <description>字符集编码</description>  
            <param-name>encoding</param-name>  
            <param-value>UTF-8</param-value>  
        </init-param>  
    </filter>  
    <filter-mapping>  
        <filter-name>encodingFilter</filter-name>  
        <url-pattern>/*</url-pattern>  
    </filter-mapping>  
    <listener>  
        <description>spring监听器</description>  
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>  
    </listener>  
  
    <!-- 防止spring内存溢出监听器 -->  
    <listener>  
        <listener-class>org.springframework.web.util.IntrospectorCleanupListener</listener-class>  
    </listener>  
    <listener>  
    <listener-class>org.springframework.web.util.Log4jConfigListener</listener-class>  
    </listener>  
  
  
  
    <!-- spring mvc servlet -->  
    <servlet>  
        <description>spring mvc servlet</description>  
        <servlet-name>springMvc</servlet-name>  
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>  
        <init-param>  
            <description>spring mvc 配置文件</description>  
            <param-name>contextConfigLocation</param-name>  
            <param-value>classpath:applicationContext.xml,classpath:spring-mvc.xml</param-value>  
        </init-param>  
        <load-on-startup>1</load-on-startup>  
    </servlet>  
    <servlet-mapping>  
        <servlet-name>springMvc</servlet-name>  
        <url-pattern>/</url-pattern>  
    </servlet-mapping>  
    <!-- 配置session超时时间，单位分钟 -->  
    <session-config>  
        <session-timeout>30</session-timeout>  
    </session-config>  
    <welcome-file-list>  
        <welcome-file>/html/login.html</welcome-file>  
        <welcome-file>/index.jsp</welcome-file>  
    </welcome-file-list>  
  
</web-app>  
这里主要是服务器开启时，加载哪个配置文件，其中classpath:applicationContext.xml表示要看applicationContext.xml，spring-mvc.xml其他暂时不用管。
接下来看applicationContext.xml配置：

[html] view plain copy
<?xml version="1.0" encoding="UTF-8" ?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"  
    xmlns:p="http://www.springframework.org/schema/p" xmlns:aop="http://www.springframework.org/schema/aop"  
    xmlns:tx="http://www.springframework.org/schema/tx"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.1.xsd  
    http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.1.xsd   
    http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-3.1.xsd   
    http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-3.1.xsd">  
      
    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource"          
     destroy-method="close">          
        <property name="driverClassName" value="com.mysql.jdbc.Driver" />         
        <property name="url" value="jdbc:mysql://localhost:3306/sys" />         
        <property name="username" value="user" />         
        <property name="password" value="123456" />         
    </bean>  
      
    <!-- 实例化jdbcTemplate,同时注入数据源 -->  
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate"  
        p:dataSource-ref="dataSource" />  
      
    <!-- 配置事务管理器 -->  
    <bean id="txManager"  
        class="org.springframework.jdbc.datasource.DataSourceTransactionManager">  
        <property name="dataSource" ref="dataSource" />  
    </bean>  
      
    <!-- 事务扫描开始(开启@Tranctional) -->  
    <tx:annotation-driven transaction-manager="txManager" />  
      
    <!-- bean definitions here -->  
    <context:component-scan base-package="web" />  
  
</beans>  
接下来看spring-mvc.xml

[html] view plain copy
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tx="http://www.springframework.org/schema/tx"  
    xmlns:aop="http://www.springframework.org/schema/aop" xmlns:context="http://www.springframework.org/schema/context"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans  
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd  
    http://www.springframework.org/schema/tx  
    http://www.springframework.org/schema/tx/spring-tx-3.0.xsd  
    http://www.springframework.org/schema/aop  
    http://www.springframework.org/schema/aop/spring-aop-3.0.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">  
    <context:component-scan base-package="web"></context:component-scan>  
    <bean  
        class="org.springframework.web.servlet.view.InternalResourceViewResolver">  
        <property name="prefix" value="/WEB-INF/jsp/" />  
        <property name="suffix" value=".jsp" />  
    </bean>  
  
</beans>  

这个xml的作用是，当我们的controller返回一个页面时，只需给一个名字。比如top,他就会自动找到工程下/WEB-INF/jsp/top.jsp

这四个文件配置好了之后，
写一个controller

[java] view plain copy
package web.controller;  
  
import org.springframework.stereotype.Controller;  
import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.servlet.ModelAndView;  
  
@Controller  
public class GetListController {  
      
    @RequestMapping(value="getTop")  
    public ModelAndView getTop() {  
        return new ModelAndView("top/top");  
    }     
}  
启动服务器，在浏览器中输入网址http://localhost:8080/company/getTop

就会出现你的top.jsp中的页面。

Round 3 

接下来是springmvc和mybatis,数据库的联通。

3.1.建一个基本类User，跟数据库存的字段最好一致。

[java] view plain copy
package web.vo;  
  
public class User {  
    private Integer userId;  
    private String userName;  
    private String userRole;  
    private Long userCode;  
    private String company;  
    private String userEmail;  
    private String phoneNumber;  
    private String password;  
      
    public Integer getUserId() {  
        return userId;  
    }  
    public void setUserId(Integer userId) {  
        this.userId = userId;  
    }  
    public String getUserName() {  
        return userName;  
    }  
    public void setUserName(String userName) {  
        this.userName = userName;  
    }  
    public String getUserRole() {  
        return userRole;  
    }  
    public void setUserRole(String userRole) {  
        this.userRole = userRole;  
    }  
    public Long getUserCode() {  
        return userCode;  
    }  
    public void setUserCode(Long userCode) {  
        this.userCode = userCode;  
    }  
    public String getCompany() {  
        return company;  
    }  
    public void setCompany(String company) {  
        this.company = company;  
    }  
    public String getUserEmail() {  
        return userEmail;  
    }  
    public void setUserEmail(String userEmail) {  
        this.userEmail = userEmail;  
    }  
    public String getPhoneNumber() {  
        return phoneNumber;  
    }  
    public void setPhoneNumber(String phoneNumber) {  
        this.phoneNumber = phoneNumber;  
    }  
    public String getPassword() {  
        return password;  
    }  
    public void setPassword(String password) {  
        this.password = password;  
    }  
}  
3.2 建立一个controller类
[java] view plain copy
package web.controller;  
  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.stereotype.Controller;  
import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.bind.annotation.ResponseBody;  
import org.springframework.web.servlet.ModelAndView;  
  
import web.service.GetUserService;  
import web.vo.User;  
  
@Controller  
public class GetListController {  
      
    @Autowired  
    private GetUserService getUserService;  
      
    @RequestMapping(value="getTop")  
    public ModelAndView getTop() {  
        return new ModelAndView("/top/top");  
    }  
      
    @RequestMapping(value="getuser")      
    public @ResponseBody User getUser()throws Exception{  
        User a= new User();  
        a=getUserService.getUser();  
        return a;  
    }     
}  
3.3建立一个service接口和实现类

[java] view plain copy
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
3.4建立一个dao接口和实现类
[java] view plain copy
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
3.5mybatis的建立一个usermapper.xml
[html] view plain copy
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE mapper  
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"  
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
<mapper namespace="web.dao.GetUserDao">  
    <resultMap type="web.vo.User" id="User">  
        <result property="userId" column="user_id" />  
        <result property="userName" column="user_name" />  
        <result property="userRole" column="user_role" />  
        <result property="userCode" column="user_code" />  
        <result property="company" column="company" />  
        <result property="userEmail" column="user_email" />  
        <result property="phoneNumber" column="phone_number" />  
        <result property="password" column="password" />  
    </resultMap>    
      
    <select id="getuser"   
        resultType="User">  
        SELECT  user_id user_id,  
            user_name user_name,  
            user_role user_role,  
            user_code user_code,  
            company company,  
            user_email user_email,  
            phone_number phone_number,  
            password password                 
        FROM tb_user                  
    </select>  
</mapper>  
调用过程为
browsers通过http请求localhost;8080/项目名/getuser 访问到controller--->service--->dao--->usermapper.xml--->数据库

（前提：数据库要事先建立好user表并存入数据。）

下面是我的数据库表：



这时只要在浏览器打localhost;8080/项目名/getuser就可以查询到数据了
