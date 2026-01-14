<?php
$action = $_GET["action"] ?? "";

if ($action === "up") {
    file_put_contents("resistance.log", "UP\n", FILE_APPEND);
}

if ($action === "down") {
    file_put_contents("resistance.log", "DOWN\n", FILE_APPEND);
}

echo "OK";
