const express = require('express'); 
const bodyParser = require('body-parser'); 
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public')); 

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Route for handling the form submission
app.post('/calculate', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);
    const age = parseInt(req.body.age);

    // Validate input
    if (!weight || !height || weight <= 0 || height <= 0 || isNaN(age) || age <= 0) {
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1 class="error-text">Error</h1>
                <p>Please enter valid and positive numbers for weight, height, and age.</p>
                <a href="/">Go back</a>
            </body>
            </html>
        `);
    }

    if (height > 3 || height < 0.5) {
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1 class="error-text">Error</h1>
                <p>The height value seems incorrect. Please enter your height in meters (e.g., 1.75 instead of 175).</p>
                <a href="/">Go back</a>
            </body>
            </html>
        `);
    }

    // Calculate BMI
    const bmi = (weight / (height * height)).toFixed(2);

    let category;
    let tips;
    if (bmi < 18.5) {
        category = 'Underweight';
        tips = 'Consider a balanced diet with more calories, and consult a healthcare provider for a personalized plan.';
    } else if (bmi < 24.9) {
        category = 'Normal weight';
        tips = 'Maintain your current lifestyle with regular exercise and a healthy diet.';
    } else if (bmi < 29.9) {
        category = 'Overweight';
        tips = 'Incorporate more physical activity into your routine and focus on portion control during meals.';
    } else {
        category = 'Obesity';
        tips = 'It is recommended to consult a healthcare provider to develop a weight-loss plan tailored to your needs.';
    }

    // Respond with the BMI result
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your BMI Result</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1>Your BMI Result</h1>
            <div class="result-container">
            <p>BMI: ${bmi}</p>
            <p>Category: ${category}</p>
            <p>Age: ${age} years</p>
            <p class="tips">Tips: ${tips}</p>
            <a href="/">Go back</a>
            </div>
        </body>
        </html>
    `);
});

// Start the server
const PORT = 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
