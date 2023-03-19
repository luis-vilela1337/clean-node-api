import { type AccountModel } from '../../../domain/models/account'
import { type AddAccountModel, type AddAccount } from '../../../domain/usecases/add-account/add-account'
import { type Encrypter } from '../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor (private readonly _encrypter: Encrypter) {
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const response = await this._encrypter.encrypt(account.password)
    return await Promise.resolve({
      id: 'valid-id',
      name: 'valid-name',
      email: 'valid-email',
      password: 'valid-password'
    })
  }
}
