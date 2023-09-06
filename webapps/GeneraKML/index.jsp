<%-- 
    Document   : index
    Created on : 27/09/2013, 11:21:40 PM
    Author     : Aaron.Villar
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
<script languaje="javascript">
//LZW Compression/Decompression for Strings
var LZW = {
    compress: function (uncompressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = {},
            c,
            wc,
            w = "",
            result = [],
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i;
        }

        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            //Do not use dictionary[wc] because javascript arrays
            //will return values for array['pop'], array['push'] etc
           // if (dictionary[wc]) {
            if (dictionary.hasOwnProperty(wc)) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }

        // Output the code for w.
        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
    },


    decompress: function (compressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = [],
            w,
            result,
            k,
            entry = "",
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[i] = String.fromCharCode(i);
        }

        w = String.fromCharCode(compressed[0]);
        result = w;
        for (i = 1; i < compressed.length; i += 1) {
            k = compressed[i];
            if (dictionary[k]) {
                entry = dictionary[k];
            } else {
                if (k === dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }

            result += entry;

            // Add w+entry[0] to the dictionary.
            dictionary[dictSize++] = w + entry.charAt(0);

            w = entry;
        }
        return result;
    }
} // For Test Purposes

function convierte(){
    text = uno.kmlfile.value;
    comp = LZW.compress(text),
    uno.tres.value=comp;
}



</script>
    </head>
    <body>
        <h1>Hello World!</h1>
        <form name=uno action="save2KML.do" method="post" onsubmit="javascript:convierte();">
            <input type="hidden" value="" name="tres">
            <textarea name=kmlfile rows="20" cols="80">
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
<Document>
	<name>aaron.kml</name>
	<Style id="sn_ylw-pushpin">
                            <IconStyle>
                            <scale>1.1</scale>
                            <Icon>
                            <href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
                            </Icon>
                            <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
                            </IconStyle>
	</Style>
	<StyleMap id="msn_ylw-pushpin">
		<Pair>
			<key>normal</key>
			<styleUrl>#sn_ylw-pushpin</styleUrl>
		</Pair>
		<Pair>
			<key>highlight</key>
			<styleUrl>#sh_ylw-pushpin</styleUrl>
		</Pair>
	</StyleMap>
	<Style id="sh_ylw-pushpin">
                            <IconStyle>
                            <scale>1.3</scale>
                            <Icon>
                            <href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
                            </Icon>
                            <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
                            </IconStyle>
	</Style>
	<Placemark>
		<name>aaron</name>
		<description>Prueba 1</description>
		<styleUrl>#msn_ylw-pushpin</styleUrl>
		<Polygon>
			<tessellate>1</tessellate>
			<outerBoundaryIs>
				<LinearRing>
					<coordinates>
						-101.9981338902166,22.04570187620086,0 -102.3506355414144,21.38823171919239,0 -101.0525581692344,21.16406079513626,0 -100.7957435688087,22.57857369019727,0 -100.8526784921355,22.63540115328733,0 -101.4254908894661,22.92821605418947,0 -102.3162365629853,22.82842417392639,0 -102.4909733979117,22.79966157969661,0 -101.9981338902166,22.04570187620086,0
					</coordinates>
				</LinearRing>
			</outerBoundaryIs>
		</Polygon>
	</Placemark>
</Document>
</kml>

            </textarea>
            <input type="submit" name="envia" value="envia">
        </form>

    </body>
</html>
