import { type AddAccount, type AddAccountModel } from '../../../domain/usecases/add-account/add-account'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { SignUpController } from './signup'
import { type EmailValidator, type AccountModel, type HttpRequest } from './signup-protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAcountStub
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAcount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve({
        id: 'valid-id',
        name: 'valid-name',
        email: 'valid-email',
        password: 'valid-password'
      })
    }
  }
  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAcountStub = makeAddAcount()
  const sut = new SignUpController(emailValidatorStub, addAcountStub)

  return {
    sut,
    emailValidatorStub,
    addAcountStub
  }
}

describe('SignUp Controller', () => {
  describe('Success tests', () => {
    test('Should call email validator with correct email', async () => {
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
      await sut.handle(httpRequest)

      expect(isValidSpy).toHaveBeenCalledWith('valid-email')
    })

    test('Should call AddAccount with correct values', async () => {
      const { sut, addAcountStub } = makeSut()
      const addSpy = jest.spyOn(addAcountStub, 'add')
      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'valid-email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      await sut.handle(httpRequest)

      expect(addSpy).toHaveBeenCalledWith({
        name: 'valid-name',
        email: 'valid-email',
        password: 'any_password'
      })
    })

    test('Should return 200 if valid data success', async () => {
      const { sut } = makeSut()

      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'valid-email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse).toEqual({
        body: {
          id: 'valid-id',
          name: 'valid-name',
          email: 'valid-email',
          password: 'valid-password'
        },
        statusCode: 200
      }
      )
    })
  })

  describe('Failed tests', () => {
    test('Should return 400 if no name is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'valid-email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(400)
      // toBe compara os ponteiros e o toEqual apenas os valores
      expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          name: 'valid-name',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no passwordConfirmation is provided', async () => {
      const { sut } = makeSut()
      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'valid-email',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no passwordConfirmation is fails', async () => {
      const { sut } = makeSut()
      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'valid-email',
          password: 'any_password',
          passwordConfirmation: 'invalid_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })

    test('Should return 400 if no password is provided', async () => {
      const { sut } = makeSut()
      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'valid-email',
          password: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('Should return 400 if invalid email is provided', async () => {
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
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should return 500 if EmailValidator throws', async () => {
      const { emailValidatorStub, sut } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })
      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'email-email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 500 if addAccount throws', async () => {
      const { addAcountStub, sut } = makeSut()
      jest.spyOn(addAcountStub, 'add').mockImplementationOnce(async () => {
        return await Promise.reject(new Error())
      })
      const httpRequest: HttpRequest = {
        body: {
          name: 'valid-name',
          email: 'email-email',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })
  })
})
