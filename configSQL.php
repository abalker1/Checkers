<?php
$servername = getenv("DB_HOST");
$userName = getenv("DB_USER");
$passWord = getenv("DB_PASS");
$dbname = getenv("DB_NAME");
$port = getenv("DB_PORT");

$link = new mysqli($servername, $userName, $passWord, $dbname, $port);

if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
?>