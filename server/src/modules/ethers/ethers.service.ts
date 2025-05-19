import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ethers,
  zeroPadValue,
  encodeBytes32String,
  isBytesLike,
  toUtf8Bytes,
  parseEther,
  LogDescription,
  formatEther,
} from "ethers";
import { abi, address } from "../../../abis/SolidityConcepts.json";

@Injectable()
export class EthersService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>("RPC_URL");
    const privateKey = this.configService.get<string>("PRIVATE_KEY");

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey!, this.provider);
    this.contract = new ethers.Contract(address, abi, this.signer);
  }

  zeroPadValue32(data: string) {
    return zeroPadValue(data, 32);
  }

  encodeBytes32String(data: string) {
    return encodeBytes32String(data);
  }

  isBytesLike(data: string) {
    return isBytesLike(data);
  }

  toUtf8Bytes(data: string) {
    return toUtf8Bytes(data);
  }

  parseEther(data: string) {
    return parseEther(data);
  }

  formatEther(data: bigint) {
    return formatEther(data);
  }

  // 위 코드는 지우지 마세요.

  async owner() {
    // Todo: owner의 값을 리턴합니다.
    return await this.contract.owner();
  }

  async fixedValue() {
    // Todo: FIXED_VALUE의 값을 리턴합니다.
    return await this.contract.FIXED_VALUE();
  }

  async value() {
    // Todo: value의 값을 리턴합니다.
    return await this.contract.value();
  }

  async checkValue(value: number) {
    // Todo: checkValue의 값을 리턴합니다.
    return await this.contract.checkValue(value);
  }

  async sumUpTo(value: number) {
    // Todo: sumUpTo의값을 리턴합니다.
    return await this.contract.sumUpTo(value);
  }

  async updateValue(value: number) {
    const result = {
      oldValue: 0,
      newValue: 0,
    };

    // Todo: updateValue의값을 리턴합니다.
    // ⚠️ ValueChanged 이벤트를 영수증안의 logs 에서 확인(contract.interface.parseLog(log))하여 객체를 리턴합니다.
    /*
      예시 - 리턴 객체
      {
        oldValue: 123,
        newValue: 1
      }
    */
    const tx = await this.contract.updateValue(value);
    const receipt = await tx.wait();

    const log = receipt.logs[0];
    const parsedLog = this.contract.interface.parseLog(log);
    result.oldValue = parsedLog?.args[0];
    result.newValue = parsedLog?.args[1];
    return result;
  }

  async ownerFunction() {
    // Todo: ownerFunction의값을 리턴합니다.
    return await this.contract.ownerFunction();
  }

  async sendEther(address: string, value: number) {
    // Todo: sendEther의값을 리턴합니다.
    // ⚠️ setter함수는 tx 확정 후 영수증을 리턴합니다.(wait)
    const tx = await this.contract.sendEther(address, value);
    return tx.wait();
  }

  async getContractBalance() {
    // Todo: getContractBalance의 값을 리턴합니다.
    // ⚠️ 리턴은 ether 단위로 리턴합니다.(wei => ether)

    console.log(abi.find((item) => item.name === "getContractBalance"));
    console.log("res ghdfgdfg");

    const res = await this.contract.getContractBalance();
    console.log("res", res);
    return formatEther(res);

    const balance = await this.provider.getBalance(this.contract.target);
    return formatEther(balance);
  }

  async deposit(value: number) {
    // Todo: Contract에 코인을 전송합니다.
    // ⚠️ tx 확정 후 영수증을 리턴합니다.(wait)
    const tx = await this.signer.sendTransaction({
      to: this.contract.target,
      value: parseEther(value.toString()),
    });
    return tx.wait();
  }

  async withDraw() {
    // Todo: withDraw의값을 리턴합니다.
    // ⚠️ setter함수는 tx 확정 후 영수증을 리턴합니다.(wait)
    const tx = await this.contract.withDraw();
    return tx.wait();
  }
}
