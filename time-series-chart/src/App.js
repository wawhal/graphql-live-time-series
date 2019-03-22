import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const TWENTY_MIN_TEMP_SUBSCRIPTION= gql`
  subscription {
    last_20_min_temp(
      order_by: {
        five_sec_interval: asc
      }
      where: {
        location: {
          _eq: "London"
        }
      }
    ) {
      five_sec_interval
      location
      max_temp
    }
  }
`

class App extends Component {
  render() {
    return (
      <div
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px'}}
      >
        <Subscription subscription={TWENTY_MIN_TEMP_SUBSCRIPTION}>
          {
            ({data, error, loading}) => {
              if (error) {
                console.error(error);
                return "Error";
              }
              if (loading) {
                return "Loading";
              }
              let chartJSData = {
                labels: [],
                datasets: [{
                  label: "Max temperature every five seconds",
                  data: [],
                  pointBackgroundColor: [],
                  borderColor: 'brown',
                  fill: false
                }]
              };
              data.last_20_min_temp.forEach((item) => {
                const humanReadableTime = moment(item.five_sec_interval).format('LTS');
                chartJSData.labels.push(humanReadableTime);
                chartJSData.datasets[0].data.push(item.max_temp);
                chartJSData.datasets[0].pointBackgroundColor.push('brown');
              })
              return (
                <Line
                  data={chartJSData}
                  options={{
                    animation: {duration: 0},
                    scales: { yAxes: [{ticks: { min: 5, max: 20 }}]}
                  }}
                />
              );
            }
          }
        </Subscription>
      </div>
    );
  }
}

export default App;