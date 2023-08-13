const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));

const PORT = 3001; // Feel free to change the port

app.use(express.json()); // Middleware for parsing JSON body

app.post('/generate-completion', async (req, res) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_TOKEN,
    });

    const openai = new OpenAIApi(configuration);

    try {
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a creative model that designs game characters for a fictional universe called AILAND, set in 2052. AILAND is under threat from the Mekanoids, with various cities, leaders, and systems involved. Your objective is to come up with a new character based on a given template."
                },
                {
                    role: "user",
                    content:
                        'Come up with a json object with a new random game character for AILAND is a magical version of the year 2052, but it\'s currently under threat from the Mekanoids, creatures blending AI, robotics, and insect DNA, seeking to disrupt harmony. Queen Artesia, its leader, and her consort lead a strong resistance. The corrupted city of GARATON, once prosperous, now symbolizes tyranny under Artesia\'s sister, Queen Tryst, who commands the Mekanoids. The Elite live lavishly through injustice, supported by advanced tech and ancient wisdom, while most suffer. Amidst the turmoil, hope resides in ARTIMUS, an underground city, and its SYRO system, connecting dimensions for a brighter future. based on the template: {"description":"CHARACTER_DESCIPTION_AND_BIO_ARTICLE","external_url":"https://ailand.app/","image":"URL_STRING","name":"FIRST_AND_LAST_NAME","animation_url":"URL2_STRING","attributes":[{"trait_type":"Voice","value":"VOICE_STRING"},{"trait_type":"Age","value":"AGE_NUMBRE"},{"trait_type":"Profession","value":"PROFESSION_STRING"},{"trait_type":"Mood","value":"MOOD_STRING"},{"trait_type":"Race","value":"RACE_STRING"}]}'
                }
            ],
        });

        res.json(chatCompletion.data.choices[0].message);
    } catch (error) {
        console.error('Error generating completion:', error);
        res.status(500).send('Error generating completion');
    }
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || PORT}`);
});