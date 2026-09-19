// ============================================
// GRANDSTAY HOTEL BOOKING SYSTEM
// ============================================


// ================= ROOM SELECTION =================

let selectedRoom = {
    name: "Deluxe Room",
    price: 3000
};


function selectRoom(radio) {

    selectedRoom =
        radio.value === "5000"
            ? {
                name: "Suite Room",
                price: 5000
            }
            : {
                name: "Deluxe Room",
                price: 3000
            };


    document.querySelectorAll(".room-option")
        .forEach(room => {
            room.classList.remove("selected");
        });


    radio.closest(".room-option")
        .classList.add("selected");


    calculateTotal();
}


// ================= CALCULATE TOTAL =================

function calculateTotal() {

    const days =
        Number(document.getElementById("days").value) || 1;

    const persons =
        Number(document.getElementById("persons").value) || 1;

    const advance =
        Number(document.getElementById("advance").value) || 0;


    // Room cost

    const roomCost =
        selectedRoom.price * days;


    // Amenities

    const ac =
        document.getElementById("ac").checked
            ? 500 * days
            : 0;


    const locker =
        document.getElementById("locker").checked
            ? 300 * days
            : 0;


    // Room capacity = 2 persons

    const extraPersons =
        Math.max(0, persons - 2);


    const extraCost =
        extraPersons * 1000 * days;


    // Total

    const total =
        roomCost +
        ac +
        locker +
        extraCost;


    // Balance

    const balance =
        Math.max(0, total - advance);


    // Update display

    document.getElementById("summaryRoom")
        .textContent =
        selectedRoom.name;


    document.getElementById("roomCalculation")
        .textContent =
        `(₹${formatNumber(selectedRoom.price)} × ${days} day${days > 1 ? "s" : ""})`;


    document.getElementById("roomCost")
        .textContent =
        formatCurrency(roomCost);


    document.getElementById("acCost")
        .textContent =
        formatCurrency(ac);


    document.getElementById("lockerCost")
        .textContent =
        formatCurrency(locker);


    document.getElementById("extraCost")
        .textContent =
        formatCurrency(extraCost);


    document.getElementById("totalCost")
        .textContent =
        formatCurrency(total);


    document.getElementById("advanceDisplay")
        .textContent =
        formatCurrency(advance);


    document.getElementById("balance")
        .textContent =
        formatCurrency(balance);
}


// ================= CONFIRM BOOKING =================

function confirmBooking() {

    const name =
        document.getElementById("customerName")
            .value.trim();


    const phone =
        document.getElementById("phone")
            .value.trim();


    const checkIn =
        document.getElementById("checkIn")
            .value;


    const days =
        Number(document.getElementById("days").value);


    const persons =
        Number(document.getElementById("persons").value);


    const advance =
        Number(document.getElementById("advance").value) || 0;


    const message =
        document.getElementById("bookingMessage");


    // Validation

    if (!name) {

        showError(
            "Please enter the guest name."
        );

        return;
    }


    if (!/^[6-9]\d{9}$/.test(phone)) {

        showError(
            "Please enter a valid 10-digit Indian mobile number."
        );

        return;
    }


    if (!checkIn) {

        showError(
            "Please select a check-in date."
        );

        return;
    }


    if (!days || days < 1) {

        showError(
            "Please enter valid total days."
        );

        return;
    }


    if (!persons || persons < 1) {

        showError(
            "Please enter the number of guests."
        );

        return;
    }


    // Calculate total

    const ac =
        document.getElementById("ac").checked
            ? 500 * days
            : 0;


    const locker =
        document.getElementById("locker").checked
            ? 300 * days
            : 0;


    const extraPersons =
        Math.max(0, persons - 2);


    const extraCost =
        extraPersons * 1000 * days;


    const roomCost =
        selectedRoom.price * days;


    const total =
        roomCost +
        ac +
        locker +
        extraCost;


    if (advance > total) {

        showError(
            "Advance amount cannot be greater than the total cost."
        );

        return;
    }


    const balance =
        total - advance;


    // Generate booking ID

    const bookingId =
        "GS" +
        new Date().getFullYear() +
        "-" +
        Math.floor(
            100000 + Math.random() * 900000
        );


    // Display confirmation

    document.getElementById("bookingId")
        .textContent =
        bookingId;


    document.getElementById("detailName")
        .textContent =
        name;


    document.getElementById("detailPhone")
        .textContent =
        phone;


    document.getElementById("detailRoom")
        .textContent =
        selectedRoom.name;


    document.getElementById("detailDate")
        .textContent =
        formatDate(checkIn);


    document.getElementById("detailDays")
        .textContent =
        days;


    document.getElementById("detailPersons")
        .textContent =
        persons;


    document.getElementById("detailTotal")
        .textContent =
        formatCurrency(total);


    document.getElementById("detailBalance")
        .textContent =
        formatCurrency(balance);


    document.getElementById("bookingDetails")
        .classList.remove("hidden");


    message.textContent =
        "Booking confirmed successfully!";


    message.className =
        "booking-message success";


    // Save booking locally

    const booking = {

        id: bookingId,

        guestName: name,

        phone: phone,

        email:
            document.getElementById("email").value.trim(),

        checkIn: checkIn,

        days: days,

        persons: persons,

        room: selectedRoom.name,

        roomPrice: selectedRoom.price,

        ac: ac,

        locker: locker,

        extraPersonCharges: extraCost,

        total: total,

        advance: advance,

        balance: balance,

        createdAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "grandstayBooking",
        JSON.stringify(booking)
    );


    // Scroll to confirmation

    document.getElementById("bookingDetails")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
}


// ================= ERROR =================

function showError(text) {

    const message =
        document.getElementById("bookingMessage");

    message.textContent = text;

    message.className =
        "booking-message error";
}


// ================= PRINT =================

function printBooking() {

    window.print();
}


// ================= SCROLL =================

function scrollToBooking() {

    document.getElementById("booking")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ================= FORMATTING =================

function formatCurrency(value) {

    return "₹" +
        Number(value).toLocaleString("en-IN");
}


function formatNumber(value) {

    return Number(value)
        .toLocaleString("en-IN");
}


function formatDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ================= PHONE INPUT =================

document.getElementById("phone")
    .addEventListener("input", function () {

        this.value =
            this.value.replace(/\D/g, "")
                .slice(0, 10);

    });


// ================= DATE =================

const today =
    new Date()
        .toISOString()
        .split("T")[0];


document.getElementById("checkIn")
    .setAttribute("min", today);


// ================= INITIAL LOAD =================

calculateTotal();