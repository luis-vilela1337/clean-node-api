import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  describe('Success Tests', () => {
    test('Should return true if validator return true', () => {
      const sut = new EmailValidatorAdapter()
      const isValid = sut.isValid('valid_email@mail.com')

      expect(isValid).toBe(true)
    })

    test('Should call validator with correct email', () => {
      const sut = new EmailValidatorAdapter()

      const isEmailSpy = jest.spyOn(validator, 'isEmail')
      sut.isValid('valid_email@mail.com')

      expect(isEmailSpy).toBeCalledWith('valid_email@mail.com')
    })
  })

  describe('Failed Tests', () => {
    test('Should return false if validator return false', () => {
      const sut = new EmailValidatorAdapter()

      jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

      const isValid = sut.isValid('invalid_email@email.com')

      expect(isValid).toBe(false)
    })
  })
})
