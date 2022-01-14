const fetch = () =>
  Promise.resolve({
    status: 200,
    ok: true,
    json: () => {
      return Promise.resolve({ value: 4 });
    },
  });

module.exports = fetch;
