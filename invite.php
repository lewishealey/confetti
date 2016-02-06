<?php

require __DIR__ . '/vendor/autoload.php';
const DEFAULT_URL = 'https://boiling-fire-2669.firebaseio.com/';
const DEFAULT_TOKEN = 'P5Ofkmp3suKfnJWbWOtQimj5SqzC0tuWBdSz9UQh';
const DEFAULT_PATH = '/users/496cfa5f-46f7-43c6-8b08-f56cc0560f73';

$firebase = new \Firebase\FirebaseLib(DEFAULT_URL, DEFAULT_TOKEN);
$userData = $firebase->get(DEFAULT_PATH);
$user = json_decode($userData);

try {
    $mandrill = new Mandrill('4gS7S9jS9Ef7rt8Hq5jtFg');

    foreach($user->guests as $guest) {

        echo "<h4>You're invited " . $guest->fname . " " . $guest->lname . "!</h4>";

        foreach($guest->events as $event => $val) {
            $eventData = $firebase->get(DEFAULT_PATH . '/events/'. $event);
            $singleEvent = json_decode($eventData, true);
            echo "<p>";
            echo $singleEvent["name"] . "<br>";
            echo $singleEvent["address"] . "<br>";
            echo $singleEvent["postcode"] . "<br>";
            echo $singleEvent["from"] . "<br>";
            echo $singleEvent["to"] . "<br>";
            echo "</p>";
        }

        $message = array(
            'html' => '<p>Example ' . $guest->fname . 'HTML content</p>',
            'text' => 'Example text content',
            'subject' => $guest->fname . " you're invited",
            'from_email' => 'lewis@cnftti.com',
            'from_name' => 'Lewis',
            'to' => array(
                array(
                    'email' => $guest->email,
                    'name' => $guest->fname . ' ' . $guest->lname,
                    'type' => 'to'
                )
            )
        );

        $async = true;
        $result = $mandrill->messages->send($message, $async);
        print_r($result);

    }    

} catch(Mandrill_Error $e) {
    // Mandrill errors are thrown as exceptions
    echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
    // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    throw $e;
}    

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

?>