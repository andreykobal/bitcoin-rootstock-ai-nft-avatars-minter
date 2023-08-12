import React, { useState } from 'react';
import Web3 from 'web3';
import contractABI from './ContractABI';

function MintNFT() {
  const [tokenURI, setTokenURI] = useState('');

  const mintToken = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum); 
        
        const contractAddress = '0x1Dfcb33950422020c93dA6Cb0aB5e7c70Ce1a79C';
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        const gasEstimate = await contract.methods.mintItem(tokenURI).estimateGas({ from: accounts[0] });
        const gasPriceWei = '1500000000'; // Directly setting the gas price in Wei
        
        const transaction = contract.methods.mintItem(tokenURI).send({
          from: accounts[0],
          gas: gasEstimate,
          gasPrice: gasPriceWei
        });

        transaction.on('transactionHash', function(hash){
          console.log('Transaction Hash:', hash);
        });

        await transaction;

        alert('Token Minted!');
      } catch (error) {
        console.error("Error minting token: ", error);
        alert("Error minting token");
      }
    } else {
      alert('Ethereum not detected! Please install and setup MetaMask.');
    }
  };

  return (
    <div>
      <h2>Mint Your NFT</h2>
      <input
        type="text"
        placeholder="Token URI"
        value={tokenURI}
        onChange={e => setTokenURI(e.target.value)}
      />
      <button onClick={mintToken}>Mint</button>
    </div>
  );
}

export default MintNFT;
