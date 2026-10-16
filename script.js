// script.js

document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");

    // Если мы не на странице записи — календарь не запускаем.
    if (!calendar) return;

    const monthTitle = document.getElementById("monthTitle");
    const selectedDateText = document.getElementById("selectedDate");
    const signupButton = document.getElementById("signupButton");

    const prevMonthButton = document.getElementById("prevMonth");
    const nextMonthButton = document.getElementById("nextMonth");

    const modal = document.getElementById("successModal");
    const closeModal = document.getElementById("closeModal");
    const modalButton = document.getElementById("modalButton");

    const today = new Date();

    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let selectedDate = null;

    const monthNames = [
        "январь",
        "февраль",
        "март",
        "апрель",
        "май",
        "июнь",
        "июль",
        "август",
        "сентябрь",
        "октябрь",
        "ноябрь",
        "декабрь"
    ];

    const dayNames = [
        "воскресенье",
        "понедельник",
        "вторник",
        "среда",
        "четверг",
        "пятница",
        "суббота"
    ];

    function isToday(date) {
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }

    function isPast(date) {
        const currentDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        return date < currentDay;
    }

    function formatDate(date) {
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }

    function renderCalendar() {
        calendar.innerHTML = "";

        monthTitle.textContent =
            `${monthNames[currentMonth]} ${currentYear}`;

        // Первый день месяца.
        // JS считает воскресенье первым днём недели,
        // поэтому преобразуем в формат ПН → ВС.
        const firstDay = new Date(currentYear, currentMonth, 1);
        let startDay = firstDay.getDay();

        startDay = startDay === 0 ? 6 : startDay - 1;

        // Количество дней в текущем месяце.
        const daysInMonth = new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();

        // Пустые клетки перед первым числом.
        for (let i = 0; i < startDay; i++) {
            const emptyDay = document.createElement("button");
            emptyDay.className = "day empty";
            emptyDay.type = "button";
            emptyDay.disabled = true;
            calendar.appendChild(emptyDay);
        }

        // Дни месяца.
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(
                currentYear,
                currentMonth,
                day
            );

            const dayButton = document.createElement("button");

            dayButton.type = "button";
            dayButton.className = "day";
            dayButton.textContent = day;

            // Прошедшие даты недоступны.
            if (isPast(date)) {
                dayButton.classList.add("disabled");
                dayButton.disabled = true;
            }

            // Сегодня.
            if (isToday(date)) {
                dayButton.classList.add("today");
            }

            // Ранее выбранная дата.
            if (
                selectedDate &&
                date.getTime() === selectedDate.getTime()
            ) {
                dayButton.classList.add("selected");
            }

            dayButton.addEventListener("click", () => {
                if (isPast(date)) return;

                selectedDate = date;

                selectedDateText.textContent =
                    `Вы выбрали: ${formatDate(date)}`;

                signupButton.disabled = false;

                renderCalendar();
            });

            calendar.appendChild(dayButton);
        }

        // Заполняем оставшиеся клетки, чтобы календарь
        // всегда имел правильную сетку.
        const totalCells = startDay + daysInMonth;
        const remainingCells = (7 - (totalCells % 7)) % 7;

        for (let i = 0; i < remainingCells; i++) {
            const emptyDay = document.createElement("button");
            emptyDay.className = "day empty";
            emptyDay.type = "button";
            emptyDay.disabled = true;
            calendar.appendChild(emptyDay);
        }

        // Нельзя уйти в прошлые месяцы.
        const isCurrentMonth =
            currentYear === today.getFullYear() &&
            currentMonth === today.getMonth();

        prevMonthButton.disabled = isCurrentMonth;
        prevMonthButton.style.opacity = isCurrentMonth ? "0.25" : "1";
    }

    prevMonthButton.addEventListener("click", () => {
        if (
            currentYear === today.getFullYear() &&
            currentMonth === today.getMonth()
        ) {
            return;
        }

        currentMonth--;

        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }

        renderCalendar();
    });

    nextMonthButton.addEventListener("click", () => {
        currentMonth++;

        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }

        renderCalendar();
    });

    signupButton.disabled = true;

    signupButton.addEventListener("click", () => {
        if (!selectedDate) {
            return;
        }

        modal.classList.add("show");
        document.body.style.overflow = "hidden";
    });

    function hideModal() {
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }

    closeModal.addEventListener("click", hideModal);
    modalButton.addEventListener("click", hideModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("show")) {
            hideModal();
        }
    });

    renderCalendar();
});