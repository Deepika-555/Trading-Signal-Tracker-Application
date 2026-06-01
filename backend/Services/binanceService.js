import https from "https";

export const getCurrentPrice = async (symbol) => {
  const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;

  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);

            resolve(Number(parsed.price));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};