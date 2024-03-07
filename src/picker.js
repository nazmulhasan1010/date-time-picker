$.fn.extend({
    picker: function (options = {}) {
        let body = $('body') ?? $(window), elements = $(this), div = '<div>', span = '<span>',
            picker = $(div, {class: 'nh-picker before-top'}), timePicker = $(div, {class: 'nh-time-picker before-top'}),
            calendar = $(div, {class: 'nh-datepicker-calendar'}), headerSection = $(div, {class: 'nh-calendar-header'}),
            open = false, formatOp = options.dateFormat ?? 'dd/mm/yyyy', minDateOp = options.minDate ?? null,
            maxDateOp = options.maxDate ?? null, todayOp = options.today ?? false, typeOp = options.type,
            dateRangeOp = options.dateRange ?? false, rangeA = {}, timeFormatOp = options.timeFormat ?? 12;

        headerSection.append($(span, {
            class: 'nh-header-content nh-prev-month', html: '&lt;'
        })).append($(span, {class: 'nh-header-content nh-current-month-year',}).append('<button></button>  <button></button>')).append($(span, {class: 'nh-header-content-text nh-inactive'})).append($(span, {
            class: 'nh-header-content nh-next-month', html: '&gt;'
        }));

        picker.append(calendar.append(headerSection).append($(div, {class: 'nh-content nh-calendar-days nh-active'}).append($(div, {class: 'nh-day-names'})).append($(div, {class: 'nh-day-date'}))).append($(div, {class: 'nh-content nh-years nh-inactive'})).append($(div, {class: 'nh-content nh-month nh-inactive'})));

        timePicker.append($('<div>', {class: 'nh-time-content',}).append($($('<div>', {
            class: 'nh-time-hours', 'data-element': 'hour'
        }))).append($($('<div>', {class: 'nh-time-minute', 'data-element': 'minute'}))).append($($('<div>', {
            class: 'nh-time-format', 'data-element': 'format', html: `<input value="am"><input value="pm">`,
        }))).append($($('<div>', {class: 'nh-time-selector'}))));

        let field, fieldClasses = '', exception;
        $.each(elements, function (index, element) {
            field = $('<input>', {
                type: 'text',
                'data-type': $(element).attr('type'),
                class: $(element).attr('class') + ' nh-picker-field-' + index,
                name: $(element).attr('name'),
                id: $(element).attr('id'),
                value: $(element).attr('value'),
                placeholder: $(element).attr('placeholder'),
                'data-nh-name': $(element).attr('name'),
                'data-nh-date-format': $(element).data('nhDateFormat'),
                'data-nh-today': $(element).data('nhToday'),
                'data-nh-min-date': $(element).data('nhMinDate'),
                'data-nh-max-date': $(element).data('nhMaxDate'),
                'data-nh-date-range': $(element).data('nhDateRange'),
                'data-nh-time-format': $(element).data('nhTimeFormat'),
            });

            let comma = ',', fieldClasses = $(field).attr('class').split(/\s+/), singleElementClass = '';
            let i = 0;
            if ((index + 1) >= elements.length) {
                comma = '';
            }
            for (i; i < fieldClasses.length; i++) {
                singleElementClass += '.' + fieldClasses[i];
            }
            createClass(singleElementClass, comma);
            $(element).replaceWith(field);
        })

        function createClass(singleElementClass, comma) {
            fieldClasses += singleElementClass + comma;
        }

        let fieldClassesArray = fieldClasses.split(',');

        $(fieldClasses).click(function () {
            let pickerActiveClass = $(this).attr('class').split(/\s+/),
                format = $(this).data('nhDateFormat') ?? formatOp, todayActive = $(this).data('nhToday') ?? todayOp,
                pickerType = $(this).data('type') === 'date' || $(this).data('type') === 'time' ? $(this).data('type') : typeOp === 'date' || typeOp === 'time' ? typeOp : 'date',
                dateRange = $(this).data('nhDateRange') ?? dateRangeOp;

            // date picker
            if (pickerType === 'date') {
                if (open === false) {
                    exception = '';
                    for (let i = 0; i < pickerActiveClass.length; i++) {
                        exception += '.' + pickerActiveClass[i];
                    }

                    if (todayActive) {
                        $(calendar).children('.nh-today-section').remove();
                        calendar.append($($('<div>', {class: 'nh-today-section'})).append('<button>Today</button>'))
                    } else {
                        $(calendar).children('.nh-today-section').remove();
                    }

                    $(body).append(picker);

                    const daysNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                    let thisDate = $(this).val();

                    let cuDate = new Date(), cuYear = cuDate.getFullYear(), cuMonth = cuDate.getMonth(),
                        today = cuDate.getDate();

                    if (thisDate) {
                        cuDate = dateInitialize($(this).val(), format);
                        cuYear = cuDate.getFullYear();
                        cuMonth = cuDate.getMonth();
                        today = cuDate.getDate();
                    }

                    let header = $('.nh-calendar-header'), cuMonthYear = $('.nh-current-month-year'),
                        content = $('.nh-content'), yearSection = $('.nh-years'), monthSection = $('.nh-month'),
                        headerText = $('.nh-header-content-text'), headerContent = $('.nh-header-content'),
                        nextPevMonth = $('.nh-next-month,.nh-prev-month');

                    $('.nh-day-names').empty()
                    $.each(daysNames, function (index, name) {
                        $('.nh-day-names').append($('<span>', {text: name}));
                    });

                    let maxDate = $(this).data('nhMaxDate') ? dateInitialize($(this).data('nhMaxDate'), format) : dateInitialize(maxDateOp, format),
                        minDate = $(this).data('nhMinDate') ? dateInitialize($(this).data('nhMinDate'), format) : dateInitialize(minDateOp, format);

                    $(cuMonthYear).children('button:first').click(function () {
                        contentShowing($(monthSection), 'month');
                    })

                    $(cuMonthYear).children('button:nth-child(2)').click(function () {
                        contentShowing($(yearSection), 'year')
                    })

                    $('.nh-today-section button').click(function () {
                        let todayDate = addZero(cuDate.getDate()), todayMonth = addZero(cuDate.getMonth() + 1);
                        $(exception).val(dateFormating(todayDate, todayMonth, cuDate.getFullYear()));
                        pickerClose();
                    })

                    let previewButton = $('.nh-prev-month'), nextButton = $('.nh-next-month');

                    calenderShowing(cuDate, cuYear, cuMonth, today, maxDate ?? null, minDate ?? null, 'start');

                    function calenderShowing(date, year, month, day, mxLast = null, mnLast = null, start = null) {
                        $(content).removeClass('nh-active').addClass('nh-inactive');
                        $('.nh-calendar-days').removeClass('nh-inactive').addClass('nh-active');
                        $(headerContent).show();
                        $(headerText).removeClass('nh-active').addClass('nh-inactive');
                        $(header).css('grid-template-columns', 'repeat(3, auto');

                        function getDaysInMonth(year, month) {
                            let next = new Date(year, month + 1, 1), last = new Date(next - 1);
                            return last.getDate();
                        }

                        function getDayOfWeek(year, month) {
                            return new Date(year, month, 1).getDay() + 1;
                        }

                        let days = getDaysInMonth(year, month), dayNumber = getDayOfWeek(year, month),
                            dayDate = $('.nh-day-date'), previousMonth = getDaysInMonth(year, (month - 1)),
                            previousMonthDate = (previousMonth - (dayNumber - 2)),
                            nextMonthDays = 42 - (days + (dayNumber - 1));


                        $(cuMonthYear).children('button:first').text(months[month])
                        $(cuMonthYear).children('button:nth-child(2)').text(year)
                        $(nextPevMonth).removeClass('inactive');
                        $(dayDate).empty();

                        for (let i = previousMonthDate; i <= previousMonth; i++) {
                            $(dayDate).append($('<span>', {text: i, class: 'nh-previous-days'}));
                        }

                        for (let i = 1; i <= days; i++) {
                            if (mnLast && i < mnLast && !start || start && mnLast && mnLast.getMonth() >= month && mnLast.getFullYear() >= year && i < mnLast.getDate()) {
                                $(previewButton).addClass('inactive');
                                $(dayDate).append($('<span>', {'data-value': i, text: i, class: 'nh-current-disable'}));
                            } else if (mxLast && i > mxLast && !start || start && mxLast && mxLast.getMonth() <= month && mxLast.getFullYear() <= year && i > mxLast.getDate()) {
                                $(nextButton).addClass('inactive');
                                $(dayDate).append($('<span>', {'data-value': i, text: i, class: 'nh-current-disable'}));
                            } else {
                                if (rangeA.hasOwnProperty('dateB')) {
                                    let rangeADateB = new Date(rangeA['dateB'].year, rangeA['dateB'].month - 1, parseInt(rangeA['dateB'].date)),
                                        thisDate = new Date(year, month, i),
                                        rangeADateA = new Date(rangeA['dateA'].year, rangeA['dateA'].month - 1, parseInt(rangeA['dateA'].date));
                                    if (thisDate >= rangeADateA && thisDate <= rangeADateB) {
                                        $(dayDate).append($('<span>', {
                                            'data-value': i, text: i, class: 'nh-current nh-span-active'
                                        }));
                                    } else {
                                        $(dayDate).append($('<span>', {'data-value': i, text: i, class: 'nh-current'}));
                                    }
                                } else {
                                    $(dayDate).append($('<span>', {'data-value': i, text: i, class: 'nh-current'}));
                                }
                            }
                        }

                        for (let i = 1; i <= nextMonthDays; i++) {
                            $(dayDate).append($('<span>', {text: i, class: 'nh-next-days'}));
                        }

                        if (cuDate.getMonth() === month && cuDate.getFullYear() === year) $(dayDate).children(`span:nth-child(${day + (dayNumber - 1)})`).addClass('nh-span-active');

                        if (rangeA.hasOwnProperty('dateB') && rangeA.hasOwnProperty('dateA')) {
                            let rangeADate = new Date(rangeA['dateA'].year, rangeA['dateA'].month - 1, parseInt(rangeA['dateA'].date)),
                                rangeBDate = new Date(rangeA['dateB'].year, rangeA['dateB'].month - 1, parseInt(rangeA['dateB'].date));
                            $(dayDate).children('span.nh-current').each(function (index, element) {
                                let elementDate = new Date(year, month, $(element).data('value'));
                                if (elementDate >= rangeADate && elementDate <= rangeBDate) {
                                    $(element).addClass('nh-span-active');
                                } else {
                                    $(element).removeClass('nh-span-active');
                                }
                            })
                        } else if (rangeA.hasOwnProperty('dateA') && Number(rangeA['dateA'].month) - 1 === month && rangeA['dateA'].year === year) {
                            $(dayDate).children(`span:nth-child(${(Number(rangeA['dateA'].date) + (dayNumber - 1))})`).addClass('nh-span-active');
                        }
                        let object = {};
                        $(dayDate).children('span.nh-current').hover(function () {
                            if (rangeA.hasOwnProperty('dateA')) {
                                let rangeADate = new Date(rangeA['dateA'].year, rangeA['dateA'].month - 1, parseInt(rangeA['dateA'].date)),
                                    touchDate = new Date(year, month, $(this).data('value'));
                                let selectedDate = addZero($(this).data('value')), selectedMonth = addZero(month + 1);
                                if (touchDate !== rangeADate) {
                                    $(dayDate).children('span.nh-current').each(function (index, element) {
                                        let elementDate = new Date(year, month, $(element).data('value'));
                                        if (elementDate >= rangeADate && elementDate <= touchDate) {
                                            $(element).addClass('nh-span-active');
                                            rangeA['dateB'] = {
                                                month: selectedMonth, date: selectedDate, year: year
                                            };
                                        } else {
                                            $(element).removeClass('nh-span-active');
                                            $(dayDate).children(`span:nth-child(${(Number(rangeA['dateA'].date) + (dayNumber - 1))})`).addClass('nh-span-active');
                                        }
                                    })
                                }
                            }
                        })

                        $(dayDate).children('span.nh-current').click(function () {
                            let selectedDate = addZero($(this).data('value')), selectedMonth = addZero(month + 1);
                            if (dateRange === true) {
                                let dateDataA = {
                                    month: selectedMonth, date: selectedDate, year: year
                                };
                                if (!rangeA.hasOwnProperty('dateA')) {
                                    $(this).addClass('nh-span-active');
                                    rangeA['dateA'] = dateDataA;
                                } else {
                                    let rangeName = $(exception).data('nhName') ?? 'range';
                                    $(exception).attr('name', '');
                                    $(exception).siblings('.nh-date-range-inputs').remove();
                                    $(exception).parent().append($('<div>', {class: 'nh-date-range-inputs'}).append($('<input>', {
                                        type: 'hidden',
                                        name: rangeName + '[from]',
                                        value: `${dateFormating(rangeA['dateA'].date, rangeA['dateA'].month, rangeA['dateA'].year)}`
                                    })).append($('<input>', {
                                        type: 'hidden',
                                        name: rangeName + '[to]',
                                        value: `${dateFormating(selectedDate, selectedMonth, year)}`
                                    })));

                                    $(exception).val(dateFormating(rangeA['dateA'].date, rangeA['dateA'].month, rangeA['dateA'].year) + ' to ' + dateFormating(selectedDate, selectedMonth, year))
                                    pickerClose();
                                }
                            } else {
                                $(exception).val(dateFormating(selectedDate, selectedMonth, year));
                                pickerClose();
                            }
                        });
                    }

                    function dateFormating(selectedDate, selectedMonth, selectedYear) {
                        let value;
                        let data = {
                            dd: selectedDate, mm: selectedMonth, yyyy: selectedYear
                        };

                        let expression = new RegExp(Object.keys(data).join("|"), "gi");

                        value = format.replace(expression, function (matched) {
                            return data[matched];
                        });
                        return value;
                    }

                    function yearsShowing(from, year = null, mxYear = null, mnYear = null) {
                        let fromYear, toYear;
                        $(cuMonthYear).hide();
                        yearSection.empty();
                        if (from === 'current') {
                            fromYear = year - 14;
                            toYear = year + 15;
                            yearShow(fromYear, toYear)
                        } else {
                            toYear = from + 29;
                            yearShow(from, toYear)
                        }

                        $(nextPevMonth).removeClass('inactive');
                        if (mxYear && toYear >= mxYear.getFullYear()) {
                            $(nextButton).addClass('inactive');
                        }

                        if (mnYear && fromYear <= mnYear.getFullYear() || from <= mnYear.getFullYear()) {
                            $(previewButton).addClass('inactive');
                        }

                        function yearShow(fromYear, toYear) {
                            for (let i = fromYear; i <= toYear; i++) {
                                if (mxYear && i > mxYear.getFullYear()) {
                                    $(yearSection).append($('<span>', {
                                        'data-value': i, text: i, class: 'nh-current-disable'
                                    }));
                                } else if (mnYear && i < mnYear.getFullYear()) {
                                    $(yearSection).append($('<span>', {
                                        'data-value': i, text: i, class: 'nh-current-disable'
                                    }));
                                } else {
                                    $(yearSection).append($('<span>', {
                                        'data-value': i, text: i, class: 'nh-year-valid'
                                    }));
                                }
                            }
                            $('span[data-value="' + cuDate.getFullYear() + '"]').addClass('nh-span-active');
                        }

                        $(yearSection).children('span.nh-year-valid').click(function () {
                            let year = $(this).data('value');
                            cuYear = year;
                            contentShowing($(monthSection), 'month', year)
                        });
                    }

                    let mxLast = null, mnLast = null;
                    $(previewButton).click(function () {
                        if (!$(this).hasClass('inactive')) {
                            if ($(yearSection).hasClass('nh-active')) {
                                let currentFirst = $('.nh-years.nh-active').children('span:first').data('value');
                                yearsShowing(currentFirst - 30, null, maxDate ?? null, minDate ?? null);
                            } else if ($('.nh-calendar-days').hasClass('nh-active')) {
                                --cuMonth
                                if (cuMonth < 0) {
                                    cuMonth = 11;
                                    cuYear -= 1;
                                }
                                if (minDate && minDate.getMonth() >= cuMonth && minDate.getFullYear() >= cuYear) {
                                    $(this).addClass('inactive');
                                    mnLast = minDate.getDate();
                                } else {
                                    $(this).removeClass('inactive');
                                    mnLast = null;
                                }
                                if (maxDate && maxDate.getMonth() > cuMonth && maxDate.getFullYear() >= cuYear) {
                                    $(nextButton).removeClass('inactive');
                                }

                                calenderShowing(cuDate, cuYear, cuMonth, today, null, mnLast)
                            }
                        }
                    })

                    $(nextButton).click(function () {
                        if (!$(this).hasClass('inactive')) {
                            if ($(yearSection).hasClass('nh-active')) {
                                let currentFirst = $('.nh-years.nh-active').children('span:last').data('value');
                                yearsShowing(currentFirst + 1, null, maxDate ?? null, minDate ?? null);
                            } else if ($('.nh-calendar-days').hasClass('nh-active')) {
                                ++cuMonth
                                if (cuMonth >= 12) {
                                    cuMonth = 0;
                                    cuYear += 1;
                                }
                                if (maxDate && maxDate.getMonth() <= cuMonth && maxDate.getFullYear() <= cuYear) {
                                    $(this).addClass('inactive');
                                    mxLast = maxDate.getDate();
                                } else {
                                    $(this).removeClass('inactive');
                                    mxLast = null;
                                }
                                if (minDate && minDate.getMonth() < cuMonth && minDate.getFullYear() <= cuYear) {
                                    $(previewButton).removeClass('inactive');
                                }

                                calenderShowing(cuDate, cuYear, cuMonth, today, mxLast)
                            }
                        }
                    })

                    function contentShowing(target, name = null, year = null) {
                        $(content).removeClass('nh-active').addClass('nh-inactive');
                        $(target).removeClass('nh-inactive').addClass('nh-active');
                        $(headerText).removeClass('nh-inactive').text(name);

                        if (name === 'month') {
                            $(monthSection).empty();
                            $.each(months, function (index, name) {
                                if (maxDate && cuYear === maxDate.getFullYear() && index >= maxDate.getMonth()) {
                                    $(monthSection).append($('<span>', {
                                        'data-value': index, text: name.substring(0, 3), class: 'nh-current-disable'
                                    }));
                                } else if (minDate && cuYear === minDate.getFullYear() && index <= minDate.getMonth()) {
                                    $(monthSection).append($('<span>', {
                                        'data-value': index, text: name.substring(0, 3), class: 'nh-current-disable'
                                    }));
                                } else {
                                    $(monthSection).append($('<span>', {
                                        'data-value': index, text: name.substring(0, 3), class: 'nh-month-valid'
                                    }));
                                }
                            });

                            $(headerContent).hide();
                            $(header).css('grid-template-columns', 'repeat(1, 100%)');
                        }

                        if (name === 'year') {
                            $(headerContent).show();
                            $(cuMonthYear).hide();
                            yearsShowing('current', cuYear, maxDate ?? null, minDate ?? null);
                        }

                        $(monthSection).children('span.nh-month-valid').click(function () {
                            let month = $(this).data('value');
                            cuMonth = month;
                            calenderShowing(cuDate, cuYear, month, today)
                        });
                    }

                    function dateInitialize(dateValue, formatValue) {
                        if (dateValue) {
                            let date = dateValue.split(/[^a-zA-Z0-9]+/), format = formatValue.split(/[^a-zA-Z0-9]+/);
                            let pDate, pMonth, pYear;
                            format.forEach(function (data, index) {
                                if (data === 'dd') {
                                    pDate = parseInt(date[index]);
                                }
                                if (data === 'mm') {
                                    if (months.includes(capitalizeWords(date[index]))) {
                                        pMonth = months.indexOf(capitalizeWords(date[index])) + 1;
                                    } else {
                                        pMonth = parseInt(date[index]);
                                    }
                                }
                                if (data === 'yyyy') {
                                    pYear = parseInt(date[index]);
                                }
                            });

                            return new Date(pYear, pMonth - 1, pDate);
                        }
                        return null
                    }

                    function capitalizeWords(str) {
                        return str.replace(/\b\w/g, function (char) {
                            return char.toUpperCase();
                        });
                    }

                    let thisElement = this;
                    pickerPositioning(picker, thisElement);

                    $(body).find('*').on('scroll', function () {
                        pickerPositioning(picker, thisElement);
                    });

                    $(window).on('scroll', function () {
                        pickerPositioning(picker, thisElement);
                    });

                    open = true;
                } else {
                    pickerClose();
                }
            }

            // time picker
            if (pickerType === 'time') {
                if (open === false) {
                    exception = '';
                    for (let i = 0; i < pickerActiveClass.length; i++) {
                        exception += '.' + pickerActiveClass[i];
                    }

                    let timeFormat = $(this).data('nhTimeFormat') ?? timeFormatOp;

                    let cuTime = new Date(), cuHr = cuTime.getHours(), cuMinute = cuTime.getMinutes(),
                        cuSecond = cuTime.getSeconds();

                    $(body).append($(timePicker));

                    let hourSection = $('.nh-time-hours'),
                        hmfSection = $('.nh-time-hours,.nh-time-minute,.nh-time-format'),
                        minuteSection = $('.nh-time-minute'), formatSection = $('.nh-time-format'),
                        selector = $('.nh-time-selector');
                    $(hourSection).empty();
                    $(minuteSection).empty();
                    for (let i = 1; i < 6; i++) {
                        $(hourSection).append($('<input>', {
                            class: i === 3 ? 'nh-active' : null
                        }));
                        $(minuteSection).append($('<input>', {
                            class: i === 3 ? 'nh-active' : null
                        }));
                    }

                    let meri = cuHr >= 12 ? 'pm' : 'am', hour = timeFormat === 12 ? cuHr % 12 : cuHr;
                    hour = hour ? hour : 12;
                    setTime(hour, cuMinute, meri);
                    $(formatSection).children('input').addClass('nh-inactive').removeClass('nh-active');
                    $(formatSection).children(`input[value='${meri}']`).addClass('nh-active').removeClass('nh-inactive');

                    timeSelectorShowing(hour, timeFormat, null, hourSection);
                    timeSelectorShowing(cuMinute, 60, null, minuteSection);

                    $(formatSection).show();
                    if (timeFormat === 24) {
                        $(formatSection).hide();
                    }
                    $(hmfSection).on("mousewheel", function (event) {
                        let delta = event.originalEvent.deltaY || event.originalEvent.detail,
                            value = parseInt($(this).children(`input.nh-active`).val()),
                            section = $(this).data('element'), count = section === 'hour' ? timeFormat : 60;
                        if (section === 'format') {
                            $(formatSection).children(`input`).each(function (index, element) {
                                if ($(element).hasClass('nh-active')) {
                                    $(element).removeClass('nh-active').addClass('nh-inactive');
                                } else {
                                    $(element).removeClass('nh-inactive').addClass('nh-active');
                                }
                            });
                        } else {
                            timeSelectorShowing(value, count, delta, $(this));
                        }

                        let me = $(formatSection).children(`input.nh-active`).val(),
                            hr = parseInt($(hourSection).children(`input.nh-active`).val()),
                            m = parseInt($(minuteSection).children(`input.nh-active`).val());

                        setTime(hr, m, me);
                    });


                    function timeSelectorShowing(value, count, delta = null, place = null) {
                        if (delta) {
                            if (delta > 0) {
                                value = (value % count) + 1;
                            } else {
                                value = ((value - 2 + count) % count) + 1;
                            }
                        }

                        $(place).children(`input.nh-active`).val(value === 24 ? 0 : value);

                        let values = {
                            'v1': (((value - 3 + count) % count) + 1) === 24 ? 0 : (((value - 3 + count) % count) + 1),
                            'v2': (((value - 2 + count) % count) + 1) === 24 ? 0 : (((value - 2 + count) % count) + 1),
                            'v4': ((value % count) + 1) === 24 ? 0 : ((value % count) + 1),
                            'v5': ((value % count) + 2) > count ? 1 : ((value % count) + 2) === 24 ? 0 : ((value % count) + 2),
                        }

                        for (let i = 1; i < 6; i++) {
                            if (i !== 3) {
                                let data = values['v' + i];
                                $(place).children(`input:nth-child(${i})`).val(data);
                            }
                        }
                    }

                    function setTime(hr, m, me) {
                        me = timeFormat === 24 ? '' : ':' + me;
                        $(exception).val(`${addZero(hr)}:${addZero(m)}${me}`)
                    }

                    let thisElement = this;
                    pickerPositioning(timePicker, thisElement);
                    open = true;
                } else {
                    pickerClose();
                }
            }
        });

        $(document).on('click', function (event) {
            let target = $(event.target), targetClassAll = '';

            if (target.attr('class')) {
                let targetClass = target.attr('class').split(/\s+/);
                for (let i = 0; i < targetClass.length; i++) {
                    targetClassAll += '.' + targetClass[i];
                }
            }

            if (!target.closest('.nh-picker,.nh-time-picker').length && !target.is(exception)) {
                pickerClose();
                if (targetClassAll && fieldClassesArray.includes(targetClassAll)) {
                    $(targetClassAll).click();
                }
            }
        });

        $(window).resize(function () {
            pickerClose();
        });

        function addZero(number) {
            return String(number).padStart(2, '0');
        }

        function pickerPositioning(picker, thisElement) {
            let pickerWidth = $(picker).outerWidth(), pickerHeight = $(picker).outerHeight();

            let bodyWidth = $(document.body).width(), bodyHeight = $(document.body).height();

            let left = $(thisElement).offset().left, width = $(thisElement).outerWidth(),
                right = (bodyWidth - (width + left)), height = $(thisElement).outerHeight(),
                top = $(thisElement).offset().top, topPosition;

            let leftCut = ((pickerWidth - width) / 2), leftPosition = left;
            if (left > leftCut) {
                leftPosition = left - leftCut;
            }
            if (right < leftCut) {
                leftPosition = left - (leftCut * 2);
            }

            if ((bodyHeight - top) < (pickerHeight + 100)) {
                $(picker).addClass('before-bottom').removeClass('before-top');
                topPosition = top - (pickerHeight + 12);
            } else {
                $(picker).addClass('before-top').removeClass('before-bottom')
                topPosition = (top + height + 12)
            }

            if (top < 0 || (bodyHeight - top) < 0 || $(thisElement).position().top < 0 || (bodyHeight - $(thisElement).position().top) < 0) {
                pickerClose()
            }

            $(picker).css({
                left: leftPosition, top: topPosition,
            })
        }

        function pickerClose() {
            $('.nh-next-month,.nh-prev-month').removeClass('inactive');
            $(picker).remove();
            $(timePicker).remove();
            rangeA = [];
            open = false;
        }
    }
})
