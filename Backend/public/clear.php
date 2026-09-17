<?php
echo "<pre>";
passthru('php artisan config:clear');
passthru('php artisan cache:clear');
passthru('php artisan route:clear');
passthru('php artisan view:clear');
passthru('php artisan optimize');
echo "</pre>";
