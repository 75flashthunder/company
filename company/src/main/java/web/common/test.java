package web.common;

public class test {
	public static void main(String[] args) {
		System.out.println("你好");
		Runtime rt = Runtime.getRuntime();
		Long a=rt.freeMemory();
		//总内存：
		Long b=rt.totalMemory();
		//最大内存：
		Long c=rt.maxMemory();
		//已占用的内存：
		Long d=rt.totalMemory() - rt.freeMemory();
		
		System.out.println("当前 Java 虚拟机中的空闲内存量：" + a/1024/1024 + " M");
		System.out.println("当前 Java 虚拟机中的总内存量：" + b/1024/1024 + " M");
		System.out.println("当前 Java 虚拟机中的最大内存量：" + c/1024/1024 + " M");
		System.out.println("当前 Java 虚拟机中的占用内存量：" + d/1024/1024 + " M");
	}
	
}
