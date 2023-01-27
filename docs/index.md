# Solidity API

## Feedback

### NewFeedback

```solidity
event NewFeedback(bytes32 feedback)
```

### NewGreeting

```solidity
event NewGreeting(bytes32 greeting)
```

### zKProofOfHumanity

```solidity
contract ZKProofOfHumanity zKProofOfHumanity
```

### externalNullifier

```solidity
uint256 externalNullifier
```

### constructor

```solidity
constructor(address zkPoHAddress) public
```

### sendFeedback

```solidity
function sendFeedback(bytes32 feedback, uint256 merkleTreeRoot, uint256 nullifierHash, uint256[8] proof) public
```

### greet

```solidity
function greet(bytes32 greeting, uint256 merkleTreeRoot, uint256 nullifierHash, uint256[8] proof) public
```

## ZKProofOfHumanity

ZKProofOfHumanity integrates ProofOfHumanity V1 with Semaphore to prove humanity without doxing.

_The ZKProofOfHumanity contract has a Sempahore group where PoH accounts may be added as members.
Semaphore verification proof is used to avoid double-signaling, also humanity could be verified without signal._

### ZKPoH__AccountAlreadyExists

```solidity
error ZKPoH__AccountAlreadyExists()
```

### ZKPoH__InvalidProofOfHumanity

```solidity
error ZKPoH__InvalidProofOfHumanity()
```

### HumanProofVerified

```solidity
event HumanProofVerified(uint256 signal)
```

### NewUser

```solidity
event NewUser(uint256 identityCommitment, address account)
```

### TREE_DEPTH

```solidity
uint256 TREE_DEPTH
```

### semaphore

```solidity
contract ISemaphore semaphore
```

### groupId

```solidity
uint256 groupId
```

### humans

```solidity
mapping(uint256 => address) humans
```

### constructor

```solidity
constructor(address semaphoreAddress, uint256 _groupId) public
```

### register

```solidity
function register(uint256 identityCommitment, address account) external
```

### verifyProof

```solidity
function verifyProof(uint256 merkleTreeRoot, uint256 signal, uint256 nullifierHash, uint256 externalNullifier, uint256[8] proof) public
```

_Saves the nullifier hash to avoid double signaling and emits an event
if the zero-knowledge proof is valid._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| merkleTreeRoot | uint256 |  |
| signal | uint256 |  |
| nullifierHash | uint256 |  |
| externalNullifier | uint256 |  |
| proof | uint256[8] |  |

### verifyHumanity

```solidity
function verifyHumanity(uint256 merkleTreeRoot, uint256 nullifierHash, uint256[8] proof) public
```

_Verifies humanity and emits an event if the zero-knowledge proof is valid._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| merkleTreeRoot | uint256 |  |
| nullifierHash | uint256 |  |
| proof | uint256[8] |  |

