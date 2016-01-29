<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/vendor/autoload.php';

$session = new SpotifyWebAPI\Session('2888525482b94ccb86ae7ee9469bab07', '6df8e93ea2ba49c6ae90951fea0e2f9e', 'http://confetti:8888/details.php');

$scopes = array(
    'playlist-read-private',
    'user-read-private',
    'playlist-modify-private',
    'playlist-modify-public'
);

$authorizeUrl = $session->getAuthorizeUrl(array(
    'scope' => $scopes
));

header('Location: ' . $authorizeUrl);
die();

?>