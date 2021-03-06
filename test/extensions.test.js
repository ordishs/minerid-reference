const rewire = require('rewire')
const blockbind = rewire('../plugins/blockbind')

const { describe, it } = require('mocha')
const assert = require('assert')

describe('Extensions', function () {
  describe('Blockbind', function () {
    it('can create a Merkle root from coinbase1 and coinbase2 and no merkle branches', () => {
      const jobData = {
        coinbase1: '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1c03d3b6092f7376706f6f6c2e636f6d2f',
        coinbase2: 'ffffffff011a0a5325000000001976a9145deb9155942e7d38febc15de8870222fd24d080e88ac00000000',
        miningCandidate: {
          prevhash: '000000000000000002d9865865d4d7b9dea7f3d09cf0ad51082a91c5d5acbd47',
          merkleProof: []
        }
      }

      const addBlockBind = blockbind.__get__('addBlockBind')
      const extensions = {}
      addBlockBind({ extensions, jobData })

      const expectedRoot = '6cbb34f7965514786ed041e021f447d228bb2a24531e225da1450b0ebbcf01bf'
      assert.strict.equal(extensions.blockbind.modifiedMerkleRoot, expectedRoot)
    })

    it('can create a Merkle root from coinbase1 and coinbase2 and 2 Merkle branches', () => {
      const jobData = {
        coinbase1: '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1c03d3b6092f7376706f6f6c2e636f6d2f',
        coinbase2: 'ffffffff011a0a5325000000001976a9145deb9155942e7d38febc15de8870222fd24d080e88ac00000000',
        miningCandidate: {
          prevhash: '000000000000000002d9865865d4d7b9dea7f3d09cf0ad51082a91c5d5acbd47',
          merkleProof: [
            'd4298cf4e2199228af168ad6a998e5bd656cdc7776b8151c37066983b6367a45',
            '887ed2c1fcabb86c70fbfdf2bed3fe8760448ca3cac10ed203e67225505fc750'
          ]
        }
      }

      const addBlockBind = blockbind.__get__('addBlockBind')
      const extensions = {}
      addBlockBind({ extensions, jobData })

      const expectedRoot = '7aeea7a526c87d4dc4c56634bcaf19d7cdd1cdeb7f37db0cf8402b94f69462cd'
      assert.strict.equal(extensions.blockbind.modifiedMerkleRoot, expectedRoot)
    })

    it('can create a Merkle root from coinbase hash and 5 Merkle branches', () => {
      const expectedRoot = '4613bbcb10e2d0192bc2f226baf2a973842bdb47053ecca90d8d4540ec5ec4c0'

      const coinbaseHash = '66140d22ba975c50f7383618a4ac7ca5dab919ae4e43f88b0ee79b7cbcccb25a'
      const merkleBranches = [ // merkleProof in getminingcandidate BitCoin RPC call
        // see: https://github.com/bitcoin-sv-specs/protocol/blob/master/rpc/GetMiningCandidate.md
        '801fc07c69466a2216c55c185b69138fd98eb640abced94114868eada3adf180',
        'c1d8cec3243f0c689bc48545cf843e59c1efc859811024587defb9948fd76c18',
        'ffa3bf57d06df2dcf4158245b94f1211ea6b7e07690a099a6efd794eb7dbd5c4',
        'b558ea838bbc69498b3556c8ff85a2cd197b7295c1bd798308be2be53e940928',
        'dc93ffd1aec55cb7e030d3c22bb176ab2e991181fdc38e1c242132bd42e90e58'
      ]

      const buildMerkleRootFromCoinbase = blockbind.__get__('buildMerkleRootFromCoinbase')
      const merkleRoot = buildMerkleRootFromCoinbase(coinbaseHash, merkleBranches)

      assert.strict.equal(merkleRoot, expectedRoot)
    })
  })
})
