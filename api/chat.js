export default async function handler(req, res) {
  const userMessage = req.body.message;

  // 1. Create a thread
  const threadRes = await fetch("https://api.openai.com/v1/threads", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    }
  });

  const thread = await threadRes.json();

  // 2. Add the user message to the thread
  await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      role: "user",
      content: userMessage
    })
  });

  // 3. Run the assistant on the thread
  const runRes = await fetch("https://api.openai.com/v1/threads/runs", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      assistant_id: "YOUR_ASSISTANT_ID"
    })
  });

  const run = await runRes.json();

  // 4. Wait for the run to finish
  let runStatus = run;
  while (runStatus.status !== "completed") {
    await new Promise((r) => setTimeout(r, 800)); // wait 0.8 sec

    const checkRes = await fetch(`https://api.openai.com/v1/threads/runs/${run.id}`, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    runStatus = await checkRes.json();
  }

  // 5. Get the assistant's reply
  const messagesRes = await fetch(`https://api.openai.com/v1/threads/${run.thread_id}/messages`, {
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });

  const messages = await messagesRes.json();
  const assistantReply = messages.data[0].content[0].text.value;

  res.status(200).json({ reply: assistantReply });
}
