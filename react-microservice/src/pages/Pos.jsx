/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Affix, Menu, AutoComplete, Input, Pagination, Card, Splitter, InputNumber, Image, Button, Modal, Spin, Divider, Col, Row, message, Avatar, List } from 'antd';
import { DeleteOutlined, EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';

import { request, Config } from "../util/apiUtil";
import { colors, startColorChangeInterval } from '../util/colorUtil';
import usePrint from '../util/printUtil';

function Pos() {

  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [cart, setCart] = useState([]);

  const colorList = colors();
  const [backgroundColor, setBackgroundColor] = useState(colorList[1]);

  const [subTotal, setSubTotal] = useState(0);
  const [billUSD, setBillUSD] = useState(0);
  const [billRiel, setBillRiel] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [cashReceived, setCashReceived] = useState(0);
  const [cashReceivedRiel, setCashReceivedRiel] = useState(0);
  const [cashChange, setCashChange] = useState(0);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 3, total: 0, });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const customer = JSON.parse(localStorage.getItem("customer"));
  const componentRef = React.useRef(null);
  const printFn = usePrint(componentRef);
  const exchangeRate = 4100;

  useEffect(() => {
    calculateTotals();
  }, [cart, tax, discount, cashReceived, cashReceivedRiel]);

  useEffect(() => {
    getProduct();
    getCategory();
    handleGetCart();
  }, [pagination.current, searchKeyword, selectedCategory]);

  useEffect(() => {
    const colorChangeInterval = startColorChangeInterval(
      setBackgroundColor
    );
    return () => clearInterval(colorChangeInterval);
  }, []);

  const getCategory = () => {
    request("get", `categories`, {}).then(res => {
      if (res.status === 200) {
        setCategory(res.data);
      }
    }).catch(error => {
      console.error("Error fetching orders:", error);
    });
  }

  const getProduct = () => {
    setLoading(true);
    const { current, pageSize } = pagination;
    const categoryFilter = selectedCategory ? `&categoryId=${selectedCategory}` : "";
    const url = `products/product-pagination?keyword=${searchKeyword}&pageNumber=${current - 1}&pageSize=${pageSize}${categoryFilter}`;
    request("get", url, {}).then(res => {
      if (res.status === 200) {
        setProduct(res.data.list);
        setPagination((prev) => ({ ...prev, total: res.data.totalElements }));
        autoSuggestions(res.data.list);
        setTimeout(() => {
          setLoading(false)
        }, 500)
      }
    })
      .catch(error => {
        console.error("Error fetching list product:", error);
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
    const productNames = products.map(item => ({
      value: item.name,
      id: item.productId
    }));
    setSuggestions(productNames);
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  const onClickViewContent = (item) => {
    setSelectedDescription(item.description);
    setIsDescriptionModalOpen(true);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleGetCart = () => {
    request("get", `orders/cart/${customer.id}`, {}).then(res => {
      if (res.status === 200) {
        setCart(res.data);
      }
    }).catch(error => {
      console.error("Error fetching orders:", error);
    });
  };

  const handleCreatCart = (item) => {
    const payload = {
      quantityCart: 1,
      customerId: customer.id,
      productId: item.productId,
    };
    request("post", "orders/cart", payload).then((res) => {
      if (res.status === 200 || res.status === 201) {
        handleGetCart()
      }
    }).catch(() => {
      message.error("An error occurred while adding product to cart.");
    });
  }

  const handleUpdateCart = (item, value) => {
    if (value !== undefined && value >= 1 && Number.isInteger(value)) {
      const payload = {
        quantityCart: value,
        customerId: item.customer.id,
        productId: item.product.productId,
      };
      request("put", `orders/cart/${item.cartId}`, payload)
        .then((res) => {
          if (res.status === 200) {
            handleGetCart();
          }
        })
        .catch(() => {
          message.error("An error occurred while updating the cart.");
        });
    }
  };

  const handleDeleteCart = (item) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.cartId !== item.cartId));
    request("delete", `orders/cart/${item.cartId}/customers/${customer.id}`, {}).then((res) => {
      if (res.status === 200) {
        handleGetCart();
      }
    }).catch(() => {
      message.error("An error occurred while delete the cart.");
    });
  }

  const handleClear = () => {
    setCashReceived(0);
    setCashReceivedRiel(0);
    setTax(0);
    setDiscount(0);
  }

  const handleCheckout = () => {
    const totalReceived = cashReceived + cashReceivedRiel / exchangeRate;
    if (totalReceived < billUSD) {
      message.error('Please provide enough cash to proceed with checkout.');
      return;
    }
    const payload = {
      customerId: customer.id,
      discount: discount,
      tax: tax,
      bill: billUSD,
      subTotal: subTotal,
    };
    request("post", "orders", payload).then((res) => {
      if (res.status === 200 || res.status === 201) {
        setCart([]);
        handleClear();
        closeModal();
        setTimeout(() => {
          printFn();
        }, 500);
      }
    }).catch(() => {
      message.error("An error occurred while adding product to cart.");
    });
  };

  const calculateTotals = () => {
    const newSubTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = (tax / 100) * newSubTotal;
    const discountAmount = (discount / 100) * newSubTotal;
    const newBillUSD = newSubTotal + taxAmount - discountAmount;
    const newBillRiel = newBillUSD * exchangeRate;

    const cashReceivedUSD = cashReceived + cashReceivedRiel / exchangeRate;
    const newCashChange = cashReceivedUSD - newBillUSD;

    setSubTotal(newSubTotal);
    setBillUSD(newBillUSD);
    setBillRiel(newBillRiel);
    setCashChange(newCashChange);
  };

  return (
    <>
      <Splitter style={{backgroundColor: backgroundColor, borderRadius: "10px", boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Splitter.Panel collapsible defaultSize="60%" style={{margin: '10px'}}>
          <Spin spinning={loading}>
            <Affix offsetTop={110} onChange={(affixed) => console.log(affixed)}>
              <Row style={{ backgroundColor: backgroundColor,marginTop: "-15px" }}>
                    <Col span={12} style={{ fontWeight: "bold", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span>POS</span>
                    </Col>
                    <Col span={12}>
                      <AutoComplete
                        options={suggestions.map(sug => ({ value: sug.value }))}
                        style={{ width: '100%' }}
                        onSearch={handleSearch}
                        onSelect={(value) => handleSearch(value)}
                        placeholder="Search"
                        value={searchKeyword}
                      >
                        <Input.Search size="large" allowClear />
                      </AutoComplete>
                    </Col>
                  <Col span={24} style={{ padding: "10px", margin: "10px" }}>
                    <Menu
                      mode="horizontal"
                      style={{ fontWeight: 'bold', color: '#007bff' }}
                      hoverable
                      onClick={(e) => handleCategoryClick(e.key)}
                    >
                      <Menu.Item key="">All</Menu.Item>
                      {category.map(cat => (
                        <Menu.Item key={cat.id}>
                          {cat.name}
                        </Menu.Item>
                      ))}
                    </Menu>
                  </Col>
              </Row>
            </Affix>
            <Row gutter={[8, 8]}>
              {product.map((item) => (
                <Col key={item.id} span={8}>
                  <Card
                    hoverable
                    style={{marginTop:"20px"}}
                    cover={
                      <Image
                        alt={item.name}
                        src={item.product_image ? `${Config.image_path}${item.product_image}` : 'https://via.placeholder.com/150'}
                        style={{ height: 100, objectFit: "fill", marginTop: "10px" }}
                      />
                    }
                    actions={[
                      <ShoppingCartOutlined key="product_id" onClick={() => handleCreatCart(item)} />,
                      <EyeOutlined key="description" onClick={() => onClickViewContent(item)} />
                    ]}
                  >
                    <Card.Meta
                      // title={
                      //   <span>
                      //     {item.name}
                      //   </span>
                      // }
                      description={
                        <div style={{height:"60px",color:"black"}}>
                          <span style={{fontSize:"15px",fontWeight:"bold",}}>
                            {item.name}<br/>
                          </span>
                          <span>
                            តម្លែរាយ: {item.price != null ? `${item.price} $` : 'N/A'}
                          </span>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination
              style={{ marginTop: 20, textAlign: 'center', justifyContent: "center" }}
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["1", "3", "5"]}
              showTotal={(total, range) => (
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {`Showing ${range[0]}-${range[1]} of ${total} items`}
                </span>
              )}
            />
          </Spin>
        </Splitter.Panel>
        <Splitter.Panel>
          <Splitter layout="vertical">
            <Splitter.Panel collapsible defaultSize="55%" style={{ marginTop: '5px', padding: '5px' }}>
              <Row gutter={8}>
                <Col span={6}><Button onClick={() => showModal()}>Check Out</Button></Col>
                <Col span={10}>
                  <InputNumber
                    min={0}
                    addonBefore="Disc:"
                    suffix="(%)"
                    value={discount}
                    onChange={(value) => setDiscount(value)}
                  />
                </Col>
                <Col span={8}>
                  <InputNumber
                    min={0}
                    addonBefore="Tax:"
                    suffix="(%)"
                    value={tax}
                    onChange={(value) => setTax(value)}
                  />
                </Col>
              </Row>
              <Divider style={{ borderColor: '#7cb305', margin: '5px' }} />
              <div style={{
                fontWeight: 'bold',
                padding: '10px',
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Subtotal:</span><span>$ {subTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Tax:</span><span>% {tax ? tax.toFixed(2) : '0.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Discount:</span><span>% {discount ? discount.toFixed(2) : '0.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Bill:</span><span>$ {billUSD.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span></span><span>R {billRiel.toFixed(2)}</span>
                </div>
                <Divider style={{ borderColor: '#7cb305', margin: '5px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>
                    <InputNumber
                      style={{ width: "180px" }}
                      addonBefore="រៀល:"
                      min={0}
                      suffix="(R)"
                      value={cashReceivedRiel}
                      onChange={(value) => setCashReceivedRiel(value)}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                    />
                  </span>
                  <span>
                    <InputNumber
                      style={{ width: "180px" }}
                      addonBefore="USD:"
                      min={0}
                      suffix="($)"
                      value={cashReceived}
                      onChange={(value) => setCashReceived(value)}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                    />
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Cash Change:</span>
                  <span>R {(cashChange * exchangeRate).toFixed(2)}</span>
                  <span>$ {cashChange.toFixed(2)}</span>
                </div>
              </div>
            </Splitter.Panel>
            <Splitter.Panel>
              <Divider style={{ borderColor: '#7cb305', margin: '5px', fontSize: '18px', fontWeight: "bold" }}>List Cart</Divider>
                <List
                  itemLayout="horizontal"
                  dataSource={[...cart].sort((a, b) => a.cartId - b.cartId)}
                  renderItem={(item, index) => {
                    const color = colorList[index % colorList.length];
                    return (
                      <List.Item
                        key={item.cartId}
                        actions={[<DeleteOutlined key="delete" style={{color:'red',fontSize:'18px',backgroundColor:"white", padding:"10px",borderRadius:"10px"}} onClick={() => handleDeleteCart(item)} />]}
                        style={{
                          backgroundColor: color,
                          padding: "10px",
                          borderRadius: "10px",
                          margin: '3px',
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f0f0f0';
                          e.currentTarget.style.boxShadow = "0px 6px 8px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = color;
                          e.currentTarget.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
                        }}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              src={
                                item.product.product_image
                                  ? `${Config.image_path}${item.product.product_image}`
                                  : 'https://via.placeholder.com/150'
                              }
                              alt={item.product.name}
                            />
                          }
                          title={
                            <div>
                              <span>NO: {index + 1}</span>&nbsp;&nbsp;||
                              {/* <span>តម្លែរាយ: {item.product.price.toFixed(2)} $</span>&nbsp;&nbsp;|| */}
                              <span>តម្លែសរុប: {item.totalPrice.toFixed(2)} $</span>&nbsp;&nbsp;<br />
                              <span>ឈ្មោះ: {item.product.name}</span>
                            </div>
                          }
                          description={
                            <InputNumber
                              prefix="Qty"
                              size="large"
                              min={1}
                              max={item.product.productQuantity}
                              value={item.quantityCart}
                              onChange={value => handleUpdateCart(item, value)}
                            />
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
      </Splitter>

      <Modal
        title="Details"
        open={isDescriptionModalOpen}
        onCancel={() => setIsDescriptionModalOpen(false)}
        width={650}
        footer={[
          <Button key="close" onClick={() => setIsDescriptionModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        <div dangerouslySetInnerHTML={{ __html: selectedDescription }} />
      </Modal>

      {/* ផ្នែក invoice Receipt */}
      <Modal
        open={isModalOpen}
        onCancel={() => closeModal()}
        footer={[
          <Button key="confirm" onClick={() => handleCheckout()}>Checkout</Button>,
          <Button danger key="cancel" onClick={() => closeModal()}>Cancel</Button>,
        ]}
        width={400}
      >
        <div ref={componentRef} style={{ fontFamily: 'monospace', width: '58mm', margin: '0 auto', fontSize: '12px', lineHeight: '1.5' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Mega Ktv</div>
            <div style={{ fontSize: '14px' }}>#123 Main St44, City, Country</div>
            <div style={{ fontSize: '14px' }}>Phone: (012) 349-211</div>
            <div style={{ fontSize: '12px' }}>
              Date: {dayjs().format('YYYY-MM-DD')},
              Time: {dayjs().format('HH:mm:ss')}
            </div>
          </div>
          <Divider style={{ margin: '10px 0' }} />
          <div style={{ fontWeight: 'bold' }}>Receipt:</div>
          <div style={{ marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '5px', borderBottom: '1px solid #ddd' }}>Item</th>
                  <th style={{ textAlign: 'right', padding: '5px', borderBottom: '1px solid #ddd' }}>Price</th>
                  <th style={{ textAlign: 'right', padding: '5px', borderBottom: '1px solid #ddd' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '5px', borderBottom: '1px solid #ddd' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>{item.product.name}</td>
                    <td style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>${item.product.price.toFixed(2)}</td>
                    <td style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>{item.quantityCart}</td>
                    <td style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>${item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontWeight: 'bold', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Subtotal</span><span>${subTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Tax</span><span>% {tax ? tax.toFixed(2) : '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Discount</span><span>% {discount ? discount.toFixed(2) : '0.00'}</span>
            </div>
            <Divider style={{ margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '17px' }}>
              <span>Bill</span><span>${billUSD.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '17px' }}>
              <span></span><span>R{billRiel.toFixed(2)}</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '20px' }}>
            <span>Thank you for shopping with us!</span>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default Pos;



//================================================
//* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect } from 'react';
// import { DatePicker, Menu, AutoComplete, Input, Pagination, Card, Splitter, InputNumber, Table, Image, Space, Popconfirm, Button, Modal, Spin, Divider, Col, Row, message, Avatar, List } from 'antd';
// import { DeleteFilled, EditFilled, DeleteOutlined, EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
// import { request, Config } from "./util/apiUtil";
// import { formatDateForClient } from './util/serviceUtil';
// import dayjs from 'dayjs';
// import { colors, startColorChangeInterval } from './util/colorUtil';
// import ExcelexportUtil from "./util/ExcelexportUtil";
// import usePrint from './util/printUtil';

// function App() {

//   const [product, setProduct] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [order, setOrder] = useState([]);
//   const [orderItem, setOrderItem] = useState([]);
//   const [allOrderItem, setAllOrderTtem] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [cart, setCart] = useState([]);

//   const colorList = colors();
//   const [backgroundColor, setBackgroundColor] = useState(colorList[0]);

//   const [subTotal, setSubTotal] = useState(0);
//   const [billUSD, setBillUSD] = useState(0);
//   const [billRiel, setBillRiel] = useState(0);
//   const [tax, setTax] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [cashReceived, setCashReceived] = useState(0);
//   const [cashReceivedRiel, setCashReceivedRiel] = useState(0);
//   const [cashChange, setCashChange] = useState(0);

//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

//   const [selectedDescription, setSelectedDescription] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 3, total: 0, });
//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const componentRef = React.useRef(null);
//   const printFn = usePrint(componentRef);
//   const exchangeRate = 4100;

//   useEffect(() => {
//     calculateTotals();
//   }, [cart, tax, discount, cashReceived, cashReceivedRiel]);

//   useEffect(() => {
//     getProduct();
//     getOrder();
//     getCategory();
//     getAllOrderItem();
//     handleGetCart();
//   }, [pagination.current, searchKeyword, selectedCategory]);

//   useEffect(() => {
//     const colorChangeInterval = startColorChangeInterval(
//       setBackgroundColor
//     );
//     return () => clearInterval(colorChangeInterval);
//   }, []);

//   const getCategory = () => {
//     request("get", `categories`, {}).then(res => {
//       if (res.status === 200) {
//         setCategory(res.data);
//       }
//     }).catch(error => {
//       console.error("Error fetching orders:", error);
//     });
//   }

//   const getProduct = () => {
//     setLoading(true);
//     const { current, pageSize } = pagination;
//     const categoryFilter = selectedCategory ? `&categoryId=${selectedCategory}` : "";
//     const url = `products/product-pagination?keyword=${searchKeyword}&pageNumber=${current - 1}&pageSize=${pageSize}${categoryFilter}`;
//     request("get", url, {}).then(res => {
//       if (res.status === 200) {
//         setProduct(res.data.list);
//         setPagination((prev) => ({ ...prev, total: res.data.totalElements }));
//         autoSuggestions(res.data.list);
//         setTimeout(() => {
//           setLoading(false)
//         }, 500)
//       }
//     })
//       .catch(error => {
//         console.error("Error fetching list product:", error);
//       });
//   };

//   const handleCategoryClick = (categoryId) => {
//     setSelectedCategory(categoryId);
//     setSearchKeyword("");
//     setPagination({ ...pagination, current: 1 });
//   };

//   const handleSearch = (value) => {
//     setSearchKeyword(value);
//     setSelectedCategory("");
//     setPagination({ ...pagination, current: 1 });
//   };

//   const autoSuggestions = (products) => {
//     const productNames = products.map(item => ({
//       value: item.name,
//       id: item.productId
//     }));
//     setSuggestions(productNames);
//   };

//   const handlePageChange = (page, pageSize) => {
//     setPagination({ ...pagination, current: page, pageSize });
//   };

//   const getOrder = () => {
//     request("get", `orders`, {}).then(res => {
//       if (res.status === 200) {
//         setOrder(res.data);
//       }
//     }).catch(error => {
//       console.error("Error fetching orders:", error);
//     });
//   };

//   const getOrderItem = (orderId) => {
//     setLoading(true);
//     request("get", `orders/orderItem/${orderId}`, {}).then(res => {
//       setTimeout(() => {
//         setLoading(false)
//       }, 1000)
//       if (res.status === 200) {
//         setOrderItem(res.data);
//       }
//     }).catch(error => {
//       console.error("Error fetching order items:", error);
//     });
//   };

//   const getAllOrderItem = () => {
//     request("get", `orders/orderItem`, {}).then(res => {
//       console.log(res)
//       if (res.status === 200) {
//         setAllOrderTtem(res.data);
//       }
//     }).catch(error => {
//       console.error("Error fetching order items:", error);
//     });
//   };

//   const onClickViewContent = (item) => {
//     setSelectedDescription(item.description);
//     setIsDescriptionModalOpen(true);
//   };

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleGetCart = () => {
//     request("get", `orders/cart`, {}).then(res => {
//       if (res.status === 200) {
//         setCart(res.data);
//       }
//     }).catch(error => {
//       console.error("Error fetching orders:", error);
//     });
//   };

//   const handleCreatCart = (item) => {
//     console.log(item)
//     const payload = {
//       quantityCart: 1,
//       customerId: "67453f8600daeb7f6b8afb98",
//       productId: item.productId,
//     };
//     request("post", "orders/cart", payload).then((res) => {
//       if (res.status === 200 || res.status === 201) {
//         handleGetCart()
//       }
//     }).catch(() => {
//       message.error("An error occurred while adding product to cart.");
//     });
//   }

//   const handleUpdateCart = (item, value) => {
//     if (value !== undefined && value >= 1 && Number.isInteger(value)) {
//       const payload = {
//         quantityCart: value,
//         customerId: item.customer.id,
//         productId: item.product.productId,
//       };
//       request("put", `orders/cart/${item.cartId}`, payload)
//         .then((res) => {
//           if (res.status === 200) {
//             handleGetCart();
//           }
//         })
//         .catch(() => {
//           message.error("An error occurred while updating the cart.");
//         });
//     }
//   };

//   const handleDeleteCart = (item) => {
//     setCart((prevCart) => prevCart.filter((cartItem) => cartItem.cartId !== item.cartId));
//     request("delete", `orders/cart/${item.cartId}/customers/67453f8600daeb7f6b8afb98`, {}).then((res) => {
//       if (res.status === 200) {
//         handleGetCart();
//       }
//     }).catch(() => {
//       message.error("An error occurred while delete the cart.");
//     });
//   }

//   const handleClear = () => {
//     setCashReceived(0);
//     setCashReceivedRiel(0);
//     setTax(0);
//     setDiscount(0);
//   }

//   const handleCheckout = () => {
//     const totalReceived = cashReceived + cashReceivedRiel / exchangeRate;
//     if (totalReceived < billUSD) {
//       message.error('Please provide enough cash to proceed with checkout.');
//       return;
//     }
//     const payload = {
//       customerId: "67453f8600daeb7f6b8afb98",
//       discount: discount,
//       tax: tax,
//       bill: billUSD,
//       subTotal: subTotal,
//     };
//     request("post", "orders", payload).then((res) => {
//       if (res.status === 200 || res.status === 201) {
//         setCart([]);
//         handleClear();
//         closeModal();
//         setTimeout(() => {
//           printFn();
//         }, 500);
//       }
//     }).catch(() => {
//       message.error("An error occurred while adding product to cart.");
//     });
//   };

//   const calculateTotals = () => {
//     const newSubTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
//     const taxAmount = (tax / 100) * newSubTotal;
//     const discountAmount = (discount / 100) * newSubTotal;
//     const newBillUSD = newSubTotal + taxAmount - discountAmount;
//     const newBillRiel = newBillUSD * exchangeRate;

//     const cashReceivedUSD = cashReceived + cashReceivedRiel / exchangeRate;
//     const newCashChange = cashReceivedUSD - newBillUSD;

//     setSubTotal(newSubTotal);
//     setBillUSD(newBillUSD);
//     setBillRiel(newBillRiel);
//     setCashChange(newCashChange);
//   };

//   const orderColumns = [
//     { title: "ID", render: (item, items, index) => index + 1, key: "No" },
//     { title: "Customer Name", dataIndex: ["customer", "name"], key: "customerName" },
//     { title: "តំលៃសរុប", dataIndex: "subTotal", key: "subTotal" },
//     { title: "តំលៃបង់", dataIndex: "bill", key: "bill" },
//     { title: "Discount", dataIndex: "discount", key: "discount" },
//     { title: "ពន្ធ", dataIndex: "tax", key: "tax" },
//     { title: "Create At", dataIndex: "created", key: "created", render: (created) => formatDateForClient(created) },
//     { title: "Update At", dataIndex: "updated", key: "updated", render: (updated) => formatDateForClient(updated) },
//     {
//       title: "Action", key: "Action", render: (item, items) => (
//         <Space>
//           <Button size="small" onClick={() => alert(items)}><EditFilled /></Button>
//           <Popconfirm
//             placement="topLeft"
//             title={"Delete"}
//             description={"Are sure to remove!"}
//             onConfirm={() => alert(items.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button danger size="small"><DeleteFilled /></Button>
//           </Popconfirm>
//         </Space>
//       )
//     }
//   ];

//   const orderItemColumns = [
//     { title: "ID", render: (item, items, index) => index + 1, key: "No", fixed: 'left', },
//     { title: "Customer Name", dataIndex: ["customer", "name"], key: "customerName" },
//     { title: "Product Name", dataIndex: ["product", "name"], key: "productName" },
//     { title: "Quantity", dataIndex: "quantityOrder", key: "quantityOrder" },
//     { title: "Price", dataIndex: "totalPrice", key: "totalPrice" },
//     {
//       title: "Action", key: "Action", fixed: 'right', render: (item, items) => (
//         <Space>
//           <Button size="small" onClick={() => alert(items)}><EditFilled /></Button>
//           <Popconfirm
//             placement="topLeft"
//             title={"Delete"}
//             description={"Are sure to remove!"}
//             onConfirm={() => alert(items.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button danger size="small"><DeleteFilled /></Button>
//           </Popconfirm>
//         </Space>
//       )
//     }
//   ];

//   const filterDataByDate = () => {
//     if (!startDate || !endDate) {
//       message.error("Please select both start and end dates.");
//       return;
//     }
  
//     const filtered = allOrderItem.filter((item) => {
//       const itemDate = dayjs(item.created); 
//       return itemDate.isAfter(dayjs(startDate)) && itemDate.isBefore(dayjs(endDate).add(1, "day"));
//     });

//     const mappedData = filtered.map((item) => ({
//       OrderID: item.id,
//       CustomerName: item.customer?.name || "N/A",
//       ProductName: item.product?.name || "N/A",
//       Quantity: item.quantityOrder,
//       TotalPrice: item.totalPrice,
//       CreatedDate: item.created ? dayjs(item.created).format("YYYY-MM-DD HH:mm") : "N/A",
//     }));
  
//     setFilteredData(mappedData);
//     message.success("Data filtered successfully.");
//   };
  
//   const getExportFileName = () => {
//     const start = startDate ? dayjs(startDate).format('YYYY-MM-DD') : 'start';
//     const end = endDate ? dayjs(endDate).format('YYYY-MM-DD') : 'end';
//     return `OrderItems_${start}_to_${end}`;
//   };

//   return (
//     <>
//       <Splitter style={{ backgroundColor: backgroundColor, borderRadius: "10px", height: '100vh', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
//         <Splitter.Panel collapsible defaultSize="65%">
//           <Spin spinning={loading}>
//             <Row style={{ padding: "5px", margin: "5px" }}>
//               <Col span={12} style={{ fontWeight: "bold", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <span>POS</span>
//               </Col>
//               <Col span={12}>
//                 <AutoComplete
//                   options={suggestions.map(sug => ({ value: sug.value }))}
//                   style={{ width: '100%' }}
//                   onSearch={handleSearch}
//                   onSelect={(value) => handleSearch(value)}
//                   placeholder="Search"
//                   value={searchKeyword}
//                 >
//                   <Input.Search size="large" allowClear />
//                 </AutoComplete>
//               </Col>
//               <Col span={24} style={{ padding: "10px", margin: "10px", display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
//                 <Menu
//                   mode="horizontal"
//                   hoverable
//                   onClick={(e) => handleCategoryClick(e.key)}
//                 >
//                   {category.map(cat => (
//                     <Menu.Item key={cat.id} style={{ fontWeight: 'bold', color: '#007bff' }}>
//                       {cat.name}
//                     </Menu.Item>
//                   ))}
//                 </Menu>
//               </Col>
//             </Row>
//             <Row gutter={[8, 8]}>
//               {product.map((item) => (
//                 <Col key={item.id} span={8}>
//                   <Card
//                     hoverable
//                     style={{ margin: '5px' }}
//                     cover={
//                       <Image
//                         alt={item.name}
//                         src={
//                           item.product_image             
//                             ? `${Config.image_path}${item.product_image}`
//                             : 'https://via.placeholder.com/150'
//                         }
//                         style={{ height: 150, objectFit: "fill", marginTop: "10px" }}
//                       />
//                     }
//                     actions={[
//                       <ShoppingCartOutlined key="product_id" onClick={() => handleCreatCart(item)} />,
//                       <EyeOutlined key="description" onClick={() => onClickViewContent(item)} />
//                     ]}
//                   >
//                     <Card.Meta
//                       title={item.name}
//                       description={
//                         <div>
//                           <p>Price: {item.price != null ? `${item.price} $` : 'N/A'}</p>
//                         </div>
//                       }
//                     />
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//             <Pagination
//               style={{ marginTop: 20, textAlign: 'center', justifyContent: "center" }}
//               current={pagination.current}
//               pageSize={pagination.pageSize}
//               total={pagination.total}
//               onChange={handlePageChange}
//               showSizeChanger
//               pageSizeOptions={["1", "3", "5"]}
//               showTotal={(total, range) => (
//                 <span style={{ fontSize: "16px", fontWeight: "bold" }}>
//                   {`Showing ${range[0]}-${range[1]} of ${total} items`}
//                 </span>
//               )}
//             />
//           </Spin>
//         </Splitter.Panel>
//         <Splitter.Panel>
//           <Splitter layout="vertical">
//             <Splitter.Panel collapsible defaultSize="48%" style={{ marginTop: '5px', padding: '5px' }}>
//               <Row gutter={8}>
//                 <Col span={6}><Button onClick={() => showModal()}>Check Out</Button></Col>
//                 <Col span={10}>
//                   <InputNumber
//                     min={0}
//                     addonBefore="Discount:"
//                     suffix="(%)"
//                     value={discount}
//                     onChange={(value) => setDiscount(value)}
//                   />
//                 </Col>
//                 <Col span={8}>
//                   <InputNumber
//                     min={0}
//                     addonBefore="Tax:"
//                     suffix="(%)"
//                     value={tax}
//                     onChange={(value) => setTax(value)}
//                   />
//                 </Col>
//               </Row>
//               <Divider style={{ borderColor: '#7cb305', margin: '5px' }} />
//               <div style={{
//                 fontWeight: 'bold',
//                 padding: '10px',
//                 borderRadius: "10px",
//                 boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//               }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                   <span>Subtotal:</span><span>$ {subTotal.toFixed(2)}</span>
//                 </div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                   <span>Tax:</span><span>% {tax ? tax.toFixed(2) : '0.00'}</span>
//                 </div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                   <span>Discount:</span><span>% {discount ? discount.toFixed(2) : '0.00'}</span>
//                 </div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                   <span>Bill:</span><span>$ {billUSD.toFixed(2)}</span>
//                 </div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                   <span></span><span>R {billRiel.toFixed(2)}</span>
//                 </div>
//                 <Divider style={{ borderColor: '#7cb305', margin: '5px' }} />
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                   <span>
//                     <InputNumber
//                       style={{ width: "180px" }}
//                       addonBefore="រៀល:"
//                       min={0}
//                       suffix="(R)"
//                       value={cashReceivedRiel}
//                       onChange={(value) => setCashReceivedRiel(value)}
//                       formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                       parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
//                     />
//                   </span>
//                   <span>
//                     <InputNumber
//                       style={{ width: "180px" }}
//                       addonBefore="USD:"
//                       min={0}
//                       suffix="($)"
//                       value={cashReceived}
//                       onChange={(value) => setCashReceived(value)}
//                       formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                       parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
//                     />
//                   </span>
//                 </div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//                   <span>Cash Change:</span>
//                   <span>R {(cashChange * exchangeRate).toFixed(2)}</span>
//                   <span>$ {cashChange.toFixed(2)}</span>
//                 </div>
//               </div>
//             </Splitter.Panel>
//             <Splitter.Panel>
//               <Divider style={{ borderColor: '#7cb305', margin: '5px', fontSize: '18px', fontWeight: "bold" }}>List Cart</Divider>
//                 <List
//                   itemLayout="horizontal"
//                   dataSource={[...cart].sort((a, b) => a.cartId - b.cartId)}
//                   renderItem={(item, index) => {
//                     const color = colorList[index % colorList.length];
//                     return (
//                       <List.Item
//                         key={item.cartId}
//                         actions={[<DeleteOutlined key="delete" style={{color:'red',fontSize:'18px',backgroundColor:"white", padding:"10px",borderRadius:"10px"}} onClick={() => handleDeleteCart(item)} />]}
//                         style={{
//                           backgroundColor: color,
//                           padding: "10px",
//                           borderRadius: "10px",
//                           margin: '3px',
//                           boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//                           transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.backgroundColor = '#f0f0f0';
//                           e.currentTarget.style.boxShadow = "0px 6px 8px rgba(0, 0, 0, 0.2)";
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.backgroundColor = color;
//                           e.currentTarget.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
//                         }}
//                       >
//                         <List.Item.Meta
//                           avatar={
//                             <Avatar
//                               src={
//                                 item.product.product_image
//                                   ? `${Config.image_path}${item.product.product_image}`
//                                   : 'https://via.placeholder.com/150'
//                               }
//                               alt={item.product.name}
//                             />
//                           }
//                           title={
//                             <div>
//                               <span>NO: {index + 1}</span>&nbsp;&nbsp;
//                               <span>Product: {item.product.name}</span>&nbsp;&nbsp;<br />
//                               <span>Total Price: {item.totalPrice.toFixed(2)} $</span>
//                             </div>
//                           }
//                           description={
//                             <InputNumber
//                               prefix="Qty"
//                               size="large"
//                               min={1}
//                               max={item.product.productQuantity}
//                               value={item.quantityCart}
//                               onChange={value => handleUpdateCart(item, value)}
//                             />
//                           }
//                         />
//                       </List.Item>
//                     );
//                   }}
//                 />
//             </Splitter.Panel>
//           </Splitter>
//         </Splitter.Panel>
//       </Splitter>

//       <h2>Data Order Item For Execl</h2>
//       <Space style={{ margin: "10px", padding: "10px" }}>
//         <span>Start</span>
//         <DatePicker onChange={(date) => setStartDate(date)} />
//         <span>End</span>
//         <DatePicker onChange={(date) => setEndDate(date)} />
//         <Button onClick={filterDataByDate}>Filter</Button>
//         <ExcelexportUtil data={filteredData} fileName={getExportFileName()} />
//       </Space>

//       <h2>Order List</h2>
//       <Row gutter={[8, 8]}>
//         <Col span={16}>
//           <Table
//             dataSource={order}
//             columns={orderColumns}
//             onRow={(record) => ({
//               onClick: () => {
//                 setLoading(true);
//                 getOrderItem(record.id);
//               },
//             })}
//           />
//         </Col>
//         <Col span={8}>
//           <Spin spinning={loading} tip="Loading" size="large">
//             <Table
//               dataSource={orderItem}
//               scroll={{ x: 600 }}
//               columns={orderItemColumns}
//             />
//           </Spin>
//         </Col>
//       </Row>

//       <Modal
//         title="Details"
//         open={isDescriptionModalOpen}
//         onCancel={() => setIsDescriptionModalOpen(false)}
//         width={650}
//         footer={[
//           <Button key="close" onClick={() => setIsDescriptionModalOpen(false)}>
//             Close
//           </Button>,
//         ]}
//       >
//         <div dangerouslySetInnerHTML={{ __html: selectedDescription }} />
//       </Modal>

//       {/* ផ្នែក invoice Receipt */}
//       <Modal
//         open={isModalOpen}
//         onCancel={() => closeModal()}
//         footer={[
//           <Button key="confirm" onClick={() => handleCheckout()}>Checkout</Button>,
//           <Button danger key="cancel" onClick={() => closeModal()}>Cancel</Button>,
//         ]}
//         width={400}
//       >
//         <div ref={componentRef} style={{ fontFamily: 'monospace', width: '58mm', margin: '0 auto', fontSize: '12px', lineHeight: '1.5' }}>
//           <div style={{ textAlign: 'center' }}>
//             <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Mega Ktv</div>
//             <div style={{ fontSize: '14px' }}>#123 Main St44, City, Country</div>
//             <div style={{ fontSize: '14px' }}>Phone: (012) 349-211</div>
//             <div style={{ fontSize: '12px' }}>
//               Date: {dayjs().format('YYYY-MM-DD')},
//               Time: {dayjs().format('HH:mm:ss')}
//             </div>
//           </div>
//           <Divider style={{ margin: '10px 0' }} />
//           <div style={{ fontWeight: 'bold' }}>Receipt:</div>
//           <div style={{ marginTop: '10px' }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr>
//                   <th style={{ textAlign: 'left', padding: '5px', borderBottom: '1px solid #ddd' }}>Item</th>
//                   <th style={{ textAlign: 'right', padding: '5px', borderBottom: '1px solid #ddd' }}>Price</th>
//                   <th style={{ textAlign: 'right', padding: '5px', borderBottom: '1px solid #ddd' }}>Qty</th>
//                   <th style={{ textAlign: 'right', padding: '5px', borderBottom: '1px solid #ddd' }}>Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.map((item, index) => (
//                   <tr key={index}>
//                     <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>{item.product.name}</td>
//                     <td style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>${item.product.price.toFixed(2)}</td>
//                     <td style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>{item.quantityCart}</td>
//                     <td style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>${item.totalPrice.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div style={{ fontWeight: 'bold', marginTop: '10px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//               <span>Subtotal</span><span>${subTotal.toFixed(2)}</span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//               <span>Tax</span><span>% {tax ? tax.toFixed(2) : '0.00'}</span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
//               <span>Discount</span><span>% {discount ? discount.toFixed(2) : '0.00'}</span>
//             </div>
//             <Divider style={{ margin: '10px 0' }} />
//             <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '17px' }}>
//               <span>Bill</span><span>${billUSD.toFixed(2)}</span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '17px' }}>
//               <span></span><span>R{billRiel.toFixed(2)}</span>
//             </div>
//           </div>
//           <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '20px' }}>
//             <span>Thank you for shopping with us!</span>
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// }

// export default App;





