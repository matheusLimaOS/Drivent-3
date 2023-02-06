import { ApplicationError } from "@/protocols";

export function paymentError(): ApplicationError {
  return {
    name: "paymentError",
    message: "Payment Required",
  };
}
