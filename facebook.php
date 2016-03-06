<?php

require __DIR__ . '/vendor/autoload.php';
const DEFAULT_URL = 'https://boiling-fire-2669.firebaseio.com/';
const DEFAULT_TOKEN = 'P5Ofkmp3suKfnJWbWOtQimj5SqzC0tuWBdSz9UQh';
const DEFAULT_PATH = '/users/496cfa5f-46f7-43c6-8b08-f56cc0560f73';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$firebase = new \Firebase\FirebaseLib(DEFAULT_URL, DEFAULT_TOKEN);

$fb = new Facebook\Facebook([
  'app_id' => '924962840952453',
  'app_secret' => 'fe5ab331391d48fb8177d985351b7042',
  'default_graph_version' => 'v2.2',
  ]);

  $helper = $fb->getRedirectLoginHelper();

  $permissions = ['email']; // Optional permissions
  $loginUrl = $helper->getLoginUrl('http://confetti:8888/fb-callback.php', $permissions);

  echo '<a href="' . htmlspecialchars($loginUrl) . '">Log in with Facebook!</a>';


?>
