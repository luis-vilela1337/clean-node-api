import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashad-value')
  }
}))

interface SutTypes {
  sut: BcryptAdapter
}

const salt = 12
const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(salt)
  return {
    sut
  }
}
describe('Bcrypt Adapter', () => {
  describe('Success tests', () => {
    test('Should call bcrypt with correct values', async () => {
      const { sut } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.encrypt('any-value')

      expect(hashSpy).toHaveBeenCalledWith('any-value', salt)
    })

    test('Should return a hash on success', async () => {
      const { sut } = makeSut()

      const response = await sut.encrypt('any-value')

      expect(response).toEqual('hashad-value')
    })
  })
  describe('Failed tests', () => {
    test('Should throws if Bcrypt throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash' as any).mockRejectedValueOnce(new Error())

      const promise = sut.encrypt('any-value')

      await expect(promise).rejects.toThrow()
    })
  })
})
