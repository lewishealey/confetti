<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');

require __DIR__ . '/../vendor/autoload.php';

use Firebase\Firebase;
$fb = Firebase::initialize("https://boiling-fire-2669.firebaseio.com/", "P5Ofkmp3suKfnJWbWOtQimj5SqzC0tuWBdSz9UQh");

$root = $_SERVER['DOCUMENT_ROOT'];

$session = new SpotifyWebAPI\Session('5bc1d4f975214ebb9be4698594970a18', 'ee1b5a43af9942b2adcf8f69532ae001', 'http://localhost:8888/confetti/server/spotify_auth.php');

$api = new SpotifyWebAPI\SpotifyWebAPI();

session_start();

if (isset($_GET['authid'])) {
  $authid = $_GET['authid'];
  $_SESSION["authid"] = $authid;
}

  if (isset($_GET['code'])) {
      $session->requestAccessToken($_GET['code']);
      $api->setAccessToken($session->getAccessToken());

      $accessToken = $session->getAccessToken();
      $refreshToken = $session->getRefreshToken();
      $session->refreshAccessToken($refreshToken);

      $playlists = $api->getUserPlaylists('1113560298', array(
          'limit' => 5
      ));

      if (isset($_SESSION["authid"])) {
        $authid_session = $_SESSION["authid"];

        $fb_accesstoken = $fb->set("users/" . $authid_session . "/access_token", $accessToken);
        $fb_refreshtoken = $fb->set("users/" . $authid_session . "/refresh_token", $refreshToken);

      }

  } else {
      header('Location: ' . $session->getAuthorizeUrl(array(
          'scope' => array(
              'user-follow-modify',
              'user-follow-read',
              'user-read-email',
              'user-read-private',
              'playlist-modify-private',
              'playlist-modify-public',
              'playlist-read-private'
          )
      )));
      die();
  }


// $api->replaceUserPlaylistTracks('USER_ID', 'PLAYLIST_ID', array(
//     '0eGsygTp906u18L0Oimnem',
//     '1lDWb6b6ieDQ2xT7ewTC3G'
// ));

?>
