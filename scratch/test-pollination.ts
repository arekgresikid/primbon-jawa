import "dotenv/config";

async function test() {
  const mySecretKey = process.env.POLLINATION_API_KEY;
  console.log("API Key found:", !!mySecretKey);

  const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${mySecretKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello" }
      ],
      model: "openai",
      stream: false
    })
  });

  console.log("Status:", response.status);
  const result = await response.json();
  console.log("Result:", JSON.stringify(result, null, 2));
}

test();
