
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import type { CryptoBasicDto } from "../contracts/cryptoBasic.dto";

export function SelectCrypto({ currentCrypto, setCurrentCrypto, cryptoData }: { 
  currentCrypto: CryptoBasicDto | null; 
  setCurrentCrypto: (crypto: CryptoBasicDto) => void;
  cryptoData: CryptoBasicDto[];
}) {
  const handleValueChange = (id: string) => {
    const crypto = cryptoData.find(c => c.id === id);
    if (crypto) setCurrentCrypto(crypto);
  };

  return ( 
    <Select value={currentCrypto?.id} onValueChange={handleValueChange}>
      <SelectTrigger className="ml-4 w-[180px]">
        <SelectValue placeholder="Select Crypto" />
      </SelectTrigger>
      <SelectContent searchable searchPlaceholder="Search crypto...">
        {cryptoData && cryptoData.map((crypto) => (
          <SelectItem key={crypto.id} value={crypto.id} textValue={crypto.id}>
            <div className="flex items-center gap-3">
              <img src={crypto.image} width="24px" alt={crypto.name}/>
              {crypto.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}