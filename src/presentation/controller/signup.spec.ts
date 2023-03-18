import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { type HttpRequest, type EmailValidator } from '../protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      throw new Error()
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  describe('Success tests', () => {
    test('Should call email validator with correct email', () => {
      const { sut, emailValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'valid-email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      sut.handle(httpRequest)

      expect(isValidSpy).toHaveBeenCalledWith('valid-email')
    })
  })

  describe('Failed tests', () => {
    test('Should return 400 if no name is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'valid-email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(400)
      // toBe compara os ponteiros e o toEqual apenas os valores
      expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'valid-name',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', () => {
      const { sut } = makeSut()
      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'valid-email',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no password is provided', () => {
      const { sut } = makeSut()
      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'valid-email',
          password: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('Should return 400 if invalid email is provided', () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'invalid-email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should return 400 if invalid email is provided', () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'invalid-email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should return 500 if EmailValidator throws', () => {
      const emailValidatorStub = makeEmailValidatorWithError()
      const sut = new SignUpController(emailValidatorStub)

      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'email-email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })
  })
})
