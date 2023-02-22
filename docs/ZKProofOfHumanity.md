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

### ZKPoH__AccountNotRegisteredInPoH

```solidity
error ZKPoH__AccountNotRegisteredInPoH()
```

### ZKPoH__NotRegisteredAccount

```solidity
error ZKPoH__NotRegisteredAccount()
```

### ZKPoH__AccountAlreadyMatch

```solidity
error ZKPoH__AccountAlreadyMatch()
```

### HumanProofVerified

```solidity
event HumanProofVerified(uint256 signal)
```

### HumanRegistered

```solidity
event HumanRegistered(uint256 identityCommitment, address account)
```

### HumanRemoved

```solidity
event HumanRemoved(uint256 identityCommitment, address account)
```

### semaphore

```solidity
contract ISemaphore semaphore
```

### poh

```solidity
contract IProofOfHumanity poh
```

### groupId

```solidity
uint256 groupId
```

### depth

```solidity
uint256 depth
```

### constructor

```solidity
constructor(address semaphoreAddress, address pohAddress, uint256 _groupId, uint256 _depth) public
```

### register

```solidity
function register(uint256 identityCommitment) external
```

### isRegistered

```solidity
function isRegistered(address account) public view returns (bool)
```

### isIdentity

```solidity
function isIdentity(address account) public view returns (bool)
```

### verifyProof

```solidity
function verifyProof(uint256 merkleTreeRoot, uint256 signal, uint256 nullifierHash, uint256 externalNullifier, uint256[8] proof) external
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
function verifyHumanity(uint256 merkleTreeRoot, uint256 signal, uint256 nullifierHash, uint256 externalNullifier, uint256[8] proof) external view returns (uint256)
```

_Verifies humanity and emits an event if the zero-knowledge proof is valid.
 Note that a double-signaling check is not included here, and should be carried by the caller.
 Also, verification of proofs created with old Merkle tree roots (expiraton time) is not included here._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| merkleTreeRoot | uint256 | Root of the Merkle tree. |
| signal | uint256 |  |
| nullifierHash | uint256 | Nullifier hash. |
| externalNullifier | uint256 |  |
| proof | uint256[8] | Zero-knowledge proof. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | currentMerkleTreeRoot |

### matchAccount

```solidity
function matchAccount(address account, uint256[] proofSiblings, uint8[] proofPathIndices) external
```

### mismatchedAccounts

```solidity
function mismatchedAccounts() external view returns (address[])
```

_Returns the mismachedAccounts between zkPoH and PoH_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | mismachedAccount mismached accounts between zkPoH and PoH |

### shrinkArray

```solidity
function shrinkArray(address[] array, uint256 newLength) internal pure returns (address[])
```

_shrink and array, newLenght should be less or equal than the array length_

