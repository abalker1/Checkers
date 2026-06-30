<?php
require_once 'configSQL.php';

$sql = "ALTER TABLE player MODIFY password VARCHAR(255) NOT NULL";

if ($link->query($sql) === TRUE) {
    echo "Password column successfully updated to VARCHAR(255)!";
} else {
    echo "Error updating column: " . $link->error;
}

$link->close();
?>