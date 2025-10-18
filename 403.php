<?php
header("HTTP/1.1 403 Forbidden");

// アクセス情報の取得
$ipAddress = $_SERVER['REMOTE_ADDR'];
$userAgent = $_SERVER['HTTP_USER_AGENT'];
$accessTime = date("Y-m-d H:i:s");

// ログファイルに保存する内容を整形
$logEntry = "Access Denied - IP: $ipAddress | Time: $accessTime | User-Agent: $userAgent\n";

// ログファイルのパス
$logFile = __DIR__ . '/403_log.txt';

// ログファイルに書き込む
file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>アクセス拒否</title>
    <style>
        .hidden-ip {
            display: inline-block;
            background-color: #ddd;
            color: #ddd;
            padding: 5px;
            cursor: pointer;
            border-radius: 5px;
        }
        .visible-ip {
            color: #000;
        }
    </style>
    <script>
        function toggleIP() {
            var ipElement = document.getElementById("ipAddress");
            ipElement.classList.toggle("visible-ip");
        }
    </script>
</head>
<body>
    <h1>アクセスが拒否されました</h1>
    <p>アクセス元のIPアドレス: 
        <span id="ipAddress" class="hidden-ip" onclick="toggleIP()">クリックして表示</span>
    </p>
    <script>
        document.getElementById("ipAddress").addEventListener("click", function() {
            this.textContent = "<?php echo htmlspecialchars($ipAddress); ?>";
        });
    </script>
</body>
</html>