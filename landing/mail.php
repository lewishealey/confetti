
<?php

require_once 'vendor/autoload.php';

$m = new SimpleEmailServiceMessage();
$m->addTo('recipient@example.com');
$m->setFrom('user@example.com');
$m->setSubject('Hello, world!');
$m->setMessageFromString('This is the message body.');

$ses = new SimpleEmailService('AKIAIMKCTRYRRMPM5C2A', 'qJfE7ctBcBwhqkrPVgdbE+plpxy+Q0/tHQnELncd');
print_r($ses->sendEmail($m));

// Successful response should print something similar to:
//Array(
//     [MessageId] => 0000012dc5e4b4c0-b2c566ad-dcd0-4d23-bea5-f40da774033c-000000
//     [RequestId] => 4953a96e-29d4-11e0-8907-21df9ed6ffe3
//)

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


?>
