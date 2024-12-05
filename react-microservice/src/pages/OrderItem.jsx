import { useState, useEffect } from 'react';
import { DatePicker, Space, Button, message, Table, Popconfirm } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { request } from "../util/apiUtil";
import ExcelexportUtil from "../util/ExcelexportUtil";
import { formatDateForClient } from '../util/serviceUtil';


const OrderItem = () => {
    const [orderItem, setOrderTtem] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        getOrderItem();
    }, []);

    const getOrderItem = () => {
        request("get", `orders/orderItem`, {}).then(res => {
            console.log(res)
            if (res.status === 200) {
                setOrderTtem(res.data);
            }
        }).catch(error => {
            console.error("Error fetching order items:", error);
        });
    };

    const orderItemColumns = [
        { title: "ID", render: (item, items, index) => index + 1, key: "No", fixed: 'left', },
        { title: "Customer Name", dataIndex: ["customer", "name"], key: "customerName" },
        { title: "Product Name", dataIndex: ["product", "name"], key: "productName" },
        { title: "Quantity", dataIndex: "quantityOrder", key: "quantityOrder" },
        { title: "Price", dataIndex: "totalPrice", key: "totalPrice" },
        { title: "Create At", dataIndex: "created", key: "created", render: (created) => formatDateForClient(created) },
        {
            title: "Action", key: "Action", fixed: 'right', render: (item, items) => (
                <Space>
                    <Button size="small" onClick={() => alert(items)}><EditFilled /></Button>
                    <Popconfirm
                        placement="topLeft"
                        title={"Delete"}
                        description={"Are sure to remove!"}
                        onConfirm={() => alert(items.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger size="small"><DeleteFilled /></Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const filterDataByDate = () => {
        if (!startDate || !endDate) {
            message.error("Please select both start and end dates.");
            return;
        }

        const filtered = orderItem.filter((item) => {
            const itemDate = dayjs(item.created);
            return itemDate.isAfter(dayjs(startDate)) && itemDate.isBefore(dayjs(endDate).add(1, "day"));
        });

        const mappedData = filtered.map((item) => ({
            OrderID: item.id,
            CustomerName: item.customer?.name || "N/A",
            ProductName: item.product?.name || "N/A",
            Quantity: item.quantityOrder,
            TotalPrice: item.totalPrice,
            CreatedDate: item.created ? dayjs(item.created).format("YYYY-MM-DD HH:mm") : "N/A",
        }));

        setFilteredData(mappedData);
        message.success("Data filtered successfully.");
    };

    const getExportFileName = () => {
        const start = startDate ? dayjs(startDate).format('YYYY-MM-DD') : 'start';
        const end = endDate ? dayjs(endDate).format('YYYY-MM-DD') : 'end';
        return `OrderItems_${start}_to_${end}`;
    };

    return (
        <>
            <div style={{ height: '100vh' }}>

                <Space style={{ margin: "10px", padding: "10px" }}>
                    <span>Start</span>
                    <DatePicker onChange={(date) => setStartDate(date)} />
                    <span>End</span>
                    <DatePicker onChange={(date) => setEndDate(date)} />
                    <Button onClick={filterDataByDate}>Filter</Button>
                    <ExcelexportUtil data={filteredData} fileName={getExportFileName()} />
                </Space>

                <Table dataSource={orderItem} columns={orderItemColumns} />
                
            </div>
        </>
    )
}

export default OrderItem;
