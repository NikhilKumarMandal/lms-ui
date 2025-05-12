// import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { captureAndFinalizePaymentService } from "@/services";
// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// function PaypalPaymentReturnPage() {
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const paymentId = params.get("paymentId");
//   const payerId = params.get("PayerID");

//   useEffect(() => {
//     if (paymentId && payerId) {
//       async function capturePayment() {
//         const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

//         const response = await captureAndFinalizePaymentService(
//           paymentId,
//           payerId,
//           orderId
//         );

//         if (response?.success) {
//           sessionStorage.removeItem("currentOrderId");
//           window.location.href = "/student-courses";
//         }
//       }

//       capturePayment();
//     }
//   }, [payerId, paymentId]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Processing payment... Please wait</CardTitle>
//       </CardHeader>
//     </Card>
//   );
// }

// export default PaypalPaymentReturnPage;

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PaypalPaymentReturnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingMessage, setLoadingMessage] = useState("Processing payment... Please wait");

  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      if (!orderId) {
        setLoadingMessage("Invalid session. Please try again.");
        return;
      }

      async function capturePayment() {
        try {
          const response = await captureAndFinalizePaymentService(paymentId, payerId, orderId);

          if (response?.success) {
            sessionStorage.removeItem("currentOrderId");
            navigate("/student-courses");
          } else {
            setLoadingMessage("Payment failed. Please try again or contact support.");
          }
        } catch (error) {
          console.error("Error finalizing PayPal payment:", error);
          setLoadingMessage("An unexpected error occurred. Please try again later.");
        }
      }

      capturePayment();
    } else {
      setLoadingMessage("Missing payment information from PayPal.");
    }
  }, [payerId, paymentId, navigate]);

  return (
    <Card className="max-w-md mx-auto mt-20 p-6 text-center">
      <CardHeader>
        <CardTitle>{loadingMessage}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalPaymentReturnPage;

