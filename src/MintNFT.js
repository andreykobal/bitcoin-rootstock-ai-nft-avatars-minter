import React, { useState, useEffect, useRef } from 'react';
import Web3 from 'web3';
import contractABI from './ContractABI';
import { NFTStorage, File, Blob } from 'nft.storage';

import btcLogo from './assets/btc.png';
import ethLogo from './assets/eth.png';

const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;

function MintNFT() {
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [attributes, setAttributes] = useState([]); // You'll have to build an interface to manage this array
    const [imageFile, setImageFile] = useState(null);
    const [animationFile, setAnimationFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [generatingStatus, setGeneratingStatus] = useState("");
    const [defaultAttributes, setDefaultAttributes] = useState({
        Voice: "Male", // Set a default value
        Age: "",
        Profession: "",
        Mood: "",
        Race: ""
    });
    const [customAttributes, setCustomAttributes] = useState([]);

    const [avaturnGLB, setAvaturnGLB] = useState(null);
    const avaturnIframeRef = useRef(null);

    const [network, setNetwork] = useState('Goerli');  // New state to manage chosen network


    useEffect(() => {
        function handleIframeEvent(event) {
            let json;
            try {
                json = JSON.parse(event.data);
            } catch (error) {
                console.log("Error parsing the event data.");
                return;
            }

            if (json.source !== "avaturn" || json.eventName !== "v2.avatar.exported") return;

            console.log("Received an avatar GLB from Avaturn.");
            setAvaturnGLB(json.data.url);
        }

        window.addEventListener("message", handleIframeEvent);
        return () => window.removeEventListener("message", handleIframeEvent);
    }, []);





    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

    const handleDefaultAttributeChange = (traitType, value) => {
        setDefaultAttributes(prevAttributes => ({
            ...prevAttributes,
            [traitType]: value
        }));
    };

    const addCustomAttribute = () => {
        setCustomAttributes(prevAttributes => [...prevAttributes, { trait_type: "", value: "" }]);
    };

    const updateCustomAttribute = (index, field, value) => {
        const newAttributes = [...customAttributes];
        newAttributes[index][field] = value;
        setCustomAttributes(newAttributes);
    };

    const handleFileChange = (event, setFile) => {
        const file = event.target.files[0];
        setFile(file);
    };

    const uploadFileToIPFS = async (fileOrUrl) => {
        let blob;
        if (typeof fileOrUrl === 'string') {
            const response = await fetch(fileOrUrl);
            blob = await response.blob();
        } else {
            blob = new Blob([fileOrUrl]);
        }
        const cid = await client.storeBlob(blob);
        return `https://ipfs.io/ipfs/${cid}`;
    };


    async function switchToNetwork() {
        const NETWORKS = {
            'Goerli': {
                chainId: '0x5',
                chainName: 'Goerli',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://goerli.infura.io/v3/076e36dcd6c6468da918dd54435a94f9'],
                blockExplorerUrls: ['https://goerli.etherscan.io/']
            },
            'Rootstock': {
                chainId: '0x1F',
                chainName: 'RSK Testnet',
                nativeCurrency: {
                    name: 'tRBTC',
                    symbol: 'tRBTC',
                    decimals: 18
                },
                rpcUrls: ['https://public-node.testnet.rsk.co'],
                blockExplorerUrls: ['https://explorer.testnet.rsk.co']
            }
        };

        const currentNetwork = NETWORKS[network];
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: currentNetwork.chainId }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [currentNetwork],
                    });
                } catch (addError) {
                    console.error(`Failed to add ${network} network`, addError);
                }
            } else {
                console.error(`Failed to switch to ${network} network`, switchError);
            }
        }
    }

    const fetchRandomData = async () => {
        try {
            setGeneratingStatus("Generating random metadata...");

            const response = await fetch("https://ai-nft-openai-server-78b2502171bf.herokuapp.com/generate-completion", {
                method: "POST"
            });
            const data = await response.json();
            const content = JSON.parse(data.content); // Parse the content string

            // Destructure and set data to the states
            setName(content.name);
            setDescription(content.description);

            // Assuming attributes are always in the same order
            // If not, you might want to loop through and find the right attribute
            setDefaultAttributes(prevAttributes => ({
                ...prevAttributes,
                //Voice: content.attributes[0].value,
                Age: content.attributes[1].value,
                Profession: content.attributes[2].value,
                Mood: content.attributes[3].value,
                Race: content.attributes[4].value
            }));

            setGeneratingStatus(""); // Clear the generating status
        } catch (error) {
            console.error("Error fetching random data:", error);

            setGeneratingStatus(""); // Clear the generating status

        }
    };

    const mintToken = async () => {
        if (window.ethereum) {
            try {

                // Switch to chosen network
                await switchToNetwork();

                setUploadStatus("Uploading metadata...");

                // Upload files
                const imageURL = await uploadFileToIPFS(imageFile);
                const animationURL = avaturnGLB ? await uploadFileToIPFS(avaturnGLB) : await uploadFileToIPFS(animationFile);


                // Construct metadata
                const metadata = {
                    description,
                    external_url: "https://ailand.app/",
                    image: imageURL,
                    name,
                    animation_url: animationURL,
                    attributes: [
                        ...Object.entries(defaultAttributes).map(([trait_type, value]) => ({
                            trait_type,
                            value
                        })),
                        ...customAttributes
                    ]
                };

                // Upload metadata
                const metadataBlob = new Blob([JSON.stringify(metadata)]);
                const metadataCID = await client.storeBlob(metadataBlob);
                const tokenURI = `https://ipfs.io/ipfs/${metadataCID}`;

                // Continue with your minting process
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3 = new Web3(window.ethereum);

                const contractAddressEth = '0x9ECB90F11D7c609A9dD093f30a9201943D8036DB';
                const contractAbiEth = contractABI.contractAbiEth;

                const contractAddressBitcoin = '0xaC7e4Ad5d7557B78ebc84Dff668A06709f5Dc62B';
                const contractAbiBitcoin = contractABI.contractAbiBitcoin;

                // Choose the right contract and ABI based on network
                let chosenContractAddress, chosenContractABI;
                if (network === 'Goerli') {
                    chosenContractAddress = contractAddressEth;
                    chosenContractABI = contractAbiEth;
                } else if (network === 'Rootstock') {
                    chosenContractAddress = contractAddressBitcoin;
                    chosenContractABI = contractAbiBitcoin;
                }

                const contract = new web3.eth.Contract(chosenContractABI, chosenContractAddress);

                if (network === 'Goerli') {
                    const gasEstimate = await contract.methods.mint(accounts[0], tokenURI).estimateGas({ from: accounts[0] });
                    const gasPriceWei = '1500000000';

                    const transaction = contract.methods.mint(accounts[0], tokenURI).send({
                        from: accounts[0],
                        gas: gasEstimate,
                        gasPrice: gasPriceWei
                    });

                    transaction.on('transactionHash', function (hash) {
                        console.log('Transaction Hash:', hash);
                    });

                    await transaction;
                } else if (network === 'Rootstock') {
                    // Removed the line that estimates the gas
                    const gasPriceWei = '1500000000';
                    const hardcodedGas = '300000'; // This is a standard gas limit for simple transactions, you might need to adjust this value

                    const transaction = contract.methods.mintItem(tokenURI).send({
                        from: accounts[0],
                        gas: hardcodedGas, // Using the hardcoded gas value here
                        gasPrice: gasPriceWei
                    });

                    transaction.on('transactionHash', function (hash) {
                        console.log('Transaction Hash:', hash);
                    });

                    await transaction;
                }



                setUploadStatus(""); // Reset the status

                alert('Token Minted!');
            } catch (error) {
                console.error("Error minting token: ", error);
                alert("Error minting token");
                setUploadStatus(""); // Reset the status

            }
        } else {
            alert('Ethereum not detected! Please install and setup MetaMask.');
        }
    };


    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        marginTop: '8px',
        fontWeight: 'bold',
        fontSize: '14px',
        textAlign: 'left'


    };

    const inputStyle = {
        width: '100%',
        padding: '4px',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        height: '30px',
    };

    const divStyle = {
        marginBottom: '8px'
    };

    const randomizeButtonStyle = {
        backgroundColor: '#8E52F5',
    };

    return (
        <div className="mint-container"> {/* Flex container */}

            <iframe
                ref={avaturnIframeRef}
                src="https://demo.avaturn.dev"
                className="iframeStyle"
            >
            </iframe>
            <div className="sidebar">
                <div style={{ padding: '20px' }}>
                    <h1 style={{ textAlign: 'center' }}>Mint Your AI NFT Avatar</h1>

                    <div style={divStyle}>
                        <label style={labelStyle}>Name:</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                    </div>
                    <div style={divStyle}>
                        <label style={labelStyle}>Description:</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, resize: 'none', minHeight: '100px', fontFamily: 'Roboto, Helvetica, sans-serif'  }} />
                    </div>
                    <div style={divStyle}>
                        <label style={labelStyle}>Image:</label>
                        <input type="file" onChange={e => handleFileChange(e, setImageFile)} style={inputStyle} />
                    </div>
                    <div style={divStyle}>
                        <label style={labelStyle}>GLB:</label>
                        {
                            avaturnGLB ?
                                <div style={{ ...inputStyle, textAlign: 'center', lineHeight: '18px', fontSize: '14px' }}>Avaturn Avatar Used</div> :
                                <input type="file" onChange={e => handleFileChange(e, setAnimationFile)} style={inputStyle} />
                        }
                    </div>

                    <div>
                        {/* Default attributes interface */}
                        {Object.entries(defaultAttributes).map(([traitType, value]) => (
                            <div key={traitType} style={divStyle}>
                                <label style={labelStyle}>{traitType}:</label>
                                {traitType === "Voice" ? (
                                    <select
                                        value={value}
                                        onChange={e => handleDefaultAttributeChange(traitType, e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Robotic">Robotic</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={e => handleDefaultAttributeChange(traitType, e.target.value)}
                                        style={inputStyle}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div>
                        {/* Custom attributes interface */}
                        {customAttributes.map((attribute, index) => (
                            <div key={index} style={divStyle}>
                                <input
                                    type="text"
                                    placeholder="Trait Type"
                                    value={attribute.trait_type}
                                    onChange={e => updateCustomAttribute(index, "trait_type", e.target.value)}
                                    style={inputStyle}
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={attribute.value}
                                    onChange={e => updateCustomAttribute(index, "value", e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        ))}
                        {/*<button onClick={addCustomAttribute}>Add Custom Trait</button>*/}
                    </div>

                    <div>

                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}><b>Select Network:</b></label>
                            <label style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
                                <input
                                    type="radio"
                                    value="Goerli"
                                    checked={network === 'Goerli'}
                                    onChange={() => setNetwork('Goerli')}
                                    style={{ marginRight: '5px' }}
                                />
                                <img src={ethLogo} alt="Ethereum logo" style={{ width: '20px', marginRight: '5px' }} /> Ethereum
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="radio"
                                    value="Rootstock"
                                    checked={network === 'Rootstock'}
                                    onChange={() => setNetwork('Rootstock')}
                                    style={{ marginRight: '5px' }}
                                />
                                <img src={btcLogo} alt="Bitcoin logo" style={{ width: '20px', marginRight: '5px' }} /> Bitcoin
                            </label>
                        </div>                    </div>

                    <div style={{textAlign: 'center'}}>
                    <button style={randomizeButtonStyle} onClick={fetchRandomData}>Randomize</button>
                    <button onClick={mintToken}>Mint</button>
                    <div>{uploadStatus}</div>
                    <div>{generatingStatus}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MintNFT;
