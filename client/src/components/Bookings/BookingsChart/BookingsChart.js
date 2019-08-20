import React from "react";
import {Bar} from "react-chartjs-2";

const BookingsChart = props => {
  const BOOKINGS_BUCKETS = {
    Cheap: {
      min: 0,
      max: 10
    },
    Normal: {
      min: 10,
      max: 50
    },
    Expensive: {
      min: 50,
      max: 1000
    }
  };

  const chartData = {
    labels: [],
    datasets: [
      {
        label: "Events",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: []
      }
    ]
  };
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce(
      (acc, val) => {
        if (
          val.event.price >= BOOKINGS_BUCKETS[bucket].min &&
          val.event.price < BOOKINGS_BUCKETS[bucket].max
        ) {
          return acc + 1;
        } else {
          return acc;
        }
      },
      0
    );
    chartData.labels.push(bucket);
    chartData.datasets[0].data = [
      ...chartData.datasets[0].data,
      filteredBookingsCount
    ];
  }

  return (
    <div
      style={{
        width: "500px",
        height: "250px",
        textAlign: "center",
        margin: "2rem auto"
      }}
    >
      <Bar
        data={chartData}
        width={100}
        height={50}
        options={{
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                let label =
                  data.datasets[tooltipItem.datasetIndex].label || "";
                if (label) {
                  label += `: ${tooltipItem.value}`;
                }
                return label;
              }
            }
          },
          maintainAspectRatio: true,
          legend: {
            display: false
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  stepSize: 1
                }
              }
            ],
            xAxes: [
              {
                barThickness: 40
              }
            ]
          }
        }}
      />
    </div>
  );
};

export default BookingsChart;
