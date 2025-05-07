import express from "express"

const subscription = express();

const pricingPlans = [
    {
        save: "Save 73%",
        name: 'Basic',
        price_per_month: "$2.99 /mo",
        extra: "+ 3 Extra months",
        total_price: "$304.83 ",
        new_prise: "$80.73",
        button: "Get Basic",
        time_duration: "27 months",
        features: [
            'Secure, high-speed VPN',
            '30-day money-back guarantee'
        ]
    },
    {
        save: "Save 73%",
        name: 'Plus',
        price_per_month: "$3.89 /mo",
        extra: "+ 3 Extra months",
        total_price: "$393.93",
        new_prise: "$105.03",
        button: "Get Plus",
        time_duration: "27 months",
        features: [
            'Secure, high-speed VPN',
            'Threat Protection Pro™: Anti-malware and advanced browsing protection',
            'Threat Protection Pro™: Ad and tracker blocker',
            'Password manager with Data Breach Scanner',
            '30-day money-back guarantee'
        ]
    },
    {
        save: "Save 72%",
        name: 'Complete',
        price_per_month: "$4.89 /mo",
        extra: "+ 3 Extra months",
        total_price: "$480.33",
        new_prise: "$132.03",
        button: "Get Complete",
        time_duration: "27 months",
        features: [
            'Secure, high-speed VPN',
            'Threat Protection Pro™: Anti-malware and advanced browsing protection',
            'Threat Protection Pro™: Ad and tracker blocker',
            'Password manager with Data Breach Scanner',
            '1 TB of encrypted cloud storage',
            '30-day money-back guarantee'
        ]
    }
];

subscription.get('/subscription', (req, res) => {
    res.json(pricingPlans);
});
export default subscription
