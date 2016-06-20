<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require('Mailin.php');
require __DIR__ . '/../../vendor/autoload.php';

use Firebase\Firebase;
$fb = Firebase::initialize("https://boiling-fire-2669.firebaseio.com/", "P5Ofkmp3suKfnJWbWOtQimj5SqzC0tuWBdSz9UQh");

$userData = $fb->get("users/09a57e9a-6d0d-4587-8e2e-7867111a41a2");

// print_r($userData);

$before = strtotime("-10 minute");

$mailin = new Mailin('https://api.sendinblue.com/v2.0','RAKxVhObvYnN318W');

foreach($userData["attending"] as $key => $guest) {

  if(($guest["date_created"] / 1000) > $before) {

    $events_table = "";

    if($userData["playlist"][$key]) {

      $notice = '
      <table align="center">
        <tr>
          <td style="padding-left: 20px; color: #8B9299;">
            <img src="' . $userData["playlist"][$key]["album_image"] . '" width="75">
          </td>
          <td style="padding-left: 20px; text-align: left;">
            <span style="font-size: 18px; line-height: 1.44; color: #8B9299; display: block;">' . $userData["playlist"][$key]["artist_name"] . '</span>
            <span style="font-size: 18px; line-height: 1.44; color: #233332; display: block; padding-bottom: 5px;">' . $userData["playlist"][$key]["track_name"] . '</span>
            <a href="https://play.spotify.com/track/' . $userData["playlist"][$key]["id"]. '">
              <img src="http://res.cloudinary.com/dtavhihxu/image/upload/v1466015803/play-with_hmyqe6.png" width="130">
            </a>
          </td>
        </tr>
      </table>';
    } else {
      $notice = "Did not submit a track :(";
    }

    echo $notice;


    foreach($userData["attending"][$key]["events"] as $id => $event) {
      $event_id = $id;

      $events_table .= "<table width='100%' cellspacing='0' cellpadding='0'>";

      $events_table .= '
      <tr cellspacing="0" cellpadding="0">
        <td cellspacing="0" cellpadding="0" style="border-bottom: 2px solid #ECEFF1; text-align: left; padding: 20px 20px 20px 20px; font-size: 16px; color: #8B9299;">
          <img src="http://res.cloudinary.com/dtavhihxu/image/upload/v1466018779/tick_fu3uab.png" height="16" style="height: 12px; padding-right: 20px;"> ' . $userData["events"][$id]["name"] . '
        </td>
        <td cellspacing="0" cellpadding="0" style="border-bottom: 2px solid #ECEFF1; text-align: right; font-size: 16px; padding: 20px 20px 20px 20px;">
        ';

        if(!empty($userData["attending"][$key]["events"][$id]["courses"])) {

          $events_table .= '
            <table align="right">
              <tr>';

          foreach($userData["attending"][$key]["events"][$id]["courses"] as $course_id => $course) {
            $meal_id = $course["meal_name"];

            $events_table .= '
                  <td style="padding-left: 20px; color: #8B9299;">
                    ' . $userData["courses"][$event_id][$course_id]["meals"][$meal_id]["name"] . '
                  </td>';

            // $events_table .= "<td>" . $user->courses->$event_id->$course_id->name  . ":</td>";

          }

          $events_table .= "
            </tr>
          </table>";

        }

      $events_table .= '
        </td>
      </tr>
      </table>';

    }


      // echo "<p>Created" . $guest->date_created / 1000 . "</p>";
      // echo "<p>Before " . date('F j, Y, g:i a', strtotime("-1 minute")) . "</p>";
      // echo "<p>Now: " . date('F j, Y, g:i a', strtotime("now")) . "</p>";
      // echo "<p>Created: " . date('F j, Y, g:i a', ($guest->date_created / 1000)) . "</p>";

      $data = array(
                "id" => 1,
                  "to" => "hello@lewi.sh",
                  "attr" => array(
                    "FNAME"=>$userData["guests"][$key]["fname"],
                    "LNAME"=>$userData["guests"][$key]["lname"],
                    "EVENT_LOOP"=> $events_table,
                    "TRACK" => $notice,
                    "DATE" => date('F j, Y, g:i a', ($guest["date_created"] / 1000)),
                    "NOTICE" => "Amazing!",
                    "LINK" => "http://localhost:8888/confettiapp/"
                  )
      );

      var_dump($mailin->send_transactional_template($data));


    }


}




?>
