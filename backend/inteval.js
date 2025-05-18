import Screening from "./models/Screening.js";

function startReservationCleanup() {
  setInterval(async () => {
    const now = new Date();

    try {
      const result = await Screening.updateMany(
        {
          seats: {
            $elemMatch: {
              status: "reserved",
              reservedAt: { $lte: new Date(now - 15 * 60 * 1000) },
            },
          },
        },
        {
          $set: {
            "seats.$[elem].status": "available",
            "seats.$[elem].reservedAt": null,
            "seats.$[elem].user": null,
          },
        },
        {
          arrayFilters: [
            {
              "elem.status": "reserved",
              "elem.reservedAt": { $lte: new Date(now - 15 * 60 * 1000) },
            },
          ],
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`Cleared ${result.modifiedCount} expired reservations`);
      }
    } catch (err) {
      console.error("Error cleaning expired reservations:", err);
    }
  }, 60 * 1000); // every 1 minute
}

export default startReservationCleanup;
