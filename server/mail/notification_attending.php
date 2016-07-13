<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require('Mailin.php');
require __DIR__ . '/../../vendor/autoload.php';

const STOP_SENDING = false;

use Firebase\Firebase;
$fb = Firebase::initialize("https://boiling-fire-2669.firebaseio.com/", "P5Ofkmp3suKfnJWbWOtQimj5SqzC0tuWBdSz9UQh");

// $userData = $fb->get("users/09a57e9a-6d0d-4587-8e2e-7867111a41a2");

$users = $fb->get("users");

$before = strtotime("-10 minutes");
$mailin = new Mailin('https://api.sendinblue.com/v2.0','RAKxVhObvYnN318W');


foreach($users as $user_id => $userData) {


  if(isset($userData["cover_image"])) {
    $cover_image = $userData["cover_image"];
  } else {
    $cover_image = "https://firebasestorage.googleapis.com/v0/b/boiling-fire-2669.appspot.com/o/hdr-default.jpg?alt=media&token=1d041103-ab06-40d4-a80f-7630806af022";
  }

  if (is_array($userData["guests"])) {

    // echo $user_id;

    foreach($userData["guests"] as $key => $guest) {

      // If has attending or not attending
      $hasAttending = isset($userData["attending"][$key]);
      $hasNotAttending = isset($userData["notattending"][$key]);
      $a_incron = "";
      $na_incron = "";


      if($hasAttending || $hasNotAttending) {

        if($hasAttending) {
          $a_incron =  $userData["attending"][$key]["date_created"] / 1000 > $before;
        }

        if($hasNotAttending) {
          $na_incron =  $userData["notattending"][$key]["date_created"] / 1000 > $before;
        }


        //If attending or not attending is in cron
        if($a_incron || $na_incron) {

          $subject_guest = "You're ";

          $subject = $userData["guests"][$key]["fname"] . " " . $userData["guests"][$key]["lname"] . "";

          $events_table = "<table width='100%' cellspacing='0' cellpadding='0'>";

            $hasAttendingEvents = isset($userData["attending"][$key]["events"]);
            $hasNotAttendingEvents = isset($userData["notattending"][$key]["events"]);

              // echo date('F j, Y, g:i a', $before);

              if($hasAttendingEvents) {
                // echo date('F j, Y, g:i a', ($userData["attending"][$key]["date_created"] / 1000));

                $subject .= " is attending ";
                $subject_guest .= " attending ";

                $i = 0;

                foreach($userData["attending"][$key]["events"] as $id => $event) {
                  $i++;

                  if($i > 1) {
                    $subject.= ", ";
                    $subject_guest.= ", ";
                  }

                  $subject.=  $userData["events"][$id]["name"];
                  $subject_guest.=  $userData["events"][$id]["name"];


                  $events_table .= '<tr cellspacing="0" cellpadding="0">
                    <td cellspacing="0" cellpadding="0" style="border-bottom: 2px solid #ECEFF1; text-align: left; padding: 20px 20px 20px 20px; font-size: 16px; color: #8B9299;">
                      <img src="https://firebasestorage.googleapis.com/v0/b/boiling-fire-2669.appspot.com/o/tick.png?alt=media&token=e41d9b12-d2a8-475b-8974-c86205c20e42" height="16" style="height: 12px; padding-right: 20px;"> ' . $userData["events"][$id]["name"] . '
                    </td>';

                    $eventHasMeals = isset($userData["attending"][$key]["events"][$id]["courses"]);

                    $events_table .= '<td cellspacing="0" cellpadding="0" style="border-bottom: 2px solid #ECEFF1; text-align: left; padding: 20px 20px 20px 20px; font-size: 16px; color: #8B9299;" width="200">';

                    if($eventHasMeals) {

                        foreach($userData["attending"][$key]["events"][$id]["courses"] as $course_id => $meal) {

                          // If the event exists anymore - compare to user events
                          if(isset($userData["events"][$id]["courses"][$course_id])) {
                            $meal_id = $meal["meal_name"];
                            $events_table .= $userData["courses"][$id][$course_id]["meals"][$meal_id]["name"] . " - ";
                          }

                        }

                    }


                    $events_table .= '</td>';
                    $events_table.= "</tr>";


                    // var_dump($userData["attending"]);

                  }

              }

              if($hasNotAttendingEvents) {
                echo date('F j, Y, g:i a', ($userData["notattending"][$key]["date_created"] / 1000));

                if($hasAttendingEvents) {
                  $subject .= " and not ";
                  $subject_guest .= " and not ";
                } else {
                  $subject .= " is not attending ";
                }

                $ii = 0;

                foreach($userData["notattending"][$key]["events"] as $id => $event) {
                  $ii++;

                  if($ii > 1) {
                    $subject.= ", ";
                    $subject_guest.= ", ";
                  }

                  $subject.=  $userData["events"][$id]["name"];
                  $subject_guest.=  $userData["events"][$id]["name"];

                  $events_table .= '<tr cellspacing="0" cellpadding="0">
                    <td colspan="2" cellspacing="0" cellpadding="0" style="border-bottom: 2px solid #ECEFF1; text-align: left; padding: 20px 20px 20px 20px; font-size: 16px; color: #8B9299;">
                      <img src="https://firebasestorage.googleapis.com/v0/b/boiling-fire-2669.appspot.com/o/close.png?alt=media&token=a2250bd0-d07a-4ffc-b10b-cf9c08566932" height="16" style="height: 12px; padding-right: 20px;"> ' . $userData["events"][$id]["name"] . '
                    </td>
                    </tr>';
                  }

              }

              if(isset($userData["playlist"][$key])) {

                $notice = '<table align="center">
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


          $events_table .= "</table>";

          echo "<p>" . $subject . "</p>";
          echo "<p>" . $subject_guest . "</p>";

          echo $events_table;
          echo $notice;
          echo $userData["email"];

          if(STOP_SENDING) {

          } else {
            $data = array(
                      "id" => 1,
                        "to" => $userData["email"],
                        "attr" => array(
                          "FNAME"=>$userData["guests"][$key]["fname"],
                          "LNAME"=>$userData["guests"][$key]["lname"],
                          "EVENT_LOOP"=> $events_table,
                          "TRACK" => $notice,
                          "DATE" => date('F j, Y, g:i a', ($guest["date_created"] / 1000)),
                          "NOTICE" => "Amazing!",
                          "LINK" => "http://app.cnftti.com/",
                          "SUBJECT" => $subject,
                          "COVER_IMAGE" => $cover_image
                        )
            );

            $data_guest = array(
                      "id" => 6,
                        "to" => $userData["guests"][$key]["email"],
                        "attr" => array(
                          "FNAME"=>$userData["guests"][$key]["fname"],
                          "EVENT_LOOP"=> $events_table,
                          "TRACK" => $notice,
                          "DATE" => date('F j, Y, g:i a', ($guest["date_created"] / 1000)),
                          "NOTICE" => "Amazing!",
                          "LINK" => "http://app.cnftti.com/#/page/". $userData["username"] . "/" . $key,
                          "SUBJECT" => $subject_guest,
                          "COVER_IMAGE" => $cover_image
                        )
            );


            var_dump($mailin->send_transactional_template($data));
            var_dump($mailin->send_transactional_template($data_guest));

          }



        }


      }


    }

  }


}

// print_r($userData);






?>
