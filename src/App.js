import logo from "./logo.svg";
import "./App.css";

import { getTotalVotes, getLatestCandidates, VoteSubmitX, getCandidateVotes } from "./utils/API";
import bs58 from 'bs58';
import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { sign } from 'tweetnacl';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
function VoteCount() {
  try {
    const voteCount = ~~parseInt(getTotalVotes());
    if (voteCount < 1) {
      return (
        <div>
          <p className="text-xl text-gray-300 text-center mt-8">No Votes</p>
        </div>
      );
    } else {
      return (
        <div>
          <p className="text-xl text-gray-300 text-center mt-8">
            {voteCount} votes
          </p>
        </div>
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function VoteCards() {
  const { publicKey, signMessage } = useWallet();

  const VoteSubmit = async (e, c) => {
    const yourPublicKey = publicKey.toBase58()
    try {
      const message = new TextEncoder().encode('Crypto rocks!')
      const signature = await signMessage(message)

      if (!sign.detached.verify(message, signature, publicKey.toBytes()))
        throw new Error('Invalid signature!')
        const res = await VoteSubmitX({
          candidate_id: c._id,
          election_id: e._id,
          voter_address: yourPublicKey,
          voter_signature: bs58.encode(signature),
        })
      console.log("request done")
      //MySwal.fire({ title: "Voted", text: `You have successfully voted for ${c}`, icon: 'success' })
    } catch (e) {
      console.log(e)
    }
  }

  const [elections, setCandidates] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(async () => {
    const elections = await getLatestCandidates();

    if (elections) {
      setCandidates(elections)
      setTotalVotes(100)
    }
  }, [])

  if(elections.length < 1) {
    return (
      <div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          No Election Data FETCHED
          </div>
      </div>
    )
  } else {
    let electionCandidates = elections.candidates;
    let totalVoteCount = 0;
    let electionCandidateVotes = {};

    for(let i = 0; i < electionCandidates.length; i++) {
      totalVoteCount += electionCandidates[i].vote_count;
    }

    return (
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {electionCandidates.map((candidate, i) => 
          <div key={i}>
            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6 mt-4 hover:bg-sky-700" key={candidate.name}>
              <dt className="text-sm font-medium text-gray-500 truncate">{candidate.name}</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{electionCandidateVotes[candidate._id]}</dd>
              <dd className="mt-1 text-2xl font-normal text-gray-700">{((candidate.vote_count/totalVoteCount) * 100).toString()}</dd>
              <div className="mt-4 flex justify-right items-right"><button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={() => VoteSubmit(elections,candidate)}>
                VOTE
              </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const App = () => {
  const { publicKey } = useWallet();
  document.body.style.background = "#111827";

  const [voteCount, setVoteCount] = useState(0)

  useEffect(async () => {
    const vc = await getTotalVotes()

    if (vc == 'error')
      setVoteCount("Fetching failed")
    else
      setVoteCount(`${vc.count} votes`)
  }, [])

  return (
    <div id="root">
      <div className="bg-white">
        <div className="bg-gray-900">
          <div className="pt-12 sm:pt-16 lg:pt-24">
            <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center items-center flex-col max-w-3xl mx-auto space-y-2 lg:max-w-none">
                <p className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">Piggy Gang DAO Voting.</p>
                <img src="https://cdn.piggygang.com/web/imgs/mLypZVSM_400x400.jpeg" alt="" className="rounded-3xl"
                  width="160" height="160"></img>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-8">
            <div className="mt-6 rounded-md ">
              {!publicKey ? <WalletMultiButton /> :
                <>
                  <WalletDisconnectButton />
                  <p className="text-xl text-gray-300 text-center mt-2">{publicKey.toBase58().substr(0, 5)}...{publicKey.toBase58().substr(-5)}</p>
                </>}
            </div>
          </div>
          <div className="flex justify-center items-center mt-8 flex-col"></div>
          <p className="text-xl text-gray-300 text-center mt-8">{voteCount}</p>
          <div className="mt-8 pb-12 bg-gray-50 sm:pb-16 lg:pb-24">
            <div className="relative">
              <div className="absolute inset-0 h-3/4 bg-gray-900"></div>
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <dl className="">
                  <VoteCards />
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-live="assertive"
        className="z-50 fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start flex-col-reverse">
      </div>
    </div>
  );
}

export default App;
