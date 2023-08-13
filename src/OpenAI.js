import { Configuration, OpenAIApi } from "openai";

export async function generateOpenAiCompletion() {
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_TOKEN,
  });

  const openai = new OpenAIApi(configuration);

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content:
          'Come up with a random json object with a character based on the template: {"description":"Sylas, a human sorcerer from GARATON, employs dark magic to spy on Queen Tryst and the Mekanoids, gathering intel for the resistance.","external_url":"https://ailand.app/","image":"https://ipfs.io/ipfs/bafybeihdcrj3xot46gdokxoexaulem7qc7dgcu7sn46ddjlmgmwavfhbia","name":"Sylas Nightshade","animation_url":"https://ipfs.io/ipfs/bafybeigmlybxsjpxj6supocvvoavdx7zutfqeyyrdnejrmbe6lp6id5kwq","attributes":[{"trait_type":"Voice","value":"Male"},{"trait_type":"Age","value":"45"},{"trait_type":"Profession","value":"Sorcerer and Spy"},{"trait_type":"Mood","value":"Mysterious and Calculative"},{"trait_type":"Race","value":"Human"}]} '},
    ],
  });

  return chatCompletion.data.choices[0].message;
}
