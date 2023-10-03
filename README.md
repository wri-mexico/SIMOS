# SIMOS

<p align="center">
  <img src="./img/headerSIMOS.png" alt="SIMOS logo" width="338">
</p>

El Sistema de Movilidad Integrado (SIMOS) es una aplicación de software libre (Open Source) potenciada por el core de [MxSIG](http://simos.col.gob.mx/mxsig) (consulta el repositorio [aquí](https://github.com/MxSIG/mxsig)), una plataforma de código abierto para la web desarrollada para implementar soluciones geomáticas que facilitan el uso, integración, interpretación, publicación y análisis de la información geográfica y estadística.

SIMOS es una aplicación que fomenta el acceso libre y gratuito a los datos geoespaciales de los que dispone con el objetivo de informar, generar estadística básica y ayudar a la toma de decisiones.

## Demo

Una instalación de [SIMOS](http://simos.col.gob.mx/mxsig/) esta disponible en la página oficial del proyecto, cargada con una variedad de capas.

<p align="center">
<a href="http://simos.col.gob.mx/mxsig/">http://simos.col.gob.mx/mxsig/</a>
</p>


## Instalación

El procedimiento detallado para la instalación de SIMOS se encuentran en el [manual de instalación](https://github.com/wri-mexico/SIMOS/blob/main/Docs/Instalacion%20SIMOS.pdf) disponible en la carpeta [Docs](https://github.com/wri-mexico/SIMOS/tree/main/Docs) del repositorio oficial. 

## Requerimientos

Los requerimientos mínimos para la instalación de SIMOS son los siguientes:

*	Servidor con sistema operativo CentOS 7 x86
*	Clonar el repositorio de SIMOS [1][2]
*	4 GB de ram (recomendado)
*	2 vCPU/core  (recomendado)
*	Mínimo 8 GB de almacenamiento (16 GB recomendados)

Se recomienda leer el [manual de instalación](https://github.com/wri-mexico/SIMOS/blob/main/Docs/Instalacion%20SIMOS.pdf) en donde se detalla la instalación de otros software y dependencias que SIMOS utiliza, por ejemplo los siguientes:

*	PgAdmin 
*	PostgreSQL 11
*	PostGIS 25.11
*	MapServer 7
*	Firewall (firewalld)
*	Servidor Apache HTTP
*	PHP 7
*	Java 8
*	Apache Tomcat 8.5.68



## ¿Quien utiliza SIMOS?

SIMOS es una alternativa confiable para cualquier interesado en una aplicación para almacenamiendo y visualización de datos espaciales, especialmente en el territorio de México. 

SIMOS permite representar capas de datos originalmente en formato .shp a través de mapas interactivos, clústeres y mapas de calor. Además, SIMOS es capaz de realizar análisis espacial, búsqueda y descarga de datos, entre otros.

## Instituciones involucradas

<p align="center">
  <img src="./img/INEGI.png" alt="SIMOS logo" width="138">
</p>
<p align="center">
  <img src="./img/colima.png" alt="SIMOS logo" width="338">
</p>
<p align="center">
  <img src="./img/wrimexico.png" alt="SIMOS logo" width="338">
</p>
<p align="center">
  <img src="./img/botnar.jpg" alt="SIMOS logo" width="338">
</p>

## Licencia

SIMOS es un proyecto disponible, gratuito y de código abierto bajo los términos de la licencia del MIT.
