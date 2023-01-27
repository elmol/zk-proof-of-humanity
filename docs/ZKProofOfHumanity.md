# Solidity API

## ZKProofOfHumanity

ZKProofOfHumanity integrates ProofOfHumanity V1 with Semaphore to prove humanity without doxing.

_The ZKProofOfHumanity contract has a Semaphore group where PoH accounts may be added as members.
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
| merkleTreeRoot | uint256 | Root of the Merkle tree. |
| signal | uint256 | Semaphore signal. |
| nullifierHash | uint256 | Nullifier hash. |
| externalNullifier | uint256 | External nullifier. |
| proof | uint256[8] | Zero-knowledge proof. |

### verifyHumanity

```solidity
function verifyHumanity(uint256 merkleTreeRoot, uint256 nullifierHash, uint256[8] proof) public
```

_Verifies humanity and emits an event if the zero-knowledge proof is valid._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| merkleTreeRoot | uint256 | Root of the Merkle tree. |
| nullifierHash | uint256 | Nullifier hash. |
| proof | uint256[8] | Zero-knowledge proof. |

