<?php
include('configSQL.php');
session_start();
$user_check = $_SESSION["username"];

$sql = mysqli_query($link,"select username from player where username = '$user_check' ");
   
   $row = mysqli_fetch_array($sql,MYSQLI_ASSOC);
   
   $login_session = $row['username'];
   
   if(!isset($_SESSION['username'])){
      header("location:index.php");
      die();
   }

?>