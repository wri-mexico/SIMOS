<?php  
$filename = $_GET['filename'] . '.' . $_GET['format'];
$export = $_GET['export'];
$writer = fopen($filename, 'w') or die('cannot create');
fwrite($writer, $export . "\n");
fclose($writer);

header('Content-Type: application/xml');
header('Content-Disposition: attachment; filename='.basename($filename));
readfile($filename);
unlink($filename);

exit(); 
?> 