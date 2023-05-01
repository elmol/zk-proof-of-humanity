<p align="center">
    <h1 align="center">
         🎭 ZK Proof of Humanity Widget
    </h1>
</p>

<p style="text-align:center;">
A react library to easily integrate your projects with <b>ZK Proof of Humanity</b> 
</p>

## 🛠 Installation
### npm or yarn

Install the `zkpoh-widget` package with npm:

```bash
npm i zkpoh-widget
```

or yarn:

```bash
yarn add zkpoh-widget
```
## 📜 Usage

### 💡 Use cases of ZKPoHConnect React component

It could be used to cast LIKE signals to a Post
```html
...
<ZKPoHConnect signal={'LIKE'} externalNullifier={postId}>Like</ZKPoHConnect>
...
```
Or to give feedback

```html
...
<ZKPoHConnect signal={feedback} externalNullifier={postId}>Feedback</ZKPoHConnect>
...
```

Or to vote

```html
...
<ZKPoHConnect signal={ballot} externalNullifier={proposalId}>Vote</ZKPoHConnect>
...
```

Or just to prove that you are human.

```html
...
<ZKPoHConnect signal={"I'm human"} externalNullifier={verificationCode}>Prove</ZKPoHConnect>
...
```

## 📚 Prerequisites

`<ZKPoHConnect\>` react component uses [wagmi.sh](https://wagmi.sh/) as its connection provider to interact with the blockchain and [Chakra UI](https://chakra-ui.com/) for its UI components.

The following dependencies are needed:

```
"@semaphore-protocol/data": "3.7.0",
"@semaphore-protocol/group": "3.7.0",
"@semaphore-protocol/identity": "3.7.0",
"@semaphore-protocol/proof": "3.7.0",
"react": "18.2.0",
"react-dom": "18.2.0",
"react-no-ssr": "^1.1.0",
"wagmi": "0.12.1",
"@chakra-ui/react": "^2.5.1",
"@emotion/react": "^11.10.6",
"@emotion/styled": "^11.10.6"
```
### Caveat: fs config

fs configuration is required. `next.config.js` file should be updated to include fs configuration.

example:

```typescript
/** @type {import('next').NextConfig} */
const fs = require("fs")

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
        config.resolve.fallback = {
            fs: false
        }
    }

    return config
  }
}

module.exports = nextConfig

```

## ⚙️ Configuration
### Initial configuration

A [wagmi.sh](https://wagmi.sh/) config should be provider to use `<ZKPoHConnect\>` 

For example: 

```typescript
const { chains, provider } = configureChains([goerli, localhost], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
});

export default function Home() {
  return (
    <>
        <WagmiConfig client={client}>

             <ZKPoHConnect signal={'LIKE'} externalNullifier={postId}>Like</ZKPoHConnect>
        
        </WagmiConfig>
    </>
  );
}

```

###  ZKPoHConnect properties

```
export interface ZKPoHConnectProps  {
  externalNullifier: BigNumber | undefined,
  signal: string,
  children: ReactNode,
  theme?: Dict | undefined,
  confirmationMessage?: string,
  helpText?: string,
  contractAddress?:`0x${string}` | undefined;
  onChangeState?: (state: ConnectionState) => void,
  onLog?: (state: ButtonActionState) => void,
};
```

`externalNullifier` ans `signal` are required parameters, also the children of the tag. 


### Chakra UI theme configuration

It's possible to configure a [Chakra UI](https://chakra-ui.com/) theme

```html
...
<ZKPoHConnect theme:{theme} signal={'LIKE'} externalNullifier={postId}>Like</ZKPoHConnect>
...
```

### Customized messages

You can customize the `helpText` used on the 'prove' action, as well as the `confirmationMessage` that is displayed when the signal casting is complete

```
  confirmationMessage?: string,
  helpText?: string,
```
### custom contract address

It is possible to define a custom contract address for the zk proof of humanity by setting the `contractAddress` property. By default, it is set to the deployment on goerli.

### Callbacks

If you want to receive updates on the state of the buttons or view logs of the actions being performed, you can configure the `onChangeState` and `onLog` callbacks. By passing these callbacks as props to the <ZKPoHConnect> component, you can get real-time updates on the state of the component and the actions being performed.
