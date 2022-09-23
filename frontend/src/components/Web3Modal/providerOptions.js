import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import UAuthSPA from '@uauth/js'
import * as UAuthWeb3Modal from '@uauth/web3modal'

const uauthOptions = {
  clientID: process.env.REACT_APP_CLIENT_ID,
  redirectUri: process.env.REACT_APP_REDIRECT_URI,
  scope: 'openid wallet',
}

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
    rpc: {
        80001: 'https://matic-mumbai.chainstacklabs.com"',
          },
      appName: "Web 3 Modal Demo", // Required
    }
  },
  walletconnect: {
    package: WalletConnect, // required
    options: {

        rpc: {
        80001: 'https://matic-mumbai.chainstacklabs.com"',
              },
              appName: "Web 3 Modal Demo", // Required
    },
  },
  'custom-uauth': {
    display: UAuthWeb3Modal.display,
    connector: UAuthWeb3Modal.connector,
    package: UAuthSPA,
    options: uauthOptions,
  }
};
