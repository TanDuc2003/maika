const getChart = async (req, res) => {
  try {
    fetch("https://grafana.st4as.com/api/ds/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queries: [
          {
            datasource: {
              type: "prometheus",
              uid: "PBFA97CFB590B2093",
            },
            expr: 'sum by(pod) (rate(container_cpu_usage_seconds_total{container=~"nodejs-0f0ss3"}[1h]))',
            instant: true,
            key: "Q-9e17a1be-bd8b-4c3c-ac6e-73da004649ac-0",
            refId: "A",
            range: true,
            queryType: "timeSeriesQuery",
            intervalMs: 15000,
            maxDataPoints: 1512,
          },
        ],
        range: {
          from: "2024-04-24T21:54:32.458Z",
          to: "2024-04-25T03:54:32.458Z",
          raw: {
            from: "2024-04-24T21:54:32.458Z",
            to: "2024-04-25T03:54:32.458Z",
          },
        },
        from: "1713995672458",
        to: "1714017272458",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return res.status(200).send(data);
      })
      .catch((error) => console.error("Error:", error));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getChart };
