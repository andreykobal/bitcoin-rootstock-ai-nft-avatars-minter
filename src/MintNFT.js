import React, { useState } from 'react';
import Web3 from 'web3';
import contractABI from './ContractABI';
import { NFTStorage, File, Blob } from 'nft.storage';

const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;

function MintNFT() {
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [attributes, setAttributes] = useState([]); // You'll have to build an interface to manage this array
    const [imageFile, setImageFile] = useState(null);
    const [animationFile, setAnimationFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [defaultAttributes, setDefaultAttributes] = useState({
        Voice: "",
        Age: "",
        Profession: "",
        Mood: "",
        Race: ""
    });
    const [customAttributes, setCustomAttributes] = useState([]);



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

    const uploadFileToIPFS = async (file) => {
        const blob = new Blob([file]);
        const cid = await client.storeBlob(blob);
        return `https://ipfs.io/ipfs/${cid}`;
    };

    async function switchToGoerli() {
        try {
            const CHAIN_ID = '0x5'; // Goerli Test Network
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: CHAIN_ID }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x5',
                            chainName: 'Goerli',
                            nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: ['https://goerli.infura.io/v3/076e36dcd6c6468da918dd54435a94f9'], // replace with your Infura Project ID
                            blockExplorerUrls: ['https://goerli.etherscan.io/'],
                        }],
                    });
                } catch (addError) {
                    console.error('Failed to add Goerli network', addError);
                }
            } else {
                console.error('Failed to switch to Goerli network', switchError);
            }
        }
    }

    const mintToken = async () => {
        if (window.ethereum) {
            try {
                // Switch to Goerli Test Network
                await switchToGoerli();

                setUploadStatus("Uploading metadata...");

                // Upload files
                const imageURL = await uploadFileToIPFS(imageFile);
                const animationURL = await uploadFileToIPFS(animationFile);

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

                const contractAddress = '0x9ECB90F11D7c609A9dD093f30a9201943D8036DB';
                const contract = new web3.eth.Contract(contractABI, contractAddress);

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
        padding: '8px',
        boxSizing: 'border-box'
    };

    const divStyle = {
        marginBottom: '8px'
    };

    return (
        <div style={{ maxWidth: '300px', width: '300px', margin: '0 auto' }}>
            <h2>Mint Your AI NFT</h2>
            <div style={divStyle}>
                <label style={labelStyle}>Name:</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            </div>
            <div style={divStyle}>
                <label style={labelStyle}>Description:</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} />
            </div>
            <div style={divStyle}>
                <label style={labelStyle}>Image:</label>
                <input type="file" onChange={e => handleFileChange(e, setImageFile)} style={inputStyle} />
            </div>
            <div style={divStyle}>
                <label style={labelStyle}>GLB:</label>
                <input type="file" onChange={e => handleFileChange(e, setAnimationFile)} style={inputStyle} />
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
                <button onClick={addCustomAttribute}>Add Custom Trait</button>
            </div>

            <button onClick={mintToken}>Mint</button>
            <div>{uploadStatus}</div>
        </div>
    );
}

export default MintNFT;
