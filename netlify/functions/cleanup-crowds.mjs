import { getStore } from "@netlify/blobs";
import { createHostedCrowds } from "../../lib/hosted-crowds.mjs";

export default async () => {
  const deleted = await createHostedCrowds(getStore({ name: "glide-crowds-v1", consistency: "strong" })).cleanup();
  return Response.json({ deleted });
};

export const config = { schedule: "0 * * * *" };
