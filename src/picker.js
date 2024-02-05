$.fn.extend({
    picker: function (options = {}) {
        let element = $(this),
            div = '<div>', span = '<span>',
            picker = $(div, {class: 'nh-picker'}),
            calendar = $(div, {class: 'nh-datepicker-calendar'}),
            headerSection = $(div, {class: 'nh-calendar-header'});
        headerSection.append($(span, {
            class: 'nh-header-content nh-prev-month',
            html: '&lt;'
        })).append($(span, {
            class: 'nh-header-content nh-current-month-year',
        }).append('<button></button> , <button></button>')).append($(span, {
            class: 'nh-header-content-text nh-next-month nh-inactive'
        })).append($(span, {
            class: 'nh-header-content nh-next-month',
            html: '&gt;'
        }));


        picker.append(calendar.append(headerSection).append($(div, {
            class: 'nh-content nh-calendar-days nh-active'
        }).append($(div, {
            class: 'nh-day-names'
        })).append($(div, {
            class: 'nh-day-date'
        }))).append($(div, {
            class: 'nh-content nh-years nh-inactive'
        })).append($(div, {
            class: 'nh-content nh-month nh-inactive'
        })));

        let field = $('<input>', {
            type: 'text',
            class: $(element).attr('class'),
            name: $(element).attr('name'),
            id: $(element).attr('id'),
            placeholder: $(element).attr('placeholder'),
        });

        $(element).replaceWith(field);

        $(field).focus(function () {
            $('body').append(picker);
            let left = $(this).position().left,
                width = $(this).outerWidth(),
                height = $(this).outerHeight(),
                top = $(this).offset().top + $(picker).outerHeight(),
                pickerWidth = $(picker).outerWidth();
            console.log(left, pickerWidth);

            $(picker).css({
                position: 'absolute',
                left: left,
                top: top,
            })

            let cuDate = new Date(), cuYear = cuDate.getFullYear(), cuMonth = cuDate.getMonth(),
                today = cuDate.getDate();

            const daysNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            let header = $('.nh-calendar-header'), cuMonthYear = $('.nh-current-month-year'),
                content = $('.nh-content'),
                yearSection = $('.nh-years'), monthSection = $('.nh-month');

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
                    let next = new Date(year, month + 1, 1),
                        last = new Date(next - 1);
                    return last.getDate();
                }

                function getDayOfWeek(year, month) {
                    return new Date(year, month, 1).getDay() + 1;
                }

                function getMonthNameIntl(month, locale = 'en-US') {
                    return new Intl.DateTimeFormat(locale, {month: 'long'}).format(month);
                }

                let days = getDaysInMonth(year, month), dayNumber = getDayOfWeek(year, month),
                    dayDate = $('.nh-day-date');

                $(cuMonthYear).children('button:first').text(months[month])
                $(cuMonthYear).children('button:nth-child(2)').text(year)

                $(dayDate).empty();
                for (let i = 1; i <= days; i++) {
                    $(dayDate).append($('<span>', {'data-value': i, text: i}));
                }

                $(dayDate).children('span:first').css('grid-column', dayNumber)

                if (new Date().getMonth() === month && new Date().getFullYear() === year)
                    $(dayDate).children(`span:nth-child(${day})`).addClass('nh-span-active');

                $(dayDate).children('span').click(function () {
                    let dateValue = $(this).data('value'),
                        value = `${dateValue}/${month + 1}/${year}`;
                    $(field).val(value);
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
        });

        $(field).focusout(function () {
            close();
        });

        function close() {
            $(picker).remove();
        }
    }
})