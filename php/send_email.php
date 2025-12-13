<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    $errors = [];
    
    if (!isset($input['name']) || empty(trim($input['name']))) {
        $errors[] = 'Name is required';
    }
    
    if (!isset($input['email']) || empty(trim($input['email']))) {
        $errors[] = 'Email is required';
    }
    
    if (!isset($input['message']) || empty(trim($input['message']))) {
        $errors[] = 'Message is required';
    }
    
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
        exit;
    }
    
    // Sanitize input
    $name = filter_var(trim($input['name']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
    $phone = isset($input['phone']) ? filter_var(trim($input['phone']), FILTER_SANITIZE_STRING) : 'Not provided';
    $subject = isset($input['subject']) ? filter_var(trim($input['subject']), FILTER_SANITIZE_STRING) : 'Website Contact Form';
    $message = filter_var(trim($input['message']), FILTER_SANITIZE_STRING);
    $type = isset($input['type']) ? $input['type'] : 'contact_form';
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
    $to = 'flamingolifestylerestaurant@gmail.com';
    $email_subject = "New Contact Form Submission: " . $subject;
    
    $email_message = "
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
            .message { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border: 1px solid #ddd; }
            .footer { text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>New Contact Form Submission</h1>
                <p>Eatery at Flamingo Website</p>
            </div>
            <div class='content'>
                <div class='detail'>
                    <span class='label'>Form Type:</span> " . htmlspecialchars($type) . "
                </div>
                <div class='detail'>
                    <span class='label'>Name:</span> " . htmlspecialchars($name) . "
                </div>
                <div class='detail'>
                    <span class='label'>Email:</span> " . htmlspecialchars($email) . "
                </div>
                <div class='detail'>
                    <span class='label'>Phone:</span> " . htmlspecialchars($phone) . "
                </div>
                <div class='detail'>
                    <span class='label'>Subject:</span> " . htmlspecialchars($subject) . "
                </div>
                <div class='detail'>
                    <span class='label'>Submitted:</span> " . date('Y-m-d H:i:s') . "
                </div>
                
                <div class='message'>
                    <strong>Message:</strong><br>
                    " . nl2br(htmlspecialchars($message)) . "
                </div>
            </div>
            <div class='footer'>
                <p>This email was sent from the Eatery at Flamingo website contact form.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Eatery at Flamingo <noreply@eateryflamingo.co.za>" . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    $email_sent = mail($to, $email_subject, $email_message, $headers);
    
    // Save to log file
    $contact_data = [
        'timestamp' => date('Y-m-d H:i:s'),
        'type' => $type,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'subject' => $subject,
        'message' => $message,
        'email_sent' => $email_sent
    ];
    
    $log_entry = json_encode($contact_data) . "\n";
    file_put_contents('contacts.log', $log_entry, FILE_APPEND | LOCK_EX);
    
    // Save to CSV
    $csv_data = [
        date('Y-m-d H:i:s'),
        $type,
        $name,
        $email,
        $phone,
        $subject,
        substr(str_replace('"', "'", $message), 0, 100) . '...', // Truncate long messages
        $email_sent ? 'Yes' : 'No'
    ];
    
    $csv_line = '"' . implode('","', $csv_data) . '"' . "\n";
    
    $csv_file = 'contacts.csv';
    if (!file_exists($csv_file)) {
        $csv_header = '"Timestamp","Type","Name","Email","Phone","Subject","Message Preview","Email Sent"' . "\n";
        file_put_contents($csv_file, $csv_header);
    }
    
    file_put_contents($csv_file, $csv_line, FILE_APPEND | LOCK_EX);
    
    if ($email_sent) {
        // Send auto-reply to customer
        $auto_reply_subject = "Thank you for contacting Eatery at Flamingo";
        $auto_reply_message = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #FF007F, #D6006A); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .footer { text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Thank You for Contacting Us!</h1>
                    <p>Eatery at Flamingo</p>
                </div>
                <div class='content'>
                    <p>Dear " . htmlspecialchars($name) . ",</p>
                    
                    <p>Thank you for getting in touch with Eatery at Flamingo. We have received your message and will get back to you as soon as possible.</p>
                    
                    <p><strong>Here's a summary of your inquiry:</strong></p>
                    <ul>
                        <li><strong>Subject:</strong> " . htmlspecialchars($subject) . "</li>
                        <li><strong>Message:</strong> " . substr(htmlspecialchars($message), 0, 100) . "...</li>
                    </ul>
                    
                    <p>We typically respond within 24 hours. For urgent matters, please call us at <strong>+27 62 136 9848</strong>.</p>
                    
                    <p><strong>Best regards,<br>The Eatery at Flamingo Team</strong></p>
                </div>
                <div class='footer'>
                    <p>Flamingo Avenue, Kagiso 1754 | +27 62 136 9848 | flamingolifestylerestaurant@gmail.com</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        $auto_reply_headers = "MIME-Version: 1.0" . "\r\n";
        $auto_reply_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $auto_reply_headers .= "From: Eatery at Flamingo <noreply@eateryflamingo.com>" . "\r\n";
        $auto_reply_headers .= "Reply-To: flamingolifestylerestaurant@gmail.com" . "\r\n";
        
        mail($email, $auto_reply_subject, $auto_reply_message, $auto_reply_headers);
        
        echo json_encode(['success' => true, 'message' => 'Message sent successfully. We will get back to you soon.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again or contact us directly.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>