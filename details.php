<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/vendor/autoload.php';

$session = new SpotifyWebAPI\Session('2888525482b94ccb86ae7ee9469bab07', '6df8e93ea2ba49c6ae90951fea0e2f9e', 'http://confetti:8888/details.php');

$api = new SpotifyWebAPI\SpotifyWebAPI();

// Request a access token using the code from Spotify
$session->requestAccessToken($_GET['code']);
$accessToken = $session->getAccessToken();
$refreshToken = $session->getRefreshToken();

// Set the access token on the API wrapper
$api->setAccessToken($accessToken);

$session->refreshAccessToken($refreshToken);

// Start using the API!
// $add = $api->addUserPlaylistTracks('1113560298', '7Fyg5tJ0oQdIRxLwOJ2T1g', array(
//     '0sr5LOMv4x0jmTYfe6oOvP',
// ));


if($accessToken){
 	$data = array(
 		'access_token' => $accessToken, 
 		'refresh_token' => $refreshToken);

	echo json_encode($data);

} else {
	echo "Can't authorize";
}


?>