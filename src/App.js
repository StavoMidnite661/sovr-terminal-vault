import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import QRCode from 'react-qr-code';
import { VaultABI } from './contracts/VaultABI';
import QRDisplay from './components/QRDisplay';
import { formatDate, generateVerificationCode } from './utils/helpers';

const SOVR_VAULT_ADDRESS = process.env.REACT_APP_SOVR_VAULT_ADDRESS || '0xYourVaultAddress';

const App = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [vaultContract, setVaultContract] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      setWalletConnected(true);
      const vault = new ethers.Contract(SOVR_VAULT_ADDRESS, VaultABI, signer);
      setVaultContract(vault);
      const bal = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(bal));
    }
  };

  const depositToVault = async () => {
    if (!vaultContract) return;
    const tx = await vaultContract.deposit({ value: ethers.utils.parseEther('0.01') });
    await tx.wait();
    alert('Deposit complete!');
  };

  const samplePayload = {
    from: account,
    amount: '2000.00',
    currency: 'SOVR',
    date: formatDate(),
    verification: generateVerificationCode(),
  };

  return (
    <div className="app-container">
      <h1>SOVR Wallet 🔐</h1>
      {!walletConnected ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <>
          <p>Connected: {account}</p>
          <p>ETH Balance: {balance}</p>
          <button onClick={depositToVault}>Deposit 0.01 ETH to Vault</button>
          <h3>Trust Check</h3>
          <QRDisplay payload={samplePayload} />
          <h3>Signature</h3>
          <canvas width="300" height="100" style={{border: '1px solid #fff'}}></canvas>
          <h3>Admin Panel</h3>
          <p>More tools coming soon...</p>
        </>
      )}
    </div>
  );
};

export default App;
