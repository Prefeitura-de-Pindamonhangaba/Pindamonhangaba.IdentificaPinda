export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startDataRetention } =
      await import("@/shared/lib/maintenance/data-retention");
    startDataRetention();
  }
}
