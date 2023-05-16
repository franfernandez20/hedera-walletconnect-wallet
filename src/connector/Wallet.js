import {WalletConnector} from '@hashgraph/hedera-wallet-connect'
import {useState, useEffect, useRef} from 'react'
import Signer from './Signer'
import {getSubFungibleTokens} from '../hgraph/hgraph-sub'

// FILL THIS WITH YOUR ACCOUNT ID AND OPERATOR KEY
const accountId = '0.0.3541877'
const operatorKey =
  '302e020100300506032b65700422042015fa59d5970c0307bca3807ceb6d10cdd6ba30cc502219fc72c6de9b7a319d85'
const network = 'testnet'

const walletMetadata = {
  name: 'Wallet',
  description: 'Hedera Wallet connect example',
  icon: 'https://avatars.githubusercontent.com/u/37784886',
}

const connector = new WalletConnector(walletMetadata)
async function init() {
  await connector.init(async (proposal) => {
    console.log('Session proposal !!', proposal)
    const {id, params} = proposal
    const {requiredNamespaces, relays} = params

    if (!requiredNamespaces.hedera) throw new Error('Only Hedera chain is supported')

    const signer = new Signer(accountId, operatorKey, network)

    const accounts = [`hedera:296:${accountId}`]
    const namespaces = {
      hedera: {
        accounts,
        methods: requiredNamespaces.hedera.methods,
        events: requiredNamespaces.hedera.events,
      },
    }

    const approveResponse = await connector.approveSessionProposal(
      {
        id,
        namespaces,
        relayProtocol: relays[0].protocol,
      },
      [signer]
    )

    console.log('Session approved: ', approveResponse)
  })
}

function Wallet() {
  const [paringString, setParingString] = useState('')
  const unSubPromise = useRef(new Promise(() => {}))
  const [fungibleTokens, setFungibleTokens] = useState([])

  useEffect(() => {
    console.log('effect')
    init()
  }, [])

  const handlePair = async () => {
    console.log(paringString)
    const pairResponse = await connector.pair(paringString)
    console.log('Pair RESPONSE: ', pairResponse)
  }

  const handleSub = () => {
    unSubPromise.current = getSubFungibleTokens(setFungibleTokens, accountId)
  }

  const handleUnSub = async () => {
    const unSubFunction = await unSubPromise.current
    console.log(await unSubFunction)
    unSubFunction()
  }
  const handleLog = async () => {
    console.log('fungibleTokens: ', fungibleTokens)
  }

  return (
    <div>
      <div>
        <button onClick={() => handlePair()}> - Pair - </button>
        <input
          type='text'
          onChange={(e) => setParingString(e.target.value)}
          value={paringString}
        />
      </div>
      <hr></hr>
      <div>
        <button onClick={() => handleSub()}> - Create Subscription - </button>
        <br></br>
        <button onClick={() => handleUnSub()}> - Delete Subscription - </button>
        <br></br>
        <button onClick={() => handleLog()}> - Log FTs - </button>
      </div>
    </div>
  )
}

export default Wallet
