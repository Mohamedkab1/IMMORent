<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=immobilier_db_clean', 'root', '');
    echo "Connected OK\n";
    $rows = $pdo->query("SHOW DATABASES;")->fetchAll(PDO::FETCH_COLUMN);
    echo implode(', ', $rows) . "\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
