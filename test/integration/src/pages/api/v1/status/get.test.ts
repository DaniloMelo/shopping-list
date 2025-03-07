import getBaseUrl from "@/lib/getBaseUrl";

describe("/api/v1/status end-point", () => {
  test("GET to /api/v1/status should return system status", async () => {
    console.log("Domínio nos testes ==> ", `${getBaseUrl()}/api/v1/status`);
    const response = await fetch(`${getBaseUrl()}/api/v1/status`);
    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.dependencies.database.server_version).toBe("16.0");
    expect(responseBody.dependencies.database.max_connections).toEqual(100);
    expect(responseBody.dependencies.database.open_connections).toBe(1);
  });
});
