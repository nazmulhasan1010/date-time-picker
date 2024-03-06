<style>
@import url('https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap');
*{
    font-family: "Mulish", sans-serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
    letter-spacing: 1px;
}
</style>

## Date And Time Picker—Documentation

To use date picker

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Picker</title>
    <link rel="stylesheet" href="src/nh-picker.min.css">
</head>
<body>

<!--To use date picker, you can use input type 'text' or 'date'-->
<input type="text" class="picker" name="birthday">
<!--or-->
<input type="date" class="picker" name="birthday">

<script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<script src="src/picker.min.js"></script>
<script>
    $(function () {
        $('.picker').picker();
    });
</script>
</body>
```

To change html default date format, you can use...

```html
<input type="date" class="picker" data-nh-date-format="dd-mm-yyyy" name="birthday">
```

```or```

```javascript
$('.picker').picker({
    dateFormat: 'dd-mm-yyyy'
});
```

If you want to add ```minimum date``` and ```maximum date``` you can use...

```html
<input type="date" class="picker" data-nh-min-date="5/7/2022"
       data-nh-max-date="20/6/2024" name="birthday">
```

```or```

```javascript
$('.picker').picker({
    minDate: '5/2/2023',
    maxDate: '25/8/2024',
});
```

> Note: The ```minimum date``` and ```maximum date``` value will be same format of your changed format.

To active date range selection, you can use...

```html
<!--This value will be 'true' or 'false'-->
<input type="date" class="picker" data-nh-date-range="false" name="birthday">
```

```or```

```javascript
$('.picker').picker({
    dateRange: true, // default value is 'false'
});
```

To show button today, you can use...

```html
<!--This value will be 'true' or 'false'-->
<input type="date" class="picker" data-nh-today="true" name="birthday">
```

```or```

```javascript
$('.picker').picker({
    today: true, // default value is 'false'
});
```

