

<?php
require 'mailer/mail/PHPMailerAutoload.php';

$mail = new PHPMailer;

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->setFrom('noreply@cnftti.com', 'Cnftti.com');
$mail->addAddress('hello@lewishealey.co.uk', 'Joe User');     // Add a recipient
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Here is the subject';
$mail->Body    = 'This is the HTML message body <b>in bold!</b>';
$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

// if(!$mail->send()) {
//     echo 'Message could not be sent.';
//     echo 'Mailer Error: ' . $mail->ErrorInfo;
// } else {
//     echo 'Message has been sent';
// }

//https://github.com/ktamas77/firebase-php

?>


<!DOCTYPE html>
<html lang="en">
<head>
<title>You've been invited!</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<style type="text/css">
    #outlook a{padding:0;} /* Force Outlook to provide a "view in browser" message */
    .ReadMsgBody{width:100%;} .ExternalClass{width:100%;} /* Force Hotmail to display emails at full width */
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;} /* Force Hotmail to display normal line spacing */
    body, table, td, a{-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;} /* Prevent WebKit and Windows mobile changing default text sizes */
    table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;} /* Remove spacing between tables in Outlook 2007 and up */
    img{-ms-interpolation-mode:bicubic;} /* Allow smoother rendering of resized image in Internet Explorer */

    /* RESET STYLES */
    body{margin:0; padding:0;}
    img{border:0; height:auto; line-height:100%; outline:none; text-decoration:none;}
    table{border-collapse:collapse !important;}
    body{height:100% !important; margin:0; padding:0; width:100% !important;}

    /* iOS BLUE LINKS */
    .appleBody a {color:#68440a; text-decoration: none;}
    .appleFooter a {color:#999999; text-decoration: none;}

    /* MOBILE STYLES */
    @media screen and (max-width: 525px) {

        /* ALLOWS FOR FLUID TABLES */
        table[class="wrapper"]{
          width:100% !important;
        }

        td[class="wrapper"]{
          width:50% !important;
          display: inline-block !important;
          text-align: left;
        }

        td[class="header"]{
          font-size: 21px !important;
        }

        td[class="text"]{
          font-size: 14px !important;
        }

        td[class="link"]{
          padding: 5px 15px 5px 15px !important;
        }

        td[class="mobile-hide"]{
          display:none;
        }

        img[class="mobile-hide"]{
          display: none !important;
        }

        img[class="img-max"]{
          max-width: 100% !important;
          width: 100% !important;
          height:auto !important;
        }

        table[class="responsive-table"]{
          width:100%!important;
        }

        td[class="section-padding"]{
          padding: 0px 15px 15px 15px !important;
        }

        td[class="slice-padding"]{
          padding: 0px 15px 0px 15px !important;
        }

        td[class="smaller-padding"]{
          padding: 15px 0px 15px 0px !important;
        }

        td[class="text-padding"]{
          padding: 15px 0px 15px 0px !important;
        }
        td[class="line-padding"]{
          padding: 15px 15px 15px 15px !important;
        }

        td[class="link-padding"]{
          padding: 0px 0px 15px 0px !important;
        }

        td[class="column-padding"]{
          padding: 0px 0px 15px 0px !important;
        }

        td[class="mobile-wrapper"]{
            padding: 0 !important;
        }

        #templateColumns{
            width:100% !important;
        }

        .templateColumnContainer{
            display:block !important;
            width:100% !important;
        }

        .columnImage{
            height:auto !important;
            max-width:480px !important;
            width:100% !important;
        }

        .leftColumnContent{
            font-size:16px !important;
            line-height:125% !important;
            padding: 0 0 15px 0 !important;
        }

        .rightColumnContent{
            font-size:16px !important;
            line-height:125% !important;
            padding: 0 !important;
        }

    }
</style>

</head>
<body style="margin: 0; padding: 0; background-color: #ECEFF1;" bgcolor="#ECEFF1">

<!-- WELCOME TOP -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#FFFFFF" style="padding: 0px;" class="smaller-padding">
        <!-- HIDDEN PREHEADER TEXT -->
            <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                Entice the open with some amazing preheader text. Use a little mystery and get those subscribers to read through... 
            </div>
        </td>
    </tr>
</table>

<!-- LOGO -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#ECEFF1" style="padding: 30px 15px 30px 15px;">
            <div align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="wrapper">
                    <tr>
                        <td class="logo" style="padding: 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td bgcolor="#ECEFF1" width="200" align="center">
                                        <a href="http://www.firebox.com" target="_blank">
                                            <img alt="Logo" src="img/confetti_logo.png" width="169"  border="0">
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </td>
    </tr>
</table>

<!-- SLICE END SECTION -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#ECEFF1" align="center" style="padding: 0px 15px 0px 15px;" class="slice-padding">
            <table border="0" cellpadding="0" cellspacing="0" width="600" class="responsive-table">
                <tr>
                    <td>
                        <!-- TWO COLUMNS -->
                        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td valign="top" class="mobile-wrapper">
                                    <!-- LEFT COLUMN -->
                                    <table cellpadding="0" cellspacing="0" border="0" width="100%" align="left" class="responsive-table">
                                        <tr>
                                            <td>
                                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                    <tr>
                                                        <td align="center" bgcolor="#FFFFFF" valign="middle"><a href="#" target="_blank"><img src="http://da-photo.co.uk/wp-content/uploads/2015/07/CS_PWS_BLOG_002.jpg" width="600" style="display: block; color: #666666; font-family: Helvetica, arial, sans-serif; font-size: 13px; width: 600px;" alt="Fluid images" border="0" class="img-max"></a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- TEXT TOP -->
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
        <td bgcolor="#ECEFF1" style="padding: 0px 15px 15px 15px;" class="line-padding">
            <div align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="wrapper" bgcolor="#FFFFFF">
                    <tr>
                        <td>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td width="100%" class="text" align="center" style="font-family: 'Arial', sans-serif; color: #343434; font-size: 13px; line-height: 1; text-transform: uppercase; border-top: 1px solid #343434;  padding: 30px;">

                                    <h3>You have been invited to</h3>
                                    <h5><span id="fname">{Fname}</span> & <span id="sfname">{Sfname}</span>'s Wedding</h5>

                                        <span id="text"><strong>Free delivery</strong> when you spend £50 or more</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </td>
    </tr>
</table>


</body>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="https://cdn.firebase.com/js/client/2.3.2/firebase.js"></script>

<script>

	// Get a database reference to our posts
	var ref = new Firebase("https://boiling-fire-2669.firebaseio.com/users/579c9b94-a960-4a89-820d-892ad9e03543/guests/lewishealey741");
	// Attach an asynchronous callback to read the data at our posts reference
	ref.on("value", function(snapshot) {
	  console.log(snapshot.val());
	  var guest = snapshot.val();

	  // Names and emails
	  $("#text").text(guest.email);
	  $("#fname").text(guest.fname);
	  $("#sfname").text(guest.sfname);

	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});


</script>

</html>
