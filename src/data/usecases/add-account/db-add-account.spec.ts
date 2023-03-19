import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  describe('Success Tests', () => {
    test('Should call Encrypter with correct password', async () => {
      class EncrypterStub {
        async encrypt (value: string): Promise<string> {
          return await Promise.resolve('hashed-value')
        }
      }

      const encrypterStub = new EncrypterStub()
      const sut = new DbAddAccount(encrypterStub)
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

  })
})
