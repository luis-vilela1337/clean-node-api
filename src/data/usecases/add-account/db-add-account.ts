import { type AddAccount, type Encrypter, type AddAccountModel, type AccountModel, type AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly _encrypter: Encrypter,
    private readonly _addAccountRepository: AddAccountRepository) {
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this._encrypter.encrypt(accountData.password)
    await this._addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return await Promise.resolve({
      id: 'valid-id',
      name: 'valid-name',
      email: 'valid-email',
      password: 'valid-password'
    })
  }
}
