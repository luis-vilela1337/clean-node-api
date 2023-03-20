import { type Encrypter } from '../../data/usecases/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  constructor (private readonly _salt: number) {
  }

  async encrypt (value: string): Promise<string> {
    await bcrypt.hash(value, this._salt)
    return 'null'
  }
}
