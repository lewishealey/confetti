<?php

require __DIR__ . '/vendor/autoload.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


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
