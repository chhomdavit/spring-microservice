import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { request } from "../util/apiUtil";
import dayjs from "dayjs";


const Dashboard = () => {

  const [orders, setOrders] = useState([])
 
  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = () => {
    request("get", `orders`, {}).then(res => {
      if (res.status === 200) {
        setOrders(res.data);
      }
    }).catch(error => {
      console.error("Error fetching orders:", error);
    });
  };
  
 const processChartData = () => {
  const chartData = [["Time", "Sales Amount"]];
  
  orders.forEach((order) => {
    const createdTime = dayjs(order.created).format("MM:DD"); 
    chartData.push([createdTime, order.bill]);
  });

  return chartData;
};

const options = {
  title: "Point of Sale - Order Trends",
  hAxis: {
    title: "Time of Sale",
    format: "HH:mm",
  },
  vAxis: {
    title: "Sales Amount",
  },
  legend: { position: "bottom" },
  curveType: "function", 
};


  return (
    <div>
       <Chart
        chartType='ColumnChart'
        width="100%"
        height="400px"
        data={processChartData()}
        options={options}
       />
    </div>
  )
}

export default Dashboard;
