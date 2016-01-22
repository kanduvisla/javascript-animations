<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>SVG Animations</title>
    <style type="text/css">
        html, body { margin:0; padding: 0; }
        #svg { width:800px; height:600px; position:absolute; margin-left:-400px; left:50%; top:50%; margin-top:-300px; }
        #nav {
            position: absolute;
            left:10px;
            right:10px;
            bottom:10px;
            box-shadow:0 2px 6px #000;
            box-sizing:border-box;
            padding: 10px;
            text-align: center;
        }
        #nav a {
            margin: 0 .5em;
        }
    </style>
</head>
<body>
    <svg id="svg"></svg>
    <nav id="nav">
        <?php
        $files = glob('*.js');
        natsort($files);
        foreach ($files as $file) {
            printf('<a href="index.php?js=%1$s">%1$s</a> ', basename($file));
        }
        ?>
    </nav>
    <script type="text/javascript" src="svg.js"></script>
    <script type="text/javascript" src="<?php echo isset($_GET['js']) ? $_GET['js'] : 'demo1.js'; ?>"></script>
</body>
</html>