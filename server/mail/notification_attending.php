<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require('Mailin.php');

require __DIR__ . '/../../vendor/autoload.php';

const DEFAULT_URL = 'https://boiling-fire-2669.firebaseio.com/';
const DEFAULT_TOKEN = 'P5Ofkmp3suKfnJWbWOtQimj5SqzC0tuWBdSz9UQh';
const DEFAULT_PATH = '/users/09a57e9a-6d0d-4587-8e2e-7867111a41a2/';

$firebase = new \Firebase\FirebaseLib(DEFAULT_URL, DEFAULT_TOKEN);
$userData = $firebase->get(DEFAULT_PATH);
$user = json_decode($userData);

$before = strtotime("-2 hours");

$mailin = new Mailin('https://api.sendinblue.com/v2.0','RAKxVhObvYnN318W');

foreach($user->attending as $key => $guest) {

  if(($guest->date_created / 1000) > $before) {

    foreach($user->attending->$key->events as $id => $event) {

      echo $user->events->$id->name;

    }


      echo "<p>Created" . $guest->date_created / 1000 . "</p>";

      echo "<p>Before " . date('F j, Y, g:i a', strtotime("-1 minute")) . "</p>";

      echo "<p>Now: " . date('F j, Y, g:i a', strtotime("now")) . "</p>";

      echo "<p>Created: " . date('F j, Y, g:i a', ($guest->date_created / 1000)) . "</p>";

      $events_table;


      $data = array(
                "id" => 1,
                  "to" => "hello@lewi.sh",
                  "attr" => array(
                    "FNAME"=>$user->guests->$key->fname,
                    "LNAME"=>$user->guests->$key->lname,
                    "EVENT_LOOP"=> "<h1>Hello</h1>"
                  )
      );

      var_dump($mailin->send_transactional_template($data));



    }


}




?>
