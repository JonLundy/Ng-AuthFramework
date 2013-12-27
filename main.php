<?php

$REQ = ltrim(strrchr(rtrim($_SERVER['REQUEST_URI'],'/'),'/'),'/');

header('Content-Type: application/json');
header('strict-transport-security: max-age=16070400');

switch($REQ) {
    case 'whoami':
        if (!array_key_exists('MY-AUTH', $_COOKIE)) {
            echo '[]';
            break;
        }
        
        // Add check to make sure XSRF-TOKEN header matches value in MY-AUTH cookie.
        
        echo <<<BLOCK
{
    "person_id":123456,
    "user_ident":"X0123456",
    "name_first":"Log",
    "name_last":"McLoggerson",
    "name_display":"Log McLoggerson",
    "app_roles":["Admin"],
    "dept_roles":[],
    "aspect":"~"
}

BLOCK;

    break;
    
    case 'login':
        setcookie('XSRF-TOKEN','NOT_VERY_SECURE');
        setcookie("MY-AUTH", "PERSON_ID=123456|XSRF=NOT_VERY_SECURE|ENCRYPTED_STUFF=YES_PLEASE");
        header('Location: '. $_SERVER['HTTP_REFERER']);
        break;
        
    case 'logout':
        setcookie('XSRF-TOKEN', 'deleted', time() - 1);
        setcookie('MY-AUTH', 'deleted', time() - 1);
        header('Location: '. $_SERVER['HTTP_REFERER']);
        break;
        
    default: echo $REQ;
}