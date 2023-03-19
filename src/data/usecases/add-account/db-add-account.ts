import { type AddAccount, type Encrypter, type AddAccountModel, type AccountModel } from './db-add-account-protocols'

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
