export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("📡 Calling Lambda with:", body);

    const lambdaUrl =
      process.env.LAMBDA_API_URL ||
      "https://tgo3o9jshk.execute-api.ap-south-1.amazonaws.com/Prod/chat";

    const response = await fetch(lambdaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(55000), // 55 second timeout
    });

    console.log("📡 Lambda response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Lambda error:", errorText);
      return new Response(
        JSON.stringify({
          error: `Lambda error: ${response.status} - ${errorText}`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return the JSON response from Lambda directly
    const data = await response.json();
    console.log("✅ Lambda response:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("❌ API route error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
