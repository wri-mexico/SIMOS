<%-- 
    Document   : memory_usage
    Created on : 29/08/2011, 04:16:01 PM
    Author     : miguel.figueroa
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="java.lang.management.*"%>
<%@ page import="java.util.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Map JVM Memory Monitor</title>
</head>
<body bgcolor="#0CA35F">
	<table style="color: #111111" border="0" width="100%">
		<tr>
			<td colspan="2" align="center"><h3>Memory MXBean</h3></td>
		</tr>
		<tr>
			<td width="200">Heap Memory Usage</td>
			<td><%=ManagementFactory.getMemoryMXBean().getHeapMemoryUsage()%></td>
		</tr>
		<tr>
			<td>Non-Heap Memory Usage</td>
			<td><%=ManagementFactory.getMemoryMXBean()
					.getNonHeapMemoryUsage()%></td>
		</tr>
		<tr>
			<td colspan="2">&nbsp;</td>
		</tr>
		<tr>
			<td colspan="2" align="center"><h3>Memory Pool MXBeans</h3></td>
		</tr>
		<%
			Iterator<MemoryPoolMXBean> iterator = ManagementFactory
					.getMemoryPoolMXBeans().iterator();
			while (iterator.hasNext()) {
				MemoryPoolMXBean poolMXBean = iterator.next();
		%>
		<tr>
			<td colspan="2">
				<table border="0" width="100%" style="border: 1px #ffffff solid;">
					<tr>
						<td colspan="2" align="center"><b><%=poolMXBean.getName()%></b></td>
					</tr>
					<tr>
						<td width="200">Type</td>
						<td><%=poolMXBean.getType()%></td>
					</tr>
					<tr>
						<td>Usage</td>
						<td><%=poolMXBean.getUsage()%></td>
					</tr>
					<tr>
						<td>Peak Usage</td>
						<td><%=poolMXBean.getPeakUsage()%></td>
					</tr>
					<tr>
						<td>Collection Usage</td>
						<td><%=poolMXBean.getCollectionUsage()%></td>
					</tr>
				</table>
			</td>
		</tr>
		<%
			}
		%>
		<tr>
			<td colspan="2">&nbsp;</td>
		</tr>
	</table>
</body>
</html>
