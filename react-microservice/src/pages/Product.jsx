/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Config, request } from "../util/apiUtil";
import { formatDateForClient } from "../util/serviceUtil";
import { Form, Modal, AutoComplete, Button, Image, Input, Menu, Pagination, Popconfirm, Space, Table, Divider, Upload, Row, Col, Select, message } from "antd";
import { EditFilled, DeleteFilled, PlusOutlined } from "@ant-design/icons";

const Product = () => {
    const [product, setProduct] = useState([]);
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [pagination, setPagination] = useState({ current: 1, pageSize: 3, total: 0 });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState(null)
    const customer = JSON.parse(localStorage.getItem("customer"));

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const handleChange = (info) => { setFileList(info.fileList.slice(-1)); };
    const uploadButton = (
        <div>
            <PlusOutlined /> <div style={{ marginTop: 8 }}> Upload</div>
        </div>
    );

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        form.resetFields();
        setFileList([]);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setFileList([]);
    };

    useEffect(() => {
        getProduct();
        getCategory();
    }, [pagination.current, searchKeyword, selectedCategory]);

    const getProduct = () => {
        const { current, pageSize } = pagination;
        const categoryFilter = selectedCategory ? `&categoryId=${selectedCategory}` : "";
        const url = `products/product-pagination?keyword=${searchKeyword}&pageNumber=${current - 1}&pageSize=${pageSize}${categoryFilter}`;
        request("get", url, {})
            .then((res) => {
                if (res.status === 200) {
                    setProduct(res.data.list);
                    setPagination((prev) => ({ ...prev, total: res.data.totalElements }));
                    autoSuggestions(res.data.list);
                }
            })
            .catch((error) => {
                console.error("Error fetching list product:", error);
            });
    };

    const getCategory = () => {
        request("get", `categories`, {})
            .then((res) => {
                if (res.status === 200) {
                    setCategory(res.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
        setSearchKeyword("");
        setPagination({ ...pagination, current: 1 });
    };

    const handleSearch = (value) => {
        setSearchKeyword(value);
        setSelectedCategory("");
        setPagination({ ...pagination, current: 1 });
    };

    const autoSuggestions = (products) => {
        const productNames = products.map((item) => ({
            value: item.name,
            id: item.productId,
        }));
        setSuggestions(productNames);
    };

    const handlePageChange = (page, pageSize) => {
        setPagination({ ...pagination, current: page, pageSize });
    };

    const productColumns = [
        { title: "ID", render: (item, items, index) => index + 1, key: "No", fixed: "left", width: "50px" },
        { title: "Product Name", dataIndex: "name", key: "name" },
        { 
            title: "Quantity", 
            dataIndex: "productQuantity", 
            key: "productQuantity",
            render: (item) => (
                <p style={{ color: "#1c1cf0", fontSize: "16px", fontWeight: "bold" }}>
                  {item != null ? `${item} Qty` : "N/A"}
                </p>
              ),
        },
        { 
            title: "Price", 
            dataIndex: "price", 
            key: "price" ,
            render: (item) => (
                <p style={{ color: "#1c1cf0", fontSize: "16px", fontWeight: "bold" }}>
                  {item != null ? `${item} $` : "N/A"}
                </p>
              ),
        },
        { title: "Category", dataIndex: ["category", "name"], key: "category" },
        { title: "Creat By", dataIndex: ["customer", "name"], key: "customer" },
        { title: "Create At", dataIndex: "created", key: "created", render: (created) => formatDateForClient(created) },
        { title: "Update At", dataIndex: "updated", key: "updated", render: (updated) => updated ? formatDateForClient(updated) : "N/A" },
        {
            title: "Image",
            key: "product_image",
            dataIndex: 'product_image',
            fixed: 'right',
            width: "135px",
            render: (item) => {
                return (
                    <Image
                        width={80} height={60}
                        style={{ borderRadius: 5, boxShadow: "10px 10px 15px -6px rgba(56,19,19,0.84)" }}
                        src={Config.image_path + item}
                        alt={item}
                    />
                )
            }
        },
        {
            title: "Action",
            key: "Action",
            fixed: "right",
            width: "85px",
            render: (item, items) => (
                <Space>
                    <Button size="small" onClick={() => onClickEdit(items)}  disabled={item.customer.id !== customer?.id}>
                        <EditFilled />
                    </Button>
                    <Popconfirm
                        placement="topLeft"
                        title={"Delete"}
                        description={"Are sure to remove!"}
                        onConfirm={() => alert(items.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger size="small">
                            <DeleteFilled />
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const onFinish = (item) => {
        setIsModalOpen(false);
        setFileList([]);
        var form = new FormData();

        form.append("name", item.name);
        form.append("price", item.price);
        form.append("description", item.description);
        form.append("categoryId", item.categoryId);
        form.append("productQuantity", item.productQuantity);
        if (customer.id) {
            form.append("customerId", customer.id);
        }
        if (fileList.length > 0) {
            form.append("file", fileList[0].originFileObj);
        }
        var method = "post";
        var url = "products";
        if (items !== null) {
            method = "put";
            url = `products/${items.productId}`;
        }
        request(method, url, form).then(res => {
            if (res.status === 200) {
                setItems(null);
                getProduct();
            }
        }).catch(error => {
            message.error("Error: ", error);
        });
    };

    const onClickEdit = (item) => {
        setItems(item)
        setIsModalOpen(true);
        const categoryId = item.category ? item.category.id : undefined;
        const customerId = item.customer ? item.customer.id : undefined;
        form.setFieldsValue({
            name: item.name,
            description: item.description,
            productQuantity: item.productQuantity,
            price: item.price,
            categoryId,
            customerId,
        });
        setFileList([
            {
                uid: '-1',
                url: Config.image_path + item.product_image,
            }
        ]);
    }

    return (
        <div>
            <Menu
                mode="horizontal"
                selectedKeys={[selectedCategory]}
                onClick={(e) => handleCategoryClick(e.key)}
                style={{ marginBottom: 20 }}
            >
                <Menu.Item key="">All</Menu.Item>
                {category.map((cat) => (
                    <Menu.Item key={cat.id}>{cat.name}</Menu.Item>
                ))}
            </Menu>
            <Space style={{ margin: "10px" }}>

                <Button size="large" type="primary" onClick={showModal}>Add New</Button>

                <AutoComplete
                    options={suggestions.map((sug) => ({ value: sug.value }))}
                    onSearch={handleSearch}
                    onSelect={(value) => handleSearch(value)}
                    placeholder="Search"
                    value={searchKeyword}
                >
                    <Input.Search size="large" allowClear />
                </AutoComplete>
            </Space>
            <Table
                dataSource={product}
                size="small"
                columns={productColumns}
                scroll={{ x: 1300 }}
                pagination={false}
                rowKey={(record) => record.id}
            />

            <Pagination
                style={{ marginTop: 20, textAlign: "center" }}
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={["1", "3", "5"]}
                showTotal={(total, range) => (
                    <span style={{ fontSize: "14px", color: "#999"}}>
                        {`Showing ${range[0]}-${range[1]} of ${total} items`}
                    </span>
                )}
            />
            <Modal
                title={items != null ? "Update !" : "Add New"}
                open={isModalOpen}
                onOk={handleOk}
                footer={null}
                onCancel={() => { form.resetFields(), handleCancel() }}
                width={650}
            >
                <Form
                    form={form}
                    onFinish={(item) => { form.resetFields(), onFinish(item) }}
                    layout="vertical"
                    initialValues={{
                        price: 1.0,
                        productQuantity: 1,
                        categoryId: selectedCategory || (category.length > 0 ? category[0].id : undefined),
                    }}
                >
                    <Divider style={{ borderColor: '#7cb305', margin: '5px' }} />
                    <Row gutter={[8, 8]}>
                        <Col span={12}>
                            <Form.Item label="Product Name" name={"name"}>
                                <Input.TextArea placeholder="Enter title name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="price" name={"price"}>
                                <Input placeholder="Enter price" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="product Quantity" name={"productQuantity"}>
                                <Input placeholder="Enter title product Quantity" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="description" name={"description"}>
                                <Input.TextArea placeholder="Enter description" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Image Upload" name={"product_image"} enctype="multipart/form-data">
                                <Upload
                                    action="/upload-endpoint"
                                    name="file"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={handleChange}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Category" name="categoryId">
                                <Select placeholder="Select Category" allowClear>
                                    {category.map((item, index) => (
                                        <Select.Option key={index.id} value={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider style={{ borderColor: '#7cb305', margin: '5px' }} />
                    <Form.Item style={{ textAlign: 'right' }}>
                        <Space>
                            <Button danger onClick={handleCancel}>Cancel</Button>

                            <Button htmlType='submit'>{items != null ? "Update" : "Save"}</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Product;
