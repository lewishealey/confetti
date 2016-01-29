<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/vendor/autoload.php';

$session = new SpotifyWebAPI\Session('2888525482b94ccb86ae7ee9469bab07', '6df8e93ea2ba49c6ae90951fea0e2f9e', 'http://confetti:8888/addtrack.php');

$api = new SpotifyWebAPI\SpotifyWebAPI();

// Request a access token using the code from Spotify
$session->requestAccessToken($_GET['code']);
$accessToken = $session->getAccessToken();

// Set the access token on the API wrapper
$api->setAccessToken($accessToken);





?>