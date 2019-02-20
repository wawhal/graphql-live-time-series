const fetch = require('node-fetch');
setInterval(
  () => {
    const randomTemp = (Math.random() * 5) + 10;
    fetch(
      `http://localhost:8080/v1alpha1/graphql`,
      {
        method: 'POST',
        body: JSON.stringify({
          query: `
            mutation ($temp: numeric) {
              insert_temperature (
                objects: [{
                  temperature: $temp
                  location: "London"
                }]
              ) {
                returning {
                  recorded_at
                  temperature
                }
              }
            }
          `,
          variables: {
            temp: randomTemp
          }
        })
      }
    ).then((resp) => resp.json().then((respObj) => console.log(JSON.stringify(respObj, null, 2))));
  },
  2000
);
