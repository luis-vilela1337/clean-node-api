import { type Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed-value')
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
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
  })
})
