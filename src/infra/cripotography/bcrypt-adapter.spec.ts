import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const salt = 12
const makeSut = () => {

}
describe('Bcrypt Adapter', () => {
  describe('Success tests', () => {
    test('Should call bcrypt with correct values', async () => {
      const sut = new BcryptAdapter(salt)
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.encrypt('any-value')

      expect(hashSpy).toHaveBeenCalledWith('any-value', salt)
    })
  })
  describe('Failed tests', () => {})
})
