import { PAYOFF_REQUEST } from "@/lib/requestForms";
import { handleRequest } from "@/lib/sendRequest";

export async function POST(request) {
  return handleRequest(PAYOFF_REQUEST, request);
}
