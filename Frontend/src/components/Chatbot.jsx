import React, { useState, useRef, useEffect } from "react";
import { Button, Input, List, Avatar, Typography, Card } from "antd";
import { MessageOutlined, CloseOutlined, SendOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your assistant. How can I help you today?", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage = { id: Date.now(), text: inputValue, sender: "user" };
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");

        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(userMessage.text);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: "bot" }]);
        }, 600);
    };

    const getBotResponse = (text) => {
        const lowerText = text.toLowerCase();
        switch (true) {
            case lowerText.includes("hello"):
            case lowerText.includes("hi"):
                return "Hello there! Looking for something specific?";
            case lowerText.includes("price"):
            case lowerText.includes("cost"):
                return "Our component prices vary. Check out the product details for specific pricing!";
            case lowerText.includes("return"):
            case lowerText.includes("refund"):
                return "We offer a 30-day return policy on all unused items. Contact support for details.";
            case lowerText.includes("shipping"):
            case lowerText.includes("delivery"):
                return "Standard shipping takes 3-5 business days. Express options are available at checkout.";
            case lowerText.includes("contact"):
            case lowerText.includes("support"):
                return "You can reach us via the Contact page or email support@example.com.";
            case lowerText.includes("thank"):
                return "You're welcome! Happy shopping!";
            default:
                return "I'm not sure about that. Try asking about shipping, returns, or prices, or visit our Contact page.";
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <Card
                    className="w-[300px] h-[400px] mb-4 flex flex-col shadow-xl"
                    styles={{
                        body: {
                            padding: 0,
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            height: "100%"
                        }
                    }}
                    title={
                        <div className="flex justify-between items-center">
                            <span><RobotOutlined className="mr-2" /> Assistant</span>
                            <Button type="text" size="small" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} />
                        </div>
                    }
                >
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        <List
                            dataSource={messages}
                            split={false}
                            renderItem={item => (
                                <div className={`flex mb-2 ${item.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] px-3 py-2 rounded-xl shadow-sm ${item.sender === "user"
                                            ? "bg-blue-500 text-white"
                                            : "bg-white text-gray-800"
                                            }`}
                                    >
                                        <Text className={item.sender === "user" ? "text-white" : "text-gray-800"}>
                                            {item.text}
                                        </Text>
                                    </div>
                                </div>
                            )}
                        />
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
                        <Input
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onPressEnter={handleSend}
                            placeholder="Type a message..."
                            className="flex-1"
                        />
                        <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
                    </div>
                </Card>
            )}
            <Button
                type="primary"
                shape="circle"
                size="large"
                icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
                className="w-14 h-14 shadow-lg flex items-center justify-center"
                onClick={() => setIsOpen(!isOpen)}
            />
        </div>
    );
};

export default Chatbot;
