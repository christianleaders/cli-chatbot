export default async function handler(req, res) {
  const userMessage = req.body.message;

  const response = await fetch("https://api.openai.com/v1/assistants/asst_j9BznnIC8jpNrsvlsGLRHByg", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input: userMessage
    })
  });

  const json = await response.json();
  res.status(200).json(json);
}
