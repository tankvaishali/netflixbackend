import express from "express"

const subscription = express();

const pricingPlans = [
    {
        name: 'Basic',
        price_per_month: 2.99,
        total_price: 80.73,
        original_price: 300.63,
        duration_months: 27,
        features: [
            'Secure, high-speed VPN',
            '30-day money-back guarantee'
        ]
    },
    {
        name: 'Plus',
        price_per_month: 3.89,
        total_price: 105.03,
        original_price: 393.93,
        duration_months: 27,
        features: [
            'Secure, high-speed VPN',
            'Threat Protection Pro™: Anti-malware and advanced browsing protection',
            'Threat Protection Pro™: Ad and tracker blocker',
            'Password manager with Data Breach Scanner',
            '30-day money-back guarantee'
        ]
    },
    {
        name: 'Complete',
        price_per_month: 4.89,
        total_price: 132.03,
        original_price: 480.33,
        duration_months: 27,
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
