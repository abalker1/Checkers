<?php
require_once "configSQL.php";

// Fetch all agents from the database
$sql = "SELECT * FROM `game`";
$result = $link->query($sql);

// Check if there are results
if ($result) {
    $allGames = array();

    if ($result->num_rows > 0) {
        // Fetch all rows of data
        while ($row = $result->fetch_assoc()) {
            $username = $row['username'];
            $score = $row['score'];
            $duration = $row['duration'];
            $whiteTurns = $row['whiteTurns'];
            $blackTurns = $row['blackTurns'];

            $gameData = array($username, $score, $duration, $whiteTurns, $blackTurns);
            $allGames[] = $gameData;
        }
    }

    echo json_encode($allGames);
} else {
    echo json_encode(["error" => $conn->error]); // Return an error message
}

// Close the database connection
$link->close();
?>
