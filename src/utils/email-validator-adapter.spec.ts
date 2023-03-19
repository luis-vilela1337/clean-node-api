import { EmailValidatorAdapter } from './email-validator'

describe('EmailValidator Adapter', () => {
  describe('Success Tests', () => {})
  describe('Failed Tests', () => {
    test('Should return false if validator return false', async () => {
      const sut = new EmailValidatorAdapter()
      const isValid = sut.isValid('invalid_email@mail.com')

      expect(isValid).toBe(false)
    })
  })
})
