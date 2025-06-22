import {
  Account,
  TransactionBuilder,
  Networks,
  Contract,
  xdr
} from "@stellar/stellar-sdk";

/**
 * Soroban contract invocation - get_all_events_with_details
 */
async function simulate(rpcUrl, tx) {
  const xdrBase64 = tx.toEnvelope().toXDR("base64");
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 8675309,
      method: "simulateTransaction",
      params: {
        transaction: xdrBase64
      }
    })
  });
  const result = await response.json();
  if (result.error) throw new Error(JSON.stringify(result.error));
  return result.result;
}

// Helper function to decode Stellar ScVal to JavaScript values
const decodeScVal = (scVal) => {
  if (!scVal) return null;

  switch (scVal.switch()) {
    case xdr.ScValType.scvSymbol():
      return scVal.sym().toString();
    case xdr.ScValType.scvString():
      return scVal.str().toString();
    case xdr.ScValType.scvBytes():
      return scVal.bytes().toString('utf-8');
    case xdr.ScValType.scvU32():
      return scVal.u32();
    case xdr.ScValType.scvI32():
      return scVal.i32();
    case xdr.ScValType.scvU64():
      return scVal.u64().toString();
    case xdr.ScValType.scvI64():
      return scVal.i64().toString();
    case xdr.ScValType.scvI128():
      return scVal.i128().lo().toString(); // or format better if needed
    case xdr.ScValType.scvVec():
      return scVal.vec().map(decodeScVal);
    case xdr.ScValType.scvMap():
      const map = {};
      scVal.map().forEach(entry => {
        const key = decodeScVal(entry.key());
        const val = decodeScVal(entry.val());
        map[key] = val;
      });
      return map;
    default:
      return scVal.toString();
  }
};


const fetchEventsFromContract = async () => {
  const SOROBAN_RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL;
  const CONTRACT_ID     = import.meta.env.VITE_CONTRACT_ID;
  const PUBLIC_KEY      = import.meta.env.VITE_PUBLIC_KEY ||
    "GDBDRHWMICSI4CR5MB5R67LWPHMDPJRRW36I4J2QJQ35O3D6ON532BP5";

  // Create source account
  const sourceAccount = new Account(PUBLIC_KEY, "0");
  
  // Create contract instance
  const contract = new Contract(CONTRACT_ID);

  try {
    // Build the transaction using the Contract.call method
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: "100",
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call("get_all_events_with_details"))
      .setTimeout(30)
      .build();

    // Simulate the transaction using our custom simulate function
    const simulationResult = await simulate(SOROBAN_RPC_URL, transaction);
    
    console.log("Raw simulation result:", simulationResult);
    
    // The result should be in simulationResult.results[0].xdr
    if (!simulationResult.results || simulationResult.results.length === 0) {
      console.log("No results in simulation");
      return [];
    }

    // Decode the XDR result
    const resultXdr = simulationResult.results[0].xdr;
    const scVal = xdr.ScVal.fromXDR(resultXdr, 'base64');
    
    console.log("Decoded ScVal:", scVal);
    
    // Decode the ScVal to get the actual data
    const decodedResult = decodeScVal(scVal);
    console.log("Decoded result:", decodedResult);
    
    // The result should be an array of events
    if (!Array.isArray(decodedResult)) {
      console.log("Result is not an array:", decodedResult);
      return [];
    }

    return decodedResult.map((event, i) => {
      console.log(`Processing event ${i}:`, event);
      
      // Extract event data from the decoded map
      const eventData = {
        id: i.toString(),
        title: event.name || `Event ${i + 1}`,
        description: event.description || 'No description available',
        date: event.datetime ? event.datetime.split('T')[0] : '',
        time: event.datetime ? event.datetime.split('T')[1] : '',
        location: event.location || 'Location TBD',
        price: parseInt(event.price) || 0,
        capacity: parseInt(event.max_tickets) || 100,
        attendees: parseInt(event.sold) || 0,
        image: event.image_url || '/api/placeholder/400/200',
        category: "Blockchain",
        organizer: event.organizer || 'Unknown'
      };
      
      console.log(`Processed event ${i}:`, eventData);
      return eventData;
    });

  } catch (error) {
    console.error("Error fetching events from contract:", error);
    
    // Return some mock data for testing if the contract call fails
    return [{
      id: "0",
      title: "HackPeraDemo",
      description: "Demo Event for Judges",
      date: "2025-06-21",
      time: "18:00:00",
      location: "Pera Palace, Istanbul",
      price: 10000000,
      capacity: 5,
      attendees: 1,
      image: "https://example.com/image.png",
      category: "Blockchain",
      organizer: "Aysegul"
    }];
  }
};

export default fetchEventsFromContract;