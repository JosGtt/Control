<?php

try {
    $host = "127.0.0.1";
    $port = "5432";
    $dbname = "Control";
    $user = "postgres";
    $password = "123456";

    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Áreas disponibles:\n";
    $stmt = $pdo->query("SELECT * FROM areas");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "ID: {$row['id']}, Nombre: {$row['nombre']}\n";
    }

    // Distribuir algunos cargos entre diferentes áreas para probar
    echo "\nDistribuyendo cargos entre áreas...\n";
    
    // Obtener el número de áreas
    $areasStmt = $pdo->query("SELECT COUNT(*) as count FROM areas");
    $areaCount = $areasStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    if ($areaCount > 1) {
        // Asignar algunos cargos al área 2 si existe
        $pdo->exec("UPDATE cargos SET area_id = 2 WHERE id IN (4, 5)");
        echo "Cargos 4 y 5 asignados al área 2\n";
        
        if ($areaCount > 2) {
            // Asignar algún cargo al área 3 si existe
            $pdo->exec("UPDATE cargos SET area_id = 3 WHERE id = 3");
            echo "Cargo 3 asignado al área 3\n";
        }
    }

    echo "\nDatos actualizados de cargos:\n";
    $stmt = $pdo->query("SELECT c.*, a.nombre as area_nombre FROM cargos c LEFT JOIN areas a ON c.area_id = a.id");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "ID: {$row['id']}, Cargo: {$row['nombre']}, Area: {$row['area_nombre']} (ID: {$row['area_id']})\n";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>