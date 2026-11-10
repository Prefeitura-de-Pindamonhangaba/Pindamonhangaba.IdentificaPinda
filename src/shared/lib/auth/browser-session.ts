export const SESSION_CHANNEL = "identifica-pinda-session";

export function notifyBrowserSignOut() {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(SESSION_CHANNEL);
  channel.postMessage("signed-out");
  channel.close();
}
