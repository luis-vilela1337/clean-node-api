import {
  type Encrypter, type AddAccountModel,
  type AccountModel,
  type AddAccountRepository
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed-value')
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount: AccountModel = {
        id: 'valid-id',
        name: 'valid-name',
        email: 'valid-email',
        password: 'hashed-value'
      }
      return await Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  describe('Success Tests', () => {
    test('Should call Encrypter with correct password', async () => {
      const { sut, encrypterStub } = makeSut()
      const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

      const accountData = {
        name: 'valid-name',
        email: 'valid-email',
        password: 'valid-password'
      }
      await sut.add(accountData)

      expect(encryptSpy).toHaveBeenCalledWith('valid-password')
    })

    test('Should call AddAccountRepository with correct values', async () => {
      const { sut, addAccountRepositoryStub } = makeSut()
      const addAccountRepositoryStubSpy = jest.spyOn(addAccountRepositoryStub, 'add')

      const accountData = {
        name: 'valid-name',
        email: 'valid-email',
        password: 'valid-password'
      }
      await sut.add(accountData)

      expect(addAccountRepositoryStubSpy).toHaveBeenCalledWith({
        name: 'valid-name',
        email: 'valid-email',
        password: 'hashed-value'
      })
    })
  })

  describe('Failed Tests', () => {
    test('shoudl throw if Encrypter throws', async () => {
      const { encrypterStub, sut } = makeSut()
      jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(Error())
      const accountData = {
        name: 'valid-name',
        email: 'valid-email',
        password: 'valid-password'
      }

      const promise = sut.add(accountData)
      await expect(promise).rejects.toThrow()
    })

    test('shoudl throw if AddAccountRepository throws', async () => {
      const { addAccountRepositoryStub, sut } = makeSut()
      jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(Error())
      const accountData = {
        name: 'valid-name',
        email: 'valid-email',
        password: 'valid-password'
      }

      const promise = sut.add(accountData)
      await expect(promise).rejects.toThrow()
    })
  })
})
