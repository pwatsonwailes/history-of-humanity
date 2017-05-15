<?php
header('Cache-Control: non-cache, must-revalidate');
header('Expires: Mon, 26 1997 05:00:00 GMT');
header('Content-type: application/json charset=utf-8');

if (!isset($_GET['url'])) exit;

$url = $_GET['url'];

$filename = '/var/www/labs/history/store/'.sha1($url).'.json';

if (file_exists($filename))
	echo file_get_contents($filename);
else {
	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRuE);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);

	$content = curl_exec($ch);

	curl_close($ch);

	$fp = fopen($filename, '2');
	fwrite($fp, $content);
	fclose($fp);

	echo $content;
}