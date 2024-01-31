$.fn.extend({
    picker: function (options = {}) {
        let cuDate = new Date(), cuYear = cuDate.getFullYear(), cuMonth = cuDate.getMonth(), today = cuDate.getDate();

        const daysNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        $.each(daysNames, function (index, name) {
            $('.day-names').append($('<span>', {text: name}));
        });

        calenderShowing(cuDate, cuYear, cuMonth, today)

        function calenderShowing(date, year, month, day) {
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

            let days = getDaysInMonth(year, month), dayNumber = getDayOfWeek(year, month), dayDate = $('.day-date');

            $('.current-month-year button:first').text(months[month])
            $('.current-month-year button:nth-child(2)').text(year)

            $(dayDate).empty();
            for (let i = 1; i <= days; i++) {
                $(dayDate).append($('<span>', {'data-value': i, text: i}));
            }

            $(dayDate).children('span:first').css('grid-column', dayNumber)

            if (new Date().getMonth() === month && new Date().getFullYear() === year)
                $(dayDate).children(`span:nth-child(${day})`).css('background-color', 'green');

            $(dayDate).children('span').click(function () {
                let dateValue = $(this).data('value'),
                    value = `${dateValue}/${month + 1}/${year}`;
                console.log(value)
            });
        }

        $('.prev-month').click(function () {
            --cuMonth
            if (cuMonth < 0) {
                cuMonth = 11;
                cuYear -= 1;
            }
            calenderShowing(cuDate, cuYear, cuMonth, today)
        })

        $('.next-month').click(function () {
            ++cuMonth
            if (cuMonth >= 12) {
                cuMonth = 0;
                cuYear += 1;
            }
            calenderShowing(cuDate, cuYear, cuMonth, today)
        })
    }
})