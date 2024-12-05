import { Avatar } from "antd";

const customer = JSON.parse(localStorage.getItem("customer")) || {
    name: "Auth002",
    email: "auth002@gmail.com",
};

const Profile = () => {
    return (
        <div
            style={{
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#f0f2f5",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* Cover Photo */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "800px",
                    height: "200px",
                    backgroundImage: `url('https://cdn.pixabay.com/photo/2024/09/03/09/03/deer-9018759_1280.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    borderRadius: "8px",
                    marginBottom: "50px",
                }}
            >
                {/* Profile Picture */}
                <div
                    style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        border: "5px solid #fff",
                        position: "absolute",
                        bottom: "-75px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <Avatar
                        size={140} // Adjust size to fit inside the container
                        style={{
                            backgroundColor: "#87d068",
                            fontSize: "40px",
                        }}
                    >
                        {customer.name.charAt(0).toUpperCase()}
                    </Avatar>
                </div>
            </div>

            {/* User Info */}
            <div
                style={{
                    textAlign: "center",
                    marginTop: "50px",
                    color: "#1c1e21",
                }}
            >
                <h1 style={{ fontSize: "24px", margin: "10px 0" }}>{customer.name}</h1>
                <p style={{ fontSize: "16px", color: "#606770" }}>{customer.email}</p>
            </div>
        </div>
    );
};

export default Profile;
