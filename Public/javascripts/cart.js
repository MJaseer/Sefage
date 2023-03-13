

document.querySelector("#paymentForm").addEventListener("submit", (e) => {
    e.preventDefault();

    let total = document.getElementById("sum").innerHTML;
    const coupon = document.getElementById('couponCode').value;
    const carId = document.getElementById('carId').value;
    const count = document.getElementById('count1').value;


    fetch("/product/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ count, carId, coupon, total }),
    })
        .then((response) => response.json())
        .then((order) => {
            toString(order)
            console.log(JSON.stringify(order));
            if (order.success) {
                let options = {
                    key: "rzp_test_C9okbWzHpHQQPA",
                    name: "Sefage Car",
                    amount: order.amount * 100,
                    order_id: order.order.id,
                    currency: "INR",
                    description: "Test Transaction",
                    image: "/images/logo2.png",
                    handler: function (response) {
                        verifyPayment(response, order);
                    },
                    prefill: {
                        name: "Muhammed Jaseer",
                        email: "mjaseer43@gmail.com",
                        contact: "9876543210"
                    },
                    notes: {
                        address: "Razorpay Corporate Office"
                    },
                    theme: {
                        color: "#808080"
                    }
                };
                var rzp1 = new Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    console.log("paymentfialed");
                });
                rzp1.open();
            }else{
                console.log(order.msg);
                swal.fire({
                    title: "Booking Failed",
                    text: `${order.msg}`,
                    icon: "warning",
                    button: "Okay",
                })
            }
        })
        .catch((error) => {
            console.error("Failed to apply coupon:" + error);
            swal.fire({
                title: "Booking Failed",
                text: `${error}`,
                icon: "warning",
                button: "Okay",
            })
        });
});


function verifyPayment(response, order) {
    console.log(response + order);
    fetch("/verifyPayment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            response,
            order,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.success) {
                swal.fire({
                    title: "Order Placed Successfully!",
                    text: `Your order has been placed successfully! Your order id is ${data.orderId}`,
                    icon: "success",
                    button: "Okay",
                })
                window.location.href = "/myOrders"
            } else {
                swal.fire({
                    title: "Order Failed!",
                    text: `Your order placement has been failed !! Please try again later`,
                    icon: "warning",
                    button: "Okay",
                })
            }
        })
        .catch((error) => {
            console.error("Failed to verify payment:" + error);
        });
}