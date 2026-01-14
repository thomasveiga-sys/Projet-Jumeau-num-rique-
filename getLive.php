<?php
$live = [
    "tempIn" => 22 + rand(0, 10) / 10,
    "tempOut" => 45 + rand(0, 20) / 10
];

header("Content-Type: application/json");
echo json_encode($live);
