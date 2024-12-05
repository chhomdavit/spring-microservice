import { useState, useEffect } from "react";
import {  Table, Space, Popconfirm, Button, Col, Row } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { request } from "../util/apiUtil";
import { formatDateForClient } from '../util/serviceUtil';

const Order = () => {

    const [order, setOrder] = useState([]);
    const [orderItem, setOrderItem] = useState([]);

    useEffect(() => {
        getOrder();
        getOrderItem();
    }, []);

    const getOrder = () => {
        request("get", `orders`, {}).then(res => {
            if (res.status === 200) {
                setOrder(res.data);
            }
        }).catch(error => {
            console.error("Error fetching orders:", error);
        });
    };

    const getOrderItem = (orderId) => {
        request("get", `orders/orderItem/${orderId}`, {}).then(res => {
            if (res.status === 200) {
                setOrderItem(res.data);
            }
        }).catch(error => {
            console.error("Error fetching order items:", error);
        });
    };
    const orderColumns = [
        { title: "ID", render: (item, items, index) => index + 1, key: "No", fixed: 'left', width:"50px" },
        { title: "Customer Name", dataIndex: ["customer", "name"], key: "customerName" },
        { title: "តំលៃសរុប", dataIndex: "subTotal", key: "subTotal" },
        { title: "តំលៃបង់", dataIndex: "bill", key: "bill" },
        { title: "Discount", dataIndex: "discount", key: "discount" },
        { title: "ពន្ធ", dataIndex: "tax", key: "tax", width:"75px"},
        { title: "Create At", dataIndex: "created", key: "created", render: (created) => formatDateForClient(created) },
        { title: "Update At", dataIndex: "updated", key: "updated", render: (updated) => formatDateForClient(updated) },
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
    
      const orderItemColumns = [
        { title: "ID", render: (item, items, index) => index + 1, key: "No", fixed: 'left', width:"50px"},
        { title: "Customer Name", dataIndex: ["customer", "name"], key: "customerName" },
        { title: "Product Name", dataIndex: ["product", "name"], key: "productName" },
        { title: "Quantity", dataIndex: "quantityOrder", key: "quantityOrder" },
        { title: "Price", dataIndex: "totalPrice", key: "totalPrice" },
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
    return (
        <>
        <h2>Order List</h2>
      <Row gutter={[8, 8]}>
        <Col span={16}>
          <Table
            dataSource={order}
            scroll={{ x: 1300 }}
            columns={orderColumns}
            onRow={(record) => ({
              onClick: () => {
                getOrderItem(record.id);
              },
            })}
          />
        </Col>
        <Col span={8}>
            <Table
              dataSource={orderItem}
              scroll={{ x: 600 }}
              columns={orderItemColumns}
            />
        </Col>
      </Row>
        </>
    )
}

export default Order
