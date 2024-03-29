$.fn.extend({
    picker: function (options = {}) {
        let body = $('body'), elements = $(this), div = '<div>', span = '<span>', picker = $(div, {class: 'nh-picker'}),
            calendar = $(div, {class: 'nh-datepicker-calendar'}), headerSection = $(div, {class: 'nh-calendar-header'}),
            open = false, formatOp = options.format ?? 'dd/mm/yyyy';
        headerSection.append($(span, {
            class: 'nh-header-content nh-prev-month', html: '&lt;'
        })).append($(span, {class: 'nh-header-content nh-current-month-year',}).append('<button></button>  <button></button>')).append($(span, {class: 'nh-header-content-text nh-next-month nh-inactive'})).append($(span, {
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
            });

            let comma = ',', fieldClasses = $(field).attr('class').split(" "), singleElementClass = '';
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
            let pickerActiveClass = $(this).attr('class').split(" "), format = $(this).data('nhDateFormat') ?? formatOp;
            console.log($(this).data('nhDateFormat') ?? format)

            if (open === false) {
                exception = '';
                for (let i = 0; i < pickerActiveClass.length; i++) {
                    exception += '.' + pickerActiveClass[i];
                }

                $(body).append(picker);
                let pickerWidth = $(picker).outerWidth();

                let bodyWidth = $(document.body).width();

                let left = $(this).position().left, width = $(this).outerWidth(), right = (bodyWidth - (width + left)),
                    height = $(this).outerHeight(), top = $(this).offset().top;

                let leftCut = ((pickerWidth - width) / 2), leftPosition = left;
                if (left > leftCut) {
                    leftPosition = left - leftCut;
                }
                if (right < leftCut) {
                    leftPosition = left - (leftCut * 2);
                }

                $(picker).css({
                    left: leftPosition, top: top + height + 12,
                })

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

                $(monthSection).empty();
                $.each(months, function (index, name) {
                    $(monthSection).append($('<span>', {'data-value': index, text: name}));
                });

                $(cuMonthYear).children('button:first').click(function () {
                    contentShowing($(monthSection), 'month');
                })

                $(cuMonthYear).children('button:nth-child(2)').click(function () {
                    contentShowing($(yearSection), 'year')
                })

                calenderShowing(cuDate, cuYear, cuMonth, today);

                function calenderShowing(date, year, month, day) {
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

                    $(dayDate).empty();

                    for (let i = previousMonthDate; i <= previousMonth; i++) {
                        $(dayDate).append($('<span>', {text: i, class: 'nh-previous-days'}));
                    }

                    for (let i = 1; i <= days; i++) {
                        $(dayDate).append($('<span>', {'data-value': i, text: i, class: 'nh-current'}));
                    }

                    for (let i = 1; i <= nextMonthDays; i++) {
                        $(dayDate).append($('<span>', {text: i, class: 'nh-next-days'}));
                    }
                    // $(dayDate).children('span:first').css('grid-column', dayNumber);

                    if (new Date().getMonth() === month && new Date().getFullYear() === year) $(dayDate).children(`span:nth-child(${day + (dayNumber - 1)})`).addClass('nh-span-active');

                    $(dayDate).children('span.nh-current').click(function () {
                        let value, selectedDate = addZero($(this).data('value')), selectedMonth = addZero(month + 1);
                        let data = {
                            dd: selectedDate, mm: selectedMonth, yyyy: year
                        };

                        let expression = new RegExp(Object.keys(data).join("|"), "gi");

                        value = format.replace(expression, function (matched) {
                            return data[matched];
                        });

                        $(exception).val(value);
                        close();
                    });
                }

                function yearsShowing(from, year = null) {
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

                    function yearShow(fromYear, toYear) {
                        for (let i = fromYear; i <= toYear; i++) {
                            if (new Date().getFullYear() === i) {
                                $(yearSection).append($('<span>', {'data-value': i, text: i, class: 'nh-span-active'}));
                            } else {
                                $(yearSection).append($('<span>', {'data-value': i, text: i}));
                            }
                        }
                    }

                    $(yearSection).children('span').click(function () {
                        let year = $(this).data('value');
                        cuYear = year;
                        contentShowing($(monthSection), 'month', year)
                    });
                }

                $('.nh-prev-month').click(function () {
                    if ($(yearSection).hasClass('nh-active')) {
                        let currentFirst = $('.nh-years.nh-active').children('span:first').data('value');
                        yearsShowing(currentFirst - 30)
                    } else if ($('.nh-calendar-days').hasClass('nh-active')) {
                        --cuMonth
                        if (cuMonth < 0) {
                            cuMonth = 11;
                            cuYear -= 1;
                        }
                        calenderShowing(cuDate, cuYear, cuMonth, today)
                    }
                })

                $('.nh-next-month').click(function () {
                    if ($(yearSection).hasClass('nh-active')) {
                        let currentFirst = $('.nh-years.nh-active').children('span:last').data('value');
                        yearsShowing(currentFirst + 1)
                    } else if ($('.nh-calendar-days').hasClass('nh-active')) {
                        ++cuMonth
                        if (cuMonth >= 12) {
                            cuMonth = 0;
                            cuYear += 1;
                        }
                        calenderShowing(cuDate, cuYear, cuMonth, today)
                    }
                })

                function contentShowing(target, name = null, year = null) {
                    $(content).removeClass('nh-active').addClass('nh-inactive');
                    $(target).removeClass('nh-inactive').addClass('nh-active');
                    $('.nh-header-content-text').removeClass('nh-inactive').text(name);

                    if (name === 'month') {
                        $('.nh-header-content').hide();
                        $(header).css('grid-template-columns', 'repeat(1, 100%)');
                    }

                    if (name === 'year') {
                        $('.nh-header-content').show();
                        $(cuMonthYear).hide();
                        yearsShowing('current', cuYear);
                    }

                    $(monthSection).children('span').click(function () {
                        let month = $(this).data('value');
                        cuMonth = month;
                        calenderShowing(cuDate, cuYear, month, today)
                    });
                }

                open = true;
            } else {
                close();
            }

            $(document).on('click', function (event) {
                let target = $(event.target), targetClassAll = '';

                if (target.attr('class')) {
                    let targetClass = target.attr('class').split(" ");
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

        function addZero(number) {
            return String(number).padStart(2, '0');
        }

        function close() {
            $(picker).remove();
            open = false;
        }
    }
})