"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * This is a Server Action for the user to get updated lists (It seemed to be a Chrome issue that this fixes)
 */
export async function revalidateAndRedirect() {
  revalidatePath("/"); // Invalidate the cache for the dashboard page
  redirect("/"); // Redirect the user to the dashboard
}