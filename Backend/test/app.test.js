import assert from "node:assert/strict";
import { after, before, test } from "node:test";

process.env.GOOGLE_GENAI_API_KEY ??= "test-api-key";
const { default: app } = await import("../src/app.js");

let server;
let baseUrl;

before(async () => {
    server = app.listen(0, "127.0.0.1");
    await new Promise((resolve, reject) => {
        server.once("listening", resolve);
        server.once("error", reject);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    if (!server) return;
    server.closeAllConnections();
    await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
    });
});

test("health endpoint reports the API is running", async () => {
    const response = await fetch(`${baseUrl}/`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
        status: "success",
        message: "GenAI API Backend is running live!",
    });
});

test("auth CORS allows the local frontend with credentials", async () => {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "OPTIONS",
        headers: {
            Origin: "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    });

    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:5173");
    assert.equal(response.headers.get("access-control-allow-credentials"), "true");
});

test("protected auth endpoint rejects requests without a session", async () => {
    const response = await fetch(`${baseUrl}/api/auth/get-me`);

    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { message: "Token not provided" });
});

test("register rejects missing fields without requiring a database", async () => {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    });

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
        success: false,
        message: "All fields are required",
    });
});
