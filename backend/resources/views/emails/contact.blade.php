<!DOCTYPE html>
<html>
<head>
    <title>Nouveau message de contact</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #4b5563; }
        .value { margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Nouveau message depuis le site IMMORent</h2>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">Nom :</div>
                <div class="value">{{ $contactData['first_name'] ?? '' }} {{ $contactData['last_name'] ?? '' }}</div>
            </div>
            
            @if(!empty($contactData['company']))
            <div class="field">
                <div class="label">Entreprise :</div>
                <div class="value">{{ $contactData['company'] }}</div>
            </div>
            @endif

            <div class="field">
                <div class="label">Email :</div>
                <div class="value">{{ $contactData['email'] ?? '' }}</div>
            </div>

            @if(!empty($contactData['phone']))
            <div class="field">
                <div class="label">Téléphone :</div>
                <div class="value">{{ $contactData['phone'] }}</div>
            </div>
            @endif

            <div class="field">
                <div class="label">Message :</div>
                <div class="value" style="white-space: pre-wrap; background: #fff; padding: 10px; border: 1px solid #e5e7eb; border-radius: 4px; margin-top: 5px;">{{ $contactData['message'] ?? '' }}</div>
            </div>
        </div>
    </div>
</body>
</html>
