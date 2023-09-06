<?php
    set_time_limit(60);
    $filename = $_GET['url'];
    header('Content-Type: text/xml');
    $file = str_replace('|', '&', $filename);
    //$myFile = "log.txt";
    //$fh = fopen($myFile, 'w');
    //$stringData = $file;
    //fwrite($fh, $stringData);
    //$stringData = readfile($file);
    //fwrite($fh, $stringData);
    readfile($file);
?>