# Minting AI NFT Avatars on Bitcoin
## Frontend, Smart Contract, Unity Integration, AI Integration and Voice Interactions

This repository hosts a cutting-edge solution that enables users to create, mint, and interact with AI NFT avatars on <img src="https://github.com/andreykobal/bitcoin-rootstock-ai-nft-avatars-minter/assets/19206978/22cee888-e3b9-48b3-8e93-51bec8eae4f1" width="16px"/> Bitcoin.

- Users can transform their selfies into animated avatars using this solution.
- The avatars can be enhanced with custom or AI-generated traits, allowing for personalized customization.
- Users have the option to change the avatars' appearance and clothing.
- The avatars can be used as skins in a next-generation shooter game [AILAND](https://ailand.app).
- Interaction with avatars in the game is possible through voice or text commands.
- The solution integrates with the Bitcoin testnet.
- Rootstock, a Layer 3 scaling solution for Bitcoin, facilitates the integration with the testnet.
- This integration creates a unique combination of AI, NFT, and Blockchain technologies.

![ezgif-2-13fe487f03](https://github.com/andreykobal/bitcoin-rootstock-ai-nft-avatars-minter/assets/19206978/fececf5c-be4e-42e2-a2c7-289f80d5ba1f)

## Video Demo 

[YouTube: 🌟 Minting AI NFT Avatars on Bitcoin: An Immersive Guide! 🚀 ](https://www.youtube.com/watch?v=T9QJgNFNJIE)

## Demo

[🌟 **Mint Your AI NFT Avatar on AILAND** 🌟](https://simple-nft-minter-xt5p.vercel.app/)

**Step 1: Refill Your Wallet**
1. 🛠️ Refill your Metamask wallet with testnet Bitcoin Rootstock tokens.
2. 🔗 Visit [faucet.rsk.co](https://faucet.rsk.co/).
3. 📝 Follow the on-screen instructions to complete the process.

**Step 2: Create Your Avatar**
1. 📸 Use your selfies to make a personalized avatar.
2. 🧑‍🎨 Customize its appearance and clothes to your liking.
3. 🔍 Click 'Next' and watch for the message 'Avaturn avatar used' in the GLB input field.

**Step 3: Add Personality**
1. 🧠 Fill in avatar's personality details in the form.
2. 🎲 Or click 'Randomize' for an AI-generated personality.

**Step 4: Choose Network**
1. ⚡ Select the Bitcoin network from the options.

**Step 5: Mint Your Avatar**
1. 💎 Click 'Mint' and confirm the transaction in your Metamask wallet.

**Step 6: Let the Fun Begin!**
1. 🎮 Use your avatar in AILAND game for immersive interactions.
2. 💬 Engage via text or voice interactions.
3. 👾 Also use your avatar as a skin in the game for a unique experience.

Enjoy the magic of AI-powered avatars in the exciting world of AILAND! 🌈🎉🚀


## Features

- **Selfie to Avatar**: Instantly turn your selfie into an animated avatar.
  
- **Customization & Traits**: Personalize your avatar with custom traits, such as name, bio, etc. or choose from AI-generated traits to make your avatar unique.
  
- **Interactivity**: Engage with your avatar through voice or text commands.
  
- **Game Integration**: Use your minted avatar as a skin in supported games.
  
- **Blockchain Deployment**: Mint your AI NFT avatar directly to the Bitcoin testnet using the Rootstock layer 3 solution.

## Prerequisites

1. Node.js & npm
2. MetaMask browser extension

## Setup

1. Clone the repository:

```bash
git clone https://github.com/andreykobal/bitcoin-rootstock-ai-nft-avatars-minter
```

2. Navigate to the project directory:

```bash
cd ai-nft-avatar-minting
```

3. Install the required packages:

```bash
npm install
```

4. Create a `.env` file in the root directory and set the `REACT_APP_NFT_STORAGE_TOKEN` variable with your token from [NFT.Storage](https://nft.storage/):

```bash
REACT_APP_NFT_STORAGE_TOKEN=YOUR_NFT_STORAGE_TOKEN
```

5. Run the application:

```bash
npm start
```

6. Build for production use
```bash
npm run build
```

Now, open your browser and navigate to `http://localhost:3000` to see the application in action!

## Code Highlights:

1. **Switching To Bitcoin Testnet Network:**

   Users have the flexibility to switch between Ethereum networks, making the platform versatile.
   ```javascript
   async function switchToNetwork() {
       // Network configurations...
       await window.ethereum.request({
           method: 'wallet_switchEthereumChain',
           params: [{ chainId: currentNetwork.chainId }],
       });
   }
   ```

2. **Minting NFTs:**

   Seamless integration for minting NFTs, including error handling.
   ```javascript
   const mintToken = async () => {
       if (window.ethereum) {
           // Uploading, metadata generation and minting...
       } else {
           alert('Ethereum not detected! Please install and setup MetaMask.');
       }
   };
   ```

3. **AI-Generated Traits:**

   Fetch random metadata generated by AI for the avatar's traits.
   ```javascript
   const fetchRandomData = async () => {
       const response = await fetch("<API_URL>");
       const content = JSON.parse(data.content);
       setName(content.name);
       setDescription(content.description);
       // ... setting other attributes
   };
   ```

   `server.js`
   The server listens for POST requests to /generate-completion and uses the OpenAI API to generate a game character based on a given context and template, then sends the response to the client.
    ```javascript
    app.post('/generate-completion', async (req, res) => {
        // ...
        const chatCompletion = await openai.createChatCompletion({ /*...*/ });
        res.json(chatCompletion.data.choices[0].message);
        // ...
    });
    ```

    Explanation:
    The server listens for POST requests to `/generate-completion` and uses the OpenAI API to generate a game character based on a given context and template, then sends the response to the client.

5. **IPFS Integration:**

   We utilize the InterPlanetary File System (IPFS) for decentralized storage.
   ```javascript
   const uploadFileToIPFS = async (fileOrUrl) => {
       // ... file upload logic
       const cid = await client.storeBlob(blob);
       return `https://ipfs.io/ipfs/${cid}`;
   };
   ```

6. **Smart Contract, Unity Integration,  AI Interactions, Speech SDK**

   To learn more about how we built the entire infrastructure see the code and README in this repository in the `/ai-nft-implementation` folder

   [AI NFT Implementation](https://github.com/andreykobal/bitcoin-rootstock-ai-nft-avatars-minter/tree/master/ai-nft-implementation)

## Usage

1. **Selfie to Avatar**: Upload your selfie and watch as it gets transformed into an animated avatar.
2. **Traits Customization**: Personalize your avatar's traits using the sidebar. Choose custom values or click the "Randomize" button for AI-generated traits.
3. **Mint to Blockchain**: Once satisfied, mint your avatar as an NFT to the Bitcoin testnet using Rootstock. Ensure your MetaMask is set to the correct network.
4. **Interact & Play**: Once minted, you can engage with your avatar or use it as a skin in supported games.

## 🎮 Extended Features and In-Game Integration

This repository goes beyond a simple frontend for minting AI NFT avatars. It encompasses a comprehensive ecosystem that enables users to transform selfies into customizable avatars and interact with them through both text and voice.


### **Game Integration with Unity**
Our solution integrates with Unity, allowing users to use their unique avatars as skins in the AILAND shooter game. This personalization adds a fresh and immersive experience for users, giving real value to their NFTs beyond mere collection.

### **Voice and Text Interactions with AI-Powered Avatars**
Leveraging cutting-edge AI technology for a new level of engagement with NFT avatars. Want to communicate with your avatar? With our state-of-the-art AI integrations, you can! Engage in text or voice chats with your avatar, opening up avenues for storytelling, gaming strategies, or simply some light-hearted fun.

### **Smart Contract Implementations**
This repository provides a comprehensive solution with full smart contract implementations tailored for the Rootstock (Layer 3 scaling solution for Bitcoin). This ensures not just a unique user experience but also a robust and secure transaction environment for minting and transferring the NFTs.

### **Learn more**
To explore the full implementation and delve into the specifics of the AI integration, Unity code, smart contracts, and more, check out the detailed documentation and code **here:** **[AI NFT Implementation](https://github.com/andreykobal/bitcoin-rootstock-ai-nft-avatars-minter/tree/master/ai-nft-implementation)**


![ezgif-4-3cb7c758e1](https://github.com/andreykobal/bitcoin-rootstock-ai-nft-avatars-minter/assets/19206978/0e475dea-244a-4059-b516-74b3c84ad1e7)


## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE) file for details.

---

Feel free to star this repository if you find it useful and innovative! If you face any issues, please open an issue, and we'll be happy to assist you.
