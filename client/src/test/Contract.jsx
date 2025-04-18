import React from "react";
import { useEffect, useState } from "react";
import { getContract } from "../contracts/contract";

const Contract = () => {
  const [contract, setContract] = useState(null);
  useEffect(() => {
    const fetchContract = async () => {
      try {
        const data = await getContract();
        setContract(data);
      } catch (error) {
        console.error("Error fetching contract:", error);
      }
    };

    fetchContract();
  }, []);

  console.log(contract);

  return <div>Contract</div>;
};

export default Contract;
