import { type Controller, type EmailValidator, type AddAccount, type HttpRequest, type HttpResponse } from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly _emailValidator: EmailValidator,
    private readonly _addAccount: AddAccount) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValidEmail = this._emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this._addAccount.add({ name, email, password })

      return await Promise.resolve(ok(account))
    } catch (error) {
      return serverError()
    }
  }
}
