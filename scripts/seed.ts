import admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

async function run() {
  const userId = process.argv[2] || "demo-user";
  await db.collection("users").doc(userId).set({
    displayName: "Demo User",
    createdAt: new Date().toISOString(),
    preferences: {
      timezone: "America/New_York",
      wakeTime: "08:00",
      sleepTime: "22:00",
      peakHours: [9, 10, 11, 12],
      quietHours: [21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7],
      maxTasksPerDay: 5,
      maxFocusMinutesPerDay: 180,
      defaultDurationMinutes: 15
    }
  }, { merge: true });

  const workCal = db.collection("calendars").doc();
  await workCal.set({ userId, name: "Work", color: "#2f6bff", rules: { notifyAfterHoursAllowed: false, defaultEnergyLevel: "high" } });

  const samples = ["Email client", "30m quick wins", "Deep work planning"];
  for (const title of samples) {
    await db.collection("tasks").add({
      userId,
      title,
      status: "inbox",
      calendarId: workCal.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModifiedBy: "system",
      durationMinutes: 15,
      energyLevel: "medium",
      taskType: "other",
      missedCount: 0
    });
  }

  console.log("Seed complete", { userId });
}

run();
