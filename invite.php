<?php echo "hello"; ?>
<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/vendor/autoload.php';

try {
    $mandrill = new Mandrill('4gS7S9jS9Ef7rt8Hq5jtFg');
    $template_name = 'invite';
    $template_content = array(
        array(
            'name' => 'Lewis Healey'
        )
    );
    $message = array(
        'html' => '<p>Example HTML content</p>',
        'text' => 'Example text content',
        'subject' => 'example subject',
        'from_email' => 'lewis@cnftti.com',
        'from_name' => 'Lewis',
        'to' => array(
            array(
                'email' => 'hello@lewishealey.co.uk',
                'name' => 'Lewis Healey',
                'type' => 'to'
            )
        )
    );

    $async = true;
    $result = $mandrill->messages->sendTemplate($template_name, $template_content, $message, $async);
    print_r($result);

} catch(Mandrill_Error $e) {
    // Mandrill errors are thrown as exceptions
    echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
    // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    throw $e;
}
?>