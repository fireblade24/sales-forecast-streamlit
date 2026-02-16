import { addMinutes } from "date-fns";
import { db, messaging } from "../lib/firebase.js";

export async function dispatchReminders() {
  const now = new Date();
  const soon = addMinutes(now, 2).toISOString();
  const snapshot = await db.collection("reminders")
    .where("status", "==", "pending")
    .where("scheduledTime", "<=", soon)
    .get();

  for (const doc of snapshot.docs) {
    const reminder = doc.data();
    const devicesSnap = await db.collection("devices").where("userId", "==", reminder.userId).get();
    for (const deviceDoc of devicesSnap.docs) {
      const { fcmToken } = deviceDoc.data();
      try {
        await messaging.send({ token: fcmToken, notification: { title: "FlowTasks Reminder", body: "It's time for your next focus block." } });
      } catch {
        await deviceDoc.ref.delete();
      }
    }
    await doc.ref.update({ status: "sent" });
  }
  return snapshot.size;
}
