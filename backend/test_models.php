<?php
$apiKey = getenv('GEMINI_API_KEY'); // Will need to read from .env manually if running outside Laravel
$envFile = file_get_contents('.env');
preg_match('/GEMINI_API_KEY=(.*)/', $envFile, $matches);
$apiKey = trim($matches[1]);

$url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' . $apiKey;
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
