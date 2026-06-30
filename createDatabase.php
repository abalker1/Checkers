<?php
require_once 'configSQL.php';

// Create the database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS " . $dbname;
if ($link->query($sql) === TRUE) {
    echo "Database " . $dbname . " created or already exists<br>";
} else {
    echo "Error creating database: " . $link->error . "<br>";
}

$link->close();

// Open a new connection to the created database
$link = new mysqli($servername, $userName, $passWord, $dbname, $port);
if ($link->connect_error) {
    die("Connection failed: " . $link->connect_error . "<br>");
}


$sql = "CREATE TABLE IF NOT EXISTS game (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    score VARCHAR(30) NOT NULL,
    duration INT(50) NOT NULL,
    whiteTurns INT(50) NOT NULL,
    blackTurns INT(50) NOT NULL
)";

if ($link->query($sql) === TRUE) {
    echo "Table Game created or already exists<br>";
} else {
    echo "Error creating table: " . $link->error . "<br>";
}

$link->close();


$link = new mysqli($servername, $userName, $passWord, $dbname, $port);
if ($link->connect_error) {
    die("Connection failed: " . $link->connect_error . "<br>");
}


$sql = "CREATE TABLE IF NOT EXISTS player (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
)";

if ($link->query($sql) === TRUE) {
    echo "Table player created or already exists<br>";
} else {
    echo "Error creating table: " . $link->error . "<br>";
}

$link->close();
?>
