<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    $errors = [];
    
    if (!isset($input['name']) || empty(trim($input['name']))) {
        $errors[] = 'Name is required';
    }
    
    if (!isset($input['phone']) || empty(trim($input['phone']))) {
        $errors[] = 'Phone number is required';
    }
    
    if (!isset($input['date']) || empty(trim($input['date']))) {
        $errors[] = 'Date is required';
    }
    
    if (!isset($input['time']) || empty(trim($input['time']))) {
        $errors[] = 'Time is required';
    }
    
    if (!isset($input['guests']) || empty(trim($input['guests']))) {
        $errors[] = 'Number of guests is required';
    }
    
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
        exit;
    }
    
    // Sanitize input
    $name = filter_var(trim($input['name']), FILTER_SANITIZE_STRING);
    $phone = filter_var(trim($input['phone']), FILTER_SANITIZE_STRING);
    $date = filter_var(trim($input['date']), FILTER_SANITIZE_STRING);
    $time = filter_var(trim($input['time']), FILTER_SANITIZE_STRING);
    $guests = filter_var(trim($input['guests']), FILTER_SANITIZE_STRING);
    $type = isset($input['type']) ? $input['type'] : 'table_booking';
    
    // Email configuration
    $to = 'flamingolifestylerestaurant@gmail.com';
    $subject = 'New Booking Request - Eatery at Flamingo';
    
    $message = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF007F, #D6006A); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .detail { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #FF007F; }
            .label { font-weight: bold; color: #FF007F; display: inline-block; width: 150px; }
            .footer { text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>New Booking Request</h1>
                <p>Eatery at Flamingo</p>
            </div>
            <div class='content'>
                <div class='detail'>
                    <span class='label'>Booking Type:</span> " . htmlspecialchars($type) . "
                </div>
                <div class='detail'>
                    <span class='label'>Customer Name:</span> " . htmlspecialchars($name) . "
                </div>
                <div class='detail'>
                    <span class='label'>Phone Number:</span> " . htmlspecialchars($phone) . "
                </div>
                <div class='detail'>
                    <span class='label'>Date:</span> " . htmlspecialchars($date) . "
                </div>
                <div class='detail'>
                    <span class='label'>Time:</span> " . htmlspecialchars($time) . "
                </div>
                <div class='detail'>
                    <span class='label'>Number of Guests:</span> " . htmlspecialchars($guests) . "
                </div>
                <div class='detail'>
                    <span class='label'>Submitted:</span> " . date('Y-m-d H:i:s') . "
                </div>
            </div>
            <div class='footer'>
                <p>This email was sent from the Eatery at Flamingo website contact form.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Headers for HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Eatery at Flamingo <noreply@eateryflamingo.com>" . "\r\n";
    $headers .= "Reply-To: " . $to . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email
    $email_sent = mail($to, $subject, $message, $headers);
    
    // Save to database file
    $booking_data = [
        'timestamp' => date('Y-m-d H:i:s'),
        'type' => $type,
        'name' => $name,
        'phone' => $phone,
        'date' => $date,
        'time' => $time,
        'guests' => $guests,
        'email_sent' => $email_sent
    ];
    
    $log_entry = json_encode($booking_data) . "\n";
    file_put_contents('bookings.log', $log_entry, FILE_APPEND | LOCK_EX);
    
    // Also save to CSV for easy reading
    $csv_data = [
        date('Y-m-d H:i:s'),
        $type,
        $name,
        $phone,
        $date,
        $time,
        $guests,
        $email_sent ? 'Yes' : 'No'
    ];
    
    $csv_line = '"' . implode('","', $csv_data) . '"' . "\n";
    
    // Create CSV file if it doesn't exist
    $csv_file = 'bookings.csv';
    if (!file_exists($csv_file)) {
        $csv_header = '"Timestamp","Type","Name","Phone","Date","Time","Guests","Email Sent"' . "\n";
        file_put_contents($csv_file, $csv_header);
    }
    
    file_put_contents($csv_file, $csv_line, FILE_APPEND | LOCK_EX);
    
    if ($email_sent) {
        // Send confirmation to customer (optional)
        $customer_subject = "Booking Confirmation - Eatery at Flamingo";
        $customer_message = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #FF007F, #D6006A); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .detail { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #FF007F; }
                .footer { text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Booking Received!</h1>
                    <p>Eatery at Flamingo</p>
                </div>
                <div class='content'>
                    <p>Dear " . htmlspecialchars($name) . ",</p>
                    <p>Thank you for your booking request. We have received the following details:</p>
                    
                    <div class='detail'>
                        <strong>Date:</strong> " . htmlspecialchars($date) . "<br>
                        <strong>Time:</strong> " . htmlspecialchars($time) . "<br>
                        <strong>Guests:</strong> " . htmlspecialchars($guests) . "
                    </div>
                    
                    <p>We will contact you shortly at " . htmlspecialchars($phone) . " to confirm your booking.</p>
                    <p>If you have any questions, please don't hesitate to contact us.</p>
                    
                    <p><strong>Best regards,<br>The Eatery at Flamingo Team</strong></p>
                </div>
                <div class='footer'>
                    <p>Flamingo Avenue, Kagiso 1754 | +27 62 136 9848</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        $customer_headers = "MIME-Version: 1.0" . "\r\n";
        $customer_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $customer_headers .= "From: Eatery at Flamingo <bookings@eateryflamingo.com>" . "\r\n";
        $customer_headers .= "Reply-To: " . $to . "\r\n";
        
        // If customer provided email, send confirmation (you would need to add email field to form)
        if (isset($input['email']) && filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            mail($input['email'], $customer_subject, $customer_message, $customer_headers);
        }
        
        echo json_encode(['success' => true, 'message' => 'Booking received successfully. We will contact you shortly.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send booking email. Please try again or contact us directly.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>