<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../vendor/autoload.php';

const STOP_SENDING = false;

use Firebase\Firebase;
$fb = Firebase::initialize("https://boiling-fire-2669.firebaseio.com/", "P5Ofkmp3suKfnJWbWOtQimj5SqzC0tuWBdSz9UQh");

if(isset($_GET["user"])) {
  $userData = $fb->get("users/" . $_GET["user"]);
} else {
  $userData = false;
}

header('Content-Type: text/csv; charset=utf-8');

if(isset($userData["username"])) {
  header('Content-Disposition: attachment; filename=guests-' . $userData["username"] . '.csv');
} else {
  header('Content-Disposition: attachment; filename=guests.csv');
}

// create a file pointer connected to the output stream
$fp = fopen('php://output', 'w');

// output the column headings
fputcsv($fp, array('DATE', 'FNAME', 'LNAME','EMAIL','ATTENDING','NOT ATTENDING','MEALS','TRACK'));


// $users = $fb->get("users/8d85fb84-129f-4c25-b8a9-c06e33761d41");

?>
<?php

  if (is_array($userData["guests"])) {

    foreach($userData["guests"] as $key => $guest) {

      // If has attending or not attending
      $hasAttending = isset($userData["attending"][$key]);
      $hasNotAttending = isset($userData["notattending"][$key]);


      if($hasAttending || $hasNotAttending) {

        if(isset($userData["guests"][$key]["fname"]) ) { $fname = $userData["guests"][$key]["fname"]; } else { $fname = "Not set"; }

          $lname = $userData["guests"][$key]["lname"];
          $email = $userData["guests"][$key]["email"];
          $events_attending = false;
          $events_notattending = false;
          $event_meals = false;

          if(isset($userData["attending"][$key]["date_created"])) {
            $date = date('F j, Y, g:i a', ($userData["attending"][$key]["date_created"] / 1000));
          } else {
            $date = date('F j, Y, g:i a', ($userData["notattending"][$key]["date_created"] / 1000));
          }

            $hasAttendingEvents = isset($userData["attending"][$key]["events"]);
            $hasNotAttendingEvents = isset($userData["notattending"][$key]["events"]);


              if($hasAttendingEvents === true) {

                $i = 0;

                foreach($userData["attending"][$key]["events"] as $id => $event) {
                  $i++;

                  if($i > 1) {
                    $events_attending.= ", ";
                  }

                  $events_attending.=  $userData["events"][$id]["name"];

                    $eventHasMeals = isset($userData["attending"][$key]["events"][$id]["courses"]);

                    if($eventHasMeals) {

                        foreach($userData["attending"][$key]["events"][$id]["courses"] as $course_id => $meal) {

                          // If the event exists anymore - compare to user events
                          if(isset($userData["events"][$id]["courses"][$course_id])) {
                            $meal_id = $meal["meal_name"];
                            $event_meals .= $userData["courses"][$id][$course_id]["meals"][$meal_id]["name"] . " - ";
                          }

                        }

                    }

                  }

              }

              if($hasNotAttendingEvents === true) {

                $ii = 0;

                foreach($userData["notattending"][$key]["events"] as $id => $event) {
                  $ii++;

                  if($ii > 1) {
                    $events_notattending.= ", ";
                  }

                  $events_notattending.=  $userData["events"][$id]["name"];

                  }

              } else {
                $events_notattending.= "Not set";
              }

              if(isset($userData["playlist"][$key])) {

                $track = $userData["playlist"][$key]["artist_name"] . " - " . $userData["playlist"][$key]["track_name"];

              } else {
                $track = "Not set";
              }

              fputcsv($fp, array($date,$fname,$lname,$email,$events_attending,$events_notattending,$event_meals,$track));

              // echo "<tr>";
              // echo "<td>" . $date . "</td>";
              // echo "<td>" . $fname . "</td>";
              // echo "<td>" . $lname . "</td>";
              // echo "<td>" . $email . "</td>";
              // echo "<td>" . $events_attending . "</td>";
              // echo "<td>" . $events_notattending . "</td>";
              // echo "<td>" . $event_meals . "</td>";
              // echo "<td>" . $track . "</td>";
              // echo "</tr>";

      }


    }

  }

  fclose($fp);



// print_r($userData);

?>
