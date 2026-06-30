<?php
require_once 'configSQL.php';
include 'session.php';

$username = $login_session;
echo $username;


if ($_SERVER['REQUEST_METHOD'] === 'POST') {    
	
	$score = $_POST['score'];
    $duration = $_POST['duration'];
    $whiteTurns = $_POST['whiteTurns'];
    $blackTurns = $_POST['blackTurns'];
	
	$sqlMaxId = "SELECT MAX(`id`) AS maxId FROM `game`";
	$resultMaxId = $link->query($sqlMaxId);

// Check if there are results
if ($resultMaxId) {
    $rowMaxId = $resultMaxId->fetch_assoc();
    $maxId = $rowMaxId['maxId'];

    // Alter the table to set the auto-increment value
    $sqlAlterAutoIncrement = "ALTER TABLE `game` AUTO_INCREMENT = " . ($maxId + 1);
    $resultAlterAutoIncrement = $link->query($sqlAlterAutoIncrement);

    if (!$resultAlterAutoIncrement) {
        echo "Error resetting auto-increment: " . $link->error;
        $link->close();
        exit;
    }
} else {
    echo "Error fetching maximum ID: " . $link->error;
    $link->close();
    exit;
}

	$sql = "INSERT INTO `game` (`username`, `score`, `duration`, `whiteTurns`, `blackTurns`) VALUES ('$username', '$score', '$duration', '$whiteTurns', '$blackTurns')";

    if ($link->query($sql) !== TRUE) {
        echo "Error inserting game: " . $link->error;
    }
	

}
// Close connection
$link->close();
?>
