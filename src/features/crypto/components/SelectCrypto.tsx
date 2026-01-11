
import React, { useEffect } from "react";
import useState from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export function SelectCrypto({ currentCrypto, setCurrentCrypto, cryptoData }: { currentCrypto: string; setCurrentCrypto: (crypto: string) => void, cryptoData : any }) {
  useEffect(() => {
    console.log("CRYPTO: ", cryptoData)
  })
  return ( 
    <Select value={currentCrypto} onValueChange={setCurrentCrypto}>
      <SelectTrigger className="ml-4 w-[180px]">
        <SelectValue placeholder="Select Crypto" />
      </SelectTrigger>
      <SelectContent searchable searchPlaceholder="Search crypto...">
        {cryptoData?.map((crypto : any) => (
          <SelectItem key={crypto.id} value={crypto} textValue={crypto.id}>
            {
            
            <div className="flex items-center gap-3">
              <img src={crypto.image} width="24px"/>
              {crypto.name}
            </div>
            }
            </SelectItem>
        ))}


      </SelectContent>
    </Select>
  );

}