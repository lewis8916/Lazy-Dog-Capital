import { DRAW_REQUEST } from "@/lib/requestForms";
import { handleRequest } from "@/lib/sendRequest";

export async function POST(request) {
  return handleRequest(DRAW_REQUEST, request);
}
