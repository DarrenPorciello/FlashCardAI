import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post("/", async (req, res) => {

    const { messages } = req.body;
    console.log(messages)
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "system", "content": "You are going to create study questions based off of content given. Create only 'n' questions based off of the information provided, where 'n' is the number provided as the first character in the query. You absolutely must provide the answers within square brackets. Absolutely do not label questions with numbers."},
            //{role: "user", content: `${message}`},
            ...messages

        ]
    });

    res.json({
        completion: completion.data.choices[0].message
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

