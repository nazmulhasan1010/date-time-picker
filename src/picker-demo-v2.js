$.fn.extend({
    picker: function (options = {}) {
        let body = $('body') ?? $(window), elements = $(this), div = '<div>', span = '<span>',
            picker = $(div, {class: 'nh-picker before-top'}),
            calendar = $(div, {class: 'nh-datepicker-calendar'}), headerSection = $(div, {class: 'nh-calendar-header'}),
            open = false, formatOp = options.format ?? 'dd/mm/yyyy', minDateOp = options.minDate ?? null,
            maxDateOp = options.maxDate ?? null, todayOp = options.today ?? false;

        headerSection.append($(span, {
            class: 'nh-header-content nh-prev-month', html: '&lt;'
        })).append($(span, {class: 'nh-header-content nh-current-month-year',}).append('<button></button>  <button></button>')).append($(span, {class: 'nh-header-content-text nh-inactive'})).append($(span, {
            class: 'nh-header-content nh-next-month', html: '&gt;'
        }));

        picker.append(calendar.append(headerSection).append($(div, {class: 'nh-content nh-calendar-days nh-active'}).append($(div, {class: 'nh-day-names'})).append($(div, {class: 'nh-day-date'}))).append($(div, {class: 'nh-content nh-years nh-inactive'})).append($(div, {class: 'nh-content nh-month nh-inactive'})));

        let field, fieldClasses = '', exception;
        $.each(elements, function (index, element) {
            field = $('<input>', {
                type: 'text',
                class: $(element).attr('class') + ' nh-picker-field-' + index,
                name: $(element).attr('name'),
                id: $(element).attr('id'),
                placeholder: $(element).attr('placeholder'),
                'data-nh-date-format': $(element).data('nhDateFormat'),
                'data-nh-today': $(element).data('nhToday'),
                'data-nh-min-date': $(element).data('nhMinDate'),
                'data-nh-max-date': $(element).data('nhMaxDate'),
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
                format = $(this).data('nhDateFormat') ?? formatOp,
                todayActive = $(this).data('nhToday') ?? todayOp;

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

                let cuDate = new Date(), cuYear = cuDate.getFullYear(), cuMonth = cuDate.getMonth(),
                    today = cuDate.getDate();

                const daysNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                let header = $('.nh-calendar-header'), cuMonthYear = $('.nh-current-month-year'),
                    content = $('.nh-content'), yearSection = $('.nh-years'), monthSection = $('.nh-month');

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
                    close();
                })

                let previewButton = $('.nh-prev-month'), nextButton = $('.nh-next-month');

                calenderShowing(cuDate, cuYear, cuMonth, today, maxDate ?? null, minDate ?? null, 'start');

                function calenderShowing(date, year, month, day, mxLast = null, mnLast = null, start = null) {
                    $(content).removeClass('nh-active').addClass('nh-inactive');
                    $('.nh-calendar-days').removeClass('nh-inactive').addClass('nh-active');
                    $('.nh-header-content').show();
                    $('.nh-header-content-text').removeClass('nh-active').addClass('nh-inactive');
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
                    $('.nh-next-month,.nh-prev-month').removeClass('inactive');
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
                            $(dayDate).append($('<span>', {'data-value': i, text: i, class: 'nh-current'}));
                        }
                    }

                    for (let i = 1; i <= nextMonthDays; i++) {
                        $(dayDate).append($('<span>', {text: i, class: 'nh-next-days'}));
                    }

                    if (cuDate.getMonth() === month && cuDate.getFullYear() === year) $(dayDate).children(`span:nth-child(${day + (dayNumber - 1)})`).addClass('nh-span-active');

                    $(dayDate).children('span.nh-current').click(function () {
                        let selectedDate = addZero($(this).data('value')), selectedMonth = addZero(month + 1);
                        $(exception).val(dateFormating(selectedDate, selectedMonth, year));
                        close();
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

                    $('.nh-next-month,.nh-prev-month').removeClass('inactive');
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
                                    'data-value': i,
                                    text: i,
                                    class: 'nh-current-disable'
                                }));
                            } else if (mnYear && i < mnYear.getFullYear()) {
                                $(yearSection).append($('<span>', {
                                    'data-value': i,
                                    text: i,
                                    class: 'nh-current-disable'
                                }));
                            } else {
                                $(yearSection).append($('<span>', {'data-value': i, text: i, class: 'nh-year-valid'}));
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
                    $('.nh-header-content-text').removeClass('nh-inactive').text(name);

                    if (name === 'month') {
                        $(monthSection).empty();
                        $.each(months, function (index, name) {
                            if (maxDate && cuYear === maxDate.getFullYear() && index >= maxDate.getMonth()) {
                                $(monthSection).append($('<span>', {
                                    'data-value': index,
                                    text: name.substring(0, 3),
                                    class: 'nh-current-disable'
                                }));
                            } else if (minDate && cuYear === minDate.getFullYear() && index <= minDate.getMonth()) {
                                $(monthSection).append($('<span>', {
                                    'data-value': index,
                                    text: name.substring(0, 3),
                                    class: 'nh-current-disable'
                                }));
                            } else {
                                $(monthSection).append($('<span>', {
                                    'data-value': index,
                                    text: name.substring(0, 3),
                                    class: 'nh-month-valid'
                                }));
                            }
                        });

                        $('.nh-header-content').hide();
                        $(header).css('grid-template-columns', 'repeat(1, 100%)');
                    }

                    if (name === 'year') {
                        $('.nh-header-content').show();
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
                        let date = dateValue.split(/[^a-zA-Z0-9]+/),
                            format = formatValue.split(/[^a-zA-Z0-9]+/);
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
                close();
            }

            $(document).on('click', function (event) {
                let target = $(event.target), targetClassAll = '';

                if (target.attr('class')) {
                    let targetClass = target.attr('class').split(/\s+/);
                    for (let i = 0; i < targetClass.length; i++) {
                        targetClassAll += '.' + targetClass[i];
                    }
                }

                if (!target.closest('.nh-picker').length && !target.is(exception)) {
                    close();

                    if (targetClassAll && fieldClassesArray.includes(targetClassAll)) {
                        $(targetClassAll).click();
                    }
                }
            });
        });

        $(window).resize(function () {
            close();
        });

        function pickerPositioning(picker, thisElement) {
            let pickerWidth = $(picker).outerWidth(), pickerHeight = $(picker).outerHeight();

            let bodyWidth = $(document.body).width(), bodyHeight = $(document.body).height();

            let left = $(thisElement).offset().left, width = $(thisElement).outerWidth(),
                right = (bodyWidth - (width + left)),
                height = $(thisElement).outerHeight(), top = $(thisElement).offset().top, topPosition;

            let leftCut = ((pickerWidth - width) / 2), leftPosition = left;
            if (left > leftCut) {
                leftPosition = left - leftCut;
            }
            if (right < leftCut) {
                leftPosition = left - (leftCut * 2);
            }

            if ((bodyHeight - top) < (pickerHeight + 100)) {
                $(picker).addClass('before-bottom').removeClass('before-top');
                topPosition = top - (pickerHeight + height + 12);
            } else {
                $(picker).addClass('before-top').removeClass('before-bottom')
                topPosition = (top + height + 12)
            }

            if (top <= 0 || (bodyHeight - top) <= 0 || $(thisElement).position().top <= 0 || (bodyHeight - $(thisElement).position().top) <= 0) {
                close();
            }
            console.log($(thisElement).position())
            $(picker).css({
                left: leftPosition, top: topPosition,
            })
        }

        function addZero(number) {
            return String(number).padStart(2, '0');
        }

        function close() {
            $('.nh-next-month,.nh-prev-month').removeClass('inactive');
            $(picker).remove();
            open = false;
        }
    }
})