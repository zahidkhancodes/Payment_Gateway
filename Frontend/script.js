async function payNow() {
  const amountInput = document.getElementById("amountInput").value;
  const amount = parseInt(amountInput);

  if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
  }

  try {
      const res = await fetch("https://payment-gateway-vetl.onrender.com/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const data = await res.json();
      const order = data.order;

      const options = {
      key: "rzp_test_SpgGu65LMxKVsx",
      amount: order.amount,
      currency: "INR",
      name: "Payment Gateway",
      description: "Test Payment",
      order_id: order.id,

      handler: async function (response) {
          try {
              const verifyRes = await fetch("https://payment-gateway-vetl.onrender.com/verify-payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: amount,
                  }),
              });

              const statusDiv = document.getElementById("status");
              if (verifyRes.ok) {
                  statusDiv.textContent = "Payment Successful!";
                  statusDiv.className = "status success";
              } else {
                  statusDiv.textContent = "Payment Failed!";
                  statusDiv.className = "status failed";
              }
          } catch (error) {
              console.error("Verification error:", error);
              const statusDiv = document.getElementById("status");
              statusDiv.textContent = "Payment Failed!";
              statusDiv.className = "status failed";
          }
      },
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function (response){
          const statusDiv = document.getElementById("status");
          statusDiv.textContent = "Payment Failed!";
          statusDiv.className = "status failed";
      });
      rzp.open();
  } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Could not initialize payment. Please try again later.");
  }
}
