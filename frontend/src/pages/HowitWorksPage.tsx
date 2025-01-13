import React, { useState } from 'react';

const HowitWorksPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell');
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const pageStyle: React.CSSProperties = {
        backgroundImage: 'url(/genericbackground.png)',
        backgroundColor: 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        minHeight: '100vh', // Use minHeight instead of height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        flexDirection: 'column', // Allow stacking of content
    };

    const cardStyle: React.CSSProperties = {
        background: 'white',
        borderRadius: '10px',
        padding: '30px',
        width: '95%',
        maxWidth: '1200px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    };

    const tabStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer',
        borderBottom: '2px solid #fff',
        marginBottom: '10px',
    };

    const tabButtonStyle: React.CSSProperties = {
        padding: '10px 20px',
        border: 'none',
        background: 'transparent',
        color: '#5c1a99',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'color 0.3s, transform 0.3s',
    };

    const activeTabButtonStyle: React.CSSProperties = {
        ...tabButtonStyle,
        borderBottom: '2px solid #5c1a99',
    };

    const hoverStyle: React.CSSProperties = {
        color: '#f8e29c',
        transform: 'scale(1.1)',
    };

    const stepsContainerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    };

    const stepStyle: React.CSSProperties = {
        flex: '1 1 30%',
        textAlign: 'center',
        fontWeight: 'bold',
        padding: '20px',
        borderRadius: '5px',
        margin: '0 10px',
        color: '#4b0082',
    };

    const stepImageStyle: React.CSSProperties = {
        width: '300px',
        height: '300px',
        objectFit: 'cover',
        borderRadius: '10px',
        marginBottom: '10px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    };

    const stepsContent = {
        sell: [
            {
                image: '/uploadproduct.jpg',
                text: 'Upload your product',
                subtitle: 'Upload items for sale.',
            },
            {
                image: '/sharewith.jpg',
                text: 'Share with your Penn community',
                subtitle: 'Get approved within 24 hours!',
            },
            {
                image: '/delivery.jpg',
                text: 'Drop it off at delivery location',
                subtitle: 'Pick up agora custom packaging or package yourself.',
            },
        ],
        buy: [
            {
                image: '/browse.png',
                text: 'Browse items at anytime',
                subtitle: 'Explore a variety of items available for purchase.',
            },
            {
                image: '/addtocart.jpg',
                text: 'Add items to your cart',
                subtitle: 'Select your favorite items and checkout.',
            },
            {
                image: '/openpackage.png',
                text: 'Get delivered right to your dorm',
                subtitle: 'Enjoy hassle-free delivery to your location.',
            },
        ],
    };

    // Styles for the guarantees section
    const guaranteesContainerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '20px',
        backgroundColor: '#f8f8f8',
        borderTop: '1px solid #ccc',
    };

    const guaranteeStyle: React.CSSProperties = {
        flex: '1',
        textAlign: 'center',
        padding: '10px',
        fontWeight: 'bold',
        color: '#f8e29c',
    };

    const faqData = [
        {
            question: "My product is not getting approved within a 24 hour period, what can I do?",
            answer: "Submit an inquiry to the customer support team at agoraupenn@gmail.com"
        },
        {
            question: "My product never arrived/is not as advertised, what now?",
            answer: "Submit an inquiry to the customer support team at agoraupenn@gmail.com, we will be in contact with you about a refund!"
        },
        {
            question: "I want to use agora packaging, where do I get it?",
            answer: "Please check out our instagram page agora.upenn for details on how to pick up agora packaging or feel free to package yourself!"
        },
        {
            question: "How do package deliveries work?",
            answer: "The seller is responsible for packaging and delivering the product."
        },
        {
            question: "My product is too large to package - what do I do?",
            answer: "Packaging is optional, so feel free to deliver the item as is."
        },
        {
            question: "Who runs agora?",
            answer: "Agora was founded and is managed by students at Penn."
        },
        {
            question: "Is there a fee for listing items?",
            answer: "Nope! You can list as many items as you’d like without worrying about a listing fee."
        },
        {
            question: "Okay so I made a sale…how will I get paid?",
            answer: "If the item is delivered within 3 days of purchase, you will be paid through direct deposit through the bank account you signed up with. We use Stripe to make sure that all payments are encrypted, seamless, and safe."
        },
        {
            question: "What items are allowed or restricted for sale?",
            answer: "Allowed: Physical products of any kind (clothes, appliances, accessories, electronics, etc.), Handmade items (like art, etc.), Physical educational materials (like textbooks). Not Allowed: Food, Drinks, Services, Anything Illegal."
        },
        {
            question: "I want to make a purchase. What payment methods are accepted on agora?",
            answer: "We accept all debit/credit cards. Apple Pay, Google Pay, and PayPal coming soon!"
        },
        {
            question: "Can I leave feedback or reviews for sellers?",
            answer: (
                <>
                    If you’d like to leave seller feedback, please submit your feedback to this google form: 
                    <a href='https://forms.gle/zsNVSjTRSqryyrUGA' target="_blank" rel="noopener noreferrer"> Feedback Form</a>
                </>
            )
        },
        {
            question: "What size is the agora packaging?",
            answer: "Packaging dimensions are 10” x 13”. Custom package sizing/type for our sellers is coming soon!"
        },
        {
            question: "What if I’m unsure if my item is allowed to be sold on agora?",
            answer: "Ask us! Please send us an inquiry at agoraupenn@gmail.com"
        },
        {
            question: "What if I see an error/bug or something on the site isn’t working for me?",
            answer: "Please let us know ASAP at agoraupenn@gmail.com"
        },
    ];

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <div style={tabStyle}>
                    <button
                        style={{
                            ...tabButtonStyle,
                            ...(activeTab === 'sell' ? activeTabButtonStyle : {}),
                            ...(hoveredTab === 'sell' ? hoverStyle : {}),
                        }}
                        onClick={() => setActiveTab('sell')}
                        onMouseEnter={() => setHoveredTab('sell')}
                        onMouseLeave={() => setHoveredTab(null)}
                    >
                        How to Sell
                    </button>
                    <button
                        style={{
                            ...tabButtonStyle,
                            ...(activeTab === 'buy' ? activeTabButtonStyle : {}),
                            ...(hoveredTab === 'buy' ? hoverStyle : {}),
                        }}
                        onClick={() => setActiveTab('buy')}
                        onMouseEnter={() => setHoveredTab('buy')}
                        onMouseLeave={() => setHoveredTab(null)}
                    >
                        How to Buy
                    </button>
                </div>
                <div style={stepsContainerStyle}>
                    {stepsContent[activeTab].map((step, index) => (
                        <div key={index} style={stepStyle}>
                            <img
                                src={step.image}
                                alt={step.text}
                                style={stepImageStyle}
                            />
                            <div>{step.text}</div>
                            <div style={{ fontSize: '14px', color: '#ccc', marginTop: '5px' }}>{step.subtitle}</div>
                        </div>
                    ))}
                </div>
                {/* New Guarantees Section */}
                <div style={guaranteesContainerStyle}>
                    <div style={guaranteeStyle}>
                        <h3>Shop for products vetted by us.</h3>
                    </div>
                    <div style={guaranteeStyle}>
                        <h3>Protected payment: if it's not what you ordered, your money back.</h3>
                    </div>
                    <div style={guaranteeStyle}>
                        <h3>No shipping fees!</h3>
                    </div>
                </div>
                {/* New FAQ Section */}
                <div style={{ color: '#4b0082' }}>
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-container">
                        {faqData.map((faq, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <div 
                                    onClick={() => toggleFAQ(index)} 
                                    style={{ 
                                        cursor: 'pointer', 
                                        padding: '10px', 
                                        background: '#f0f0f0', 
                                        borderRadius: '5px', 
                                        marginBottom: '5px', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center' 
                                    }}
                                >
                                    <strong>{faq.question}</strong>
                                    <span className={`arrow ${openIndex === index ? 'open' : ''}`}>▼</span>
                                </div>
                                <div 
                                    className={`answer ${openIndex === index ? 'show' : ''}`} 
                                    style={{ overflow: 'hidden', transition: 'max-height 0.3s ease' }}
                                >
                                    <div style={{ padding: '10px', background: '#e9e9e9', borderRadius: '5px' }}>
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowitWorksPage;