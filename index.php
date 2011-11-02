<?php
    // Daniel Brooks
    // 8.31.2011
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>styleJSON</title>

        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js" type="text/javascript"></script>
        <script type="text/javascript">
            function AssertException(message) { this.message = message; }
            AssertException.prototype.toString = function () {
                return 'AssertException: ' + this.message;
            }

            function assert(exp, message) {
                if (!exp) {
                    throw new AssertException(message);
                }
            }
        </script>
        <script type="text/javascript" src="js/styleJSON.js"></script>
        <script type="text/javascript" src="js/demo.js"></script>

        <style type="text/css">

            .root {margin:0 auto; position: relative; width: 800px;}
            ul {margin:10px 0 0 15px;}
                ul li { margin:5px 0 0 10px;}
                    ul li span { clear: right; }
        </style>
    </head>
    <body>
        <div class="root">
            
        </div>
    </body>
</html>
