export const createGoogleMeetEvent = async (accessToken, { title, description, date }) => {
  const startTime = new Date(date);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 час

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        summary: title,
        description,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: "Asia/Almaty"
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: "Asia/Almaty"
        },
        conferenceData: {
          createRequest: {
            requestId: String(Date.now()),
            conferenceSolutionKey: {
              type: "hangoutsMeet"
            }
          }
        }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Google Calendar API error:", data);
    throw new Error(data.error?.message || "Ошибка при создании события");
  }
    console.error("Google Calendar API error:", data);

  return data.hangoutLink;
};
