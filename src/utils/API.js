import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getAddress } from '../Wallet';

import { useEffect } from 'react';

const endpoint = 'http://localhost:9999'

export const getTotalVotes = async () => {
    const windowUrl = window.location.href;
    const electionId = (windowUrl.split('/')[3] == undefined || windowUrl.split('/')[3] == "") ? "latest" : windowUrl.split('/')[3];

    const url = `${endpoint}/vote/count/${electionId}`

    const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
        return data
    }

    return "error"
}

export const getCandidateVotes = async (candidateId) => {
    const url = `${endpoint}/vote/count-candidate/${candidateId}`

    const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
        return data
    }

    return "error"
}

export const getLatestCandidates = async () => {
    const windowUrl = window.location.href;
    const electionId = (windowUrl.split('/')[3] == undefined || 
    windowUrl.split('/')[3] == "") ? "latest" : windowUrl.split('/')[3];
    const url = `${endpoint}/election/${electionId}`
    const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
        return data
    }

    return "error"
}

export const VoteSubmitX = async body => {
    const url = `${endpoint}/vote/submit-vote`

    const options = {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }

    const response = await fetch(url, options);
    const data = await response.json();

    console.log(data)

    if (response.ok) {
        return data
    }

    return "error"
}