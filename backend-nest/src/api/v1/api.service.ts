/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { makeString } from 'src/util/makeString';
const { cryptoWaitReady, decodeAddress, signatureVerify } = require('@polkadot/util-crypto');
const { u8aToHex } = require('@polkadot/util');

const isValidSignature = (signedMessage, signature, address) => {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);

  return signatureVerify(signedMessage, signature, hexPublicKey).isValid;
};

@Injectable({})
export class ApiService {
  constructor(
    private jwtTokenService: JwtService
  ) {}

  async signin(address: string, message: string, signature: string) {
    let isValid: boolean = false;
    try {
      await cryptoWaitReady();
      isValid = isValidSignature(
        message,
        signature,
        address
      );
    } catch (error) {
      console.log(error);
      return null;
    }
    return {
      access_token: this.jwtTokenService.sign({address})
    };
  }

  async signout() {
    
  }

  getSecretString() {
    return makeString();
  }

  async verifyJwt(token: string) {
    try {
      const result = this.jwtTokenService.verifyAsync(token);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
