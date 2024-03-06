
## Date And Time Picker—Documentation

### Installation
NPM install
```bash
npm i nh-picker
```
CDN
```html
<!-- css -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nh-picker/style/nh-picker.min.css">
<!-- js -->
<script src="https://cdn.jsdelivr.net/npm/nh-picker/js/picker.min.js"></script>
```

Basic use

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

<!-- To use date picker, you can use input type 'text' or 'date' -->
<input type="text" class="picker" name="birthday">
<!-- or -->
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
<!-- default value 'yyyy-MM-dd' -->
<input type="date" class="picker" data-nh-date-format="dd-mm-yyyy" name="birthday">
```

```or```

```javascript
$('.picker').picker({
    dateFormat: 'dd-mm-yyyy' // default value 'yyyy-MM-dd'
});
```

If you want to add ```minimum date``` and ```maximum date``` you can use...

```html
<!-- default value 'null' -->
<input type="date" class="picker" data-nh-min-date="5/7/2022"
       data-nh-max-date="20/6/2024" name="birthday">
```

```or```

```javascript
$('.picker').picker({
    minDate: '5/2/2023', // default value 'null'
    maxDate: '25/8/2024', // default value 'null'
});
```

> Note: The ```minimum date``` and ```maximum date``` values will be the same format as your modified format.

To select the dateline, you can use...

```html
<!-- This value will be 'true' or 'false' -->
<!-- default value 'false' -->
<input type="date" class="picker" data-nh-date-range="false" name="birthday">
```

```or```

```javascript
$('.picker').picker({
    dateRange: true, // default value 'false'
});
```

To show today button, you can use...

```html
<!-- This value will be 'true' or 'false' -->
<!-- default value 'false' -->
<input type="date" class="picker" data-nh-today="true" name="birthday">
```

```or```

```javascript
$('.picker').picker({
    today: true, // default value 'false'
});
```
## Time picker

To use ```Time Picker```

```html
<!-- default value 12 -->
<input type="time" class="picker" data-nh-time-format="12">
```

```or```

```javascript
$('.picker').picker({
    timeFormat: 12 // default value 12
});
```